import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';

const PURCHASES = [
    { name: 'Arjun from Mumbai', course: 'AutoCAD Mastery' },
    { name: 'Priya from Bangalore', course: 'V-Ray Photorealism' },
    { name: 'Rahul from Delhi', course: '3ds Max Advanced' }
];

export const PurchaseTicker: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show 3 times with specific delays
        const timeline = [3000, 10000, 18000]; // 3s, 10s, 18s

        const timers = timeline.map((delay, index) => {
            return setTimeout(() => {
                setCurrentIndex(index);
                setIsVisible(true);

                // Hide after 4 seconds
                setTimeout(() => {
                    setIsVisible(false);
                }, 4000);
            }, delay);
        });

        return () => timers.forEach(clearTimeout);
    }, []);

    if (currentIndex === -1) return null;

    const current = PURCHASES[currentIndex];

    return (
        <div
            className={`fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
                }`}
        >
            <div className="bg-white/95 backdrop-blur-sm border border-gray-100 shadow-xl rounded-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4 max-w-[280px] md:max-w-sm">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                    <ShoppingBag size={20} className="text-brand-primary" />
                </div>
                <div>
                    <p className="text-xs md:text-sm font-bold text-gray-900 leading-tight">
                        {current.name}
                    </p>
                    <p className="text-[10px] md:text-xs text-brand-primary font-medium mt-0.5">
                        just bought {current.course}
                    </p>
                    <p className="text-[8px] md:text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider font-bold">
                        Verified Purchase
                    </p>
                </div>
            </div>
        </div>
    );
};
