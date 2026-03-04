import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface Ticket {
  id: string;
  customer: string;
  service: string;
  status: string;
  priority: string;
  technician: string | null;
  date: string;
  description: string;
}

export interface Technician {
  id: string;
  name: string;
  status: string;
  load: number;
  specialty: string;
}

interface RealtimeContextType {
  tickets: Ticket[];
  technicians: Technician[];
  createTicket: (data: Partial<Ticket>) => void;
  updateTicket: (id: string, data: Partial<Ticket>) => void;
  createTechnician: (data: Partial<Technician>) => void;
  updateTechnician: (id: string, data: Partial<Technician>) => void;
  deleteTechnician: (id: string) => void;
  isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider = ({ children }: { children: ReactNode }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);

    ws.onopen = () => {
      console.log('Connected to realtime server');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      
      switch (type) {
        case 'init':
          setTickets(data.tickets);
          setTechnicians(data.technicians);
          break;
        case 'ticket:created':
          setTickets(prev => [data, ...prev]);
          break;
        case 'ticket:updated':
          setTickets(prev => prev.map(t => t.id === data.id ? { ...t, ...data } : t));
          break;
        case 'technician:created':
          setTechnicians(prev => [...prev, data]);
          break;
        case 'technician:updated':
          setTechnicians(prev => prev.map(tech => tech.id === data.id ? { ...tech, ...data } : tech));
          break;
        case 'technician:deleted':
          setTechnicians(prev => prev.filter(tech => tech.id !== data.id));
          break;
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from realtime server');
      setIsConnected(false);
    };

    setSocket(ws);

    return () => ws.close();
  }, []);

  const createTicket = (data: Partial<Ticket>) => {
    socket?.send(JSON.stringify({ type: 'ticket:create', data }));
  };

  const updateTicket = (id: string, data: Partial<Ticket>) => {
    socket?.send(JSON.stringify({ type: 'ticket:update', data: { id, ...data } }));
  };

  const createTechnician = (data: Partial<Technician>) => {
    socket?.send(JSON.stringify({ type: 'technician:create', data }));
  };

  const updateTechnician = (id: string, data: Partial<Technician>) => {
    socket?.send(JSON.stringify({ type: 'technician:status', data: { id, ...data } }));
  };

  const deleteTechnician = (id: string) => {
    socket?.send(JSON.stringify({ type: 'technician:delete', data: { id } }));
  };

  return (
    <RealtimeContext.Provider value={{ 
      tickets, 
      technicians, 
      createTicket, 
      updateTicket, 
      createTechnician,
      updateTechnician, 
      deleteTechnician,
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
