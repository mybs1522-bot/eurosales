import React from 'react';
import { ShoppingCart, ArrowRight, Sparkles } from 'lucide-react';

interface CartBarProps {
    itemCount: number;
    total: number;
    onCheckout: () => void;
    onViewCart: () => void;
}

export const CartBar: React.FC<CartBarProps> = ({ itemCount, total, onCheckout, onViewCart }) => {
    const [isBlinking, setIsBlinking] = React.useState(false);

    React.useEffect(() => {
        if (itemCount > 0) {
            setIsBlinking(true);
            const timer = setTimeout(() => setIsBlinking(false), 600);
            return () => clearTimeout(timer);
        }
    }, [itemCount]);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-[slideUp_0.3s_ease-out]">
            <style>{`
        @keyframes slideUp {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes cartBlink {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.2); filter: brightness(1.5); color: #ef4444; }
        }
      `}</style>

            <div className="bg-gray-900 border-t border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.25)]">
                <div className="container mx-auto px-4 md:px-8 py-1.5 flex items-center justify-between gap-3">

                    {/* Left: Cart Summary */}
                    <button
                        onClick={onViewCart}
                        className="flex items-center gap-2 text-white hover:text-brand-accent transition-colors"
                    >
                        <div className={`relative transition-all duration-300 ${isBlinking ? 'animate-[cartBlink_0.6s_ease-in-out]' : ''}`}>
                            <ShoppingCart size={18} className={isBlinking ? 'text-brand-primary' : ''} />
                            <div className="absolute -top-1.5 -right-1.5 bg-brand-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {itemCount}
                            </div>
                        </div>
                        <div className="text-left">
                            <div className="text-xs font-bold leading-tight">{itemCount} course{itemCount > 1 ? 's' : ''}</div>
                            <div className="text-[10px] text-gray-400 leading-tight">Tap to view</div>
                        </div>
                    </button>

                    {/* Right: Total + Checkout */}
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <div className="text-[10px] text-gray-400 uppercase tracking-widest leading-tight">Total</div>
                            <div className="text-lg font-display font-bold text-white leading-tight">₹{total.toLocaleString()}</div>
                        </div>
                        <button
                            onClick={onCheckout}
                            className="bg-brand-primary hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-glow hover:shadow-glow-lg text-sm"
                        >
                            <span className="sm:hidden font-display text-base">₹{total.toLocaleString()}</span>
                            <span>Checkout</span>
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
