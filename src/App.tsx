import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LandingPage from './components/LandingPage';
import BookingPage from './components/BookingPage';
import ChatWidget from './components/ChatWidget';
import CustomerDashboard from './components/CustomerDashboard';
import AdminDashboard from './components/AdminDashboard';
import WorkerDashboard from './components/WorkerDashboard';
import AdminSignupPage from './components/AdminSignupPage';
import AdminPortal from './components/AdminPortal';
import AuthModal from './components/AuthModal';
import InstallPrompt from './components/InstallPrompt';
import SuperAppHub from './components/SuperAppHub';
import Logo from './components/Logo';
import UpdatePasswordPage from './components/UpdatePasswordPage';
import AboutPage from './components/AboutPage';
import HelpPage from './components/HelpPage';
import TermsPage from './components/TermsPage';
import PrivacyPage from './components/PrivacyPage';
import { Menu, X, User, LogOut, Wallet } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { cn } from './lib/utils';
import { RealtimeProvider, useRealtime } from './contexts/RealtimeContext';
import { CurrencyProvider } from './contexts/CurrencyContext';

type View = 'landing' | 'booking' | 'dashboard' | 'admin' | 'worker' | 'admin-signup' | 'hub' | 'update-password' | 'about' | 'help' | 'terms' | 'privacy' | 'admin-portal';

export default function App() {
  return (
    <CurrencyProvider>
      <RealtimeProvider>
        <AppContent />
      </RealtimeProvider>
    </CurrencyProvider>
  );
}

