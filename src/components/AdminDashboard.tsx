import React, { useState } from 'react';
import { LayoutDashboard, Ticket, Users, Settings, CreditCard, TrendingUp, Map, Star, MoreVertical, Calendar } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { useRealtime } from '../contexts/RealtimeContext';
import TechnicianAvailability from './TechnicianAvailability';
import TechnicianManagement from './TechnicianManagement';
import PricingControl from './PricingControl';
import ZonesManagement from './ZonesManagement';
import TicketDetails from './TicketDetails';
import ServiceCategories from './ServiceCategories';
import UserManagement from './UserManagement';
import FinancialDashboard from './FinancialDashboard';
import AIInsights from './AIInsights';

type AdminView = 'overview' | 'tickets' | 'technicians' | 'availability' | 'pricing' | 'zones' | 'ticket-details' | 'services' | 'users' | 'financials' | 'ai-insights';

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState<AdminView>('overview');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const { tickets, technicians, isConnected } = useRealtime();

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(tickets.length * 25000), trend: '+12.5%', icon: TrendingUp },
    { label: 'Active Tickets', value: tickets.filter(t => t.status !== 'Completed').length.toString(), trend: `${tickets.filter(t => t.status === 'Pending').length} Pending`, icon: Ticket },
    { label: 'Technicians', value: technicians.length.toString(), trend: `${technicians.filter(t => t.status === 'Active').length} Active`, icon: Users },
    { label: 'Avg Rating', value: '4.8', trend: 'Top Tier', icon: Star },
  ];

  const recentRequests = tickets.slice(0, 5);

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return (
          <div className="space-y-12">
            <header className="flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-display italic">Operational <span className="not-italic">Overview.</span></h2>
                <p className="data-label mt-2">Friday, October 24, 2023 • System Status: Optimal</p>
              </div>
              <div className="flex gap-4">
                <button className="btn-outline py-2 px-6">Export Data</button>
                <button className="btn-primary py-2 px-6">Live Monitor</button>
              </div>
            </header>

            {/* Stats Grid - Technical Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-stone-200">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-8 border-r border-stone-200 last:border-r-0 group hover:bg-brand-dark hover:text-white transition-all duration-500">
                  <div className="flex justify-between items-start mb-6">
                    <stat.icon className="w-5 h-5 text-brand-accent group-hover:text-white transition-colors" />
                    <span className="font-mono text-[10px] text-emerald-600 group-hover:text-emerald-400">{stat.trend}</span>
                  </div>
                  <p className="data-label mb-2 group-hover:text-white/40">{stat.label}</p>
                  <p className="text-3xl font-display italic group-hover:text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Ticket Management - Technical Grid */}
              <section className="lg:col-span-2 bg-white border border-stone-200">
                <div className="p-8 border-b border-stone-200 flex justify-between items-center">
                  <h3 className="data-label text-brand-ink">Real-time Queue</h3>
                  <button onClick={() => setActiveView('tickets')} className="data-label text-brand-accent hover:underline">Full Registry</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-50">
                        <th className="px-8 py-4 data-label border-b border-stone-200">ID</th>
                        <th className="px-8 py-4 data-label border-b border-stone-200">Service</th>
                        <th className="px-8 py-4 data-label border-b border-stone-200">Customer</th>
                        <th className="px-8 py-4 data-label border-b border-stone-200">Priority</th>
                        <th className="px-8 py-4 data-label border-b border-stone-200">Time</th>
                        <th className="px-8 py-4 border-b border-stone-200"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {recentRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-stone-50 transition-colors group">
                          <td className="px-8 py-6 font-mono text-[10px] text-stone-400">{req.id}</td>
                          <td className="px-8 py-6">
                            <p className="text-xs font-bold uppercase tracking-widest">{req.service}</p>
                          </td>
                          <td className="px-8 py-6 text-xs font-light italic">{req.customer}</td>
                          <td className="px-8 py-6">
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 border ${
                              req.priority === 'Emergency' ? 'border-red-200 text-red-600 bg-red-50' : 'border-blue-200 text-blue-600 bg-blue-50'
                            }`}>
                              {req.priority}
                            </span>
                          </td>
                          <td className="px-8 py-6 font-mono text-[10px]">{req.time}</td>
                          <td className="px-8 py-6 text-right">
                            <button 
                              onClick={() => { setSelectedTicketId(req.id); setActiveView('ticket-details'); }}
                              className="p-2 hover:bg-stone-200 transition-colors"
                            >
                              <MoreVertical className="w-4 h-4 text-stone-400" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Quick Availability Preview - Hardware Style */}
              <section className="bg-brand-dark text-white p-10 border border-stone-800">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="data-label text-white/40">Field Status</h3>
                  <button onClick={() => setActiveView('availability')} className="data-label text-brand-accent">Registry</button>
                </div>
                <div className="space-y-8">
                  {technicians.map((tech, i) => (
                    <div key={i} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]",
                            tech.status === 'Active' ? 'bg-emerald-500' : tech.status === 'Idle' ? 'bg-blue-500' : 'bg-stone-700'
                          )} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{tech.name}</span>
                        </div>
                        <span className="font-mono text-[10px] text-white/40">{tech.load}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-[1px]">
                        <div className={cn(
                          "h-full transition-all duration-1000",
                          tech.status === 'Active' ? 'bg-emerald-500' : tech.status === 'Idle' ? 'bg-blue-500' : 'bg-stone-700'
                        )} style={{ width: `${tech.load}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 pt-12 border-t border-white/5">
                  <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] leading-relaxed">
                    Active sessions are monitored via encrypted link. All field data is real-time.
                  </p>
                </div>
              </section>
            </div>
          </div>
        );
      case 'availability':
        return <TechnicianAvailability />;
      case 'technicians':
        return <TechnicianManagement />;
      case 'pricing':
        return <PricingControl />;
      case 'zones':
        return <ZonesManagement />;
      case 'services':
        return <ServiceCategories />;
      case 'users':
        return <UserManagement />;
      case 'financials':
        return <FinancialDashboard />;
      case 'ai-insights':
        return <AIInsights />;
      case 'ticket-details':
        return <TicketDetails onBack={() => setActiveView('overview')} />;
      default:
        return <div className="p-20 text-center text-gray-400 uppercase tracking-widest text-xs">Module Coming Soon</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-dark text-white flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <h1 className="text-2xl font-display tracking-tighter">BitNexus<span className="text-brand-accent">.</span></h1>
          <p className="text-[8px] uppercase tracking-[0.4em] text-white/40 mt-1">Operations</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'tickets', label: 'Tickets', icon: Ticket },
            { id: 'technicians', label: 'Technicians', icon: Users },
            { id: 'users', label: 'Users', icon: Star },
            { id: 'availability', label: 'Availability', icon: Calendar },
            { id: 'services', label: 'Services', icon: Settings },
            { id: 'financials', label: 'Financials', icon: CreditCard },
            { id: 'ai-insights', label: 'AI Insights', icon: TrendingUp },
            { id: 'zones', label: 'Zones', icon: Map },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveView(item.id as AdminView)}
              className={`w-full flex items-center gap-4 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                activeView === item.id ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
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
              <p className="text-[10px] font-bold uppercase tracking-widest">Admin User</p>
              <p className="text-[8px] text-white/40 uppercase tracking-widest">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        {renderActiveView()}
      </main>
    </div>
  );
};

export default AdminDashboard;
