import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Ticket as TicketIcon, History, User, FileText, Shield, CreditCard, ExternalLink, Clock, Smartphone, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { useRealtime } from '../contexts/RealtimeContext';

import SubscriptionManagement from './SubscriptionManagement';
import WarrantyTracking from './WarrantyTracking';
import SmartHome from './SmartHome';
import HouseholdProfile from './HouseholdProfile';

type CustomerView = 'dashboard' | 'subscription' | 'warranty' | 'smart-home' | 'profile';

const CustomerDashboard = () => {
  const [activeView, setActiveView] = React.useState<CustomerView>('dashboard');
  const { tickets } = useRealtime();

  // Filter tickets for this customer (hardcoded as Sarah Jenkins for now)
  const customerName = 'Sarah Jenkins';
  const activeTickets = tickets.filter(t => t.customer === customerName && t.status !== 'Completed');
  const pastServices = tickets.filter(t => t.customer === customerName && t.status === 'Completed');

  if (activeView === 'subscription') {
    return <SubscriptionManagement onBack={() => setActiveView('dashboard')} />;
  }

  if (activeView === 'warranty') {
    return <WarrantyTracking onBack={() => setActiveView('dashboard')} />;
  }

  if (activeView === 'smart-home') {
    return <SmartHome onBack={() => setActiveView('dashboard')} />;
  }

  if (activeView === 'profile') {
    return <HouseholdProfile onBack={() => setActiveView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-brand-muted pt-32 pb-24 px-8 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-display italic mb-4">Welcome back, <span className="not-italic">Sarah.</span></h1>
            <button 
              onClick={() => setActiveView('profile')}
              className="data-label text-stone-400 hover:text-brand-accent transition-colors flex items-center gap-2"
            >
              Premium Member • Lagos, Nigeria <ChevronRight className="w-3 h-3" />
            </button>
          </motion.div>
          <button className="btn-primary">Request New Service</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Active Tickets - Clean Utility */}
            <section className="bg-white p-10 border border-stone-200">
              <div className="flex items-center justify-between mb-10">
                <h2 className="data-label">Active Engagements</h2>
                <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
              </div>
              
              {activeTickets.length > 0 ? (
                <div className="space-y-10">
                  {activeTickets.map((ticket) => (
                    <motion.div 
                      key={ticket.id} 
                      whileHover={{ x: 10 }}
                      className="group cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="font-mono text-[10px] text-stone-400 mb-2">{ticket.id}</p>
                          <h3 className="text-2xl font-display italic">{ticket.service}</h3>
                        </div>
                        <span className="data-label bg-brand-dark text-white px-4 py-1.5">
                          {ticket.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-none bg-stone-100 flex items-center justify-center border border-stone-200">
                            <User className="w-4 h-4 text-stone-400" />
                          </div>
                          <div>
                            <p className="data-label text-[8px] mb-0.5">Technician</p>
                            <p className="text-xs font-bold uppercase tracking-widest">{ticket.technician || 'Assigning...'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-none bg-stone-100 flex items-center justify-center border border-stone-200">
                            <Clock className="w-4 h-4 text-stone-400" />
                          </div>
                          <div>
                            <p className="data-label text-[8px] mb-0.5">Scheduled</p>
                            <p className="text-xs font-bold uppercase tracking-widest">{new Date(ticket.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-8 pt-8 border-t border-stone-100 flex justify-end">
                        <button className="data-label text-brand-accent hover:underline flex items-center gap-2">
                          Live Tracking <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-400 font-light py-12 text-center italic">No active service requests.</p>
              )}
            </section>

            {/* Past Services - Technical Grid */}
            <section className="bg-white p-10 border border-stone-200">
              <div className="flex items-center justify-between mb-10">
                <h2 className="data-label">Service History</h2>
                <History className="w-4 h-4 text-stone-300" />
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-100">
                      <th className="pb-6 data-label">Service</th>
                      <th className="pb-6 data-label">Date</th>
                      <th className="pb-6 data-label">Amount</th>
                      <th className="pb-6 data-label">Status</th>
                      <th className="pb-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {pastServices.map((service) => (
                      <tr key={service.id} className="group hover:bg-stone-50 transition-colors">
                        <td className="py-8">
                          <p className="text-xs font-bold uppercase tracking-widest">{service.service}</p>
                          <p className="font-mono text-[9px] text-stone-400 mt-1">{service.id}</p>
                        </td>
                        <td className="py-8 text-xs font-light italic text-stone-500">{new Date(service.date).toLocaleDateString()}</td>
                        <td className="py-8 font-mono text-xs">{formatCurrency(25000)}</td>
                        <td className="py-8">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600">Verified</span>
                        </td>
                        <td className="py-8 text-right">
                          <button className="p-3 hover:bg-stone-200 transition-colors">
                            <FileText className="w-4 h-4 text-stone-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-12">
            {/* Subscription - Dark Luxury */}
            <section className="bg-brand-dark text-white p-10 border border-stone-800 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-brand-accent/10 rounded-full blur-3xl group-hover:bg-brand-accent/20 transition-all duration-1000" />
              <h2 className="data-label text-white/40 mb-10">Membership</h2>
              <div className="mb-10">
                <h3 className="text-3xl font-display italic mb-2">BitNexus <span className="not-italic text-brand-accent">Elite.</span></h3>
                <p className="text-white/40 font-mono text-[10px]">RENEWAL: 12 NOV 2023</p>
              </div>
              <ul className="space-y-6 mb-10">
                {[
                  'Priority Deployment',
                  '15% Component Subsidy',
                  'Extended Asset Warranty',
                  '24/7 Concierge Access'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-4 text-xs font-light text-white/70">
                    <Shield className="w-4 h-4 text-brand-accent" /> {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => setActiveView('subscription')}
                className="w-full py-4 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-brand-dark transition-all"
              >
                Manage Privileges
              </button>
            </section>

            {/* Quick Actions - Minimal Utility */}
            <section className="bg-white p-10 border border-stone-200">
              <h2 className="data-label mb-10">System Controls</h2>
              <div className="grid grid-cols-1 gap-6">
                {[
                  { id: 'smart-home', label: 'Smart Home', desc: 'Connected Assets', icon: Smartphone },
                  { id: 'payment', label: 'Payments', desc: 'Secure Methods', icon: CreditCard },
                  { id: 'warranty', label: 'Warranty', desc: 'Asset Coverage', icon: Shield },
                ].map((action) => (
                  <button 
                    key={action.id}
                    onClick={() => action.id !== 'payment' && setActiveView(action.id as CustomerView)}
                    className="flex items-center gap-6 p-6 border border-stone-50 hover:border-brand-dark transition-all text-left group bg-stone-50/50"
                  >
                    <div className="w-12 h-12 bg-white flex items-center justify-center border border-stone-100 group-hover:bg-brand-dark group-hover:text-white transition-all">
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest">{action.label}</p>
                      <p className="data-label text-[8px] mt-1">{action.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
