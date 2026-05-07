import React, { useState } from 'react';
import { Course } from '../types';
import { X, CheckCircle2, Zap, Users, Plus, Check, ArrowRight } from 'lucide-react';

interface CourseDetailModalProps {
    course: Course | null;
    isOpen: boolean;
    onClose: () => void;
    isInCart: boolean;
    onToggleCart: (courseId: string) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
    course,
    isOpen,
    onClose,
    isInCart,
    onToggleCart,
}) => {
    const [imgError, setImgError] = useState(false);
    const fallbackImage = `https://images.unsplash.com/photo-1518005052304-a37d996b0756?q=80&w=600&auto=format&fit=crop`;

    if (!course) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Modal */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}>
                <div
                    className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-95'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Hero Image */}
                    <div className="relative w-full aspect-square overflow-hidden bg-gray-100 shrink-0">
                        <img
                            src={imgError ? fallbackImage : course.imageUrl}
                            onError={() => setImgError(true)}
                            alt={course.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Close */}
                        <button
                            onClick={onClose}
                            aria-label="Close course details"
                            className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white p-2 rounded-full transition-colors"
                        >
                            <X size={18} />
                        </button>

                        {/* Software + Students overlay */}
                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                            <div>
                                <div className="bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm inline-block mb-2">
                                    {course.software}
                                </div>
                                <h2 className="text-white font-display font-bold text-2xl leading-tight drop-shadow-lg">
                                    {course.title}
                                </h2>
                            </div>
                            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shrink-0">
                                <Users size={12} />
                                {course.students}
                            </div>
                        </div>
                    </div>

                    {/* Content — Scrollable */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {/* Description */}
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            {course.description}
                        </p>

                        {/* Topics / What You'll Learn */}
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center">
                                    <CheckCircle2 size={12} className="text-brand-primary" />
                                </span>
                                What You'll Learn
                            </h3>
                            <div className="space-y-2.5">
                                {course.learningPoints.map((point, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-sm leading-snug">{point}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Workflow Impact */}
                        <div className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap size={14} className="text-yellow-400 fill-yellow-400" />
                                <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">Why It Matters</span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {course.workflowImpact}
                            </p>
                        </div>
                    </div>

                    {/* Footer — Price + CTA */}
                    <div className="p-5 border-t border-gray-100 bg-white shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-display font-bold text-gray-900">₹{course.price}</span>
                                <span className="text-sm text-gray-400 line-through">₹{course.originalPrice}</span>
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                    {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                                </span>
                            </div>

                            <button
                                onClick={() => onToggleCart(course.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 ${isInCart
                                    ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                                    : 'bg-brand-primary text-white hover:bg-blue-700 shadow-glow hover:shadow-glow-lg'
                                    }`}
                            >
                                {isInCart ? (
                                    <>
                                        <Check size={16} strokeWidth={3} />
                                        Added to Cart
                                    </>
                                ) : (
                                    <>
                                        <Plus size={16} strokeWidth={3} />
                                        Add to Cart
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
