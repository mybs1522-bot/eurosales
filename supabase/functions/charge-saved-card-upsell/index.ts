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

    const body = await req.json();
    const { customerId, amount, paymentMethodId: providedPaymentMethodId, paymentIntentId, currency } = body;
    
    let numericAmount = 2700; // default 27
    if (amount) {
      const cleanAmount = amount.replace(/[^0-9.]/g, '');
      numericAmount = Math.round(parseFloat(cleanAmount) * 100);
    }

    if (!customerId) {
      throw new Error('Customer ID is required');
    }

    let finalPaymentMethodId = providedPaymentMethodId;

    // If frontend didn't pass PaymentMethodId but DID pass PaymentIntentId, retrieve it safely
    if (!finalPaymentMethodId && paymentIntentId) {
      try {
        const pastIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (pastIntent.payment_method) {
           finalPaymentMethodId = typeof pastIntent.payment_method === 'string' 
             ? pastIntent.payment_method 
             : pastIntent.payment_method.id;
        }
      } catch (e: any) {
        console.error('[charge-saved-card-upsell] error retrieving payment intent', e.message);
      }
    }

    if (finalPaymentMethodId) {
      // We have an explicit payment method ID.
      // Explicitly attach it to the customer first (idempotent — if already
      // attached, Stripe just returns the existing attachment).
      try {
        await stripe.paymentMethods.attach(finalPaymentMethodId, {
          customer: customerId,
        });
      } catch (attachErr: any) {
        if (!attachErr.message?.includes('already been attached')) {
          console.error('[charge-saved-card-upsell] attach error:', attachErr.message);
          throw attachErr;
        }
      }
    } else {
      // Fallback: retrieve the customer's saved payment methods
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
        limit: 1,
      });

      if (paymentMethods.data.length === 0) {
        throw new Error('No saved payment methods found for this customer.');
      }

      finalPaymentMethodId = paymentMethods.data[0].id;
    }

    // Charge the card immediately
    const paymentIntent = await stripe.paymentIntents.create({
      amount: numericAmount,
      currency: currency || 'usd',
      customer: customerId,
      payment_method: finalPaymentMethodId,
      off_session: true,
      confirm: true,
      metadata: { product: 'Avada Design Bundle Upsell' },
    });

    return new Response(
      JSON.stringify({ success: true, paymentIntentId: paymentIntent.id, status: paymentIntent.status }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('[charge-saved-card-upsell] Error:', err.message);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
