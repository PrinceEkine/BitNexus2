import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Video, MapPin, Calendar, Clock, AlertCircle, ChevronLeft, ChevronRight, Check, Shield, Zap, Droplet, Wind, Home, Laptop, Wrench, Sparkles, Loader2 } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { analyzeIssue } from '../services/geminiService';
import { useRealtime } from '../contexts/RealtimeContext';

const BookingPage = ({ onBack }: { onBack: () => void }) => {
  const { createTicket } = useRealtime();
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    date: '',
    time: '',
    address: '',
    isLiveVideo: false,
    isEmergency: false,
  });

  const categories = [
    { id: 'elec', name: 'Electrical', icon: Zap, color: 'text-yellow-500' },
    { id: 'plum', name: 'Plumbing', icon: Droplet, color: 'text-blue-500' },
    { id: 'hvac', name: 'HVAC', icon: Wind, color: 'text-cyan-500' },
    { id: 'clean', name: 'Cleaning', icon: Home, color: 'text-emerald-500' },
    { id: 'tech', name: 'Tech Support', icon: Laptop, color: 'text-indigo-500' },
    { id: 'other', name: 'Other', icon: Wrench, color: 'text-gray-500' },
  ];

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.category !== '';
      case 2: return formData.description.length > 10;
      case 3: return formData.date !== '' && formData.time !== '' && formData.address !== '';
      default: return true;
    }
  };

  const handleSmartAnalyze = async () => {
    if (formData.description.length < 10) return;
    setIsAnalyzing(true);
    const result = await analyzeIssue(formData.description);
    if (result) {
      setAnalysisResult(result);
    }
    setIsAnalyzing(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate a bit of network delay for UX
    await new Promise(r => setTimeout(r, 1500));
    
    createTicket({
      customer: 'Sarah Jenkins', // Hardcoded for now, would be from auth
      service: categories.find(c => c.id === formData.category)?.name || 'General',
      description: formData.description,
      priority: formData.isEmergency ? 'Emergency' : 'Standard',
      date: `${formData.date}T${formData.time}:00Z`,
    });

    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(onBack, 3000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/20">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-5xl font-display italic mb-4">Request <span className="not-italic">Confirmed.</span></h2>
          <p className="text-stone-400 font-light tracking-widest uppercase text-xs">A specialist is being assigned in real-time.</p>
        </motion.div>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setFormData({ ...formData, category: cat.id });
                    setTimeout(nextStep, 300);
                  }}
                  className={cn(
                    "p-8 border text-left transition-all duration-500 group relative overflow-hidden",
                    formData.category === cat.id 
                      ? "border-brand-dark bg-brand-dark text-white" 
                      : "border-gray-100 hover:border-brand-dark bg-white"
                  )}
                >
                  <cat.icon className={cn(
                    "w-8 h-8 mb-6 transition-colors",
                    formData.category === cat.id ? "text-white" : cat.color
                  )} />
                  <span className="text-sm font-bold uppercase tracking-[0.2em] block">{cat.name}</span>
                  {formData.category === cat.id && (
                    <motion.div 
                      layoutId="active-cat"
                      className="absolute top-4 right-4"
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400">Describe the issue</label>
                <button 
                  onClick={handleSmartAnalyze}
                  disabled={isAnalyzing || formData.description.length < 10}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-accent hover:opacity-70 disabled:opacity-30 transition-all"
                >
                  {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  Smart Analyze
                </button>
              </div>
              <textarea 
                autoFocus
                className="w-full border-b border-gray-100 py-4 focus:border-brand-dark outline-none transition-colors resize-none h-40 font-light text-lg leading-relaxed"
                placeholder="What seems to be the problem?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <div className="flex justify-between items-start mt-2">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Minimum 10 characters</p>
                <AnimatePresence>
                  {analysisResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-brand-dark text-white p-4 max-w-xs text-left"
                    >
                      <p className="text-[8px] uppercase tracking-widest text-brand-accent font-bold mb-1">AI Suggestion</p>
                      <p className="text-xs font-bold mb-1">Category: {analysisResult.suggestedCategory}</p>
                      <p className="text-[10px] text-white/60 leading-relaxed mb-2">{analysisResult.summary}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] uppercase tracking-widest px-2 py-0.5 bg-white/10">Complexity: {analysisResult.complexity}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <button className="flex flex-col items-center justify-center gap-4 p-10 border border-dashed border-gray-100 hover:border-brand-dark transition-all group bg-gray-50/30">
                <Camera className="w-6 h-6 text-gray-300 group-hover:text-brand-dark transition-colors" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 group-hover:text-brand-dark">Add Photos</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-4 p-10 border border-dashed border-gray-100 hover:border-brand-dark transition-all group bg-gray-50/30">
                <Video className="w-6 h-6 text-gray-300 group-hover:text-brand-dark transition-colors" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 group-hover:text-brand-dark">Add Video</span>
              </button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">Preferred Date</label>
                <div className="relative">
                  <Calendar className="absolute left-0 top-4 w-4 h-4 text-gray-400" />
                  <input 
                    type="date" 
                    className="w-full border-b border-gray-100 py-4 pl-8 focus:border-brand-dark outline-none transition-colors font-light"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">Preferred Time</label>
                <div className="relative">
                  <Clock className="absolute left-0 top-4 w-4 h-4 text-gray-400" />
                  <input 
                    type="time" 
                    className="w-full border-b border-gray-100 py-4 pl-8 focus:border-brand-dark outline-none transition-colors font-light"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">Service Address</label>
              <div className="relative">
                <MapPin className="absolute left-0 top-4 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Enter your full address"
                  className="w-full border-b border-gray-100 py-4 pl-8 focus:border-brand-dark outline-none transition-colors font-light"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <div className="bg-gray-50 p-10 space-y-8">
              <div className="flex justify-between items-start border-b border-gray-200 pb-6">
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Service</h4>
                  <p className="text-xl font-display">{categories.find(c => c.id === formData.category)?.name}</p>
                </div>
                <button onClick={() => setStep(1)} className="text-[10px] uppercase tracking-widest font-bold text-brand-accent hover:underline">Change</button>
              </div>

              <div className="flex justify-between items-start border-b border-gray-200 pb-6">
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Schedule</h4>
                  <p className="text-sm font-light">{formData.date} at {formData.time}</p>
                </div>
                <button onClick={() => setStep(3)} className="text-[10px] uppercase tracking-widest font-bold text-brand-accent hover:underline">Change</button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-5 rounded-full relative transition-colors", formData.isLiveVideo ? "bg-brand-dark" : "bg-gray-200")}>
                      <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-transform", formData.isLiveVideo ? "right-1" : "left-1")} />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold">Live Video Consultation</span>
                  </div>
                  <button onClick={() => setFormData({ ...formData, isLiveVideo: !formData.isLiveVideo })} className="text-[10px] font-bold text-brand-accent">Toggle</button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-5 rounded-full relative transition-colors", formData.isEmergency ? "bg-red-600" : "bg-gray-200")}>
                      <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-transform", formData.isEmergency ? "right-1" : "left-1")} />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold">Emergency Service</span>
                  </div>
                  <button onClick={() => setFormData({ ...formData, isEmergency: !formData.isEmergency })} className="text-[10px] font-bold text-brand-accent">Toggle</button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-emerald-50 text-emerald-700">
              <Shield className="w-5 h-5 flex-shrink-0" />
              <p className="text-xs font-light">Your payment is held in escrow and only released when you're 100% satisfied.</p>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white pt-40 pb-32 px-8 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-24">
          <button 
            onClick={step === 1 ? onBack : prevStep}
            className="group flex items-center data-label hover:text-brand-accent transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s}
                className={cn(
                  "h-1 transition-all duration-700",
                  s === step ? "w-12 bg-brand-dark" : s < step ? "w-6 bg-brand-accent" : "w-6 bg-stone-100"
                )}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mb-20">
          <motion.h1 
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-display mb-6 italic leading-tight"
          >
            {step === 1 && "What do you need?"}
            {step === 2 && "Tell us more."}
            {step === 3 && "Where & When?"}
            {step === 4 && "Review & Confirm"}
          </motion.h1>
          <p className="text-stone-400 font-light tracking-wide text-xl max-w-2xl">
            {step === 1 && "Select a specialized category to begin your service request."}
            {step === 2 && "Detailed insights allow our technicians to prepare the necessary equipment."}
            {step === 3 && "Coordinate a deployment window that fits your schedule."}
            {step === 4 && "Finalize your request details before we assign a specialist."}
          </p>
        </div>

        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="mt-24 pt-16 border-t border-stone-100 flex justify-between items-center">
          <div className="data-label text-stone-300">
            Phase {step} of 4
          </div>
          
          {step < 4 ? (
            <button 
              disabled={!isStepValid()}
              onClick={nextStep}
              className={cn(
                "btn-primary py-5 px-12 flex items-center gap-4 transition-all",
                !isStepValid() && "opacity-20 cursor-not-allowed grayscale"
              )}
            >
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-primary py-5 px-16 text-base flex items-center gap-4"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Assignment"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
