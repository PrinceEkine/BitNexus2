import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, User, MapPin, Calendar, Clock, AlertCircle, Video, CheckCircle, MessageSquare, Paperclip, MoreHorizontal, Zap } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { useRealtime } from '../contexts/RealtimeContext';

const TicketDetails = ({ ticketId, onBack }: { ticketId: string, onBack: () => void }) => {
  const { tickets, technicians, updateTicket } = useRealtime();
  const ticket = tickets.find(t => t.id === ticketId);
  const [selectedTechId, setSelectedTechId] = useState(ticket?.technician_id || '');

  if (!ticket) return null;

  const handleAssign = async () => {
    if (!selectedTechId) return;
    const tech = technicians.find(t => t.id === selectedTechId);
    await updateTicket(ticket.id, { 
      technician_id: selectedTechId, 
      technician_name: tech?.name,
      status: 'Assigned' 
    });
    alert('Technician assigned successfully.');
  };

  const handleAIAutoAssign = async () => {
    // Basic AI logic: Find idle technician with matching specialty
    const bestTech = technicians.find(t => 
      t.status === 'Idle' && 
      t.specialty.toLowerCase().includes(ticket.service.toLowerCase())
    ) || technicians.find(t => t.status === 'Idle');

    if (bestTech) {
      setSelectedTechId(bestTech.id);
      await updateTicket(ticket.id, { 
        technician_id: bestTech.id, 
        technician_name: bestTech.name,
        status: 'Assigned' 
      });
      alert(`AI has assigned ${bestTech.name} to this ticket.`);
    } else {
      alert('AI could not find an available technician. Please assign manually.');
    }
  };

  const assignedTech = technicians.find(t => t.id === ticket.technician_id);

  return (
    <div className="space-y-8">
      <button 
        onClick={onBack}
        className="flex items-center text-[10px] font-bold uppercase tracking-widest hover:opacity-70 transition-opacity"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Tickets
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <section className="bg-white border border-gray-100 p-10">
            <div className="flex justify-between items-start mb-10">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">{ticket.id}</p>
                <h2 className="text-4xl font-display">{ticket.service}</h2>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={cn(
                  "text-[8px] px-3 py-1 font-bold uppercase tracking-widest rounded-full",
                  ticket.priority === 'Emergency' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                )}>
                  {ticket.priority}
                </span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{ticket.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <User className="w-5 h-5 text-gray-300" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Customer</p>
                    <p className="text-sm font-bold uppercase tracking-widest">{ticket.customer_name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-gray-300" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Location</p>
                    <p className="text-sm font-light leading-relaxed">Lagos, Nigeria</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Calendar className="w-5 h-5 text-gray-300" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Preferred Schedule</p>
                    <p className="text-sm font-bold uppercase tracking-widest">{new Date(ticket.date).toLocaleDateString()} at {new Date(ticket.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-10 border-t border-gray-50">
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Issue Description</h4>
              <p className="text-sm font-light leading-relaxed text-gray-600">{ticket.description}</p>
            </div>
          </section>

          {/* Internal Notes / Activity */}
          <section className="bg-white border border-gray-100 p-10">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-8">Internal Activity</h4>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-[10px] font-bold text-white">AD</div>
                <div className="flex-1 bg-gray-50 p-6">
                  <p className="text-xs font-light leading-relaxed text-gray-600">Ticket created by customer. System flagged as {ticket.priority.toLowerCase()} due to issue description.</p>
                  <p className="text-[8px] text-gray-400 mt-2 uppercase tracking-widest">Today, 10:15 AM</p>
                </div>
              </div>
              {assignedTech && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white">ST</div>
                  <div className="flex-1 bg-emerald-50 p-6">
                    <p className="text-xs font-light leading-relaxed text-emerald-700">Technician {assignedTech.name} has been assigned to this ticket.</p>
                    <p className="text-[8px] text-emerald-400 mt-2 uppercase tracking-widest">Just now</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Actions */}
        <aside className="w-full lg:w-80 space-y-8">
          <section className="bg-brand-dark text-white p-8">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold mb-8">Assignment</h4>
            <div className="space-y-6">
              <div>
                <label className="block text-[8px] uppercase tracking-widest font-bold text-white/30 mb-4">Assign Technician</label>
                <select 
                  value={selectedTechId}
                  onChange={(e) => setSelectedTechId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-white/30"
                >
                  <option value="" className="bg-brand-dark">Select Technician</option>
                  {technicians.map(tech => (
                    <option key={tech.id} value={tech.id} className="bg-brand-dark">
                      {tech.name} ({tech.specialty})
                    </option>
                  ))}
                </select>
              </div>
              <button 
                onClick={handleAssign}
                disabled={!selectedTechId || ticket.technician_id === selectedTechId}
                className="btn-primary w-full bg-white text-brand-dark hover:bg-white/90 disabled:opacity-30"
              >
                {ticket.technician_id ? 'Update Assignment' : 'Confirm Assignment'}
              </button>
              <button 
                onClick={handleAIAutoAssign}
                className="w-full py-3 border border-brand-accent/30 text-brand-accent text-[10px] font-bold uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-3 h-3" /> AI Auto-Assign
              </button>
            </div>
          </section>

          <section className="bg-white border border-gray-100 p-8">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-brand-accent font-bold mb-8">Quick Actions</h4>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 border border-gray-50 hover:border-brand-dark transition-colors text-left group">
                <span className="text-[10px] font-bold uppercase tracking-widest">Update Status</span>
                <MoreHorizontal className="w-4 h-4 text-gray-300" />
              </button>
              <button className="w-full flex items-center justify-between p-4 border border-gray-50 hover:border-brand-dark transition-colors text-left group">
                <span className="text-[10px] font-bold uppercase tracking-widest">Contact Customer</span>
                <MessageSquare className="w-4 h-4 text-gray-300" />
              </button>
              <button className="w-full flex items-center justify-between p-4 border border-gray-50 hover:border-brand-dark transition-colors text-left group">
                <span className="text-[10px] font-bold uppercase tracking-widest">Generate Invoice</span>
                <CheckCircle className="w-4 h-4 text-gray-300" />
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default TicketDetails;
