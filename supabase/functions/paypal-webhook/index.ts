import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

const SUPABASE_URL = 'https://aexrgtpxyzfxjecozstf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFleHJndHB4eXpmeGplY296c3RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyOTY0MjcsImV4cCI6MjA4Nzg3MjQyN30._ZSmh9iTP3etyGj5XrkEGJtRp9kR8z6jAmLOMesIvkg';
const PAYPAL_API = 'https://api-m.paypal.com'; // use api-m.sandbox.paypal.com for sandbox

async function getPayPalAccessToken(clientId: string, secret: string): Promise<string> {
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${secret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  return data.access_token;
}

async function verifyPayPalWebhook(
  accessToken: string,
  webhookId: string,
  headers: Record<string, string>,
  body: string,
): Promise<boolean> {
  const res = await fetch(`${PAYPAL_API}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_algo: headers['paypal-auth-algo'],
      cert_url: headers['paypal-cert-url'],
      transmission_id: headers['paypal-transmission-id'],
      transmission_sig: headers['paypal-transmission-sig'],
      transmission_time: headers['paypal-transmission-time'],
      webhook_id: webhookId,
      webhook_event: JSON.parse(body),
    }),
  });
  const data = await res.json();
  return data.verification_status === 'SUCCESS';
}

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
    console.error('[paypal-webhook] sendFbPurchaseEvent failed:', e);
  }
}

// Removed sendAccessEmail to prevent duplicate emails. Frontend sends the structured email.
serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID') ?? '';
  const PAYPAL_SECRET = Deno.env.get('PAYPAL_SECRET') ?? '';
  const PAYPAL_WEBHOOK_ID = Deno.env.get('PAYPAL_WEBHOOK_ID') ?? '';

  const body = await req.text();
  const headers: Record<string, string> = {};
  req.headers.forEach((v, k) => { headers[k.toLowerCase()] = v; });

  // Verify signature if webhook ID is configured
  if (PAYPAL_WEBHOOK_ID) {
    try {
      const accessToken = await getPayPalAccessToken(PAYPAL_CLIENT_ID, PAYPAL_SECRET);
      const valid = await verifyPayPalWebhook(accessToken, PAYPAL_WEBHOOK_ID, headers, body);
      if (!valid) {
        console.error('[paypal-webhook] Signature verification failed');
        return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400 });
      }
    } catch (e) {
      console.error('[paypal-webhook] Verification error:', e);
      return new Response(JSON.stringify({ error: 'Verification error' }), { status: 500 });
    }
  } else {
    console.warn('[paypal-webhook] PAYPAL_WEBHOOK_ID not set — skipping signature verification');
  }

  let event: any;
  try {
    event = JSON.parse(body);
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  console.log('[paypal-webhook] Event received:', event.event_type);

  if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
    const email: string =
      event.resource?.payer?.email_address ??
      event.resource?.purchase_units?.[0]?.payee?.email_address ??
      '';

    if (email) {
      console.log('[paypal-webhook] Sending FB event to:', email);
      await sendFbPurchaseEvent(email);
    } else {
      console.warn('[paypal-webhook] No payer email in event:', JSON.stringify(event.resource?.payer));
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
