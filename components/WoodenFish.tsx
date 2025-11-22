
import React, { useState, useEffect } from 'react';
import { WOODEN_FISH_SOUNDS } from '../constants';
import { Coins } from 'lucide-react';

interface WoodenFishProps {
  onDonate: () => void;
}

export const WoodenFish: React.FC<WoodenFishProps> = ({ onDonate }) => {
  const [merit, setMerit] = useState(0);
  const [popups, setPopups] = useState<{id: number, text: string, x: number, y: number}[]>([]);

  const handleClick = (e: React.MouseEvent) => {
    // Increment merit
    setMerit(prev => prev + 1);

    // Add popup
    const text = WOODEN_FISH_SOUNDS[Math.floor(Math.random() * WOODEN_FISH_SOUNDS.length)];
    const id = Date.now();
    
    // Get click position relative to button to center effects somewhat
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;

    setPopups(prev => [...prev, { id, text, x, y }]);

    // Remove popup after animation
    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== id));
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-gray-800 bg-gray-900/50 rounded-lg backdrop-blur-sm relative">
      <h3 className="text-gray-400 mb-4 font-mono text-sm">CYBER MERIT ACCUMULATOR (电子功德)</h3>
      
      <div className="relative mb-4">
        <button 
          onClick={handleClick}
          className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-800 to-black border-4 border-gray-700 active:scale-95 transition-transform flex items-center justify-center shadow-lg group relative overflow-hidden z-10"
        >
          <div className="text-4xl group-active:text-green-400 transition-colors select-none">
            🐟
          </div>
        </button>

        {/* Floating Text */}
        {popups.map(p => (
          <div 
            key={p.id}
            className="absolute pointer-events-none text-green-400 font-bold font-mono animate-fade-up whitespace-nowrap z-20"
            style={{ 
              left: '50%', 
              top: '0', 
              transform: `translate(-50%, -20px)` 
            }}
          >
             {p.text}
          </div>
        ))}
      </div>

      <div className="mb-6 font-mono text-xl text-green-500">
        MERIT: <span className="text-white">{merit}</span>
      </div>

      {/* Donation Button - Preferred Location */}
      <button 
        onClick={onDonate}
        className="flex items-center gap-2 px-4 py-2 bg-yellow-900/20 border border-yellow-600/50 text-yellow-500 text-xs hover:bg-yellow-900/40 transition-all rounded-full hover:scale-105"
      >
        <Coins size={14} />
        <span>随喜功德 (Offer Incense)</span>
      </button>
    </div>
  );
};
