#!/usr/bin/env python3
import re
import json
import os

def clean_text(text):
    """Clean up excessive whitespace from extracted text"""
    # Replace multiple spaces with single space
    text = re.sub(r' +', ' ', text)
    # Remove page markers
    text = re.sub(r'--- Page \d+ ---', '', text)
    return text.strip()

def parse_exam_questions(text, exam_name):
    """Parse questions from extracted PDF text"""
    questions = []

    # Clean the text first
    text = clean_text(text)

    # Split into questions - look for pattern like "1." or "1."
    question_pattern = r'(\d+)\.\s+'
    parts = re.split(question_pattern, text)

    for i in range(1, len(parts), 2):
        if i + 1 < len(parts):
            question_num = parts[i]
            question_text = parts[i + 1]

            # Extract options (A./B./C./D. or a./b./c./d.)
            options_match = re.search(
                r'([A-Da-d]\..*?)(?=\s+\d+\.|$)',
                question_text,
                re.DOTALL
            )

            if options_match:
                options_text = options_match.group(1)
                question_only = question_text[:question_text.find(options_text)].strip()

                # Parse individual options
                option_pattern = r'([A-Da-d])\.\s+(.*?)(?=[A-Da-d]\.|$)'
                option_matches = re.findall(option_pattern, options_text, re.DOTALL)

                if len(option_matches) >= 2:  # At least 2 options
                    options = []
                    for opt_letter, opt_text in option_matches:
                        options.append({
                            'letter': opt_letter.upper(),
                            'text': opt_text.strip()
                        })

                    questions.append({
                        'id': f'{exam_name}_q{question_num}',
                        'number': int(question_num),
                        'question': question_only,
                        'options': options,
                        'correctAnswer': None,  # To be filled in later
                        'explanation': None  # To be filled in later
                    })

    return questions

def main():
    script_dir = os.path.dirname(__file__)

    # Parse Practice Exam 1
    exam1_path = os.path.join(script_dir, 'Practice Exam 1 Answer Key May042025 vascular.txt')
    with open(exam1_path, 'r', encoding='utf-8') as f:
        exam1_text = f.read()
    exam1_questions = parse_exam_questions(exam1_text, 'exam1')

    # Parse Practice Exam 2
    exam2_path = os.path.join(script_dir, 'Practice Exam 2 Answer Key May2025 vascular.txt')
    with open(exam2_path, 'r', encoding='utf-8') as f:
        exam2_text = f.read()
    exam2_questions = parse_exam_questions(exam2_text, 'exam2')

    # Save to JSON
    output_data = {
        'exam1': exam1_questions,
        'exam2': exam2_questions
    }

    output_path = os.path.join(script_dir, 'parsed_questions.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2)

    print(f"✓ Parsed {len(exam1_questions)} questions from Practice Exam 1")
    print(f"✓ Parsed {len(exam2_questions)} questions from Practice Exam 2")
    print(f"✓ Saved to: {output_path}")

    # Show sample questions
    if exam1_questions:
        print(f"\nSample question from Exam 1:")
        q = exam1_questions[0]
        print(f"  Q{q['number']}: {q['question'][:100]}...")
        for opt in q['options']:
            print(f"    {opt['letter']}. {opt['text'][:50]}...")

if __name__ == '__main__':
    main()
