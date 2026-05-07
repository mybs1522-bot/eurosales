import React, { useState } from 'react';
import { X, Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-[fadeIn_0.3s_ease-out] flex flex-col">
        {/* Decorative Header */}
        <div className="h-32 bg-gray-900 relative overflow-hidden flex items-center justify-center">
            <div className="absolute top-[-50%] left-[-20%] w-[150%] h-[200%] bg-brand-primary/20 rounded-full blur-[60px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-500/20 rounded-full blur-[60px]" />
            <h2 className="relative z-10 text-3xl font-display font-bold text-white tracking-tight">Welcome Back</h2>
            
             <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
                <X size={18} />
            </button>
        </div>

        <div className="p-8">
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="email" placeholder="name@example.com" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-sm font-medium" />
                    </div>
                </div>

                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-sm font-medium" />
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                        <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                        Remember me
                    </label>
                    <a href="#" className="text-brand-primary font-bold hover:underline">Forgot Password?</a>
                </div>

                <button className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 group mt-2">
                    Sign In <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-400 font-bold tracking-widest">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-bold text-gray-700">
                     <Chrome size={18} /> Google
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-bold text-gray-700">
                     <Github size={18} /> GitHub
                </button>
            </div>

             <div className="mt-6 text-center text-xs text-gray-500">
                Don't have an account? <span className="text-brand-primary font-bold cursor-pointer hover:underline">Create one</span>
             </div>
        </div>
      </div>
    </div>
  );
};