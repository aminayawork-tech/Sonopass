const fs = require('fs');
const path = require('path');

// Helper to generate hint based on question content
function generateHint(question) {
  const q = question.question.toLowerCase();
  const correctAnswer = question.correctAnswer;
  const options = question.options;
  const explanation = question.explanation || '';

  // Find the correct answer text
  const correctOption = options.find(o => o.letter === correctAnswer);
  const correctText = correctOption ? correctOption.text : '';

  // Pattern-based hint generation
  if (q.includes('which') && q.includes('artery')) {
    return `Focus on arterial anatomy and the specific vessel mentioned in the options.`;
  }
  if (q.includes('which') && q.includes('vein')) {
    return `Consider the venous anatomy and drainage patterns.`;
  }
  if (q.includes('what') && q.includes('normal')) {
    return `Think about normal physiologic values and patterns.`;
  }
  if (q.includes('doppler') || q.includes('waveform')) {
    return `Consider Doppler waveform characteristics and flow patterns.`;
  }
  if (q.includes('stenosis') || q.includes('occlusion')) {
    return `Think about how stenosis/occlusion affects flow hemodynamics.`;
  }
  if (q.includes('velocity') || q.includes('psv') || q.includes('edv')) {
    return `Focus on velocity measurements and their diagnostic significance.`;
  }
  if (q.includes('symptom') || q.includes('present')) {
    return `Consider the classic clinical presentation and symptoms.`;
  }
  if (q.includes('common') || q.includes('most likely')) {
    return `Think about the most common or typical findings.`;
  }
  if (q.includes('frequency')) {
    return `Remember: higher frequency = better resolution but less penetration.`;
  }
  if (q.includes('artifact')) {
    return `Identify the artifact type by its characteristic appearance.`;
  }
  if (q.includes('resolution')) {
    return `Consider what factors affect image resolution (frequency, focus, etc.).`;
  }
  if (q.includes('index') || q.includes('measurement')) {
    return `Focus on the calculation and clinical significance of this measurement.`;
  }

  // Generic hints based on category
  if (question.category && question.category.toLowerCase().includes('anatomy')) {
    return `Focus on anatomical relationships and vessel locations.`;
  }
  if (question.category && question.category.toLowerCase().includes('hemodynamics')) {
    return `Consider blood flow dynamics and resistance patterns.`;
  }
  if (question.category && question.category.toLowerCase().includes('pathology') ||
      question.category && question.category.toLowerCase().includes('disease')) {
    return `Think about the pathophysiology and characteristic findings.`;
  }
  if (question.category && question.category.toLowerCase().includes('physics')) {
    return `Apply fundamental ultrasound physics principles.`;
  }
  if (question.category && question.category.toLowerCase().includes('doppler')) {
    return `Analyze the Doppler characteristics and flow patterns.`;
  }

  // Default hint
  return `Carefully consider each option and the key concept being tested.`;
}

// Helper to extract keywords
function extractKeywords(question) {
  const q = question.question.toLowerCase();
  const keywords = [];

  // Common medical terms to highlight
  const importantTerms = [
    'stenosis', 'occlusion', 'aneurysm', 'thrombosis', 'reflux',
    'velocity', 'waveform', 'doppler', 'pulsatile', 'augmentation',
    'carotid', 'femoral', 'popliteal', 'renal', 'hepatic',
    'proximal', 'distal', 'ischemia', 'insufficiency',
    'frequency', 'resolution', 'artifact', 'aliasing',
    'systolic', 'diastolic', 'biphasic', 'triphasic', 'monophasic'
  ];

  importantTerms.forEach(term => {
    if (q.includes(term)) {
      // Find the term in the original question (case-sensitive)
      const regex = new RegExp(`\\b${term}\\b`, 'i');
      const match = question.question.match(regex);
      if (match) {
        keywords.push(match[0]);
      }
    }
  });

  return keywords.slice(0, 3); // Limit to 3 keywords
}

// Process vascular questions
function processVascularQuestions() {
  const filePath = path.join(__dirname, '../src/data/vascular/questions.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  let hintsAdded = 0;

  ['exam1', 'exam2'].forEach(examKey => {
    if (data[examKey]) {
      data[examKey].forEach(question => {
        if (!question.hint) {
          question.hint = generateHint(question);
          question.keywords = extractKeywords(question);
          hintsAdded++;
        }
      });
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✓ Added ${hintsAdded} hints to vascular questions`);
  return hintsAdded;
}

// Process SPI questions
function processSPIQuestions() {
  const filePath = path.join(__dirname, '../src/data/spi/questions.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  let hintsAdded = 0;

  ['exam1', 'exam2'].forEach(examKey => {
    if (data[examKey]) {
      data[examKey].forEach(question => {
        if (!question.hint) {
          question.hint = generateHint(question);
          question.keywords = extractKeywords(question);
          hintsAdded++;
        }
      });
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✓ Added ${hintsAdded} hints to SPI questions`);
  return hintsAdded;
}

// Run the script
console.log('Generating hints for all questions...\n');
const vascularHints = processVascularQuestions();
const spiHints = processSPIQuestions();
console.log(`\n✅ Total hints added: ${vascularHints + spiHints}`);
