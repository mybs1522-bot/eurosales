import React from 'react';
import { FEATURES } from '../constants';
import { GlassCard } from './ui/GlassCard';

export const Features: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {FEATURES.map((feature, idx) => (
        <GlassCard 
          key={idx} 
          className={`p-6 flex flex-col items-start gap-4 hover:border-brand-primary/30 ${idx === 0 || idx === FEATURES.length -1 ? 'md:col-span-2 lg:col-span-1' : ''}`}
        >
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-brand-primary shadow-sm group-hover:scale-110 transition-transform">
            {feature.icon}
          </div>
          <div>
            <h4 className="text-lg font-bold font-display text-gray-900 mb-1">{feature.title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed font-light">{feature.description}</p>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};
