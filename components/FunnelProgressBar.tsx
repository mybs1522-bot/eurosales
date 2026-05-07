import React, { useEffect, useState } from 'react';

interface FunnelProgressBarProps {
  /** Current step: 1 = render-upsell, 2 = onetime, 3 = offer */
  step: 1 | 2 | 3;
}

const STEPS = [
  { pct: 33,  label: 'Step 1 of 3', msg: 'Almost there — one exclusive upgrade below' },
  { pct: 66,  label: 'Step 2 of 3', msg: 'Great choice! One more upgrade available' },
  { pct: 90,  label: 'Final Step',  msg: "You're 90% done — grab this before it's gone" },
];

const FunnelProgressBar: React.FC<FunnelProgressBarProps> = ({ step }) => {
  const { pct, label, msg } = STEPS[step - 1];
  const [animated, setAnimated] = useState(0);

  // Animate the bar on mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(pct), 80);
    return () => clearTimeout(timer);
  }, [pct]);

  return (
    <div className="w-full bg-white border-b border-slate-100 px-4 py-2.5 sticky top-0 z-[65] shadow-sm">
      <div className="max-w-3xl mx-auto">
        {/* Label row */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400">
            {label}
          </span>
          <span className="text-[10px] md:text-[11px] font-bold text-orange-500 flex items-center gap-1">
            <span
              className="tabular-nums transition-all duration-700"
              style={{ opacity: animated > 0 ? 1 : 0 }}
            >
              {pct}%
            </span>
            <span className="text-slate-400 font-normal hidden sm:inline">— {msg}</span>
          </span>
        </div>

        {/* Track */}
        <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
          {/* Glow layer */}
          <div
            className="absolute inset-y-0 left-0 rounded-full blur-sm opacity-60 transition-all duration-700 ease-out"
            style={{
              width: `${animated}%`,
              background: 'linear-gradient(90deg, #f97316, #fb923c)',
            }}
          />
          {/* Solid bar */}
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${animated}%`,
              background: 'linear-gradient(90deg, #ea580c, #f97316, #fb923c)',
            }}
          />
          {/* Shimmer sweep */}
          <div
            className="absolute inset-y-0 rounded-full overflow-hidden transition-all duration-700 ease-out"
            style={{ width: `${animated}%` }}
          >
            <div
              className="absolute inset-y-0 w-1/3"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                animation: 'shimmer 2s infinite',
                left: '-33%',
              }}
            />
          </div>
          {/* Pulse dot at tip */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_6px_2px_rgba(249,115,22,0.5)] transition-all duration-700 ease-out"
            style={{ left: `${animated}%` }}
          />
        </div>

        {/* Mobile msg */}
        <p className="text-[9px] text-slate-400 font-medium mt-1 sm:hidden">{msg}</p>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { left: -33%; }
          100% { left: 133%; }
        }
      `}</style>
    </div>
  );
};

export default FunnelProgressBar;
