import React, { useRef, useState } from 'react';
import { Course } from '../types';
import { NetflixCard } from './NetflixCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CourseRowProps {
  title: string;
  courses: Course[];
  onCourseClick: (course: Course) => void;
}

export const CourseRow: React.FC<CourseRowProps> = ({ title, courses, onCourseClick }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: 'left' | 'right') => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth / 2 
        : scrollLeft + clientWidth / 2;
        
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-2 py-6 group/row">
      <h2 className="text-xl md:text-2xl font-bold font-display text-gray-800 px-6 md:px-12 flex items-center gap-2">
        {title}
        <span className="h-0.5 w-12 bg-brand-primary hidden group-hover/row:block transition-all"></span>
      </h2>
      
      <div className="relative group/slider">
        {/* Left Arrow */}
        <div 
          className={`absolute top-0 bottom-0 left-0 w-12 z-40 bg-white/80 flex items-center justify-center cursor-pointer transition-opacity duration-300 hover:bg-white shadow-lg ${!isMoved ? 'hidden' : 'opacity-0 group-hover/slider:opacity-100'}`}
          onClick={() => handleClick('left')}
        >
          <ChevronLeft className="w-8 h-8 text-gray-800" />
        </div>

        {/* Row Container */}
        <div 
          ref={rowRef}
          className="flex items-center gap-4 overflow-x-scroll no-scrollbar px-6 md:px-12 py-4"
        >
           {courses.map((course) => (
             <NetflixCard 
               key={course.id} 
               course={course} 
               onClick={onCourseClick}
             />
           ))}
        </div>

        {/* Right Arrow */}
        <div 
          className="absolute top-0 bottom-0 right-0 w-12 z-40 bg-white/80 flex items-center justify-center cursor-pointer opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 hover:bg-white shadow-lg"
          onClick={() => handleClick('right')}
        >
          <ChevronRight className="w-8 h-8 text-gray-800" />
        </div>
      </div>
    </div>
  );
};
