interface HeroProps {
  title: string;
  subtitle: string;
  emoji: string;
  ctaLabel?: string;
  onCTA?: () => void;
  gradient?: string;
}

export default function Hero({ title, subtitle, emoji, ctaLabel, onCTA, gradient = 'from-wellness-400 to-wellness-600' }: HeroProps) {
  return (
    <div className={`bg-gradient-to-r ${gradient} text-white py-16 md:py-24 px-4 rounded-2xl text-center`}>
      <div className="text-6xl md:text-8xl mb-6 animate-float">{emoji}</div>
      <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
      <p className="text-lg md:text-2xl text-white text-opacity-90 mb-8 max-w-2xl mx-auto">{subtitle}</p>
      {ctaLabel && onCTA && (
        <button
          onClick={onCTA}
          className="bg-white text-wellness-600 hover:bg-gray-100 font-bold py-3 md:py-4 px-8 md:px-10 rounded-lg transition-all text-lg md:text-xl"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
