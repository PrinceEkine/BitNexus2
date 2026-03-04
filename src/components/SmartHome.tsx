import React, { useState } from 'react';
import { Lock, Unlock, Camera, Thermometer, Lightbulb, Power, Shield, Plus, RefreshCw, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';

const SmartHome = ({ onBack }: { onBack: () => void }) => {
  const [devices, setDevices] = useState([
    { id: '1', name: 'Main Entrance Lock', type: 'Lock', status: 'Locked', battery: '85%', lastActivity: '10 mins ago' },
    { id: '2', name: 'Living Room Camera', type: 'Camera', status: 'Online', battery: 'N/A', lastActivity: 'Live' },
    { id: '3', name: 'Smart Thermostat', type: 'Climate', status: '24°C', battery: '92%', lastActivity: 'Active' },
    { id: '4', name: 'Kitchen Lights', type: 'Lighting', status: 'Off', battery: 'N/A', lastActivity: '2 hours ago' },
  ]);

  const toggleLock = (id: string) => {
    setDevices(devices.map(d => 
      d.id === id ? { ...d, status: d.status === 'Locked' ? 'Unlocked' : 'Locked' } : d
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <button onClick={onBack} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand-dark mb-4 flex items-center gap-2">
              ← Back to Dashboard
            </button>
            <h2 className="text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4">Connected Home</h2>
            <h3 className="text-4xl font-display">Smart Devices</h3>
          </div>
          <button className="btn-primary py-3 px-8 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Device
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {devices.map((device) => (
            <div key={device.id} className="bg-white p-8 border border-gray-100 group hover:border-brand-dark transition-all">
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 bg-gray-50 flex items-center justify-center group-hover:bg-brand-dark group-hover:text-white transition-colors">
                  {device.type === 'Lock' && <Lock className="w-5 h-5" />}
                  {device.type === 'Camera' && <Camera className="w-5 h-5" />}
                  {device.type === 'Climate' && <Thermometer className="w-5 h-5" />}
                  {device.type === 'Lighting' && <Lightbulb className="w-5 h-5" />}
                </div>
                <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1">
                  {device.battery}
                </span>
              </div>
              
              <h4 className="text-xs font-bold uppercase tracking-widest mb-1">{device.name}</h4>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-6">{device.type} • {device.lastActivity}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <span className={`text-sm font-display ${device.status === 'Locked' || device.status === 'Off' ? 'text-gray-400' : 'text-brand-accent'}`}>
                  {device.status}
                </span>
                {device.type === 'Lock' && (
                  <button 
                    onClick={() => toggleLock(device.id)}
                    className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                  >
                    {device.status === 'Locked' ? <Unlock className="w-4 h-4 text-gray-400" /> : <Lock className="w-4 h-4 text-brand-accent" />}
                  </button>
                )}
                {device.type === 'Lighting' && (
                  <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                    <Power className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-brand-dark text-white p-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 flex items-center justify-center rounded-full">
              <Shield className="w-8 h-8 text-brand-accent" />
            </div>
            <div>
              <h4 className="text-xl font-display mb-2">Security Protocol Active</h4>
              <p className="text-white/40 text-sm font-light">All connected devices are monitored by BitNexus Security Layer.</p>
            </div>
          </div>
          <button className="px-8 py-4 border border-white/20 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-brand-dark transition-all flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Run Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartHome;
