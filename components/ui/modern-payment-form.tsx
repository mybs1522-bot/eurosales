import React, { useState, useEffect, useRef } from "react";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import type { Appearance } from "@stripe/stripe-js";
import { stripePromise, createPaymentIntent, FALLBACK_STRIPE_LINK, sendAccessEmail } from "@/services/stripe";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FaPaypal } from "react-icons/fa";
import { Lock, ShieldCheck, Loader2 } from "lucide-react";

const PAYPAL_CLIENT_ID = 'AWfIxiBeqQ5trh_bHZddIyMxwiXLEfmX0hKQdZfP0SxiupVbbT07-Z9PFihDwcblTUJqF79zs3y8f0eu';

function PayPalButton({ email, onSuccess, amount }: { email: string; onSuccess: () => void; amount: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ppReady, setPpReady] = useState(!!(window as any).paypal);
  const [ppError, setPpError] = useState('');
  const [emailMsg, setEmailMsg] = useState('');

  // Keep refs to latest values so the PayPal onApprove closure never goes stale
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;
  const emailRef = useRef(email);
  emailRef.current = email;

  useEffect(() => {
    if (!PAYPAL_CLIENT_ID) { setPpError('not-configured'); return; }
    if ((window as any).paypal) { setPpReady(true); return; }
    const s = document.createElement('script');
    s.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=EUR`;
    s.onload = () => setPpReady(true);
    s.onerror = () => setPpError('load-failed');
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    if (!ppReady || !containerRef.current) return;
    containerRef.current.innerHTML = '';
    const amountVal = amount.replace(/[^\d.]/g, '');
    (window as any).paypal.Buttons({
      fundingSource: (window as any).paypal.FUNDING.PAYPAL,
      style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'paypal', height: 52 },
      createOrder: (_: any, actions: any) =>
        actions.order.create({
          purchase_units: [{ amount: { value: amountVal }, description: 'Avada Design Bundle – All Courses' }],
          payer: { email_address: emailRef.current },
        }),
      onApprove: async (_: any, actions: any) => { await actions.order.capture(); if ((window as any).fbq) (window as any).fbq('track', 'Purchase', { value: 49, currency: 'EUR' }); onSuccessRef.current(); },
      onError: (e: any) => console.error('[PayPal]', e),
    }).render(containerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ppReady]);

  useEffect(() => {
    if (email && email.includes('@')) {
      setEmailMsg('');
      const existing = document.getElementById('pp-email-error');
      if (existing) existing.remove();
    }
  }, [email]);

  const handleOverlayClick = () => {
    if (!emailRef.current || !emailRef.current.includes('@')) {
      setEmailMsg('show');
      const emailInput = document.querySelector('input[type="email"]') as HTMLElement;
      if (emailInput) {
        // Insert error message above the email input
        let errEl = document.getElementById('pp-email-error');
        if (!errEl) {
          errEl = document.createElement('p');
          errEl.id = 'pp-email-error';
          errEl.style.cssText = 'color:#ef4444;font-size:12px;margin:0 0 4px;font-weight:600;';
          errEl.textContent = 'Enter Your Mail Address';
          emailInput.parentElement?.parentElement?.insertBefore(errEl, emailInput.parentElement);
        }
        emailInput.classList.remove('shake-input');
        void emailInput.offsetWidth;
        emailInput.classList.add('shake-input');
        emailInput.focus();
      }
    }
  };

  if (ppError === 'not-configured') return (
    <div className="w-full py-3.5 bg-[#003087] rounded-xl flex items-center justify-center gap-2.5 opacity-40 cursor-not-allowed select-none">
      <FaPaypal size={22} className="text-white" />
      <span className="text-white font-bold text-base">PayPal — Client ID needed</span>
    </div>
  );

  if (ppError === 'load-failed') return null;

  if (!ppReady) return (
    <div className="w-full h-[52px] bg-[#003087]/10 rounded-xl animate-pulse" />
  );

  const needsEmail = !email || !email.includes('@');

  return (
    <>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-4px)}40%,80%{transform:translateX(4px)}}.shake-input{animation:shake 0.4s ease;}`}</style>
      <div className="relative w-full" style={{ minHeight: 52 }}>
        <div ref={containerRef} className="w-full" style={needsEmail ? { pointerEvents: 'none', position: 'relative', zIndex: 1 } : undefined} />
        {needsEmail && (
          <div
            onClickCapture={(e) => { e.stopPropagation(); e.preventDefault(); handleOverlayClick(); }}
            onMouseDownCapture={(e) => { e.stopPropagation(); e.preventDefault(); }}
            className="absolute top-0 left-0 w-full h-full cursor-pointer"
            style={{ zIndex: 9999 }}
          />
        )}
      </div>
    </>
  );
}

const appearance: Appearance = {
  theme: "stripe",
  variables: { colorPrimary: "#111827", fontFamily: "Inter, system-ui, sans-serif" },
};

