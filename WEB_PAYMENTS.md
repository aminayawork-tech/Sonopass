# Selling Pro Lifetime on the website (Stripe)

The iPhone and Android apps sell Pro through Apple and Google. On **sonopass.com**, Pro Lifetime is
sold with Stripe:

1. The student signs in (or creates a free account) and taps **Unlock Lifetime Access**.
2. They're sent to Stripe's hosted checkout page, tagged with their account ID.
3. After paying, Stripe calls the `stripe-webhook` Supabase function, which sets their account to
   **Pro Lifetime** (`entitlements` table).
4. Stripe returns them to `sonopass.com/subscription?purchase=success`, which unlocks Pro within seconds.
   Pro also unlocks in the phone app when they sign in with the same account.
5. If you refund the payment in Stripe, Pro is removed automatically.

Pro Monthly is only sold in the apps; on the website the Monthly button points people to the app.

## One-time setup (about 20 minutes)

### 1. Stripe product and payment link
1. Create an account at https://dashboard.stripe.com and finish business verification (Sonobuddy LLC).
2. **Product catalog → Add product**: name `SonoPass Pro Lifetime`, **One-off** price **$49.99 USD**.
3. Open the product → **Create payment link**:
   - **After payment** → *Don't show confirmation page* → redirect to
     `https://sonopass.com/subscription?purchase=success`
   - Leave quantity fixed at 1.
4. Copy the link (looks like `https://buy.stripe.com/abc123…`).

### 2. Supabase function
1. Supabase → **Edge Functions → Deploy a new function → Via editor**. Name it **`stripe-webhook`**.
2. Paste the whole file `supabase/functions/stripe-webhook/index.ts` and click **Deploy**.
3. Open the function → **Details / Settings** → turn **OFF "Enforce JWT verification"** → Save.
   (Stripe can't send a Supabase login token; the function checks Stripe's signature instead.)
4. Copy the function URL: `https://YOUR-PROJECT.supabase.co/functions/v1/stripe-webhook`.

### 3. Stripe webhook
1. Stripe → **Developers → Webhooks → Add endpoint** (or *Add destination*):
   - URL: the function URL from step 2.4
   - Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded`
2. Open the endpoint → **Signing secret → Reveal** and copy it (`whsec_…`).

### 4. Secrets
Supabase → **Edge Functions → Secrets** (or Project Settings → Edge Functions) → add:
- `STRIPE_SECRET_KEY` = Stripe → Developers → API keys → **Secret key** (`sk_live_…`)
- `STRIPE_WEBHOOK_SECRET` = the `whsec_…` from step 3.2

### 5. Website
Vercel → your project → **Settings → Environment Variables** → add
`NEXT_PUBLIC_STRIPE_LIFETIME_LINK` = the payment link from step 1.4 → **Redeploy**.

## Test it first
Do steps 1–5 with Stripe in **Test mode** (toggle at the top of the Stripe dashboard): test payment
link, test secret key, test webhook secret. Pay with card `4242 4242 4242 4242`, any future date,
any CVC. After paying you should land on Subscription with **Pro Lifetime**, and the user's row in
Supabase → Table Editor → `entitlements` should show `lifetime / active / stripe`. Then repeat with the
live link, live secret key and live webhook secret.

**If Pro doesn't unlock:** Stripe → Webhooks → your endpoint → *Event deliveries* shows the response.
`400 Invalid signature` = wrong `STRIPE_WEBHOOK_SECRET`; `401` = JWT verification is still on.
