import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Check,
  CheckCircle2,
  Copy,
  Mail,
  MessageCircle,
  Star,
  ShieldCheck,
  Lock,
  X,
  Loader2,
  BookOpen,
  Sparkles,
  Camera,
} from "lucide-react";
import {
  FRONT_END_PRICE,
  FRONT_END_ORIGINAL_PRICE,
  UPSELL_PRICE,
  UPSELL_ORIGINAL_PRICE,
  UPSELL2_PRICE,
  UPSELL2_ORIGINAL_PRICE,
} from "../constants";
import { chargeSavedCardUpsell, getAccessLinks } from "../services/stripe";
import { sendStageEmail } from "../services/email";
import ModernPaymentForm from "../components/ui/modern-payment-form";

/* ─── product metadata ─── */
const PRODUCT_META: Record<
  string,
  {
    title: string;
    subtitle: string;
    gradient: string;
    icon: React.ReactNode;
    items: string[];
  }
> = {
  render: {
    title: "AutoCAD + SketchUp + D5 Render",
    subtitle: "3-Course Plan-to-Render Pipeline",
    gradient: "from-blue-600 to-indigo-500",
    icon: <Camera size={20} className="text-white" />,
    items: [
      "AutoCAD Planning & Drafting",
      "SketchUp Pro 3D Modeling",
      "D5 Render AI Real-time Engine",
      "10,000+ Textures Library",
      "Official Certificates",
      "Lifetime Access & Updates",
    ],
  },
  full: {
    title: "9-Course Complete Bundle",
    subtitle: "Full Design Arsenal Upgrade",
    gradient: "from-orange-500 to-amber-500",
    icon: <Sparkles size={20} className="text-white" />,
    items: [
      "AutoCAD Precision Drafting",
      "BIM with Revit",
      "3ds Max Advanced Modeling",
      "Lumion Cinematic Walkthroughs",
      "Enscape VR Visualization",
      "AI Architecture (Midjourney)",
      "Generative Design (Stable Diffusion)",
      "Unreal Engine 5 Walkthroughs",
      "Photoshop Post-Production",
    ],
  },
  books: {
    title: "6 Interior Design Books",
    subtitle: "Complete Book Collection (800+ Pages)",
    gradient: "from-emerald-500 to-teal-500",
    icon: <BookOpen size={20} className="text-white" />,
    items: [
      "Living Room Design (145+ Pages)",
      "Kitchen Design (180+ Pages)",
      "Bedroom Design (120+ Pages)",
      "Washroom Design (95+ Pages)",
      "Study/Office Design (110+ Pages)",
      "Exterior & Elevations (160+ Pages)",
    ],
  },
  downsell: {
    title: "Kitchen & Bedroom Books",
    subtitle: "2 Bestseller Design Books",
    gradient: "from-emerald-500 to-teal-500",
    icon: <BookOpen size={20} className="text-white" />,
    items: [
      "Kitchen Design (180+ Pages)",
      "Bedroom Design (120+ Pages)",
      "Instant PDF Downloads",
      "Lifetime Updates",
    ],
  },
};

/* ─── buy-now product cards ─── */
const BUY_NOW_PRODUCTS: {
  key: string;
  excludeIf: string[];
  price: number;
  originalPrice: number;
  amount: string;
}[] = [
  {
    key: "full",
    excludeIf: ["full"],
    price: UPSELL_PRICE,
    originalPrice: UPSELL_ORIGINAL_PRICE,
    amount: `€${UPSELL_PRICE}`,
  },
  {
    key: "books",
    excludeIf: ["books", "downsell"],
    price: UPSELL2_PRICE,
    originalPrice: UPSELL2_ORIGINAL_PRICE,
    amount: `€${UPSELL2_PRICE}`,
  },
];

