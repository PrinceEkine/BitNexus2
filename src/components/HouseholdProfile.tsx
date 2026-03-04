import React, { useState } from 'react';
import { User, Home, Users, Settings, Plus, Trash2, Camera, MapPin, Mail, Phone, Shield } from 'lucide-react';
import { motion } from 'motion/react';

const HouseholdProfile = ({ onBack }: { onBack: () => void }) => {
  const [profile, setProfile] = useState({
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+234 801 234 5678',
    address: '12 Victoria Island, Lagos',
    householdSize: 4,
    preferences: ['Morning Services', 'Eco-friendly Products', 'No Pets'],
  });

  const [members, setMembers] = useState([
    { id: '1', name: 'James Jenkins', role: 'Spouse', access: 'Full' },
    { id: '2', name: 'Emily Jenkins', role: 'Child', access: 'Limited' },
    { id: '3', name: 'David Jenkins', role: 'Child', access: 'Limited' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <button onClick={onBack} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand-dark mb-4 flex items-center gap-2">
              ← Back to Dashboard
            </button>
            <h2 className="text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4">Account Settings</h2>
            <h3 className="text-4xl font-display">Household Profile</h3>
          </div>
          <button className="btn-primary py-3 px-8 flex items-center gap-2">
            Save Changes
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Profile Info */}
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-white p-10 border border-gray-100">
              <div className="flex items-center gap-8 mb-12">
                <div className="relative group">
                  <div className="w-24 h-24 bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                  <button className="absolute -right-2 -bottom-2 p-2 bg-brand-accent text-white rounded-full hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h4 className="text-2xl font-display mb-2">{profile.name}</h4>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Primary Account Owner</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 border border-transparent focus-within:border-brand-dark transition-colors">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <input type="email" value={profile.email} className="bg-transparent outline-none text-sm w-full" readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone Number</label>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 border border-transparent focus-within:border-brand-dark transition-colors">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <input type="tel" value={profile.phone} className="bg-transparent outline-none text-sm w-full" />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Home Address</label>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 border border-transparent focus-within:border-brand-dark transition-colors">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <input type="text" value={profile.address} className="bg-transparent outline-none text-sm w-full" />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-10 border border-gray-100">
              <div className="flex justify-between items-center mb-10">
                <h4 className="text-xs uppercase tracking-[0.3em] font-bold">Household Members</h4>
                <button className="text-[10px] font-bold uppercase tracking-widest text-brand-accent flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Member
                </button>
              </div>
              <div className="space-y-6">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-6 bg-gray-50 group hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold uppercase tracking-widest">{member.name}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{member.role} • {member.access} Access</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-red-50 hover:text-red-500 transition-colors rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-8">
            <section className="bg-white p-10 border border-gray-100">
              <h4 className="text-xs uppercase tracking-[0.3em] font-bold mb-8">Preferences</h4>
              <div className="space-y-4">
                {profile.preferences.map((pref, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50">
                    <span className="text-[10px] font-bold uppercase tracking-widest">{pref}</span>
                    <button className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
                <button className="w-full py-3 border border-dashed border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:border-brand-dark hover:text-brand-dark transition-all">
                  + Add Preference
                </button>
              </div>
            </section>

            <section className="bg-brand-dark text-white p-10">
              <div className="flex items-center gap-4 mb-8">
                <Shield className="w-6 h-6 text-brand-accent" />
                <h4 className="text-xs uppercase tracking-[0.3em] font-bold">Security</h4>
              </div>
              <p className="text-white/40 text-[10px] font-light leading-relaxed mb-8 uppercase tracking-widest">
                Two-factor authentication is active for all household members with "Full Access".
              </p>
              <button className="w-full py-3 border border-white/20 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-brand-dark transition-all">
                Change Password
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseholdProfile;
