const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, '../SonoPassresources/vascular-definitions.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV
const lines = csvContent.split('\n').slice(1); // Skip header
const terms = [];

// Category keywords for auto-categorization
const categoryKeywords = {
  anatomy: ['artery', 'vein', 'vessel', 'bone', 'muscle', 'arch', 'anatomy', 'aorta', 'carotid', 'femoral', 'tibial', 'jugular', 'cephalic', 'basilic', 'popliteal', 'renal', 'hepatic', 'portal', 'celiac', 'mesenteric', 'subclavian', 'axillary', 'brachial', 'iliac', 'saphenous'],
  doppler: ['doppler', 'waveform', 'velocity', 'pulsatile', 'phasic', 'augmentation', 'spectral', 'triphasic', 'monophasic', 'biphasic', 'flow', 'acceleration', 'resistive index', 'tardus parvus', 'aliasing'],
  pathology: ['disease', 'syndrome', 'thrombosis', 'stenosis', 'occlusion', 'ischemia', 'insufficiency', 'aneurysm', 'atherosclerosis', 'embol', 'carcinoma', 'gangrene', 'claudication', 'dvt', 'ulcer', 'necrosis', 'obstruction', 'blockage'],
  technique: ['duplex', 'exam', 'test', 'ultrasound', 'compression', 'maneuver', 'imaging', 'endarterectomy', 'graft', 'bypass', 'ppg', 'photoplethysmography', 'tcd', 'transcranial', 'approach', 'orientation'],
  measurement: ['index', 'time', 'ratio', 'abi', 'refill', 'acceleration', 'sample volume'],
  terminology: ['sign', 'symptom', 'orientation', 'plane', 'definition']
};

function categorize(term, definition) {
  const combined = (term + ' ' + definition).toLowerCase();

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (combined.includes(keyword)) {
        return category;
      }
    }
  }

  return 'terminology'; // Default category
}

lines.forEach(line => {
  if (!line.trim()) return;

  // Parse CSV line (handle quoted fields)
  const match = line.match(/^"?([^"]*?)"?,"(.*)"/);
  if (match) {
    const term = match[1].trim();
    const definition = match[2].trim();

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
