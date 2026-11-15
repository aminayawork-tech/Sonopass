#!/usr/bin/env node
// Builds the "Secret Key (for OAuth)" that Supabase needs for Sign in with Apple.
// Runs only on your computer; the .p8 key never leaves it. The secret is valid for 6 months.
//
// Usage:
//   node scripts/apple-client-secret.js <TEAM_ID> <KEY_ID> <SERVICES_ID> <path/to/AuthKey_XXXX.p8>
// Example:
//   node scripts/apple-client-secret.js S35A8256Z4 ABC123DEFG com.sonopass.web ~/Downloads/AuthKey_ABC123DEFG.p8

const fs = require('fs');
const crypto = require('crypto');

const [teamId, keyId, clientId, p8Path] = process.argv.slice(2);
if (!teamId || !keyId || !clientId || !p8Path) {
  console.error('Usage: node scripts/apple-client-secret.js <TEAM_ID> <KEY_ID> <SERVICES_ID> <path/to/AuthKey_XXXX.p8>');
  process.exit(1);
}

const key = crypto.createPrivateKey(fs.readFileSync(p8Path));
const now = Math.floor(Date.now() / 1000);
const SIX_MONTHS = 15777000; // Apple's maximum
const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');

const header = b64({ alg: 'ES256', kid: keyId });
const payload = b64({ iss: teamId, iat: now, exp: now + SIX_MONTHS, aud: 'https://appleid.apple.com', sub: clientId });
const signature = crypto
  .sign('sha256', Buffer.from(`${header}.${payload}`), { key, dsaEncoding: 'ieee-p1363' })
  .toString('base64url');

console.log(`${header}.${payload}.${signature}`);
console.error(`\nValid until ${new Date((now + SIX_MONTHS) * 1000).toDateString()}. Make a new one before then.`);
