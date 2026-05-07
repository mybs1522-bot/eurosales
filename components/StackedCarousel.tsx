import React, { useState, useEffect } from 'react';
import { COURSES } from '../constants';
import { ArrowRight, CheckCircle2, TrendingUp, Clock } from 'lucide-react';
import { Course } from '../types';

interface StackedCarouselProps {
    onCourseClick: (course: Course) => void;
}

export const StackedCarousel: React.FC<StackedCarouselProps> = ({ onCourseClick }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Cycle time
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % COURSES.length);
    }, 4000); // 4 seconds per slide for the zoom effect to breathe
    return () => clearInterval(interval);
  }, []);

  const handleError = (id: string) => {
    setFailedImages(prev => ({ ...prev, [id]: true }));
  };

  const fallbackImage = "https://images.unsplash.com/photo-1518005052304-a37d996b0756?q=80&w=600&auto=format&fit=crop";

  return (
    <div className="w-full bg-white text-gray-900 pt-12 pb-24 md:py-24 overflow-hidden relative">
        <style>{`
          @keyframes skyrocket-text {
            0%, 100% { transform: translateY(0) scale(1); color: #D90429; }
            50% { transform: translateY(-4px) scale(1.05); color: #ff4d6d; text-shadow: 0 4px 12px rgba(217, 4, 41, 0.3); }
          }
          .animate-skyrocket {
            animation: skyrocket-text 2s ease-in-out infinite;
            display: inline-block;
          }
          
          @keyframes slow-zoom {
            0% { transform: scale(1); }
            100% { transform: scale(1.15); }
          }
          .animate-slow-zoom {
            animation: slow-zoom 4s linear forwards;
          }
        `}</style>

        {/* Background Accents - Light Mode */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-20%] w-[70%] h-[60%] bg-brand-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-blue-100 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-0 lg:gap-16 relative z-10">
            
            {/* Left Side: Text Info */}
            <div className="flex-1 w-full lg:max-w-xl flex flex-col items-center lg:items-start text-center lg:text-left order-1 mb-16 lg:mb-0">
                
                {/* New Headline */}
                <h2 className="text-3xl md:text-5xl font-display font-bold leading-tight mb-6 text-gray-900">
                    Courses that will <br/>
                    <span className="animate-skyrocket mr-2">skyrocket</span> 
                    <TrendingUp className="inline-block mb-2 text-brand-primary animate-bounce" size={32} />
                    <br/>
                    your career
                </h2>
                
                {/* Description Rotator based on Active Index */}
                <div className="h-[120px] relative w-full mb-8">
                     {COURSES.map((course, idx) => {
                         const isActive = idx === activeIndex;
                         return (
                         <div 
                            key={course.id} 
                            className={`absolute top-0 left-0 w-full flex flex-col items-center lg:items-start transition-all duration-500 ${
                                isActive 
                                ? 'opacity-100 translate-y-0 z-10' 
                                : 'opacity-0 translate-y-4 pointer-events-none z-0'
                            }`}
                         >
                            <p className="text-gray-500 text-sm md:text-lg leading-relaxed max-w-md mb-6 mx-auto lg:mx-0 font-medium">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                               <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
                                  <CheckCircle2 size={12} className="text-brand-primary"/> Certificate
                               </div>
                               <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
                                  <CheckCircle2 size={12} className="text-brand-primary"/> Source Files
                               </div>
                            </div>
                         </div>
                     )})}
                </div>
                
                {/* Progress Indicators */}
                <div className="flex gap-1.5 mt-4">
                    {COURSES.map((_, idx) => (
                        <div 
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`h-1.5 cursor-pointer transition-all duration-500 rounded-full ${
                                idx === activeIndex ? 'w-12 bg-brand-primary shadow-glow' : 'w-2 bg-gray-200 hover:bg-gray-300'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Right Side: Zoom & Slide Carousel */}
            <div className="w-full lg:flex-1 h-[500px] sm:h-[550px] relative order-2 flex items-center justify-center">
                 {COURSES.map((course, idx) => {
                     // Calculate relative position
                     // We need a circular buffer logic but for sliding transition
                     let position = 'hidden'; // Default
                     
                     // Helper to handle the cyclic index logic
                     const len = COURSES.length;
                     const prevIndex = (activeIndex - 1 + len) % len;
                     const nextIndex = (activeIndex + 1) % len;

                     if (idx === activeIndex) {
                         position = 'active';
                     } else if (idx === nextIndex) {
                         position = 'next';
                     } else if (idx === prevIndex) {
                         position = 'prev';
                     }

                     let containerStyle = '';
                     let imageAnim = '';

                     // Base Styles for the Card Container
                     const baseCard = "absolute transition-all duration-700 ease-in-out flex flex-col items-center";
                     
                     // Square aspect ratio for the frame
                     const frameSize = "w-[280px] h-[280px] sm:w-[350px] sm:h-[350px]";

                     if (position === 'active') {
                         // Center, Full Opacity, Zooming Image
                         containerStyle = `z-30 opacity-100 translate-x-0 scale-100 pointer-events-auto`;
                         imageAnim = "animate-slow-zoom";
                     } else if (position === 'next') {
                         // Waiting on Right
                         containerStyle = `z-10 opacity-40 translate-x-[60%] sm:translate-x-[80%] scale-90 blur-[2px] pointer-events-none`;
                     } else if (position === 'prev') {
                         // Exiting to Left
                         containerStyle = `z-20 opacity-0 -translate-x-[80%] scale-100 pointer-events-none`;
                     } else {
                         // Hidden behind
                         containerStyle = `z-0 opacity-0 scale-50 hidden`;
                     }

                     // Random duration logic: (idx % 7) + 6 -> 6 to 12
                     const duration = (idx % 7) + 6;

                     return (
                         <div
                            key={course.id}
                            className={`${baseCard} ${containerStyle} top-1/2 -translate-y-1/2`}
                            onClick={() => position === 'active' && onCourseClick(course)}
                         >
                            {/* Title ABOVE the Frame */}
                            <div className="mb-6 text-center">
                                <div className="text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-2 bg-brand-primary/5 border border-brand-primary/10 px-3 py-1 rounded-full inline-block">
                                    COURSE {String(idx + 1).padStart(2, '0')} • {course.software}
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 leading-none whitespace-nowrap drop-shadow-sm mb-1">
                                    {course.title}
                                </h3>
                                <div className="flex items-center justify-center gap-1.5 text-gray-400 text-xs font-medium">
                                    <Clock size={12} />
                                    <span>{duration} Hours Content</span>
                                </div>
                            </div>

                            {/* The Image Frame */}
                            <div className={`${frameSize} rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-gray-100 relative group cursor-pointer`}>
                                {/* Image Wrapper for Zoom Animation */}
                                <div className="w-full h-full overflow-hidden">
                                    <img 
                                        src={failedImages[course.id] ? fallbackImage : course.imageUrl} 
                                        onError={() => handleError(course.id)}
                                        className={`w-full h-full object-cover ${imageAnim}`}
                                        alt={course.title} 
                                    />
                                </div>

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

                                {/* Bottom Button (Only visible details inside) */}
                                <div className="absolute bottom-6 left-0 w-full flex justify-center">
                                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white px-6 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all group-hover:scale-105">
                                        View Course <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                         </div>
                     );
                 })}
            </div>
        </div>
    </div>
  );
};