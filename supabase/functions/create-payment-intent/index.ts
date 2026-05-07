import Stripe from 'https://esm.sh/stripe@15.0.0?target=deno&no-check';
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2024-06-20',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const { email, amount, currency } = await req.json();
    let numericAmount = 900; // default 9
    if (amount) {
      const cleanAmount = amount.replace(/[^0-9.]/g, '');
      numericAmount = Math.round(parseFloat(cleanAmount) * 100);
    }

    // Find or create customer (required to save card)
    let customerId = undefined;
    if (email) {
      const existingCustomers = await stripe.customers.list({ email, limit: 1 });
      if (existingCustomers.data.length > 0) {
        customerId = existingCustomers.data[0].id;
      } else {
        const newCustomer = await stripe.customers.create({ email });
        customerId = newCustomer.id;
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: numericAmount,
      currency: currency || 'usd',
      customer: customerId,
      setup_future_usage: 'off_session', // THIS IS CRITICAL FOR ONE-CLICK UPSELL
      receipt_email: email || undefined,
      metadata: { product: 'Avada Design Bundle' },
      automatic_payment_methods: { enabled: true },
    });

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret, customerId }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
