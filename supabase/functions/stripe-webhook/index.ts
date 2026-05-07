import Stripe from 'https://esm.sh/stripe@15.0.0?target=deno&no-check';
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

const SUPABASE_URL = 'https://aexrgtpxyzfxjecozstf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFleHJndHB4eXpmeGplY296c3RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyOTY0MjcsImV4cCI6MjA4Nzg3MjQyN30._ZSmh9iTP3etyGj5XrkEGJtRp9kR8z6jAmLOMesIvkg';

async function sendFbPurchaseEvent(email: string): Promise<void> {
  if (!email) return;
  try {
    await fetch(`${SUPABASE_URL}/functions/v1/fb-purchase-event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ email, value: 49, currency: 'USD' }),
    });
  } catch (e) {
    console.error('[stripe-webhook] sendFbPurchaseEvent failed:', e);
  }
}

// Removed sendAccessEmail to prevent duplicate emails. Frontend sends the structured email.

serve(async (req: Request) => {
  // Stripe sends POST only — no CORS preflight needed
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
  const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

  if (!STRIPE_WEBHOOK_SECRET) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET not set');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
    httpClient: Stripe.createFetchHttpClient(),
  });

  const signature = req.headers.get('stripe-signature') ?? '';
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error('[stripe-webhook] Signature verification failed:', err.message);
    return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400 });
  }

  console.log('[stripe-webhook] Event received:', event.type);

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    // Try receipt_email first (set at PaymentIntent creation time)
    let email: string = paymentIntent.receipt_email ?? '';

    // Fallback: get email from the charge billing_details
    if (!email && paymentIntent.latest_charge) {
      try {
        const charge = await stripe.charges.retrieve(paymentIntent.latest_charge as string);
        email = charge.billing_details?.email ?? '';
      } catch (e) {
        console.error('[stripe-webhook] Could not retrieve charge:', e);
      }
    }

    if (email) {
      console.log('[stripe-webhook] Sending FB event to:', email);
      await sendFbPurchaseEvent(email);
    } else {
      console.warn('[stripe-webhook] No email found on PaymentIntent:', paymentIntent.id);
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
