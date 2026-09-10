import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero.tsx';
import FeatureCard from '../components/FeatureCard.tsx';
import Companion from '../components/Companion.tsx';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-wellness-50 pt-16 md:pt-20">
      {/* Brand: the name is an acronym, so spell it out on first contact. */}
      <section className="pt-10 pb-2 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-[0.14em] text-wellness-700">WATCH</h1>
        <p className="mt-4 text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
          <span className="font-bold text-wellness-600">W</span>ellness{' '}
          <span className="font-bold text-wellness-600">A</span>nomaly{' '}
          <span className="font-bold text-wellness-600">T</span>racking and{' '}
          <span className="font-bold text-wellness-600">C</span>aregiver{' '}
          <span className="font-bold text-wellness-600">H</span>elp
        </p>
      </section>

      {/*  Hero Section */}
      <Hero
        emoji="🦋"
        title="Train Your Memory. Grow Your Companion."
        subtitle="A cognitive gaming platform designed for elderly patients with accessible, engaging activities"
        ctaLabel="Start My Journey"
        onCTA={() => navigate('/onboarding')}
      />

      {/* How It Works */}
      <section className="py-12 md:py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-wellness-700">How It Works</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { num: '1', icon: '🎯', label: 'Choose Companion' },
            { num: '2', icon: '🧠', label: 'Play Games' },
            { num: '3', icon: '📈', label: 'Grow Together' },
            { num: '4', icon: '🎉', label: 'Share Progress' },
          ].map((step) => (
            <div key={step.num} className="text-center">
              <div className="text-3xl md:text-5xl mb-3">{step.icon}</div>
              <p className="font-bold text-sm md:text-base text-gray-800">{step.label}</p>
              <p className="text-2xl md:text-3xl font-bold text-wellness-400 mt-2">{step.num}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cognitive Games */}
      <section className="py-12 md:py-20 px-4 bg-white max-w-6xl mx-auto w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-wellness-700">Cognitive Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: '🎮', name: 'Memory Match', desc: 'Match card pairs to enhance memory' },
            { icon: '👁️', name: 'Object Recall', desc: 'Remember objects shown briefly' },
            { icon: '🌈', name: 'Pattern Recall', desc: 'Reproduce color sequences' },
            { icon: '⏰', name: 'Routine Recall', desc: 'Arrange daily activities in order' },
          ].map((game) => (
            <FeatureCard key={game.name} title={game.name} description={game.desc} icon={game.icon} />
          ))}
        </div>
      </section>

      {/* Adaptive Metamorphosis */}
      <section className="py-12 md:py-20 px-4 bg-gradient-to-r from-wellness-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-wellness-700">Adaptive Metamorphosis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <Companion type="butterfly" progress={60} size="lg" />
            </div>
            <div>
              <div className="space-y-4">
                {[
                  { stage: '🥚', name: 'Inception', desc: 'Begin your journey (0-24%)' },
                  { stage: '🌱', name: 'Growth', desc: 'Show consistent progress (25-49%)' },
                  { stage: '🦋', name: 'Metamorphosis', desc: 'Beautiful transformation (50-79%)' },
                  { stage: '✨🦋', name: 'Mastery', desc: 'Achieve excellence (80-100%)' },
                ].map((s) => (
                  <div key={s.name} className="flex items-center gap-4 p-3 md:p-4 bg-white rounded-lg">
                    <span className="text-3xl md:text-4xl">{s.stage}</span>
                    <div>
                      <p className="font-bold text-base md:text-lg text-gray-800">{s.name}</p>
                      <p className="text-sm text-gray-600">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NER Accessibility */}
      <section className="py-12 md:py-20 px-4 bg-white max-w-6xl mx-auto w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-wellness-700">Northeast India Focus</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <FeatureCard
            title="🗣️ Multilingual"
            description="Support for English, हिन्दी, অসমীয়া, बाংলा & more"
            icon="🌐"
          />
          <FeatureCard
            title="🎤 Voice-Enabled"
            description="Complete voice interface for comfort and accessibility"
            icon="🎙️"
          />
          <FeatureCard
            title="🎨 Cultural Relevance"
            description="Companions and visuals reflect regional identity"
            icon="🖼️"
          />
          <FeatureCard
            title="📡 Low-Connectivity"
            description="Works smoothly even with poor internet speeds"
            icon="🔌"
          />
        </div>
      </section>

      {/* Caregiver Support */}
      <section className="py-12 md:py-20 px-4 bg-gradient-to-r from-wellness-50 to-green-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-wellness-700">Caregiver Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '📊', name: 'Track Progress', desc: 'Monitor daily gameplay and improvements' },
              { icon: '🎯', name: 'Set Milestones', desc: 'Celebrate when companions evolve' },
              { icon: '🔔', name: 'Get Alerts', desc: 'Receive notifications on activities' },
            ].map((feature) => (
              <FeatureCard key={feature.name} title={feature.name} description={feature.desc} icon={feature.icon} />
            ))}
          </div>
        </div>
      </section>

      {/* Elderly-Friendly Features */}
      <section className="py-12 md:py-20 px-4 bg-white max-w-6xl mx-auto w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-wellness-700">Elderly-Friendly Design</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🔤', name: 'Large Text', desc: 'Easy-to-read font sizes' },
            { icon: '🎯', name: 'Simple Navigation', desc: 'Minimal menus & clear buttons' },
            { icon: '✨', name: 'High Contrast', desc: 'Colors chosen for clarity' },
            { icon: '⏸️', name: 'Pause Anytime', desc: 'Resume games when ready' },
            { icon: '🏆', name: 'Encouragement', desc: 'Positive reinforcement' },
            { icon: '⏰', name: 'Time Tracking', desc: 'Know when to take breaks' },
          ].map((feature) => (
            <FeatureCard key={feature.name} title={feature.name} description={feature.desc} icon={feature.icon} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-r from-wellness-500 to-wellness-600 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Begin your cognitive journey today. Your personalized companion awaits!
        </p>
        <button
          onClick={() => navigate('/onboarding')}
          className="bg-white text-wellness-600 hover:bg-gray-100 font-bold py-3 md:py-4 px-8 md:px-12 rounded-lg transition-all text-lg md:text-xl"
        >
          Start My Journey 🦋
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-8 px-4 text-sm">
        <p className="mb-2">© 2026 WATCH — Wellness Anomaly Tracking and Caregiver Help</p>
        <p>Designed with ❤️ for elderly patients in Northeast India</p>
        <p className="mt-4 text-xs">
          Privacy • Terms • Accessibility | This is a demo prototype for hackathon presentation
        </p>
      </footer>
    </div>
  );
}
