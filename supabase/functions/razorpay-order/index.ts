import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID')
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
        const { amount, course_ids, user_phone } = await req.json()

        if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
            throw new Error('Razorpay keys not configured in Edge Function environment')
        }

        // 1. Create Order in Razorpay
        const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)
        const response = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: Math.round(amount * 100), // convert Rs to paise
                currency: 'INR',
                receipt: `receipt_${Date.now()}`,
            }),
        })

        const razorpayOrder = await response.json()

        if (!response.ok) {
            throw new Error(razorpayOrder.error?.description || 'Razorpay order creation failed')
        }

        // 2. Store in DB
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { error: dbError } = await supabase
            .from('orders')
            .insert({
                user_phone: user_phone || 'Anonymous',
                amount,
                course_ids,
                razorpay_order_id: razorpayOrder.id,
                status: 'pending',
            })

        if (dbError) throw dbError

        return new Response(JSON.stringify({ orderId: razorpayOrder.id }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        })
    } catch (error) {
        console.error('Error in razorpay-order:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        })
    }
})
