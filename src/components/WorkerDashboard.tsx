import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle, 
  Play, 
  Pause, 
  AlertCircle, 
  DollarSign, 
  TrendingUp, 
  User, 
  Settings, 
  LogOut,
  ChevronRight,
  Camera,
  MessageSquare,
  Menu,
  X
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useRealtime } from '../contexts/RealtimeContext';
import { PushNotificationManager } from './PushNotificationManager';
import { toast } from 'sonner';

type WorkerTab = 'jobs' | 'earnings' | 'performance' | 'profile' | 'settings';

const WorkerDashboard = ({ onLogout }: { onLogout?: () => void }) => {
  const [activeTab, setActiveTab] = useState<WorkerTab>('jobs');
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { tickets, technicians, updateTicket, updateTechnician, currentUser } = useRealtime();

  if (!currentUser) return null;

  const handleTabChange = (tab: WorkerTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  // Filter jobs assigned to this worker
  const myJobs = tickets.filter(t => t.technician_id === currentUser.id);

  const stats = [
    { label: 'Today Earnings', value: myJobs.filter(t => t.status === 'Completed').length * 15000, icon: DollarSign, trend: '+15%' },
    { label: 'Jobs Completed', value: myJobs.filter(t => t.status === 'Completed').length, icon: CheckCircle, trend: 'This Month' },
    { label: 'Avg Rating', value: 4.9, icon: TrendingUp, trend: 'Top 5%' },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'jobs':
        return (
          <div className="space-y-12">
            <header className="flex justify-between items-end">
              <div>
                <h2 className="data-label text-brand-accent mb-4">Field Operations</h2>
                <h3 className="text-4xl font-display italic">Mission <span className="not-italic">Control.</span></h3>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => toast.info('Loading job history...', { description: 'Fetching your past performance data.' })}
                  className="btn-outline py-3 px-6"
                >
                  History
                </button>
                <button 
                  onClick={() => toast.warning('Status change requested', { description: 'You are now marked as offline.' })}
                  className="btn-primary py-3 px-6"
                >
                  Go Offline
                </button>
              </div>
            </header>

            {/* Active Job Banner - Hardware Style */}
            {activeJobId && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="bg-brand-ink text-white p-10 border border-stone-800 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-accent" />
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                    <span className="data-label text-red-500">Live Session Active</span>
                  </div>
                  <span className="font-mono text-[10px] text-white/40">ELAPSED: 00:42:15</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                  <div>
                    <h4 className="text-3xl font-display mb-3 italic">{myJobs.find(j => j.id === activeJobId)?.service}</h4>
                    <p className="text-sm text-white/50 font-light flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> 12 Victoria Island, Lagos
                    </p>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button 
                      onClick={() => toast.info('Camera interface opening...', { description: 'Prepare to capture job evidence.' })}
                      className="flex-1 md:flex-none p-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <Camera className="w-5 h-5 mx-auto" />
                    </button>
                    <button 
                      onClick={() => toast.info('Opening secure channel...', { description: 'Connecting to customer support.' })}
                      className="flex-1 md:flex-none p-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <MessageSquare className="w-5 h-5 mx-auto" />
                    </button>
                    <button 
                      onClick={() => {
                        if (activeJobId) {
                          updateTicket(activeJobId, { status: 'Completed' });
                          setActiveJobId(null);
                        }
                      }}
                      className="flex-[2] md:flex-none bg-brand-accent text-white px-10 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-brand-dark transition-all"
                    >
                      Complete Mission
                    </button>
                  </div>
                </div>
                
                {/* Hardware Details */}
                <div className="mt-10 pt-10 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div>
                    <p className="data-label text-white/20 mb-1">Customer</p>
                    <p className="text-xs font-bold uppercase tracking-widest">{myJobs.find(j => j.id === activeJobId)?.customer_name}</p>
                  </div>
                  <div>
                    <p className="data-label text-white/20 mb-1">Priority</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-red-500">{myJobs.find(j => j.id === activeJobId)?.priority}</p>
                  </div>
                  <div>
                    <p className="data-label text-white/20 mb-1">Est. Value</p>
                    <p className="font-mono text-xs">{formatCurrency(myJobs.find(j => j.id === activeJobId)?.amount || 0)}</p>
                  </div>
                  <div>
                    <p className="data-label text-white/20 mb-1">Protocol</p>
                    <p className="text-xs font-bold uppercase tracking-widest">Standard-A1</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Jobs List - Technical Grid */}
              <div className="lg:col-span-2 space-y-8">
                <h4 className="data-label">Pending Assignments</h4>
                {myJobs.map((job) => (
                  <div key={job.id} className="bg-white border border-stone-200 p-10 group hover:border-brand-dark transition-all relative">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <span className={cn(
                            "text-[9px] font-bold uppercase tracking-widest px-3 py-1 border",
                            job.priority === 'Emergency' ? 'border-red-200 text-red-600 bg-red-50' : 'border-blue-200 text-blue-600 bg-blue-50'
                          )}>
                            {job.priority}
                          </span>
                          <span className="font-mono text-[10px] text-stone-400">{job.id}</span>
                        </div>
                        <h4 className="text-2xl font-display italic">{job.service}</h4>
                      </div>
                      <p className="font-mono text-lg text-brand-ink">{formatCurrency(job.amount)}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                      <div className="flex items-center gap-4 p-4 bg-stone-50 border border-stone-100">
                        <Clock className="w-5 h-5 text-stone-400" />
                        <div>
                          <p className="data-label mb-1">Scheduled Window</p>
                          <p className="text-xs font-bold uppercase tracking-widest">{new Date(job.date).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-stone-50 border border-stone-100">
                        <MapPin className="w-5 h-5 text-stone-400" />
                        <div>
                          <p className="data-label mb-1">Deployment Zone</p>
                          <p className="text-xs font-bold uppercase tracking-widest">Victoria Island</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-10 border-t border-stone-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-none bg-stone-100 flex items-center justify-center border border-stone-200">
                          <User className="w-5 h-5 text-stone-400" />
                        </div>
                        <div>
                          <p className="data-label mb-0.5">Contact</p>
                          <span className="text-xs font-bold uppercase tracking-widest">{job.customer_name}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          updateTicket(job.id, { status: 'In Progress', technician_name: currentUser.full_name });
                          setActiveJobId(job.id);
                        }}
                        disabled={!!activeJobId || job.status === 'Completed'}
                        className="btn-primary py-3 px-8 disabled:opacity-30"
                      >
                        {activeJobId === job.id ? 'Active' : job.status === 'Completed' ? 'Done' : 'Engage'} <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sidebar Stats - Technical Style */}
              <div className="space-y-12">
                <div className="bg-brand-ink text-white p-10 border border-stone-800">
                  <h4 className="data-label text-white/40 mb-10">Performance Metrics</h4>
                  <div className="space-y-10">
                    {stats.map((stat, i) => (
                      <div key={i} className="group">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-4">
                            <stat.icon className="w-4 h-4 text-brand-accent" />
                            <span className="data-label text-white/40 group-hover:text-white transition-colors">{stat.label}</span>
                          </div>
                          <span className="font-mono text-[10px] text-emerald-500">{stat.trend}</span>
                        </div>
                        <p className="text-3xl font-display italic">{typeof stat.value === 'number' && stat.label.includes('Earnings') ? formatCurrency(stat.value) : stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-10 border border-dashed border-stone-300 bg-stone-50">
                  <div className="flex items-center gap-4 mb-6">
                    <AlertCircle className="w-5 h-5 text-brand-ink" />
                    <h4 className="data-label text-brand-ink">Operational Protocol</h4>
                  </div>
                  <p className="text-xs text-stone-500 font-light leading-relaxed italic">
                    "Completing jobs within the scheduled window increases your priority for emergency requests by 15%. All field data is logged for quality assurance."
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'earnings':
        return (
          <div className="space-y-12">
            <header>
              <h2 className="data-label text-brand-accent mb-4">Financials</h2>
              <h3 className="text-4xl font-display italic">Earnings <span className="not-italic">Registry.</span></h3>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white border border-stone-200 p-8">
                <p className="data-label text-stone-400 mb-2">Available for Withdrawal</p>
                <p className="text-3xl font-display italic">{formatCurrency(45000)}</p>
                <button 
                  onClick={() => toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
                    loading: 'Processing withdrawal request...',
                    success: 'Withdrawal initiated! Funds will arrive in 24h.',
                    error: 'Withdrawal failed. Please check your bank details.'
                  })}
                  className="w-full mt-6 btn-primary py-3 text-[10px]"
                >
                  Withdraw Funds
                </button>
              </div>
              <div className="bg-stone-50 border border-stone-200 p-8">
                <p className="data-label text-stone-400 mb-2">Pending Clearance</p>
                <p className="text-3xl font-display italic text-stone-400">{formatCurrency(12500)}</p>
              </div>
              <div className="bg-stone-50 border border-stone-200 p-8">
                <p className="data-label text-stone-400 mb-2">Total Earned (MTD)</p>
                <p className="text-3xl font-display italic text-stone-400">{formatCurrency(158000)}</p>
              </div>
            </div>

            <div className="bg-white border border-stone-200">
              <div className="p-8 border-b border-stone-200">
                <h4 className="data-label">Recent Transactions</h4>
              </div>
              <div className="p-20 text-center">
                <DollarSign className="w-12 h-12 text-gray-200 mx-auto mb-6" />
                <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400">Transaction History Coming Soon</h3>
              </div>
            </div>
          </div>
        );
      case 'performance':
        return (
          <div className="space-y-12">
            <header>
              <h2 className="data-label text-brand-accent mb-4">Analytics</h2>
              <h3 className="text-4xl font-display italic">Performance <span className="not-italic">Metrics.</span></h3>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white border border-stone-200 p-10">
                <h4 className="data-label mb-8">Job Completion Velocity</h4>
                <div className="h-64 flex items-end gap-2">
                  {[45, 60, 40, 75, 50, 85, 70].map((h, i) => (
                    <div key={i} className="flex-1 bg-stone-100 relative group">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        className="absolute bottom-0 left-0 w-full bg-brand-dark group-hover:bg-brand-accent transition-colors"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-[8px] uppercase tracking-widest text-stone-400">
                  <span>Mon</span>
                  <span>Sun</span>
                </div>
              </div>

              <div className="bg-brand-ink text-white p-10">
                <h4 className="data-label text-white/40 mb-8">Quality Score</h4>
                <div className="flex items-center justify-center h-64">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle className="text-white/5 stroke-current" strokeWidth="2" fill="transparent" r="45" cx="50" cy="50" />
                      <circle className="text-brand-accent stroke-current" strokeWidth="2" strokeDasharray="283" strokeDashoffset="28" strokeLinecap="round" fill="transparent" r="45" cx="50" cy="50" transform="rotate(-90 50 50)" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-display italic">4.9</span>
                      <span className="data-label text-white/40">Rating</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-brand-dark text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-display tracking-tighter">BitNexus<span className="text-brand-accent">.</span></h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-0 z-40 lg:relative lg:z-auto w-64 bg-brand-dark text-white flex flex-col transition-transform duration-300 lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 hidden lg:block">
          <h1 className="text-2xl font-display tracking-tighter">BitNexus<span className="text-brand-accent">.</span></h1>
          <p className="text-[8px] uppercase tracking-[0.4em] text-white/40 mt-1">Worker Portal</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'jobs', label: 'My Jobs', icon: Calendar },
            { id: 'performance', label: 'Performance', icon: TrendingUp },
            { id: 'earnings', label: 'Earnings', icon: DollarSign },
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => handleTabChange(item.id as WorkerTab)}
              className={`w-full flex items-center gap-4 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                activeTab === item.id ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-white/5">
          <PushNotificationManager />
        </div>

        <div className="p-8 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-[10px] font-bold">
                {currentUser.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest">{currentUser.full_name || 'User'}</p>
                <p className="text-[8px] text-white/40 uppercase tracking-widest">Technician</p>
              </div>
            </div>
            <button 
              onClick={() => {
                if (onLogout) {
                  onLogout();
                } else {
                  toast.success('Logging out of secure session...');
                  setTimeout(() => window.location.reload(), 1000);
                }
              }}
              className="p-2 text-white/20 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
        {renderTab()}
      </main>
    </div>
  );
};

export default WorkerDashboard;
