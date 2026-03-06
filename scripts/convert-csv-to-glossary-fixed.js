const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, '../SonoPassresources/vascular-definitions.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV more robustly
const lines = csvContent.trim().split('\n').slice(1); // Skip header
const terms = [];

// Category keywords for auto-categorization
const categoryKeywords = {
  anatomy: ['artery', 'vein', 'vessel', 'bone', 'muscle', 'arch', 'aorta', 'carotid', 'femoral', 'tibial', 'jugular', 'cephalic', 'basilic', 'popliteal', 'renal', 'hepatic', 'portal', 'celiac', 'mesenteric', 'subclavian', 'axillary', 'brachial', 'iliac', 'saphenous', 'ivc', 'svc'],
  doppler: ['doppler', 'waveform', 'velocity', 'pulsatile', 'phasic', 'augmentation', 'spectral', 'triphasic', 'monophasic', 'biphasic', 'flow', 'acceleration', 'resistive', 'tardus parvus', 'aliasing', 'bruit'],
  pathology: ['disease', 'syndrome', 'thrombosis', 'stenosis', 'occlusion', 'ischemia', 'insufficiency', 'aneurysm', 'atherosclerosis', 'embol', 'carcinoma', 'gangrene', 'claudication', 'dvt', 'ulcer', 'necrosis', 'obstruction', 'blockage', 'neuropathy', 'cyanosis', 'pallor'],
  technique: ['duplex', 'exam', 'test', 'ultrasound', 'compression', 'maneuver', 'imaging', 'endarterectomy', 'graft', 'bypass', 'ppg', 'photoplethysmography', 'tcd', 'transcranial', 'approach', 'orientation', 'compressibility'],
  measurement: ['index', 'time', 'ratio', 'abi', 'refill', 'sample volume'],
};

function categorize(term, definition) {
  const combined = (term + ' ' + definition).toLowerCase();

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (combined.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }

  return 'terminology'; // Default category
}

function parseCSVLine(line) {
  // Handle lines with quoted fields containing commas
  let inQuotes = false;
  let currentField = '';
  const fields = [];

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(currentField.trim());
      currentField = '';
    } else {
      currentField += char;
    }
  }

  // Add last field
  if (currentField) {
    fields.push(currentField.trim());
  }

  return fields;
}

lines.forEach(line => {
  if (!line.trim()) return;

  const fields = parseCSVLine(line);
  if (fields.length >= 2) {
    const term = fields[0].trim();
    const definition = fields[1].trim();

    if (term && definition) {
      terms.push({
        term,
        definition,
        category: categorize(term, definition)
      });
    }
  }
});

// Sort alphabetically
terms.sort((a, b) => a.term.localeCompare(b.term));

// Write to glossary file
const outputPath = path.join(__dirname, '../public/glossary/vascular/terms.json');
fs.writeFileSync(outputPath, JSON.stringify(terms, null, 2));

console.log(`✓ Converted ${terms.length} terms to glossary format`);
console.log(`✓ Output: ${outputPath}`);

// Show category breakdown
const breakdown = {};
terms.forEach(t => {
  breakdown[t.category] = (breakdown[t.category] || 0) + 1;
});
console.log('\nCategory Breakdown:');
Object.entries(breakdown).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count}`);
});
