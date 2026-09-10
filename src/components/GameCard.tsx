import { Play, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GameCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: string;
  difficulty?: string;
  isUnlocked?: boolean;
}

export default function GameCard({
  id,
  name,
  description,
  icon,
  duration,
  difficulty,
  isUnlocked = true,
}: GameCardProps) {
  const content = (
    <div className="p-6 rounded-xl bg-white border-2 border-gray-200 hover:border-wellness-400 hover:shadow-lg transition-all h-full flex flex-col">
      <div className="text-5xl md:text-6xl mb-4">{icon}</div>
      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">{name}</h3>
      <p className="text-sm md:text-base text-gray-600 mb-4 flex-1">{description}</p>
      <div className="flex items-center justify-between text-xs md:text-sm text-gray-500 mb-4">
        <span>⏱️ {duration}</span>
        {difficulty && <span className="bg-wellness-100 text-wellness-700 px-2 py-1 rounded">{difficulty}</span>}
      </div>
      <button className="w-full bg-wellness-500 hover:bg-wellness-600 text-white font-bold py-2 md:py-3 rounded-lg flex items-center justify-center gap-2 transition-all text-sm md:text-base">
        <Play size={20} /> Play Game
      </button>
    </div>
  );

  if (!isUnlocked) {
    return (
      <div className="p-6 rounded-xl bg-gray-100 border-2 border-gray-300 opacity-50 h-full flex flex-col relative">
        {content}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-xl">
          <Lock size={48} className="text-gray-700" />
        </div>
      </div>
    );
  }

  return <Link to={`/games/${id}`}>{content}</Link>;
}
