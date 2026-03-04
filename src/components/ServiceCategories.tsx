import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, MoreVertical, Settings, Zap, Droplet, Wind, Home, Laptop, Wrench, X, Trash2, Edit2, Check } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: any;
  baseFee: number;
  activeTechs: number;
  status: 'Active' | 'Inactive';
}

const iconMap = {
  Zap,
  Droplet,
  Wind,
  Home,
  Laptop,
  Wrench,
  Settings
};

const ServiceCategories = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 'C-01', name: 'Electrical', description: 'Wiring, repairs, and installations.', icon: Zap, baseFee: 15000, activeTechs: 5, status: 'Active' },
    { id: 'C-02', name: 'Plumbing', description: 'Pipe repairs, leaks, and drainage.', icon: Droplet, baseFee: 12000, activeTechs: 4, status: 'Active' },
    { id: 'C-03', name: 'HVAC', description: 'Air conditioning and heating systems.', icon: Wind, baseFee: 25000, activeTechs: 3, status: 'Active' },
    { id: 'C-04', name: 'Cleaning', description: 'Deep cleaning and maintenance.', icon: Home, baseFee: 8000, activeTechs: 8, status: 'Active' },
    { id: 'C-05', name: 'Tech Support', description: 'Device setup and troubleshooting.', icon: Laptop, baseFee: 20000, activeTechs: 2, status: 'Active' },
    { id: 'C-06', name: 'Handyman', description: 'General repairs and assembly.', icon: Wrench, baseFee: 10000, activeTechs: 4, status: 'Active' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    iconName: 'Wrench' as keyof typeof iconMap,
    baseFee: 0,
    status: 'Active' as 'Active' | 'Inactive'
  });

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        iconName: (Object.keys(iconMap).find(key => iconMap[key as keyof typeof iconMap] === category.icon) || 'Wrench') as keyof typeof iconMap,
        baseFee: category.baseFee,
        status: category.status
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        iconName: 'Wrench',
        baseFee: 0,
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const icon = iconMap[formData.iconName];

    if (editingCategory) {
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData, icon } 
          : cat
      ));
    } else {
      const newCategory: Category = {
        id: `C-0${categories.length + 1}`,
        ...formData,
        icon,
        activeTechs: 0
      };
      setCategories(prev => [...prev, newCategory]);
    }
    closeModal();
  };

  const deleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4">Configuration</h2>
          <h3 className="text-4xl font-display">Service Categories</h3>
        </div>
        <button 
          onClick={() => openModal()}
          className="btn-primary py-3 px-6 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white border border-gray-100 p-8 hover:border-brand-dark transition-all group relative">
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-12 bg-gray-50 flex items-center justify-center">
                <cat.icon className="w-5 h-5 text-brand-accent" />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openModal(cat)}
                  className="p-2 hover:bg-gray-50 rounded transition-colors text-gray-400 hover:text-brand-dark"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteCategory(cat.id)}
                  className="p-2 hover:bg-gray-50 rounded transition-colors text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="mb-8">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{cat.id}</p>
              <h4 className="text-xl font-display mb-2">{cat.name}</h4>
              <p className="text-xs text-gray-500 font-light line-clamp-2">{cat.description}</p>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Base Fee</span>
                <span className="text-sm font-bold">{formatCurrency(cat.baseFee)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Active Techs</span>
                <span className="text-sm font-bold">{cat.activeTechs}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Status</span>
                <span className={`text-[8px] font-bold uppercase tracking-widest ${cat.status === 'Active' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {cat.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white p-12 shadow-2xl"
            >
              <button 
                onClick={closeModal}
                className="absolute top-8 right-8 text-gray-400 hover:text-brand-dark transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-3xl font-display mb-8">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Category Name</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-100 p-4 text-sm outline-none focus:border-brand-dark transition-colors"
                    placeholder="e.g. Electrical"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Description</label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-gray-100 p-4 text-sm outline-none focus:border-brand-dark transition-colors h-24 resize-none"
                    placeholder="Brief description of services..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Base Fee (₦)</label>
                    <input 
                      type="number"
                      required
                      value={formData.baseFee}
                      onChange={e => setFormData({ ...formData, baseFee: parseInt(e.target.value) })}
                      className="w-full border border-gray-100 p-4 text-sm outline-none focus:border-brand-dark transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Status</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                      className="w-full border border-gray-100 p-4 text-sm outline-none focus:border-brand-dark transition-colors appearance-none bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">Select Icon</label>
                  <div className="flex flex-wrap gap-4">
                    {Object.keys(iconMap).map((iconName) => {
                      const Icon = iconMap[iconName as keyof typeof iconMap];
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => setFormData({ ...formData, iconName: iconName as keyof typeof iconMap })}
                          className={`w-12 h-12 flex items-center justify-center border transition-all ${
                            formData.iconName === iconName 
                              ? 'border-brand-dark bg-brand-dark text-white' 
                              : 'border-gray-100 text-gray-400 hover:border-brand-dark'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full py-4 mt-4">
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceCategories;
