import React from 'react';
import { motion } from 'motion/react';
import { Settings, DollarSign, Percent, Zap, Shield, Info, Save } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

const PricingControl = () => {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4">Configuration</h2>
        <h3 className="text-4xl font-display">Pricing & Fees</h3>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Base Fees */}
        <section className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-xs uppercase tracking-[0.3em] font-bold">Standard Service Fees</h4>
              <button className="text-[10px] font-bold text-brand-accent uppercase tracking-widest flex items-center gap-2">
                <Save className="w-3 h-3" /> Save Changes
              </button>
            </div>
            
            <div className="space-y-6">
              {[
                { label: 'Electrical Diagnostic', price: 15000 },
                { label: 'Plumbing Inspection', price: 12000 },
                { label: 'HVAC Tune-up', price: 25000 },
                { label: 'General Handyman', price: 10000 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest">{item.label}</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Base call-out fee</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-display">{formatCurrency(item.price)}</span>
                    <input 
                      type="number" 
                      className="w-24 border border-gray-100 p-2 text-xs font-bold outline-none focus:border-brand-dark"
                      defaultValue={item.price}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-8">
            <h4 className="text-xs uppercase tracking-[0.3em] font-bold mb-8">Dynamic Surcharges</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Emergency Multiplier</label>
                  <Info className="w-3 h-3 text-gray-300" />
                </div>
                <div className="flex items-center gap-4">
                  <input type="range" className="flex-1 accent-brand-dark" min="1" max="3" step="0.1" defaultValue="1.5" />
                  <span className="text-sm font-bold w-12 text-right">1.5x</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Parts Markup %</label>
                  <Info className="w-3 h-3 text-gray-300" />
                </div>
                <div className="flex items-center gap-4">
                  <input type="range" className="flex-1 accent-brand-dark" min="0" max="100" step="1" defaultValue="20" />
                  <span className="text-sm font-bold w-12 text-right">20%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sidebar Controls */}
        <aside className="space-y-8">
          <div className="bg-brand-dark text-white p-8">
            <h4 className="text-xs uppercase tracking-[0.3em] text-white/50 font-bold mb-6">Subscription Revenue</h4>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Elite Monthly Plan</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-display">₦45,000</span>
                  <button className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">Update</button>
                </div>
              </div>
              <div className="pt-6 border-t border-white/5">
                <div className="flex items-center justify-between text-xs font-light text-white/60 mb-2">
                  <span>Active Subscribers</span>
                  <span className="text-white font-bold">142</span>
                </div>
                <div className="flex items-center justify-between text-xs font-light text-white/60">
                  <span>MRR</span>
                  <span className="text-emerald-400 font-bold">₦6.39M</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-8">
            <h4 className="text-xs uppercase tracking-[0.3em] font-bold mb-6">Escrow Settings</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest">Escrow Hold</p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Hold funds until completion</p>
                </div>
                <button className="w-10 h-5 bg-brand-dark rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest">Auto-Refund</p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Refund if tech no-show</p>
                </div>
                <button className="w-10 h-5 bg-gray-200 rounded-full relative">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PricingControl;
