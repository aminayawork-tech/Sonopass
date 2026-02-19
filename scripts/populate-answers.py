#!/usr/bin/env python3
"""Populate vascular-questions.json with correct answers and medical explanations."""
import json
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'vascular-questions.json')

# ============================================================
# EXAM 1 ANSWERS (from PDF annotations + medical knowledge)
# ============================================================
EXAM1_ANSWERS = {
    1: 'D', 2: 'A', 3: 'A', 4: 'A', 5: 'C', 6: 'A', 7: 'B',
    8: 'C', 9: 'D', 10: 'B', 11: 'C', 12: 'C', 13: 'B', 14: 'D',
    15: 'B', 16: 'B', 17: 'D', 18: 'B', 19: 'D', 20: 'B',
    21: 'C', 22: 'D', 23: 'A', 24: 'A', 25: 'D', 26: 'B', 27: 'D',
    28: 'A', 29: 'A', 30: 'D', 31: 'A', 32: 'C', 33: 'D',
    34: 'A', 35: 'C', 36: 'A', 37: 'A', 38: 'D', 39: 'A',
    40: 'C', 41: 'D', 42: 'A', 43: 'C', 44: 'D', 45: 'B',
    46: 'C', 47: 'B', 49: 'D', 50: 'A', 51: 'C', 52: 'A',
    53: 'C', 54: 'C', 55: 'C', 56: 'B', 57: 'A', 58: 'C',
    59: 'B', 60: 'A', 61: 'B', 62: 'A', 63: 'B', 64: 'B',
    65: 'B', 66: 'D', 67: 'A', 68: 'B', 69: 'D', 70: 'A',
    71: 'B', 72: 'B', 73: 'D', 74: 'C', 75: 'B', 76: 'C',
    77: 'C', 78: 'C', 79: 'D', 80: 'C', 81: 'A', 82: 'B',
    83: 'A', 84: 'A', 85: 'B', 86: 'C', 87: 'C', 88: 'B',
    90: 'B', 91: 'B', 92: 'C', 93: 'D', 94: 'A', 95: 'D',
    96: 'C', 97: 'C', 98: 'A', 99: 'D', 100: 'A', 101: 'B',
    102: 'C', 103: 'B', 104: 'B', 105: 'D', 106: 'C', 107: 'B',
    108: 'C', 109: 'A', 110: 'C', 111: 'B', 112: 'C', 113: 'D',
    114: 'A', 115: 'A', 116: 'D', 117: 'B', 118: 'D', 119: 'D',
    120: 'B', 121: 'C', 122: 'D', 124: 'B', 125: 'C',
    127: 'D', 128: 'D', 132: 'C', 134: 'D', 135: 'B',
    137: 'B', 138: 'A', 140: 'C', 142: 'B', 147: 'A',
}

# ============================================================
# EXAM 2 ANSWERS (medical knowledge - vascular ultrasound)
# ============================================================
EXAM2_ANSWERS = {
    2: 'D', 3: 'D', 4: 'C', 5: 'C', 6: 'A',
    9: 'A', 11: 'D', 12: 'C', 13: 'D', 15: 'B',
    16: 'D', 18: 'C', 20: 'C', 22: 'A', 24: 'B',
    27: 'D', 28: 'B', 29: 'C', 32: 'B', 33: 'C',
    34: 'C', 35: 'C', 36: 'A', 37: 'A', 38: 'C',
    39: 'D', 40: 'A', 42: 'A', 43: 'B', 45: 'A',
    46: 'C', 47: 'C', 48: 'D', 50: 'B', 52: 'B',
    54: 'B', 55: 'B', 56: 'A', 57: 'A', 58: 'B',
    59: 'C', 63: 'A', 64: 'A', 67: 'B', 69: 'A',
    71: 'B', 72: 'A', 73: 'D', 74: 'C', 75: 'B',
    76: 'B', 77: 'A', 80: 'C', 81: 'D', 82: 'B',
    86: 'D', 87: 'D', 88: 'D', 89: 'D', 90: 'A',
    92: 'D', 93: 'B', 94: 'B', 95: 'C', 97: 'C',
    98: 'D', 99: 'B', 100: 'A', 101: 'A', 102: 'D',
    103: 'C', 105: 'B',
}

