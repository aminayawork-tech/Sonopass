#!/usr/bin/env python3
"""
Interactive Image URL Updater for Vascular Questions
This script helps you easily update all 10 image questions with real Radiopaedia URLs
"""

import json
import sys

def main():
    print("🎨 Vascular Questions Image Updater")
    print("=" * 60)
    print()

    # Load the questions file
    with open('src/data/vascular-questions.json', 'r') as f:
        data = json.load(f)

    # Define the 10 questions that need images
    image_questions = [
        {
            'id': 'exam1_q148',
            'number': 148,
            'topic': 'Carotid plaque with calcification',
            'radiopaedia_url': 'https://radiopaedia.org/cases/carotid-artery-stenosis-5',
            'instructions': 'Look for B-mode image showing echogenic plaque with shadowing'
        },
        {
            'id': 'exam1_q149',
            'number': 149,
            'topic': 'Triphasic arterial waveform',
            'radiopaedia_url': 'https://radiopaedia.org/articles/doppler-waveforms',
            'instructions': 'Look for spectral Doppler showing normal triphasic pattern'
        },
        {
            'id': 'exam1_q150',
            'number': 150,
            'topic': 'Deep vein thrombosis',
            'radiopaedia_url': 'https://radiopaedia.org/cases/deep-vein-thrombosis-of-lower-extremity',
            'instructions': 'Look for compression ultrasound showing non-compressible vein'
        },
        {
            'id': 'exam1_q151',
            'number': 151,
            'topic': 'Color Doppler aliasing (carotid stenosis)',
            'radiopaedia_url': 'https://radiopaedia.org/cases/carotid-artery-stenosis-5',
            'instructions': 'Look for color Doppler showing aliasing or spectral Doppler with elevated velocities'
        },
        {
            'id': 'exam1_q152',
            'number': 152,
            'topic': "Baker's cyst (popliteal cyst)",
            'radiopaedia_url': 'https://radiopaedia.org/articles/baker-cyst-2',
            'instructions': 'Look for anechoic fluid collection in popliteal fossa'
        },
        {
            'id': 'exam1_q153',
            'number': 153,
            'topic': 'Monophasic waveform (proximal disease)',
            'radiopaedia_url': 'https://radiopaedia.org/articles/doppler-waveforms',
            'instructions': 'Look for spectral Doppler showing monophasic/dampened waveform'
        },
        {
            'id': 'exam1_q154',
            'number': 154,
            'topic': 'Heterogeneous carotid plaque',
            'radiopaedia_url': 'https://radiopaedia.org/cases/carotid-artery-stenosis-5',
            'instructions': 'Look for plaque with mixed echogenicity (hypoechoic and hyperechoic areas)'
        },
        {
            'id': 'exam1_q155',
            'number': 155,
            'topic': 'Subclavian steal syndrome',
            'radiopaedia_url': 'https://radiopaedia.org/cases/subclavian-steal-syndrome-9',
            'instructions': 'Look for Doppler showing reversed vertebral artery flow'
        },
        {
            'id': 'exam1_q156',
            'number': 156,
            'topic': 'Pseudoaneurysm with yin-yang sign',
            'radiopaedia_url': 'https://radiopaedia.org/articles/femoral-artery-pseudoaneurysm',
            'instructions': 'Look for color Doppler showing swirling bidirectional flow (yin-yang appearance)'
        },
        {
            'id': 'exam1_q157',
            'number': 157,
            'topic': 'Portal vein flow (hepatopetal)',
            'radiopaedia_url': 'https://radiopaedia.org/articles/portal-venous-flow',
            'instructions': 'Look for Doppler showing flow toward the liver (hepatopetal)'
        }
    ]

    print("📋 Questions needing images:")
    print()
    for i, q in enumerate(image_questions, 1):
        print(f"{i}. Q{q['number']}: {q['topic']}")
    print()
    print("=" * 60)
    print()

    # Interactive update mode
    if len(sys.argv) > 1 and sys.argv[1] == '--auto':
        print("ℹ️  Auto mode: Using placeholder URLs")
        print("   You'll need to manually replace these with real Radiopaedia image URLs")
        print()
        auto_update(data, image_questions)
    else:
        print("🔧 Interactive Mode")
        print()
        print("For each question, I'll:")
        print("  1. Show you which Radiopaedia page to visit")
        print("  2. Tell you which image to look for")
        print("  3. Ask you to paste the image URL")
        print()
        print("To get an image URL from Radiopaedia:")
        print("  • Visit the case/article")
        print("  • Right-click on the ultrasound image")
        print("  • Select 'Copy image address' (or 'Open image in new tab' then copy URL)")
        print("  • Paste it when prompted")
        print()

        choice = input("Ready to start? (y/n): ").strip().lower()
        if choice != 'y':
            print("Cancelled.")
            return

        interactive_update(data, image_questions)

def interactive_update(data, image_questions):
    """Interactive mode - prompt user for each URL"""
    updated_count = 0

    for q_info in image_questions:
        print()
        print("=" * 60)
        print(f"📸 Question {q_info['number']}: {q_info['topic']}")
        print("=" * 60)
        print()
        print(f"🌐 Radiopaedia page: {q_info['radiopaedia_url']}")
        print(f"🔍 What to look for: {q_info['instructions']}")
        print()
        print("Action: Visit the URL above, find the image, and copy its URL")
        print()

        url = input("Paste image URL (or 'skip' to skip, 'quit' to exit): ").strip()

        if url.lower() == 'quit':
            print("\nStopping...")
            break

        if url.lower() == 'skip' or not url:
            print("⏭️  Skipped")
            continue

        # Update the question
        for question in data['exam1']:
            if question['id'] == q_info['id']:
                question['imageUrl'] = url
                if 'imageCaption' not in question or 'placeholder' in question.get('imageCaption', '').lower():
                    question['imageCaption'] = f"{q_info['topic']}. Image: Radiopaedia.org (CC BY-NC-SA)"
                updated_count += 1
                print(f"✅ Updated Q{q_info['number']}")
                break

    # Save the file
    if updated_count > 0:
        with open('src/data/vascular-questions.json', 'w') as f:
            json.dump(data, f, indent=2)
        print()
        print("=" * 60)
        print(f"✅ SUCCESS! Updated {updated_count} questions")
        print("=" * 60)
        print()
        print("📁 File saved: src/data/vascular-questions.json")
        print()
        print("Next steps:")
        print("  1. Test the images in your app")
        print("  2. Commit the changes: git add . && git commit -m 'Add real Radiopaedia images'")
        print("  3. Push: git push")
    else:
        print("\nNo updates made.")

def auto_update(data, image_questions):
    """Auto mode - use better placeholder URLs with instructions"""
    updated_count = 0

    for q_info in image_questions:
        for question in data['exam1']:
            if question['id'] == q_info['id']:
                # Use a placeholder that shows where to get the real one
                question['imageUrl'] = f"https://via.placeholder.com/600x400/1a1a1a/white?text=Q{q_info['number']}:+Visit+Radiopaedia"
                question['imageCaption'] = f"{q_info['topic']} - Get real image from: {q_info['radiopaedia_url']}"
                updated_count += 1
                print(f"✅ Updated Q{q_info['number']} with instructions")
                break

    with open('src/data/vascular-questions.json', 'w') as f:
        json.dump(data, f, indent=2)

    print()
    print(f"✅ Updated {updated_count} questions with instructional placeholders")
    print()
    print("Run the script again without --auto to add real URLs interactively.")

if __name__ == '__main__':
    main()
