const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/vascular-questions.json', 'utf8'));

// Check first 5 questions from exam1
console.log('Sample questions from Exam 1:\n');
data.exam1.slice(0, 5).forEach(q => {
  console.log('Q' + q.number + ':', q.question.substring(0, 60) + '...');
  console.log('  Correct Answer:', q.correctAnswer || 'NOT SET');
  console.log('  Explanation:', q.explanation ? q.explanation.substring(0, 50) + '...' : 'NOT SET');
  console.log('');
});

// Count how many have answers/explanations
const exam1WithAnswers = data.exam1.filter(q => q.correctAnswer != null).length;
const exam1WithExplanations = data.exam1.filter(q => q.explanation != null).length;
const exam2WithAnswers = data.exam2.filter(q => q.correctAnswer != null).length;
const exam2WithExplanations = data.exam2.filter(q => q.explanation != null).length;

console.log('\n=== Status ===');
console.log('Exam 1: ' + exam1WithAnswers + '/' + data.exam1.length + ' have correct answers');
console.log('Exam 1: ' + exam1WithExplanations + '/' + data.exam1.length + ' have explanations');
console.log('Exam 2: ' + exam2WithAnswers + '/' + data.exam2.length + ' have correct answers');
console.log('Exam 2: ' + exam2WithExplanations + '/' + data.exam2.length + ' have explanations');
