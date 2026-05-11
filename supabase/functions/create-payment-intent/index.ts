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

    const { email, amount, currency, paymentIntentId } = await req.json();

    // CASE 1: Update existing PI with customer (called on submit when email is known)
    if (paymentIntentId && email) {
      let customerId: string | undefined;
      const existingCustomers = await stripe.customers.list({ email, limit: 1 });
      if (existingCustomers.data.length > 0) {
        customerId = existingCustomers.data[0].id;
      } else {
        const newCustomer = await stripe.customers.create({ email });
        customerId = newCustomer.id;
      }
      const updated = await stripe.paymentIntents.update(paymentIntentId, {
        customer: customerId,
        receipt_email: email,
      });
      return new Response(
        JSON.stringify({ clientSecret: updated.client_secret, customerId }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // CASE 2: Create new PI on page load (no email/customer yet)
    let numericAmount = 4900; // default €49
    if (amount) {
      const cleanAmount = amount.replace(/[^0-9.]/g, '');
      numericAmount = Math.round(parseFloat(cleanAmount) * 100);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: numericAmount,
      currency: currency || 'eur',
      metadata: { product: 'Avada Design Bundle' },
      payment_method_configuration: 'pmc_1TVz0fGGsoQTkhyve6oTQ6jG',
    });

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
