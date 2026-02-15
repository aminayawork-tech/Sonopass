#!/usr/bin/env python3
import os
import PyPDF2

def extract_pdf_text(pdf_path):
    """Extract text from a PDF file"""
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            num_pages = len(pdf_reader.pages)
            print(f"  Total pages: {num_pages}")

            for page_num in range(num_pages):
                page = pdf_reader.pages[page_num]
                text += f"\n--- Page {page_num + 1} ---\n"
                text += page.extract_text()

                if (page_num + 1) % 10 == 0:
                    print(f"  Processed {page_num + 1}/{num_pages} pages...")

    except Exception as e:
        print(f"  Error: {e}")
        return None

    return text

def main():
    resources_dir = os.path.join(os.path.dirname(__file__), '../SonoPassresources')
    pdf_files = [f for f in os.listdir(resources_dir) if f.endswith('.pdf')]

    print(f"Found {len(pdf_files)} PDF files:\n")

    for pdf_file in pdf_files:
        print(f"{'='*80}")
        print(f"Processing: {pdf_file}")
        print('='*80)

        pdf_path = os.path.join(resources_dir, pdf_file)
        text = extract_pdf_text(pdf_path)

        if text:
            output_file = os.path.join(
                os.path.dirname(__file__),
                f"{os.path.splitext(pdf_file)[0]}.txt"
            )

            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(text)

            print(f"✓ Extracted text saved to: {output_file}")
            print(f"  Text length: {len(text)} characters")
            print(f"  First 1000 characters:\n{text[:1000]}\n")
        else:
            print(f"✗ Failed to extract text from {pdf_file}\n")

if __name__ == '__main__':
    main()
