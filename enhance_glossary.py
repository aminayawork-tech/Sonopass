#!/usr/bin/env python3
"""
Script to enhance glossary terms with rich educational content
"""
import json
import re

def create_memory_trick(term, definition, category):
    """Generate a simple memory trick based on the term"""
    tricks = {
        "index": "Think: A measured value 📊",
        "stenosis": "Think: Narrowing = less flow 🚧",
        "occlusion": "Think: Blocked road 🚫",
        "thrombosis": "Think: Clot in the pot 🩸",
        "artery": "Think: Highway carrying blood away from heart ➡️",
        "vein": "Think: Return route back to heart ⬅️",
        "syndrome": "Think: Group of symptoms together 🤝",
        "resistance": "Think: How hard it is for blood to flow 💪",
        "velocity": "Think: Speed of blood flow 🏃",
        "flow": "Think: Blood movement through vessels 🌊"
    }

    for key, trick in tricks.items():
        if key.lower() in term.lower() or key.lower() in definition.lower():
            return trick

    return f"Remember: {term} is key for the exam 🎯"

def extract_meaning(definition):
    """Extract a short meaning from the definition"""
    # Take first sentence or clause
    first_part = definition.split(';')[0].split(',')[0]
    if len(first_part) > 80:
        first_part = first_part[:77] + "..."
    return first_part

def create_breakdown(definition, term):
    """Create breakdown points from definition"""
    points = []

    # Split by semicolons and commas to get key points
    parts = re.split(r'[;,]', definition)

    for i, part in enumerate(parts[:3]):  # Max 3 points
        part = part.strip()
        if part and len(part) > 10:
            # Clean up and simplify
            part = part.replace(' often ', ' - often ')
            part = part.replace(' typically ', ' - typically ')
            points.append(part.capitalize() if not part[0].isupper() else part)

    if len(points) == 0:
        points.append(f"{term} is an important concept for vascular sonography")

    return points[:3]

def has_waveform_relevance(term, definition, category):
    """Check if term is waveform-related"""
    waveform_keywords = ['doppler', 'waveform', 'flow', 'velocity', 'spectrum',
                         'pulsatile', 'resistance', 'phasic', 'augmentation']

    if category == 'doppler':
        return True

    text = (term + ' ' + definition).lower()
    return any(keyword in text for keyword in waveform_keywords)

def create_waveform_clue(term, definition):
    """Generate waveform clue if applicable"""
    if 'normal' in definition.lower() and 'abnormal' in definition.lower():
        # Try to extract normal/abnormal from definition
        return {
            "normal": "Normal waveform pattern",
            "abnormal": "Abnormal waveform pattern"
        }

    # Default based on common patterns
    if 'stenosis' in definition.lower() or 'occlusion' in definition.lower():
        return {
            "normal": "normal velocity and waveform shape",
            "abnormal": "increased velocity, turbulence, or dampened waveform"
        }

    return None

def enhance_term(term_obj):
    """Enhance a single term with rich content"""
    term = term_obj['term']
    definition = term_obj['definition']
    category = term_obj['category']

    # If already enhanced, skip
    if 'meaning' in term_obj:
        return term_obj

    enhanced = term_obj.copy()

    # Add meaning
    enhanced['meaning'] = extract_meaning(definition)

    # Add breakdown
    enhanced['breakDown'] = create_breakdown(definition, term)

    # Add memory trick
    memory_title = create_memory_trick(term, definition, category)
    enhanced['memoryTrick'] = {
        "title": memory_title,
        "points": [
            f"Focus on the key aspects of {term}",
            "Connect it to related concepts you already know"
        ]
    }

    # Add clinical use
    if 'causes' in definition.lower() or 'indicates' in definition.lower():
        enhanced['clinicalUse'] = f"Helps identify and assess vascular conditions"
    else:
        enhanced['clinicalUse'] = f"Important for understanding vascular pathology and exam interpretation"

    # Add waveform clue if relevant
    if has_waveform_relevance(term, definition, category):
        waveform = create_waveform_clue(term, definition)
        if waveform:
            enhanced['waveformClue'] = waveform

    return enhanced

def main():
    # Read original terms
    with open('/home/user/Sonopass/public/glossary/vascular/terms.json', 'r') as f:
        terms = json.load(f)

    # Enhance all terms
    enhanced_terms = []
    for term_obj in terms:
        enhanced = enhance_term(term_obj)
        enhanced_terms.append(enhanced)

    # Write enhanced terms
    with open('/home/user/Sonopass/public/glossary/vascular/terms.json', 'w') as f:
        json.dump(enhanced_terms, f, indent=2, ensure_ascii=False)

    print(f"Enhanced {len(enhanced_terms)} terms successfully!")

if __name__ == '__main__':
    main()
