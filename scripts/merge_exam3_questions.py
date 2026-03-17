#!/usr/bin/env python3
"""
Merge manually extracted questions with OCR-parsed questions.
Prioritize manual extraction for higher quality, fill gaps with OCR results.
"""

import json
from pathlib import Path

# Manually extracted questions (high quality)
manual_questions = {
    154: {
        "question": "You obtain the PPG tracing from the second digit of the left hand. Which of the following is NOT an expected cause for the findings?",
        "options": [
            {"letter": "A", "text": "Thoracic outlet syndrome"},
            {"letter": "B", "text": "Raynaud disease"},
            {"letter": "C", "text": "Thromboangiitis obliterans"},
            {"letter": "D", "text": "Leriche syndrome"}
        ],
        "correctAnswer": "D",
        "explanation": "Leriche syndrome refers to stenosis or occlusion of the distal aorta. This would lead to a similar PPG tracing from the LOWER extremity digits.",
        "imageFile": "mock-exam-3_4.png"
    },
    153: {
        "question": "The posterior communicating artery connects the:",
        "options": [
            {"letter": "A", "text": "anterior and posterior cerebral vessels"},
            {"letter": "B", "text": "right and left vertebral arteries"},
            {"letter": "C", "text": "ECA to the ICA"},
            {"letter": "D", "text": "right and left sides of the circle of willis"}
        ],
        "correctAnswer": "A",
        "explanation": "The posterior communicators connect the posterior cerebral circulation to the anterior cerebral circulation (PCA and the MCA). The ACA and MCA are part of the anterior circulation. The PCA and basilar/vertebral arteries are part of the posterior circulation.",
        "imageFile": "mock-exam-3_5.png"
    },
    152: {
        "question": "Where do the plantar arteries originate?",
        "options": [
            {"letter": "A", "text": "from the anterior tibial artery posterior to the medial malleolus"},
            {"letter": "B", "text": "from the peroneal artery just past the Achilles tendon attachment at the heel"},
            {"letter": "C", "text": "from the anterior tibial artery anterior to the medial malleolus"},
            {"letter": "D", "text": "from the posterior tibial artery posterior to the medial malleolus"}
        ],
        "correctAnswer": "D",
        "explanation": "The plantar arteries originate from the PTA posterior to the medial malleolus.",
        "imageFile": "mock-exam-3_6.png"
    },
    151: {
        "question": "A patient presents with splenomegaly and multiple, small, tortuous vessels are visualized in the porta hepatis area of the liver. These vessels most likely represent:",
        "options": [
            {"letter": "A", "text": "Duplicated hepatic artery"},
            {"letter": "B", "text": "Cavernous transformation"},
            {"letter": "C", "text": "Dilated extrahepatic biliary system"},
            {"letter": "D", "text": "Portal aneurysm"}
        ],
        "correctAnswer": "B",
        "explanation": "Cavernous transformation of the vessels at the porta hepatis refers to the formation of varices from the increased portal pressure with portal HTN. Accessory veins dilate at the porta hepatis due to the backlog of blood flow. These vessels are small and tortuous. Splenomegaly is another sign of portal HTN and a backlog in the blood flow in the portal system.",
        "imageFile": "mock-exam-3_6.png"
    },
    144: {
        "question": "The preferred imaging plane to measure the AP dimension of the aorta is:",
        "options": [
            {"letter": "A", "text": "coronal"},
            {"letter": "B", "text": "transverse"},
            {"letter": "C", "text": "sagittal"},
            {"letter": "D", "text": "radial"}
        ],
        "correctAnswer": "C",
        "explanation": "The sagittal plane is the preferred imaging plane to measure the AP dimension of the aorta.",
        "imageFile": "mock-exam-3_11.png"
    },
    143: {
        "question": "While scanning the popliteal artery, you notice a thrombus in the popliteal vein. Which vein(s) should be evaluated next for ascending propagation of the clot?",
        "options": [
            {"letter": "A", "text": "ATA and tiboperoneal trunk"},
            {"letter": "B", "text": "distal femoral vein"},
            {"letter": "C", "text": "common femoral vein"},
            {"letter": "D", "text": "GSV"}
        ],
        "correctAnswer": "B",
        "explanation": "If a clot is identified in the popliteal vein, the distal femoral vein should be evaluated next for propagation of the thrombus.",
        "imageFile": "mock-exam-3_12.png"
    },
    142: {
        "question": "Which of the following vessels typically supplies blood to a carotid body tumor?",
        "options": [
            {"letter": "A", "text": "branches of the internal carotid artery"},
            {"letter": "B", "text": "branches of the external carotid artery"},
            {"letter": "C", "text": "branches of the subclavian artery"},
            {"letter": "D", "text": "branches of the middle cerebral artery"}
        ],
        "correctAnswer": "B",
        "explanation": "Branches of the ECA typically supply blood to a carotid body tumor. Because the ICA has no extracranial branches, it is much less commonly the source of arterial flow to a carotid body tumor.",
        "imageFile": "mock-exam-3_13.png"
    },
    140: {
        "question": "If the acceleration time is >140ms in both common femoral arteries:",
        "options": [
            {"letter": "A", "text": "flow is considered normal"},
            {"letter": "B", "text": "bilateral internal iliac disease is suspected"},
            {"letter": "C", "text": "unilateral external iliac disease is suspected"},
            {"letter": "D", "text": "aortic disease is suspected"}
        ],
        "correctAnswer": "D",
        "explanation": "If the acceleration time is >140ms in both common femoral arteries, aortic disease is suspected. Increased or longer AT indicates a proximal obstruction. If the acceleration time is >140ms in one common femoral artery, ipsilateral iliac stenosis is suspected. Decreased or shorter AT indicates a distal obstruction.",
        "imageFile": "mock-exam-3_14.png"
    },
    134: {
        "question": "According to the Appropriate Use Criteria, which of the following is an appropriate indication for an lower extremity venous duplex exam for venous insufficiency?",
        "options": [
            {"letter": "A", "text": "Positive D-dimer test"},
            {"letter": "B", "text": "Hyperpigmentation"},
            {"letter": "C", "text": "Suspected or diagnosed pulmonary hypertension"},
            {"letter": "D", "text": "Telangiectasia"}
        ],
        "correctAnswer": "B",
        "explanation": "Hyperpigmentation of the distal calf occurs with chronic venous insufficiency. The waste products in the venous blood that pools in the calf cannot be absorbed by osmosis. Telangiectasia refers to dilated veins that appear as spider veins on the legs. This appearance has not been associated with insufficiency in the larger superficial veins.",
        "imageFile": "mock-exam-3_20.png"
    },
    91: {
        "question": "The left and right innominate veins merge to form the",
        "options": [
            {"letter": "A", "text": "superior vena cava (SVC)"},
            {"letter": "B", "text": "inferior vena cava (IVC)"},
            {"letter": "C", "text": "Right atrium"},
            {"letter": "D", "text": "Brachiocephalic vein"}
        ],
        "correctAnswer": "A",
        "explanation": "The right and left innominate veins merge to form the SVC.",
        "imageFile": "mock-exam-3_50.png"
    },
    26: {
        "question": "Which of the following indicates the proper order for putting on personal protective equipment?",
        "options": [
            {"letter": "A", "text": "goggles, gown, mask, gloves"},
            {"letter": "B", "text": "gown, goggles, mask, gloves"},
            {"letter": "C", "text": "gown, mask, goggles, gloves"},
            {"letter": "D", "text": "mask, goggles, gown, gloves"}
        ],
        "correctAnswer": "C",
        "explanation": "Before putting on PPE, always wash your hands first. When putting on PPE, the CDC recommends putting the gown on first, then the mask, followed by goggles and finish with the gloves.",
        "imageFile": "mock-exam-3_100.png"
    },
    25: {
        "question": "Hypothenar hammer syndrome and thoracic outlet syndrome are what type of vascular disorder?",
        "options": [
            {"letter": "A", "text": "Autoimmune diseases"},
            {"letter": "B", "text": "Fibromuscular syndromes"},
            {"letter": "C", "text": "Atherosclerotic diseases"},
            {"letter": "D", "text": "Compression syndromes"}
        ],
        "correctAnswer": "D",
        "explanation": "TOS involves compression of the vessels in the thoracic outlet. Hypothenar hammer syndrome involves compression of the ulnar artery. Eagle syndrome involves compression of the carotid artery. SMA compression syndrome can affect the left renal vein or the duodenum. Median arcuate ligament syndrome involves compression of the celiac artery or celiac trunk. There are many types that can be caused by tumors or congenital mal-positioning of vessels.",
        "imageFile": "mock-exam-3_100.png"
    }
}

