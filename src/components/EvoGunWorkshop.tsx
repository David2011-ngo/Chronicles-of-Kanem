import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  Layers, 
  Volume2, 
  Award, 
  ChevronRight, 
  ShieldAlert, 
  Zap, 
  Eye, 
  Crosshair 
} from 'lucide-react';
import { EVO_GUNS } from '../data/weaponsData';
import { EvoGun, EvoGunTier } from '../types';

export const EvoGunWorkshop: React.FC = () => {
  const [selectedGun, setSelectedGun] = useState<EvoGun>(EVO_GUNS[0]);
  const [currentTierLevel, setCurrentTierLevel] = useState<number>(7);
  const [isFiringVfxActive, setIsFiringVfxActive] = useState<boolean>(false);
  const [showKillBannerPreview, setShowKillBannerPreview] = useState<boolean>(false);

  const activeTier: EvoGunTier = selectedGun.tiers[currentTierLevel - 1] || selectedGun.tiers[0];

  const handleTestFiring = () => {
    setIsFiringVfxActive(true);
    setTimeout(() => setIsFiringVfxActive(false), 900);
  };

  const handleTriggerKillBanner = () => {
    setShowKillBannerPreview(true);
    setTimeout(() => setShowKillBannerPreview(false), 3000);
  };

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-5">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-lg text-slate-100">
              Evo Gun 7-Tier Evolution Workshop & VFX Preview
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              LEVEL 1 TO 7 PROGRESSIVE 3D GEOMETRY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Test progressive visual geometry, custom firing muzzle VFX, personalized kill broadcast banners, and exclusive emotes.
          </p>
        </div>

        {/* Gun Selector */}
        <div className="flex items-center space-x-2">
          {EVO_GUNS.map(gun => (
            <button
              key={gun.id}
              onClick={() => {
                setSelectedGun(gun);
                setCurrentTierLevel(7);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedGun.id === gun.id
                  ? 'bg-amber-500 text-black font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {gun.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Visualizer Mock Stage & Weapon Rendering Showcase */}
      <div className="relative h-64 rounded-xl overflow-hidden border border-slate-800 bg-gradient-to-b from-[#080d1a] to-[#121927] flex items-center justify-center shadow-2xl">
        {/* Animated Background Aura Particles */}
        <div 
          className="absolute inset-0 opacity-25 pointer-events-none transition-all duration-700"
          style={{
            background: `radial-gradient(circle at center, ${selectedGun.accentColor} 0%, transparent 70%)`
          }}
        />

        {/* Weapon Model Visual Representation */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            {/* Visual Weapon Frame */}
            <div 
              className={`w-80 h-28 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 relative overflow-hidden backdrop-blur-md ${
                currentTierLevel >= 6 
                  ? 'shadow-2xl shadow-cyan-500/30 border-cyan-400 bg-slate-900/90' 
                  : 'border-slate-700 bg-slate-950/80'
              }`}
              style={{
                borderColor: currentTierLevel >= 6 ? selectedGun.accentColor : undefined
              }}
            >
              {/* Progressive Geometry Visual Layers */}
              <div className="text-center p-3">
                <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 block mb-1">
                  {selectedGun.elementTheme}
                </span>
                <span className="font-display font-black text-xl text-slate-100 tracking-wide">
                  {selectedGun.name}
                </span>
                <span className="text-xs font-mono font-bold block mt-1" style={{ color: selectedGun.accentColor }}>
                  {activeTier.visualUnlock}
                </span>
              </div>

              {/* Muzzle Flash VFX Simulation */}
              {isFiringVfxActive && (
                <div 
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full blur-sm animate-ping"
                  style={{ backgroundColor: selectedGun.accentColor }}
                />
              )}

              {/* Wings / Horns Decorator for High Tiers */}
              {currentTierLevel >= 3 && (
                <div 
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider"
                  style={{ backgroundColor: selectedGun.accentColor, color: '#000' }}
                >
                  ✦ {currentTierLevel >= 6 ? 'ALPHA MORPH WINGS ACTIVE' : 'DRAGON WINGS SPROUTED'} ✦
                </div>
              )}
            </div>
          </div>

          {/* Level Badge */}
          <div className="mt-3 flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-950 border border-slate-700 text-slate-200">
              LEVEL {currentTierLevel} / {selectedGun.maxLevel} : {activeTier.title}
            </span>
          </div>
        </div>

        {/* Global Kill Broadcast Banner Preview Overlay */}
        {showKillBannerPreview && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 animate-bounce">
            <div 
              className="px-6 py-2.5 rounded-lg border shadow-2xl flex items-center space-x-3 text-black font-bold font-display tracking-wider text-sm"
              style={{
                backgroundColor: selectedGun.accentColor,
                borderColor: '#ffffff',
                boxShadow: `0 0 25px ${selectedGun.accentColor}`
              }}
            >
              <SkullIcon className="w-5 h-5" />
              <span>APEX KILL // [YOU] ELIMINATED ENEMY WITH {selectedGun.name}</span>
            </div>
          </div>
        )}

        {/* Action Buttons Inside Visualizer */}
        <div className="absolute bottom-3 right-3 flex items-center space-x-2 z-20">
          <button
            id="test-firing-vfx-btn"
            onClick={handleTestFiring}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-mono border border-slate-700 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Test Firing VFX</span>
          </button>
          <button
            id="test-kill-banner-btn"
            onClick={handleTriggerKillBanner}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-mono border border-slate-700 transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Kill Banner</span>
          </button>
        </div>
      </div>

      {/* Tier Selector Steps (Levels 1 to 7) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase text-slate-400 font-bold">
            Select Evolution Level (1 to 7)
          </span>
          <span className="text-xs font-mono text-amber-400">
            Current Tier: Level {currentTierLevel}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {selectedGun.tiers.map(tier => {
            const isSelected = currentTierLevel === tier.level;
            return (
              <button
                key={tier.level}
                onClick={() => setCurrentTierLevel(tier.level)}
                className={`py-2 px-1 rounded-lg border text-center transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-[10px] block font-mono">LVL</span>
                <span className="text-base font-display font-black block leading-tight">{tier.level}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tier Detailed Specs Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="space-y-3">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">TIER ATTRIBUTES & STAT BUFFS</span>
            <span className="text-sm font-bold text-amber-400 font-mono block mt-0.5">
              {activeTier.statBuffs}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">VISUAL MESH UNLOCK</span>
            <p className="text-xs text-slate-300 mt-0.5">{activeTier.visualUnlock}</p>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">KEY PROGRESSIVE FEATURES</span>
            <ul className="mt-1 space-y-1">
              {activeTier.features.map((feat, idx) => (
                <li key={idx} className="text-xs text-slate-400 flex items-start space-x-1.5">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-3 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">KILL BROADCAST BANNER SPEC</span>
            <p className="text-xs text-sky-300 font-mono mt-0.5">{activeTier.killBannerVfx}</p>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">EXCLUSIVE VICTORY EMOTE</span>
            <p className="text-xs text-emerald-300 font-mono mt-0.5">{activeTier.exclusiveEmote}</p>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 text-xs font-mono text-slate-400">
            <span className="text-slate-300 font-bold block mb-1">Upgrade Tokens Economy:</span>
            <span>Evolving from Level 1 to 7 requires 1,450 Draco Dragon Tokens, obtainable through weekly Master Pass crates or direct store bundles.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkullIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 10h.01M15 10h.01M12 2a8 8 0 0 0-8 8v1a4 4 0 0 0 3 3.87V17a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2.13A4 4 0 0 0 20 11v-1a8 8 0 0 0-8-8z"/>
    <path d="M9 22v-3M15 22v-3M12 15v3"/>
  </svg>
);
