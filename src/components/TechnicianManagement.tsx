import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Star, MapPin, Briefcase, TrendingUp, MoreVertical, Search, Filter, X, Trash2 } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { useRealtime } from '../contexts/RealtimeContext';

const TechnicianManagement = () => {
  const { technicians, createTechnician, deleteTechnician } = useRealtime();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTech, setNewTech] = useState({ name: '', specialty: 'Electrical' });

  const stats = [
    { label: 'Active Now', value: technicians.filter(t => t.status === 'Active').length.toString(), icon: Users },
    { label: 'Avg Rating', value: '4.8', icon: Star },
    { label: 'Top Zone', value: 'Lekki', icon: MapPin },
    { label: 'Total Earnings', value: formatCurrency(technicians.reduce((acc, t) => acc + (t.load * 1000), 0)), icon: TrendingUp },
  ];

  const handleAddTechnician = (e: React.FormEvent) => {
    e.preventDefault();
    createTechnician(newTech);
    setIsAddModalOpen(false);
    setNewTech({ name: '', specialty: 'Electrical' });
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4">Operations</h2>
          <h3 className="text-4xl font-display">Technician Network</h3>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search technicians..." 
              className="pl-12 pr-6 py-3 border border-gray-100 focus:border-brand-dark outline-none text-xs uppercase tracking-widest font-bold transition-colors w-64"
            />
          </div>
          <button className="btn-outline py-3 px-6 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary py-3 px-6"
          >
            Add Technician
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 border border-gray-100">
            <stat.icon className="w-5 h-5 text-brand-accent mb-4" />
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-display">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="bg-white border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Technician</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Specialty</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Rating</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Jobs</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Earnings</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Zone</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Status</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {technicians.map((tech) => (
                <tr key={tech.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                        {tech.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold uppercase tracking-widest">{tech.name}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{tech.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-light">{tech.specialty || 'Specialist'}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-brand-accent text-brand-accent" />
                      <span className="text-sm font-bold">4.8</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-light">12</td>
                  <td className="px-8 py-6 text-sm font-bold">{formatCurrency(tech.load * 1000)}</td>
                  <td className="px-8 py-6 text-sm font-light">Lagos</td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full",
                      tech.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 
                      tech.status === 'Idle' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                    )}>
                      {tech.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => deleteTechnician(tech.id)}
                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors"
                        title="Remove Technician"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Technician Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md p-10 overflow-hidden"
            >
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="absolute top-6 right-6 text-gray-400 hover:text-brand-dark transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-10">
                <h2 className="text-3xl font-display mb-2">Add Technician</h2>
                <p className="text-gray-500 font-light text-sm uppercase tracking-widest">Register a new specialist to the network</p>
              </div>

              <form onSubmit={handleAddTechnician} className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={newTech.name}
                    onChange={(e) => setNewTech({ ...newTech, name: e.target.value })}
                    className="w-full border-b border-gray-200 py-3 focus:border-brand-dark outline-none transition-colors font-light"
                    placeholder="e.g. David Okoro"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Specialty</label>
                  <select 
                    value={newTech.specialty}
                    onChange={(e) => setNewTech({ ...newTech, specialty: e.target.value })}
                    className="w-full border-b border-gray-200 py-3 focus:border-brand-dark outline-none transition-colors font-light bg-transparent"
                  >
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Carpentry">Carpentry</option>
                  </select>
                </div>

                <button type="submit" className="btn-primary w-full py-4 mt-4">
                  Register Technician
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TechnicianManagement;
