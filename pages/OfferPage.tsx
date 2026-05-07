import React, { useState, useEffect } from "react";
import { RAW_BOOKS, UPSELL2_PRICE, UPSELL2_ORIGINAL_PRICE, DOWNSELL_BOOKS_PRICE } from "../constants";
import { Sparkles, Timer, CheckCircle2, Mail, Lock, Check, ArrowRight, Gift, Zap, Star, ShieldCheck, BookOpen, X } from "lucide-react";
import ModernPaymentForm from "../components/ui/modern-payment-form";
import { useNavigate, useLocation } from "react-router-dom";
import { chargeSavedCardUpsell } from "../services/stripe";
import { sendStageEmail } from "../services/email";
import FunnelProgressBar from "../components/FunnelProgressBar";

const OfferPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const customerId = location.state?.customerId;
  const paymentMethodId = location.state?.paymentMethodId;
  const paymentIntentId = location.state?.paymentIntentId;
  const emailFromState = location.state?.email ?? '';
  const [timeLeft, setTimeLeft] = useState({ m: 14, s: 59 });
  const [email, setEmail] = useState(emailFromState);
  const [showPayment, setShowPayment] = useState<false | 'books' | 'downsell'>(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessingUpSell, setIsProcessingUpSell] = useState(false);
  const [isProcessingDownsell, setIsProcessingDownsell] = useState(false);
  const [isConfirmingSkip, setIsConfirmingSkip] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if ((window as any).fbq) (window as any).fbq("track", "ViewContent", { content_name: "Avada Books Upsell", value: UPSELL2_PRICE, currency: "USD" });
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

  const handleSuccess = (productMode: 'books' | 'downsell') => {
    if ((window as any).fbq) (window as any).fbq("track", "Purchase", { value: productMode === 'downsell' ? DOWNSELL_BOOKS_PRICE : UPSELL2_PRICE, currency: "USD" });
    sendStageEmail(email, productMode);
    setPaymentSuccess(true);
  };

  const handleSkip = () => {
    setPaymentSuccess(true);
  };

  const executeUpsell = async () => {
    if (customerId) {
        setIsProcessingUpSell(true);
        try {
          await chargeSavedCardUpsell(customerId, `€${UPSELL2_PRICE}`, paymentMethodId, paymentIntentId);
          handleSuccess('books');
        } catch (err) {
          console.error("One-click upsell failed", err);
          setIsProcessingUpSell(false);
          setShowPayment('books');
          setIsConfirmingSkip(false);
        }
      } else {
        setShowPayment('books');
        setIsConfirmingSkip(false);
      }
  };

  const executeDownsell = async () => {
    if (customerId) {
        setIsProcessingDownsell(true);
        try {
          await chargeSavedCardUpsell(customerId, `€${DOWNSELL_BOOKS_PRICE}`, paymentMethodId, paymentIntentId);
          handleSuccess('downsell');
        } catch (err) {
          console.error("One-click downsell failed", err);
          setIsProcessingDownsell(false);
          setShowPayment('downsell');
          setIsConfirmingSkip(false);
        }
      } else {
        setShowPayment('downsell');
        setIsConfirmingSkip(false);
      }
  };

  // ─── SUCCESS SCREEN ───
  if (paymentSuccess) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 to-orange-400" />
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <Check size={40} className="text-green-600" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-display font-black text-gray-900 mb-2">You're All Set!</h2>
        <p className="text-gray-500 text-sm mb-6">Your order is complete. We've generated your custom access dashboard.</p>
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 mb-4 text-left">
          <p className="text-emerald-800 text-sm font-black mb-1">Check Your Email Inbox Now</p>
          <p className="text-emerald-700 text-xs leading-relaxed">Your secure layout and course access links have been successfully delivered to your email. Please check your inbox (and spam folder) to open your library. Mail may take up to 5 minutes sometimes to arrive.</p>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5 text-left text-xs font-medium text-gray-600">
          Didn't receive the email? Wait 2 minutes. If it's still missing, please take a screenshot of this page and WhatsApp us at <strong className="text-gray-900">+91 91987 47810</strong> for manual activation.
        </div>
        
        <button onClick={() => window.location.href = "mailto:"}
          className="block w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl text-center text-sm transition-colors">
          Open Email App
        </button>
      </div>
    </div>
  );

  const renderFormOrCTA = (isBottom: boolean = false) => (
    <div className="upsell-fade" style={{ animationDelay: '0.6s' }}>
      <div className="space-y-3">
        {/* Primary CTA */}
        <button
          disabled={isProcessingUpSell}
          onClick={executeUpsell}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 shadow-xl shadow-orange-500/20 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 group hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-wait"
        >
          <BookOpen size={20} />
          {isProcessingUpSell ? "Processing Upgrade..." : "Yes! I want it."}
          {!isProcessingUpSell && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
        </button>

        <button
          onClick={() => {
            if (isBottom) {
              setIsConfirmingSkip(true);
            } else {
              const el = document.getElementById('final-bottom-cta');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="block w-full py-3 text-center text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors underline underline-offset-4 decoration-gray-300 disabled:opacity-50"
        >
          No thanks, I don't need the design theory books →
        </button>

        <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 font-medium uppercase tracking-wide mt-2">
          <span className="flex items-center gap-1"><ShieldCheck size={10} /> 7-Day Refund</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Lock size={10} /> Secured</span>
          <span>•</span>
          <span>One-time charge</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-white text-gray-900 overflow-x-hidden">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .upsell-fade { animation: fadeIn 0.6s ease-out both; }
      `}</style>

      {/* ─── FUNNEL PROGRESS BAR ─── */}
      <FunnelProgressBar step={3} />

      {/* ─── URGENCY TOP BAR ─── */}
      <div className="bg-orange-500 text-white text-center py-2 px-4">
        <div className="flex items-center justify-center gap-2 text-sm font-bold">
          <Timer size={14} className="animate-pulse" />
          <span>LAST STEP: This is a One-Time Offer — Expires in {f(timeLeft.m)}:{f(timeLeft.s)}</span>
        </div>
      </div>

      {/* ─── HERO SECTION ─── */}
      <div className="max-w-6xl mx-auto px-5 pt-8 md:pt-16 pb-8">
        {/* Top Collage Image + Video side by side */}
        <div className="reveal mb-8 md:mb-12 upsell-fade grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
          <img
            src="/images/hero-collage.png"
            alt="6 Books For Interior/Exterior Designing"
            className="w-full h-full object-cover rounded-3xl shadow-lg border border-gray-100"
          />
          <div className="relative w-full overflow-hidden rounded-2xl shadow-xl border border-gray-200 bg-black" style={{ paddingBottom: '56.25%' }}>
            <iframe
              title="Book flip-through preview"
              src="https://iframe.mediadelivery.net/embed/494628/223e3dd8-1052-49ec-99f4-c326b50108e6?autoplay=true&loop=true&muted=true&preload=true&responsive=true"
              loading="lazy"
              style={{ border: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div className="reveal text-center lg:text-left max-w-xl mx-auto lg:mx-0">
                <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 rounded-full px-4 py-1.5 mb-6">
                  <Gift size={14} className="text-orange-500" />
                  <span className="text-xs font-bold uppercase tracking-widest">Last Step: One-Time Offer</span>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-black leading-[1] mb-6 text-gray-900 tracking-tightest text-balance mx-auto lg:mx-0">
                  You don't need to <span className="font-serif italic font-normal text-orange-500">waste time</span> searching anymore.
                </h1>

                <p className="text-base md:text-lg text-gray-600 font-medium mb-3 leading-relaxed mx-auto lg:mx-0">
                  You have the software mastery. Now get the <strong className="text-gray-900">6 essential design books</strong> packed with 800+ pages of layouts, palettes, and rules that make your renders actually look like expensive lived-in homes.
                </p>
                <div className="mt-8">
                    {renderFormOrCTA()}
                </div>
            </div>

             {/* Right — Book visual grid */}
            <div className="reveal-scale hidden lg:block">
                <div className="grid grid-cols-3 gap-3">
                  {RAW_BOOKS.map((thumb, i) => (
                    <div key={i} className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-gray-100 group shadow-xl">
                      <img src={thumb.imageUrl} alt={thumb.title} className="w-full h-full object-cover opacity-90" />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">{thumb.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
        </div>
      </div>


      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* ─── PRICE CARD ─── */}
        <div className="upsell-fade bg-white shadow-xl border border-gray-100 rounded-2xl p-6 mb-12 relative overflow-hidden mt-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-[60px] -mr-10 -mt-10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">Complete Book Bundle</p>
                <p className="text-gray-500 text-sm">6 Interior Design Books (800+ Pages)</p>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-lg line-through mr-2">€{UPSELL2_ORIGINAL_PRICE}</span>
                <span className="text-4xl font-display font-black text-gray-900">€{UPSELL2_PRICE}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
              <Zap size={14} className="text-emerald-500" />
              <span className="text-sm font-semibold text-emerald-700">You save €{UPSELL2_ORIGINAL_PRICE - UPSELL2_PRICE} right now!</span>
            </div>
          </div>
        </div>


        {/* ─── INTERACTIVE DIAGRAMS ─── */}
        <section className="py-10 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="reveal text-center mb-8 md:mb-12">
              <p className="text-orange-500 text-xs font-bold uppercase tracking-[0.25em] mb-4 font-display">What makes these books special</p>
              <h2 className="text-3xl md:text-5xl font-display font-black text-gray-900 tracking-tightest leading-[1]">
                Learn with <span className="font-serif italic font-normal text-orange-500">Interactive Diagrams</span>
              </h2>
              <p className="text-gray-600 text-base md:text-lg mt-4 max-w-2xl mx-auto">
                Every page is filled with <span className="font-bold text-gray-900">handmade diagrams</span> covering room layouts, clearances, and dimensions — so you can see <span className="font-bold text-emerald-600">what works</span> and <span className="font-bold text-red-600">what doesn't</span> at a glance.
              </p>
            </div>

            {/* Diagram Grid Image */}
            <div className="reveal mb-6 md:mb-8">
              <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100 bg-white">
                <img
                  src="/images/interactive-diagrams-grid.png"
                  alt="Interactive floor plan diagrams showing living room, bedroom, bathroom, kitchen, and stairs designs with dimensions and clearances"
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Icons Image */}
            <div className="reveal">
              <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100 bg-white p-4 md:p-8">
                <img
                  src="/images/interactive-diagrams-icons.png"
                  alt="Four categories: Space Planning, Tips Tricks and Ideas, History of Architecture, Don'ts and Do's"
                  className="w-full h-auto max-w-3xl mx-auto"
                />
              </div>
            </div>
          </div>
        </section>




        {/* ─── WHAT'S INCLUDED ─── */}
        <div className="upsell-fade bg-white shadow-lg border border-gray-100 rounded-2xl p-5 mb-12 mt-12">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Inside the Book Collection:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "145+ Pages Living Room Guides",
              "180+ Pages Kitchen Blueprints",
              "120+ Pages Bedroom Psychology",
              "95+ Pages Washroom Masterclass",
              "110+ Pages Home Office & Study",
              "160+ Pages Exterior & Elevations",
              "Instant PDF Downloads",
              "Lifetime Updates Included"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ─── SECOND CTA SECTION ─── */}
        <div id="final-bottom-cta" className="bg-gray-50 border border-gray-100 p-8 rounded-3xl shadow-sm">
          <h3 className="text-center text-xl font-black text-gray-900 mb-6">Final choice before accessing your library</h3>
          {renderFormOrCTA(true)}
        </div>

        {/* ─── SOCIAL PROOF ─── */}
        <div className="upsell-fade mt-16 text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-orange-400 text-orange-400" />)}
          </div>
          <p className="text-gray-600 text-sm italic">"I bought the courses and skipped the books at first. Came back a week later just to get them because the layouts are so incredibly useful!"</p>
          <p className="text-gray-500 text-xs mt-2 font-bold">— Mark D., Freelance Visualizer</p>
        </div>

      </div>

      {/* ─── MODAL OVERLAYS ─── */}
      {showPayment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 w-full max-w-md relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowPayment(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20}/></button>
            <div className="flex items-center justify-between mb-4 mt-2">
              <h3 className="text-lg font-bold text-gray-900">Complete Your Upgrade</h3>
              <div className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">€{showPayment === 'books' ? UPSELL2_PRICE : DOWNSELL_BOOKS_PRICE}</div>
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
            <ModernPaymentForm bare email={email} onSuccess={() => handleSuccess(showPayment)} amount={`€${showPayment === 'books' ? UPSELL2_PRICE : DOWNSELL_BOOKS_PRICE}`} />
          </div>
        </div>
      )}

      {isConfirmingSkip && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border-2 border-orange-200 rounded-2xl p-8 text-center shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 relative">
            <button onClick={() => setIsConfirmingSkip(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20}/></button>
            <h4 className="text-orange-900 font-black text-2xl mb-2 mt-4">Wait! What if you only took our bestsellers?</h4>
            <p className="text-gray-800 text-sm mb-6 font-medium leading-relaxed">
              If the full bundle is too much right now, you can get <strong className="text-gray-900">just the Kitchen & Bedroom Design Books</strong> for only €${DOWNSELL_BOOKS_PRICE}. You can always add the other 4 books later for €24.
            </p>
            <div className="space-y-3">
              <button
                disabled={isProcessingDownsell || isProcessingUpSell}
                onClick={executeDownsell}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 text-white font-bold text-lg rounded-xl transition-all"
              >
                {isProcessingDownsell ? "Processing..." : `Yes, add the 2 books for €${DOWNSELL_BOOKS_PRICE}`}
              </button>
              <button
                disabled={isProcessingDownsell || isProcessingUpSell}
                onClick={handleSkip}
                className="block w-full py-3 text-center text-red-500 hover:text-red-700 text-sm font-bold transition-colors underline underline-offset-4 decoration-red-200"
              >
                No thanks, I don't want any books at all
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OfferPage;
