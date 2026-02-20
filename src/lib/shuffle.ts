/**
 * Fisher-Yates shuffle — returns a new shuffled array.
 */
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const LETTERS = ['A', 'B', 'C', 'D'];

interface RawOption {
  letter: string;
  text: string;
}

interface RawQuestion {
  id: string;
  number: number;
  question: string;
  options: RawOption[];
  category: string;
  correctAnswer: string | null;
  explanation: string | null;
}

/**
 * Shuffle both the question order and the option order within each question.
 * Re-labels options A/B/C/D in new order and updates correctAnswer to match.
 */
export function shuffleQuestions(questions: RawQuestion[]): RawQuestion[] {
  return shuffle(questions).map(q => {
    const shuffledOpts = shuffle(q.options);
    // Find which new position the correct answer landed in
    const correctIdx = shuffledOpts.findIndex(o => o.letter === q.correctAnswer);
    const newCorrectLetter = correctIdx >= 0 ? LETTERS[correctIdx] : q.correctAnswer;
    // Reassign letters based on new position
    const relabeledOpts = shuffledOpts.map((o, i) => ({
      ...o,
      letter: LETTERS[i],
    }));
    return {
      ...q,
      options: relabeledOpts,
      correctAnswer: newCorrectLetter,
    };
  });
}
