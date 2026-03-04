import React from 'react';
import { motion } from 'motion/react';
import { LogIn, UserPlus, X } from 'lucide-react';
import { cn } from '../lib/utils';

const AuthModal = ({ isOpen, onClose, type }: { isOpen: boolean, onClose: () => void, type: 'login' | 'signup' }) => {
  const [view, setView] = React.useState<'login' | 'signup' | 'reset'>(type);
  const [role, setRole] = React.useState<'customer' | 'worker' | 'admin'>('customer');
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    password: '',
    adminToken: ''
  });
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setView(type);
    setError(null);
  }, [type]);

  if (!isOpen) return null;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Signup failed');

      // Handle success (e.g., show message to check email)
      alert('Signup successful! Please check your email for verification.');
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white w-full max-w-md p-10 overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-brand-dark transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="mb-10">
          <h2 className="text-3xl font-display mb-2">
            {view === 'login' && 'Welcome Back'}
            {view === 'signup' && 'Create Account'}
            {view === 'reset' && 'Reset Password'}
          </h2>
          <p className="text-gray-500 font-light text-sm uppercase tracking-widest">
            {view === 'login' && 'Enter your credentials to access BitNexus'}
            {view === 'signup' && 'Join the nexus of service and technology'}
            {view === 'reset' && 'Enter your email to receive a reset link'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest border border-red-100 flex items-center gap-2">
            <X className="w-3 h-3" /> {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={view === 'signup' ? handleSignup : (e) => e.preventDefault()}>
          {view === 'signup' && (
            <>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">I am a...</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['customer', 'worker', 'admin'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={cn(
                        "py-2 text-[8px] font-bold uppercase tracking-widest border transition-all",
                        role === r ? "bg-brand-dark text-white border-brand-dark" : "bg-white text-gray-400 border-gray-100 hover:border-brand-dark"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full border-b border-gray-200 py-3 focus:border-brand-dark outline-none transition-colors font-light"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              {role === 'admin' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-brand-accent mb-2">Admin Signup Token</label>
                  <input 
                    type="password" 
                    required
                    className="w-full border-b border-brand-accent/20 py-3 focus:border-brand-accent outline-none transition-colors font-light"
                    placeholder="Enter unique token"
                    value={formData.adminToken}
                    onChange={(e) => setFormData({ ...formData, adminToken: e.target.value })}
                  />
                </motion.div>
              )}
            </>
          )}
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full border-b border-gray-200 py-3 focus:border-brand-dark outline-none transition-colors font-light"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          {view !== 'reset' && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400">Password</label>
                {view === 'login' && (
                  <button 
                    type="button"
                    onClick={() => setView('reset')}
                    className="text-[8px] uppercase tracking-widest font-bold text-brand-accent hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <input 
                type="password" 
                required
                className="w-full border-b border-gray-200 py-3 focus:border-brand-dark outline-none transition-colors font-light"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          )}

          <button 
            disabled={loading}
            className="btn-primary w-full py-4 mt-4 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (
              <>
                {view === 'login' && 'Sign In'}
                {view === 'signup' && 'Create Account'}
                {view === 'reset' && 'Send Reset Link'}
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-gray-50 text-center">
          <p className="text-xs text-gray-500 font-light uppercase tracking-widest">
            {view === 'login' && (
              <>
                Don't have an account?
                <button onClick={() => setView('signup')} className="ml-2 font-bold text-brand-dark hover:underline">Sign Up</button>
              </>
            )}
            {view === 'signup' && (
              <>
                Already have an account?
                <button onClick={() => setView('login')} className="ml-2 font-bold text-brand-dark hover:underline">Log In</button>
              </>
            )}
            {view === 'reset' && (
              <button onClick={() => setView('login')} className="font-bold text-brand-dark hover:underline">Back to Log In</button>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
