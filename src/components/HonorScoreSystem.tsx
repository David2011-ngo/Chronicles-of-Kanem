import React, { useState } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  RotateCcw, 
  ThumbsUp, 
  Slash,
  Lock,
  Unlock,
  Award
} from 'lucide-react';
import { HONOR_SCORE_TIERS } from '../data/economyData';

export const HonorScoreSystem: React.FC = () => {
  const [score, setScore] = useState<number>(100);
  const [actionLog, setActionLog] = useState<string[]>([
    'Account Initialized: Baseline 100 Honor Score. Status: Exemplary.'
  ]);

  const currentTier = HONOR_SCORE_TIERS.find(
    tier => score >= tier.minScore && score <= tier.maxScore
  ) || HONOR_SCORE_TIERS[HONOR_SCORE_TIERS.length - 1];

  const applyPenalty = (amount: number, reason: string) => {
    const newScore = Math.max(0, score - amount);
    setScore(newScore);
    const log = `-${amount} PTS: ${reason}. Current Score: ${newScore}/100.`;
    setActionLog(prev => [log, ...prev.slice(0, 7)]);
  };

  const applyReward = (amount: number, reason: string) => {
    const newScore = Math.min(100, score + amount);
    setScore(newScore);
    const log = `+${amount} PTS: ${reason}. Current Score: ${newScore}/100.`;
    setActionLog(prev => [log, ...prev.slice(0, 7)]);
  };

  const handleReset = () => {
    setScore(100);
    setActionLog(['Reset to 100 Honor Score. Clean standing restored.']);
  };

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-5">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="font-display font-bold text-lg text-slate-100">
              100-Point Behavioral Integrity Honor Score Simulator
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              MATCHMAKING INTEGRITY ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated rating system enforcing matchmaking restrictions against toxicity, AFK abandonment, and griefing.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to 100</span>
        </button>
      </div>

      {/* Main Score Display Gauge Card */}
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          {/* Radial score badge */}
          <div 
            className="w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center shadow-lg transition-all duration-500"
            style={{ borderColor: currentTier.color }}
          >
            <span className="text-3xl font-black font-display" style={{ color: currentTier.color }}>
              {score}
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase">/ 100 PTS</span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold font-display" style={{ color: currentTier.color }}>
                {currentTier.status}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                SCORE RANGE: {currentTier.minScore} - {currentTier.maxScore}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-md font-mono">
              {currentTier.access}
            </p>
            <p className="text-[11px] text-amber-400 mt-0.5">
              Weekly Reward: {currentTier.rewards}
            </p>
          </div>
        </div>

        {/* Status Locks */}
        <div className="flex flex-col space-y-2 w-full md:w-auto text-xs font-mono">
          <div className={`px-3 py-1.5 rounded flex items-center justify-between space-x-3 border ${
            score >= 90 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}>
            <span>Clash Squad Ranked:</span>
            <span className="font-bold">{score >= 90 ? 'UNLOCKED' : 'LOCKED (<90)'}</span>
          </div>

          <div className={`px-3 py-1.5 rounded flex items-center justify-between space-x-3 border ${
            score >= 80 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}>
            <span>Battle Royale Ranked:</span>
            <span className="font-bold">{score >= 80 ? 'UNLOCKED' : 'LOCKED (<80)'}</span>
          </div>

          <div className={`px-3 py-1.5 rounded flex items-center justify-between space-x-3 border ${
            score >= 60 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}>
            <span>Standard Multiplayer:</span>
            <span className="font-bold">{score >= 60 ? 'UNLOCKED' : 'QUARANTINE (<60)'}</span>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Trigger Buttons */}
      <div>
        <span className="text-xs font-mono uppercase text-slate-400 font-bold block mb-2">
          Simulate Behavioral Triggers & Integrity Penalties
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          <button
            onClick={() => applyPenalty(8, 'AFK in Clash Squad Ranked')}
            className="p-2.5 bg-slate-950 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-500/40 rounded-lg text-left transition-colors"
          >
            <span className="text-rose-400 font-bold text-xs block font-mono">-8 PTS</span>
            <span className="text-[11px] text-slate-300 block">AFK in Clash Squad</span>
          </button>

          <button
            onClick={() => applyPenalty(5, 'AFK in Battle Royale')}
            className="p-2.5 bg-slate-950 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-500/40 rounded-lg text-left transition-colors"
          >
            <span className="text-rose-400 font-bold text-xs block font-mono">-5 PTS</span>
            <span className="text-[11px] text-slate-300 block">AFK in BR Match</span>
          </button>

          <button
            onClick={() => applyPenalty(4, 'Toxicity / Verbal Abuse Report')}
            className="p-2.5 bg-slate-950 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-500/40 rounded-lg text-left transition-colors"
          >
            <span className="text-rose-400 font-bold text-xs block font-mono">-4 PTS</span>
            <span className="text-[11px] text-slate-300 block">Toxic Chat Verified</span>
          </button>

          <button
            onClick={() => applyPenalty(10, 'Deliberate Friendly Fire Griefing')}
            className="p-2.5 bg-slate-950 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-500/40 rounded-lg text-left transition-colors"
          >
            <span className="text-rose-400 font-bold text-xs block font-mono">-10 PTS</span>
            <span className="text-[11px] text-slate-300 block">Friendly Fire Grief</span>
          </button>

          <button
            onClick={() => applyReward(2, 'Clean Match Completed Without Report')}
            className="p-2.5 bg-slate-950 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/40 rounded-lg text-left transition-colors"
          >
            <span className="text-emerald-400 font-bold text-xs block font-mono">+2 PTS</span>
            <span className="text-[11px] text-slate-300 block">Clean Match Victory</span>
          </button>
        </div>
      </div>

      {/* Honor Tiers Table & Action History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Tier Tiers Reference */}
        <div className="lg:col-span-7 bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-xs font-mono uppercase text-slate-400 font-bold block mb-2">
            Honor Score Threshold Rules
          </span>
          <div className="space-y-1.5">
            {HONOR_SCORE_TIERS.map(tier => (
              <div 
                key={tier.minScore}
                className="flex items-center justify-between p-2 rounded text-xs bg-slate-900/60 border border-slate-800/60"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tier.color }} />
                  <span className="font-bold text-slate-200">{tier.status} ({tier.minScore}-{tier.maxScore})</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono max-w-[260px] truncate text-right">
                  {tier.access}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Telemetry Log */}
        <div className="lg:col-span-5 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs">
          <span className="text-slate-400 font-bold block mb-2">BEHAVIORAL AUDIT LOG:</span>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {actionLog.map((log, i) => (
              <div key={i} className="text-slate-400 flex items-start space-x-1.5 text-[11px]">
                <span className="text-emerald-400">▶</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
