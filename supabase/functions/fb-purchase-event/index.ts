import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function sha256(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { email, value = 49, currency = 'USD', event_source_url = '', client_ip = '', client_user_agent = '' } = await req.json();

    const FB_PIXEL_ID = Deno.env.get('FB_PIXEL_ID') ?? '';
    const FB_ACCESS_TOKEN = Deno.env.get('FB_ACCESS_TOKEN') ?? '';

    if (!FB_PIXEL_ID || !FB_ACCESS_TOKEN) throw new Error('FB_PIXEL_ID or FB_ACCESS_TOKEN not set');

    const user_data: Record<string, unknown> = {};
    if (email) user_data['em'] = [await sha256(email)];
    if (client_ip) user_data['client_ip_address'] = client_ip;
    if (client_user_agent) user_data['client_user_agent'] = client_user_agent;

    const payload = {
      data: [{
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: event_source_url || 'https://avada.archbysha.com',
        user_data,
        custom_data: { currency, value: Number(value) },
      }],
    };

    const res = await fetch(
      `https://graph.facebook.com/v19.0/${FB_PIXEL_ID}/events?access_token=${FB_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const result = await res.json();
    if (!res.ok) throw new Error(result.error?.message ?? 'FB CAPI error');

    console.log('[fb-purchase-event] Sent. Events received:', result.events_received);
    return new Response(JSON.stringify({ success: true, events_received: result.events_received }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[fb-purchase-event]', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
