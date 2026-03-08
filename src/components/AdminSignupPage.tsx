import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowRight, CheckCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '../lib/utils';

const AdminSignupPage = ({ onBack }: { onBack: () => void }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    adminToken: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: 'admin'
        })
      });

      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text.slice(0, 100)}...`);
      }

      if (!response.ok) throw new Error(data.error || 'Signup failed');

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-12 text-center"
        >
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-display mb-4 italic">Registration <span className="not-italic">Successful.</span></h2>
          <p className="text-gray-500 font-light text-sm leading-relaxed mb-10">
            Your administrative account has been created. Please check your email to verify your identity before accessing the command center.
          </p>
          <button onClick={onBack} className="btn-primary w-full py-4">
            Return to Nexus
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col lg:flex-row">
      {/* Left Side - Branding */}
      <div className="lg:w-1/2 p-12 md:p-24 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
            alt="Office" 
            className="w-full h-full object-cover opacity-20 grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-transparent to-brand-dark" />
        </div>

        <div className="relative z-10">
          <button onClick={onBack} className="text-white/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-12">
            <X className="w-3 h-3" /> Back to Platform
          </button>
          <h1 className="text-white text-6xl font-display italic leading-tight mb-8">
            Administrative <br />
            <span className="not-italic text-brand-accent">Onboarding.</span>
          </h1>
          <p className="text-white/40 font-light text-lg max-w-md leading-relaxed">
            Access the core infrastructure of BitNexus. This portal is reserved for authorized personnel only.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 text-white/20">
            <Shield className="w-8 h-8" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Secure Protocol</p>
              <p className="text-[8px] uppercase tracking-widest">End-to-end Encrypted Registration</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="lg:w-1/2 bg-white p-12 md:p-24 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-12">
            <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-brand-accent mb-4">Security Clearance</h2>
            <h3 className="text-4xl font-display italic">Create Admin <span className="not-italic">Profile.</span></h3>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3"
            >
              <AlertCircle className="w-4 h-4" /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400">Full Name</label>
              <input 
                type="text" 
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full border-b border-gray-100 py-4 focus:border-brand-dark outline-none transition-colors font-light text-lg"
                placeholder="e.g. Alexander Pierce"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400">Official Email</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border-b border-gray-100 py-4 focus:border-brand-dark outline-none transition-colors font-light text-lg"
                placeholder="admin@bitnexus.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400">Secure Password</label>
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border-b border-gray-100 py-4 focus:border-brand-dark outline-none transition-colors font-light text-lg"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-brand-accent">Admin Signup Token</label>
              <input 
                type="password" 
                required
                value={formData.adminToken}
                onChange={(e) => setFormData({ ...formData, adminToken: e.target.value })}
                className="w-full border-b border-brand-accent/20 py-4 focus:border-brand-accent outline-none transition-colors font-light text-lg"
                placeholder="Enter unique authorization token"
              />
            </div>

            <button 
              disabled={loading}
              className="btn-primary w-full py-5 mt-8 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? 'Verifying Credentials...' : (
                <>
                  Initialize Admin Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-12 text-[10px] text-gray-400 font-light leading-relaxed uppercase tracking-widest">
            By initializing this account, you agree to the BitNexus Internal Security Protocols and Data Governance Policies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignupPage;
