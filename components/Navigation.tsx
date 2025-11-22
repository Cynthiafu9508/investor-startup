import React from 'react';
import { OracleMode } from '../types';
import { Home, Zap, Users, Clock, Eye, Sparkles } from 'lucide-react';

interface NavigationProps {
  currentMode: OracleMode;
  setMode: (mode: OracleMode) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentMode, setMode }) => {
  const navItems = [
    { mode: OracleMode.HOME, icon: <Home size={20} />, label: "Home" },
    { mode: OracleMode.NAMING, icon: <Zap size={20} />, label: "起名" },
    { mode: OracleMode.PARTNERS, icon: <Users size={20} />, label: "合伙" },
    { mode: OracleMode.TIMING, icon: <Clock size={20} />, label: "择时" },
    { mode: OracleMode.FENGSHUI, icon: <Eye size={20} />, label: "风水" },
    { mode: OracleMode.DIVINATION, icon: <Sparkles size={20} />, label: "卜卦" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-950 border-t border-green-900 z-50 pb-safe">
      <div className="flex justify-around items-center p-2 overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.mode}
            onClick={() => setMode(item.mode)}
            className={`flex flex-col items-center p-2 min-w-[60px] transition-colors ${
              currentMode === item.mode 
                ? 'text-green-400 neon-text' 
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            {item.icon}
            <span className="text-[10px] uppercase font-mono mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};