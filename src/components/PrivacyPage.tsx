import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Lock, Eye, Database, Shield } from 'lucide-react';

const PrivacyPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-brand-dark transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 md:p-20 rounded-[3rem] border border-stone-200 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-brand-dark text-white rounded-2xl flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-display tracking-tighter italic">Privacy Policy</h1>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Your Privacy is our Priority</p>
            </div>
          </div>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-4 text-brand-dark">
                <Database className="w-5 h-5" />
                <h2 className="text-2xl font-display italic">Data Collection</h2>
              </div>
              <p className="text-stone-500 font-light leading-relaxed">
                We collect information necessary to provide our services, including contact details, service history, and diagnostic data from smart home integrations.
              </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-brand-dark">
                <Eye className="w-5 h-5" />
                <h2 className="text-2xl font-display italic">How we use Data</h2>
              </div>
              <p className="text-stone-500 font-light leading-relaxed">
                Your data is used to match you with the best technicians, improve our AI diagnostics, and ensure secure payment processing. We never sell your personal information to third parties.
              </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-brand-dark">
                <Shield className="w-5 h-5" />
                <h2 className="text-2xl font-display italic">Security Measures</h2>
              </div>
              <p className="text-stone-500 font-light leading-relaxed">
                We employ industry-standard encryption and security protocols to protect your data. All payment information is handled by PCI-compliant partners.
              </p>
            </section>

            <div className="p-8 bg-stone-50 rounded-2xl border border-stone-100">
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Your Rights</h4>
              <ul className="text-xs text-stone-500 font-light space-y-2">
                <li>• Right to access your personal data</li>
                <li>• Right to request data deletion</li>
                <li>• Right to object to data processing</li>
                <li>• Right to data portability</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPage;
