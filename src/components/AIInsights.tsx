import React, { useState } from 'react';
import { Brain, Zap, AlertTriangle, TrendingUp, Users, Target, Sparkles, ChevronRight, BarChart3, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { generateOperationalInsights } from '../services/geminiService';

const demandData = [
  { category: 'Electrical', current: 45, predicted: 68 },
  { category: 'Plumbing', current: 32, predicted: 40 },
  { category: 'HVAC', current: 55, predicted: 85 },
  { category: 'Cleaning', current: 78, predicted: 82 },
  { category: 'Tech', current: 25, predicted: 30 },
];

const AIInsights = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    // Mocking some stats to send to Gemini
    const stats = {
      revenue: '₦4.2M',
      activeTickets: 24,
      technicians: 12,
      avgRating: 4.8,
      demandData
    };

    const newInsights = await generateOperationalInsights(stats);
    if (newInsights && newInsights.length > 0) {
      setInsights(newInsights);
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4">Intelligence Layer</h2>
          <h3 className="text-4xl font-display">AI Insights & Predictions</h3>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="btn-primary py-3 px-6 flex items-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isAnalyzing ? 'Analyzing Data...' : 'Run New Analysis'}
          </button>
        </div>
      </header>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {insights.length > 0 ? (
            insights.map((insight, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-10 relative overflow-hidden group ${
                  insight.type === 'alert' ? 'bg-red-50 border border-red-100' : 
                  insight.type === 'opportunity' ? 'bg-brand-dark text-white' : 
                  'bg-white border border-gray-100'
                }`}
              >
                {insight.type === 'opportunity' && (
                  <Brain className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform duration-700" />
                )}
                <div className="relative z-10">
                  <div className={`w-10 h-10 flex items-center justify-center mb-8 ${
                    insight.type === 'alert' ? 'bg-red-100 text-red-600' : 
                    insight.type === 'opportunity' ? 'bg-brand-accent text-white' : 
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {insight.type === 'alert' ? <AlertTriangle className="w-5 h-5" /> : 
                     insight.type === 'opportunity' ? <Zap className="w-5 h-5" /> : 
                     <Target className="w-5 h-5" />}
                  </div>
                  <h4 className={`text-xs uppercase tracking-[0.3em] font-bold mb-4 ${
                    insight.type === 'opportunity' ? 'text-white/60' : 'text-gray-400'
                  }`}>{insight.title}</h4>
                  <p className="text-2xl font-display mb-6">{insight.description}</p>
                  <button className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:gap-4 transition-all ${
                    insight.type === 'opportunity' ? 'text-brand-accent' : 'text-brand-dark'
                  }`}>
                    Take Action <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <>
              <div className="bg-brand-dark text-white p-10 relative overflow-hidden group">
                <Brain className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform duration-700" />
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-brand-accent flex items-center justify-center mb-8">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-xs uppercase tracking-[0.3em] font-bold mb-4">Demand Spike Alert</h4>
                  <p className="text-2xl font-display mb-6">HVAC demand predicted to rise 45% next week.</p>
                  <p className="text-sm text-white/60 font-light leading-relaxed mb-8">Based on seasonal weather patterns and historical data for the Lagos Island zone.</p>
                  <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-accent hover:gap-4 transition-all">
                    Prepare Technicians <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-100 p-10">
                <div className="w-10 h-10 bg-red-50 flex items-center justify-center mb-8">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400 mb-4">Risk Assessment</h4>
                <p className="text-2xl font-display mb-6 text-brand-dark">Fraud detection flagged 3 suspicious transactions.</p>
                <div className="space-y-4 mb-8">
                  {[
                    { id: 'TX-9912', risk: 'High', reason: 'IP Mismatch' },
                    { id: 'TX-9908', risk: 'Medium', reason: 'Rapid Booking' },
                  ].map((risk, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50">
                      <span className="text-[10px] font-bold uppercase tracking-widest">{risk.id}</span>
                      <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 ${risk.risk === 'High' ? 'text-red-600 bg-red-100' : 'text-orange-600 bg-orange-100'}`}>
                        {risk.risk} Risk
                      </span>
                    </div>
                  ))}
                </div>
                <button className="text-[10px] font-bold uppercase tracking-widest text-brand-dark hover:underline">Review All Flags</button>
              </div>

              <div className="bg-white border border-gray-100 p-10">
                <div className="w-10 h-10 bg-emerald-50 flex items-center justify-center mb-8">
                  <Target className="w-5 h-5 text-emerald-500" />
                </div>
                <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400 mb-4">Smart Assignment</h4>
                <p className="text-2xl font-display mb-6 text-brand-dark">Technician matching efficiency is up 22%.</p>
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Avg Match Time</span>
                    <span className="text-xl font-display">4.2 mins</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1">
                    <div className="bg-emerald-500 h-full w-[85%]" />
                  </div>
                  <p className="text-[10px] text-gray-400 font-light italic">"AI matching has saved 140+ man-hours this month."</p>
                </div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Demand Prediction Chart */}
      <div className="bg-white border border-gray-100 p-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold">Predictive Demand Analysis</h3>
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Next 7 Days Projection</p>
          </div>
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-brand-dark" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Predicted</span>
            </div>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={demandData} barGap={12}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 600, fill: '#9ca3af' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 600, fill: '#9ca3af' }}
              />
              <Tooltip 
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{ 
                  backgroundColor: '#141414', 
                  border: 'none', 
                  borderRadius: '0px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="current" fill="#e5e7eb" radius={[0, 0, 0, 0]} />
              <Bar dataKey="predicted" fill="#141414" radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
