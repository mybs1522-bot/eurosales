import React, { useState, useEffect } from "react";
import { UPSELL_COURSES, UPSELL_PRICE, UPSELL_ORIGINAL_PRICE } from "../constants";
import { Sparkles, Timer, CheckCircle2, Download, Mail, Lock, Check, X, ArrowRight, Gift, Zap, Star, ShieldCheck } from "lucide-react";
import ModernPaymentForm from "../components/ui/modern-payment-form";
import { useNavigate, useLocation } from "react-router-dom";
import { chargeSavedCardUpsell } from "../services/stripe";
import { sendStageEmail } from "../services/email";
import FunnelProgressBar from "../components/FunnelProgressBar";

const OnetimePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const customerId = location.state?.customerId;
  const paymentMethodId = location.state?.paymentMethodId;
  const paymentIntentId = location.state?.paymentIntentId;
  const emailFromState = location.state?.email ?? '';
  const [timeLeft, setTimeLeft] = useState({ m: 9, s: 59 });
  const [email, setEmail] = useState(emailFromState);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessingUpSell, setIsProcessingUpSell] = useState(false);
  const [isConfirmingSkip, setIsConfirmingSkip] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if ((window as any).fbq) (window as any).fbq("track", "ViewContent", { content_name: "Avada Upsell", value: UPSELL_PRICE, currency: "USD" });
  }, []);

  // 15-minute countdown timer (resets on page load)
  useEffect(() => {
    const start = Date.now();
    const duration = 10 * 60 * 1000; // 10 minutes
    const calc = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft({
        m: Math.floor((remaining / 60000) % 60),
        s: Math.floor((remaining / 1000) % 60),
      });
    };
    const t = setInterval(calc, 1000);
    calc();
    return () => clearInterval(t);
  }, []);

  const f = (v: number) => v.toString().padStart(2, "0");

  const handleSuccess = (newCustomerId?: string, newPaymentMethodId?: string) => {
    if ((window as any).fbq) (window as any).fbq("track", "Purchase", { value: UPSELL_PRICE, currency: "USD" });
    sendStageEmail(email, 'full');
    navigate("/offer", { state: { customerId: newCustomerId ?? customerId, paymentMethodId: newPaymentMethodId ?? paymentMethodId, paymentIntentId, email } });
  };

  const handleSkip = () => {
    navigate("/offer", { state: { customerId, paymentMethodId, paymentIntentId, email } });
  };

  const handleCTA = async () => {
    console.log('[OnetimePage] handleCTA called. customerId:', customerId, 'paymentMethodId:', paymentMethodId, 'paymentIntentId:', paymentIntentId);
    if (customerId) {
      setIsProcessingUpSell(true);
      try {
        await chargeSavedCardUpsell(customerId, `€${UPSELL_PRICE}`, paymentMethodId, paymentIntentId);
        handleSuccess();
      } catch (err) {
        console.error("One-click upsell failed", err);
        setIsProcessingUpSell(false);
        setShowPayment(true);
        setIsConfirmingSkip(false);
      }
    } else {
      console.warn('[OnetimePage] No customerId — showing payment form as fallback');
      setShowPayment(true);
      setIsConfirmingSkip(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-white text-gray-900">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .upsell-fade { animation: fadeIn 0.6s ease-out both; }
        @keyframes subtlePulse { 
          0%, 100% { transform: scale(1); box-shadow: 0 4px 14px 0 rgba(249,115,22,0.2); } 
          50% { transform: scale(1.02); box-shadow: 0 6px 20px rgba(249,115,22,0.4); } 
        }
        .btn-pulse { animation: subtlePulse 2.5s ease-in-out infinite; }
      `}</style>

      {/* ─── FUNNEL PROGRESS BAR ─── */}
      <FunnelProgressBar step={2} />

      {/* ─── URGENCY TOP BAR ─── */}
      <div className="sticky top-0 z-50 bg-orange-500 text-white text-center py-2 px-4 shadow-md">
        <div className="flex items-center justify-center gap-2 text-sm font-bold">
          <Timer size={14} className="animate-pulse" />
          <span>WAIT! One-Time Exclusive Offer — Expires in {f(timeLeft.m)}:{f(timeLeft.s)}</span>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">

        {/* ─── HEADER ─── */}
        <div className="text-center mb-8 upsell-fade">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-4">
            <Gift size={14} className="text-orange-500" />
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">One-Time Upgrade</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black mb-3 leading-tight text-gray-900">
            Unlock 9 more courses to boost your <span className="text-orange-500">Interior Design</span> and Architecture career.
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-lg mx-auto">
            You may need <strong className="text-gray-900">AutoCAD</strong> or maybe <strong className="text-gray-900">3DS Max</strong> at times, why not take all at this amazing one time price.
          </p>
        </div>

        {/* ─── PRICE CARD ─── */}
        <div className="upsell-fade bg-white shadow-xl shadow-gray-200/50 border border-gray-200 rounded-2xl p-6 mb-8 relative overflow-hidden" style={{ animationDelay: '0.15s' }}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-[60px] -mr-10 -mt-10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">Complete Bundle Upgrade</p>
                <p className="text-gray-500 text-sm">9 Additional Premium Courses</p>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-lg line-through mr-2">€{UPSELL_ORIGINAL_PRICE}</span>
                <span className="text-4xl font-display font-black text-gray-900">€{UPSELL_PRICE}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
              <Zap size={14} className="text-emerald-500" />
              <span className="text-sm font-semibold text-emerald-700">You save €{UPSELL_ORIGINAL_PRICE - UPSELL_PRICE} — that's 86% off!</span>
            </div>
          </div>
        </div>
        {/* ─── SECONDARY CTA (Above Grid) ─── */}
        <div className="upsell-fade mb-8 w-full max-w-xl mx-auto" style={{ animationDelay: '0.2s' }}>
          <button
            disabled={isProcessingUpSell}
            onClick={handleCTA}
            className="w-full py-4 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] btn-pulse disabled:opacity-70 disabled:cursor-wait"
            style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}
          >
            <Gift size={20} />
            {isProcessingUpSell ? "Processing Upgrade..." : "Yes! Unlock All 9 Courses Now"}
            {!isProcessingUpSell && <ArrowRight size={20} />}
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('final-bottom-cta');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="block w-full mt-3 py-1 text-center text-gray-400 hover:text-gray-500 text-[11px] font-medium transition-colors"
          >
            No thanks, I'll pass on the 9 extra courses
          </button>
        </div>

        {/* ─── COURSES GRID ─── */}
        <div className="upsell-fade mb-8" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-orange-500" /> What You'll Unlock:
          </h3>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {UPSELL_COURSES.map((course) => (
              <div key={course.id} className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden hover:border-orange-500/40 transition-all group">
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute top-1 right-1 bg-black/70 text-white text-[7px] font-bold uppercase px-1.5 py-0.5 rounded-full">{course.software}</div>
                </div>
                <div className="p-2">
                  <h4 className="font-bold text-gray-900 text-[10px] md:text-xs line-clamp-1">{course.title}</h4>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={8} className="fill-orange-400 text-orange-400" />
                    <span className="text-[9px] text-gray-500">{course.students} students</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── WHAT'S INCLUDED ─── */}
        <div className="upsell-fade bg-white shadow-sm border border-gray-200 rounded-2xl p-5 mb-8" style={{ animationDelay: '0.45s' }}>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Also Included with Upgrade:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "AutoCAD Precision Drafting",
              "BIM with Revit",
              "3ds Max Advanced Modeling",
              "Lumion Cinematic Walkthroughs",
              "Enscape VR Visualization",
              "AI Architecture (Midjourney)",
              "Generative Design (Stable Diffusion)",
              "Unreal Engine 5 Walkthroughs",
              "Photoshop Post-Production",
              "Freelancing Pricing Playbook",
              "10,000+ Additional Textures",
              "2,000+ Extra 3D Models",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ─── CTA SECTION ─── */}
        <div id="cta-section" className="upsell-fade" style={{ animationDelay: '0.6s' }}>
          <div className="space-y-3">
            {/* Primary CTA */}
            <button
              disabled={isProcessingUpSell}
              onClick={handleCTA}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 group active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-wait btn-pulse"
            >
              <Gift size={20} />
              {isProcessingUpSell ? "Processing Upgrade..." : "Yes! I want it."}
              {!isProcessingUpSell && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('final-bottom-cta');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full py-3 text-center text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors underline underline-offset-4 decoration-gray-300 disabled:opacity-50"
            >
              No thanks, I'll stick with my 3 courses →
            </button>

            {/* Refunds Badge */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 font-medium uppercase tracking-wide mt-2">
              <span className="flex items-center gap-1"><ShieldCheck size={10} /> 7-Day Refund</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Lock size={10} /> Secured</span>
              <span>•</span>
              <span>One-time charge</span>
            </div>
          </div>
        </div>

        {/* ─── VIDEO ─── */}
        <div className="upsell-fade relative w-full max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-2xl mt-10 mb-8 border border-slate-100" style={{ animationDelay: '0.1s' }}>
          <div style={{ position: 'relative', paddingTop: '56.25%' }}>
            <iframe 
              src="https://iframe.mediadelivery.net/embed/494628/e4f3024d-0d84-4568-942d-036d2c9dd8b7?autoplay=true&loop=true&muted=true&preload=true&responsive=true" 
              loading="lazy" 
              style={{ border: 0, position: 'absolute', top: 0, height: '100%', width: '100%' }} 
              allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;" 
              allowFullScreen={true}>
            </iframe>
          </div>
          {/* Black gradient at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 md:h-1/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 text-left">
            <h2 className="text-white font-display font-black text-xl md:text-2xl leading-tight drop-shadow-md">
              Your Complete<br />
              <span className="text-orange-400">Design Arsenal.</span>
            </h2>
          </div>
        </div>

        {/* ─── VALUE JUSTIFICATION ─── */}
        <div className="upsell-fade mt-8 bg-orange-50/50 border border-orange-200 rounded-3xl p-6 md:p-8 max-w-2xl mx-auto shadow-sm" style={{ animationDelay: '0.6s' }}>
          <h4 className="text-orange-900 font-black text-xl mb-6 text-center">The Exact Software Workflow We Will Build Together:</h4>
          
          <div className="space-y-4 text-left">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="text-emerald-600" size={16} strokeWidth={3} />
              </div>
              <div>
                <h5 className="font-bold text-gray-900 text-base">AutoCAD & Revit <span className="font-medium text-gray-500">— Drafting & BIM</span></h5>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">Master the global standards. Draft perfect 2D floor plans in AutoCAD and build intelligent, auto-updating 3D structural models in Revit.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="text-emerald-600" size={16} strokeWidth={3} />
              </div>
              <div>
                <h5 className="font-bold text-gray-900 text-base">3ds Max, Lumion & Enscape <span className="font-medium text-gray-500">— 3D & VR</span></h5>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">Create hyper-realistic luxury interiors in 3ds Max, and turn your models into animated cinematic video tours and real-time VR walkthroughs.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="text-emerald-600" size={16} strokeWidth={3} />
              </div>
              <div>
                <h5 className="font-bold text-gray-900 text-base">Midjourney & Stable Diffusion <span className="font-medium text-gray-500">— AI Design</span></h5>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">Generate 100+ concepts in minutes. Instantly create client mood boards and turn rough hand sketches into realistic building ideas using AI.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="text-emerald-600" size={16} strokeWidth={3} />
              </div>
              <div>
                <h5 className="font-bold text-gray-900 text-base">Unreal Engine 5 & Photoshop <span className="font-medium text-gray-500">— Final Polish</span></h5>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">Package your designs as interactive, playable walkthroughs in Unreal Engine, and use Photoshop to make average renders look like award-winning photography.</p>
              </div>
            </div>
          </div>
          
          <p className="text-center font-bold text-orange-900 mt-8 text-sm italic">
            "If you learn just 5–7 of these courses, there is no way you won't land a global design job. These aren't just 'courses'—they are the exact blueprints of what the industry needs, taught exactly as they demand."
          </p>
        </div>

        {/* ─── SOCIAL PROOF ─── */}
        <div className="upsell-fade mt-10 text-center" style={{ animationDelay: '0.75s' }}>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-orange-400 text-orange-400" />)}
          </div>
          <p className="text-gray-600 text-sm italic">"I almost skipped this offer and I'm SO glad I didn't. The full bundle is worth 10x what I paid."</p>
          <p className="text-gray-500 text-xs mt-2 font-bold">— Sarah K., Studio Owner, Berlin</p>
        </div>

        {/* ─── SECONDARY CTA (Jump to payment) ─── */}
        <div id="final-bottom-cta" className="upsell-fade mb-10 w-full max-w-xl mx-auto" style={{ animationDelay: '0.12s' }}>
          <button
            disabled={isProcessingUpSell}
            onClick={handleCTA}
            className="w-full py-4 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] btn-pulse disabled:opacity-70 disabled:cursor-wait"
            style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}
          >
            <Gift size={20} />
            {isProcessingUpSell ? "Processing Upgrade..." : "Yes! Unlock All 9 Courses Now"}
            {!isProcessingUpSell && <ArrowRight size={20} />}
          </button>

          <button
            onClick={() => setIsConfirmingSkip(true)}
            className="block w-full mt-4 py-3 text-center text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors underline underline-offset-4 decoration-gray-300 disabled:opacity-50"
          >
            No thanks, I'll stick with my 3 courses →
          </button>
        </div>
      </div>

      {/* ─── MODAL OVERLAYS ─── */}
      {showPayment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 w-full max-w-md relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowPayment(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20}/></button>
            <div className="flex items-center justify-between mb-4 mt-2">
              <h3 className="text-lg font-bold text-gray-900">Complete Your Upgrade</h3>
              <div className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">€{UPSELL_PRICE}</div>
            </div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5">Email</label>
            <div className="relative mb-3">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none transition-all"
              />
            </div>
            <ModernPaymentForm bare email={email} onSuccess={handleSuccess} amount={`€${UPSELL_PRICE}`} />
          </div>
        </div>
      )}

      {isConfirmingSkip && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border-2 border-red-200 rounded-2xl p-8 text-center shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 relative">
            <button onClick={() => setIsConfirmingSkip(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20}/></button>
            <h4 className="text-red-700 font-bold text-2xl mb-2 mt-4">Are you sure?</h4>
            <p className="text-gray-700 text-base mb-6">
              This 86% discount will not be available again. You can still buy this later, but it will be at the full regular price (€${UPSELL_ORIGINAL_PRICE}).
            </p>
            <div className="space-y-3">
              <button
                disabled={isProcessingUpSell}
                onClick={handleCTA}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 text-white font-bold text-lg rounded-xl transition-all"
              >
                {isProcessingUpSell ? "Processing..." : "Yes, I want the discount"}
              </button>
              <button
                disabled={isProcessingUpSell}
                onClick={() => navigate("/offer", { state: { customerId, paymentMethodId, email } })}
                className="block w-full py-3 text-center text-red-500 hover:text-red-700 text-sm font-bold transition-colors underline underline-offset-4 decoration-red-200"
              >
                Cancel, I don't want it
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OnetimePage;
