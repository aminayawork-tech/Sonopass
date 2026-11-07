// Drops files the store apps never load, to keep the download small.
const fs = require('fs');
const path = require('path');

const out = path.join(__dirname, '..', 'out');
for (const p of ['mock-exams']) {            // source PDFs, not used by the app
  fs.rmSync(path.join(out, p), { recursive: true, force: true });
}
console.log('✓ Pruned unused files from the app bundle');
