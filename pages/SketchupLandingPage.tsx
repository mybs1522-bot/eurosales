import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles, Download, X, Mail, Phone, Loader2, Check, Star, ChevronDown, Users, User } from 'lucide-react';
import { Logo } from './LandingHelpers';
import { sendStageEmail } from '../services/email';
import { ALL_COUNTRY_CODES as COUNTRY_CODES } from '../constants/countries';

// Auto-detect country from timezone
const detectCountry = (): string => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.includes('India') || tz.includes('Kolkata') || tz.includes('Calcutta')) return 'IN';
    if (tz.includes('Karachi') || tz.includes('Pakistan')) return 'PK';
    if (tz.includes('Dubai') || tz.includes('Abu_Dhabi')) return 'AE';
    if (tz.includes('Riyadh')) return 'SA';
    if (tz.includes('Doha') || tz.includes('Qatar')) return 'QA';
    if (tz.includes('Kuwait')) return 'KW';
    if (tz.includes('Bahrain')) return 'BH';
    if (tz.includes('Muscat')) return 'OM';
    if (tz.includes('Cairo')) return 'EG';
    if (tz.includes('Lagos')) return 'NG';
    if (tz.includes('Dhaka')) return 'BD';
    if (tz.includes('Colombo')) return 'LK';
    if (tz.includes('Kathmandu')) return 'NP';
    if (tz.includes('Kuala_Lumpur')) return 'MY';
    if (tz.includes('Singapore')) return 'SG';
    if (tz.includes('Manila') || tz.includes('Philippine')) return 'PH';
    if (tz.includes('Jakarta')) return 'ID';
    if (tz.includes('Nairobi')) return 'KE';
    if (tz.includes('Johannesburg')) return 'ZA';
    if (tz.includes('Accra')) return 'GH';
    if (tz.includes('London')) return 'GB';
    if (tz.includes('Sydney') || tz.includes('Melbourne')) return 'AU';
  } catch {}
  return 'IN'; // default
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ── Course Modules ──
const MODULES = [
  {
    num: '01',
    title: 'Create a 2D Floor Plan',
    image: 'https://www.balikahomes.com/cdn/shop/files/MODULE_1_SketchUp_Course.png?v=1764183325&width=3000',
    points: ['Set up & organise your model from scratch', 'Learn surfaces, edges & core SketchUp principles', '3 ways to build a floor plan — by measurement, JPEG or CAD import', 'Complete a real floor plan by module end'],
  },
  {
    num: '02',
    title: 'Furnish Your Floor Plan',
    image: 'https://www.balikahomes.com/cdn/shop/files/MODULE_2_SketchUp_Course.png?v=1764188186&width=3000',
    points: ['Find 2D furniture from the SketchUp 3D Warehouse', 'Create custom furniture symbols when needed', 'Apply spatial planning techniques room by room', 'Fully furnish the Eden Springs floor plan'],
  },
  {
    num: '03',
    title: 'Build Walls, Windows & Doors',
    image: 'https://www.balikahomes.com/cdn/shop/files/MODULE_3_SketchUp_Course.png?v=1764188551&width=3000',
    points: ['Construct walls and add windows & doors', 'Create arched openings with ease', 'Use SketchUp Warehouse objects effectively', 'Lay the foundation for materials & furnishing'],
  },
  {
    num: '04',
    title: 'Apply Textures & Materials',
    image: 'https://www.balikahomes.com/cdn/shop/files/MODULE_4_SketchUp_Course.png?v=1764188804&width=3000',
    points: ['Apply textures & materials to any surface', 'Adjust scale for realistic results', 'Find premium seamless texture sources', 'Create your own seamless textures from scratch'],
  },
  {
    num: '05',
    title: 'Furnish, Moulding & Custom Cabinetry',
    image: 'https://www.balikahomes.com/cdn/shop/files/MODULE_5_SketchUp_Course.png?v=1764189038&width=3000',
    points: ['Craft baseboards, crown molding & 3D wall panels', 'Apply paint or wallpaper to any surface', 'Import furniture from Warehouse or your computer', 'Build custom cabinetry — wardrobes, office walls & TV units'],
  },
  {
    num: '06',
    title: 'Furniture Time-Lapse',
    image: 'https://www.balikahomes.com/cdn/shop/files/MODULE_6_SketchUp_Course.png?v=1764189075&width=3000',
    points: ['Exclusive behind-the-scenes design time-lapses', 'Watch the Eden Springs furniture being modelled in 3D', 'Tips for crafting unique custom furniture pieces', 'Complements the vast SketchUp Warehouse library'],
  },
  {
    num: '07',
    title: 'Bathroom Design',
    image: 'https://www.balikahomes.com/cdn/shop/files/MODULE_7_SketchUp_Course.png?v=1764189293&width=3000',
    points: ['Master tile application in SketchUp', 'Integrate 3D bathroom fixtures seamlessly', 'Access measurements via the course E-Book', 'Unlock 75+ premium 3D Fixtures Collection files'],
  },
  {
    num: '08',
    title: 'Laundry Room Design',
    image: 'https://www.balikahomes.com/cdn/shop/files/MODULE_8_SketchUp_Course.png?v=1764189334&width=3000',
    points: ['Design the Eden Springs laundry room together', 'Craft basic cabinets and manage ventilation', 'Set optimal clothes rod heights and layouts', 'Practical tips for real-world laundry spaces'],
  },
  {
    num: '09',
    title: 'Kitchen Design',
    image: 'https://www.balikahomes.com/cdn/shop/files/MODULE_9_SketchUp_Course.png?v=1764189777&width=3000',
    points: ['Explore kitchen layouts and appliance placement', 'Learn standardised dimensions for functional spaces', 'Watch the Eden Springs kitchen time-lapse', 'Design your own personalised kitchen from scratch'],
  },
  {
    num: '10',
    title: 'Styles, Scenes & Exporting',
    image: 'https://www.balikahomes.com/cdn/shop/files/MODULE_10_SketchUp_Course.png?v=1764189792&width=3000',
    points: ['Manipulate SketchUp Styles for stunning 3D views', 'Access the curated Master Style Collection', 'Create scenes and export JPGs or video presentations', 'Present projects professionally and impress clients'],
  },
];


