import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
  altBefore?: string;
  altAfter?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({
  beforeImage,
  afterImage,
  altBefore = 'Before',
  altAfter = 'After',
  beforeLabel = 'Before',
  afterLabel = 'After',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let newPosition = ((clientX - rect.left) / rect.width) * 100;
      newPosition = Math.max(0, Math.min(100, newPosition));
      setSliderPosition(newPosition);
    },
    [isDragging],
  );

  const handleMouseDown = () => { setIsDragging(true); setHasInteracted(true); };
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const handleTouchStart = () => { setIsDragging(true); setHasInteracted(true); };
  const handleTouchEnd = () => setIsDragging(false);
  const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  /* Auto-slide 2.5 cycles on mount to demonstrate the comparison */
  useEffect(() => {
    let animationId: number;
    const DURATION = 5500;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (hasInteracted) return;
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed < DURATION) {
        const progress = elapsed / DURATION;
        const position = 50 + 38 * Math.sin(progress * Math.PI * 2 * 2.5);
        setSliderPosition(position);
        animationId = requestAnimationFrame(animate);
      } else {
        setSliderPosition(50);
      }
    };

    const timeout = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, 600);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationId);
    };
  }, [hasInteracted]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto select-none rounded-2xl overflow-hidden shadow-2xl cursor-ew-resize"
      style={{ aspectRatio: '16/9' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Before label */}
      <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
        {beforeLabel}
      </div>
      {/* After label */}
      <div className="absolute top-4 right-4 z-20 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
        {afterLabel}
      </div>

      {/* After image (clipped) */}
      <div
        className="absolute top-0 left-0 h-full w-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={afterImage}
          alt={altAfter}
          className="h-full w-full object-cover object-center"
          draggable="false"
        />
      </div>

      {/* Before image (base) */}
      <img
        src={beforeImage}
        alt={altBefore}
        className="block h-full w-full object-cover object-center"
        draggable="false"
      />

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.4)]"
        style={{ left: `${sliderPosition}%` }}
      />

      {/* Drag handle */}
      <div
        className="absolute top-0 bottom-0 flex items-center justify-center"
        style={{ left: `calc(${sliderPosition}% - 1.5rem)` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div
          className={`bg-white rounded-full h-12 w-12 flex items-center justify-center shadow-xl border-2 border-white/80 transition-transform duration-150 ${isDragging ? 'scale-110' : 'scale-100'}`}
        >
          <ChevronsLeftRight size={20} className="text-slate-700" />
        </div>
      </div>
    </div>
  );
};
