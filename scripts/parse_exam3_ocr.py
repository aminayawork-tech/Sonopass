#!/usr/bin/env python3
"""
Improved parser for Mock Exam 3 OCR text files.
Parses the extracted OCR text into structured question data.
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Optional

def parse_ocr_file(file_path: Path) -> List[Dict]:
    """Parse a single OCR text file and extract all questions in it"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix common OCR errors
    content = content.replace('¢:', 'C:')  # cent symbol misread as C
    content = content.replace('©:', 'C:')  # copyright symbol misread as C
    content = content.replace('€:', 'C:')  # euro symbol misread as C
    content = content.replace('€', 'C:')   # euro without colon
    content = content.replace('©', 'C:')   # copyright without colon
    content = content.replace('¢', 'C:')   # cent without colon
    # Fix semicolons that should be colons in options
    content = re.sub(r'\n([A-D]);', r'\n\1:', content)  # A; -> A:
    content = re.sub(r'^([A-D]);', r'\1:', content, flags=re.MULTILINE)  # A; at start of line

    questions = []

    # Split by question numbers (e.g., "25.", "91.", "133.")
    # Look for pattern: number followed by period at start of line or after newline
    question_pattern = r'(?:^|\n)(\d{1,3})\.\s+(.*?)(?=(?:\n\d{1,3}\.\s+)|$)'
    question_matches = re.finditer(question_pattern, content, re.DOTALL)

    for match in question_matches:
        question_num = int(match.group(1))
        question_block = match.group(2)

        parsed = parse_question_block(question_num, question_block, file_path.name)
        if parsed:
            questions.append(parsed)

    return questions

def parse_question_block(question_num: int, block: str, image_file: str) -> Optional[Dict]:
    """Parse a single question block"""

    # Extract question text (everything before the first option)
    question_match = re.search(r'^(.*?)(?=\n[\'"]?[A-D]:\s)', block, re.DOTALL)
    if not question_match:
        return None

    question_text = question_match.group(1).strip()
    # Remove "Points: X/Y" from question text if present (can be at end or inline)
    question_text = re.sub(r'\s*Points:\s*\d+/\d+', '', question_text)
    question_text = re.sub(r'\n+', ' ', question_text)  # Replace newlines with spaces
    question_text = re.sub(r'\s+', ' ', question_text)  # Normalize whitespace
    question_text = question_text.strip()

    # Extract options (A:, B:, C:, D:)
    # Find the entire options block - from first option to "You answered"
    options_match = re.search(r'[\'"\s]*A:\s*(.+?)You answered', block, re.DOTALL)

    options = []
    if options_match:
        options_block = options_match.group(0)

        # Find each individual option using a simpler approach
        # Match pattern: optional quote/space + letter + colon + text until next option or end
        for letter in ['A', 'B', 'C', 'D']:
            # Pattern: the letter (with optional leading chars) followed by colon and text
            # Text continues until we hit the next letter's pattern or "You answered"
            # Allow for text to be on same line or next line (handling OCR spacing issues)
            if letter == 'D':
                # Last option - goes until "You answered"
                pattern = rf'[\'"\s]*{letter}:\s*\n?\s*(.+?)(?=\s*You answered)'
            else:
                # Other options - go until next letter
                next_letter = chr(ord(letter) + 1)
                pattern = rf'[\'"\s]*{letter}:\s*\n?\s*(.+?)(?=\s*\n+\s*[\'"\s;]*{next_letter}[:;])'

            opt_match = re.search(pattern, options_block, re.DOTALL | re.MULTILINE)
            if opt_match:
                option_text = opt_match.group(1).strip()
                # Clean up option text
                option_text = re.sub(r'\n+', ' ', option_text)  # Replace newlines with space
                option_text = re.sub(r'\s+', ' ', option_text)  # Normalize whitespace
                option_text = option_text.strip()
                # Remove leading semicolons if any slipped through
                option_text = re.sub(r'^;\s*', '', option_text)
                options.append({"letter": letter, "text": option_text})

    # Extract user's answer
    user_answer_match = re.search(r'You answered:\s*([A-D])', block)

    # Extract correct answer
    correct_answer_match = re.search(r'Correct answer is:\s*([A-D])', block)
    if correct_answer_match:
        correct_answer = correct_answer_match.group(1)
    elif user_answer_match:
        # If no "Correct answer is" line, the user's answer was correct
        correct_answer = user_answer_match.group(1)
    else:
        correct_answer = ""

    # Extract explanation/feedback
    explanation_match = re.search(r'Feedback:\s*\n(.*?)(?=\n\d{1,3}\.\s+|\nPoints:|$)', block, re.DOTALL)
    if explanation_match:
        explanation = explanation_match.group(1).strip()
        # Clean up explanation - remove extra whitespace and newlines
        explanation = re.sub(r'\n+', ' ', explanation)
        explanation = re.sub(r'\s+', ' ', explanation)
        # Remove trailing "Points: X/Y" if present
        explanation = re.sub(r'\s*Points:\s*\d+/\d+\s*$', '', explanation)
    else:
        explanation = ""

    return {
        "id": f"exam3_q{question_num}",
        "number": question_num,
        "question": question_text,
        "options": options,
        "category": "Vascular",
        "correctAnswer": correct_answer,
        "explanation": explanation,
        "imageFile": f"mock-exam-3_{image_file.split('_')[-1].replace('.txt', '.png')}" if 'mock-exam-3_' in image_file else image_file
    }

def main():
    ocr_dir = Path("scripts")
    ocr_files = sorted(ocr_dir.glob("ocr_raw_mock-exam-3_*.txt"))

    print(f"Found {len(ocr_files)} OCR text files to parse")

    all_questions = []
    questions_by_number = {}

    for ocr_file in ocr_files:
        questions = parse_ocr_file(ocr_file)
        for q in questions:
            q_num = q["number"]
            # Avoid duplicates - keep first occurrence
            if q_num not in questions_by_number:
                questions_by_number[q_num] = q
                all_questions.append(q)

    # Sort by question number
    all_questions.sort(key=lambda x: x["number"])

    print(f"\nParsed {len(all_questions)} unique questions")
    print(f"Question range: {all_questions[0]['number']} to {all_questions[-1]['number']}")

    # Save to file
    output_file = Path("scripts/exam3_questions_parsed.json")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_questions, f, indent=2, ensure_ascii=False)

    print(f"\nSaved to: {output_file}")

    # Print some statistics
    questions_with_answers = sum(1 for q in all_questions if q['correctAnswer'])
    questions_with_explanations = sum(1 for q in all_questions if q['explanation'])
    questions_with_all_options = sum(1 for q in all_questions if len(q['options']) == 4)

    print(f"\nStatistics:")
    print(f"  Questions with correct answer: {questions_with_answers}/{len(all_questions)}")
    print(f"  Questions with explanations: {questions_with_explanations}/{len(all_questions)}")
    print(f"  Questions with all 4 options: {questions_with_all_options}/{len(all_questions)}")

    # Show first question as sample
    if all_questions:
        print(f"\nSample (Q{all_questions[0]['number']}):")
        print(f"  Question: {all_questions[0]['question'][:80]}...")
        print(f"  Options: {len(all_questions[0]['options'])}")
        print(f"  Answer: {all_questions[0]['correctAnswer']}")

if __name__ == "__main__":
    main()
