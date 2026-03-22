import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, FileText, ShieldCheck, AlertCircle } from 'lucide-react';

const TermsPage = ({ onBack }: { onBack: () => void }) => {
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
            <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-brand-dark" />
            </div>
            <div>
              <h1 className="text-4xl font-display tracking-tighter text-brand-dark italic">Terms of Service</h1>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Last Updated: March 2026</p>
            </div>
          </div>

          <div className="prose prose-stone max-w-none space-y-12">
            <section className="space-y-6">
              <h2 className="text-2xl font-display italic flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-brand-accent" /> 1. Acceptance of Terms
              </h2>
              <p className="text-stone-500 font-light leading-relaxed">
                By accessing or using the BitNexus platform, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-display italic flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-brand-accent" /> 2. Service Provision
              </h2>
              <p className="text-stone-500 font-light leading-relaxed">
                BitNexus acts as a facilitator between customers and independent service professionals. While we vet all technicians, the actual service contract is between the user and the professional.
              </p>
            </section>

            <section className="space-y-6">
              <h3 className="text-xl font-display italic">3. Payments and Wallet</h3>
              <p className="text-stone-500 font-light leading-relaxed">
                Users may fund their Nexus Wallet for automated payments. Funds are non-refundable once a service has been initiated and confirmed. BitNexus uses Paystack for secure transaction processing.
              </p>
            </section>

            <section className="space-y-6">
              <h3 className="text-xl font-display italic">4. User Responsibilities</h3>
              <p className="text-stone-500 font-light leading-relaxed">
                You are responsible for providing accurate information regarding service requirements and ensuring a safe environment for technicians to perform their work.
              </p>
            </section>

            <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
              <p className="text-xs text-stone-400 font-light italic text-center">
                For the full legal documentation, please contact our legal department at legal@bitnexus.com
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPage;
