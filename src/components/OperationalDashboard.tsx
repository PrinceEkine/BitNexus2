import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  Ticket, 
  DollarSign, 
  Clock, 
  Star, 
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { formatCurrency, cn } from '../lib/utils';
import { useRealtime } from '../contexts/RealtimeContext';
import { useCurrency } from '../contexts/CurrencyContext';

const OperationalDashboard = () => {
  const { tickets, technicians, transactions } = useRealtime();
  const { currency, convert } = useCurrency();

  // Calculate Metrics
  const totalBookings = tickets.length;
  const completedBookings = tickets.filter(t => t.status === 'Completed').length;
  const completionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;
  
  const totalRevenue = transactions
    .filter(t => t.type === 'payment' && t.status !== 'failed')
    .reduce((acc, t) => acc + t.amount, 0);

  const activeTechnicians = technicians.filter(t => t.status === 'Active').length;
  const avgLoad = technicians.length > 0 
    ? technicians.reduce((acc, t) => acc + t.load, 0) / technicians.length 
    : 0;

  // Prepare Chart Data
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const chartData = last7Days.map(date => {
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
    const dayRevenue = transactions
      .filter(t => t.type === 'payment' && t.status !== 'failed' && t.created_at.startsWith(date))
      .reduce((acc, t) => acc + t.amount, 0);
    const dayBookings = tickets.filter(t => t.date && t.date.startsWith(date)).length;
    
    return {
      name: dayName,
      revenue: dayRevenue,
      bookings: dayBookings
    };
  });

  const stats = [
    { 
      label: 'Total Bookings', 
      value: totalBookings.toString(), 
      trend: '+14%', 
      positive: true, 
      icon: Ticket,
      detail: `${completedBookings} Completed`
    },
    { 
      label: 'Gross Revenue', 
      value: formatCurrency(convert(totalRevenue, 'NGN', currency), currency), 
      trend: '+8.2%', 
      positive: true, 
      icon: DollarSign,
      detail: 'Last 30 days'
    },
    { 
      label: 'Active Techs', 
      value: activeTechnicians.toString(), 
      trend: '-2', 
      positive: false, 
      icon: Users,
      detail: `${technicians.length} Total`
    },
    { 
      label: 'Avg System Load', 
      value: `${Math.round(avgLoad)}%`, 
      trend: 'Optimal', 
      positive: true, 
      icon: Activity,
      detail: 'Real-time'
    },
  ];

  return (
    <div className="space-y-12 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-xs uppercase tracking-[0.4em] text-brand-accent font-bold mb-4">Operations</h2>
          <h3 className="text-5xl font-display italic">System <span className="not-italic">Performance.</span></h3>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Feed Active
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-stone-200 bg-white">
        {stats.map((stat, i) => (
          <div key={i} className="p-8 border-r border-stone-200 last:border-r-0 group hover:bg-brand-dark hover:text-white transition-all duration-500">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-stone-50 group-hover:bg-white/10 transition-colors">
                <stat.icon className="w-5 h-5 text-brand-accent" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest",
                stat.positive ? "text-emerald-500" : "text-red-500"
              )}>
                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-1 group-hover:text-white/40">{stat.label}</p>
            <p className="text-4xl font-display italic mb-2 group-hover:text-white">{stat.value}</p>
            <p className="text-[10px] text-stone-300 uppercase tracking-widest group-hover:text-white/20">{stat.detail}</p>
          </div>
        ))}
      </div>

      {/* System Health Section */}
      <div className="bg-brand-ink text-white p-10 border border-stone-800 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h4 className="data-label text-white/40">Operational Integrity: Nominal</h4>
            </div>
            <h3 className="text-3xl font-display italic">System <span className="not-italic">Health.</span></h3>
          </div>
          
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex justify-between text-[10px] font-mono text-white/40 mb-2">
                <span>CPU LOAD</span>
                <span>42%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '42%' }} className="h-full bg-brand-accent" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-mono text-white/40 mb-2">
                <span>MEMORY</span>
                <span>1.2GB</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-emerald-500" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-mono text-white/40 mb-2">
                <span>LATENCY</span>
                <span>24ms</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '15%' }} className="h-full bg-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white border border-stone-200 p-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-1">Revenue Velocity</h4>
              <p className="text-xl font-display italic">Weekly Growth <span className="not-italic text-stone-300 text-sm">/ NGN</span></p>
            </div>
            <select className="bg-stone-50 border-none text-[10px] font-bold uppercase tracking-widest p-2 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F27D26" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F27D26" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#999', fontWeight: 'bold' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#999' }}
                  tickFormatter={(value) => `₦${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#141414', 
                    border: 'none', 
                    borderRadius: '0', 
                    color: '#fff',
                    fontSize: '10px',
                    padding: '12px'
                  }}
                  itemStyle={{ color: '#F27D26' }}
                  cursor={{ stroke: '#F27D26', strokeWidth: 1 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#F27D26" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Volume Bar Chart */}
        <div className="bg-white border border-stone-200 p-8">
          <div className="mb-10">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-1">Booking Volume</h4>
            <p className="text-xl font-display italic">Daily Requests</p>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#999', fontWeight: 'bold' }}
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                <Tooltip 
                  cursor={{ fill: '#f8f8f8' }}
                  contentStyle={{ 
                    backgroundColor: '#141414', 
                    border: 'none', 
                    borderRadius: '0', 
                    color: '#fff',
                    fontSize: '10px'
                  }}
                />
                <Bar dataKey="bookings" radius={[2, 2, 0, 0]} animationDuration={1500}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#F27D26' : '#141414'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Technician Performance Table */}
      <section className="bg-white border border-stone-200">
        <div className="p-8 border-b border-stone-200 flex justify-between items-center">
          <div>
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-1">Human Capital</h4>
            <p className="text-xl font-display italic">Technician Performance <span className="not-italic text-stone-300 text-sm">/ Efficiency Matrix</span></p>
          </div>
          <button className="text-[10px] uppercase tracking-widest font-bold text-brand-accent hover:underline">Full Report</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50">
                <th className="px-8 py-4 data-label border-b border-stone-200">Technician</th>
                <th className="px-8 py-4 data-label border-b border-stone-200">Specialty</th>
                <th className="px-8 py-4 data-label border-b border-stone-200 text-center">Jobs</th>
                <th className="px-8 py-4 data-label border-b border-stone-200 text-center">Rating</th>
                <th className="px-8 py-4 data-label border-b border-stone-200">Current Load</th>
                <th className="px-8 py-4 data-label border-b border-stone-200">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {technicians.map((tech) => (
                <tr key={tech.id} className="hover:bg-stone-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-stone-100 flex items-center justify-center text-[10px] font-bold">
                        {tech.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest">{tech.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] uppercase tracking-widest text-stone-400">{tech.specialty}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-xs font-mono">12</span> {/* Mock jobs completed */}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-3 h-3 fill-brand-accent text-brand-accent" />
                      <span className="text-xs font-bold">4.9</span> {/* Mock rating */}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-stone-100 h-1 max-w-[100px]">
                        <div 
                          className={cn(
                            "h-full transition-all duration-1000",
                            tech.load > 80 ? "bg-red-500" : tech.load > 50 ? "bg-brand-accent" : "bg-emerald-500"
                          )} 
                          style={{ width: `${tech.load}%` }} 
                        />
                      </div>
                      <span className="font-mono text-[10px] text-stone-400">{tech.load}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        tech.status === 'Active' ? 'bg-emerald-500' : tech.status === 'Idle' ? 'bg-blue-500' : 'bg-stone-300'
                      )} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{tech.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default OperationalDashboard;
