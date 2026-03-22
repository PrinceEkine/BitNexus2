import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, CheckCircle, Globe, Users } from 'lucide-react';

const AboutPage = ({ onBack }: { onBack: () => void }) => {
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
          <section>
            <h1 className="text-6xl font-display tracking-tighter text-brand-dark mb-8 italic">
              At the Nexus of Service and Technology<span className="text-brand-accent">.</span>
            </h1>
            <p className="text-xl text-stone-500 font-light leading-relaxed max-w-2xl">
              BitNexus was founded with a singular vision: to bring the precision of modern technology to the essential services that keep our homes and businesses running.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-brand-dark text-white rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display italic">Uncompromising Quality</h3>
              <p className="text-stone-500 font-light leading-relaxed">
                Every technician on our platform undergoes a rigorous vetting process. We don't just provide services; we provide peace of mind.
              </p>
            </div>
            <div className="space-y-6">
              <div className="w-12 h-12 bg-brand-accent text-white rounded-2xl flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display italic">Unified Ecosystem</h3>
              <p className="text-stone-500 font-light leading-relaxed">
                By integrating inventory management, real-time tracking, and smart home diagnostics, we create a seamless experience for both customers and pros.
              </p>
            </div>
          </div>

          <section className="bg-brand-dark text-white p-12 rounded-[3rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl font-display italic mb-6">Our Mission</h2>
              <p className="text-white/60 font-light leading-relaxed text-lg">
                To empower a new generation of service professionals with the tools they need to excel, while providing homeowners with a transparent, reliable, and intelligent way to manage their assets.
              </p>
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-2xl font-display italic">The BitNexus Difference</h2>
            <div className="space-y-4">
              {[
                "Real-time technician tracking and communication",
                "AI-powered issue diagnostics and smart quoting",
                "Integrated wallet for secure, automated payments",
                "Comprehensive asset and warranty management"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-6 bg-white border border-stone-200 rounded-2xl">
                  <CheckCircle className="w-5 h-5 text-brand-accent" />
                  <span className="text-stone-600 font-light">{item}</span>
                </div>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
