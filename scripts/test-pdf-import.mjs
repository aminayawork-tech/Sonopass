import * as pdfParseModule from 'pdf-parse';

console.log('Module exports:', Object.keys(pdfParseModule));
console.log('Full module:', pdfParseModule);
console.log('Type of module:', typeof pdfParseModule);
console.log('Default:', pdfParseModule.default);
console.log('Parse function:', pdfParseModule.parse);
console.log('Type of pdfParseModule:', typeof pdfParseModule);

// Check if it's a function itself
if (typeof pdfParseModule === 'function') {
  console.log('Module is a function');
} else {
  console.log('Module properties:', Object.getOwnPropertyNames(pdfParseModule));
}
