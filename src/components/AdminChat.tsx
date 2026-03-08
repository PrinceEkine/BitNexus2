import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, MessageSquare, Search, Filter } from 'lucide-react';
import { useRealtime } from '../contexts/RealtimeContext';
import { cn } from '../lib/utils';

const AdminChat = () => {
  const { tickets, messages, sendMessage, endChatSession } = useRealtime();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeTickets = tickets.filter(t => t.status !== 'Completed');
  const selectedTicket = tickets.find(t => t.id === selectedTicketId);
  const ticketMessages = messages.filter(m => m.ticket_id === selectedTicketId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [ticketMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !selectedTicketId) return;
    sendMessage(selectedTicketId, 'admin-id', text);
    setText('');
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex border border-gray-100 bg-white">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400 mb-4">Active Chats</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-8 pr-4 py-2 bg-gray-50 border-none outline-none text-[10px] uppercase tracking-widest font-bold"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {activeTickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => setSelectedTicketId(ticket.id)}
              className={cn(
                "w-full p-6 text-left hover:bg-gray-50 transition-colors border-b border-gray-50",
                selectedTicketId === ticket.id && "bg-gray-50 border-l-2 border-brand-accent"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest">{ticket.customer_name}</p>
                <span className="text-[8px] text-gray-400">{ticket.id.slice(0, 8)}</span>
              </div>
              <p className="text-xs text-gray-500 font-light truncate">{ticket.service}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50/30">
        {selectedTicket ? (
          <>
            {/* Header */}
            <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand-dark text-white flex items-center justify-center text-xs font-bold">
                  {selectedTicket.customer_name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest">{selectedTicket.customer_name}</h4>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">{selectedTicket.service}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowEndConfirm(true)}
                  className="btn-outline border-red-100 text-red-500 hover:bg-red-50 py-2 px-4 text-[10px]"
                >
                  End Session
                </button>
                <button className="btn-outline py-2 px-4 text-[10px]">View Ticket</button>
              </div>
            </div>

            {/* End Session Confirmation Overlay */}
            <AnimatePresence>
              {showEndConfirm && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-white/95 flex flex-col items-center justify-center p-8 text-center"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-dark mb-4">Delete Conversation History?</p>
                  <p className="text-[10px] text-gray-500 leading-relaxed mb-8 max-w-xs">
                    This will permanently delete all messages for this session. This action cannot be undone.
                  </p>
                  <div className="flex gap-4 w-full max-w-xs">
                    <button 
                      onClick={() => setShowEndConfirm(false)}
                      className="flex-1 py-3 border border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        if (selectedTicketId) {
                          endChatSession(selectedTicketId);
                          setShowEndConfirm(false);
                        }
                      }}
                      className="flex-1 py-3 bg-red-500 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-red-600"
                    >
                      Confirm Delete
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6">
              {ticketMessages.map((msg) => (
                <div key={msg.id} className={cn(
                  "flex flex-col max-w-[70%]",
                  msg.sender_id === 'admin-id' ? "ml-auto items-end" : "items-start"
                )}>
                  <div className={cn(
                    "p-5 text-xs leading-relaxed",
                    msg.sender_id === 'admin-id' 
                      ? "bg-brand-dark text-white" 
                      : "bg-white border border-gray-100 text-gray-600"
                  )}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-gray-400 uppercase tracking-widest mt-2">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 bg-white border-t border-gray-100 flex gap-4">
              <input 
                type="text" 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your response..."
                className="flex-1 bg-gray-50 border-none outline-none px-6 py-4 text-xs font-light"
              />
              <button type="submit" className="btn-primary py-4 px-8">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold">Select a conversation to begin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
