import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, User, Headset, Phone, Clock } from 'lucide-react';
import { useRealtime } from '../contexts/RealtimeContext';
import { cn } from '../lib/utils';

const ChatWidget = ({ ticketId, customerId, technicianId }: { ticketId: string, customerId: string, technicianId?: string | null }) => {
  const { messages, sendMessage, endChatSession } = useRealtime();
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ticketMessages = messages.filter(m => m.ticket_id === ticketId);
  const isAssigned = !!technicianId;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [ticketMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(ticketId, customerId, text);
    setText('');
  };

  const handleWhatsApp = () => {
    const phone = "2348000000000"; // Replace with your business number
    const message = `Hi BitNexus, I need help with Ticket #${ticketId.slice(0, 8)}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEndSession = () => {
    endChatSession(ticketId);
    setShowEndConfirm(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-96 h-[500px] bg-white shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brand-dark text-white p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center">
                  <Headset className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest">Customer Care</p>
                  <p className="text-[8px] text-white/40 uppercase tracking-widest">Online • Ready to help</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowEndConfirm(true)}
                  className="text-[8px] font-bold uppercase tracking-widest text-white/40 hover:text-red-400 transition-colors"
                >
                  End Session
                </button>
                <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* End Session Confirmation Overlay */}
            <AnimatePresence>
              {showEndConfirm && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-brand-dark/95 flex flex-col items-center justify-center p-8 text-center"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-4">End Conversation?</p>
                  <p className="text-[10px] text-white/60 leading-relaxed mb-8">
                    Ending this session will permanently delete the conversation history for your privacy.
                  </p>
                  <div className="flex gap-4 w-full">
                    <button 
                      onClick={() => setShowEndConfirm(false)}
                      className="flex-1 py-3 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/5"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleEndSession}
                      className="flex-1 py-3 bg-red-500 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-red-600"
                    >
                      Delete & End
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
              {!isAssigned && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center animate-pulse">
                    <Clock className="w-6 h-6 text-stone-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Waiting for Assignment</p>
                    <p className="text-[8px] text-gray-400 uppercase tracking-widest mt-1 max-w-[200px] mx-auto">
                      An administrator or AI is currently reviewing your request to assign the best specialist.
                    </p>
                  </div>
                </div>
              )}
              {isAssigned && ticketMessages.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">No messages yet</p>
                  <p className="text-[8px] text-gray-400 uppercase tracking-widest mt-1">Start a conversation with our team</p>
                </div>
              )}
              {isAssigned && ticketMessages.map((msg) => (
                <div key={msg.id} className={cn(
                  "flex flex-col max-w-[80%]",
                  msg.sender_id === customerId ? "ml-auto items-end" : "items-start"
                )}>
                  <div className={cn(
                    "p-4 text-xs leading-relaxed",
                    msg.sender_id === customerId 
                      ? "bg-brand-dark text-white" 
                      : "bg-white border border-gray-100 text-gray-600"
                  )}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-gray-400 uppercase tracking-widest mt-1">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100 flex flex-col gap-4">
              <button 
                onClick={handleWhatsApp}
                className="w-full bg-emerald-500 text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors"
              >
                <Phone className="w-3 h-3" /> Chat on WhatsApp
              </button>
              
              <form onSubmit={handleSend} className="flex gap-2">
                <input 
                  type="text" 
                  disabled={!isAssigned}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={isAssigned ? "Type your message..." : "Waiting for assignment..."}
                  className="flex-1 bg-gray-50 border-none outline-none px-4 py-3 text-xs font-light disabled:opacity-50"
                />
                <button 
                  type="submit" 
                  disabled={!isAssigned}
                  className="bg-brand-accent text-white p-3 hover:bg-brand-dark transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-brand-dark text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform relative"
      >
        <MessageSquare className="w-6 h-6" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-accent rounded-full border-2 border-white" />
      </button>
    </div>
  );
};

export default ChatWidget;
