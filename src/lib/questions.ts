export function allQuestions<T = any>(questionsData: Record<string, unknown>): T[] {
  return Object.values(questionsData).filter(Array.isArray).flat() as T[];
}
