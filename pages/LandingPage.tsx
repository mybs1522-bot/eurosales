import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, CheckCircle, CheckCircle2, X, ChevronDown, Sparkles, Eye, Download, Mail, Lock, Loader2, Timer, Check, ShieldCheck } from 'lucide-react';
import { FRONT_END_COURSES, FRONT_END_PRICE, FRONT_END_ORIGINAL_PRICE } from '../constants';
import TeamSection from '../components/ui/team';
import {
  Logo, SocialProofToast,
  PROBLEM_POINTS, TRANSFORMATION_STORIES, FEAR_STATS,
  VALUE_STACK_ITEMS, TESTIMONIALS_LANDING, FAQ_ITEMS_LANDING, INCOME_TIERS,
  COURSES_LANDING, PAGE_PREVIEWS_ROW1, PAGE_PREVIEWS_ROW2
} from './LandingHelpers';

/* ─── REUSABLE CTA WITH TIMER ─── */
const CtaWithTimer = ({ timeLeft, onClick, variant = 'green' }: { timeLeft: { h: number; m: number; s: number }; onClick: () => void; variant?: 'green' | 'dark' | 'blue' }) => {
  const f = (v: number) => v.toString().padStart(2, '0');
  const bgClass = variant === 'dark'
    ? 'bg-slate-900'
    : 'bg-white border border-slate-200';
  const btnClass = variant === 'dark'
    ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-500'
    : 'bg-slate-900 hover:bg-black';
  const timerAccent = variant === 'dark' ? 'text-orange-400' : 'text-orange-500';
  const timerBg = variant === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-orange-50 border-orange-200';

  return (
    <div className={`${bgClass} rounded-2xl px-5 py-6 relative overflow-hidden max-w-sm mx-auto`}>
      <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center gap-3">
        {/* Timer label */}
        <div className="flex items-center gap-1.5">
          <Timer size={14} className={`${timerAccent} animate-pulse`} />
          <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${timerAccent}`}>Offer Ends In</span>
        </div>

        {/* Timer digits */}
        <div className="flex items-center gap-1">
          {[{ val: f(timeLeft.h), label: 'HRS' }, { val: f(timeLeft.m), label: 'MIN' }, { val: f(timeLeft.s), label: 'SEC' }].map((unit, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center">
                <div className={`${timerBg} border rounded-md px-2 py-0.5`}>
                  <span className={`text-sm font-black tabular-nums font-mono ${variant === 'dark' ? 'text-white' : 'text-slate-900'}`}>{unit.val}</span>
                </div>
                <span className={`text-[6px] font-bold uppercase tracking-widest mt-0.5 ${variant === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{unit.label}</span>
              </div>
              {i < 2 && <span className={`text-xs font-bold ${variant === 'dark' ? 'text-slate-600' : 'text-slate-300'} -mt-3`}>:</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className={`text-sm ${variant === 'dark' ? 'text-slate-500' : 'text-slate-400'} line-through font-bold`}>€{FRONT_END_ORIGINAL_PRICE}</span>
          <span className={`text-3xl font-display font-black ${variant === 'dark' ? 'text-white' : 'text-slate-900'}`}>€{FRONT_END_PRICE}</span>
          <span className="bg-orange-100 text-orange-500 text-[9px] font-bold px-1.5 py-0.5 rounded-full">{Math.round((1 - FRONT_END_PRICE / FRONT_END_ORIGINAL_PRICE) * 100)}% OFF</span>
        </div>

        {/* Button */}
        <button
          onClick={onClick}
          className={`${btnClass} text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98] transition-all w-full`}
          style={{ boxShadow: '0 0 0 2px #f97316, 0 0 16px rgba(249,115,22,0.4)' }}
        >
          <Download size={16} className="shrink-0" />
          <span>Get Instant Access</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform shrink-0" />
        </button>

        <p className={`text-[10px] font-medium ${variant === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Lifetime access • Free AI software • 7-day money-back</p>
      </div>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(() => { const D = (3 * 3600 + 36 * 60 + 20) * 1000, r = D - (Date.now() % D); return { h: Math.floor((r / 3600000) % 24), m: Math.floor((r / 60000) % 60), s: Math.floor((r / 1000) % 60) }; });
  const [showStickyBar, setShowStickyBar] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); if ((window as any).fbq) (window as any).fbq('track', 'ViewContent', { content_name: 'Avada Design — AutoCAD + SketchUp + D5 Render AI', value: FRONT_END_PRICE, currency: 'EUR' }); }, []);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [studentCount, setStudentCount] = useState(22390);

  useEffect(() => {
    const calc = () => { const D = (3 * 3600 + 36 * 60 + 20) * 1000, now = Date.now(), r = D - (now % D); setTimeLeft({ h: Math.floor((r / 3600000) % 24), m: Math.floor((r / 60000) % 60), s: Math.floor((r / 1000) % 60) }); };
    const t = setInterval(calc, 1000); calc(); return () => clearInterval(t);
  }, []);
  useEffect(() => { const h = () => setShowStickyBar(window.scrollY > 600); window.addEventListener('scroll', h, { passive: true }); return () => window.removeEventListener('scroll', h); }, []);
  useEffect(() => { const t = setInterval(() => setStudentCount(c => c + 1), 4000); return () => clearInterval(t); }, []);

  const formatTime = (val: number) => val.toString().padStart(2, '0');

  const openPaymentModal = () => {
    if ((window as any).fbq) (window as any).fbq('track', 'InitiateCheckout');
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden selection:bg-orange-100">

      {/* ═══ EUROPE BANNER ═══ */}
      <div className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white text-center py-2.5 px-4">
        <p className="text-xs md:text-sm font-bold tracking-wide">Now available in Europe</p>
      </div>



      <main>
        {/* 1. HERO — The Primary Pitch */}
        <section className="relative pt-0 pb-6 md:pb-16 overflow-hidden" style={{ background: '#ffffff' }}>
          <div className="w-full px-4 md:max-w-3xl md:mx-auto relative z-10">
            <div className="flex flex-col items-center text-center pt-7 md:pt-14">

              {/* Top Text with Money Highlight */}
              <div className="mb-5 text-[7.5px] min-[360px]:text-[8.5px] min-[400px]:text-[9.5px] sm:text-xs md:text-sm font-black uppercase tracking-wider text-slate-900 whitespace-nowrap flex items-center justify-center gap-1 sm:gap-1.5 text-center max-w-full px-1">
                <span>START CHARGING</span>
                <span className="bg-[#FFD600] text-slate-950 px-1.5 sm:px-2.5 py-0.5 rounded-md sm:rounded-full font-black shadow-sm shrink-0">
                  €500–€2,000
                </span>
                <span>FOR DESIGNING AND RENDERING.</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl md:text-5xl font-display font-black text-slate-950 tracking-tight leading-[1.25] max-w-3xl mx-auto mb-4">
                Learn Interior & Exterior Designing in 15 days.{' '}
                <span className="bg-[#FFE500] text-slate-950 px-2.5 py-0.5 rounded-lg inline-block my-1 font-black shadow-sm">
                  Start Earning Fast
                </span>{' '}
                with 3 Paid Freelance Projects.
              </h1>

              {/* Sub-headline */}
              <p className="text-slate-600 font-medium text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-6">
                No university degree needed. No expensive software to buy. <strong className="text-slate-900 font-bold">All software download links included.</strong> Everything you need is included.
              </p>

              {/* Zero-knowledge note */}
              <div className="w-full mb-5 flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-left">
                <span className="text-xl shrink-0 mt-0.5">💻</span>
                <div>
                  <p className="text-sm font-black text-slate-900 mb-0.5">No prior knowledge needed. Zero.</p>
                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                    Never opened SketchUp? Never rendered anything? That's totally fine — we start from scratch. All you need is a <strong className="text-slate-700">laptop or PC</strong> and we'll take care of the rest.
                  </p>
                </div>
              </div>

              {/* Hero Video */}
              <div className="w-full mb-5 overflow-hidden rounded-2xl shadow-2xl border border-slate-100" style={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe src="https://iframe.mediadelivery.net/embed/489113/a214b199-e64a-4eaf-af70-edfbc586e5fd?autoplay=true&loop=true&muted=true&preload=true&responsive=true" loading="lazy" style={{ border: 0, position: 'absolute', top: 0, height: '100%', width: '100%' }} allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;" allowFullScreen={true} />
              </div>

              {/* Post-video hook */}
              <div className="w-full mb-6 text-center">
                <p className="text-xl md:text-3xl font-display font-black text-slate-900 leading-tight">
                  Design like Top Designers in{' '}
                  <span className="relative inline-block">
                    <span className="text-orange-500">15 Days.</span>
                    <span className="absolute -bottom-0.5 left-0 w-full h-[3px] bg-orange-300 rounded-full opacity-70"></span>
                  </span>
                </p>
                <p className="text-sm md:text-base font-bold text-slate-400 uppercase tracking-widest mt-1">No Bullshit.</p>
              </div>

              {/* Outcome strip */}
              <div className="w-full mb-4 flex gap-2">
                <div className="flex-1 bg-amber-50 border border-amber-200 rounded-xl px-3 py-3 text-left">
                  <p className="text-base font-black text-slate-900">💼 Land Higher-Paying Jobs</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Firms pay premium for rendering skills</p>
                </div>
                <div className="flex-1 bg-amber-50 border border-amber-200 rounded-xl px-3 py-3 text-left">
                  <p className="text-base font-black text-slate-900">🏢 Start Your Own Studio</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Full pipeline for freelance & studio work</p>
                </div>
              </div>

              <div className="w-full mb-5 bg-gradient-to-br from-orange-50/80 to-amber-50/40 border border-orange-200/80 rounded-2xl p-4 md:p-5 text-left shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-3 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-orange-500" /> Why This Bundle Is Different
                </p>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5 text-xs md:text-sm text-slate-800">
                    <CheckCircle size={15} className="text-orange-500 shrink-0 mt-0.5" />
                    <span><strong>100% Beginner Friendly</strong> — Start from absolute zero</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs md:text-sm text-slate-800">
                    <CheckCircle size={15} className="text-orange-500 shrink-0 mt-0.5" />
                    <span><strong>4-in-1 Workflow</strong> — Plan → Design → Animate → Render</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs md:text-sm text-slate-800">
                    <CheckCircle size={15} className="text-orange-500 shrink-0 mt-0.5" />
                    <span><strong>Software Included</strong> — Free & student download links</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs md:text-sm text-slate-800">
                    <CheckCircle size={15} className="text-orange-500 shrink-0 mt-0.5" />
                    <span><strong>Client-Ready in 15 Days</strong> — Build portfolio-grade renders fast</span>
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <button onClick={openPaymentModal} className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold text-base md:text-lg shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.03] transition-all flex items-center justify-center gap-3 group premium-stroke">
                <Download size={18} className="shrink-0" />
                Get All 4 Courses — €{FRONT_END_PRICE} <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </button>
              <p className="text-[11px] md:text-xs text-slate-400 mt-3 font-medium">24/7 Support • All Software Links Included • Free AI Software • 7-Day Guarantee</p>

              {/* Banners Below First CTA */}
              <div className="w-full mt-8 flex flex-col gap-6">
                <div className="w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-xl border border-slate-100 transition-all hover:shadow-2xl">
                  <img 
                    src="/learn-design-spaces.jpg" 
                    alt="Learn to Design Home, Offices & Villas" 
                    className="w-full h-auto object-cover rounded-2xl md:rounded-3xl"
                    loading="eager"
                  />
                </div>
                <div className="w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-xl border border-slate-100 transition-all hover:shadow-2xl">
                  <img 
                    src="/global-clients.jpg" 
                    alt="Design For Clients From US, UK, Europe - High Paying Clients" 
                    className="w-full h-auto object-cover rounded-2xl md:rounded-3xl"
                    loading="eager"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ═══════ COURSE SLIDESHOW — Master Every Tool ═══════ */}
        <section className="py-8 md:py-16 bg-white border-b border-gray-100 overflow-hidden relative">
           <div className="container mx-auto px-4 mb-8">
             <div className="text-center reveal">
                 <div className="inline-flex items-center gap-2 text-orange-500 text-xs font-bold uppercase tracking-widest mb-2">
                   <Sparkles size={14} />
                   4 Premium Courses Included
                 </div>
                 <h2 className="text-2xl md:text-4xl font-display font-black text-gray-900 leading-tight">Master the Complete<br/>Design-to-Render Pipeline</h2>
                 <p className="text-slate-500 mt-3 text-sm md:text-base max-w-2xl mx-auto">From your first 3D floor plan to stunning photorealistic renders & video walkthroughs — everything you need in one bundle.</p>
             </div>
           </div>
           
           {/* Course cards — 4 courses */}
           <div className="max-w-5xl mx-auto px-4">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
               {FRONT_END_COURSES.map((course, i) => (
                 <div key={course.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                   <div className="relative aspect-square overflow-hidden bg-gray-100">
                     <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     <div className="absolute top-1.5 left-1.5 w-6 h-6 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center font-display font-bold text-gray-900 shadow-sm text-[10px] border border-gray-200">{i + 1}</div>
                     <div className="absolute top-1.5 right-1.5 bg-white/95 backdrop-blur-sm text-gray-900 text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full shadow-sm border border-gray-200">{course.software}</div>
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                       <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-orange-500 shadow-lg"><Eye size={14} /></div>
                     </div>
                   </div>
                   <div className="p-2 md:p-3">
                     <h3 className="font-display font-bold text-gray-900 text-xs md:text-sm mb-1 line-clamp-1 leading-tight">{course.title}</h3>
                     <p className="text-[10px] md:text-xs text-gray-500 mb-2 line-clamp-2 hidden md:block">{course.description}</p>
                     <div className="mt-1 pt-1 border-t border-gray-100">
                       <div className="bg-orange-50 text-orange-600 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center justify-center gap-1 border border-orange-100 w-full"><CheckCircle2 size={8}/> Included</div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </section>



        {/* ═══════ CTA #1 — After Course Showcase ═══════ */}
        <section className="py-8 md:py-10 px-4 md:px-5">
          <div className="max-w-3xl mx-auto">
            <CtaWithTimer timeLeft={timeLeft} onClick={openPaymentModal} variant="green" />
          </div>
        </section>


        {/* AI ENHANCEMENT — Visual Proof */}
        <section className="py-16 md:py-20 bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-5">
            <div className="reveal text-center mb-10">
              <p className="text-orange-500 text-xs font-mono uppercase tracking-widest mb-3">AI-Powered Rendering</p>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">Learn <span className="text-orange-600">D5 Render AI</span></h2>
              <p className="text-slate-500 text-base max-w-xl mx-auto">Create stunning photorealistic renders in real-time — free AI tools that run locally on your system.</p>
            </div>
            <div className="reveal flex justify-center">
              <video
                src="https://rendair-landingpage.s3.us-east-1.amazonaws.com/rendair-ai-chat-03-cc.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full max-w-4xl rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* 4. STUDENT WORK CAROUSEL — Visual Proof */}
        <section className="py-16 md:py-24 bg-slate-50 overflow-hidden border-b border-slate-200 grid-bg">
          <div className="max-w-5xl mx-auto px-5 mb-12 text-center">
            <div className="reveal">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">See What Our <span className="text-orange-600">Students Have Created</span></h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto italic font-serif">"With 24/7 team support, these students transformed their portfolios and confidence."</p>
            </div>
          </div>
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex gap-3 md:gap-8 animate-scroll-left hover:pause">
              {[...PAGE_PREVIEWS_ROW1, ...PAGE_PREVIEWS_ROW1].map((img, i) => (
                <div key={i} className="w-[200px] md:w-[400px] shrink-0 aspect-video rounded-xl md:rounded-2xl overflow-hidden border border-slate-200 shadow-2xl relative group bg-slate-100">
                  <img src={img} alt="Student Work" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 md:gap-8 animate-scroll-right hover:pause">
              {[...PAGE_PREVIEWS_ROW2, ...PAGE_PREVIEWS_ROW2].map((img, i) => (
                <div key={i} className="w-[200px] md:w-[400px] shrink-0 aspect-video rounded-xl md:rounded-2xl overflow-hidden border border-slate-200 shadow-2xl relative group bg-slate-100">
                  <img src={img} alt="Student Work" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* 6. INCOME TIERS — The ROI */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-5">
            <div className="reveal text-center mb-10">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">Your €{FRONT_END_PRICE} Investment <br className="hidden md:block" /><span className="text-orange-600">Pays for Itself 100x Over</span></h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {INCOME_TIERS.map((tier, i) => (
                <div key={i} className="reveal bg-white border border-slate-200 rounded-2xl p-6 hover:border-orange-600/40 transition-all shadow-soft flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4"><span className="text-sm font-bold text-slate-900 leading-tight w-2/3">{tier.label}</span><span className="text-3xl">{tier.icon}</span></div>
                  <div className="flex items-center justify-between">
                    <div><p className="text-[10px] font-mono text-slate-500 uppercase">Before</p><p className="text-slate-400 text-sm line-through">{tier.before}</p></div>
                    <ArrowRight size={16} className="text-orange-600" />
                    <div className="text-right"><p className="text-[10px] font-mono text-orange-500 uppercase">After</p><p className="text-orange-600 text-sm font-bold">{tier.after}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. WHAT YOU GET — The Offer */}
        <section className="py-16 md:py-20 bg-slate-50 border-y border-slate-200 grid-bg">
          <div className="max-w-5xl mx-auto px-5">
            <div className="reveal text-center mb-10">
              <p className="text-orange-500 text-xs font-mono uppercase tracking-widest mb-3">Included with enrollment</p>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">Everything You Need to Succeed, <span className="text-orange-600">Included Today</span></h2>
              <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">The complete design-to-render toolkit — courses, software, support, and resources.</p>
            </div>
            <div className="reveal max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-soft">
              {VALUE_STACK_ITEMS.map((item, i) => (
                <div key={i} className={`flex justify-between items-center px-6 py-4 ${i !== VALUE_STACK_ITEMS.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <div className="flex items-center gap-3"><CheckCircle size={16} className="text-orange-500 shrink-0" /><span className="text-sm text-slate-800 font-medium">{item.name}</span></div>
                  <span className="text-sm font-bold text-slate-500">{item.value}</span>
                </div>
              ))}
              
              <div className="bg-orange-50 border-t border-orange-100 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-orange-600 shrink-0" /><span className="text-sm text-orange-900 font-bold">All Software (Free/Student Edition Links)</span></div>
                <span className="text-sm font-black text-orange-600">INCLUDED</span>
              </div>

              <div className="bg-orange-50/50 border-t border-orange-200 px-6 py-6 flex flex-col items-center gap-6 justify-center">
                <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full">
                  <span className="text-slate-900 font-bold text-center">Lifetime Access + Free Updates</span>
                </div>
                <button onClick={openPaymentModal} className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-orange-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group premium-stroke whitespace-nowrap">
                  <Download size={16} /> Get All 4 Courses — €{FRONT_END_PRICE} <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ CTA #2 — After Value Stack ═══════ */}
        <section className="py-8 md:py-10 px-4 md:px-5 bg-white">
          <div className="max-w-3xl mx-auto">
            <CtaWithTimer timeLeft={timeLeft} onClick={openPaymentModal} variant="green" />
          </div>
        </section>

        {/* 2. PROOF STATS */}
        <section className="py-10 bg-slate-50 border-y border-slate-200 grid-bg">
          <div className="max-w-5xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEAR_STATS.map((s, i) => (
              <div key={i} className="text-center reveal">
                <span className="text-2xl mb-2 block">{s.icon}</span>
                <span className="text-3xl md:text-4xl font-display font-black text-orange-500">{s.stat}</span>
                <p className="text-xs text-slate-500 mt-1 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MEET YOUR MENTORS */}
        <TeamSection />

        {/* 3. MANIFESTO — The Story & The Gap */}
        <section className="py-16 md:py-28 grid-bg bg-white border-b border-slate-200">
          <div className="max-w-3xl mx-auto px-5">
            <div className="reveal text-center mb-12">
              <p className="text-orange-500 text-xs font-mono uppercase tracking-widest mb-4">A Supportive Message from Our Team</p>
              <h2 className="text-3xl md:text-5xl font-serif italic text-slate-900 mb-8 leading-snug">"We believe every designer deserves restaurant-quality tools at street-food prices."</h2>
            </div>
            <div className="reveal space-y-6 text-slate-600 text-base md:text-lg leading-relaxed">
              <p>Learning AutoCAD, SketchUp, and D5 Render separately? That's <strong className="text-slate-900">€300+ in courses, months of confusion, and a dozen browser tabs</strong> you'll never close.</p>
              <p>We built this bundle because <strong className="text-orange-600">the design pipeline shouldn't be gatekept</strong>. Whether you're a student, a freelancer, or a studio owner — you deserve a clear, guided path from floor plan to photorealistic render.</p>
              <p>Every lesson is designed so you build <strong className="text-slate-900">real projects</strong>. Not theory. Not fluff. Actual rooms, actual renders, actual portfolio pieces.</p>
              
              <div className="my-10 bg-gradient-to-br from-orange-50 to-orange-50 border border-orange-200 rounded-2xl p-6 md:p-8 shadow-soft">
                <p className="font-bold text-slate-900 text-xl mb-4">Here's What Makes This Bundle Special:</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3"><CheckCircle size={18} className="text-orange-500 shrink-0" /><span className="text-slate-800"><strong>AutoCAD</strong> — Plan professional 2D floor plans & layouts, even if you've never opened the software.</span></li>
                  <li className="flex items-center gap-3"><CheckCircle size={18} className="text-orange-500 shrink-0" /><span className="text-slate-800"><strong>SketchUp</strong> — Design stunning 3D models from your plans, with textures and furniture.</span></li>
                  <li className="flex items-center gap-3"><CheckCircle size={18} className="text-orange-500 shrink-0" /><span className="text-slate-800"><strong>D5 Render AI</strong> — Real-time AI rendering: see changes instantly, generate 4K images in seconds.</span></li>
                  <li className="flex items-center gap-3"><CheckCircle size={18} className="text-orange-500 shrink-0" /><span className="text-slate-800">24/7 support, free software links, and a community that's always got your back.</span></li>
                </ul>
                <div className="mt-6 pt-6 border-t border-orange-100 flex items-center justify-between">
                  <span className="text-slate-600 text-sm italic font-bold">The complete planning-to-render ecosystem for just €{FRONT_END_PRICE}.</span>
                  <button onClick={openPaymentModal} className="text-orange-600 font-bold text-sm hover:text-orange-600 flex items-center gap-1 group">Get Started <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></button>
                </div>
              </div>

              <p className="text-slate-900 font-semibold text-lg md:text-xl border-l-4 border-orange-500 pl-4 bg-orange-50 p-4 rounded-r-xl">Stop collecting bookmarks. Start building a portfolio. 50,000+ students already did — and they started with the same €{FRONT_END_PRICE} decision you're about to make.</p>
            </div>
          </div>
        </section>


        {/* 5. OLD vs NEW — The Contrast */}
        <section className="py-16 md:py-24 bg-white grid-bg">
          <div className="max-w-5xl mx-auto px-5">
            <div className="reveal text-center mb-12"><h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">The Slow, Expensive Path <br className="hidden md:block" />vs. <span className="text-orange-600">Our €{FRONT_END_PRICE} Shortcut</span></h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="reveal grid-bg border border-red-200 rounded-2xl p-8 shadow-soft">
                <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"><X size={20} className="text-red-500" /></div><h3 className="text-xl font-bold text-red-500">The Old Struggle</h3></div>
                <ul className="space-y-4">
                  {PROBLEM_POINTS.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 text-sm"><span className="mt-1 shrink-0 text-base">{item.emoji}</span>{item.text}</li>
                  ))}
                  {['Searching random YouTube tutorials that leave you confused and frustrated', 'Paying expensive monthly subscriptions for software you barely know how to use', 'Graduating from college but lacking a truly stunning portfolio to get hired'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 text-sm"><X size={14} className="text-red-500 mt-1 shrink-0" />{item}</li>
                  ))}
                </ul>
              </div>
              <div className="reveal bg-gradient-to-br from-orange-50 to-slate-50 border border-orange-200 rounded-2xl p-8 shadow-soft">
                <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center"><CheckCircle size={20} className="text-orange-600" /></div><h3 className="text-xl font-bold text-slate-900">The €{FRONT_END_PRICE} Bundle</h3></div>
                <ul className="space-y-4">
                  {['AutoCAD: Draw professional floor plans & layouts in minutes', 'SketchUp: Build stunning 3D models from your plans', 'D5 Render AI: Real-time renders — see it as you design it', 'All software links provided — no expensive licenses needed', '24/7 team support — stuck on a render? We fix it with you'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700 text-sm"><CheckCircle size={14} className="text-orange-500 mt-1 shrink-0" />{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>


        {/* 8. TESTIMONIALS — Social Proof */}
        <section className="py-16 md:py-24 bg-white overflow-hidden grid-bg">
          <div className="max-w-5xl mx-auto px-5 mb-12">
            <div className="text-center mb-12">
              <p className="text-orange-500 text-xs font-mono uppercase tracking-widest mb-4">Student Reviews</p>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">Students & <span className="text-orange-500">Professionals</span></h2>
              <p className="text-slate-600 text-lg">50,000+ learners • 4.9★ average rating</p>
            </div>

            {/* Featured Transformations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {TRANSFORMATION_STORIES.map((story, i) => (
                <div key={i} className="reveal bg-gradient-to-br from-slate-50 to-orange-50 border border-slate-200 rounded-2xl p-8 shadow-soft relative overflow-hidden transition-all hover:border-orange-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
                  <span className="text-4xl mb-4 block">{story.emoji}</span>
                  <div className="flex items-center gap-2 mb-6"><span className="font-bold text-slate-900 text-lg">{story.name}</span><span className="text-sm font-medium text-orange-500">• {story.role}</span></div>
                  <div className="mb-4"><p className="text-[10px] font-mono uppercase text-slate-400 mb-1 tracking-wider">Before</p><p className="text-slate-600 text-sm leading-relaxed">{story.before}</p></div>
                  <div><p className="text-[10px] font-mono uppercase text-orange-500 mb-1 tracking-wider">After</p><p className="text-slate-900 text-base font-bold leading-relaxed">{story.after}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex gap-6 animate-scroll-left hover:pause">
              {[...TESTIMONIALS_LANDING, ...TESTIMONIALS_LANDING].map((t, i) => (
                <div key={i} className="w-[350px] shrink-0 bg-white border border-slate-200 p-8 rounded-3xl hover:border-orange-200 transition-all shadow-soft">
                  <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-orange-500 text-orange-500" />)}</div>
                  <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center font-bold text-orange-500">{t.name[0]}</div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900 flex items-center gap-1">{t.name} <CheckCircle size={12} className="text-orange-600" /></p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">{t.role} • {t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. FAQ + FINAL CTA */}
        <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200 grid-bg">
          <div className="max-w-3xl mx-auto px-5 mb-16">
            <div className="reveal text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">Common Questions</h2>
              <p className="text-slate-600 text-base">All your questions, answered.</p>
            </div>
            <div className="space-y-3">
              {FAQ_ITEMS_LANDING.map((faq, i) => (
                <details key={i} className="reveal group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-soft" open={openFaqIndex === i}>
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none" onClick={(e) => { e.preventDefault(); setOpenFaqIndex(openFaqIndex === i ? null : i); }}>
                    <span className="text-sm md:text-base font-semibold text-slate-900 pr-6">{faq.question}</span>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform shrink-0 ${openFaqIndex === i ? 'rotate-180' : ''}`} />
                  </summary>
                  <div className="px-5 pb-5"><p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p></div>
                </details>
              ))}
            </div>
          </div>

          {/* ═══════ CTA #3 — Final CTA ═══════ */}
          <div className="max-w-3xl mx-auto px-4 md:px-5">
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-xl md:text-3xl font-display font-bold text-slate-900 mb-2">Your future portfolio is one click away.</h3>
              <p className="text-slate-500 text-xs md:text-sm">50,000+ students chose this path. AutoCAD + SketchUp + D5 Render AI for €{FRONT_END_PRICE}. Lifetime access. Zero risk.</p>
            </div>
            <CtaWithTimer timeLeft={timeLeft} onClick={openPaymentModal} variant="dark" />
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 py-12 px-6 text-center border-t border-slate-800 text-white/70">
        <p className="text-xs uppercase tracking-[0.2em] mb-4">Avada Design & Architecture • 2026</p>
        <div className="flex justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400"><span>Privacy</span><span>Terms</span><span>Support</span></div>
      </footer>

      {/* ═══ WHATSAPP FLOAT ═══ */}
      <a href="https://wa.me/919198747810" target="_blank" rel="noopener noreferrer" 
        className="fixed bottom-16 right-4 z-[75] flex items-center gap-2 bg-slate-900 text-white text-[11px] font-bold px-3 py-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
        style={{ boxShadow: '0 4px 0 #000, 0 6px 16px rgba(0,0,0,0.3)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        <span className="hidden sm:inline">Chat with us</span>
      </a>

      {/* ═══ STICKY BOTTOM BAR ═══ */}
      <div className={`fixed bottom-0 left-0 right-0 z-[70] transition-transform duration-500 ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="w-full bg-white/98 backdrop-blur-2xl border-t border-slate-100 shadow-[0_-1px_40px_rgba(15,23,42,0.12)] px-4 py-2.5 flex items-center gap-3">
          {/* Left: price + timer */}
          <div className="flex flex-col items-start gap-0.5 shrink-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-slate-900">€{FRONT_END_PRICE}</span>
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-wide">Offer ends in</span>
            </div>
            <div className="flex items-center gap-0.5">
              {[formatTime(timeLeft.h), formatTime(timeLeft.m), formatTime(timeLeft.s)].map((val, i) => (
                <span key={i} className="flex items-center gap-0.5">
                  <span className="bg-slate-900 text-white text-[11px] font-black font-mono px-1.5 py-0.5 rounded tabular-nums">{val}</span>
                  {i < 2 && <span className="text-slate-400 text-[10px] font-bold mx-0.5">:</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Right: CTA button */}
          <div className="flex-1 flex flex-col gap-1">
            <button onClick={openPaymentModal} className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 text-white text-xs font-bold py-3 rounded-xl hover:bg-black transition-all"
              style={{ boxShadow: '0 0 0 2px #f97316, 0 0 12px rgba(249,115,22,0.35)' }}>
              Get All 4 Courses — €{FRONT_END_PRICE}
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      <SocialProofToast />
    </div>
  );
};

export default LandingPage;
