#!/usr/bin/env python3
"""
OCR-based batch extraction script for Mock Exam 3.
Processes all 134 images using OCR and extracts questions, answers, and explanations.
"""

import json
import re
from pathlib import Path
from PIL import Image
import pytesseract
from typing import Dict, List, Optional

def extract_text_from_image(image_path: Path) -> str:
    """Extract text from an image using OCR"""
    try:
        image = Image.open(image_path)
        # Use pytesseract to extract text
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return ""

def parse_question_from_text(text: str, image_name: str) -> Optional[Dict]:
    """Parse question data from extracted OCR text"""
    if not text.strip():
        return None

    # Try to find question number (e.g., "Q154", "154.", "Question 154")
    question_num_match = re.search(r'Q?(\d{1,3})\.?\s', text, re.IGNORECASE)
    if not question_num_match:
        # Try to extract from filename
        filename_match = re.search(r'mock-exam-3_(\d+)', image_name)
        if filename_match:
            # This is a placeholder - we'll need to derive question numbers differently
            pass

    # Extract question text (text before options A, B, C, D)
    question_match = re.search(r'(?:Q\d+\.?\s*)?(.*?)(?=\s*[Aa][\.\)]\s*)', text, re.DOTALL)
    question_text = question_match.group(1).strip() if question_match else ""

    # Extract options A, B, C, D
    options = []
    option_pattern = r'([A-D])[\.\)]\s*(.+?)(?=\s*[A-D][\.\)]|\s*(?:Correct|Answer|Explanation|$))'
    option_matches = re.finditer(option_pattern, text, re.DOTALL | re.IGNORECASE)

    for match in option_matches:
        letter = match.group(1).upper()
        option_text = match.group(2).strip()
        options.append({"letter": letter, "text": option_text})

    # Extract correct answer
    answer_match = re.search(r'(?:Correct Answer|Answer)[\s:]*([A-D])', text, re.IGNORECASE)
    correct_answer = answer_match.group(1).upper() if answer_match else ""

    # Extract explanation
    explanation_match = re.search(r'(?:Explanation|Rationale)[\s:]*(.+?)$', text, re.DOTALL | re.IGNORECASE)
    explanation = explanation_match.group(1).strip() if explanation_match else ""

    # If we couldn't extract enough information, return None
    if not question_text or len(options) < 4:
        return None

    return {
        "question": question_text,
        "options": options,
        "correctAnswer": correct_answer,
        "explanation": explanation,
        "imageFile": image_name
    }

def create_question_entry(question_num: int, question_data: Dict) -> Dict:
    """Create a formatted question entry"""
    return {
        "id": f"exam3_q{question_num}",
        "number": question_num,
        "question": question_data.get("question", ""),
        "options": question_data.get("options", []),
        "category": "Vascular",
        "correctAnswer": question_data.get("correctAnswer", ""),
        "explanation": question_data.get("explanation", ""),
        "imageFile": question_data.get("imageFile", "")
    }

def main():
    # Path to images
    images_dir = Path("public/images/mock-exam-3")

    if not images_dir.exists():
        print(f"Error: Directory not found: {images_dir}")
        return

    # Get all PNG images
    image_files = sorted(images_dir.glob("*.png"))
    print(f"Found {len(image_files)} images to process")

    # Store all extracted text first
    extracted_data = []

    print("\n=== Phase 1: Extracting text from all images using OCR ===\n")
    for idx, image_path in enumerate(image_files, 1):
        print(f"Processing {idx}/{len(image_files)}: {image_path.name}")
        text = extract_text_from_image(image_path)

        if text:
            extracted_data.append({
                "filename": image_path.name,
                "text": text
            })
            # Save raw OCR output for debugging
            with open(f"scripts/ocr_raw_{image_path.stem}.txt", "w", encoding="utf-8") as f:
                f.write(text)

    print(f"\n=== Phase 2: Parsing questions from OCR text ===\n")
    questions = []
    parsed_count = 0

    for data in extracted_data:
        question_data = parse_question_from_text(data["text"], data["filename"])
        if question_data:
            # We need to determine question numbers - for now, we'll collect all data
            questions.append(question_data)
            parsed_count += 1

    print(f"\nSuccessfully parsed {parsed_count} questions from {len(extracted_data)} images")

    # Save raw parsed data
    output_file = Path("scripts/exam3_ocr_raw_parsed.json")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)

    print(f"\nRaw parsed data saved to: {output_file}")
    print("\n" + "="*60)
    print("NEXT STEPS:")
    print("1. Review the raw parsed data and OCR text files")
    print("2. Identify question numbering pattern")
    print("3. Clean and structure the final JSON output")
    print("="*60)

if __name__ == "__main__":
    main()
