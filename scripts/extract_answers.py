#!/usr/bin/env python3
import PyPDF2
import json
import re

def extract_with_formatting(pdf_path):
    """Try to extract text with formatting information"""
    questions_answers = {}

    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)

        # Check if there's an answer key page at the end
        total_pages = len(pdf_reader.pages)
        print(f"Total pages: {total_pages}")

        # Try to find answer patterns in the last few pages
        for page_num in range(total_pages - 5, total_pages):
            if page_num < 0:
                continue

            page = pdf_reader.pages[page_num]
            text = page.extract_text()

            # Look for answer key patterns like "1. A", "2. B", etc.
            # or "Answer: A", "Correct: B", etc.
            answer_patterns = [
                r'(\d+)\.\s*([A-D])\s*(?:\n|$)',  # "1. A"
                r'(\d+)\)\s*([A-D])\s*(?:\n|$)',  # "1) A"
                r'(\d+)\s+([A-D])\s*(?:\n|$)',    # "1 A"
                r'Answer[:\s]+(\d+)\s*[:\s]+([A-D])',  # "Answer: 1: A"
                r'Q(\d+)\s*[:\s]+([A-D])',        # "Q1: A"
            ]

            print(f"\n--- Checking Page {page_num + 1} for answer key ---")
            print(text[:500])

            for pattern in answer_patterns:
                matches = re.findall(pattern, text, re.MULTILINE)
                if matches and len(matches) > 10:  # Likely an answer key if we find many matches
                    print(f"\nFound answer pattern! ({len(matches)} answers)")
                    for q_num, answer in matches:
                        questions_answers[int(q_num)] = answer.upper()
                    break

            if questions_answers:
                break

    return questions_answers

def main():
    import os

    resources_dir = os.path.join(os.path.dirname(__file__), '../SonoPassresources')

    exams = [
        ('Practice Exam 1 Answer Key May042025 vascular.pdf', 'exam1'),
        ('Practice Exam 2 Answer Key May2025 vascular.pdf', 'exam2'),
    ]

    all_answers = {}

    for pdf_file, exam_id in exams:
        print(f"\n{'='*80}")
        print(f"Processing: {pdf_file}")
        print('='*80)

        pdf_path = os.path.join(resources_dir, pdf_file)
        answers = extract_with_formatting(pdf_path)

        if answers:
            print(f"✓ Found {len(answers)} answers for {exam_id}")
            all_answers[exam_id] = answers
        else:
            print(f"✗ No answer key found for {exam_id}")

    # Save to JSON
    if all_answers:
        output_path = os.path.join(os.path.dirname(__file__), 'extracted_answers.json')
        with open(output_path, 'w') as f:
            json.dump(all_answers, f, indent=2)
        print(f"\n✓ Saved answers to: {output_path}")
    else:
        print("\n✗ No answers found in any PDF")

if __name__ == '__main__':
    main()