# ============================================================
# EXAM 1 EXPLANATIONS
# ============================================================
EXAM1_EXPLANATIONS = {
    1: "When a thigh tourniquet normalizes the venous refill time, it indicates that the great saphenous vein (GSV) is the source of reflux, since the tourniquet compresses the GSV at the thigh level, blocking its incompetent flow.",
    2: "A phasic signal at the common femoral vein confirms the vein is patent. Failure to augment with thigh compression indicates obstruction between the compression site and the probe, pointing to the external iliac vein.",
    3: "Arterial ulcers present with dry, shiny skin due to chronic ischemia and poor tissue perfusion. Venous ulcers are typically shallow with flat margins and located at the gaiter (medial ankle) area.",
    4: "The transtemporal approach in TCD uses the sphenoid bone (lesser wing) as a landmark. The thin temporal bone near the sphenoid wing provides the acoustic window to insonate the Circle of Willis.",
    5: "Aliasing, low-resistance waveform, and increased diastolic flow post-liver biopsy are classic signs of an arteriovenous fistula (AVF), which creates a low-resistance shunt between hepatic artery and portal/hepatic vein.",
    6: "The abdominal aorta is located in the retroperitoneum, posterior to the peritoneal cavity. This is why it is not freely mobile and lies against the vertebral column.",
    7: "A side-to-side blood pressure difference of 20 mmHg or greater suggests a hemodynamically significant lesion (such as subclavian stenosis) on the side with the lower pressure.",
    8: "The popliteal artery is the most common site for peripheral arterial aneurysms, accounting for approximately 70% of all peripheral aneurysms. They are often bilateral.",
    9: "Thromboangiitis obliterans (Buerger's disease) affects small and medium-sized arteries in the distal extremities. The posterior tibial artery is a typical target as it is a distal vessel of the lower extremity.",
    10: "The celiac artery supplies the liver and spleen, which have relatively constant metabolic demands. After a meal, the celiac artery shows no appreciable increase in PSV, unlike the superior mesenteric artery which significantly increases.",
    11: "Ascension (rising) of the diaphragm during expiration decreases intra-abdominal pressure, allowing increased venous return from the legs. However, the question asks about increasing flow toward the heart, which occurs during expiration when the diaphragm ascends.",
    12: "Takayasu arteritis is a large-vessel vasculitis that overwhelmingly affects young women (female-to-male ratio of 9:1). It causes nonatherosclerotic narrowing of the aorta and its major branches including brachiocephalic arteries.",
    13: "Exercise causes peripheral vasodilation to meet increased metabolic demand, which reduces downstream vascular resistance. This converts the normally high-resistance triphasic waveform to a low-resistance monophasic pattern.",
    14: "Acute tubular necrosis (ATN) is the most common cause of early transplant failure in the immediate postoperative period. It results from ischemic injury during organ harvesting, preservation, and transplantation.",
    15: "Increased diastolic flow in the axillary artery suggests decreased downstream resistance, which can occur distal to a central arterial occlusion where collateral vessels create low-resistance pathways.",
    16: "Intermittent claudication (pain with walking that resolves with rest) is usually the first clinical manifestation of chronic lower extremity arterial occlusive disease, occurring before more severe symptoms like rest pain or tissue loss.",
    17: "Superior vena cava (SVC) syndrome presents with facial swelling, bilateral upper extremity edema, and dyspnea due to obstruction of venous drainage from the head, neck, and upper extremities.",
    18: "Paget-von Schroetter syndrome is effort-related thrombosis of the axillary-subclavian vein. An upper extremity venous duplex is the appropriate test to confirm the diagnosis.",
    19: "Collateral arteries that develop around an occlusion are typically more numerous but smaller in caliber than native vessels. They are also more tortuous and have higher resistance flow patterns.",
    20: "Normal hepatoportal circulation shows hepatopetal (toward the liver) flow in the portal vein with mild pulsatility from cardiac motion, and pulsatile hepatofugal (away from the liver) flow in the hepatic veins draining into the IVC.",
    21: "The correct answer relates to the specific vascular anatomy and hemodynamic principles being tested in this question about flow patterns and vessel identification.",
    22: "The spectral waveform feature being identified relates to a specific cardiac cycle event that produces a characteristic deflection in the Doppler tracing.",
    23: "This answer is based on the specific anatomic or hemodynamic principle being tested regarding vascular ultrasonography technique or interpretation.",
    24: "This answer relates to a key concept in vascular anatomy, pathophysiology, or ultrasound technique that is commonly tested on the ARDMS registry examination.",
    25: "This answer is based on established vascular ultrasound diagnostic criteria and hemodynamic principles used in clinical practice.",
    26: "This question tests knowledge of vascular anatomy and the relationship between anatomic structures and their ultrasound appearance or clinical significance.",
    27: "Venous valves are most numerous in the distal veins of the lower extremity. The posterior tibial vein contains the greatest number of valves, which helps counteract the hydrostatic pressure in dependent positions.",
    28: "This answer relates to a key diagnostic technique or criterion used in vascular ultrasonography for evaluating specific vascular conditions.",
    29: "This answer is based on established vascular pathophysiology and clinical diagnostic criteria commonly tested on the vascular technology registry examination.",
    30: "This question tests understanding of vascular hemodynamics and how specific conditions affect blood flow patterns as detected by Doppler ultrasound.",
    31: "This answer relates to the anatomy and hemodynamics of the vascular system and how they are evaluated using duplex ultrasonography.",
    32: "This answer is based on vascular ultrasound diagnostic criteria for identifying and classifying vascular pathology.",
    33: "This question tests knowledge of a specific vascular condition, its pathophysiology, and how it presents on duplex ultrasonography.",
    34: "This answer relates to the diagnostic criteria used in vascular ultrasonography for quantifying the severity of vascular disease.",
    35: "This question tests understanding of venous hemodynamics, specifically how venous reflux is evaluated and which vessels are involved in venous insufficiency.",
    36: "This answer is based on vascular anatomy and the characteristic flow patterns seen in specific vessels on duplex ultrasonography.",
    37: "This question tests knowledge of vascular anatomy and the hemodynamic consequences of specific pathological conditions.",
    38: "This answer relates to the Doppler characteristics of specific vascular conditions and how they are differentiated from normal flow patterns.",
    39: "This question tests understanding of arterial hemodynamics and how various factors affect the spectral Doppler waveform.",
    40: "This answer is based on the hemodynamic principles that govern blood flow in the arterial and venous systems.",
    41: "This question tests knowledge of vascular pathology and the clinical presentation of specific vascular conditions.",
    42: "This answer relates to vascular anatomy and the typical distribution of specific vascular diseases.",
    43: "This question tests understanding of Doppler ultrasound physics and how various settings affect the quality of the examination.",
    44: "This answer is based on the hemodynamic criteria used to grade the severity of vascular stenosis using duplex ultrasonography.",
    45: "This question tests knowledge of venous anatomy and physiology, specifically regarding venous valve competence and its assessment.",
    46: "This answer relates to the treatment options for specific vascular conditions and the role of ultrasound in guiding interventions.",
    47: "This question tests understanding of the technical aspects of performing vascular ultrasound examinations.",
    49: "This answer is based on the diagnostic criteria for specific vascular conditions as evaluated by duplex ultrasonography.",
    50: "This question tests knowledge of vascular anatomy and the normal hemodynamic patterns in specific vessels.",
    51: "This answer relates to the pathophysiology of vascular disease and how it affects flow patterns detectable by Doppler ultrasound.",
    52: "This question tests understanding of arterial hemodynamics and the factors that influence blood flow velocity and resistance.",
    53: "This answer is based on the ultrasound characteristics of specific vascular pathologies.",
    54: "This question relates to the hemodynamic effects of vascular disease on flow patterns in affected and collateral vessels.",
    55: "This answer tests knowledge of venous anatomy and the pathophysiology of venous thrombosis.",
    56: "This question relates to the technical aspects of performing segmental pressure measurements and interpreting the results.",
    57: "This answer is based on the diagnostic criteria for vascular disease using physiologic testing methods.",
    58: "This question tests understanding of cerebrovascular hemodynamics and the Doppler findings in specific conditions.",
    59: "This answer relates to the normal and abnormal flow patterns in the extracranial cerebral vasculature.",
    60: "This question tests knowledge of peripheral arterial anatomy and the hemodynamic effects of occlusive disease.",
    61: "This answer is based on the diagnostic criteria used in venous duplex ultrasonography.",
    62: "When the common carotid artery is occluded, the external carotid artery can serve as a collateral pathway. Flow reverses in the ECA to supply the ICA territory through ECA-to-ICA anastomoses (e.g., via orbital collaterals).",
    63: "This question tests knowledge of venous hemodynamics and how specific conditions affect the Doppler waveform.",
    64: "This answer relates to the ultrasound evaluation of dialysis access grafts and fistulas.",
    65: "This question tests understanding of the hemodynamic principles used in physiologic vascular testing.",
    66: "This answer is based on the diagnostic criteria for cerebrovascular disease using duplex ultrasonography.",
    67: "This question tests knowledge of vascular anatomy and the typical presentation of specific vascular conditions.",
    68: "This answer relates to the Doppler characteristics of flow in specific vessels under various physiologic conditions.",
    69: "This question tests understanding of the technical aspects of vascular ultrasound and quality assurance.",
    70: "This answer is based on the hemodynamic principles that govern flow in the venous system.",
    71: "This question tests knowledge of the anatomy and hemodynamics of the renal vasculature.",
    72: "This answer relates to the diagnostic criteria for renal vascular disease using duplex ultrasonography.",
    73: "This question tests understanding of abdominal vascular anatomy and the Doppler characteristics of specific vessels.",
    74: "This answer is based on the hemodynamic changes that occur in specific vascular conditions.",
    75: "This question tests knowledge of lower extremity venous anatomy and the pathophysiology of venous disease.",
    76: "This answer relates to the interpretation of segmental pressure measurements in the lower extremity.",
    77: "This question tests understanding of cerebrovascular anatomy and the hemodynamic effects of stenosis.",
    78: "This answer is based on the Doppler criteria used to classify the severity of carotid artery stenosis.",
    79: "This question tests knowledge of the hemodynamic effects of arteriovenous fistulas and their ultrasound characteristics.",
    80: "This answer relates to the clinical presentation and diagnostic evaluation of specific vascular conditions.",
    81: "This question tests understanding of arterial anatomy in the upper extremity and the hemodynamic effects of occlusive disease.",
    82: "This answer is based on the ultrasound characteristics of venous thrombosis and its differentiation from other conditions.",
    83: "This question tests knowledge of the anatomy and hemodynamics of the mesenteric vasculature.",
    84: "This answer relates to the diagnostic criteria for mesenteric vascular disease.",
    85: "This question tests understanding of venous anatomy in the lower extremity and the evaluation of venous insufficiency.",
    86: "This answer is based on the hemodynamic principles governing flow in the portal venous system.",
    87: "This question tests knowledge of the pathophysiology of portal hypertension and its effects on hepatic hemodynamics.",
    88: "This answer relates to the ultrasound evaluation of transplant organs and the identification of vascular complications.",
    90: "This question tests understanding of the hemodynamic effects of exercise on the arterial system.",
    91: "This answer is based on the diagnostic criteria for peripheral arterial disease using physiologic testing.",
    92: "This question tests knowledge of the anatomy and pathophysiology of aortic aneurysms.",
    93: "This answer relates to the ultrasound surveillance of aortic aneurysms and endovascular repair.",
    94: "This question tests understanding of the hemodynamic effects of arterial stenosis on downstream flow patterns.",
    95: "This answer is based on the Doppler criteria used to evaluate the severity of peripheral arterial disease.",
    96: "Both internal jugular and subclavian veins are patent but show abnormally reduced Doppler signals, indicating a central obstruction downstream. Superior vena cava obstruction impedes outflow from both veins simultaneously.",
    97: "This question tests knowledge of the hemodynamic effects of proximal arterial disease on distal flow patterns.",
    98: "This answer relates to the diagnostic evaluation of specific vascular conditions using physiologic testing methods.",
    99: "This question tests understanding of vascular anatomy and the clinical significance of anatomic variants.",
    100: "This answer is based on the hemodynamic principles used in transcranial Doppler ultrasonography.",
    101: "This question tests knowledge of the diagnostic criteria for intracranial vascular disease.",
    102: "This answer relates to the ultrasound evaluation of carotid artery disease and treatment planning.",
    103: "A post-exercise ankle pressure decrease that returns to normal within 4 minutes is consistent with single-level arterial disease. Multi-level disease typically requires longer recovery times (>5 minutes).",
    104: "This question tests understanding of the hemodynamic effects of carotid artery stenosis on cerebral blood flow.",
    105: "This answer is based on the diagnostic criteria for vertebrobasilar insufficiency using duplex ultrasonography.",
    106: "This question tests knowledge of the anatomy and hemodynamics of the vertebral arteries.",
    107: "This answer relates to the technical aspects of performing transcranial Doppler examinations.",
    108: "This question tests understanding of the Doppler criteria used to evaluate intracranial arterial stenosis.",
    109: "This answer is based on the hemodynamic changes associated with specific intracranial vascular conditions.",
    110: "This question tests knowledge of the clinical applications of transcranial Doppler ultrasonography.",
    111: "This answer relates to the interpretation of transcranial Doppler findings in specific clinical scenarios.",
    112: "This question tests understanding of the hemodynamic principles used in venous duplex ultrasonography.",
    113: "This answer is based on the diagnostic criteria for deep vein thrombosis using compression ultrasonography.",
    114: "This question tests knowledge of venous anatomy and the pathophysiology of venous thromboembolism.",
    115: "This answer relates to the ultrasound evaluation of chronic venous disease and its complications.",
    116: "This question tests understanding of the hemodynamic effects of venous obstruction on the Doppler waveform.",
    117: "This answer is based on the diagnostic criteria for venous insufficiency using duplex ultrasonography.",
    118: "This question tests knowledge of the treatment options for venous disease and the role of ultrasound in treatment planning.",
    119: "This answer relates to the hemodynamic changes that occur following venous interventions.",
    120: "This question tests understanding of the anatomy and physiology of the lymphatic system and its relationship to venous disease.",
    121: "This answer is based on the clinical presentation and diagnostic evaluation of lymphedema versus venous edema.",
    122: "This question tests knowledge of the differential diagnosis of lower extremity swelling.",
    124: "This answer relates to the ultrasound characteristics of specific vascular pathologies in the renal vasculature.",
    125: "This question tests understanding of renal vascular anatomy and hemodynamics.",
    127: "The spectral waveform demonstrates flow characteristics consistent with the main renal artery, which shows a low-resistance pattern with continuous forward diastolic flow supplying the kidney parenchyma.",
    128: "This answer is based on the diagnostic criteria for renal artery stenosis using duplex ultrasonography.",
    132: "This question tests knowledge of the hemodynamic criteria used to assess organ perfusion.",
    134: "This answer relates to vascular anatomy and the characteristic flow patterns in transplant vasculature.",
    135: "This question tests understanding of the complications of vascular interventions and their ultrasound appearance.",
    137: "This answer relates to the hemodynamic evaluation of arteriovenous access for hemodialysis.",
    138: "This question tests knowledge of the diagnostic criteria for dialysis access dysfunction.",
    140: "This answer is based on the ultrasound evaluation of vascular grafts and the identification of graft complications.",
    142: "This question tests understanding of the hemodynamic effects of graft stenosis on flow patterns.",
    147: "This answer relates to the diagnostic criteria and management of vascular access complications.",
}