// ── Module Carousel ──
const ModuleCarousel: React.FC<{ onClaim: () => void }> = ({ onClaim }) => {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<'next' | 'prev'>('next');
  const [animating, setAnimating] = useState(false);

  const go = (to: number, direction: 'next' | 'prev') => {
    if (animating || to === active) return;
    setDir(direction);
    setAnimating(true);
    setTimeout(() => { setActive(to); setAnimating(false); }, 320);
  };

  const next = () => go((active + 1) % MODULES.length, 'next');
  const prev = () => go((active - 1 + MODULES.length) % MODULES.length, 'prev');

  const m = MODULES[active];

  return (
    <div className="relative">
      {/* Card */}
      <div
        className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden transition-all duration-300"
        style={{ opacity: animating ? 0 : 1, transform: animating ? (dir === 'next' ? 'translateX(30px)' : 'translateX(-30px)') : 'translateX(0)' }}
      >
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-1/2 shrink-0">
            <img
              src={m.image}
              alt={`Module ${m.num}`}
              className="w-full h-56 md:h-full object-cover"
              loading="lazy"
            />
          </div>
          {/* Content */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-3 py-1 mb-4">
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Module {m.num}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4 leading-tight">{m.title}</h3>
              <ul className="space-y-2.5 mb-6">
                {m.points.map((p, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 font-medium leading-snug">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={onClaim}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-orange-500/20"
            >
              Unlock This Module Free →
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-5">
        {/* Dots */}
        <div className="flex gap-2">
          {MODULES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i, i > active ? 'next' : 'prev')}
              className={`h-2 rounded-full transition-all duration-300 ${i === active ? 'w-6 bg-orange-500' : 'w-2 bg-slate-300'}`}
            />
          ))}
        </div>
        {/* Prev / Next */}
        <div className="flex gap-2">
          <button
            onClick={prev}
            className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:border-orange-400 hover:text-orange-500 transition-colors"
          >
            ← Prev
          </button>
          <button
            onClick={next}
            className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl hover:scale-[1.02] transition-transform shadow-md"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Counter */}
      <p className="text-center text-xs text-slate-400 font-semibold mt-3">
        Module {active + 1} of {MODULES.length}
      </p>
    </div>
  );
};


