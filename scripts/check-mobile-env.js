// Stops a store build that would ship without accounts switched on.
const fs = require('fs');
const path = require('path');

for (const file of ['.env.production.local', '.env.local', '.env.production', '.env']) {
  const p = path.join(__dirname, '..', file);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}

const missing = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'].filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`\n✖ Missing ${missing.join(' and ')}.\n  Create a file named .env.local in the project folder with:\n\n  NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co\n  NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY\n\n  (the same two values you added in Vercel), then run the build again.\n`);
  process.exit(1);
}
console.log('✓ Supabase settings found');