const CARD_STYLE = {
  style: {
    base: {
      fontSize: "14px",
      color: "#111827",
      fontFamily: "Inter, system-ui, sans-serif",
      fontWeight: "400",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#ef4444" },
  },
};

const StripeInputWrap = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-10 w-full items-center rounded-md border border-gray-300 bg-white px-3 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-900/20 focus-within:border-gray-900 transition-colors">
    <div className="w-full">{children}</div>
  </div>
);

interface CheckoutFormProps {
  email: string;
  onSuccess: (customerId?: string, paymentMethodId?: string, paymentIntentId?: string) => void;
  onBack?: () => void;
  amount: string;
}

function CheckoutForm({ email, onSuccess, onBack, amount }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [cardTyped, setCardTyped] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) return;

    if ((window as any).fbq) (window as any).fbq('track', 'AddPaymentInfo');
    setIsLoading(true);
    setMessage("");

    let clientSecret: string;
    let customerId: string | undefined;
    try {
      const res = await createPaymentIntent(email, amount);
      clientSecret = res.clientSecret;
      customerId = res.customerId;
    } catch (err: any) {
      setMessage(err?.message ?? "Failed to initialise payment. Please try again.");
      setIsLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: { email: email || undefined },
      },
    });

    if (error) {
      setMessage(error.message ?? "Payment failed. Please try again.");
      setIsLoading(false);
    } else if (paymentIntent?.status === "succeeded") {
      const numericAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10) || 9;
      if ((window as any).fbq) (window as any).fbq('track', 'Purchase', { value: numericAmount, currency: 'EUR' });
      // Extract the payment method ID from the confirmed intent so upsell pages
      // can charge it directly without waiting for Stripe's async card-save flow.
      const paymentMethodId = typeof paymentIntent.payment_method === 'string'
        ? paymentIntent.payment_method
        : paymentIntent.payment_method?.id;
      onSuccess(customerId, paymentMethodId, paymentIntent.id);
    } else {
      setMessage("Unexpected state — please contact support.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Card fields */}
      <div className="space-y-3">
        <div className="space-y-1">
          <Label className="text-xs text-gray-600 font-semibold">Card number</Label>
          <StripeInputWrap>
            <CardNumberElement
              options={{ ...CARD_STYLE, showIcon: true }}
              onChange={(e) => setCardTyped(!e.empty)}
            />
          </StripeInputWrap>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-gray-600 font-semibold">Expiry</Label>
            <StripeInputWrap><CardExpiryElement options={CARD_STYLE} /></StripeInputWrap>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-gray-600 font-semibold">CVV</Label>
            <StripeInputWrap><CardCvcElement options={CARD_STYLE} /></StripeInputWrap>
          </div>
        </div>
      </div>

      {email && (
        <p className="text-xs text-gray-400 text-center">
          Receipt → <span className="font-semibold text-gray-600">{email}</span>
        </p>
      )}

      {message && (
        <p className="text-red-500 text-xs text-center bg-red-50 p-2.5 rounded-xl border border-red-100">{message}</p>
      )}

      <button type="submit" disabled={!stripe || isLoading}
        className="w-full h-12 bg-gray-900 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-base flex items-center justify-center gap-2 transition-all">
        {isLoading ? <><Loader2 size={18} className="animate-spin" /> Processing…</> : `Pay ${amount} · Get Instant Access`}
      </button>

      {/* PayPal — hidden once user starts typing card number */}
      <div className={`transition-all duration-300 overflow-hidden ${cardTyped ? 'max-h-0 opacity-0 pointer-events-none' : 'max-h-24 opacity-100'}`}>
        <div className="flex items-center gap-3 text-gray-600 mb-3">
          <hr className="flex-grow border-gray-300" />
          <span className="text-xs font-bold whitespace-nowrap text-gray-400">or pay with</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <PayPalButton email={email} onSuccess={onSuccess} amount={amount} />
      </div>

      <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 font-medium uppercase tracking-wide">
        <span className="flex items-center gap-1"><Lock size={10} /> SSL Secured</span>
        <span>•</span>
        <span className="flex items-center gap-1"><ShieldCheck size={10} /> 7-Day Refund</span>
        <span>•</span>
        <span>Lifetime Access</span>
      </div>
    </form>
  );
}

interface ModernPaymentFormProps {
  email: string;
  onSuccess: (customerId?: string, paymentMethodId?: string, paymentIntentId?: string) => void;
  onBack?: () => void;
  amount?: string;
  bare?: boolean;
}

export default function ModernPaymentForm({
  email,
  onSuccess,
  onBack,
  amount = "€9",
  bare = false,
}: ModernPaymentFormProps) {
  const wrap = (content: React.ReactNode) =>
    bare ? (
      <div className="border-t border-gray-100 mt-3 pt-4">{content}</div>
    ) : (
      <Card className="max-w-md w-full rounded-2xl shadow-2xl border-0">
        <CardContent className="p-6">{content}</CardContent>
      </Card>
    );

  return wrap(
    <Elements stripe={stripePromise} options={{ appearance }}>
      <CheckoutForm email={email} onSuccess={onSuccess} onBack={onBack} amount={amount} />
    </Elements>
  );
}