const ThankYouPage: React.FC = () => {
  const location = useLocation();
  const customerId: string | undefined = location.state?.customerId;
  const paymentMethodId: string | undefined = location.state?.paymentMethodId;
  const paymentIntentId: string | undefined = location.state?.paymentIntentId;
  const email: string = location.state?.email ?? "";
  const [purchased, setPurchased] = useState<string[]>(
    location.state?.purchased ?? ["render"]
  );

  const [links, setLinks] = useState<Record<string, string>>({});
  const [linksLoading, setLinksLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Buy-now modal
  const [buyModal, setBuyModal] = useState<string | null>(null);
  const [buyProcessing, setBuyProcessing] = useState(false);

  // Confetti
  const [showConfetti, setShowConfetti] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(t);
  }, []);

  // Fetch access links
  useEffect(() => {
    if (purchased.length === 0) {
      setLinksLoading(false);
      return;
    }
    setLinksLoading(true);
    getAccessLinks(purchased).then((data) => {
      setLinks((prev) => ({ ...prev, ...data }));
      setLinksLoading(false);
    });
  }, [purchased]);

  const copyLink = (key: string, url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  const handleBuyNow = async (productKey: string, amount: string) => {
    if (customerId) {
      setBuyProcessing(true);
      try {
        await chargeSavedCardUpsell(
          customerId,
          amount,
          paymentMethodId,
          paymentIntentId
        );
        handleBuySuccess(productKey);
      } catch {
        setBuyProcessing(false);
        setBuyModal(productKey);
      }
    } else {
      setBuyModal(productKey);
    }
  };

  const handleBuySuccess = (productKey: string) => {
    const emailProduct = productKey as
      | "render"
      | "full"
      | "books"
      | "downsell";
    sendStageEmail(email, emailProduct);
    setPurchased((prev) => [...prev, productKey]);
    setBuyModal(null);
    setBuyProcessing(false);
    // fetch new link
    getAccessLinks([productKey]).then((data) =>
      setLinks((prev) => ({ ...prev, ...data }))
    );
  };

  const unpurchased = BUY_NOW_PRODUCTS.filter(
    (p) => !p.excludeIf.some((k) => purchased.includes(k))
  );

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti-piece {
          position: fixed; top: -20px; z-index: 1000; pointer-events: none;
          animation: confettiFall 3s ease-in forwards;
        }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .ty-fade { animation: fadeInUp 0.5s ease-out both; }
      `}</style>

      {/* ─── CONFETTI ─── */}
      {showConfetti &&
        Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${6 + Math.random() * 8}px`,
              height: `${6 + Math.random() * 8}px`,
              background: [
                "#10b981",
                "#3b82f6",
                "#f97316",
                "#eab308",
                "#ec4899",
                "#8b5cf6",
              ][i % 6],
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}

      {/* ─── a) WhatsApp Top Bar ─── */}
      <div className="bg-emerald-600 text-white text-center py-2.5 px-4">
        <a
          href="https://wa.me/919198747810"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-bold hover:underline"
        >
          <MessageCircle size={16} />
          Need help? Chat on WhatsApp →
        </a>
      </div>

      {/* ─── b) Success Header ─── */}
      <div className="ty-fade bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 text-white text-center py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="relative z-10 max-w-lg mx-auto">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-white/30">
            <Check size={40} className="text-white" strokeWidth={3} />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-black mb-2">
            Payment Confirmed!
          </h1>
          <p className="text-white/90 text-base mb-4">
            Your order is complete. Access everything below.
          </p>
          <a
            href="https://wa.me/919198747810"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold px-4 py-2 rounded-full mb-4 hover:bg-white/30 transition-colors"
          >
            If link not received — WhatsApp at +91 91987 47810
          </a>
          {email && (
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <Mail size={14} />
              <span className="text-sm font-medium">
                Confirmation sent to {email}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* ─── c) Your Purchases ─── */}
        {purchased.length > 0 && (
          <section className="ty-fade" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-500" />
              Your Purchases
            </h2>
            <div className="space-y-4">
              {purchased.map((key) => {
                const meta = PRODUCT_META[key];
                if (!meta) return null;
                const link = links[key];
                return (
                  <div
                    key={key}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                  >
                    <div
                      className={`bg-gradient-to-r ${meta.gradient} px-5 py-4 flex items-center gap-3`}
                    >
                      <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                        {meta.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-sm">
                          {meta.title}
                        </h3>
                        <p className="text-white/80 text-xs">{meta.subtitle}</p>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                        {meta.items.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm text-gray-700"
                          >
                            <CheckCircle2
                              size={13}
                              className="text-emerald-500 shrink-0"
                            />
                            {item}
                          </div>
                        ))}
                      </div>

                      {linksLoading ? (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Loader2
                            size={14}
                            className="animate-spin"
                          />
                          Loading access link...
                        </div>
                      ) : link ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 text-sm font-medium break-all hover:underline flex-1"
                          >
                            {link}
                          </a>
                          <button
                            onClick={() => copyLink(key, link)}
                            className="shrink-0 flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            {copiedKey === key ? (
                              <>
                                <Check size={12} /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy size={12} /> Copy
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700 font-medium">
                          📧 Access link sent to your email
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ─── d) Buy Now Section ─── */}
        {unpurchased.length > 0 && (
          <section className="ty-fade" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-xl font-black text-gray-900 mb-4">
              Complete Your Library
            </h2>
            <div className="space-y-4">
              {unpurchased.map((product) => {
                const meta = PRODUCT_META[product.key];
                if (!meta) return null;
                const displayItems = meta.items.slice(0, 4);
                const moreCount = meta.items.length - 4;
                return (
                  <div
                    key={product.key}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-10 h-10 bg-gradient-to-r ${meta.gradient} rounded-xl flex items-center justify-center`}
                        >
                          {meta.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-sm">
                            {meta.title}
                          </h3>
                          <p className="text-gray-500 text-xs">
                            {meta.subtitle}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-400 text-sm line-through mr-1">
                            €{product.originalPrice}
                          </span>
                          <span className="text-2xl font-display font-black text-gray-900">
                            €{product.price}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1.5 mb-4">
                        {displayItems.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-xs text-gray-600"
                          >
                            <CheckCircle2
                              size={12}
                              className="text-emerald-500 shrink-0"
                            />
                            {item}
                          </div>
                        ))}
                        {moreCount > 0 && (
                          <p className="text-xs text-gray-400 font-medium pl-5">
                            +{moreCount} more
                          </p>
                        )}
                      </div>
                      <button
                        disabled={buyProcessing}
                        onClick={() =>
                          handleBuyNow(product.key, product.amount)
                        }
                        className={`w-full py-3 bg-gradient-to-r ${meta.gradient} text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60`}
                      >
                        {buyProcessing ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />{" "}
                            Processing...
                          </>
                        ) : (
                          <>Add to My Library — €{product.price}</>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ─── e) Bookmark Reminder ─── */}
        <div
          className="ty-fade bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center"
          style={{ animationDelay: "0.3s" }}
        >
          <p className="text-blue-800 font-bold text-sm">
            📌 Bookmark This Page
          </p>
          <p className="text-blue-600 text-xs mt-1">
            Press <kbd className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-800 font-mono text-[10px]">Ctrl+D</kbd> to bookmark this page so you can access your links anytime.
          </p>
        </div>

        {/* ─── f) Support Section ─── */}
        <div
          className="ty-fade bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center"
          style={{ animationDelay: "0.35s" }}
        >
          <p className="text-emerald-800 font-bold text-sm mb-3">
            Need help with your order?
          </p>
          <a
            href="https://wa.me/919198747810"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            <MessageCircle size={16} />
            Chat on WhatsApp
          </a>
        </div>

        {/* ─── g) Email Fallback ─── */}
        {email && (
          <div
            className="ty-fade bg-gray-100 border border-gray-200 rounded-2xl p-5 text-center"
            style={{ animationDelay: "0.4s" }}
          >
            <p className="text-gray-700 text-sm font-medium mb-1">
              All access links were also sent to{" "}
              <strong className="text-gray-900">{email}</strong>
            </p>
            <p className="text-gray-500 text-xs mb-3">
              Check your inbox and spam folder. Emails may take up to 5 minutes.
            </p>
            <button
              onClick={() => (window.location.href = "mailto:")}
              className="bg-gray-900 hover:bg-black text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-colors"
            >
              Open Email App
            </button>
          </div>
        )}

        {/* ─── h) Social Proof ─── */}
        <div
          className="ty-fade text-center py-6"
          style={{ animationDelay: "0.45s" }}
        >
          <div className="flex items-center justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className="fill-orange-400 text-orange-400"
              />
            ))}
          </div>
          <p className="text-gray-600 text-sm italic max-w-md mx-auto mb-2">
            "I almost skipped this offer and I'm SO glad I didn't. The full
            bundle is worth 10x what I paid."
          </p>
          <p className="text-gray-500 text-xs font-bold">
            — Sarah K., Studio Owner, Berlin
          </p>
          <p className="text-gray-400 text-xs mt-3 font-semibold">
            50,000+ students worldwide
          </p>
        </div>
      </div>

      {/* ─── i) Payment Modal ─── */}
      {buyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setBuyModal(null);
                setBuyProcessing(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <div className="flex items-center justify-between mb-4 mt-2">
              <h3 className="text-lg font-bold text-gray-900">
                {PRODUCT_META[buyModal]?.title ?? "Complete Purchase"}
              </h3>
              <div className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">
                €
                {BUY_NOW_PRODUCTS.find((p) => p.key === buyModal)?.price ?? ""}
              </div>
            </div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5">
              Email
            </label>
            <div className="relative mb-3">
              <Mail
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                value={email}
                readOnly
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none"
              />
            </div>
            <ModernPaymentForm
              bare
              email={email}
              onSuccess={() => handleBuySuccess(buyModal)}
              amount={`€${BUY_NOW_PRODUCTS.find((p) => p.key === buyModal)?.price ?? ""}`}
            />
            <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 font-medium uppercase tracking-wide mt-4">
              <span className="flex items-center gap-1">
                <Lock size={10} /> SSL Secured
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck size={10} /> 7-Day Refund
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThankYouPage;
