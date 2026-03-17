#!/usr/bin/env python3
"""
Update vascular/questions.json with the new exam3 data from parsed_questions.json
"""

import json
from pathlib import Path

def main():
    # Load the parsed questions (which has the new exam3 data)
    parsed_file = Path("scripts/parsed_questions.json")
    with open(parsed_file, 'r', encoding='utf-8') as f:
        parsed_data = json.load(f)

    # Load the vascular questions file
    vascular_file = Path("src/data/vascular/questions.json")
    with open(vascular_file, 'r', encoding='utf-8') as f:
        vascular_data = json.load(f)

    print("Before update:")
    for exam_key in vascular_data.keys():
        print(f"  {exam_key}: {len(vascular_data[exam_key])} questions")

    # Replace exam3 with new data from parsed_questions.json
    vascular_data["exam3"] = parsed_data["exam3"]

    print("\nAfter update:")
    for exam_key in vascular_data.keys():
        print(f"  {exam_key}: {len(vascular_data[exam_key])} questions")

    # Save back to vascular/questions.json
    with open(vascular_file, 'w', encoding='utf-8') as f:
        json.dump(vascular_data, f, indent=2, ensure_ascii=False)

    print(f"\nUpdated {vascular_file}")
    print(f"Total questions: {sum(len(v) for v in vascular_data.values())}")

if __name__ == "__main__":
    main()
