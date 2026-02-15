export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface ExamResult {
  examId: string;
  score: number;
  totalQuestions: number;
  answers: {
    questionId: string;
    selectedAnswer: number;
    correct: boolean;
  }[];
  completedAt: Date;
}

export interface UserProgress {
  totalExamsTaken: number;
  averageScore: number;
  quickTensCompleted: number;
  bestScore: number;
  recentResults: ExamResult[];
}
