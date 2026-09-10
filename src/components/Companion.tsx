import { getCompanionVisual, calculateCompanionStage, getCompanionStageInfo } from '../utils/companionProgress.ts';
import ProgressBar from './ProgressBar.tsx';

interface CompanionProps {
  type: string;
  progress: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Companion({ type, progress, showLabel = true, size = 'lg' }: CompanionProps) {
  const stage = calculateCompanionStage(progress);
  const stageInfo = getCompanionStageInfo(stage);
  const visual = getCompanionVisual(type, stage);

  const sizeClasses = {
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-8xl',
  };

  const labelSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
  };

  return (
    <div className="text-center">
      <div className={`${sizeClasses[size]} mb-4 animate-float`}>{visual}</div>
      {showLabel && (
        <>
          <p className={`font-bold text-wellness-700 ${labelSizes[size]}`}>{stageInfo.name}</p>
          <p className={`text-gray-600 mb-3 ${labelSizes[size]}`}>{stageInfo.message}</p>
          <ProgressBar progress={progress} showPercentage size={size === 'sm' ? 'sm' : 'md'} />
        </>
      )}
    </div>
  );
}
