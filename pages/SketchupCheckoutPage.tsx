import React, { useState, useEffect } from "react";
import { Sparkles, Timer, CheckCircle2, Download, Mail, Check, ArrowLeft } from "lucide-react";
import ModernPaymentForm from "../components/ui/modern-payment-form";
import { useNavigate } from "react-router-dom";

const SketchupPage: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ h: 1, m: 19, s: 59 });
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [studentCount, setStudentCount] = useState(41293);

  useEffect(() => { const t = setInterval(() => setStudentCount(c => c + 1), 6000); return () => clearInterval(t); }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if ((window as any).fbq) (window as any).fbq("track", "ViewContent", { content_name: "Sketchup Free Tier", value: 1.56, currency: "USD" });
  }, []);

  useEffect(() => {
    const calc = () => {
      const D = (2 * 3600 + 23 * 60 + 49) * 1000, r = D - (Date.now() % D);
      setTimeLeft({ h: Math.floor((r / 3600000) % 24), m: Math.floor((r / 60000) % 60), s: Math.floor((r / 1000) % 60) });
    };
    const t = setInterval(calc, 1000); calc();
    return () => clearInterval(t);
  }, []);

  const f = (v: number) => v.toString().padStart(2, "0");

  const handleSuccess = (customerId?: string, paymentMethodId?: string, paymentIntentId?: string) => {
    console.log('[SketchupCheckoutPage] Payment succeeded. customerId:', customerId, 'paymentMethodId:', paymentMethodId, 'paymentIntentId:', paymentIntentId);
    if ((window as any).fbq) (window as any).fbq("track", "Purchase", { value: 1.56, currency: "USD" });
    // Redirect to upsell page, passing customerId, paymentMethodId, and paymentIntentId via state for one-click upsell
    navigate("/", { state: { customerId, paymentMethodId, paymentIntentId } });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start py-6 px-4">
      <style>{`.checkout-card{animation:fadeIn 0.3s ease-out}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div className="w-full max-w-md mb-3">
        <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors font-medium">
          <ArrowLeft size={14} /> Back to home
        </button>
        <h1 className="text-2xl font-display font-black text-gray-900 mt-3 text-center">Claim Your Free Course</h1>
      </div>

      <div className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2.5 shadow-md border border-gray-200 mb-4">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
        <span className="text-sm font-bold text-gray-900">{studentCount.toLocaleString()}</span>
        <span className="text-xs text-gray-500">students already enrolled</span>
      </div>

      <div className="flex flex-col items-center mb-4">
        <div className="w-40 aspect-square rounded-xl overflow-hidden shadow-md">
          <video
            src="https://d38b044pevnwc9.cloudfront.net/promeAI/landing/func-video/blender.mp4"
            autoPlay loop muted playsInline
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-xs font-semibold text-gray-600 mt-2 text-center max-w-[160px]">🎨 SketchUp Absolute Beginner to Pro</p>
      </div>

      <div className="checkout-card w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-orange-500 text-white px-6 py-5">
          <div className="flex items-center mb-1">
            <div className="inline-flex items-center gap-1.5 text-orange-200 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles size={11} /> Limited Time Offer
            </div>
          </div>
          <h3 className="text-xl font-display font-bold mb-1 line-clamp-1">SketchUp Architecture Course</h3>
          <div className="flex items-baseline gap-2">
             <span className="text-2xl font-display font-black uppercase text-white">FREE</span>
             <span className="text-orange-100 text-xs font-bold px-2 py-0.5 rounded-full border border-orange-300 ml-auto">+ €1.56 processing fee</span>
          </div>
        </div>

        <div className="px-6 pt-5 pb-6">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {["SketchUp Basics to Pro", "V-Ray Introduction", "Official Certificate", "24/7 Team Support"].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                <CheckCircle2 size={12} className="text-orange-500 shrink-0" /> {item}
              </div>
            ))}
            <div className="col-span-2 flex items-center gap-2 text-xs font-bold bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-green-700">
              <Download size={11} className="shrink-0" /> Software Download - All Links Included
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl px-4 py-2.5 mb-5 flex items-center justify-between border border-gray-200">
            <div className="flex items-center gap-2">
              <Timer size={13} className="text-gray-700 animate-pulse" />
              <span className="text-xs font-bold text-gray-900">Offer ends in:</span>
            </div>
            <div className="font-display font-bold text-sm tabular-nums text-gray-900 bg-white px-2.5 py-1 rounded-md border border-gray-200 shadow-sm">
              {f(timeLeft.h)}:{f(timeLeft.m)}:{f(timeLeft.s)}
            </div>
          </div>

          <label className="block text-xl font-black text-gray-900 mb-2">Email</label>
          <div className="relative mb-1">
            <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              autoFocus
              onChange={(e) => { setEmail(e.target.value); setEmailError(false); }}
              className={`w-full pl-10 pr-4 py-3.5 bg-white border-2 ${emailError ? "border-red-500" : "border-gray-900"} rounded-xl text-sm font-medium focus:outline-none transition-all`}
            />
          </div>
          {emailError && <p className="text-red-500 text-[10px] mb-2 font-bold">Enter a valid email address</p>}

          <ModernPaymentForm bare email={email} onSuccess={handleSuccess} amount="€1.56" />

          <div className="flex items-center justify-center gap-1.5 mt-4 text-[11px] text-gray-500 font-medium text-center">
            🎓 Skill Certificate will be automatically mailed after you complete the course.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SketchupPage;
