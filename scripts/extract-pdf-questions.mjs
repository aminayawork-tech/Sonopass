import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFParse } from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function extractPDFText(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const parser = new PDFParse({});
  const data = await parser.parse(dataBuffer);
  return data.text;
}

async function main() {
  const resourcesDir = path.join(__dirname, '../SonoPassresources');
  const pdfFiles = fs.readdirSync(resourcesDir).filter(f => f.endsWith('.pdf'));

  console.log('Found PDF files:', pdfFiles);

  for (const pdfFile of pdfFiles) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`Processing: ${pdfFile}`);
    console.log('='.repeat(80));

    const pdfPath = path.join(resourcesDir, pdfFile);
    const text = await extractPDFText(pdfPath);

    // Save extracted text to a file for review
    const outputPath = path.join(__dirname, `${path.basename(pdfFile, '.pdf')}.txt`);
    fs.writeFileSync(outputPath, text);

    console.log(`Extracted text saved to: ${outputPath}`);
    console.log(`Text length: ${text.length} characters`);
    console.log(`First 1000 characters:\n${text.substring(0, 1000)}`);
  }
}

main().catch(console.error);
