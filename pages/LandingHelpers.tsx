import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Zap, CheckCircle, Users, X } from 'lucide-react';

export const getDriveUrl = (id: string) => `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;

export const RAW_JOINERS = [
  { name: "Emma R.", city: "New York", time: "2 min ago" },
  { name: "Daniel C.", city: "Toronto", time: "5 min ago" },
  { name: "Olivia B.", city: "Sydney", time: "8 min ago" },
  { name: "Marco R.", city: "Milan", time: "12 min ago" },
  { name: "Sophie L.", city: "London", time: "15 min ago" },
  { name: "James C.", city: "Chicago", time: "18 min ago" },
  { name: "Sarah K.", city: "Berlin", time: "22 min ago" },
  { name: "Ryan M.", city: "Dubai", time: "25 min ago" },
  { name: "Chloe P.", city: "Singapore", time: "30 min ago" },
  { name: "Alex D.", city: "Barcelona", time: "33 min ago" },
];

export const PROBLEM_POINTS = [
  { emoji: "⏰", text: "Spending days on a single project because you don't know AutoCAD, SketchUp, or D5 Render — and clients keep asking for revisions?" },
  { emoji: "😰", text: "Feeling overwhelmed by the sheer number of tools studios expect you to know — planning, designing, rendering — where do you even start?" },
  { emoji: "🤖", text: "Watching AI generate stunning renders in seconds and worrying your traditional skills will become obsolete before you catch up?" }
];

export const TRANSFORMATION_STORIES = [
  { name: "Emma R.", role: "Freelance Designer", before: "Struggling alone with YouTube tutorials for months. Her floor plans were rough, SketchUp models looked amateur, and clients wouldn't pay more than €200.", after: "Mastered the full AutoCAD → SketchUp → D5 Render AI pipeline with 24/7 team support. Now charges €3,500+ per room and delivers in 48 hours instead of 2 weeks.", emoji: "✨" },
  { name: "Daniel C.", role: "Architecture Student", before: "Terrified of AI replacing his future job. College taught outdated software. Had no rendering skills and zero portfolio pieces worth showing.", after: "We walked him through the entire plan-to-render workflow. He now uses AutoCAD for planning, SketchUp for designing, and D5 AI for real-time client presentations. Just landed a dream internship.", emoji: "🎓" }
];

export const PAGE_PREVIEWS_ROW1 = [
  '/renders/RENDER-1.jpg', '/renders/RENDER-2.jpg', '/renders/RENDER-3.jpg',
  '/renders/RENDER-4.jpg', '/renders/RENDER-5.jpg', '/renders/RENDER-6.jpg',
  '/renders/RENDER-7.jpg', '/renders/RENDER-8.jpg', '/renders/RENDER-9.jpg',
  '/renders/RENDER-10.jpg', '/renders/RENDER-11.jpg', '/renders/RENDER-12.jpg',
  '/renders/RENDER-13.jpg',
];
export const PAGE_PREVIEWS_ROW2 = [
  '/renders/RENDER-14.jpg', '/renders/RENDER-15.jpg', '/renders/RENDER-16.jpg',
  '/renders/RENDER-17.jpg', '/renders/RENDER-18.jpg', '/renders/RENDER-19.jpg',
  '/renders/RENDER-20.jpg', '/renders/RENDER-21.jpg', '/renders/RENDER-22.jpg',
  '/renders/RENDER-23.jpg', '/renders/RENDER-24.jpg', '/renders/RENDER-25.jpg',
];

export const FEAR_STATS = [
  { stat: '82%', label: 'of visualization jobs now require planning, designing & rendering skills. SketchUp alone isn\'t enough.', icon: '📉' },
  { stat: '10x', label: 'faster output when you use the AutoCAD + SketchUp + D5 Render AI pipeline together.', icon: '🚀' },
  { stat: '24/7', label: 'Team support. We guide you through every installation, render, and software question personally.', icon: '🤝' },
  { stat: '15 Days', label: 'From opening SketchUp for the first time to creating portfolio-ready photorealistic renders.', icon: '⏳' },
];

/* ─── LOGO ─── */
export const Logo = () => (
  <div className="flex flex-col items-center text-center cursor-pointer group" onClick={() => window.location.href = '/'}>
    <span className="font-display font-bold text-lg tracking-tight leading-none text-slate-900 whitespace-nowrap">Avada</span>
    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-orange-500 whitespace-nowrap mt-1">Design</span>
  </div>
);

/* ─── FLIP CLOCK ─── */
const FlipDigit = ({ value }: { value: string }) => (
  <div className="flip-digit-wrapper"><div className="flip-digit"><span>{value}</span></div></div>
);

/* ─── CTA WIDGET ─── */
export const CallToActionWidget = ({ timeLeft, onClick, headline, subtext }: { timeLeft: { h: number; m: number; s: number }; onClick: () => void; headline?: string; subtext?: string }) => {
  const f = (v: number) => v.toString().padStart(2, '0');
  const h = f(timeLeft.h), m = f(timeLeft.m), s = f(timeLeft.s);
  return (
    <div className="relative py-12 md:py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="max-w-2xl mx-auto relative z-10 text-center">
        {headline && <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 tracking-tight">{headline}</h3>}
        {subtext && <p className="text-zinc-400 text-sm mb-6">{subtext}</p>}
        {!headline && <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-6">🚨 TIMER IS TICKING. DON'T MISS THIS.</p>}
        <div className="flex items-center justify-center gap-1 md:gap-2 mb-6">
          <div className="flip-clock-group"><div className="flex gap-1"><FlipDigit value={h[0]} /><FlipDigit value={h[1]} /></div><span className="flip-clock-label">HRS</span></div>
          <span className="text-xl md:text-3xl font-bold text-zinc-600 -mt-4">:</span>
          <div className="flip-clock-group"><div className="flex gap-1"><FlipDigit value={m[0]} /><FlipDigit value={m[1]} /></div><span className="flip-clock-label">MIN</span></div>
          <span className="text-xl md:text-3xl font-bold text-zinc-600 -mt-4">:</span>
          <div className="flip-clock-group"><div className="flex gap-1"><FlipDigit value={s[0]} /><FlipDigit value={s[1]} /></div><span className="flip-clock-label">SEC</span></div>
        </div>
        <div className="mb-6">
          <p className="text-red-400 font-semibold text-sm mt-2">SketchUp + V-Ray + D5 Render AI — All 3 Courses for Just €9</p>
        </div>
        <div className="w-full max-w-md mx-auto">
          <button onClick={onClick} className="cta-primary w-full text-white px-8 py-4 md:py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group hover:scale-[1.03] active:scale-[0.98] premium-stroke" style={{ background: 'linear-gradient(135deg, #f7a440 0%, #f7931e 100%)', boxShadow: '0 6px 20px -4px rgba(247,164,68,0.5), 0 12px 40px -8px rgba(247,147,30,0.25)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <span className="text-lg md:text-xl font-display font-bold uppercase tracking-widest relative z-10">Get Instant Access — €9</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-4 md:gap-8 text-[9px] md:text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-500">
          <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-orange-500" /> 7-Day Money-Back</div>
          <div className="w-[1px] h-3 bg-zinc-500"></div>
          <div className="flex items-center gap-1.5"><Zap size={14} className="text-orange-500" /> Instant Access</div>
          <div className="w-[1px] h-3 bg-zinc-500 hidden sm:block"></div>
          <div className="hidden sm:flex items-center gap-1.5"><Users size={14} className="text-orange-500" /> Free Software Included</div>
        </div>
      </div>
    </div>
  );
};

/* ─── SOCIAL PROOF TOAST ─── */
export const SocialProofToast: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const show = () => { setVisible(true); setTimeout(() => { setVisible(false); setTimeout(() => setIdx(p => (p + 1) % RAW_JOINERS.length), 400); }, 2500); };
    const t1 = setTimeout(show, 8000);
    const t2 = setInterval(show, 22000);
    return () => { clearTimeout(t1); clearInterval(t2); };
  }, []);
  const j = RAW_JOINERS[idx];
  return (
    <div className={`fixed bottom-20 left-3 z-[70] transition-all duration-400 ${visible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
      <div className="bg-white/95 backdrop-blur-xl border border-slate-100 rounded-full px-3 py-1.5 shadow-md flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>
        <p className="text-[11px] font-medium text-slate-600 whitespace-nowrap"><span className="font-bold text-slate-800">{j.name}</span> from {j.city} just enrolled</p>
      </div>
    </div>
  );
};

