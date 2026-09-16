import React from 'react';
import { DamagePopup } from '../game/types';

interface FloatingDamageTextProps {
  popups: DamagePopup[];
}

export const FloatingDamageText: React.FC<FloatingDamageTextProps> = ({ popups }) => {
  if (popups.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-30 overflow-hidden">
      {popups.slice(0, 8).map((p, idx) => {
        // Stagger popup slightly near center if 3D coordinates are off-screen
        const topPercent = 45 - idx * 3;
        const leftPercent = 50 + (idx % 2 === 0 ? 3 : -3);

        return (
          <div
            key={p.id}
            className={`absolute font-black tracking-tight font-mono transition-all transform -translate-x-1/2 -translate-y-1/2 ${
              p.isHeadshot
                ? 'text-red-500 text-2xl drop-shadow-[0_0_8px_rgba(239,68,68,0.9)] animate-bounce'
                : 'text-amber-300 text-lg drop-shadow-[0_0_4px_rgba(0,0,0,0.8)]'
            }`}
            style={{
              top: `${topPercent}%`,
              left: `${leftPercent}%`,
              opacity: p.alpha
            }}
          >
            {p.isHeadshot ? `★${p.amount}` : p.amount}
          </div>
        );
      })}
    </div>
  );
};
