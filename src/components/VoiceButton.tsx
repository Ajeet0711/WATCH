import { Mic } from 'lucide-react';
import { useState } from 'react';

export default function VoiceButton() {
  const [isListening, setIsListening] = useState(false);

  return (
    <button
      onClick={() => setIsListening(!isListening)}
      className={`p-4 rounded-full text-white font-bold flex items-center gap-2 transition-all ${
        isListening ? 'bg-red-500 ring-4 ring-red-300 animate-pulse' : 'bg-wellness-500 hover:bg-wellness-600'
      }`}
    >
      <Mic size={24} />
      <span className="text-lg">{isListening ? 'Listening...' : 'Tap to Speak'}</span>
    </button>
  );
}
