import React from 'react';

const Logo = ({ className = "w-8 h-8", variant = "dark" }: { className?: string, variant?: "dark" | "light" | "accent" }) => {
  const colors = {
    dark: "#0A0A0A",
    light: "#FFFFFF",
    accent: "#F27D26"
  };

  const color = colors[variant];

  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Abstract Nexus Symbol */}
      <path 
        d="M20 20V80L50 50L80 80V20" 
        stroke={color} 
        strokeWidth="12" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      {/* Digital 'Bit' Accent */}
      <rect 
        x="44" 
        y="15" 
        width="12" 
        height="12" 
        fill="#F27D26" 
        rx="2"
      />
      <circle 
        cx="50" 
        cy="50" 
        r="6" 
        fill="#F27D26" 
      />
    </svg>
  );
};

export default Logo;
