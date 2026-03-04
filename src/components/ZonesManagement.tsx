import React from 'react';
import { motion } from 'motion/react';
import { Map, MapPin, Navigation, Users, Activity, Plus, MoreVertical } from 'lucide-react';

const ZonesManagement = () => {
  const zones = [
    { id: 'Z-01', name: 'Lagos Island', coverage: 'Ikoyi, Victoria Island, Oniru', techs: 5, activeJobs: 12, status: 'High Demand' },
    { id: 'Z-02', name: 'Lekki Phase 1', coverage: 'Lekki 1, Ikate, Agungi', techs: 4, activeJobs: 8, status: 'Normal' },
    { id: 'Z-03', name: 'Ikeja', coverage: 'GRA, Maryland, Oregun', techs: 3, activeJobs: 4, status: 'Low Supply' },
    { id: 'Z-04', name: 'Surulere', coverage: 'Adeniran Ogunsanya, Bode Thomas', techs: 2, activeJobs: 2, status: 'Normal' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4">Logistics</h2>
          <h3 className="text-4xl font-display">Service Zones</h3>
        </div>
        <button className="btn-primary py-3 px-6 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Zone
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {zones.map((zone) => (
            <div key={zone.id} className="bg-white border border-gray-100 p-8 hover:border-brand-dark transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-brand-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{zone.id}</p>
                    <h4 className="text-xl font-display">{zone.name}</h4>
                  </div>
                </div>
                <span className={`text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                  zone.status === 'High Demand' ? 'bg-red-100 text-red-600' : 
                  zone.status === 'Low Supply' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {zone.status}
                </span>
              </div>
              
              <p className="text-sm font-light text-gray-500 mb-8 uppercase tracking-widest leading-relaxed">
                Coverage: {zone.coverage}
              </p>
              
              <div className="flex items-center gap-12 pt-6 border-t border-gray-50">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-gray-300" />
                  <div>
                    <p className="text-sm font-bold">{zone.techs}</p>
                    <p className="text-[8px] text-gray-400 uppercase tracking-widest">Technicians</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-gray-300" />
                  <div>
                    <p className="text-sm font-bold">{zone.activeJobs}</p>
                    <p className="text-[8px] text-gray-400 uppercase tracking-widest">Active Jobs</p>
                  </div>
                </div>
                <div className="ml-auto">
                  <button className="text-[10px] font-bold uppercase tracking-widest text-brand-accent flex items-center gap-2">
                    Edit Boundaries <Navigation className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="space-y-8">
          <div className="bg-brand-dark text-white p-8">
            <h4 className="text-xs uppercase tracking-[0.3em] text-white/50 font-bold mb-6">Global Logistics</h4>
            <div className="space-y-6">
              <div className="p-6 border border-white/10 bg-white/5">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Total Coverage Area</p>
                <p className="text-2xl font-display">142.5 km²</p>
              </div>
              <div className="p-6 border border-white/10 bg-white/5">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Avg Response Time</p>
                <p className="text-2xl font-display">34 mins</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-8">
            <h4 className="text-xs uppercase tracking-[0.3em] font-bold mb-6">Zone Heatmap</h4>
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" 
                alt="Map Placeholder" 
                className="w-full h-full object-cover opacity-50 grayscale"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Map className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">Interactive Map Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ZonesManagement;
