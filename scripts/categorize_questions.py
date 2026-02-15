#!/usr/bin/env python3
import json
import re

# Define categories based on keywords
CATEGORIES = {
    'Arterial Anatomy': [
        'aorta', 'iliac', 'femoral', 'popliteal', 'tibial', 'peroneal',
        'subclavian', 'innominate', 'brachiocephalic', 'celiac', 'mesenteric',
        'renal artery', 'arterial anatomy', 'artery branches'
    ],
    'Arterial Hemodynamics': [
        'resistive', 'pulsatile', 'triphasic', 'biphasic', 'monophasic',
        'velocity', 'flow pattern', 'waveform', 'pressure gradient',
        'bernoulli', 'poiseuille'
    ],
    'Arterial Disease': [
        'stenosis', 'aneurysm', 'dissection', 'arterial occlusion',
        'peripheral arterial disease', 'pad', 'atherosclerosis', 'plaque',
        'arterial ulcer', 'ischemia', 'claudication'
    ],
    'Arterial Testing': [
        'ankle-brachial index', 'abi', 'segmental pressure', 'pulse volume',
        'toe pressure', 'arterial duplex', 'exercise test'
    ],
    'Cerebrovascular': [
        'carotid', 'vertebral', 'internal carotid', 'external carotid',
        'common carotid', 'ica', 'eca', 'cca', 'cerebral', 'transcranial',
        'tcd', 'stroke', 'tia', 'cerebrovascular', 'circle of willis',
        'basilar', 'carotid body'
    ],
    'Venous Anatomy': [
        'femoral vein', 'popliteal vein', 'saphenous', 'gsv', 'ssv',
        'perforating vein', 'deep vein', 'superficial vein', 'vena cava',
        'jugular vein', 'subclavian vein'
    ],
    'Venous Hemodynamics': [
        'venous reflux', 'phasic', 'spontaneous', 'augmentation',
        'venous flow', 'respiratory phasicity', 'valve competence'
    ],
    'Venous Disease': [
        'deep vein thrombosis', 'dvt', 'venous thrombosis', 'thrombus',
        'chronic venous insufficiency', 'cvi', 'varicose', 'venous ulcer',
        'venous reflux', 'superficial thrombophlebitis', 'may-thurner',
        'thoracic outlet syndrome'
    ],
    'Venous Testing': [
        'compression', 'venous duplex', 'venous refill time', 'photoplethysmography',
        'venous reflux test'
    ],
    'Physics & Instrumentation': [
        'artifact', 'aliasing', 'color flash', 'shadowing', 'enhancement',
        'reverberation', 'frequency', 'wavelength', 'transducer', 'doppler',
        'color scale', 'color gain', 'optimize', 'side-lobe', 'spectral'
    ],
    'General & Other': []  # Catch-all
}

def categorize_question(question_text):
    """Categorize a question based on keywords"""
    question_lower = question_text.lower()

    # Score each category
    scores = {}
    for category, keywords in CATEGORIES.items():
        if category == 'General & Other':
            continue
        score = sum(1 for keyword in keywords if keyword.lower() in question_lower)
        if score > 0:
            scores[category] = score

    # Return category with highest score, or General if no match
    if scores:
        return max(scores, key=scores.get)
    return 'General & Other'

def clean_text(text):
    """Remove excessive whitespace"""
    return re.sub(r'\s+', ' ', text).strip()

def main():
    import os

    # Load parsed questions
    script_dir = os.path.dirname(__file__)
    input_path = os.path.join(script_dir, 'parsed_questions.json')

    with open(input_path, 'r') as f:
        data = json.load(f)

    # Process and categorize questions
    categorized = {
        'exam1': [],
        'exam2': []
    }

    category_counts = {}

    for exam_id in ['exam1', 'exam2']:
        for q in data[exam_id]:
            # Clean up text
            question_text = clean_text(q['question'])

            # Clean up options
            cleaned_options = []
            for opt in q['options']:
                cleaned_options.append({
                    'letter': opt['letter'],
                    'text': clean_text(opt['text'])
                })

            # Categorize
            category = categorize_question(question_text)
            category_counts[category] = category_counts.get(category, 0) + 1

            # Create cleaned question object
            categorized[exam_id].append({
                'id': q['id'],
                'number': q['number'],
                'question': question_text,
                'options': cleaned_options,
                'category': category,
                'correctAnswer': None,  # To be filled later
                'explanation': None
            })

    # Save categorized questions
    output_path = os.path.join(script_dir, 'categorized_questions.json')
    with open(output_path, 'w') as f:
        json.dump(categorized, f, indent=2)

    print(f"✓ Categorized {len(categorized['exam1'])} questions from Exam 1")
    print(f"✓ Categorized {len(categorized['exam2'])} questions from Exam 2")
    print(f"✓ Saved to: {output_path}")

    print("\nCategory breakdown:")
    for category, count in sorted(category_counts.items(), key=lambda x: -x[1]):
        print(f"  {category}: {count} questions")

if __name__ == '__main__':
    main()
