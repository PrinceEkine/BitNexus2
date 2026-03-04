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
  MessageSquare
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useRealtime } from '../contexts/RealtimeContext';

type WorkerTab = 'jobs' | 'earnings' | 'profile' | 'settings';

const WorkerDashboard = () => {
  const [activeTab, setActiveTab] = useState<WorkerTab>('jobs');
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const { tickets, technicians, updateTicket, updateTechnician } = useRealtime();

  // Filter jobs assigned to this worker (hardcoded as David Okoro for now)
  const workerName = 'David Okoro';
  const myJobs = tickets.filter(t => t.technician === workerName || t.status === 'Pending');

  const stats = [
    { label: 'Today Earnings', value: tickets.filter(t => t.technician === workerName && t.status === 'Completed').length * 15000, icon: DollarSign, trend: '+15%' },
    { label: 'Jobs Completed', value: tickets.filter(t => t.technician === workerName && t.status === 'Completed').length, icon: CheckCircle, trend: 'This Month' },
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
                <button className="btn-outline py-3 px-6">History</button>
                <button className="btn-primary py-3 px-6">Go Offline</button>
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
                    <h4 className="text-3xl font-display mb-3 italic">Electrical Repair</h4>
                    <p className="text-sm text-white/50 font-light flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> 12 Victoria Island, Lagos
                    </p>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none p-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"><Camera className="w-5 h-5 mx-auto" /></button>
                    <button className="flex-1 md:flex-none p-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"><MessageSquare className="w-5 h-5 mx-auto" /></button>
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
                    <p className="text-xs font-bold uppercase tracking-widest">Sarah Jenkins</p>
                  </div>
                  <div>
                    <p className="data-label text-white/20 mb-1">Priority</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-red-500">Emergency</p>
                  </div>
                  <div>
                    <p className="data-label text-white/20 mb-1">Est. Value</p>
                    <p className="font-mono text-xs">₦15,000.00</p>
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
                      <p className="font-mono text-lg text-brand-ink">{formatCurrency(15000)}</p>
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
                          <span className="text-xs font-bold uppercase tracking-widest">{job.customer}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          updateTicket(job.id, { status: 'In Progress', technician: workerName });
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
          <div className="p-20 text-center">
            <DollarSign className="w-12 h-12 text-gray-200 mx-auto mb-6" />
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400">Earnings Module Coming Soon</h3>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-dark text-white flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <h1 className="text-2xl font-display tracking-tighter">BitNexus<span className="text-brand-accent">.</span></h1>
          <p className="text-[8px] uppercase tracking-[0.4em] text-white/40 mt-1">Worker Portal</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'jobs', label: 'My Jobs', icon: Calendar },
            { id: 'earnings', label: 'Earnings', icon: DollarSign },
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as WorkerTab)}
              className={`w-full flex items-center gap-4 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                activeTab === item.id ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-8 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-accent"></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest">John Doe</p>
              <p className="text-[8px] text-white/40 uppercase tracking-widest">Technician</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        {renderTab()}
      </main>
    </div>
  );
};

export default WorkerDashboard;
