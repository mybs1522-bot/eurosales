import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, Check, Mail, Phone, Timer, Lock } from 'lucide-react';
import { Course } from '../types';
import { COURSES, BUNDLE_PRICE } from '../constants';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    cartIds: Set<string>;
    onRemove: (id: string) => void;
    onAddAll: () => void;
    onCheckout: (phone: string, email: string) => void;
    timeLeft: { h: number; m: number; s: number };
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
    isOpen,
    onClose,
    cartIds,
    onRemove,
    onAddAll,
    onCheckout,
    timeLeft,
}) => {
    const [phone, setPhone] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phoneError, setPhoneError] = React.useState(false);
    const [emailError, setEmailError] = React.useState(false);

    const cartCourses = COURSES.filter(c => cartIds.has(c.id));
    const subtotal = cartCourses.reduce((sum, c) => sum + c.price, 0);
    const allAdded = cartIds.size === COURSES.length;

    // If all courses are in cart, use bundle price
    const finalTotal = allAdded ? BUNDLE_PRICE : subtotal;
    const savings = allAdded ? (subtotal - BUNDLE_PRICE) : 0;

    const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    const formatTime = (val: number) => val.toString().padStart(2, '0');

    const handleCheckoutClick = () => {
        let hasError = false;
        if (!phone || phone.length < 10) {
            setPhoneError(true);
            hasError = true;
        } else {
            setPhoneError(false);
        }
        if (!email || !validateEmail(email)) {
            setEmailError(true);
            hasError = true;
        } else {
            setEmailError(false);
        }
        if (hasError) return;
        onCheckout(phone, email);
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <ShoppingBag size={20} className="text-brand-primary" />
                        <h2 className="text-lg font-display font-bold text-gray-900">Your Cart</h2>
                        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
                            {cartIds.size}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close cart"
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Cart Items — Scrollable */}
                <div className="flex-1 overflow-y-auto p-5">
                    {cartCourses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <ShoppingBag size={48} className="text-gray-200 mb-4" />
                            <p className="text-gray-400 font-medium mb-2">Your cart is empty</p>
                            <p className="text-gray-300 text-sm">Add courses to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cartCourses.map(course => (
                                <div
                                    key={course.id}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 group hover:border-gray-200 transition-colors"
                                >
                                    <img
                                        src={course.imageUrl}
                                        alt={course.title}
                                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs text-brand-primary font-bold uppercase tracking-wider">{course.software}</div>
                                        <div className="font-bold text-gray-900 text-sm truncate">{course.title}</div>
                                    </div>
                                    <div className="text-right shrink-0 flex items-center gap-2">
                                        <span className="font-display font-bold text-gray-900">₹{course.price}</span>
                                        <button
                                            onClick={() => onRemove(course.id)}
                                            aria-label={`Remove ${course.title}`}
                                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Bundle Upsell — only if not all added */}
                    {!allAdded && cartIds.size > 0 && (
                        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles size={16} className="text-brand-accent" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-brand-accent">Best Deal</span>
                                </div>
                                <div className="font-display font-bold text-base mb-1">
                                    Get all 12 courses for ₹{BUNDLE_PRICE}
                                </div>
                                <div className="text-gray-400 text-[10px] mb-3 leading-tight">
                                    Save ₹{(COURSES.length * 199 - BUNDLE_PRICE).toLocaleString()} vs buying individually
                                </div>
                                <button
                                    onClick={onAddAll}
                                    className="w-full py-2 bg-brand-primary hover:bg-blue-700 text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2 transition-colors shadow-glow"
                                >
                                    <Sparkles size={12} />
                                    Grab All 12 Courses
                                </button>
                            </div>
                        </div>
                    )}

                    {/* All added confirmation */}
                    {allAdded && (
                        <div className="mt-6 p-4 rounded-2xl bg-green-50 border border-green-100 text-center">
                            <div className="flex items-center justify-center gap-2 text-green-700 font-bold mb-1">
                                <Check size={16} strokeWidth={3} />
                                All 12 courses added!
                            </div>
                            <div className="text-green-600 text-xs">
                                Bundle discount applied: ₹{savings.toLocaleString()} saved
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer — Checkout */}
                {cartIds.size > 0 && (
                    <div className="p-5 border-t border-gray-100 bg-white">
                        {/* Dark Checkout Header */}
                        <div className="text-gray-900 font-bold mb-4 flex items-center justify-center gap-2">
                            <Lock size={16} className="text-gray-400" />
                            <span>Checkout</span>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-3 mb-5">
                            {/* Phone Input */}
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <span className="absolute left-9 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">+91</span>
                                    <input
                                        type="tel"
                                        placeholder="10-digit number"
                                        value={phone}
                                        onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setPhoneError(false); }}
                                        className={`w-full pl-16 pr-4 py-2.5 bg-gray-50 border ${phoneError ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all`}
                                    />
                                </div>
                                {phoneError && <p className="text-red-500 text-[10px] mt-1 px-1 font-bold">Enter a valid 10-digit number</p>}
                            </div>

                            {/* Email Input */}
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setEmailError(false); }}
                                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border ${emailError ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all`}
                                    />
                                </div>
                                {emailError && <p className="text-red-500 text-[10px] mt-1 px-1 font-bold">Enter a valid email address</p>}
                            </div>
                        </div>

                        {/* Synchronized Timer */}
                        <div className="bg-red-50 rounded-xl p-3 mb-4 flex items-center justify-between border border-red-100">
                            <div className="flex items-center gap-2">
                                <Timer size={16} className="text-brand-primary animate-pulse" />
                                <span className="text-xs font-bold text-gray-900">Offer ends in:</span>
                            </div>
                            <div className="flex items-center gap-0.5 font-display font-bold text-sm tabular-nums text-brand-primary bg-white px-2.5 py-1 rounded-md border border-red-100 shadow-sm">
                                <span>{formatTime(timeLeft.h)}</span>
                                <span className="text-gray-400">:</span>
                                <span>{formatTime(timeLeft.m)}</span>
                                <span className="text-gray-400">:</span>
                                <span>{formatTime(timeLeft.s)}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-500 text-sm font-medium">Total Payable</span>
                            <div className="text-right">
                                {allAdded && (
                                    <div className="text-xs text-gray-400 line-through">₹{subtotal.toLocaleString()}</div>
                                )}
                                <div className="text-2xl font-display font-bold text-gray-900 tracking-tight">₹{finalTotal.toLocaleString()}</div>
                            </div>
                        </div>
                        <button
                            onClick={handleCheckoutClick}
                            className="w-full py-4 bg-brand-primary hover:bg-black text-white font-bold rounded-xl text-lg flex items-center justify-center gap-2 transition-all shadow-[0_8px_20px_rgba(217,4,41,0.3)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)] active:scale-[0.98] group"
                        >
                            Proceed to Pay
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="text-center text-[9px] text-gray-400 mt-3 font-medium">
                            🔒 SSL Secured Payment • GST Invoice Available
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};