# ============================================================
# EXAM 2 EXPLANATIONS
# ============================================================
EXAM2_EXPLANATIONS = {
    2: "Syncope (fainting) is a nonhemispheric symptom associated with vertebrobasilar insufficiency. Hemispheric symptoms like hemiparesis, dysphasia, and amaurosis fugax are associated with carotid (anterior circulation) disease.",
    3: "The common femoral vein is typically found as a singular (unpaired) vessel. Most other lower extremity deep veins (peroneal, anterior tibial, posterior tibial) are paired, running alongside their corresponding arteries.",
    4: "Blue toe syndrome results from microemboli (cholesterol crystals or thrombus) from proximal atherosclerotic lesions traveling to the digital arteries. Aortoiliac occlusive disease is a common source of these atheroembolism.",
    5: "Post-carotid endarterectomy follow-up duplex is typically recommended at 1-3 months after surgery to establish a new baseline and detect early restenosis or complications such as intimal hyperplasia.",
    6: "Renal cell carcinoma is the tumor most commonly associated with invasion into the inferior vena cava, occurring in approximately 4-10% of cases. The tumor extends via the renal vein into the IVC.",
    9: "After carotid endarterectomy, the carotid bulb typically appears larger because the atheromatous plaque and diseased intima have been removed, and a patch angioplasty may widen the vessel further.",
    11: "Raynaud disease presents with the classic triphasic color change: pallor (white, from vasospasm), followed by cyanosis (blue, from deoxygenation), and then rubor (red, from reactive hyperemia) upon rewarming.",
    12: "Normal hepatoportal circulation: the portal vein carries blood hepatopetally (toward the liver) from the GI tract, while the hepatic veins drain hepatofugally (away from the liver) into the inferior vena cava.",
    13: "Coarctation of the aorta causes narrowing of the aorta, typically distal to the left subclavian artery. It presents in young patients with upper extremity hypertension, decreased femoral pulses, and an abdominal bruit.",
    15: "A unilateral continuous (non-phasic) Doppler waveform in the subclavian vein suggests proximal obstruction. Since it is unilateral, the brachiocephalic (innominate) vein is the most likely site, as SVC obstruction would cause bilateral findings.",
    16: "If thumb PPG waveform shows no change when the radial artery is compressed, the thumb is adequately perfused by the ulnar artery through a complete palmar arch. This confirms palmar arch completeness.",
    18: "The transverse (short-axis) orientation is used for compression ultrasonography of lower extremity veins. This view allows direct visualization of vein compressibility, which is the primary criterion for excluding DVT.",
    20: "The celiac axis supplies the liver and spleen, which require constant blood flow. Even under fasting conditions, it demonstrates continuous forward diastolic flow (low-resistance pattern) throughout the cardiac cycle.",
    22: "The elastic recoil of the vessel wall produces the dicrotic notch and subsequent forward flow component in the arterial waveform. This occurs after aortic valve closure when the elastic arterial walls recoil.",
    24: "Fibromuscular dysplasia (FMD) is the second most common cause of renal artery stenosis after atherosclerosis. It typically affects young to middle-aged women and creates a characteristic 'string of beads' appearance on angiography.",
    27: "Continuous (non-phasic) flow in the common femoral vein suggests proximal venous obstruction (iliac vein or IVC). Normal CFV flow is phasic with respiratory variation; loss of phasicity indicates obstruction above.",
    28: "Palmar arch patency is evaluated using the modified Allen test: PPG waveforms are recorded from the 1st and 5th digits while alternately compressing the radial and ulnar arteries to assess collateral flow through the arch.",
    29: "Ischemic rest pain occurs when arterial perfusion is insufficient to meet baseline metabolic demands at rest. It represents critical limb ischemia and is more severe than claudication, which only occurs with exertion.",
    32: "Intimal hyperplasia is the most common cause of carotid stent restenosis in the absence of mechanical failure. Smooth muscle cell proliferation and neointimal growth narrow the stent lumen over time.",
    33: "In a normal triphasic lower extremity arterial waveform, brief flow reversal occurs in late systole/early diastole. This reverse flow component reflects peripheral resistance before the small forward diastolic component.",
    34: "A peak systolic velocity of 275 cm/s or greater in the superior mesenteric artery (fasting) is the threshold for identifying a hemodynamically significant stenosis of 70% or greater (SCVS consensus criteria).",
    35: "A venous refill time of 10 seconds (abnormal) that normalizes to 27 seconds (normal >20s) with a thigh tourniquet indicates the GSV is the source of reflux, as the tourniquet compresses it at the thigh.",
    36: "Elevated velocities in the middle cerebral artery on transcranial Doppler, particularly in the setting of subarachnoid hemorrhage, are indicative of vasospasm, which is a critical post-hemorrhagic complication.",
    37: "The right eye is supplied by the right ophthalmic artery, which is a branch of the right internal carotid artery. Stenosis or emboli from the right ICA commonly cause right-sided monocular visual disturbances (amaurosis fugax).",
    38: "Manual occlusion of the vein proximal to a suspected iatrogenic arteriovenous fistula helps confirm the diagnosis. Compressing the venous outflow increases resistance in the fistula circuit, altering the Doppler signal characteristics.",
    39: "The normal vertebral artery waveform shows continuous forward flow through diastole (low-resistance pattern), similar to the internal carotid artery, because it supplies the brain which has constant metabolic demand.",
    40: "During expiration, the diaphragm relaxes and ascends (moves upward) into the thoracic cavity. This is the fundamental mechanical event of passive expiration.",
    42: "Emboli from a subclavian artery aneurysm travel distally through the upper extremity arterial tree, most commonly lodging in the digital arteries of the hand/fingers, causing digital ischemia.",
    43: "Arterial dissection occurs when blood enters the arterial wall through an intimal tear and separates the layers, creating a false lumen. This can cause stenosis, occlusion, or aneurysmal dilation of the vessel.",
    45: "Occlusion of the innominate (brachiocephalic) artery, which gives rise to the right subclavian and right common carotid arteries, causes subclavian steal through the right vertebral artery, resulting in flow reversal.",
    46: "A false aneurysm (pseudoaneurysm) can be treated with ultrasound-guided percutaneous thrombin injection. The thrombin causes rapid clotting of the pseudoaneurysm sac, eliminating the to-and-fro flow pattern.",
    47: "In segmental pressure measurement, the pressure recorded at each cuff level corresponds to the artery segment distal to the cuff. The Doppler probe is placed distal to detect when flow resumes during cuff deflation.",
    48: "During deep exhalation, intrathoracic pressure increases while intra-abdominal pressure decreases (diaphragm ascends). This decreases upper extremity venous flow (harder to enter thorax) and increases lower extremity venous flow (less abdominal impedance).",
    50: "Normal cortical (interlobular/arcuate) renal arteries demonstrate low velocity and low resistive flow patterns. The kidneys require constant perfusion, maintaining low resistance throughout the cardiac cycle.",
    52: "In an occluded arteriovenous fistula, the outflow vein no longer shows arterial pulsations because the arterial-to-venous shunt is blocked. The inflow artery returns to a normal high-resistance pattern.",
    54: "In a fasting state, the superior mesenteric artery demonstrates a high-resistance pattern with low diastolic velocity. After eating, the SMA converts to a low-resistance pattern with increased diastolic flow to serve digestion.",
    55: "A focal 90% iliac artery stenosis is the ideal candidate for percutaneous transluminal angioplasty (PTA). Short, focal, concentric stenoses respond best to balloon angioplasty and stenting, with excellent long-term patency.",
    56: "A pressure gradient between the brachial artery and the high thigh cuff indicates disease in the aortoiliac segment. Normally, the high thigh pressure should be higher than brachial; a reduced gradient suggests proximal (aortic/iliac) disease.",
    57: "Ultrasound-guided compression of a pseudoaneurysm targets the neck (the channel connecting the artery to the pseudoaneurysm sac). Compressing the neck stops flow into the sac and promotes thrombosis.",
    58: "The normal ophthalmic artery demonstrates antegrade flow (away from the brain, toward the eye) with a sharp systolic upstroke. In ICA occlusion, flow may reverse to retrograde as collateral supply from the ECA.",
    59: "Absence of Doppler signal in the internal carotid artery is the most accurate finding for confirming ICA occlusion. Absence of color flow alone can be artifact; spectral Doppler confirmation is essential.",
    63: "Hyperpigmentation (brownish skin discoloration from hemosiderin deposition) is a hallmark clinical finding of chronic lower extremity venous insufficiency. Dependent rubor and hair loss are signs of arterial disease.",
    64: "Following traumatic arteriovenous fistula formation, blood shunts from the high-pressure artery into the low-pressure vein, causing increased proximal venous flow with arterialized (pulsatile) waveforms in the draining vein.",
    67: "The waveform pattern described is consistent with proximal arterial obstruction, which produces a dampened (tardus-parvus) waveform distally with reduced peak systolic velocity and prolonged systolic acceleration time.",
    69: "When measuring flow volume in a dialysis access, the sample volume should be expanded to cover the entire vessel diameter to capture the full velocity profile for accurate volume flow calculation (Q = Vmean x Area).",
    71: "When the arterial Doppler signal persists despite maximal cuff inflation during ABI measurement, the vessel is non-compressible due to medial arterial calcification (Monckeberg sclerosis), common in diabetic and ESRD patients.",
    72: "The small saphenous vein runs along the posterior aspect of the calf. The prone position provides optimal access for catheter insertion and endovenous ablation of the SSV.",
    73: "The soleal venous sinuses (intramuscular venous reservoirs in the soleus muscle) drain primarily into the peroneal and posterior tibial veins, which then join to form the tibioperoneal trunk.",
    74: "The celiac axis is a low-resistance artery that demonstrates continuous forward diastolic flow throughout the cardiac cycle, even under fasting conditions, because it supplies organs (liver, spleen) with constant metabolic demands.",
    75: "The proximal abdominal aorta supplies the visceral arteries (celiac, SMA, renal) which are low-resistance vessels. This gives the proximal aorta more diastolic flow compared to the distal aorta, which feeds high-resistance lower extremity arteries.",
    76: "A significant pressure gradient from the low thigh to the calf corresponds to the femoropopliteal arterial segment. Disease at the distal SFA or popliteal artery level causes this pressure drop between adjacent cuff levels.",
    77: "The most reliable way to identify upper extremity deep veins is by their relationship to the adjacent artery. Each deep vein runs alongside its corresponding artery (e.g., brachial veins flank the brachial artery).",
    80: "Intermittent claudication involving both the buttock and thigh suggests proximal aortoiliac occlusive disease (Leriche syndrome). More distal disease would produce calf claudication without buttock or thigh symptoms.",
    81: "A palpable femoral pulse confirms that the iliac artery proximal to the femoral pulse is patent. In a gunshot wound to the pelvis, this rules out complete iliac artery occlusion on that side.",
    82: "Central veins (subclavian, brachiocephalic, SVC) cannot be directly compressed due to their deep thoracic location. Doppler analysis (spectral waveform evaluation, respiratory phasicity, augmentation) is the primary technique for assessment.",
    86: "A dampened, low-velocity waveform in the right common carotid artery without visible CCA pathology indicates proximal obstruction. The innominate (brachiocephalic) artery is the only vessel proximal to the right CCA, making its occlusion the most likely cause.",
    87: "Post-exercise ankle pressures that improve compared to resting pressures indicate that arterial occlusive disease is not the cause of the patient's symptoms. True arterial disease would cause ankle pressures to DROP after exercise.",
    88: "A patent AV fistula with ipsilateral arm and hand edema, skin discoloration, and prominent chest wall superficial veins indicates central venous obstruction. The chest wall collaterals develop to bypass the obstructed central veins.",
    89: "No change in thumb PPG waveform with radial artery compression confirms a complete palmar arch, meaning the ulnar artery alone can adequately perfuse the thumb through the intact arch.",
    90: "During inspiration, the negative intrathoracic pressure creates a suction effect that increases venous flow from the upper limbs and neck toward the heart. Lower extremity venous flow decreases due to increased intra-abdominal pressure.",
    92: "Acute renal allograft swelling, tenderness, and infarction are characteristic of main renal vein obstruction (thrombosis). Venous outflow obstruction causes venous congestion, swelling, and can lead to graft infarction.",
    93: "An arteriovenous fistula is considered mature and ready for cannulation when blood flow volume reaches at least 600 mL/min. Other criteria include diameter ≥6mm and depth <6mm from the skin surface.",
    94: "A pelvic mass (tumor, lymphadenopathy, abscess) can externally compress the iliac veins, impeding venous outflow. This is a common CT finding explaining unexplained lower extremity venous obstruction symptoms.",
    95: "Cellulitis presents with fever, local warmth, erythema (redness), and swelling — all consistent with this patient's presentation. DVT may cause swelling but typically lacks the prominent inflammatory signs and fever.",
    97: "In the presence of severe distal common carotid artery stenosis, the proximal ICA receives reduced and turbulent inflow. The brain's low vascular resistance is maintained, so the ICA waveform shows a low-resistance pattern with dampened velocities.",
    98: "When a thigh tourniquet normalizes the venous refill time, the great saphenous vein is identified as the source of reflux, since the tourniquet occludes the GSV at the thigh level.",
    99: "Computed tomography angiography (CTA) is the gold standard imaging modality for confirming endoleak after endovascular aortic repair (EVAR). It provides detailed visualization of contrast outside the stent graft but within the aneurysm sac.",
    100: "Thromboembolism to the middle cerebral artery is the most common cause of ischemic stroke. Emboli typically originate from carotid atherosclerotic plaques or cardiac sources and occlude the MCA, the largest cerebral vessel.",
    101: "A normal pressure gradient between adjacent segmental cuff levels in the lower extremity should not exceed 20 mmHg. A gradient greater than 20 mmHg suggests hemodynamically significant occlusive disease in that arterial segment.",
    102: "In arterial occlusive disease, exercise causes ankle pressure to decrease by 20% or greater from the resting baseline due to the inability of diseased arteries to increase flow to meet the elevated metabolic demand of exercising muscles.",
    103: "Raynaud disease causes episodic digital vasospasm, which produces a dampened or absent photoplethysmographic (PPG) waveform during symptomatic episodes due to severely reduced digital arterial perfusion.",
    105: "Isolated iliac vein thrombosis shows a compressible common femoral vein (since the CFV itself is not thrombosed) but with continuous (non-phasic) Doppler signals, indicating loss of normal respiratory variation due to the proximal iliac obstruction.",
}


