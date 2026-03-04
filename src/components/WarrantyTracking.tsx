import React from 'react';
import { motion } from 'motion/react';
import { Shield, CheckCircle, Clock, AlertCircle, ChevronLeft, FileText, Download, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

const WarrantyTracking = ({ onBack }: { onBack: () => void }) => {
  const warranties = [
    { 
      id: 'W-9901', 
      service: 'AC Installation', 
      date: 'Aug 15, 2023', 
      expiry: 'Aug 15, 2024', 
      status: 'Active', 
      coverage: 'Full parts and labor for installation defects.',
      daysLeft: 168
    },
    { 
      id: 'W-8821', 
      service: 'Electrical Rewiring', 
      date: 'Oct 24, 2023', 
      expiry: 'Oct 24, 2024', 
      status: 'Active', 
      coverage: 'Lifetime warranty on wiring integrity (Elite Plan).',
      daysLeft: 238
    },
    { 
      id: 'W-7712', 
      service: 'Plumbing Repair', 
      date: 'May 10, 2023', 
      expiry: 'Jun 10, 2023', 
      status: 'Expired', 
      coverage: '30-day standard repair warranty.',
      daysLeft: 0
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center text-[10px] font-bold uppercase tracking-widest mb-12 hover:opacity-70 transition-opacity"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </button>

        <div className="mb-20">
          <h2 className="text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4">Protection</h2>
          <h3 className="text-4xl font-display mb-6">Warranty Center</h3>
          <p className="text-gray-500 font-light max-w-2xl leading-relaxed">
            Track the coverage of your past services. BitNexus ensures every job is backed by our quality guarantee.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {warranties.map((warranty, i) => (
              <div key={i} className="bg-white border border-gray-100 p-8 hover:border-brand-dark transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{warranty.id}</p>
                    <h4 className="text-xl font-display">{warranty.service}</h4>
                  </div>
                  <span className={cn(
                    "text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full",
                    warranty.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                  )}>
                    {warranty.status}
                  </span>
                </div>
                
                <p className="text-sm font-light text-gray-500 mb-8 leading-relaxed">
                  {warranty.coverage}
                </p>
                
                <div className="flex items-center gap-12 pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-300" />
                    <div>
                      <p className="text-sm font-bold">{warranty.expiry}</p>
                      <p className="text-[8px] text-gray-400 uppercase tracking-widest">Expires On</p>
                    </div>
                  </div>
                  {warranty.status === 'Active' && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <div>
                        <p className="text-sm font-bold">{warranty.daysLeft} Days</p>
                        <p className="text-[8px] text-gray-400 uppercase tracking-widest">Remaining</p>
                      </div>
                    </div>
                  )}
                  <div className="ml-auto">
                    <button className="text-[10px] font-bold uppercase tracking-widest text-brand-accent flex items-center gap-2">
                      Claim Warranty <AlertCircle className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="space-y-8">
            <div className="bg-brand-dark text-white p-8">
              <h4 className="text-xs uppercase tracking-[0.3em] text-white/50 font-bold mb-6">Warranty Policy</h4>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-1" />
                  <p className="text-xs font-light leading-relaxed text-white/60">
                    All standard repairs are covered by a 30-day labor warranty.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-1" />
                  <p className="text-xs font-light leading-relaxed text-white/60">
                    Elite members receive lifetime warranty on all wiring and plumbing installations.
                  </p>
                </div>
                <button className="w-full py-3 border border-white/20 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-brand-dark transition-all mt-4">
                  View Full Terms
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-100 p-8">
              <h4 className="text-xs uppercase tracking-[0.3em] font-bold mb-6">Documents</h4>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 border border-gray-50 hover:border-brand-dark transition-colors text-left group">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Quality Certificate</span>
                  </div>
                  <Download className="w-3 h-3 text-gray-300" />
                </button>
                <button className="w-full flex items-center justify-between p-4 border border-gray-50 hover:border-brand-dark transition-colors text-left group">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Service Log</span>
                  </div>
                  <Download className="w-3 h-3 text-gray-300" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default WarrantyTracking;
