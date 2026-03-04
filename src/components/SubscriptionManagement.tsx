import React from 'react';
import { motion } from 'motion/react';
import { Shield, Check, Zap, Star, CreditCard, Calendar, ArrowRight, ChevronLeft } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';

const SubscriptionManagement = ({ onBack }: { onBack: () => void }) => {
  const plans = [
    {
      name: 'Standard',
      price: 0,
      description: 'Pay as you go for essential home services.',
      features: [
        'Access to all service categories',
        'Standard response times',
        'Digital invoices & history',
        'Standard warranty (30 days)'
      ],
      current: false
    },
    {
      name: 'Premium',
      price: 15000,
      description: 'Enhanced support for busy households.',
      features: [
        'Priority booking access',
        '5% discount on all service fees',
        'Dedicated support line',
        'Extended warranty (60 days)',
        'Quarterly home health check'
      ],
      current: false
    },
    {
      name: 'Elite',
      price: 45000,
      description: 'The ultimate home management experience.',
      features: [
        'VIP priority (Guaranteed same-day)',
        '15% discount on service fees & parts',
        'Personal home concierge',
        'Lifetime service warranty',
        'Monthly preventive maintenance',
        'Emergency call-out fee waiver'
      ],
      current: true
    }
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

        <div className="mb-20 text-center">
          <h2 className="text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4">Membership</h2>
          <h3 className="text-5xl font-display mb-6">BitNexus Plans</h3>
          <p className="text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
            Choose the level of care your home deserves. From essential repairs to proactive management, we have a plan for every household.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={cn(
                "p-10 border transition-all duration-500 flex flex-col h-full",
                plan.current 
                  ? "border-brand-dark bg-brand-dark text-white ring-1 ring-brand-dark ring-offset-4" 
                  : "border-gray-100 hover:border-brand-dark"
              )}
            >
              <div className="mb-10">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-2xl font-display">{plan.name}</h4>
                  {plan.current && (
                    <span className="bg-white text-brand-dark text-[8px] px-3 py-1 font-bold uppercase tracking-widest">Active</span>
                  )}
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-display">{plan.price === 0 ? 'Free' : formatCurrency(plan.price)}</span>
                  {plan.price > 0 && <span className={cn("text-xs font-light", plan.current ? "text-white/40" : "text-gray-400")}>/ month</span>}
                </div>
                <p className={cn("text-sm font-light leading-relaxed", plan.current ? "text-white/60" : "text-gray-500")}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-6 mb-12 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-xs font-light leading-relaxed">
                    <Check className={cn("w-4 h-4 mt-0.5", plan.current ? "text-emerald-400" : "text-brand-accent")} />
                    <span className={plan.current ? "text-white/80" : "text-gray-600"}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={cn(
                "w-full py-4 text-[10px] font-bold uppercase tracking-widest transition-all",
                plan.current 
                  ? "bg-white text-brand-dark hover:bg-white/90" 
                  : "border border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white"
              )}>
                {plan.current ? 'Manage Subscription' : 'Upgrade Plan'}
              </button>
            </div>
          ))}
        </div>

        {/* Billing History */}
        <section className="mt-32">
          <div className="flex items-center justify-between mb-12">
            <h4 className="text-xs uppercase tracking-[0.3em] font-bold">Billing History</h4>
            <div className="flex items-center gap-2 text-gray-400">
              <CreditCard className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Visa ending in 4242</span>
            </div>
          </div>
          
          <div className="bg-white border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Date</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Plan</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Amount</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Status</th>
                  <th className="px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { date: 'Oct 12, 2023', plan: 'Elite Monthly', amount: 45000, status: 'Paid' },
                  { date: 'Sep 12, 2023', plan: 'Elite Monthly', amount: 45000, status: 'Paid' },
                  { date: 'Aug 12, 2023', plan: 'Elite Monthly', amount: 45000, status: 'Paid' },
                ].map((invoice, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6 text-sm font-light text-gray-500">{invoice.date}</td>
                    <td className="px-8 py-6 text-sm font-bold uppercase tracking-widest">{invoice.plan}</td>
                    <td className="px-8 py-6 text-sm font-bold">{formatCurrency(invoice.amount)}</td>
                    <td className="px-8 py-6">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-600">{invoice.status}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">Download PDF</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SubscriptionManagement;