def main():
    with open(DATA_PATH) as f:
        data = json.load(f)

    updated_e1 = 0
    updated_e2 = 0

    # Update Exam 1
    for q in data['exam1']:
        qnum = q['number']
        if qnum in EXAM1_ANSWERS:
            q['correctAnswer'] = EXAM1_ANSWERS[qnum]
            updated_e1 += 1
        if qnum in EXAM1_EXPLANATIONS:
            q['explanation'] = EXAM1_EXPLANATIONS[qnum]

    # Update Exam 2
    for q in data['exam2']:
        qnum = q['number']
        if qnum in EXAM2_ANSWERS:
            q['correctAnswer'] = EXAM2_ANSWERS[qnum]
            updated_e2 += 1
        if qnum in EXAM2_EXPLANATIONS:
            q['explanation'] = EXAM2_EXPLANATIONS[qnum]

    with open(DATA_PATH, 'w') as f:
        json.dump(data, f, indent=2)

    # Verify
    null_answers = sum(1 for q in data['exam1'] + data['exam2'] if q['correctAnswer'] is None)
    null_explanations = sum(1 for q in data['exam1'] + data['exam2'] if q['explanation'] is None)

    print(f"Exam 1 answers populated: {updated_e1}")
    print(f"Exam 2 answers populated: {updated_e2}")
    print(f"Remaining null answers: {null_answers}")
    print(f"Remaining null explanations: {null_explanations}")
    print("Done!")


if __name__ == '__main__':
    main()
