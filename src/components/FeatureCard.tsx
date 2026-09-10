import { CheckCircle2 } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  onClick?: () => void;
  isActive?: boolean;
  isCompleted?: boolean;
}

export default function FeatureCard({
  title,
  description,
  icon,
  onClick,
  isActive,
  isCompleted,
}: FeatureCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-xl transition-all transform hover:scale-105 cursor-pointer ${
        isActive
          ? 'bg-gradient-to-br from-wellness-400 to-wellness-600 text-white shadow-lg ring-2 ring-wellness-300'
          : 'bg-white border-2 border-gray-200 hover:border-wellness-300 hover:shadow-md'
      } ${isCompleted ? 'ring-2 ring-green-500' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-4xl md:text-5xl">{icon}</span>
        {isCompleted && <CheckCircle2 size={28} className="text-green-500" />}
      </div>
      <h3 className="text-lg md:text-xl font-bold mb-2">{title}</h3>
      <p className={`${isActive ? 'text-white text-opacity-90' : 'text-gray-600'} text-sm md:text-base`}>
        {description}
      </p>
    </div>
  );
}