// ── SketchUp FAQ ──
const SKETCHUP_FAQ = [
  {
    question: 'Do I need any design experience to start this course?',
    answer: 'Absolutely not! The course starts from the very basics. Module 1 teaches you how to set up SketchUp from scratch, understand edges and surfaces, and build your first floor plan — no prior experience required.',
  },
  {
    question: 'Will I need to buy SketchUp? Is it expensive?',
    answer: 'No purchase needed to get started. SketchUp offers a free web-based version that covers everything taught in this course. We also show you how to access the free trial of SketchUp Pro if you want desktop features.',
  },
  {
    question: 'How long does it take to finish the course?',
    answer: 'Most students complete all 10 modules within 2–3 weeks, learning at 1–2 hours per day. Each module is focused and practical — you build a real project (Eden Springs) step by step throughout the course.',
  },
  {
    question: 'Can I really build full 3D rooms and kitchens from zero?',
    answer: 'Yes! By the end of Module 5 you will have furnished a complete floor plan with cabinetry. Modules 7–9 take you through a bathroom, laundry room and full kitchen design so you finish with a professional portfolio piece.',
  },
  {
    question: 'Is SketchUp enough to impress clients and get projects?',
    answer: 'SketchUp is an incredible design and modelling tool. To win high-paying clients you will eventually want to pair it with a rendering tool like V-Ray or D5 Render AI to produce photorealistic images. That\'s the next step after this free course!',
  },
  {
    question: 'What if I get stuck on a lesson?',
    answer: 'Our 24/7 support team is available on WhatsApp. Whether you are confused about how to draw walls, apply textures, or export a scene — we will personally guide you through it. You are never learning alone.',
  },
];

