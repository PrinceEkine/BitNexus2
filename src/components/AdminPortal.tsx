import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, Users, BarChart3, Settings, Lock, Zap, Globe } from 'lucide-react';
import Logo from './Logo';

const AdminPortal = ({ onBack, onLogin, onSignup }: { onBack: () => void; onLogin: () => void; onSignup: () => void }) => {
  return (
    <div className="min-h-screen bg-brand-dark text-white pt-32 pb-20 px-6 overflow-hidden relative">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-6xl mx-auto relative z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Platform
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
              <Shield className="w-4 h-4 text-brand-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">Secure Admin Gateway</span>
            </div>

            <h1 className="text-7xl font-display tracking-tighter italic leading-[0.9]">
              Operations <br />
              <span className="not-italic">Control Center.</span>
            </h1>

            <p className="text-white/40 font-light text-lg max-w-md leading-relaxed">
              The BitNexus Admin Portal is a restricted environment for authorized personnel. Manage technicians, monitor real-time operations, and access advanced analytics.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={onLogin}
                className="btn-primary py-4 px-10 text-xs"
              >
                Access Terminal
              </button>
              <button 
                onClick={onSignup}
                className="px-10 py-4 border border-white/10 hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest"
              >
                Request Authorization
              </button>
            </div>

            <div className="pt-10 border-t border-white/5 flex gap-12">
              <div>
                <p className="text-2xl font-display italic">99.9%</p>
                <p className="text-[10px] uppercase tracking-widest text-white/20">Uptime</p>
              </div>
              <div>
                <p className="text-2xl font-display italic">256-bit</p>
                <p className="text-[10px] uppercase tracking-widest text-white/20">Encryption</p>
              </div>
              <div>
                <p className="text-2xl font-display italic">Real-time</p>
                <p className="text-[10px] uppercase tracking-widest text-white/20">Sync</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              { title: 'Fleet Management', icon: Users, desc: 'Track and assign field technicians' },
              { title: 'Global Analytics', icon: BarChart3, desc: 'Real-time revenue and performance' },
              { title: 'System Config', icon: Settings, desc: 'Manage service zones and pricing' },
              { title: 'Security Logs', icon: Lock, desc: 'Audit trails and access control' },
              { title: 'AI Dispatch', icon: Zap, desc: 'Automated job routing and optimization' },
              { title: 'Zone Mapping', icon: Globe, desc: 'Geospatial operational boundaries' }
            ].map((feature, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-all group">
                <feature.icon className="w-6 h-6 text-brand-accent mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-sm font-bold uppercase tracking-widest mb-2">{feature.title}</h3>
                <p className="text-[10px] text-white/30 font-light leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="mt-32 pt-8 border-t border-white/5 flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <Logo className="w-8 h-8 opacity-20" variant="light" />
          <p className="text-[10px] text-white/20 uppercase tracking-widest">BitNexus Admin Protocol v4.2.0</p>
        </div>
        <div className="flex gap-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[10px] text-emerald-500 uppercase tracking-widest">System Online</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
