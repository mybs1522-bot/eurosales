import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = false }) => {
  return (
    <div 
      className={`
        relative overflow-hidden
        bg-white border border-gray-100
        rounded-2xl shadow-lg
        ${hoverEffect ? 'transition-all duration-300 hover:shadow-glow hover:border-brand-accent/20 hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent pointer-events-none opacity-50" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
