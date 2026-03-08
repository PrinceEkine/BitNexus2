import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { formatCurrency, cn } from '../lib/utils';
import { useRealtime } from '../contexts/RealtimeContext';

const FinancialDashboard = () => {
  const { transactions } = useRealtime();

  const totalRevenue = transactions
    .filter(t => t.type === 'payment' && t.status !== 'failed')
    .reduce((acc, t) => acc + t.amount, 0);

  const escrowBalance = transactions
    .filter(t => t.status === 'escrow')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalPayouts = transactions
    .filter(t => t.type === 'payout' && t.status === 'paid')
    .reduce((acc, t) => acc + t.amount, 0);

  // Mock trend data based on transactions
  const trendData = [
    { name: 'Mon', revenue: 45000, payouts: 12000 },
    { name: 'Tue', revenue: 52000, payouts: 15000 },
    { name: 'Wed', revenue: 48000, payouts: 10000 },
    { name: 'Thu', revenue: 61000, payouts: 22000 },
    { name: 'Fri', revenue: 55000, payouts: 18000 },
    { name: 'Sat', revenue: 67000, payouts: 25000 },
    { name: 'Sun', revenue: 72000, payouts: 30000 },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4">Financials</h2>
        <h3 className="text-4xl font-display italic">Treasury <span className="not-italic">Overview.</span></h3>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, trend: '+12.5%', positive: true },
          { label: 'Escrow Balance', value: formatCurrency(escrowBalance), icon: Clock, trend: 'Active', positive: true },
          { label: 'Total Payouts', value: formatCurrency(totalPayouts), icon: CreditCard, trend: '-2.4%', positive: false },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 border border-gray-100 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <stat.icon className="w-5 h-5 text-brand-accent" />
                <span className={cn(
                  "text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full",
                  stat.positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-display">{stat.value}</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Revenue Trends</h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-accent" />
                <span className="text-[8px] uppercase tracking-widest font-bold">Gross</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F27D26" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F27D26" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: '0', fontSize: '10px' }}
                  itemStyle={{ color: '#F27D26', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#F27D26" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Payout Distribution</h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-dark" />
                <span className="text-[8px] uppercase tracking-widest font-bold">Net Payouts</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: '0', fontSize: '10px' }}
                />
                <Line type="monotone" dataKey="payouts" stroke="#141414" strokeWidth={2} dot={{ r: 4, fill: '#141414' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <section className="bg-white border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
          <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Recent Transactions</h4>
          <button className="text-[10px] uppercase tracking-widest font-bold text-brand-accent hover:underline">Export CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Reference</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Date</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Type</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Amount</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6 font-mono text-[10px]">{tx.reference}</td>
                  <td className="px-8 py-6 text-xs text-gray-500">{new Date(tx.created_at).toLocaleDateString()}</td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full",
                      tx.type === 'payment' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                    )}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold">{formatCurrency(tx.amount)}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      {tx.status === 'paid' && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                      {tx.status === 'escrow' && <Clock className="w-3 h-3 text-blue-500" />}
                      {tx.status === 'failed' && <AlertCircle className="w-3 h-3 text-red-500" />}
                      <span className="text-[10px] uppercase tracking-widest font-bold">{tx.status}</span>
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

export default FinancialDashboard;
