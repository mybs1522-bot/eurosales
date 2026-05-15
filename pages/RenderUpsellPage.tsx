import React, { useState, useEffect } from "react";
import { FRONT_END_PRICE, FRONT_END_ORIGINAL_PRICE } from "../constants";
import { Sparkles, Timer, CheckCircle2, Mail, Lock, Check, ArrowRight, Gift, Zap, Star, ShieldCheck, Camera, Video, Eye } from "lucide-react";
import ModernPaymentForm from "../components/ui/modern-payment-form";
import { useNavigate, useLocation } from "react-router-dom";
import { chargeSavedCardUpsell } from "../services/stripe";
import { sendStageEmail } from "../services/email";
import FunnelProgressBar from "../components/FunnelProgressBar";

const RenderUpsellPage: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ m: 14, s: 59 });
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessingUpSell, setIsProcessingUpSell] = useState(false);
  const [isConfirmingSkip, setIsConfirmingSkip] = useState(false);
  const location = useLocation();
  const customerId = location.state?.customerId;
  const paymentMethodId = location.state?.paymentMethodId;
  const emailFromState = location.state?.email ?? '';
  const [email, setEmail] = useState(emailFromState);

  useEffect(() => {
    window.scrollTo(0, 0);
    if ((window as any).fbq) (window as any).fbq("track", "ViewContent", { content_name: "Render Upsell", value: FRONT_END_PRICE, currency: "EUR" });
  }, []);

  useEffect(() => {
    const start = Date.now();
    const duration = 15 * 60 * 1000;
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
    if ((window as any).fbq) (window as any).fbq("track", "Purchase", { value: FRONT_END_PRICE, currency: "EUR" });
    sendStageEmail(email, 'render');
    navigate("/onetime", { state: { customerId: newCustomerId ?? customerId, paymentMethodId: newPaymentMethodId ?? paymentMethodId, email, purchased: ['render'] } });
  };

  const handleSkip = () => {
    navigate("/onetime", { state: { customerId, paymentMethodId, email, purchased: [] } });
  };

  const executeUpsell = async () => {
    if (customerId) {
      setIsProcessingUpSell(true);
      try {
        await chargeSavedCardUpsell(customerId, `€${FRONT_END_PRICE}`, paymentMethodId);
        handleSuccess();
      } catch (err) {
        console.error("One-click render upsell failed", err);
        setShowPayment(true);
        setIsProcessingUpSell(false);
      }
    } else {
      setShowPayment(true);
    }
  };

  const renderFormOrCTA = () => (
    <div>
      {!showPayment ? (
        <div className="space-y-3">
          <button
            disabled={isProcessingUpSell}
            onClick={executeUpsell}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 shadow-xl shadow-orange-500/20 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 group hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-wait"
          >
            <Camera size={20} />
            {isProcessingUpSell ? "Processing..." : "Yes! I want it."}
            {!isProcessingUpSell && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
          </button>

          {isConfirmingSkip ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mt-4">
              <h4 className="text-red-700 font-bold text-lg mb-2">Are you sure?</h4>
              <p className="text-gray-700 text-sm mb-5">
                This discount will not be available again. You can still buy later, but at the full regular price (€{FRONT_END_ORIGINAL_PRICE}).
              </p>
              <div className="space-y-3">
                <button
                  disabled={isProcessingUpSell}
                  onClick={executeUpsell}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 text-white font-bold rounded-xl transition-all"
                >
                  {isProcessingUpSell ? "Processing..." : "Yes, I want the discount"}
                </button>
                <button
                  disabled={isProcessingUpSell}
                  onClick={handleSkip}
                  className="block w-full py-3 text-center text-red-500 hover:text-red-700 text-sm font-bold transition-colors underline underline-offset-4 decoration-red-200"
                >
                  Cancel, I don't want it
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsConfirmingSkip(true)}
              className="block w-full py-3 text-center text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors underline underline-offset-4 decoration-gray-300"
            >
              No thanks, I'll skip this →
            </button>
          )}

          <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 font-medium uppercase tracking-wide mt-2">
            <span className="flex items-center gap-1"><ShieldCheck size={10} /> 7-Day Refund</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Lock size={10} /> Secured</span>
            <span>•</span>
            <span>One-time charge</span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Complete Your Upgrade</h3>
            <div className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">€{FRONT_END_PRICE}</div>
          </div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">Email</label>
          <div className="relative mb-3">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-500 transition-all" />
          </div>
          <ModernPaymentForm bare email={email} onSuccess={handleSuccess} amount={`€${FRONT_END_PRICE}`} />
          <button onClick={() => setShowPayment(false)} className="w-full mt-3 py-2 text-center text-gray-400 hover:text-gray-600 text-xs font-medium transition-colors">← Go back</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-white text-gray-900 overflow-x-hidden">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .upsell-fade { animation: fadeIn 0.6s ease-out both; }
      `}</style>

      {/* ─── FUNNEL PROGRESS BAR ─── */}
      <FunnelProgressBar step={1} />

      {/* ─── URGENCY TOP BAR ─── */}
      <div className="bg-orange-500 text-white text-center py-2 px-4">
        <div className="flex items-center justify-center gap-2 text-sm font-bold">
          <Timer size={14} />
          <span>One-Time Exclusive Offer — Expires in {f(timeLeft.m)}:{f(timeLeft.s)}</span>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">

        {/* ─── HERO MESSAGE ─── */}
        <div className="text-center mb-10 upsell-fade">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 rounded-full px-4 py-1.5 mb-6">
            <Gift size={14} className="text-orange-500" />
            <span className="text-xs font-bold uppercase tracking-widest">One-Time Upgrade</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-black mb-5 leading-tight text-gray-900 max-w-2xl mx-auto">
            SketchUp Only Makes <span className="text-orange-500">Designs.</span><br />
            You Need <span className="text-orange-500">Photos</span> & <span className="text-orange-500">Video Renders</span> Too.
          </h1>

          <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto mb-2 leading-relaxed">
            A SketchUp model alone won't win you clients. You need <strong className="text-gray-900">photorealistic images</strong> and <strong className="text-gray-900">cinematic video walkthroughs</strong> to sell your designs. That's exactly what V-Ray and D5 Render give you.
          </p>
        </div>

        {/* ─── PROBLEM/SOLUTION GRID ─── */}
        <div className="upsell-fade grid grid-cols-1 md:grid-cols-2 gap-4 mb-10" style={{ animationDelay: '0.15s' }}>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <h3 className="text-sm font-black text-red-700 uppercase tracking-widest mb-3">❌ Without Rendering</h3>
            <ul className="space-y-2.5 text-sm text-gray-700">
              <li className="flex items-start gap-2"><span className="text-red-400 shrink-0 mt-0.5">•</span>Gray wireframe models no one understands</li>
              <li className="flex items-start gap-2"><span className="text-red-400 shrink-0 mt-0.5">•</span>Clients can't visualize the final look</li>
              <li className="flex items-start gap-2"><span className="text-red-400 shrink-0 mt-0.5">•</span>You lose projects to designers with renders</li>
              <li className="flex items-start gap-2"><span className="text-red-400 shrink-0 mt-0.5">•</span>Can only charge €200–€500 per project</li>
            </ul>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
            <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest mb-3">✅ With V-Ray + D5 Render</h3>
            <ul className="space-y-2.5 text-sm text-gray-700">
              <li className="flex items-start gap-2"><span className="text-emerald-400 shrink-0 mt-0.5">•</span>Photorealistic images that look like real photos</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400 shrink-0 mt-0.5">•</span>Clients get excited and approve instantly</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400 shrink-0 mt-0.5">•</span>Stand out from every other designer</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400 shrink-0 mt-0.5">•</span>Charge €2,000–€5,000+ per project</li>
            </ul>
          </div>
        </div>

        {/* ─── COURSE CARDS ─── */}
        <div className="upsell-fade grid grid-cols-1 md:grid-cols-2 gap-4 mb-10" style={{ animationDelay: '0.3s' }}>
          {/* V-Ray Card */}
          <div className="bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
            <div className="relative aspect-video overflow-hidden bg-gray-100">
              <img src="https://lh3.googleusercontent.com/d/1aHEt_z78tYD_0Cn66DiduAnhwn-o8El8" alt="V-Ray Photorealism" className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">V-Ray</div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-gray-900 text-sm mb-1">V-Ray Photorealism</h4>
              <p className="text-xs text-gray-500 mb-3">Make your 3D models look like real photographs.</p>
              <div className="space-y-1.5">
                {["Set up realistic sunlight and night lighting", "Make materials look like real wood and glass", 'Take "photographs" of your 3D house'].map((p, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0 mt-0.5" />{p}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1 mt-3">
                <Star size={10} className="fill-orange-400 text-orange-400" />
                <span className="text-[10px] text-gray-500 font-medium">48k students</span>
              </div>
            </div>
          </div>

          {/* D5 Render Card */}
          <div className="bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
            <div className="relative aspect-video overflow-hidden bg-gray-100">
              <img src="https://lh3.googleusercontent.com/d/1vbV4j6K9sgzbbZ7qlRdgqPTXWiHBPLsr" alt="D5 Render Realtime" className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">D5 Render</div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-gray-900 text-sm mb-1">D5 Render Realtime</h4>
              <p className="text-xs text-gray-500 mb-3">See the final result instantly while you design.</p>
              <div className="space-y-1.5">
                {["Real-time lighting — see changes as you work", "Drag and drop thousands of free 3D assets", "Make 4K images and video walkthroughs in seconds"].map((p, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0 mt-0.5" />{p}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1 mt-3">
                <Star size={10} className="fill-orange-400 text-orange-400" />
                <span className="text-[10px] text-gray-500 font-medium">19k students</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── PRICE CARD ─── */}
        <div className="upsell-fade bg-white shadow-xl border border-gray-100 rounded-2xl p-6 mb-10 relative overflow-hidden" style={{ animationDelay: '0.4s' }}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-[60px] -mr-10 -mt-10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">Rendering Bundle</p>
                <p className="text-gray-500 text-sm">V-Ray + D5 Render (2 Courses)</p>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-lg line-through mr-2">€{FRONT_END_ORIGINAL_PRICE}</span>
                <span className="text-4xl font-display font-black text-gray-900">€{FRONT_END_PRICE}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
              <Zap size={14} className="text-emerald-500" />
              <span className="text-sm font-semibold text-emerald-700">You save €{FRONT_END_ORIGINAL_PRICE - FRONT_END_PRICE} — that's {Math.round((1 - FRONT_END_PRICE / FRONT_END_ORIGINAL_PRICE) * 100)}% off!</span>
            </div>
          </div>
        </div>

        {/* ─── WHAT YOU GET ─── */}
        <div className="upsell-fade bg-white shadow-sm border border-gray-200 rounded-2xl p-5 mb-10" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Everything Included:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "V-Ray Photorealistic Rendering",
              "D5 Render Real-time Engine",
              "Interior & Exterior Lighting",
              "Material Mastering (Wood, Glass, Metal)",
              "4K Image & Video Export",
              "Cinematic Video Walkthroughs",
              "10,000+ Textures Library",
              "Lifetime Access & Updates",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ─── CTA ─── */}
        <div className="mb-10">
          {renderFormOrCTA()}
        </div>

        {/* ─── SOCIAL PROOF ─── */}
        <div className="upsell-fade mt-10 text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-orange-400 text-orange-400" />)}
          </div>
          <p className="text-gray-600 text-sm italic">"I was only using SketchUp for months. The moment I added V-Ray, my clients started saying YES on the first meeting. The renders sell themselves."</p>
          <p className="text-gray-500 text-xs mt-2 font-bold">— Priya M., Freelance Architect, Mumbai</p>
        </div>

      </div>
    </div>
  );
};

export default RenderUpsellPage;
