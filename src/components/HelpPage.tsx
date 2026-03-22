import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Search, MessageCircle, FileText, HelpCircle, Zap } from 'lucide-react';

const HelpPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-brand-dark transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16"
        >
          <section className="text-center space-y-8">
            <h1 className="text-6xl font-display tracking-tighter text-brand-dark italic">
              How can we help?<span className="text-brand-accent">.</span>
            </h1>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search for articles, guides, or help topics..."
                className="w-full bg-white border border-stone-200 py-6 pl-16 pr-8 rounded-full text-sm focus:outline-none focus:border-brand-accent transition-all shadow-sm"
              />
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Getting Started', icon: Zap, desc: 'Learn the basics of BitNexus' },
              { title: 'Wallet & Payments', icon: FileText, desc: 'Manage your funds and history' },
              { title: 'Technician Portal', icon: HelpCircle, desc: 'Guides for our service pros' }
            ].map((cat, i) => (
              <button key={i} className="bg-white p-8 rounded-[2rem] border border-stone-200 hover:border-brand-accent transition-all text-left group">
                <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-dark group-hover:text-white transition-all">
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-display italic mb-2">{cat.title}</h3>
                <p className="text-stone-400 text-xs font-light">{cat.desc}</p>
              </button>
            ))}
          </div>

          <section className="space-y-8">
            <h2 className="text-2xl font-display italic">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "How do I fund my Nexus Wallet?", a: "You can fund your wallet using Paystack. Navigate to your dashboard, click 'Fund Wallet', and follow the secure payment prompts." },
                { q: "What happens if I'm not satisfied with a service?", a: "BitNexus offers a satisfaction guarantee. If a service doesn't meet our standards, contact support within 24 hours for a resolution." },
                { q: "How are technicians vetted?", a: "We conduct background checks, skill assessments, and verify certifications for every professional on our platform." }
              ].map((faq, i) => (
                <details key={i} className="group bg-white border border-stone-200 rounded-2xl overflow-hidden">
                  <summary className="p-6 cursor-pointer list-none flex justify-between items-center font-display italic text-lg">
                    {faq.q}
                    <span className="text-stone-300 group-open:rotate-180 transition-transform">↓</span>
                  </summary>
                  <div className="px-6 pb-6 text-stone-500 font-light leading-relaxed text-sm">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section className="bg-brand-dark text-white p-12 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-display italic mb-2">Still need support?</h2>
              <p className="text-white/40 font-light">Our concierge team is available 24/7 for premium members.</p>
            </div>
            <button className="btn-primary whitespace-nowrap">
              <MessageCircle className="w-4 h-4 mr-2 inline" /> Contact Concierge
            </button>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpPage;
