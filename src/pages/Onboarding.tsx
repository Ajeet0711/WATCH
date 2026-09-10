import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import FeatureCard from '../components/FeatureCard.tsx';
import { COMPANION_OPTIONS } from '../data/companions.ts';
import { getAppState, saveAppState } from '../utils/localStorage.ts';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    companion: 'butterfly',
    interactionMode: 'touch',
  });

  const state = getAppState();
  if (state.user.hasCompletedOnboarding) {
    navigate('/dashboard');
    return null;
  }

  const handleNext = () => {
    if (step === 1 && !formData.name.trim()) return;
    if (step < 4) setStep(step + 1);
  };

  const handleComplete = () => {
    const updatedState = {
      ...state,
      user: {
        ...state.user,
        name: formData.name || 'Patient',
        hasCompletedOnboarding: true,
        interactionMode: formData.interactionMode as 'voice' | 'touch',
      },
      companion: {
        ...state.companion,
        type: formData.companion as 'butterfly' | 'plant' | 'phoenix' | 'pet',
      },
    };
    saveAppState(updatedState);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-wellness-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="flex justify-between items-center mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex items-center ${i < 4 ? 'flex-1' : ''}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                  step >= i ? 'bg-wellness-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                {i}
              </div>
              {i < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 ${step > i ? 'bg-wellness-500' : 'bg-gray-300'}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="text-center">
            <div className="text-6xl mb-6 animate-float">👋</div>
            <h2 className="text-3xl md:text-4xl font-bold text-wellness-700 mb-4">Welcome!</h2>
            <p className="text-lg text-gray-600 mb-8">What should we call you?</p>
            <input
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-6 py-4 border-2 border-wellness-300 rounded-lg text-lg mb-6 focus:outline-none focus:border-wellness-500"
            />
            <button
              onClick={handleNext}
              className="w-full bg-wellness-500 hover:bg-wellness-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 text-lg transition-all"
            >
              Next <ChevronRight size={24} />
            </button>
          </div>
        )}

        {/* Step 2: Companion Selection */}
        {step === 2 && (
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-wellness-700 mb-4 text-center">Choose Your Companion</h2>
            <p className="text-lg text-gray-600 mb-8 text-center">Pick one to grow with you</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {COMPANION_OPTIONS.map((c) => (
                <FeatureCard
                  key={c.id}
                  title={c.name}
                  description={c.description}
                  icon={c.emoji}
                  onClick={() => setFormData({ ...formData, companion: c.id })}
                  isActive={formData.companion === c.id}
                />
              ))}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 bg-wellness-500 hover:bg-wellness-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
              >
                Next <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Interaction Mode */}
        {step === 3 && (
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-wellness-700 mb-4 text-center">How Do You Prefer to Interact?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <FeatureCard
                title="🎤 Voice Assisted"
                description="Use voice commands and audio feedback"
                icon="🎙️"
                onClick={() => setFormData({ ...formData, interactionMode: 'voice' })}
                isActive={formData.interactionMode === 'voice'}
              />
              <FeatureCard
                title="👆 Touch & Tap"
                description="Use taps and touches on screen"
                icon="👆"
                onClick={() => setFormData({ ...formData, interactionMode: 'touch' })}
                isActive={formData.interactionMode === 'touch'}
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 bg-wellness-500 hover:bg-wellness-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
              >
                Next <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Summary */}
        {step === 4 && (
          <div className="text-center">
            <div className="text-6xl mb-6 animate-float">🎉</div>
            <h2 className="text-3xl md:text-4xl font-bold text-wellness-700 mb-8">You're All Set!</h2>
            <div className="bg-white border-2 border-wellness-300 rounded-lg p-8 mb-8 space-y-4">
              <div>
                <p className="text-gray-600">Your Name</p>
                <p className="text-2xl font-bold text-wellness-600">{formData.name || 'Patient'}</p>
              </div>
              <div>
                <p className="text-gray-600">Your Companion</p>
                <p className="text-2xl font-bold text-wellness-600">
                  {COMPANION_OPTIONS.find((c) => c.id === formData.companion)?.name}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Interaction Mode</p>
                <p className="text-2xl font-bold text-wellness-600">
                  {formData.interactionMode === 'voice' ? '🎤 Voice' : '👆 Touch'}
                </p>
              </div>
            </div>
            <button
              onClick={handleComplete}
              className="w-full bg-wellness-500 hover:bg-wellness-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all mb-4"
            >
              Begin My Journey 🦋
            </button>
            <button
              onClick={() => setStep(3)}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
