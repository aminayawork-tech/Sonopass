// Real registry pace: SPI is 110 questions in 2 hours, RVT about 170 in 3 hours.
const REGISTRY_PACE: Record<string, { questions: number; minutes: number; label: string }> = {
  spi: { questions: 110, minutes: 120, label: 'SPI: 110 questions in 2 hours' },
  vascular: { questions: 170, minutes: 180, label: 'RVT: 170 questions in 3 hours' },
};

const SPECIALTY_PACE = { questions: 170, minutes: 180, label: 'ARDMS specialty exam: 170 questions in 3 hours' };
for (const id of ['abdomen', 'obgyn', 'cardiac', 'breast', 'pediatric', 'fetal-echo', 'msk']) {
  REGISTRY_PACE[id] = SPECIALTY_PACE;
}

export function registryPace(modality?: string) {
  return REGISTRY_PACE[modality ?? ''] ?? null;
}

export function timeLimitSeconds(questionCount: number, modality?: string): number {
  const pace = registryPace(modality);
  const minutesPerQuestion = pace ? pace.minutes / pace.questions : 1;
  return Math.ceil(questionCount * minutesPerQuestion) * 60;
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(sec).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.round(totalSeconds / 60);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export interface ExamSession {
  order: string[];
  answers: Record<string, string>;
  flagged: string[];
  timed: boolean;
  startedAt: number;
  endsAt: number | null;
  currentIndex: number;
  furthestIndex?: number;
}

const key = (modality?: string, examId?: string) => `sonopass_exam_session_${modality ?? 'default'}_${examId ?? 'exam'}`;

export function loadExamSession(modality?: string, examId?: string): ExamSession | null {
  try {
    const raw = localStorage.getItem(key(modality, examId));
    return raw ? (JSON.parse(raw) as ExamSession) : null;
  } catch {
    return null;
  }
}

export function saveExamSession(session: ExamSession, modality?: string, examId?: string) {
  try {
    localStorage.setItem(key(modality, examId), JSON.stringify(session));
  } catch {
    // storage full or unavailable; the exam still works without resume
  }
}

export function clearExamSession(modality?: string, examId?: string) {
  try {
    localStorage.removeItem(key(modality, examId));
  } catch {
    // ignore
  }
}
