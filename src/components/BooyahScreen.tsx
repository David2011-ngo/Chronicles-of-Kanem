import React from 'react';
import { PlayerStats } from '../game/types';
import { Trophy, Flame, Crosshair, Shield, Heart, Clock, RotateCcw, Home } from 'lucide-react';

interface BooyahScreenProps {
  isBooyah: boolean;
  stats: PlayerStats;
  onPlayAgain: () => void;
  onReturnLobby: () => void;
}

export const BooyahScreen: React.FC<BooyahScreenProps> = ({
  isBooyah,
  stats,
  onPlayAgain,
  onReturnLobby
}) => {
  const minutes = Math.floor(stats.survivalTime / 60);
  const seconds = stats.survivalTime % 60;
  const timeFormatted = `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  const headshotRate = stats.kills > 0 ? Math.round((stats.headshots / stats.kills) * 100) : 0;

  return (
    <div id="ff-booyah-screen" className="absolute inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900/90 border border-slate-700 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        {/* Decorative ambient aura */}
        <div className={`absolute -top-24 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isBooyah ? 'bg-amber-500/25' : 'bg-red-500/15'
        }`} />

        {/* HERO TITLE: BOOYAH! OR DEFEAT */}
        {isBooyah ? (
          <div className="relative mb-6">
            <div className="text-5xl sm:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 drop-shadow-[0_4px_16px_rgba(245,158,11,0.6)] animate-bounce">
              BOOYAH!
            </div>
            <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-300 mt-1 flex items-center justify-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" /> #1 SURVIVOR • BERMUDA CHAMPION
            </div>
          </div>
        ) : (
          <div className="relative mb-6">
            <div className="text-4xl sm:text-5xl font-black italic tracking-tighter text-slate-200 drop-shadow-md">
              MATCH OVER
            </div>
            <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-red-400 mt-1">
              Rank #{stats.rank} / 50 • Better Luck Next Match!
            </div>
          </div>
        )}

        {/* STATS BENTO GRID */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex flex-col items-center">
            <div className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-400" /> Kills
            </div>
            <div className="text-2xl font-black font-mono text-white mt-1">{stats.kills}</div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex flex-col items-center">
            <div className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1">
              <Crosshair className="w-3.5 h-3.5 text-amber-400" /> Headshots
            </div>
            <div className="text-2xl font-black font-mono text-amber-300 mt-1">{stats.headshots}</div>
            <div className="text-[10px] text-slate-500">{headshotRate}% rate</div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex flex-col items-center">
            <div className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-400" /> Survived
            </div>
            <div className="text-xl font-black font-mono text-white mt-1.5">{timeFormatted}</div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex flex-col items-center">
            <div className="text-[11px] font-bold uppercase text-slate-400">Total Damage</div>
            <div className="text-xl font-black font-mono text-cyan-300 mt-1">{stats.damageDealt}</div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex flex-col items-center">
            <div className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-400" /> Gloo Walls
            </div>
            <div className="text-xl font-black font-mono text-blue-300 mt-1">{stats.glooPlaced}</div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex flex-col items-center">
            <div className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-emerald-400" /> Medkits
            </div>
            <div className="text-xl font-black font-mono text-emerald-300 mt-1">{stats.medkitsUsed}</div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            id="play-again-btn"
            onClick={onPlayAgain}
            className="w-full sm:flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-102 active:scale-98"
          >
            <RotateCcw className="w-4 h-4" /> PLAY AGAIN
          </button>
          <button
            id="return-lobby-btn"
            onClick={onReturnLobby}
            className="w-full sm:flex-1 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98"
          >
            <Home className="w-4 h-4" /> LOBBY & HEROES
          </button>
        </div>
      </div>
    </div>
  );
};
