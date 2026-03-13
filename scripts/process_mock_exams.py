#!/usr/bin/env python3
"""
Extract mock exam questions, answers, and explanations from screenshot images.

This script processes PNG images of mock exam questions and extracts:
- Question text
- Answer options
- Correct answer
- Explanation

The extracted data is saved in JSON format for use in the exam study app.
"""

import os
import json
from pathlib import Path
from typing import List, Dict
import base64

# You'll need to install: pip install anthropic pillow
# from anthropic import Anthropic
# from PIL import Image

MOCK_EXAMS_DIR = Path(__file__).parent.parent / "public" / "images" / "mock-exams"
OUTPUT_FILE = Path(__file__).parent.parent / "src" / "data" / "mock-exam-questions.json"


def get_image_files() -> List[Path]:
    """Get all PNG files from the mock exams directory."""
    image_files = list(MOCK_EXAMS_DIR.glob("*.png"))
    image_files.extend(MOCK_EXAMS_DIR.glob("*.jpg"))
    image_files.extend(MOCK_EXAMS_DIR.glob("*.jpeg"))
    return sorted(image_files)


def encode_image(image_path: Path) -> str:
    """Encode image to base64."""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def extract_question_from_image(image_path: Path) -> Dict:
    """
    Extract question, answers, and explanation from a screenshot image.

    Uses Claude's vision capabilities to read and parse the image.
    """
    print(f"Processing: {image_path.name}")

    # TODO: Implement using Anthropic API with vision
    # For now, return a placeholder structure

    return {
        "id": image_path.stem,
        "image_file": image_path.name,
        "question": "TODO: Extract from image",
        "options": [],
        "correct_answer": "",
        "explanation": "TODO: Extract from image",
        "category": "mock-exam",
        "difficulty": "medium"
    }


def main():
    """Main extraction process."""
    print("Starting mock exam extraction...")

    # Get all image files
    image_files = get_image_files()
    print(f"Found {len(image_files)} images to process")

    if len(image_files) == 0:
        print("No images found. Please upload PNG screenshots to:")
        print(f"  {MOCK_EXAMS_DIR}")
        return

    # Extract data from each image
    extracted_questions = []
    for image_file in image_files:
        question_data = extract_question_from_image(image_file)
        extracted_questions.append(question_data)

    # Save to JSON
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(extracted_questions, f, indent=2, ensure_ascii=False)

    print(f"\n✓ Extraction complete!")
    print(f"✓ Processed {len(extracted_questions)} questions")
    print(f"✓ Saved to: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
