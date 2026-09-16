import React, { useState } from 'react';
import { CharacterId } from '../game/types';
import { CHARACTERS, BERMUDA_POIS, WEAPONS } from '../game/constants';
import { Zap, Shield, Play, Flame, Crosshair, Award, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface LobbyScreenProps {
  onStartMatch: (selectedChar: CharacterId) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  onStartMatch,
  isMuted,
  onToggleMute
}) => {
  const [selectedChar, setSelectedChar] = useState<CharacterId>('alok');
  const currentChar = CHARACTERS[selectedChar];

  return (
    <div id="ff-lobby-screen" className="relative w-full h-full min-h-screen bg-[#080d16] text-white flex flex-col justify-between p-4 sm:p-8 overflow-y-auto">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER */}
      <header className="relative z-10 flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20 font-black text-slate-950 text-xl tracking-tighter">
            FF
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent">
              FREE FIRE BATTLE ROYALE
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span>Bermuda Island</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span>50 Players Match</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-emerald-400 font-semibold">Live Simulation</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMute}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 my-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* CHARACTER SELECTION (LEFT 7 COLS) */}
        <section className="lg:col-span-7 flex flex-col justify-between bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Select Character & Active Skill
              </h2>
              <span className="text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                {currentChar.skillType.toUpperCase()} SKILL
              </span>
            </div>

            {/* Character Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
              {(Object.keys(CHARACTERS) as CharacterId[]).map((cId) => {
                const char = CHARACTERS[cId];
                const isSelected = selectedChar === cId;
                return (
                  <button
                    key={cId}
                    onClick={() => setSelectedChar(cId)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all relative overflow-hidden ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/10 scale-102'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm mb-2 ${
                        isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {char.name[0]}
                      </div>
                      <div className="font-bold text-sm text-white truncate">{char.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{char.skillName}</div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Character Profile Banner */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-amber-400 uppercase">{currentChar.title}</div>
                <h3 className="text-xl font-black text-white">{currentChar.name}</h3>
                <div className="text-xs text-slate-300 mt-1 max-w-md leading-relaxed">
                  {currentChar.description}
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <span className="text-[11px] text-slate-400 font-mono">Cooldown</span>
                <span className="text-lg font-black font-mono text-cyan-400">
                  {currentChar.cooldown > 0 ? `${currentChar.cooldown}s` : 'Passive'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Controls Cheat Sheet */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Controls & Hotkeys</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Move</span>
                <span className="font-mono text-amber-400 font-bold">W A S D</span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Shoot</span>
                <span className="font-mono text-amber-400 font-bold">L-Click</span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Gloo Wall</span>
                <span className="font-mono text-blue-400 font-bold">[G]</span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Active Skill</span>
                <span className="font-mono text-cyan-400 font-bold">[F]</span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Medkit (75HP)</span>
                <span className="font-mono text-emerald-400 font-bold">[4]</span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Reload</span>
                <span className="font-mono text-amber-400 font-bold">[R]</span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Weapons</span>
                <span className="font-mono text-amber-400 font-bold">[1] [2]</span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Scope Zoom</span>
                <span className="font-mono text-purple-400 font-bold">RMB / Shift</span>
              </div>
            </div>
          </div>
        </section>

        {/* BERMUDA MAP & LOADOUT (RIGHT 5 COLS) */}
        <section className="lg:col-span-5 flex flex-col justify-between bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-red-400" /> Match Briefing & POIs
              </h2>
              <span className="text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                50 SURVIVORS
              </span>
            </div>

            {/* POI Hotspots */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 mb-4">
              <div className="text-xs font-bold text-slate-300 mb-2">Bermuda Hot Drop Zones:</div>
              <div className="flex flex-wrap gap-1.5">
                {BERMUDA_POIS.slice(0, 6).map((poi) => (
                  <span
                    key={poi.name}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-mono font-medium flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: poi.color }} />
                    {poi.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Starting Gear */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 mb-4">
              <div className="text-xs font-bold text-slate-300 mb-2">Starting Armament:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div>
                    <div className="font-bold text-white">{WEAPONS.ak47.name}</div>
                    <div className="text-[10px] text-slate-400">Assault Rifle</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div>
                    <div className="font-bold text-white">{WEAPONS.mp40.name}</div>
                    <div className="text-[10px] text-slate-400">Rapid SMG</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  <div>
                    <div className="font-bold text-white">3x Gloo Wall</div>
                    <div className="text-[10px] text-slate-400">Instant Ice Cover</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <div>
                    <div className="font-bold text-white">2x Medkit</div>
                    <div className="text-[10px] text-slate-400">+75 HP / kit</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* START MATCH BUTTON */}
          <button
            id="start-match-btn"
            onClick={() => onStartMatch(selectedChar)}
            className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-lg tracking-wider uppercase flex items-center justify-center gap-3 shadow-xl shadow-amber-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-6 h-6 fill-slate-950" />
            START BERMUDA MATCH (50 PLAYERS)
          </button>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div>Free Fire Battle Royale Simulator • WebGL Canvas Tactical Shooter</div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Safe Zone Shrinking</span>
          <span>•</span>
          <span>Red Headshot Damage</span>
          <span>•</span>
          <span>Dynamic Gloo Walls</span>
        </div>
      </footer>
    </div>
  );
};
