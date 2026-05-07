import React, { useState, useEffect } from 'react';

const AnimatedGrid = () => {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setOffset(prev => (prev + 0.5) % 40), 80);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 50%, transparent 0%, #0a0a0a 55%, #0a0a0a 100%), linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)`, backgroundSize: 'cover, 40px 40px, 40px 40px', backgroundPosition: `center, ${offset}px ${offset}px, ${offset}px ${offset}px` }} />
    </div>
  );
};

interface PhotoCardProps {
  src: string;
  label: string;
  rotation: number;
  index: number;
  style?: React.CSSProperties;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ src, label, rotation, index, style = {} }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 400 + index * 350);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      className="absolute w-[148px] h-[220px] bg-white p-2 rounded-md shadow-2xl cursor-pointer"
      style={{ transform: `rotate(${isHovered ? rotation + 2 : rotation}deg) scale(${isHovered ? 1.06 : 1})`, zIndex: isHovered ? 20 : index + 1, transition: 'all 0.3s ease-out', opacity: isVisible ? 1 : 0, ...style }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full h-[82%] bg-gray-100 rounded-sm overflow-hidden">
        <img src={src} alt={label} className="w-full h-full object-cover" style={{ transform: isHovered ? 'scale(1.04)' : 'scale(1)', transition: 'transform 0.3s ease' }} onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/148x180/e2e8f0/94a3b8?text=Image'; }} />
      </div>
      <div className="h-[18%] flex items-center justify-center">
        <p className="text-sm font-bold text-gray-700 tracking-wide text-center uppercase">{label}</p>
      </div>
    </div>
  );
};

interface CardLoaderProps {
  designImage: string;
  renderImage: string;
}

export const CardLoader: React.FC<CardLoaderProps> = ({ designImage, renderImage }) => (
  <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
    <AnimatedGrid />
    <div className="relative z-10 flex flex-col items-center gap-10">
      <div className="relative w-[320px] h-[280px] flex items-center justify-center">
        <PhotoCard src={designImage} label="Design" rotation={-10} index={0} style={{ top: '30px', left: '10px' }} />
        <PhotoCard src={renderImage} label="Render" rotation={12} index={1} style={{ top: '20px', right: '10px' }} />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-display font-black text-white tracking-tight drop-shadow-xl">Avada Design</h1>
        <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase font-mono mt-1">Design · Render · Succeed</p>
      </div>
    </div>
  </div>
);

export default CardLoader;
