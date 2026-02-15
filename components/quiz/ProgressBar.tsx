interface ProgressBarProps {
  current: number;
  total: number;
  correct: number;
}

export default function ProgressBar({ current, total, correct }: ProgressBarProps) {
  const progress = (current / total) * 100;
  const accuracy = current > 0 ? (correct / current) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Progress: {current}/{total}</span>
        <span>Correct: {correct}/{current} ({Math.round(accuracy)}%)</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
