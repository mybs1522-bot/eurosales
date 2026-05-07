import React, { useRef, useState } from 'react';
import { COURSES } from '../constants';
import { GlassCard } from './ui/GlassCard';
import { ArrowRight, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface CourseCarouselProps {
  onBuyClick: () => void;
}

export const CourseCarousel: React.FC<CourseCarouselProps> = ({ onBuyClick }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // card width + gap
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleError = (id: string) => {
    setFailedImages(prev => ({ ...prev, [id]: true }));
  };

  const fallbackImage = "https://images.unsplash.com/photo-1518005052304-a37d996b0756?q=80&w=600&auto=format&fit=crop";

  return (
    <div className="relative py-8">
      {/* Controls */}
      <div className="hidden md:flex justify-end gap-2 mb-4 px-4 container mx-auto">
        <button 
          onClick={() => scroll('left')}
          className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={() => scroll('right')}
          className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Scroller */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-6 px-6 md:px-12 pb-12 snap-x snap-mandatory no-scrollbar"
        style={{ scrollPaddingLeft: '1.5rem', scrollPaddingRight: '1.5rem' }}
      >
        {COURSES.map((course) => (
          <div key={course.id} className="snap-center shrink-0">
            <GlassCard 
              className="w-[300px] h-[420px] flex flex-col group relative"
              hoverEffect={true}
            >
              {/* Image Section */}
              <div className="h-48 overflow-hidden relative bg-gray-800">
                <div className={`absolute inset-0 bg-gradient-to-t ${course.color} opacity-20 z-10`} />
                <img 
                  src={failedImages[course.id] ? fallbackImage : course.imageUrl} 
                  onError={() => handleError(course.id)}
                  alt={course.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-3 left-3 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10">
                  {course.software}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-1 mb-2">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-gray-400 ml-1">(4.9)</span>
                </div>

                <h3 className="text-xl font-display font-bold leading-tight mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-3 mb-4 flex-1">
                  {course.description}
                </p>

                <button 
                  onClick={onBuyClick}
                  className="w-full mt-auto py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 group-hover:border-brand-accent/50 group-hover:text-brand-accent"
                >
                  Start Learning <ArrowRight size={16} />
                </button>
              </div>
            </GlassCard>
          </div>
        ))}
        
        {/* Spacer for right padding on mobile */}
        <div className="w-1 shrink-0 snap-center" />
      </div>
    </div>
  );
};