const SketchupFaq: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {SKETCHUP_FAQ.map((faq, i) => (
        <div
          key={i}
          className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-orange-300"
        >
          <button
            className="w-full flex items-center justify-between p-5 text-left gap-4"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="text-sm md:text-base font-semibold text-slate-900 pr-2">{faq.question}</span>
            <ChevronDown
              size={18}
              className={`text-slate-400 shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
            />
          </button>
          {open === i && (
            <div className="px-5 pb-5">
              <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ── SketchUp Claim Modal ──
const ROLE_OPTIONS_SK = ['Architect', 'Student', 'Interior Designer', 'Home Owner', 'Contractor', 'Other'];

const ClaimModal: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [countryCode, setCountryCode] = useState(() => detectCountry());
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>();
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
    fetch('https://1.1.1.1/cdn-cgi/trace')
      .then(res => res.text())
      .then(text => {
        const locLine = text.split('\n').find(line => line.startsWith('loc='));
        if (locLine) {
          const country = locLine.split('=')[1]?.trim();
          if (country && COUNTRY_CODES.some(c => c.code === country)) {
            setCountryCode(country);
          }
        }
      })
      .catch(() => {});
  }, []);

  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode) ?? COUNTRY_CODES[0];

  const validate = () => {
    const e: { name?: string; email?: string; phone?: string } = {};
    if (!name.trim()) e.name = 'Please enter your name';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
    if (!phone || phone.replace(/\D/g, '').length < 7) e.phone = 'Enter a valid phone number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    sendStageEmail(email, 'sketchup', `${selectedCountry.dial}${phone}`, name, role);
    setLoading(false);
    setDone(true);
    setTimeout(() => onSuccess(), 2200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400" />

        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100">
          <X size={18} />
        </button>

        <div className="p-7 pt-8">
          {done ? (
            /* ── SUCCESS STATE ── */
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-emerald-600" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Course sent! 🎉</h3>
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                Check your inbox — the SketchUp course link is on its way.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-left">
                <p className="text-orange-700 font-bold text-sm mb-1">⏳ We're preparing your next lesson...</p>
                <p className="text-orange-600 text-xs leading-relaxed">
                  SketchUp is just the design tool. Now let's get you the <strong>AI Rendering skills</strong> that win clients and charge €2,000–€5,000 per project.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 mt-5 text-orange-500">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm font-semibold">Taking you there now...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-3 py-1 mb-3">
                  <Sparkles size={12} className="text-orange-500" />
                  <span className="text-[11px] font-bold text-orange-700 uppercase tracking-widest">100% Free Access</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 leading-tight mb-1">Get Your Free SketchUp Course</h3>
                <p className="text-gray-500 text-sm">We'll send the course link to your email instantly.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1.5">Your Name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={name}
                      onChange={e => { setName(e.target.value); setErrors(v => ({ ...v, name: undefined })); }}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-xl text-sm font-medium focus:outline-none focus:bg-white transition-all ${errors?.name ? 'border-red-400' : 'border-gray-200 focus:border-orange-400'}`}
                    />
                  </div>
                  {errors?.name && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.name}</p>}
                </div>

                {/* I am */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1.5">I am a…</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {ROLE_OPTIONS_SK.map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`py-1.5 px-2 rounded-xl border-2 text-[11px] font-bold transition-all ${
                          role === r
                            ? 'bg-orange-50 border-orange-400 text-orange-700'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-orange-200'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      ref={emailRef}
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setErrors(v => ({ ...v, email: undefined })); }}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-xl text-sm font-medium focus:outline-none focus:bg-white transition-all ${errors?.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-400'}`}
                    />
                  </div>
                  {errors?.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1.5">Phone Number</label>
                  <div className="flex gap-2">
                    <div className="relative">
                      <select
                        value={countryCode}
                        onChange={e => setCountryCode(e.target.value)}
                        className="appearance-none bg-gray-50 border-2 border-gray-200 rounded-xl pl-3 pr-7 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:border-orange-400 transition-all cursor-pointer"
                        style={{ minWidth: '110px' }}
                      >
                        {COUNTRY_CODES.map(c => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.dial}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M6 8L1 3h10z"/></svg>
                      </div>
                    </div>
                    <div className="relative flex-1">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="9876543210"
                        value={phone}
                        onChange={e => { setPhone(e.target.value.replace(/[^0-9]/g, '')); setErrors(v => ({ ...v, phone: undefined })); }}
                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-xl text-sm font-medium focus:outline-none focus:bg-white transition-all ${errors?.phone ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-400'}`}
                      />
                    </div>
                  </div>
                  {errors?.phone && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.phone}</p>}
                  <p className="text-gray-400 text-xs mt-1">We'll send course updates & support to this number</p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-base rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-xl shadow-orange-500/25 disabled:opacity-70 disabled:cursor-wait"
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Sending Access...</>
                  ) : (
                    <><Download size={18} /> Send Me The Free Course <ArrowRight size={18} /></>
                  )}
                </button>

                <p className="text-center text-[11px] text-gray-400 leading-relaxed">
                  🔒 No spam. No credit card. Unsubscribe anytime.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main Page ──
const SketchupLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(() => {
    const D = (3 * 3600 + 36 * 60 + 20) * 1000;
    const r = D - (Date.now() % D);
    return { h: Math.floor((r / 3600000) % 24), m: Math.floor((r / 60000) % 60), s: Math.floor((r / 1000) % 60) };
  });
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if ((window as any).fbq) (window as any).fbq('track', 'ViewContent', { content_name: 'Sketchup Free Promo' });
  }, []);

  useEffect(() => {
    const calc = () => {
      const D = (3 * 3600 + 36 * 60 + 20) * 1000, now = Date.now(), r = D - (now % D);
      setTimeLeft({ h: Math.floor((r / 3600000) % 24), m: Math.floor((r / 60000) % 60), s: Math.floor((r / 1000) % 60) });
    };
    const t = setInterval(calc, 1000); calc(); return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const h = () => setShowStickyBar(window.scrollY > 600);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const f = (val: number) => val.toString().padStart(2, '0');

  const handleOpenModal = () => {
    if ((window as any).fbq) (window as any).fbq('track', 'Lead');
    setShowModal(true);
  };

  const handleSuccess = () => {
    navigate('/'); // → Render upsell
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden selection:bg-orange-100 pb-20">
      {/* ── STICKY HEADER ── */}
      <header className="sticky top-0 z-[60] bg-white/90 backdrop-blur-2xl border-b border-slate-100 px-5 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo />
          <button onClick={handleOpenModal} className="text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 0 20px rgba(249,115,22,0.45)' }}>
            Claim Free Course
          </button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative pt-10 md:pt-20 pb-14 overflow-hidden bg-white">
          <div className="w-full px-4 md:max-w-4xl md:mx-auto relative z-10 text-center">

            <div className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 border border-orange-200 rounded-full shadow-sm">
              <Sparkles size={14} className="text-orange-500" />
              <span className="text-[11px] md:text-sm font-bold text-orange-700 uppercase tracking-widest">Limited Time — 100% Free</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 leading-tight mb-4 tracking-tight">
              Mastering SketchUp Is
              <span className="text-orange-500 block mt-1">Easier Than You Think!</span>
            </h1>

            <p className="text-lg md:text-2xl font-bold text-slate-700 mb-4 max-w-2xl mx-auto">
              Get Amazing Results — Zero Prior Skills Needed!
            </p>

            {/* Social proof */}
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 mb-6">
              <div className="flex -space-x-1.5">
                {['🧑‍💻','👩‍🎨','👨‍🏫'].map((e, i) => (
                  <span key={i} className="w-7 h-7 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-sm">{e}</span>
                ))}
              </div>
              <span className="text-emerald-700 font-bold text-sm">Join <strong>1,250+ students</strong> already learning</span>
            </div>

            <p className="text-base md:text-lg text-slate-600 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              Master <strong className="text-slate-900">SketchUp & LayOut</strong> to bring your projects to life with stunning <strong className="text-slate-900">3D Designs</strong> and professional <strong className="text-slate-900">2D Drawings & Elevations</strong> — completely free, no credit card needed.
            </p>

            {/* Hero Video with gradient overlay */}
            <div className="relative w-full max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-2xl mb-10 border border-slate-100">
              <video
                src="https://www.balikahomes.com/cdn/shop/videos/c/vp/96f4b18bb1634b5eb1ab158c31964831/96f4b18bb1634b5eb1ab158c31964831.HD-1080p-7.2Mbps-62029396.mp4?v=0"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto object-cover"
                style={{ display: 'block' }}
              />
              {/* Black gradient at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
              {/* Overlay text */}
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-left">
                <p className="text-[10px] md:text-xs font-bold text-orange-400 uppercase tracking-[0.2em] mb-1.5">SketchUp Mastery</p>
                <h2 className="text-white font-display font-black text-2xl md:text-4xl leading-tight drop-shadow-lg">
                  Bring Your Design<br />
                  <span className="text-orange-400">Ideas to Life.</span>
                </h2>
              </div>
            </div>

            {/* CTA Box */}
            <div className="bg-slate-900 text-white rounded-3xl p-7 md:p-10 max-w-lg mx-auto shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/20 rounded-full blur-[60px] -mr-10 -mt-10" />
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold font-display mb-2">Claim Your Free Access</h3>
                <div className="flex items-center justify-center gap-3 text-sm text-slate-300 mb-7 font-medium flex-wrap">
                  <span className="line-through text-slate-500">€99.00 Value</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400 font-black">Yours 100% Free</span>
                  <span className="text-slate-600">•</span>
                  <span>No credit card</span>
                </div>
                <button
                  onClick={handleOpenModal}
                  className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] shadow-[0_0_20px_rgba(249,115,22,0.5)]"
                >
                  <Download size={20} />
                  Send Me The Free Course
                  <ArrowRight size={20} />
                </button>
                <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
                  🔒 Instant access via email. No spam. No credit card required.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MODULES CAROUSEL */}
        <section className="py-14 bg-slate-50 border-y border-slate-200 overflow-hidden">
          <div className="max-w-4xl mx-auto px-5">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">Course Curriculum</p>
              <h2 className="text-2xl md:text-4xl font-black font-display text-slate-900">What's Inside The Course</h2>
            </div>

            {/* Carousel */}
            <ModuleCarousel onClaim={handleOpenModal} />

            <div className="mt-10 text-center">
              <button onClick={handleOpenModal} className="px-10 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-base rounded-2xl hover:scale-[1.02] transition-transform shadow-xl shadow-orange-500/20">
                Get Free Access → No Credit Card
              </button>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="py-14 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-5">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">Student Reviews</p>
              <h2 className="text-2xl md:text-4xl font-black font-display text-slate-900">What Students Say About<span className="text-orange-500"> The Course</span></h2>
              <p className="text-slate-500 mt-2 text-sm">Real results from real learners — no fluff.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { name: 'Priya S.', role: 'Interior Design Student', location: 'Mumbai, India', stars: 5, content: 'I had zero knowledge of SketchUp before this course. The floor plan module alone changed everything — I built my first 3D room in one weekend. The step-by-step teaching style makes it so easy to follow.' },
                { name: 'Khalid A.', role: 'Architect', location: 'Dubai, UAE', stars: 5, content: 'The kitchen and bathroom modules are incredibly detailed. I now use SketchUp professionally for every client project. The cabinetry lessons saved me hours of manual drafting.' },
                { name: 'Fatima N.', role: 'Freelance Designer', location: 'Lagos, Nigeria', stars: 5, content: 'I tried other SketchUp tutorials on YouTube but always got confused. This course explains the 3 ways to build a floor plan so clearly. Module 3 on walls, windows and doors is a game changer!' },
                { name: 'Rohan V.', role: 'Architecture Graduate', location: 'Pune, India', stars: 5, content: 'The textures and materials module helped me make my renders look photorealistic even before I added any rendering software. I can now present designs to clients with full confidence.' },
              ].map((t, i) => (
                <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:border-orange-200 transition-all shadow-sm">
                  <div className="flex gap-1 mb-3">
                    {[...Array(t.stars)].map((_, j) => (
                      <Star key={j} size={14} className="fill-orange-500 text-orange-500" />
                    ))}
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed mb-5 italic">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center font-bold text-orange-500 text-sm">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 flex items-center gap-1">
                        {t.name} <CheckCircle2 size={12} className="text-orange-500" />
                      </p>
                      <p className="text-[11px] text-slate-400 uppercase tracking-wide">{t.role} · {t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MEET YOUR MENTORS ── */}
        <section className="py-14 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-5">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-500 text-white rounded-xl mb-4">
                <Users size={22} />
              </div>
              <h2 className="text-2xl md:text-4xl font-black font-display text-slate-900 mb-2">Meet Your Instructors</h2>
              <p className="text-slate-500 text-sm max-w-lg mx-auto">Industry professionals who guide you through every SketchUp concept — from your first floor plan to a fully furnished 3D model.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=560&fit=crop&crop=face',
                  name: 'James Carter',
                  role: 'Lead Architecture Instructor',
                  bio: 'With 12+ years in architectural visualization and SketchUp expertise, James designed the entire course curriculum — from the 2D floor plan fundamentals to advanced kitchen & cabinetry modules.',
                  skills: ['Floor Plan Mastery', 'Walls, Doors & Windows', 'Styles & Scenes Export'],
                },
                {
                  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=560&fit=crop&crop=face',
                  name: 'Sofia Reyes',
                  role: 'Interior Design Expert',
                  bio: 'Sofia has worked on real high-end residential projects across Europe and the Middle East. She teaches the furnishing, textures, bathroom and kitchen modules with practitioner-level depth.',
                  skills: ['Materials & Textures', 'Bathroom & Kitchen Design', 'Custom Cabinetry'],
                },
              ].map((mentor, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-orange-200">
                  <div className="flex gap-0">
                    <div className="w-28 md:w-36 shrink-0">
                      <img
                        src={mentor.image}
                        alt={mentor.name}
                        className="w-full h-full object-cover"
                        style={{ minHeight: '100%' }}
                      />
                    </div>
                    <div className="p-5 flex flex-col justify-between flex-1">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-1">{mentor.role}</p>
                        <h3 className="text-lg font-black text-slate-900 mb-2">{mentor.name}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed mb-3">{mentor.bio}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {mentor.skills.map((s, j) => (
                            <span key={j} className="inline-flex items-center gap-1 text-[10px] font-semibold bg-orange-50 border border-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                              <CheckCircle2 size={9} className="text-orange-500" /> {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-14 bg-white border-t border-slate-100">
          <div className="max-w-3xl mx-auto px-5">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">Got Questions?</p>
              <h2 className="text-2xl md:text-4xl font-black font-display text-slate-900">Frequently Asked Questions</h2>
            </div>
            <SketchupFaq />
          </div>
        </section>

      </main>

      {/* FLOATING STICKY BAR */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-2xl transform transition-transform duration-500 z-50 flex items-center justify-between md:justify-center md:gap-8 ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="hidden md:block">
          <p className="text-sm font-black text-slate-900">SketchUp Course — 100% Free</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">No credit card required</p>
        </div>
        <button onClick={handleOpenModal} className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold px-8 py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
          Claim Now <ArrowRight size={14} />
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <ClaimModal
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default SketchupLandingPage;
