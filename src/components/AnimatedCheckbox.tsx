import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const AnimatedCheckbox = ({ checked, onChange, className }: AnimatedCheckboxProps) => {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "w-5 h-5 border-2 flex items-center justify-center transition-colors duration-200",
        checked 
          ? "bg-brand-accent border-brand-accent" 
          : "bg-white border-stone-200 hover:border-brand-accent",
        className
      )}
    >
      <motion.div
        initial={false}
        animate={{ 
          scale: checked ? 1 : 0,
          opacity: checked ? 1 : 0,
          rotate: checked ? 0 : -45
        }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 30 
        }}
      >
        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
      </motion.div>
    </button>
  );
};

export default AnimatedCheckbox;