def create_question_entry(number, data):
    """Create a standardized question entry"""
    return {
        "id": f"exam3_q{number}",
        "number": number,
        "question": data["question"],
        "options": data["options"],
        "category": "Vascular",
        "correctAnswer": data["correctAnswer"],
        "explanation": data["explanation"],
        "imageFile": data["imageFile"]
    }

def main():
    # Load OCR-parsed questions
    ocr_file = Path("scripts/exam3_questions_parsed.json")
    with open(ocr_file, 'r', encoding='utf-8') as f:
        ocr_questions = json.load(f)

    # Create a dictionary of OCR questions by number
    ocr_by_number = {q["number"]: q for q in ocr_questions}

    # Merge: prioritize manual, fill with OCR
    merged = {}

    # Add all manual questions first
    for num, data in manual_questions.items():
        merged[num] = create_question_entry(num, data)

    # Add OCR questions that aren't manually extracted
    # Only add if they have all 4 options (higher quality)
    for num, q in ocr_by_number.items():
        if num not in merged and len(q["options"]) == 4:
            merged[num] = q

    # Convert to sorted list
    final_questions = sorted(merged.values(), key=lambda x: x["number"])

    # Save
    output_file = Path("scripts/exam3_final.json")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(final_questions, f, indent=2, ensure_ascii=False)

    print(f"Merged questions saved to: {output_file}")
    print(f"\nStatistics:")
    print(f"  Manual questions: {len(manual_questions)}")
    print(f"  OCR questions (all): {len(ocr_questions)}")
    print(f"  OCR questions (4 options): {sum(1 for q in ocr_questions if len(q['options']) == 4)}")
    print(f"  Final merged: {len(final_questions)}")
    print(f"  Question range: Q{final_questions[0]['number']} - Q{final_questions[-1]['number']}")

    # Quality check
    complete = sum(1 for q in final_questions if len(q['options']) == 4)
    with_answers = sum(1 for q in final_questions if q['correctAnswer'])
    with_explanations = sum(1 for q in final_questions if q['explanation'])

    print(f"\nQuality metrics:")
    print(f"  Complete (4 options): {complete}/{len(final_questions)} ({100*complete/len(final_questions):.1f}%)")
    print(f"  With correct answer: {with_answers}/{len(final_questions)} ({100*with_answers/len(final_questions):.1f}%)")
    print(f"  With explanation: {with_explanations}/{len(final_questions)} ({100*with_explanations/len(final_questions):.1f}%)")

if __name__ == "__main__":
    main()
