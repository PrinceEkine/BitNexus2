import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LandingPage from './components/LandingPage';
import BookingPage from './components/BookingPage';
import CustomerDashboard from './components/CustomerDashboard';
import AdminDashboard from './components/AdminDashboard';
import WorkerDashboard from './components/WorkerDashboard';
import AuthModal from './components/AuthModal';
import InstallPrompt from './components/InstallPrompt';
import { Menu, X, User, LogOut } from 'lucide-react';
import { cn } from './lib/utils';
import { RealtimeProvider } from './contexts/RealtimeContext';

type View = 'landing' | 'booking' | 'dashboard' | 'admin' | 'worker';

export default function App() {
  return (
    <RealtimeProvider>
      <AppContent />
    </RealtimeProvider>
  );
}

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; type: 'login' | 'signup' }>({
    isOpen: false,
    type: 'login',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'customer' | 'admin' | 'worker'>('customer');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  // Simple routing simulation
  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onBookNow={() => setCurrentView('booking')} />;
      case 'booking':
        return <BookingPage onBack={() => setCurrentView('landing')} />;
      case 'dashboard':
        return <CustomerDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'worker':
        return <WorkerDashboard />;
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

  return (
    <div className="relative font-sans">
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
              "text-2xl font-display tracking-tighter transition-colors duration-500",
              (currentView === 'landing' && !isScrolled) ? "text-white" : "text-brand-dark"
            )}
          >
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
                  onClick={() => {
                    if (userRole === 'admin') setCurrentView('admin');
                    else if (userRole === 'worker') setCurrentView('worker');
                    else setCurrentView('dashboard');
                  }}
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition-colors duration-500",
                    (currentView === 'landing' && !isScrolled) ? "text-white" : "text-brand-dark"
                  )}
                >
                  <User className="w-4 h-4" /> Dashboard
                </button>
                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
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
                {/* DEV TOGGLES */}
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => { setIsLoggedIn(true); setUserRole('admin'); setCurrentView('admin'); }}
                    className="text-[8px] text-gray-400 opacity-20 hover:opacity-100 text-left"
                  >
                    Admin Mode
                  </button>
                  <button 
                    onClick={() => { setIsLoggedIn(true); setUserRole('worker'); setCurrentView('worker'); }}
                    className="text-[8px] text-gray-400 opacity-20 hover:opacity-100 text-left"
                  >
                    Worker Mode
                  </button>
                </div>
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
                  className="block text-4xl font-display hover:text-brand-accent transition-colors"
                >
                  {item.label}
                </button>
              ))}
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
              <h2 className="text-3xl font-display mb-6">BitNexus<span className="text-brand-accent">.</span></h2>
              <p className="text-white/40 font-light max-w-sm leading-relaxed">
                BitNexus is the all-in-one platform designed to bring order to your daily life. At the nexus of service and technology, we empower you to manage your home with precision and ease.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 mb-6">Platform</h4>
              <ul className="space-y-4 text-sm font-light text-white/60">
                <li><button className="hover:text-white transition-colors">Services</button></li>
                <li><button className="hover:text-white transition-colors">Technicians</button></li>
                <li><button className="hover:text-white transition-colors">Pricing</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 mb-6">Company</h4>
              <ul className="space-y-4 text-sm font-light text-white/60">
                <li><button className="hover:text-white transition-colors">About Us</button></li>
                <li><button className="hover:text-white transition-colors">Contact</button></li>
                <li><button className="hover:text-white transition-colors">Privacy Policy</button></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-white/30 uppercase tracking-widest">© 2023 BitNexus Platform. All rights reserved.</p>
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
