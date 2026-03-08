import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import Logo from './Logo';
import { supabase } from '../lib/supabase';

const UpdatePasswordPage = ({ onComplete }: { onComplete: () => void }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-3xl shadow-xl max-w-md w-full text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
          </div>
          <h2 className="text-3xl font-display mb-4 text-brand-dark">Password Updated</h2>
          <p className="text-stone-500 font-light mb-8">Your password has been successfully changed. You will be redirected to the landing page shortly.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-12 rounded-3xl shadow-xl max-w-md w-full"
      >
        <div className="flex justify-center mb-8">
          <Logo className="w-16 h-16" variant="dark" />
        </div>
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display mb-2 text-brand-dark">New Password</h2>
          <p className="text-stone-500 font-light text-sm uppercase tracking-widest">Set your new secure access key</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest border border-red-100 flex items-center gap-2">
            <AlertCircle className="w-3 h-3" /> {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input 
                type="password" 
                required
                className="w-full border-b border-gray-200 py-3 pl-8 focus:border-brand-dark outline-none transition-colors font-light"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input 
                type="password" 
                required
                className="w-full border-b border-gray-200 py-3 pl-8 focus:border-brand-dark outline-none transition-colors font-light"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-brand-dark text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : (
              <>
                Update Password <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default UpdatePasswordPage;
