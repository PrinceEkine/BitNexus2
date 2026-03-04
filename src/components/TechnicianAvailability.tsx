import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, User, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { useRealtime } from '../contexts/RealtimeContext';

const TechnicianAvailability = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { technicians, updateTechnician } = useRealtime();
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfWeek(currentDate), i));

  const [availability, setAvailability] = useState<Record<string, Record<string, boolean>>>({
    '1': { '2026-03-01': true, '2026-03-02': true, '2026-03-03': false },
    '2': { '2026-03-01': true, '2026-03-02': false, '2026-03-03': true },
  });

  const [notes, setNotes] = useState<Record<string, string>>({
    '1': 'Prefers morning shifts',
    '2': 'On leave next week',
  });

  const toggleAvailability = (techId: string, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setAvailability(prev => ({
      ...prev,
      [techId]: {
        ...prev[techId],
        [dateStr]: !prev[techId]?.[dateStr]
      }
    }));
  };

  return (
    <div className="bg-white border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex justify-between items-center">
        <div>
          <h3 className="text-xs uppercase tracking-[0.3em] font-bold">Technician Availability</h3>
          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Manage weekly schedules and shift coverage</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentDate(subWeeks(currentDate, 1))} className="p-2 hover:bg-gray-50 rounded transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold uppercase tracking-widest">
            {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
          </span>
          <button onClick={() => setCurrentDate(addWeeks(currentDate, 1))} className="p-2 hover:bg-gray-50 rounded transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b border-gray-100 w-64">Technician</th>
              {weekDays.map((day, i) => (
                <th key={i} className="px-4 py-4 text-center border-b border-gray-100">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{format(day, 'EEE')}</p>
                  <p className="text-sm font-display">{format(day, 'd')}</p>
                </th>
              ))}
              <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b border-gray-100 min-w-[200px]">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {technicians.map((tech) => (
              <tr key={tech.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-[10px] font-bold">
                      {tech.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest">{tech.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">{tech.status}</p>
                    </div>
                  </div>
                </td>
                {weekDays.map((day, i) => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const isAvailable = availability[tech.id]?.[dateStr] ?? true;
                  return (
                    <td key={i} className="px-4 py-6 text-center">
                      <button 
                        onClick={() => toggleAvailability(tech.id, day)}
                        className={cn(
                          "w-10 h-10 rounded-none border flex items-center justify-center transition-all mx-auto",
                          isAvailable 
                            ? "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100" 
                            : "bg-red-50 border-red-100 text-red-600 hover:bg-red-100"
                        )}
                      >
                        {isAvailable ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </button>
                    </td>
                  );
                })}
                <td className="px-8 py-6">
                  <input 
                    type="text"
                    value={notes[tech.id] || ''}
                    onChange={(e) => setNotes(prev => ({ ...prev, [tech.id]: e.target.value }))}
                    placeholder="Add availability notes..."
                    className="w-full bg-transparent border-b border-transparent focus:border-brand-dark outline-none py-1 text-xs font-light transition-colors"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-8 bg-gray-50 flex justify-between items-center">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Unavailable</span>
          </div>
        </div>
        <button className="btn-primary py-2 px-6 text-[10px]">Save Changes</button>
      </div>
    </div>
  );
};

export default TechnicianAvailability;
