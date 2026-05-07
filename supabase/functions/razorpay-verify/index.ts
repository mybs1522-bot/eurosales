import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
            }
        })
    }

    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

        if (!RAZORPAY_KEY_SECRET) {
            throw new Error('RAZORPAY_KEY_SECRET not configured in Edge Function')
        }

        // 1. Verify Signature
        const body = `${razorpay_order_id}|${razorpay_payment_id}`
        const expectedSignature = await hmacSha256(body, RAZORPAY_KEY_SECRET)

        if (expectedSignature !== razorpay_signature) {
            throw new Error('Invalid signature verification failed')
        }

        // 2. Update DB
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { error: dbError } = await supabase
            .from('orders')
            .update({
                razorpay_payment_id,
                razorpay_signature,
                status: 'success',
                updated_at: new Date().toISOString(),
            })
            .eq('razorpay_order_id', razorpay_order_id)

        if (dbError) throw dbError

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        })
    } catch (error) {
        console.error('Error in razorpay-verify:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        })
    }
})

// Helper for HMAC-SHA256
async function hmacSha256(message: string, secret: string) {
    const enc = new TextEncoder()
    const key = await crypto.subtle.importKey(
        'raw',
        enc.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    )
    const signature = await crypto.subtle.sign('HMAC', key, enc.encode(message))
    return Array.from(new Uint8Array(signature))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
}