/* ─── CONSTANTS ─── */
export const VALUE_STACK_ITEMS = [
  { name: 'AutoCAD Planning & Drafting — Complete Course', value: 'Included' },
  { name: 'SketchUp 3D Modeling — Complete Course', value: 'Included' },
  { name: 'D5 Real-Time AI Rendering Course', value: 'Included' },
  { name: '10,000+ Premium Texture Library', value: 'Included' },
  { name: '2,000+ Drag-and-Drop 3D Models', value: 'Included' },
  { name: 'Software Installation Hub', value: 'Included' },
  { name: '24/7 Team Access & Portfolio Review', value: 'Included' },
  { name: 'Certified Digital Diploma', value: 'Included' },
];

export const TESTIMONIALS_LANDING = [
  { name: 'Emma R.', role: 'Freelance Designer', location: 'Los Angeles, USA', content: 'I went from zero knowledge to delivering full plans and photorealistic D5 renders in 3 weeks. The 24/7 support team patiently walked me through every step. Now I feel completely secure in my career.' },
  { name: 'James C.', role: 'Senior Architect', location: 'New York, USA', content: 'Having AutoCAD, SketchUp, and D5 Render in one bundle is genius. My studio now uses the full pipeline — plan, design, render — to generate gorgeous client presentations in minutes. Best €9 our firm ever invested.' },
  { name: 'Sophie L.', role: '3D Visualizer', location: 'London, UK', content: 'The step-by-step guidance from AutoCAD planning to SketchUp modeling to D5 rendering is incredible. I can make real-time changes during client meetings. Complete game-changer.' },
  { name: 'Daniel C.', role: 'Architecture Student', location: 'Toronto, Canada', content: 'College taught me outdated software. This bundle gave me AutoCAD + SketchUp + D5 Render in two weeks. I started freelancing before graduation and now earn more than some employed architects.' },
  { name: 'Olivia B.', role: 'Interior Designer', location: 'Sydney, Australia', content: 'To have someone look at your screen and say "press this button" saves weeks of frustration. AutoCAD for planning, SketchUp for designing, D5 for rendering. All for €9.' },
  { name: 'Marco R.', role: 'Landscape Architect', location: 'Milan, Italy', content: 'D5 Render combined with SketchUp is just magical. I plan in AutoCAD, design in SketchUp, and use D5 for real-time client walkthroughs. It took away all my anxiety about falling behind.' },
  { name: 'Sarah K.', role: 'Studio Owner', location: 'Berlin, Germany', content: 'My team of 4 now works with zero stress because we integrated the AutoCAD → SketchUp → D5 pipeline. No more late nights before client meetings. We deliver faster, charge more.' },
  { name: 'Ryan M.', role: 'Freelance Visualizer', location: 'Dubai, UAE', content: 'I almost quit design entirely because I couldn\'t connect the dots between planning and rendering. This bundle connected everything. AutoCAD for plans, SketchUp for 3D, D5 AI for speed.' },
  { name: 'Chloe P.', role: 'Design Student', location: 'Singapore', content: 'Started from absolute zero. Didn\'t even know what AutoCAD was. 15 days later, my portfolio had professional floor plans and photorealistic renders from D5 that landed me a paid studio gig.' },
  { name: 'Alex D.', role: 'Architect & Educator', location: 'Barcelona, Spain', content: 'Universities don\'t teach this pipeline. AutoCAD + SketchUp + D5 Render AI is what the industry actually uses. I recommend this €9 bundle to all my students — it\'s more practical than their entire semester.' },
];

