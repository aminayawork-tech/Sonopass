import { Exam, Question } from '@/lib/types';

// Sample vascular sonography questions - you can replace these with your actual exam questions
export const vascularExams: Exam[] = [
  {
    id: 'vascular-exam-1',
    title: 'Vascular Registry Practice Exam 1',
    description: 'Comprehensive vascular sonography practice exam',
    questions: [
      {
        id: 'q1',
        question: 'What is the normal peak systolic velocity in the internal carotid artery?',
        options: [
          'Less than 50 cm/s',
          '50-125 cm/s',
          '125-230 cm/s',
          'Greater than 230 cm/s'
        ],
        correctAnswer: 1,
        explanation: 'Normal PSV in the ICA is typically 50-125 cm/s. Values above 125 cm/s may indicate stenosis.',
        category: 'Carotid',
        difficulty: 'medium'
      },
      {
        id: 'q2',
        question: 'Which of the following indicates a hemodynamically significant carotid stenosis?',
        options: [
          'PSV > 125 cm/s with ICA/CCA ratio < 2.0',
          'PSV > 230 cm/s with ICA/CCA ratio > 4.0',
          'PSV < 50 cm/s with normal waveform',
          'EDV < 40 cm/s with ICA/CCA ratio < 2.0'
        ],
        correctAnswer: 1,
        explanation: 'A PSV greater than 230 cm/s with an ICA/CCA ratio greater than 4.0 indicates severe (>70%) stenosis.',
        category: 'Carotid',
        difficulty: 'hard'
      },
      {
        id: 'q3',
        question: 'What does the acronym CCA stand for?',
        options: [
          'Central Carotid Artery',
          'Common Carotid Artery',
          'Cerebral Circulation Assessment',
          'Continuous Cardiac Analysis'
        ],
        correctAnswer: 1,
        explanation: 'CCA stands for Common Carotid Artery, which bifurcates into the internal and external carotid arteries.',
        category: 'Anatomy',
        difficulty: 'easy'
      },
      {
        id: 'q4',
        question: 'Which vessel typically has low resistance flow?',
        options: [
          'External Carotid Artery',
          'Superficial Femoral Artery at rest',
          'Internal Carotid Artery',
          'Dorsalis Pedis Artery'
        ],
        correctAnswer: 2,
        explanation: 'The Internal Carotid Artery supplies the brain and demonstrates low resistance, high diastolic flow.',
        category: 'Hemodynamics',
        difficulty: 'medium'
      },
      {
        id: 'q5',
        question: 'What is the normal Ankle-Brachial Index (ABI) range?',
        options: [
          '0.5-0.8',
          '0.9-1.3',
          '1.4-1.8',
          '0.3-0.6'
        ],
        correctAnswer: 1,
        explanation: 'A normal ABI is 0.9-1.3. Values below 0.9 suggest peripheral arterial disease.',
        category: 'Lower Extremity',
        difficulty: 'easy'
      },
      {
        id: 'q6',
        question: 'Spectral broadening in a Doppler waveform indicates:',
        options: [
          'Normal laminar flow',
          'Turbulent flow',
          'Reversed flow',
          'Absent flow'
        ],
        correctAnswer: 1,
        explanation: 'Spectral broadening occurs with turbulent flow, often seen at stenoses or post-stenotic areas.',
        category: 'Doppler Physics',
        difficulty: 'medium'
      },
      {
        id: 'q7',
        question: 'The subclavian steal syndrome involves:',
        options: [
          'Antegrade flow in the vertebral artery',
          'Retrograde flow in the vertebral artery',
          'Occlusion of the carotid artery',
          'Normal flow patterns in all vessels'
        ],
        correctAnswer: 1,
        explanation: 'Subclavian steal shows reversed (retrograde) flow in the vertebral artery due to proximal subclavian stenosis/occlusion.',
        category: 'Cerebrovascular',
        difficulty: 'hard'
      },
      {
        id: 'q8',
        question: 'What is the typical frequency range for vascular ultrasound?',
        options: [
          '1-3 MHz',
          '5-12 MHz',
          '15-20 MHz',
          '20-30 MHz'
        ],
        correctAnswer: 1,
        explanation: 'Vascular ultrasound typically uses 5-12 MHz transducers, balancing penetration and resolution.',
        category: 'Physics',
        difficulty: 'easy'
      },
      {
        id: 'q9',
        question: 'Aliasing in color Doppler occurs when:',
        options: [
          'The PRF is too high',
          'The velocity exceeds the Nyquist limit',
          'The gain is too low',
          'The transducer frequency is incorrect'
        ],
        correctAnswer: 1,
        explanation: 'Aliasing occurs when velocities exceed the Nyquist limit (1/2 the PRF), causing color reversal.',
        category: 'Doppler Physics',
        difficulty: 'medium'
      },
      {
        id: 'q10',
        question: 'The normal direction of flow in the portal vein is:',
        options: [
          'Away from the liver (hepatofugal)',
          'Toward the liver (hepatopetal)',
          'Bidirectional',
          'No flow normally present'
        ],
        correctAnswer: 1,
        explanation: 'Normal portal vein flow is hepatopetal (toward the liver). Hepatofugal flow indicates portal hypertension.',
        category: 'Abdominal Vascular',
        difficulty: 'medium'
      }
    ]
  },
  {
    id: 'vascular-exam-2',
    title: 'Vascular Registry Practice Exam 2',
    description: 'Additional vascular sonography practice questions',
    questions: [
      {
        id: 'q11',
        question: 'What does triphasic flow indicate in a peripheral artery?',
        options: [
          'Severe stenosis',
          'Normal arterial flow',
          'Venous flow pattern',
          'Occluded vessel'
        ],
        correctAnswer: 1,
        explanation: 'Triphasic flow (forward, reverse, forward) is the normal pattern in healthy peripheral arteries at rest.',
        category: 'Lower Extremity',
        difficulty: 'easy'
      },
      {
        id: 'q12',
        question: 'The normal diameter of the abdominal aorta is:',
        options: [
          'Less than 1.5 cm',
          '1.5-2.5 cm',
          '3.0-4.0 cm',
          'Greater than 5.0 cm'
        ],
        correctAnswer: 1,
        explanation: 'The normal abdominal aorta measures 1.5-2.5 cm. Greater than 3.0 cm indicates aneurysm.',
        category: 'Abdominal Vascular',
        difficulty: 'easy'
      },
      {
        id: 'q13',
        question: 'Which of the following best describes the Doppler angle for accurate velocity measurement?',
        options: [
          '90 degrees',
          '0 degrees',
          '45-60 degrees',
          '120 degrees'
        ],
        correctAnswer: 2,
        explanation: 'The optimal Doppler angle is 45-60 degrees. At 90 degrees, no Doppler shift occurs.',
        category: 'Doppler Physics',
        difficulty: 'medium'
      },
      {
        id: 'q14',
        question: 'Deep vein thrombosis is most commonly found in which vein?',
        options: [
          'Greater saphenous vein',
          'Common femoral vein',
          'Popliteal vein',
          'Posterior tibial vein'
        ],
        correctAnswer: 1,
        explanation: 'While DVT can occur in various veins, the common femoral and popliteal veins are most commonly affected.',
        category: 'Venous',
        difficulty: 'medium'
      },
      {
        id: 'q15',
        question: 'What maneuver is used to assess venous competence?',
        options: [
          'Trendelenburg test',
          'Valsalva maneuver',
          'Allen test',
          'Adson maneuver'
        ],
        correctAnswer: 1,
        explanation: 'The Valsalva maneuver increases intra-abdominal pressure to test for venous reflux and valve competence.',
        category: 'Venous',
        difficulty: 'medium'
      }
    ]
  },
  {
    id: 'vascular-exam-3',
    title: 'Vascular Registry Practice Exam 3',
    description: 'Advanced vascular sonography scenarios',
    questions: [
      {
        id: 'q16',
        question: 'Monophasic flow in a lower extremity artery suggests:',
        options: [
          'Normal flow',
          'Proximal stenosis or occlusion',
          'Hyperemia',
          'Athletic conditioning'
        ],
        correctAnswer: 1,
        explanation: 'Monophasic (single forward component) flow suggests proximal disease reducing the normal triphasic pattern.',
        category: 'Lower Extremity',
        difficulty: 'hard'
      },
      {
        id: 'q17',
        question: 'The renal-aortic ratio (RAR) for renal artery stenosis should be:',
        options: [
          'Greater than 3.5',
          'Less than 2.0',
          'Exactly 1.0',
          'Between 2.5-3.0'
        ],
        correctAnswer: 0,
        explanation: 'A RAR (PSV renal artery/PSV aorta) greater than 3.5 indicates hemodynamically significant renal artery stenosis.',
        category: 'Renal Vascular',
        difficulty: 'hard'
      },
      {
        id: 'q18',
        question: 'What is the primary purpose of the augmentation maneuver in venous studies?',
        options: [
          'Assess arterial flow',
          'Check for venous patency and flow',
          'Measure blood pressure',
          'Evaluate valve competence'
        ],
        correctAnswer: 1,
        explanation: 'Augmentation (squeezing distal limb) increases venous flow, helping confirm patency and detect obstruction.',
        category: 'Venous',
        difficulty: 'medium'
      },
      {
        id: 'q19',
        question: 'Tardus parvus waveform indicates:',
        options: [
          'Distal stenosis',
          'Proximal stenosis',
          'Normal flow',
          'Venous obstruction'
        ],
        correctAnswer: 1,
        explanation: 'Tardus parvus (delayed, diminished) waveform is seen distal to a hemodynamically significant proximal stenosis.',
        category: 'Hemodynamics',
        difficulty: 'hard'
      },
      {
        id: 'q20',
        question: 'The wall filter in Doppler ultrasound is used to:',
        options: [
          'Enhance high-velocity signals',
          'Remove low-frequency signals from vessel wall motion',
          'Increase penetration depth',
          'Improve lateral resolution'
        ],
        correctAnswer: 1,
        explanation: 'The wall filter removes low-frequency signals from vessel wall motion and tissue to better display blood flow.',
        category: 'Doppler Physics',
        difficulty: 'medium'
      }
    ]
  }
];

// Function to get random questions for Quick 10 mode
export function getQuick10Questions(): Question[] {
  const allQuestions = vascularExams.flatMap(exam => exam.questions);
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10);
}

// Function to get all questions from a specific exam
export function getExamById(examId: string): Exam | undefined {
  return vascularExams.find(exam => exam.id === examId);
}
