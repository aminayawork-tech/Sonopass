import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PdfReader } from 'pdfreader';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function extractPDFText(pdfPath) {
  return new Promise((resolve, reject) => {
    let text = '';
    let currentPage = 0;

    new PdfReader().parseFileItems(pdfPath, (err, item) => {
      if (err) {
        reject(err);
      } else if (!item) {
        // End of file
        resolve(text);
      } else if (item.page) {
        // New page
        currentPage = item.page;
        text += `\n--- Page ${currentPage} ---\n`;
      } else if (item.text) {
        // Text item
        text += item.text + ' ';
      }
    });
  });
}

async function main() {
  const resourcesDir = path.join(__dirname, '../SonoPassresources');
  const pdfFiles = fs.readdirSync(resourcesDir).filter(f => f.endsWith('.pdf'));

  console.log('Found PDF files:', pdfFiles);

  for (const pdfFile of pdfFiles) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`Processing: ${pdfFile}`);
    console.log('='.repeat(80));

    try {
      const pdfPath = path.join(resourcesDir, pdfFile);
      const text = await extractPDFText(pdfPath);

      // Save extracted text to a file for review
      const outputPath = path.join(__dirname, `${path.basename(pdfFile, '.pdf')}.txt`);
      fs.writeFileSync(outputPath, text);

      console.log(`✓ Extracted text saved to: ${outputPath}`);
      console.log(`  Text length: ${text.length} characters`);
      console.log(`  First 2000 characters:\n${text.substring(0, 2000)}`);
    } catch (error) {
      console.error(`✗ Error processing ${pdfFile}:`, error.message);
    }
  }
}

main().catch(console.error);