export const FAQ_ITEMS_LANDING = [
  { question: "What exactly do I get for €9?", answer: "You get 3 complete courses: AutoCAD (professional 2D floor plans & drafting), SketchUp Pro (3D modeling from scratch), and D5 Render AI (real-time AI rendering). Plus 10,000+ textures, 2,000+ 3D models, all software download links, a certified diploma, and 24/7 team support. Lifetime access, one-time payment." },
  { question: "I'm a complete beginner — is this for me?", answer: "Absolutely! The AutoCAD course starts from 'how to open the software' and builds up to full floor plans. SketchUp and D5 Render courses follow the same beginner-friendly approach. Our 24/7 support team is always a WhatsApp message away whenever you feel stuck." },
  { question: "Why is it so cheap? What's the catch?", answer: "No catch. We believe high-quality design education shouldn't cost €300+. We've served 50,000+ students at this price point and it works — low price, high volume, massive impact. You get the same content other platforms charge hundreds for." },
  { question: "Do I need to buy expensive software?", answer: "Not at all. We provide links to official free or student versions of AutoCAD, SketchUp, and D5 Render. You won't spend a single extra euro on software licenses." },
  { question: "Will this actually help me get clients or a job?", answer: "Yes. The #1 reason designers struggle to land clients is they can't plan, design, and render professionally. This bundle teaches you the full pipeline — AutoCAD for planning, SketchUp for designing, D5 AI for rendering. Designers with these skills charge €2,000–€5,000 per project." },
  { question: "How long does it take to finish all 3 courses?", answer: "Most students complete the full pipeline in 2–3 weeks at 1–2 hours per day. AutoCAD takes about 5 days, SketchUp about 5, and D5 Render about 3. By day 15, you'll have portfolio-ready renders." },
  { question: "What if it's not for me?", answer: "We offer a 100% money-back guarantee within 7 days. If you feel it's not a good fit, just email us and we'll refund your €9 immediately — no questions asked. Zero risk." },
];

