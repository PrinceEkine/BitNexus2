import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Shield, Clock, Zap, Star, ChevronRight } from 'lucide-react';

const LandingPage = ({ onBookNow }: { onBookNow: () => void }) => {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Editorial Style */}
      <section className="relative h-screen flex items-center overflow-hidden bg-brand-dark">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Home" 
            className="w-full h-full object-cover opacity-50 grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent" />
        </div>
        
        <div className="relative z-10 px-8 md:px-24 max-w-7xl w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="data-label text-brand-accent mb-6">Home Management Redefined</p>
            <h1 className="text-[12vw] md:text-[8vw] font-display text-white leading-[0.85] mb-8 italic">
              Crafted <br />
              <span className="not-italic">Care.</span>
            </h1>
            <p className="text-white/50 text-lg md:text-xl mb-12 font-light tracking-wide max-w-xl leading-relaxed">
              At the nexus of service and technology, BitNexus empowers you to manage your home with precision, ease, and absolute discretion.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={onBookNow}
                className="btn-primary"
              >
                Request Service <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-outline border-white text-white hover:bg-white hover:text-brand-dark"
              >
                Explore Services
              </button>
            </div>
          </motion.div>
        </div>

        {/* Vertical Rail Text */}
        <div className="absolute right-8 bottom-24 hidden md:block">
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/20 vertical-rl rotate-180">
            Est. 2023 • Premium Home Care • Lagos
          </p>
        </div>
      </section>

      {/* Services Grid - Luxury Minimal */}
      <section id="services" className="py-32 px-8 md:px-24 bg-brand-muted">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="data-label mb-4">Our Expertise</h2>
              <h3 className="text-5xl md:text-6xl font-display italic">Specialized <span className="not-italic">Solutions.</span></h3>
            </div>
            <button 
              onClick={onBookNow}
              className="data-label text-brand-ink hover:text-brand-accent transition-colors flex items-center group"
            >
              View All Disciplines <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Electrical', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800', desc: 'Precision wiring and smart home integration.' },
              { title: 'Plumbing', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800', desc: 'Advanced hydraulic systems and maintenance.' },
              { title: 'HVAC', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800', desc: 'Climate control for optimal living environments.' },
            ].map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group cursor-pointer"
                onClick={onBookNow}
              >
                <div className="aspect-[3/4] overflow-hidden mb-8 bg-stone-200 relative">
                  <img 
                    src={service.img} 
                    alt={service.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/20 transition-colors duration-500" />
                </div>
                <h4 className="text-2xl font-display mb-3 italic">{service.title}</h4>
                <p className="text-sm text-stone-500 font-light leading-relaxed mb-4">{service.desc}</p>
                <p className="data-label text-brand-accent">From ₦25,000</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Split Layout - How it Works */}
      <section id="how-it-works" className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <div className="bg-brand-dark text-white p-12 md:p-24 flex flex-col justify-center">
          <h2 className="data-label text-white/40 mb-8">The Methodology</h2>
          <h3 className="text-5xl font-display mb-16 italic">Seamless <span className="not-italic">Integration.</span></h3>
          
          <div className="space-y-16">
            {[
              { step: '01', title: 'Digital Request', desc: 'Initiate your request through our encrypted platform with precise details.' },
              { step: '02', title: 'Algorithmic Matching', desc: 'Our proprietary system identifies the optimal specialist for your specific requirements.' },
              { step: '03', title: 'Execution & Verification', desc: 'Professional resolution followed by a multi-point quality assurance check.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-8 group">
                <span className="font-mono text-brand-accent text-lg pt-1">{item.step}</span>
                <div>
                  <h4 className="text-xl font-display mb-3">{item.title}</h4>
                  <p className="text-white/50 font-light leading-relaxed max-w-md">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative bg-stone-100 overflow-hidden hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1200" 
            alt="Professional Service" 
            className="w-full h-full object-cover grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-accent/10 mix-blend-multiply" />
        </div>
      </section>

      {/* Pricing - Minimalist Table */}
      <section id="pricing" className="py-32 px-8 md:px-24 bg-brand-muted border-t border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="data-label mb-4">Investment</h2>
            <h3 className="text-5xl md:text-6xl font-display italic">Transparent <span className="not-italic">Value.</span></h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { plan: 'Standard', price: '₦25,000', features: ['Standard Response', 'Verified Technicians', 'Digital Records'] },
              { plan: 'Priority', price: '₦50,000', features: ['Priority Deployment', 'Extended Warranty', 'Smart Home Sync'] },
              { plan: 'Elite', price: '₦100,000', features: ['Concierge Access', 'Emergency Response', 'Monthly Asset Audit'] },
            ].map((tier, i) => (
              <div key={i} className="bg-white p-12 border border-stone-200 hover:border-brand-dark transition-all group">
                <h4 className="data-label mb-8">{tier.plan}</h4>
                <p className="text-4xl font-display mb-10 italic">{tier.price}<span className="text-xs not-italic text-stone-400"> / service</span></p>
                <ul className="space-y-6 mb-12">
                  {tier.features.map((f, j) => (
                    <li key={j} className="text-xs font-light text-stone-500 flex items-center gap-3">
                      <div className="w-1 h-1 bg-brand-accent rounded-full" /> {f}
                    </li>
                  ))}
                </ul>
                <button onClick={onBookNow} className="w-full py-4 border border-brand-dark text-[10px] font-bold uppercase tracking-widest group-hover:bg-brand-dark group-hover:text-white transition-all">
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Editorial Quote */}
      <section className="py-32 bg-white border-y border-stone-100">
        <div className="max-w-5xl mx-auto px-8 text-center">
          <div className="flex justify-center mb-12">
            <Star className="w-6 h-6 fill-brand-accent text-brand-accent" />
          </div>
          <blockquote className="text-3xl md:text-5xl font-display italic leading-tight mb-16 text-brand-ink">
            "BitNexus has redefined my expectations of home maintenance. It's not just a service; it's an essential utility for the modern estate."
          </blockquote>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-6 grayscale border border-stone-200 p-1">
              <img src="https://i.pravatar.cc/150?u=1" alt="Sarah Jenkins" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
            </div>
            <p className="data-label text-brand-ink">Sarah Jenkins</p>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Estate Owner, Victoria Island</p>
          </div>
        </div>
      </section>

      {/* Footer CTA - Minimal Luxury */}
      <section className="py-48 bg-brand-dark text-white text-center px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-5xl md:text-7xl font-display mb-12 italic">Elevate your <span className="not-italic">Living.</span></h3>
          <button onClick={onBookNow} className="btn-primary mx-auto bg-white text-brand-dark hover:bg-brand-accent hover:text-white">
            Begin Your Journey
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
