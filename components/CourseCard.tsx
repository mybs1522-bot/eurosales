import React, { useState } from 'react';
import { Course } from '../types';
import { Plus, Check, Eye } from 'lucide-react';

interface CourseCardProps {
    course: Course;
    isInCart: boolean;
    onToggleCart: (courseId: string) => void;
    onViewDetails: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, isInCart, onToggleCart, onViewDetails }) => {
    const [imgError, setImgError] = useState(false);
    const fallbackImage = `https://images.unsplash.com/photo-1518005052304-a37d996b0756?q=80&w=600&auto=format&fit=crop`;

    return (
        <div
            className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-gray-200 cursor-pointer"
            onClick={() => onViewDetails(course)}
        >
            {/* Image */}
            <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                <img
                    src={imgError ? fallbackImage : course.imageUrl}
                    onError={() => setImgError(true)}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Software Tag */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                    {course.software}
                </div>

                {/* Students Count */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {course.students} students
                </div>
            </div>

            {/* Content */}
            <div className="p-3 md:p-4">
                <h3 className="font-display font-bold text-gray-900 text-base md:text-lg leading-tight mb-1 group-hover:text-brand-primary transition-colors line-clamp-2 min-h-[2.5rem] md:min-h-0">
                    {course.title}
                </h3>
                <p className="text-gray-500 text-[10px] md:text-xs mb-2 md:mb-3 leading-relaxed line-clamp-1 md:line-clamp-2">
                    {course.description}
                </p>

                {/* See Topics Link */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(course);
                    }}
                    className="flex items-center gap-1.5 text-brand-primary text-xs font-bold mb-4 hover:underline transition-all"
                >
                    <Eye size={12} />
                    See Topics
                </button>

                {/* Price + Button Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-xl md:text-2xl font-display font-bold text-gray-900">₹{course.price}</span>
                        <span className="text-[10px] md:text-sm text-gray-400 line-through">₹{course.originalPrice}</span>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleCart(course.id);
                        }}
                        className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 ${isInCart
                            ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                            : 'bg-brand-primary text-white hover:bg-blue-700 shadow-sm hover:shadow-glow'
                            }`}
                    >
                        {isInCart ? (
                            <>
                                <Check size={14} strokeWidth={3} />
                                <span>Added</span>
                            </>
                        ) : (
                            <>
                                <Plus size={14} strokeWidth={3} />
                                <span>Add</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