export const INCOME_TIERS = [
  { label: 'Single Render Charge', before: 'Can\'t render at all', after: 'Confidently quoting €200+', icon: '🖼️' },
  { label: 'Interior Design Project', before: 'Rejected for poor visuals', after: 'Winning €2,000–€5,000 contracts', icon: '🏠' },
  { label: 'Time to Finish a Room', before: '3 Frustrating Nights', after: '2 Hours with D5 Render AI', icon: '⏱️' },
  { label: 'Your Career Confidence', before: 'Anxious & Overwhelmed', after: 'In-Demand Professional', icon: '🌟' },
];

export const COURSES_LANDING = [
  {
    id: '1', title: 'AutoCAD Planning', software: 'AutoCAD', students: '42.5k',
    description: 'Draw professional 2D floor plans, layouts & construction drawings. The essential first step before any 3D work.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1fV5bz4JDugh8HxLMJ0fXu5K5sDj3qlSR',
    learningPoints: ['Draw accurate floor plans & furniture layouts from scratch', 'Print to-scale drawings for construction', 'Use shortcuts to draft 10x faster than others'],
    workflowImpact: 'Create professional blueprints that contractors can actually build from.'
  },
  {
    id: '3', title: 'SketchUp 3D', software: 'SketchUp', students: '55k',
    description: 'Build stunning 3D models from scratch — walls, furniture, kitchens, bathrooms. Turn your AutoCAD plans into immersive 3D designs.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1wl6by5AO5MiPeoYsZ8F6Zi5AJahoeTQo',
    learningPoints: ['Build complete 3D interiors from a blank canvas', 'Apply textures, materials & furniture with confidence', 'Export professional scenes ready for D5 Render'],
    workflowImpact: 'See your imagination come to life in 3D — no experience needed.'
  },
  {
    id: '7', title: 'D5 Render AI', software: 'D5 Render', students: '19k',
    description: 'AI-powered real-time rendering. See your changes instantly. Generate 4K images in seconds. The future of architectural visualization.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1vbV4j6K9sgzbbZ7qlRdgqPTXWiHBPLsr',
    learningPoints: ['Real-time rendering — see changes as you make them', 'AI-assisted lighting, materials & scene composition', 'Create cinematic 4K images & video walkthroughs in seconds'],
    workflowImpact: 'Make live design changes while the client watches — mind blown every time.'
  },
];
