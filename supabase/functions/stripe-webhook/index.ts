// Supabase Edge Function: receives Stripe webhooks for website purchases.
// - checkout.session.completed (paid): unlocks Pro Lifetime for the account in client_reference_id
// - charge.refunded (fully refunded): removes it again
//
// Secrets (Supabase → Edge Functions → Secrets): STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET.
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically.
// Turn OFF "Enforce JWT verification" for this function (Stripe can't send a Supabase token);
// requests are authenticated by Stripe's signature instead.
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.4';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '');
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';
const admin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', {
  auth: { persistSession: false },
});

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function setPlan(userId: string, plan: 'lifetime' | 'free', status: 'active' | 'refunded') {
  const { error } = await admin.from('entitlements').upsert(
    { user_id: userId, plan, status, expires_at: null, source: 'stripe', updated_at: new Date().toISOString() },
    { onConflict: 'user_id' },
  );
  if (error) throw new Error(error.message);
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const signature = req.headers.get('stripe-signature');
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature ?? '', webhookSecret);
  } catch (err) {
    return new Response(`Invalid signature: ${(err as Error).message}`, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id ?? '';
      if (session.mode === 'payment' && session.payment_status === 'paid' && UUID.test(userId)) {
        await setPlan(userId, 'lifetime', 'active');
        console.log(`Pro Lifetime unlocked for ${userId}`);
      } else {
        console.log(`Ignored session ${session.id} (mode ${session.mode}, status ${session.payment_status}, ref ${userId || 'none'})`);
      }
    }

    if (event.type === 'charge.refunded') {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntent = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id;
      if (charge.refunded && paymentIntent) {
        const sessions = await stripe.checkout.sessions.list({ payment_intent: paymentIntent, limit: 1 });
        const userId = sessions.data[0]?.client_reference_id ?? '';
        if (UUID.test(userId)) {
          await setPlan(userId, 'free', 'refunded');
          console.log(`Pro removed after refund for ${userId}`);
        }
      }
    }
  } catch (err) {
    // Non-2xx makes Stripe retry later
    return new Response(`Error: ${(err as Error).message}`, { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), { headers: { 'Content-Type': 'application/json' } });
});
