import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, User, MapPin, Calendar, Clock, AlertCircle, Video, CheckCircle, MessageSquare, Paperclip, MoreHorizontal } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';

const TicketDetails = ({ onBack }: { onBack: () => void }) => {
  const ticket = {
    id: 'BN-8821',
    customer: 'Sarah Jenkins',
    service: 'Electrical Repair',
    status: 'Pending',
    priority: 'Emergency',
    date: 'Oct 24, 2023',
    time: '14:30',
    address: '12B Admiralty Way, Lekki Phase 1, Lagos',
    description: 'The main circuit breaker keeps tripping whenever the AC is turned on. Possible short circuit in the living room wiring.',
    isLiveVideo: true,
    media: [
      'https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400'
    ]
  };

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
                <span className="bg-red-100 text-red-600 text-[8px] px-3 py-1 font-bold uppercase tracking-widest rounded-full">
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
                    <p className="text-sm font-bold uppercase tracking-widest">{ticket.customer}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-gray-300" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Location</p>
                    <p className="text-sm font-light leading-relaxed">{ticket.address}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Calendar className="w-5 h-5 text-gray-300" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Preferred Schedule</p>
                    <p className="text-sm font-bold uppercase tracking-widest">{ticket.date} at {ticket.time}</p>
                  </div>
                </div>
                {ticket.isLiveVideo && (
                  <div className="flex items-center gap-4 text-brand-accent">
                    <Video className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Live Video Requested</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-10 border-t border-gray-50">
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Issue Description</h4>
              <p className="text-sm font-light leading-relaxed text-gray-600">{ticket.description}</p>
            </div>

            <div className="mt-10 space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Attached Media</h4>
              <div className="flex gap-4">
                {ticket.media.map((url, i) => (
                  <div key={i} className="w-32 h-32 bg-gray-100 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                    <img src={url} alt="Media" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Internal Notes / Activity */}
          <section className="bg-white border border-gray-100 p-10">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-8">Internal Activity</h4>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-[10px] font-bold text-white">AD</div>
                <div className="flex-1 bg-gray-50 p-6">
                  <p className="text-xs font-light leading-relaxed text-gray-600">Ticket created by customer. System flagged as emergency due to circuit breaker issue.</p>
                  <p className="text-[8px] text-gray-400 mt-2 uppercase tracking-widest">Today, 10:15 AM</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <textarea 
                    className="w-full border border-gray-100 p-4 text-xs font-light outline-none focus:border-brand-dark resize-none h-24"
                    placeholder="Add an internal note..."
                  />
                  <div className="flex justify-between items-center mt-4">
                    <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                      <Paperclip className="w-3 h-3" /> Attach File
                    </button>
                    <button className="btn-primary py-2 px-6 text-[10px]">Post Note</button>
                  </div>
                </div>
              </div>
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
                <select className="w-full bg-white/5 border border-white/10 p-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-white/30">
                  <option className="bg-brand-dark">Select Technician</option>
                  <option className="bg-brand-dark">John Doe (Electrical)</option>
                  <option className="bg-brand-dark">Jane Smith (Plumbing)</option>
                </select>
              </div>
              <button className="btn-primary w-full bg-white text-brand-dark hover:bg-white/90">Confirm Assignment</button>
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
