import React, { useState, useEffect, useRef } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import type { Appearance } from "@stripe/stripe-js";
import { stripePromise, createPaymentIntent, linkCustomerToPaymentIntent } from "@/services/stripe";
import { Card, CardContent } from "@/components/ui/card";
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

interface CheckoutFormProps {
  email: string;
  onSuccess: (customerId?: string, paymentMethodId?: string, paymentIntentId?: string) => void;
  onBack?: () => void;
  amount: string;
  paymentIntentId: string;
}

function CheckoutForm({ email, onSuccess, onBack, amount, paymentIntentId }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if ((window as any).fbq) (window as any).fbq('track', 'AddPaymentInfo');
    setIsLoading(true);
    setMessage("");

    // Confirm payment FIRST — Apple Pay / Google Pay require confirmPayment to be called
    // immediately on user gesture. Any async work before it breaks the gesture chain.
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        receipt_email: email || undefined,
      },
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message ?? "Payment failed. Please try again.");
      setIsLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      const numericAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10) || 49;
      if ((window as any).fbq) (window as any).fbq('track', 'Purchase', { value: numericAmount, currency: 'EUR' });
      const paymentMethodId = typeof paymentIntent.payment_method === 'string'
        ? paymentIntent.payment_method
        : paymentIntent.payment_method?.id;

      // Link customer AFTER payment so upsell can charge the saved card
      let customerId: string | undefined;
      if (email && email.includes('@')) {
        try {
          const res = await linkCustomerToPaymentIntent(paymentIntentId, email);
          customerId = res.customerId;
        } catch (err: any) {
          console.warn('[Stripe] Customer link failed (non-blocking):', err?.message);
        }
      }

      onSuccess(customerId, paymentMethodId, paymentIntent.id);
    } else {
      setMessage("Unexpected state — please contact support.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <PaymentElement options={{
        layout: 'accordion',
        terms: { card: 'never', applePay: 'never', googlePay: 'never', paypal: 'never' },
      }} />

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

      {/* PayPal */}
      <div>
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
  amount = "€49",
  bare = false,
}: ModernPaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripePaymentIntentId, setStripePaymentIntentId] = useState<string>('');
  const [piError, setPiError] = useState("");
  const piCreatedRef = useRef(false);

  // Create PaymentIntent on page load — no email needed, PMC controls which methods show
  useEffect(() => {
    if (piCreatedRef.current) return;
    piCreatedRef.current = true;
    createPaymentIntent(amount)
      .then((res) => {
        setClientSecret(res.clientSecret);
        setStripePaymentIntentId(res.paymentIntentId);
      })
      .catch((err) => setPiError(err.message));
  }, [amount]);

  const wrap = (content: React.ReactNode) =>
    bare ? (
      <div className="border-t border-gray-100 mt-3 pt-4">{content}</div>
    ) : (
      <Card className="max-w-md w-full rounded-2xl shadow-2xl border-0">
        <CardContent className="p-6">{content}</CardContent>
      </Card>
    );

  if (piError) {
    return wrap(
      <p className="text-red-500 text-xs text-center bg-red-50 p-2.5 rounded-xl border border-red-100">{piError}</p>
    );
  }

  if (!clientSecret) {
    return wrap(
      <div className="space-y-3 animate-pulse">
        <div className="h-12 bg-gray-100 rounded-lg" />
        <div className="h-12 bg-gray-100 rounded-lg" />
        <div className="h-12 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return wrap(
    <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
      <CheckoutForm email={email} onSuccess={onSuccess} onBack={onBack} amount={amount} paymentIntentId={stripePaymentIntentId} />
    </Elements>
  );
}
