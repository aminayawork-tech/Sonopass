#!/usr/bin/env python3
"""
Add exam3 questions to the parsed_questions.json file
"""

import json
from pathlib import Path

def main():
    # Load the final exam3 questions
    exam3_file = Path("scripts/exam3_final.json")
    with open(exam3_file, 'r', encoding='utf-8') as f:
        exam3_questions = json.load(f)

    # Load the existing parsed_questions.json
    parsed_file = Path("scripts/parsed_questions.json")
    with open(parsed_file, 'r', encoding='utf-8') as f:
        parsed_data = json.load(f)

    # Add exam3 to the data
    parsed_data["exam3"] = exam3_questions

    # Save back
    with open(parsed_file, 'w', encoding='utf-8') as f:
        json.dump(parsed_data, f, indent=2, ensure_ascii=False)

    print(f"Added {len(exam3_questions)} exam3 questions to parsed_questions.json")
    print(f"\nTotal questions:")
    print(f"  Exam 1: {len(parsed_data.get('exam1', []))}")
    print(f"  Exam 2: {len(parsed_data.get('exam2', []))}")
    print(f"  Exam 3: {len(parsed_data.get('exam3', []))}")

if __name__ == "__main__":
    main()
