import React from 'react';
import { TrendingUp, TrendingDown, CreditCard, DollarSign, ArrowUpRight, ArrowDownRight, MoreVertical, Download, Filter } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Mon', revenue: 450000, payouts: 320000 },
  { name: 'Tue', revenue: 520000, payouts: 380000 },
  { name: 'Wed', revenue: 480000, payouts: 350000 },
  { name: 'Thu', revenue: 610000, payouts: 420000 },
  { name: 'Fri', revenue: 550000, payouts: 390000 },
  { name: 'Sat', revenue: 720000, payouts: 510000 },
  { name: 'Sun', revenue: 680000, payouts: 480000 },
];

const FinancialDashboard = () => {
  const transactions = [
    { id: 'TX-9921', customer: 'Sarah Jenkins', amount: 15000, status: 'Completed', type: 'Service Fee', date: '2023-10-24' },
    { id: 'TX-9920', customer: 'Mike Ross', amount: 12000, status: 'Pending', type: 'Service Fee', date: '2023-10-24' },
    { id: 'TX-9919', customer: 'Technician: John Doe', amount: -8500, status: 'Completed', type: 'Payout', date: '2023-10-23' },
    { id: 'TX-9918', customer: 'Sarah Jenkins', amount: 25000, status: 'Refunded', type: 'Service Fee', date: '2023-10-23' },
  ];

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4">Financials</h2>
          <h3 className="text-4xl font-display">Revenue & Payouts</h3>
        </div>
        <div className="flex gap-4">
          <button className="btn-outline py-3 px-6 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="btn-primary py-3 px-6 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter Range
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Revenue', value: 4200000, trend: '+12.5%', icon: DollarSign, color: 'text-emerald-500' },
          { label: 'Total Payouts', value: 2850000, trend: '+8.2%', icon: CreditCard, color: 'text-blue-500' },
          { label: 'Escrow Balance', value: 1350000, trend: 'Safe', icon: TrendingUp, color: 'text-brand-accent' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-10 border border-gray-100 group hover:border-brand-dark transition-all">
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-12 bg-gray-50 flex items-center justify-center">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{stat.trend}</span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">{stat.label}</p>
            <p className="text-4xl font-display">{formatCurrency(stat.value)}</p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white border border-gray-100 p-12">
        <div className="flex justify-between items-center mb-12">
          <h3 className="text-xs uppercase tracking-[0.3em] font-bold">Revenue Trends</h3>
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-brand-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Payouts</span>
            </div>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
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
                tick={{ fontSize: 10, fontWeight: 600, fill: '#9ca3af' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 600, fill: '#9ca3af' }}
                tickFormatter={(val) => `₦${val/1000}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#141414', 
                  border: 'none', 
                  borderRadius: '0px',
                  color: '#fff',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#F27D26" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="payouts" stroke="#e5e7eb" strokeWidth={2} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction Table */}
      <section className="bg-white border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-xs uppercase tracking-[0.3em] font-bold">Recent Transactions</h3>
          <button className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Transaction ID</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Entity</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Type</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Amount</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Status</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold uppercase tracking-widest">{tx.id}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{tx.date}</p>
                  </td>
                  <td className="px-8 py-6 text-sm font-light">{tx.customer}</td>
                  <td className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">{tx.type}</td>
                  <td className="px-8 py-6">
                    <span className={`text-sm font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-brand-dark'}`}>
                      {formatCurrency(Math.abs(tx.amount))}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                      tx.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 
                      tx.status === 'Refunded' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
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
