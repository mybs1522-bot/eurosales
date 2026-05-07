import React, { useState } from 'react';
import { Course } from '../types';
import { Play, Lock, ImageOff } from 'lucide-react';

interface NetflixCardProps {
  course: Course;
  onClick: (course: Course) => void;
}

export const NetflixCard: React.FC<NetflixCardProps> = ({ course, onClick }) => {
  const [imgError, setImgError] = useState(false);

  // Fallback image if the provided link is broken
  const fallbackImage = `https://images.unsplash.com/photo-1518005052304-a37d996b0756?q=80&w=600&auto=format&fit=crop`;

  return (
    <div 
      onClick={() => onClick(course)}
      className="group relative flex-shrink-0 w-[250px] md:w-[280px] cursor-pointer transition-all duration-300 hover:-translate-y-2"
    >
      {/* Image Container - Square */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg border border-gray-100 mb-4 group-hover:shadow-glow-lg transition-all duration-300 bg-gray-100">
         <img 
           src={imgError ? fallbackImage : course.imageUrl} 
           onError={() => setImgError(true)}
           alt={course.title} 
           className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${imgError ? 'opacity-80 grayscale' : ''}`}
         />
         
         {/* Overlay Gradient */}
         <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

         {/* Lock Icon */}
         <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg z-10">
            <Lock size={14} className="text-brand-primary" />
         </div>

         {/* Get All Courses Button - Centered Overlay */}
         <div className="absolute inset-0 flex items-center justify-center opacity-100">
            <button className="bg-brand-primary text-white text-[10px] md:text-xs font-bold px-4 py-2 md:py-3 rounded-full shadow-glow animate-pulse hover:animate-none hover:scale-105 transition-all flex items-center gap-2 border border-white/20">
               <Play size={10} fill="currentColor" />
               GET ALL COURSES
            </button>
         </div>
      </div>

      {/* Title Below */}
      <div className="px-1">
        <div className="text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-1">
           {course.software}
        </div>
        <h3 className="text-gray-900 font-display font-bold text-lg leading-tight group-hover:text-brand-primary transition-colors">
          {course.title}
        </h3>
      </div>
    </div>
  );
};
