# Sending SonoPass emails with Resend + Supabase

Supabase's built-in mailer is only for testing (a few emails per hour, shared sender, often spam).
Resend sends the account emails from your own domain instead.

Emails this covers: confirm email (new accounts), reset password, sign-in link, change email.
Sign in with Apple / Google sends no email.

## 1. Resend account and API key
1. Sign up at https://resend.com.
2. **Domains → Add domain** → `sonopass.com` → region **us-east-1**.
3. Resend shows DNS records (an MX + TXT for `send.sonopass.com`, a DKIM TXT `resend._domainkey`,
   and optionally a DMARC TXT `_dmarc`). Add each one where sonopass.com's DNS is managed
   (Vercel → your project → **Settings → Domains → sonopass.com → DNS records**, or your registrar).
   Copy names and values exactly. **Don't** delete existing records, and don't touch the root MX
   records that deliver support@sonopass.com.
4. Back in Resend, click **Verify**. It usually turns green within minutes (can take up to a few hours).
5. **API Keys → Create API key** → name `supabase-smtp`, permission **Sending access**, domain
   `sonopass.com`. Copy it (starts with `re_`); it's shown only once. Never put it in the code.

## 2. Point Supabase at Resend
**Quick way:** Resend dashboard → **Integrations → Supabase → Connect**, pick the SonoPass project
and the sender. It fills in step 2 for you.

**Manual way:** Supabase → **Authentication → Emails → SMTP Settings** → turn on
**Enable custom SMTP**:

| Field | Value |
|---|---|
| Sender email | `noreply@sonopass.com` |
| Sender name | `SonoPass` |
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | your Resend API key (`re_...`) |
| Minimum interval between emails | 60 seconds (default is fine) |

Save. Then **Authentication → Rate Limits** → raise **Rate limit for sending emails** (for example 100
per hour); the low default only applies to Supabase's own mailer.

## 3. Branded templates
Supabase → **Authentication → Emails → Templates**. For each one, set the subject and paste the
whole file from `supabase/email-templates/` into the body (Source / HTML), then **Save**:

| Template | Subject | File |
|---|---|---|
| Confirm signup | `Confirm your SonoPass email` | `confirm-signup.html` |
| Reset password | `Reset your SonoPass password` | `reset-password.html` |
| Magic link | `Your SonoPass sign-in link` | `magic-link.html` |
| Change email address | `Confirm your new SonoPass email` | `change-email.html` |

Keep `{{ .ConfirmationURL }}` and `{{ .NewEmail }}` exactly as written; Supabase fills them in.

## 4. Test
1. Website → **Admin sign-in** (email) → **Forgot password** with your own email.
2. The email should arrive from **SonoPass <noreply@sonopass.com>** with the green button.
3. Resend → **Emails** shows each message and whether it was delivered.

If nothing arrives: check Resend → Emails (bounced / not sent), that the domain is **Verified**, and
Supabase → **Logs → Auth** for SMTP errors (usually a wrong API key or port).

## Marketing or other custom emails later
Newsletters, Black Friday announcements, study reminders and similar are separate from Supabase's
account emails. Use Resend **Broadcasts** (with an Audience) or send from a server function. Only
email people who agreed to it, and always include an unsubscribe link (Resend Broadcasts add one).
