import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Shield, User, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'Customer' | 'Technician' | 'Admin';
  status: 'Active' | 'Inactive';
  joinedDate: string;
  lastActive: string;
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Customer' | 'Technician' | 'Admin'>('All');

  const [users] = useState<UserData[]>([
    { id: 'U-101', name: 'Sarah Jenkins', email: 'sarah.j@example.com', role: 'Customer', status: 'Active', joinedDate: '2023-05-12', lastActive: '2 hours ago' },
    { id: 'U-102', name: 'John Doe', email: 'john.doe@bitnexus.com', role: 'Technician', status: 'Active', joinedDate: '2023-01-20', lastActive: '5 mins ago' },
    { id: 'U-103', name: 'Mike Ross', email: 'mike.r@example.com', role: 'Customer', status: 'Inactive', joinedDate: '2023-08-15', lastActive: '3 days ago' },
    { id: 'U-104', name: 'Admin User', email: 'admin@bitnexus.com', role: 'Admin', status: 'Active', joinedDate: '2022-12-01', lastActive: 'Now' },
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4">Administration</h2>
          <h3 className="text-4xl font-display">User Management</h3>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 border border-gray-100 outline-none focus:border-brand-dark transition-colors text-sm w-64"
            />
          </div>
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-6 py-3 border border-gray-100 outline-none focus:border-brand-dark transition-colors text-sm bg-white appearance-none"
          >
            <option value="All">All Roles</option>
            <option value="Customer">Customers</option>
            <option value="Technician">Technicians</option>
            <option value="Admin">Admins</option>
          </select>
        </div>
      </header>

      <div className="bg-white border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">User</th>
              <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Role</th>
              <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Status</th>
              <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Joined</th>
              <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Last Active</th>
              <th className="px-8 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest">{user.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <Shield className={`w-3 h-3 ${user.role === 'Admin' ? 'text-brand-accent' : 'text-gray-400'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{user.role}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    {user.status === 'Active' ? (
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-500" />
                    )}
                    <span className={`text-[8px] font-bold uppercase tracking-widest ${user.status === 'Active' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {user.status}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-[10px] font-light text-gray-500 uppercase tracking-widest">
                  {user.joinedDate}
                </td>
                <td className="px-8 py-6 text-[10px] font-light text-gray-500 uppercase tracking-widest">
                  {user.lastActive}
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 hover:bg-gray-100 rounded transition-colors opacity-0 group-hover:opacity-100">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
