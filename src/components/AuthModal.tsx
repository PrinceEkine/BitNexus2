import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, UserPlus, X, Phone, MessageSquare, ArrowRight, Mail } from 'lucide-react';
import { cn } from '../lib/utils';
import Logo from './Logo';
import { auth as firebaseAuth, googleProvider, signInWithPopup } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db as firestoreDb } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

const AuthModal = ({ isOpen, onClose, type }: { isOpen: boolean, onClose: () => void, type: 'login' | 'signup' }) => {
  const [view, setView] = React.useState<'login' | 'signup' | 'reset' | 'whatsapp'>('whatsapp');
  const [role, setRole] = React.useState<'customer' | 'worker' | 'admin'>('customer');
  const [phone, setPhone] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [otpSent, setOtpSent] = React.useState(false);
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    adminToken: ''
  });
  const [error, setError] = React.useState<React.ReactNode | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    if (type === 'signup') {
      setView('signup');
    } else {
      setView('whatsapp'); // Default to WhatsApp login for Super App feel
    }
    setError(null);
    setLoading(false);
    setSuccess(false);
  }, [type]);

  React.useEffect(() => {
    setError(null);
    setLoading(false);
    setSuccess(false);
  }, [view, isOpen]);

  if (!isOpen) return null;

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/whatsapp/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      
      const contentType = res.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Server returned non-JSON response: ${text.slice(0, 100)}...`);
      }

      if (!res.ok) throw new Error(data.error);
      setOtpSent(true);
      toast.success('OTP sent successfully!', {
        description: `Check your WhatsApp messages for the code sent to ${phone}`
      });
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to send OTP', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/whatsapp/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp })
      });
      
      const contentType = res.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Server returned non-JSON response: ${text.slice(0, 100)}...`);
      }

      if (!res.ok) throw new Error(data.error);
      
      // Success! Save user for realtime context
      if (data.user) {
        localStorage.setItem('bitnexus_user', JSON.stringify(data.user));
      }

      setSuccess(true);
      toast.success('Verification successful!', {
        description: 'Welcome back to BitNexus.'
      });
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setError(err.message);
      toast.error('Verification failed', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) throw error;

      setSuccess(true);
      toast.success('Login successful!', { description: 'Welcome back.' });
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message);
      toast.error('Login failed', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

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
      toast.success('Account created!', {
        description: 'Please check your email for a verification link.'
      });
    } catch (err: any) {
      setError(err.message);
      toast.error('Signup failed', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const user = result.user;

      if (user) {
        // Check if user profile exists in Firestore
        const userDocRef = doc(firestoreDb, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        let userData;
        if (!userDoc.exists()) {
          // Create new profile for Google user
          const now = new Date();
          userData = {
            id: user.uid,
            fullName: user.displayName || '',
            email: user.email || '',
            role: 'customer',
            phone: user.phoneNumber || '',
            createdAt: now
          };
          await setDoc(userDocRef, userData);
        } else {
          userData = userDoc.data();
        }

        // Save to localStorage for RealtimeContext to pick up
        localStorage.setItem('bitnexus_user', JSON.stringify({
          ...userData,
          full_name: userData.fullName // Map to Supabase field name if needed
        }));

        setSuccess(true);
        toast.success('Login successful!', { description: `Welcome, ${user.displayName}` });
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1000);
      }
    } catch (err: any) {
      console.error('Google Login Error:', err);
      setError(err.message);
      toast.error('Google Login failed', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
      });
      if (error) throw error;
      toast.success('Verification email resent!', {
        description: 'Please check your inbox.'
      });
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to resend email', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      const contentType = res.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Server returned non-JSON response: ${text.slice(0, 100)}...`);
      }
      if (!res.ok) throw new Error(data.error || 'Reset failed');

      toast.success('Password reset link sent!', {
        description: 'Please check your email.'
      });
      onClose();
    } catch (err: any) {
      setError(err.message);
      toast.error('Reset failed', { description: err.message });
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

        <div className="flex justify-center mb-8">
          <Logo className="w-16 h-16" variant="dark" />
        </div>

        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Mail className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-display mb-4 italic">
              {view === 'signup' ? 'Signup' : 'Login'} <span className="not-italic">Successful.</span>
            </h2>
            <p className="text-gray-500 font-light text-sm leading-relaxed mb-10">
              {view === 'signup' ? (
                <>A verification email has been sent to <span className="font-bold text-brand-dark">{formData.email}</span>. Please verify your email to continue accessing BitNexus.</>
              ) : (
                <>Welcome back to BitNexus. Redirecting you to your dashboard...</>
              )}
            </p>
            <button onClick={onClose} className="btn-primary w-full py-4">
              Got it
            </button>
          </motion.div>
        ) : (
          <>
            <div className="mb-10">
              <h2 className="text-3xl font-display mb-2">
                {view === 'whatsapp' && 'Nexus Login'}
                {view === 'login' && 'Welcome Back'}
                {view === 'signup' && 'Create Account'}
                {view === 'reset' && 'Reset Password'}
              </h2>
              <p className="text-gray-500 font-light text-sm uppercase tracking-widest">
                {view === 'whatsapp' && 'Secure access via WhatsApp'}
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

            {view === 'whatsapp' ? (
              <div className="space-y-8">
                <AnimatePresence mode="wait">
                  {!otpSent ? (
                    <motion.form 
                      key="phone"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onSubmit={handleSendOTP} 
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">WhatsApp Number</label>
                        <div className="relative">
                          <Phone className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                          <input 
                            type="tel" 
                            required
                            className="w-full border-b border-gray-200 py-3 pl-8 focus:border-brand-dark outline-none transition-colors font-light"
                            placeholder="+234 800 000 0000"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div>
                      <button 
                        disabled={loading}
                        className="w-full bg-emerald-500 text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Sending...' : (
                          <>
                            <MessageSquare className="w-4 h-4" /> Send OTP via WhatsApp
                          </>
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.form 
                      key="otp"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onSubmit={handleVerifyOTP} 
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Verification Code</label>
                        <input 
                          type="text" 
                          required
                          maxLength={6}
                          className="w-full border-b border-gray-200 py-3 text-center text-2xl tracking-[0.5em] focus:border-brand-dark outline-none transition-colors font-light"
                          placeholder="000000"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                        <p className="text-[8px] text-gray-400 uppercase tracking-widest mt-4 text-center">
                          Code sent to {phone}. <button type="button" onClick={() => setOtpSent(false)} className="text-brand-accent font-bold">Change</button>
                        </p>
                      </div>
                      <button 
                        disabled={loading}
                        className="w-full bg-brand-dark text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Verifying...' : (
                          <>
                            Verify & Login <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                  <div className="relative flex justify-center text-[8px] uppercase tracking-widest font-bold"><span className="bg-white px-4 text-gray-300">Or use email</span></div>
                </div>

                <button 
                  onClick={() => setView('login')}
                  className="w-full py-4 border border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:border-brand-dark hover:text-brand-dark transition-all"
                >
                  Login with Email
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <form className="space-y-6" onSubmit={
                  view === 'signup' ? handleSignup : 
                  view === 'reset' ? handleReset : 
                  handleLogin
                }>
                  {view === 'signup' && (
                    <>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">I am a...</label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['customer', 'admin'] as const).map((r) => (
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

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">WhatsApp Number</label>
                        <input 
                          type="tel" 
                          required
                          className="w-full border-b border-gray-200 py-3 focus:border-brand-dark outline-none transition-colors font-light"
                          placeholder="+234 800 000 0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                  <div className="relative flex justify-center text-[8px] uppercase tracking-widest font-bold"><span className="bg-white px-4 text-gray-300">Or continue with</span></div>
                </div>

                <button 
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-4 border border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:border-brand-dark hover:text-brand-dark transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                
                <button 
                  type="button"
                  onClick={() => setView('whatsapp')}
                  className="w-full mt-4 text-[8px] font-bold uppercase tracking-widest text-emerald-500 hover:underline"
                >
                  Back to WhatsApp Login
                </button>
              </div>
            )}

            <div className="mt-10 pt-10 border-t border-gray-50 text-center">
              <div className="text-xs text-gray-500 font-light uppercase tracking-widest">
                {view === 'login' && (
                  <>
                    Don't have an account?
                    <button onClick={() => setView('signup')} className="ml-2 font-bold text-brand-dark hover:underline">Sign Up</button>
                    <div className="mt-4 pt-4 border-t border-gray-50">
                      <p className="text-[8px] text-gray-400 uppercase tracking-widest">Are you a staff member?</p>
                      <p className="text-[10px] text-stone-500 mt-1">Staff accounts are created by administrators. Please use your assigned credentials to log in.</p>
                    </div>
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
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AuthModal;
