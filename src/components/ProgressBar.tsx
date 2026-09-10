interface ProgressBarProps {
  progress: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
}

export default function ProgressBar({
  progress,
  label,
  size = 'md',
  showPercentage = true,
}: ProgressBarProps) {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between mb-2">
          {label && <span className={`font-semibold ${textSizes[size]}`}>{label}</span>}
          {showPercentage && <span className={`text-wellness-600 font-bold ${textSizes[size]}`}>{Math.round(progress)}%</span>}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`bg-gradient-to-r from-wellness-400 to-wellness-600 h-full rounded-full transition-all duration-300 ${sizeClasses[size]}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}