function AppContent() {
  const { currentUser, tickets, logout } = useRealtime();
  const [currentView, setCurrentView] = useState<View>('landing');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; type: 'login' | 'signup' }>({
    isOpen: false,
    type: 'login',
  });
  
  const isLoggedIn = !!currentUser;
  const userRole = currentUser?.role || 'customer';
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    // Redirect to appropriate dashboard if logged in and on landing
    if (isLoggedIn && currentView === 'landing') {
      if (userRole === 'admin') setCurrentView('admin');
      else if (userRole === 'worker') setCurrentView('worker');
      else setCurrentView('hub');
    }
  }, [isLoggedIn, userRole]);

  const handleLogout = async () => {
    const toastId = toast.loading('Signing out of your secure session...');
    try {
      await logout();
      toast.success('You have been successfully logged out.', { id: toastId });
    } catch (err) {
      console.error("Logout error in App", err);
      toast.error('There was an issue signing out, but we have cleared your local session.', { id: toastId });
    } finally {
      setCurrentView('landing');
      // Ensure toast disappears after a delay
      setTimeout(() => toast.dismiss(toastId), 3000);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Background visibility
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide/Show logic
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true); // Scrolling up
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    // Handle Supabase recovery redirect
    if (window.location.hash.includes('type=recovery')) {
      setCurrentView('update-password');
    }
    // Handle email verification success
    if (window.location.hash.includes('type=verified')) {
      alert('Email successfully verified! You can now log in.');
      window.location.hash = '';
      setAuthModal({ isOpen: true, type: 'login' });
    }
  }, []);

  // Simple routing simulation
  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onBookNow={() => setCurrentView('booking')} />;
      case 'booking':
        return <BookingPage onBack={() => setCurrentView('landing')} />;
      case 'dashboard':
        return <CustomerDashboard onBookNow={() => setCurrentView('booking')} />;
      case 'hub':
        return <SuperAppHub userId={currentUser?.id || 'anonymous'} onNavigate={setCurrentView} />;
      case 'admin':
        return <AdminDashboard onLogout={handleLogout} />;
      case 'worker':
        return <WorkerDashboard onLogout={handleLogout} />;
      case 'admin-signup':
        return <AdminSignupPage onBack={() => setCurrentView('admin-portal')} />;
      case 'admin-portal':
        return (
          <AdminPortal 
            onBack={() => setCurrentView('landing')} 
            onLogin={() => setAuthModal({ isOpen: true, type: 'login' })}
            onSignup={() => setCurrentView('admin-signup')}
          />
        );
      case 'update-password':
        return <UpdatePasswordPage onComplete={() => {
          window.location.hash = '';
          setCurrentView('landing');
        }} />;
      case 'about':
        return <AboutPage onBack={() => setCurrentView('landing')} />;
      case 'help':
        return <HelpPage onBack={() => setCurrentView('landing')} />;
      case 'terms':
        return <TermsPage onBack={() => setCurrentView('landing')} />;
      case 'privacy':
        return <PrivacyPage onBack={() => setCurrentView('landing')} />;
      default:
        return <LandingPage onBookNow={() => setCurrentView('booking')} />;
    }
  };

  const scrollToSection = (id: string) => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const guestTickets = JSON.parse(localStorage.getItem('bitnexus_guest_tickets') || '[]');
  const activeGuestTicket = tickets.find(t => guestTickets.includes(t.id) && t.status !== 'Completed');

  return (
    <div className="relative font-sans">
      <Toaster position="top-center" expand={true} richColors />
      {activeGuestTicket && (
        <ChatWidget 
          ticketId={activeGuestTicket.id}
          customerId="guest"
          technicianId={activeGuestTicket.technician_id}
        />
      )}
      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
        !isVisible && "-translate-y-full",
        currentView === 'landing' 
          ? (isScrolled ? "bg-white/90 backdrop-blur-xl border-b border-stone-200 py-4" : "bg-transparent py-6")
          : "bg-white border-b border-gray-100 py-4"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button 
            onClick={() => setCurrentView('landing')}
            className={cn(
              "flex items-center gap-3 text-2xl font-display tracking-tighter transition-colors duration-500",
              (currentView === 'landing' && !isScrolled) ? "text-white" : "text-brand-dark"
            )}
          >
            <Logo 
              className="w-10 h-10" 
              variant={(currentView === 'landing' && !isScrolled) ? "light" : "dark"} 
            />
            BitNexus<span className="text-brand-accent">.</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {[
              { label: 'Services', id: 'services' },
              { label: 'How it Works', id: 'how-it-works' },
              { label: 'Pricing', id: 'pricing' }
            ].map((item) => (
              <button 
                key={item.label}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-500",
                  (currentView === 'landing' && !isScrolled) ? "text-white/70 hover:text-white" : "text-gray-400 hover:text-brand-dark"
                )}
              >
                {item.label}
              </button>
            ))}
            
            <div className="h-4 w-[1px] bg-gray-200 mx-2" />

            {isLoggedIn ? (
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setCurrentView('hub')}
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition-colors duration-500",
                    (currentView === 'landing' && !isScrolled) ? "text-white" : "text-brand-dark"
                  )}
                >
                  <Wallet className="w-4 h-4" /> Wallet
                </button>
                <button 
                  onClick={() => {
                    if (userRole === 'admin') setCurrentView('admin');
                    else if (userRole === 'worker') setCurrentView('worker');
                    else setCurrentView('hub');
                  }}
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition-colors duration-500",
                    (currentView === 'landing' && !isScrolled) ? "text-white" : "text-brand-dark"
                  )}
                >
                  <User className="w-4 h-4" /> Hub
                </button>
                <button 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setCurrentView('admin-portal')}
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-500",
                    (currentView === 'landing' && !isScrolled) ? "text-white/50 hover:text-white" : "text-gray-400 hover:text-brand-dark"
                  )}
                >
                  Staff Login
                </button>
                <button 
                  onClick={() => setAuthModal({ isOpen: true, type: 'login' })}
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-500",
                    (currentView === 'landing' && !isScrolled) ? "text-white" : "text-brand-dark"
                  )}
                >
                  Log In
                </button>
                <button 
                  onClick={() => setAuthModal({ isOpen: true, type: 'signup' })}
                  className="btn-primary py-2 px-6 text-[10px]"
                >
                  Join
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              "md:hidden p-2 transition-colors duration-500",
              (currentView === 'landing' && !isScrolled) ? "text-white" : "text-brand-dark"
            )}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[60] bg-brand-dark text-white p-12 flex flex-col justify-center"
          >
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8"><X className="w-8 h-8" /></button>
            <div className="space-y-8">
              {[
                { label: 'Services', id: 'services' },
                { label: 'How it Works', id: 'how-it-works' },
                { label: 'Pricing', id: 'pricing' },
                { label: 'Dashboard', id: 'dashboard' },
                { label: 'Admin', id: 'admin' },
                { label: 'Worker', id: 'worker' }
              ].map((item) => (
                <button 
                  key={item.label}
                  onClick={() => {
                    if (['services', 'how-it-works', 'pricing'].includes(item.id)) {
                      scrollToSection(item.id);
                    } else {
                      setCurrentView(item.id as View);
                      setIsMenuOpen(false);
                    }
                  }}
                  className="block text-4xl font-display hover:text-brand-accent transition-colors text-left"
                >
                  {item.label}
                </button>
              ))}
              {isLoggedIn && (
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block text-4xl font-display text-red-500 hover:text-red-400 transition-colors text-left"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main>
        {renderView()}
      </main>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModal.isOpen} 
        onClose={() => setAuthModal({ ...authModal, isOpen: false })} 
        type={authModal.type} 
      />

      {/* Install Prompt */}
      <InstallPrompt />

      {/* Footer */}
      {currentView !== 'admin' && (
        <footer className="bg-brand-dark text-white py-20 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <Logo className="w-12 h-12" variant="light" />
                <h2 className="text-3xl font-display">BitNexus<span className="text-brand-accent">.</span></h2>
              </div>
              <p className="text-white/40 font-light max-w-sm leading-relaxed mb-8">
                BitNexus is the all-in-one platform designed to bring order to your daily life. At the nexus of service and technology, we empower you to manage your home with precision and ease.
              </p>
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-white/20">Contact Support</p>
                <p className="text-sm font-light text-white/60">dagogoekineprince@gmail.com</p>
                <p className="text-sm font-light text-white/60">Call: 07010698264</p>
                <p className="text-sm font-light text-white/60">WhatsApp: 07072127949</p>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 mb-6">Platform</h4>
              <ul className="space-y-4 text-sm font-light text-white/60">
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors">Services</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">How it Works</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Pricing</button></li>
                <li><button onClick={() => setCurrentView('help')} className="hover:text-white transition-colors">Help Center</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 mb-6">Company</h4>
              <ul className="space-y-4 text-sm font-light text-white/60">
                <li><button onClick={() => setCurrentView('about')} className="hover:text-white transition-colors">About Us</button></li>
                <li><button onClick={() => setCurrentView('terms')} className="hover:text-white transition-colors">Terms of Service</button></li>
                <li><button onClick={() => setCurrentView('privacy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => setCurrentView('admin-portal')} className="hover:text-brand-accent transition-colors">Admin Portal</button></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-white/30 uppercase tracking-widest">© 2026 BitNexus Platform. All rights reserved.</p>
            <div className="flex gap-6">
              {['Twitter', 'Instagram', 'LinkedIn'].map(s => (
                <button key={s} className="text-[10px] text-white/30 uppercase tracking-widest hover:text-white transition-colors">{s}</button>
              ))}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
