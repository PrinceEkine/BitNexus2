import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  Plus, 
  MessageSquare, 
  ShoppingBag, 
  Settings, 
  ArrowUpRight, 
  Clock, 
  ShieldCheck,
  Zap,
  Smartphone,
  Package,
  Maximize2,
  X
} from 'lucide-react';
import { useRealtime } from '../contexts/RealtimeContext';
import { useCurrency, CurrencyCode } from '../contexts/CurrencyContext';
import { cn, formatCurrency } from '../lib/utils';
import Logo from './Logo';
import axios from 'axios';
import { PushNotificationManager } from './PushNotificationManager';

const SuperAppHub = ({ userId }: { userId: string }) => {
  const { tickets, wallet } = useRealtime();
  const { currency, setCurrency, convert } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [activeSubApp, setActiveSubApp] = useState<string | null>(null);

  const subApps = [
    { id: 'inventory', name: 'StockBit Pro', desc: 'Inventory Management', icon: Package, url: 'https://stockbitpro.netlify.app/' },
    { id: 'analytics', name: 'Nexus Analytics', desc: 'Service Insights', icon: Zap, url: 'https://analytics.bitnexus.com' },
  ];

  const activeTickets = tickets.filter(t => t.status !== 'Completed');

  const displayBalance = wallet 
    ? convert(wallet.balance, (wallet.currency as CurrencyCode) || 'NGN', currency)
    : 0;

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-20 px-6">
      <AnimatePresence>
        {activeSubApp && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-dark">StockBit Pro • Inventory</h3>
              </div>
              <button 
                onClick={() => setActiveSubApp(null)}
                className="w-10 h-10 rounded-full hover:bg-stone-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <iframe 
              src={activeSubApp} 
              className="flex-1 w-full border-none"
              title="Inventory Sub-App"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="flex items-center gap-4">
            <Logo className="w-12 h-12" variant="dark" />
            <div>
              <h1 className="text-4xl font-display tracking-tighter text-brand-dark mb-2">
                The Nexus Hub<span className="text-brand-accent">.</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">
                Your Unified Service Ecosystem
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Currency Selector */}
            <div className="flex bg-white border border-stone-200 rounded-full p-1">
              {(['NGN', 'USD', 'EUR', 'GBP'] as CurrencyCode[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={cn(
                    "px-3 py-1 text-[8px] font-bold uppercase tracking-widest rounded-full transition-all",
                    currency === c ? "bg-brand-dark text-white" : "text-gray-400 hover:text-brand-dark"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <button className="w-10 h-10 bg-white border border-stone-200 rounded-full flex items-center justify-center text-gray-400 hover:text-brand-dark transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 bg-brand-dark text-white rounded-full flex items-center justify-center text-xs font-bold">
              JD
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Wallet & Quick Actions */}
          <div className="lg:col-span-1 space-y-8">
            {/* Push Notifications */}
            <PushNotificationManager />

            {/* Wallet Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-brand-dark rounded-[2rem] p-8 text-white relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-brand-accent/20 transition-colors" />
              
              <div className="flex justify-between items-start mb-12">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-brand-accent" />
                </div>
                <button className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white flex items-center gap-2">
                  History <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>

              <div className="mb-8">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40 mb-2">Available Balance</p>
                <h2 className="text-4xl font-display tracking-tighter">
                  {loading ? "..." : formatCurrency(displayBalance, currency)}
                </h2>
              </div>

              <button className="w-full bg-brand-accent text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-brand-dark transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Top Up Wallet
              </button>
            </motion.div>

            {/* Quick Services Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Book Pro', icon: Zap, color: 'bg-amber-50 text-amber-600', action: () => {} },
                { label: 'Inventory', icon: Package, color: 'bg-blue-50 text-blue-600', action: () => setActiveSubApp('https://stockbitpro.netlify.app/') },
                { label: 'Shop Parts', icon: ShoppingBag, color: 'bg-emerald-50 text-emerald-600', action: () => {} },
                { label: 'Smart Home', icon: Smartphone, color: 'bg-purple-50 text-purple-600', action: () => {} }
              ].map((action) => (
                <button 
                  key={action.label}
                  onClick={action.action}
                  className="bg-white border border-stone-200 p-6 rounded-[2rem] hover:border-brand-accent transition-all text-left group"
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", action.color)}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-dark">{action.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Active Services & Marketplace */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Services */}
            <div className="bg-white border border-stone-200 rounded-[2rem] p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-dark">Active Services</h3>
                <span className="bg-stone-100 text-stone-500 text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  {activeTickets.length} Ongoing
                </span>
              </div>

              {activeTickets.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-stone-100 rounded-3xl">
                  <Clock className="w-8 h-8 text-stone-200 mx-auto mb-4" />
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">No active services</p>
                  <button className="text-[10px] text-brand-accent uppercase tracking-widest font-bold mt-2 hover:underline">
                    Schedule a maintenance
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeTickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-6 bg-stone-50 rounded-3xl group hover:bg-stone-100 transition-colors">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                          <Zap className="w-5 h-5 text-brand-accent" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-dark mb-1">{ticket.service}</p>
                          <p className="text-[8px] text-stone-400 uppercase tracking-widest">Ticket #{ticket.id.slice(0, 8)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="hidden md:block text-right">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-dark mb-1">{ticket.status}</p>
                          <p className="text-[8px] text-stone-400 uppercase tracking-widest">Last updated 2h ago</p>
                        </div>
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-stone-400 group-hover:text-brand-dark transition-colors">
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Marketplace Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-brand-accent rounded-[2rem] p-8 text-white flex flex-col justify-between h-64 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl" />
                <div>
                  <h3 className="text-2xl font-display tracking-tighter mb-2">Nexus Store</h3>
                  <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold">Certified Parts & Accessories</p>
                </div>
                <button className="bg-white text-brand-dark py-4 px-8 rounded-2xl text-[10px] font-bold uppercase tracking-widest self-start hover:bg-brand-dark hover:text-white transition-all">
                  Browse Catalog
                </button>
              </div>

              <div className="bg-white border border-stone-200 rounded-[2rem] p-8 flex flex-col justify-between h-64">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-dark">Nexus Protection</h3>
                </div>
                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  Get extended warranty and 24/7 priority support for all your home appliances.
                </p>
                <div className="flex justify-between items-center mt-6">
                  <p className="text-lg font-display tracking-tighter text-brand-dark">
                    {formatCurrency(convert(5000, 'NGN', currency), currency)}
                    <span className="text-[10px] text-stone-400 font-sans font-bold uppercase tracking-widest ml-1">/mo</span>
                  </p>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-brand-accent hover:underline">Learn More</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAppHub;
