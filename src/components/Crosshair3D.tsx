import React from 'react';
import { GameEngine } from '../game/GameEngine';

interface Crosshair3DProps {
  engine: GameEngine;
  isFiring: boolean;
}

export const Crosshair3D: React.FC<Crosshair3DProps> = ({ engine, isFiring }) => {
  const isScoping = engine.player.isScoping;
  const activeWeapon = engine.getActiveWeapon();

  // If in Sniper ADS scope mode, render full tactical sniper overlay
  if (isScoping && (activeWeapon.id === 'awm' || activeWeapon.id === 'ak47')) {
    return (
      <div className="absolute inset-0 pointer-events-none select-none z-20 flex items-center justify-center overflow-hidden">
        {/* Scope Vignette Overlay */}
        <div className="w-[min(88vw,88vh)] h-[min(88vw,88vh)] rounded-full border-[1000px] border-black/95 relative shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] flex items-center justify-center">
          {/* Outer Lens Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-cyan-500/40" />

          {/* Tactical Crosshair Lines */}
          <div className="w-full h-[1.5px] bg-red-500/90 shadow-[0_0_6px_red]" />
          <div className="h-full w-[1.5px] bg-red-500/90 shadow-[0_0_6px_red] absolute" />

          {/* Center Dot */}
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] absolute" />

          {/* Mil-dot Range Ticks */}
          {[-120, -80, -40, 40, 80, 120].map(offset => (
            <React.Fragment key={offset}>
              {/* Horizontal ticks */}
              <div
                className="absolute w-2.5 h-[1px] bg-red-400"
                style={{ transform: `translateX(${offset}px)` }}
              />
              {/* Vertical ticks */}
              <div
                className="absolute h-2.5 w-[1px] bg-red-400"
                style={{ transform: `translateY(${offset}px)` }}
              />
            </React.Fragment>
          ))}

          {/* Scope Optics UI Readout */}
          <div className="absolute top-8 left-16 text-[10px] font-mono text-cyan-400 font-bold tracking-widest uppercase">
            <div>OPTIC: {activeWeapon.id.toUpperCase()} 8X</div>
            <div className="text-amber-400">RNG: 320M</div>
          </div>
          <div className="absolute bottom-8 right-16 text-[10px] font-mono text-cyan-400 font-bold tracking-widest uppercase text-right">
            <div>ELEV: +0.25</div>
            <div className="text-emerald-400">STATUS: LOCKED</div>
          </div>
        </div>
      </div>
    );
  }

  // Standard 3D Third-Person Combat Reticle
  const spread = isFiring ? 14 : 6;

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20 flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* Center Red Dot */}
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />

        {/* 4 Crosshair Bars with Dynamic Spread Bloom */}
        <div
          className="absolute w-3.5 h-[2px] bg-white/90 shadow-sm rounded-sm transition-transform duration-75"
          style={{ transform: `translateX(-${spread + 8}px)` }}
        />
        <div
          className="absolute w-3.5 h-[2px] bg-white/90 shadow-sm rounded-sm transition-transform duration-75"
          style={{ transform: `translateX(${spread + 8}px)` }}
        />
        <div
          className="absolute h-3.5 w-[2px] bg-white/90 shadow-sm rounded-sm transition-transform duration-75"
          style={{ transform: `translateY(-${spread + 8}px)` }}
        />
        <div
          className="absolute h-3.5 w-[2px] bg-white/90 shadow-sm rounded-sm transition-transform duration-75"
          style={{ transform: `translateY(${spread + 8}px)` }}
        />
      </div>
    </div>
  );
};
