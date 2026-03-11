import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { supabase } from '../lib/supabase';

// Encryption key (In production, this should be handled more securely)
const ENCRYPTION_KEY = import.meta.env.VITE_CHAT_ENCRYPTION_KEY || 'bitnexus-secure-vault-2024';

const encryptMessage = (text: string) => {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

const decryptMessage = (ciphertext: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText || '[Decryption Failed]';
  } catch (e) {
    return '[Encrypted Message]';
  }
};

export interface Ticket {
  id: string;
  customer_id: string;
  customer_name: string;
  service: string;
  status: string;
  priority: string;
  technician_id: string | null;
  technician_name?: string | null;
  date: string;
  description: string;
  amount: number;
  paymentRef?: string;
}

export interface Technician {
  id: string;
  name: string;
  status: string;
  load: number;
  specialty: string;
  phone?: string;
}

export interface Transaction {
  id: string;
  ticket_id: string;
  amount: number;
  status: 'pending' | 'escrow' | 'paid' | 'failed';
  type: 'payment' | 'payout';
  reference: string;
  created_at: string;
}

export interface Message {
  id: string;
  ticket_id: string;
  sender_id: string;
  text: string;
  created_at: string;
}

interface RealtimeContextType {
  tickets: Ticket[];
  technicians: Technician[];
  transactions: Transaction[];
  messages: Message[];
  currentUser: any;
  wallet: { balance: number; currency: string } | null;
  createTicket: (data: Partial<Ticket>) => void;
  updateTicket: (id: string, data: Partial<Ticket>) => void;
  createTechnician: (data: Partial<Technician>) => void;
  updateTechnician: (id: string, data: Partial<Technician>) => void;
  deleteTechnician: (id: string) => void;
  sendMessage: (ticketId: string, senderId: string, text: string) => void;
  endChatSession: (ticketId: string) => void;
  recordPayment: (ticketId: string, amount: number, reference: string) => void;
  isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider = ({ children }: { children: ReactNode }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [wallet, setWallet] = useState<{ balance: number; currency: string } | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const fetchWallet = async (userId: string) => {
    try {
      const res = await axios.get(`/api/wallet/${userId}`);
      setWallet(res.data);
    } catch (err) {
      console.error("Wallet fetch error", err);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Set user immediately from metadata for faster UI response
        setCurrentUser({ ...user, ...user.user_metadata });
        fetchWallet(user.id);
        
        // Then fetch full profile in background
        supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data: profile }) => {
          if (profile) setCurrentUser(profile);
        });
      } else {
        // Check local storage for mock user (WhatsApp)
        const savedUser = localStorage.getItem('bitnexus_user');
        if (savedUser) {
          const u = JSON.parse(savedUser);
          setCurrentUser(u);
          fetchWallet(u.id);
        }
      }
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Set user immediately from metadata
        setCurrentUser({ ...session.user, ...session.user.user_metadata });
        fetchWallet(session.user.id);
        
        // Then fetch full profile
        supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data: profile }) => {
          if (profile) setCurrentUser(profile);
        });
      } else {
        setCurrentUser(null);
        setWallet(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setTickets([]);
      setTechnicians([]);
      setTransactions([]);
      setMessages([]);
      return;
    }

    // Initial Fetch
    const fetchData = async () => {
      try {
        const ticketQuery = supabase.from('tickets').select('*').order('created_at', { ascending: false });
        
        // Visibility Logic
        if (currentUser.role === 'customer') {
          ticketQuery.eq('customer_id', currentUser.id);
        } else if (currentUser.role === 'worker') {
          ticketQuery.eq('technician_id', currentUser.id);
        }

        // Parallelize initial core data fetch
        const [ticketsRes, techsRes] = await Promise.all([
          ticketQuery,
          supabase.from('technicians').select('*')
        ]);

        const t = ticketsRes.data;
        const tech = techsRes.data;

        if (t) setTickets(t);
        if (tech) setTechnicians(tech);

        // Fetch dependent data (transactions and messages) in parallel
        const txQuery = supabase.from('transactions').select('*').order('created_at', { ascending: false });
        const msgQuery = supabase.from('messages').select('*').order('created_at', { ascending: true });

        if (currentUser.role !== 'admin') {
          if (t && t.length > 0) {
            const ticketIds = t.map(tk => tk.id);
            txQuery.in('ticket_id', ticketIds);
            msgQuery.in('ticket_id', ticketIds);
          } else {
            setTransactions([]);
            setMessages([]);
            return;
          }
        }

        const [txRes, msgRes] = await Promise.all([txQuery, msgQuery]);

        if (txRes.data) setTransactions(txRes.data);
        if (msgRes.data) {
          setMessages(msgRes.data.map(m => ({ ...m, text: decryptMessage(m.text) })));
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
      }
    };

    fetchData();

    // Supabase Realtime Subscriptions
    const ticketsChannel = supabase
      .channel('tickets-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, (payload) => {
        const ticket = payload.new as Ticket;
        // Client-side visibility check
        const isVisible = currentUser.role === 'admin' || 
                          (currentUser.role === 'customer' && ticket.customer_id === currentUser.id) ||
                          (currentUser.role === 'worker' && ticket.technician_id === currentUser.id);

        if (!isVisible) return;

        if (payload.eventType === 'INSERT') setTickets(prev => [ticket, ...prev]);
        if (payload.eventType === 'UPDATE') setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, ...ticket } : t));
        if (payload.eventType === 'DELETE') setTickets(prev => prev.filter(t => t.id !== payload.old.id));
      })
      .subscribe();

    const techniciansChannel = supabase
      .channel('technicians-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'technicians' }, (payload) => {
        if (payload.eventType === 'INSERT') setTechnicians(prev => [...prev, payload.new as Technician]);
        if (payload.eventType === 'UPDATE') setTechnicians(prev => prev.map(t => t.id === payload.new.id ? { ...t, ...payload.new } : t));
        if (payload.eventType === 'DELETE') setTechnicians(prev => prev.filter(t => t.id !== payload.old.id));
      })
      .subscribe();

    const transactionsChannel = supabase
      .channel('transactions-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
        const tx = payload.new as Transaction;
        // Visibility check: does this tx belong to a ticket the user can see?
        const canSeeTx = currentUser.role === 'admin' || tickets.some(t => t.id === tx.ticket_id);
        if (canSeeTx && payload.eventType === 'INSERT') setTransactions(prev => [tx, ...prev]);
      })
      .subscribe();

    const messagesChannel = supabase
      .channel('messages-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMessage = payload.new as Message;
        // Visibility check
        const canSeeMsg = currentUser.role === 'admin' || tickets.some(t => t.id === newMessage.ticket_id);
        if (canSeeMsg) {
          setMessages(prev => [...prev, { ...newMessage, text: decryptMessage(newMessage.text) }]);
        }
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, (payload) => {
        setMessages(prev => prev.filter(m => m.id !== payload.old.id));
      })
      .subscribe();

    // Wallet Realtime
    const walletChannel = supabase
      .channel('wallet-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'wallets', filter: `user_id=eq.${currentUser.id}` }, (payload) => {
        setWallet(payload.new as any);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ticketsChannel);
      supabase.removeChannel(techniciansChannel);
      supabase.removeChannel(transactionsChannel);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(walletChannel);
    };
  }, [currentUser]); // Re-run when user changes

  const createTicket = async (data: Partial<Ticket>) => {
    if (!currentUser) return;
    const ticketData = {
      ...data,
      customer_id: currentUser.id,
      customer_name: currentUser.full_name || currentUser.email || 'Anonymous'
    };
    const response = await axios.post('/api/tickets', ticketData);
    
    // Store ticket ID in localStorage for guest access
    if (!currentUser) {
      const guestTickets = JSON.parse(localStorage.getItem('bitnexus_guest_tickets') || '[]');
      guestTickets.push(response.data.id);
      localStorage.setItem('bitnexus_guest_tickets', JSON.stringify(guestTickets));
    }
    if (currentUser?.role === 'customer' && wallet && wallet.balance >= (data.amount || 0)) {
      await axios.post('/api/wallet/deduct', {
        userId: currentUser.id,
        amount: data.amount,
        ticketId: response.data.id
      });
    }
  };

  const updateTicket = async (id: string, data: Partial<Ticket>) => {
    await axios.patch(`/api/tickets/${id}`, data);
  };

  const createTechnician = async (data: Partial<Technician>) => {
    await axios.post('/api/technicians', data);
  };

  const updateTechnician = async (id: string, data: Partial<Technician>) => {
    await axios.patch(`/api/technicians/${id}`, data);
  };

  const deleteTechnician = async (id: string) => {
    await axios.delete(`/api/technicians/${id}`);
  };

  const sendMessage = async (ticketId: string, senderId: string, text: string) => {
    const encryptedText = encryptMessage(text);
    await axios.post('/api/messages', { ticket_id: ticketId, sender_id: senderId, text: encryptedText });
  };

  const endChatSession = async (ticketId: string) => {
    await axios.delete(`/api/messages/session/${ticketId}`);
  };

  const recordPayment = async (ticketId: string, amount: number, reference: string) => {
    // This is now handled in the createTicket API if paymentRef is provided,
    // but keeping it for manual records if needed.
    await axios.post('/api/transactions', { ticket_id: ticketId, amount, reference, status: 'escrow', type: 'payment' });
  };

  return (
    <RealtimeContext.Provider value={{ 
      tickets, 
      technicians, 
      transactions,
      messages,
      currentUser,
      wallet,
      createTicket, 
      updateTicket, 
      createTechnician,
      updateTechnician, 
      deleteTechnician,
      sendMessage,
      endChatSession,
      recordPayment,
      isConnected 
    }}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) throw new Error('useRealtime must be used within a RealtimeProvider');
  return context;
};
