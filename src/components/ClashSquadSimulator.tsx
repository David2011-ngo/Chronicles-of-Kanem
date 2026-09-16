import React, { useState } from 'react';
import { 
  ShoppingBag, 
  DollarSign, 
  Award, 
  Shield, 
  Zap, 
  RefreshCw, 
  Check, 
  AlertCircle,
  TrendingUp,
  Box,
  Flame
} from 'lucide-react';
import { CLASH_SQUAD_ITEMS } from '../data/economyData';
import { ClashSquadItem } from '../types';

export const ClashSquadSimulator: React.FC = () => {
  const [round, setRound] = useState<number>(1);
  const [teamCash, setTeamCash] = useState<number>(500); // starts with 500 in round 1
  const [lossStreak, setLossStreak] = useState<number>(0);
  const [teamScore, setTeamScore] = useState<{ teamA: number; teamB: number }>({ teamA: 0, teamB: 0 });
  const [inventory, setInventory] = useState<ClashSquadItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [matchLog, setMatchLog] = useState<string[]>([
    'Match Initiated: Clash Squad 4v4 Best of 7.',
    'Round 1: Pistol Round. Initial budget granted: $500.'
  ]);

  // Round Economy Formula
  const calculateNextRoundCash = (outcome: 'win' | 'loss', kills: number = 0) => {
    let base = 0;
    if (outcome === 'win') {
      base = 1900;
    } else {
      // Loss streak curve: Loss 1 = 1400, Loss 2 = 1600, Loss 3 = 2400, Loss 4+ = 3000
      if (lossStreak === 0) base = 1400;
      else if (lossStreak === 1) base = 1600;
      else if (lossStreak === 2) base = 2400;
      else base = 3000;
    }
    const killBonus = kills * 200;
    return base + killBonus;
  };

  const handleBuyItem = (item: ClashSquadItem) => {
    if (teamCash < item.cost) return;

    // Check limits
    if (item.maxPerRound) {
      const existingCount = inventory.filter(i => i.id === item.id).length;
      if (existingCount >= item.maxPerRound) return;
    }

    setTeamCash(cash => cash - item.cost);
    setInventory(prev => [...prev, item]);
  };

  const handleRemoveItem = (index: number) => {
    const item = inventory[index];
    setTeamCash(cash => cash + item.cost);
    setInventory(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSimulateRound = (outcome: 'win' | 'loss') => {
    if (round >= 7 || teamScore.teamA === 4 || teamScore.teamB === 4) return;

    const simulatedKills = Math.floor(Math.random() * 3) + (outcome === 'win' ? 2 : 0);
    const earnedCash = calculateNextRoundCash(outcome, simulatedKills);
    const newLossStreak = outcome === 'win' ? 0 : lossStreak + 1;

    const nextScore = {
      teamA: outcome === 'win' ? teamScore.teamA + 1 : teamScore.teamA,
      teamB: outcome === 'loss' ? teamScore.teamB + 1 : teamScore.teamB
    };

    setTeamScore(nextScore);
    setLossStreak(newLossStreak);
    setRound(r => r + 1);
    setTeamCash(cash => Math.min(9900, cash + earnedCash));

    // Carry over surviving armor/weapons, clear utility grenades
    setInventory(prev => prev.filter(item => item.category !== 'utility'));

    const logEntry = `Round ${round} ${outcome.toUpperCase()} (${outcome === 'win' ? 'Team Won round' : 'Defeat'}). Kills: ${simulatedKills} (+$${simulatedKills * 200}). Base bonus: +$${earnedCash - simulatedKills * 200}. Retained equipment carried over.`;
    setMatchLog(prev => [logEntry, ...prev.slice(0, 8)]);
  };

  const handleResetMatch = () => {
    setRound(1);
    setTeamCash(500);
    setLossStreak(0);
    setTeamScore({ teamA: 0, teamB: 0 });
    setInventory([]);
    setMatchLog(['Match reset to Round 1. Base budget: $500.']);
  };

  // Economy state suggestion
  const getEconomyStrategy = () => {
    if (round === 1) return { label: 'Pistol Round', color: 'text-amber-400', desc: 'Buy Desert Eagle or Armor + Flashbang' };
    if (teamCash < 1600) return { label: 'Eco / Save Round', color: 'text-rose-400', desc: 'Conserve cash! Buy minimum SMG or pistol to guarantee $3000+ next round.' };
    if (teamCash < 2600) return { label: 'Force Buy / Semi-Buy', color: 'text-amber-400', desc: 'Buy MP5 + Level 2 Vest + 2 Gloo Walls to contest round.' };
    return { label: 'Full Buy / Loaded', color: 'text-emerald-400', desc: 'Full high-tier loadout: Woodpecker/AK47 + Lv3 Vest + Helmet + Full Gloo utility.' };
  };

  const strategy = getEconomyStrategy();
  const isMatchOver = teamScore.teamA === 4 || teamScore.teamB === 4 || round > 7;

  const filteredItems = selectedCategory === 'all'
    ? CLASH_SQUAD_ITEMS
    : CLASH_SQUAD_ITEMS.filter(item => item.category === selectedCategory);

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-5">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-lg text-slate-100">
              Clash Squad 4v4 Pre-Round Buy Menu & Economy Simulator
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              ROUND-BASED ECONOMY ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Best of 7 rounds with dynamic win/loss streak compensation ($1400 / $1600 / $2400 / $3000) and kill bounties.
          </p>
        </div>

        {/* Round Scoreboard */}
        <div className="flex items-center space-x-4 bg-slate-950 px-4 py-2 rounded-lg border border-slate-800">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 block font-mono">YOUR SQUAD</span>
            <span className="text-xl font-bold font-display text-emerald-400">{teamScore.teamA}</span>
          </div>
          <span className="text-slate-600 font-bold text-sm">:</span>
          <div className="text-center">
            <span className="text-[10px] text-slate-400 block font-mono">ENEMY SQUAD</span>
            <span className="text-xl font-bold font-display text-rose-400">{teamScore.teamB}</span>
          </div>
          <div className="border-l border-slate-800 pl-4 text-center">
            <span className="text-[10px] text-slate-400 block font-mono">ROUND</span>
            <span className="text-sm font-bold font-mono text-amber-400">
              {round} / 7
            </span>
          </div>
        </div>
      </div>

      {/* Economy Overview Card */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-mono">CURRENT CASH</span>
            <span className="text-2xl font-black font-display text-amber-400 flex items-center">
              <DollarSign className="w-5 h-5 -mr-1" />
              {teamCash}
            </span>
          </div>
          <DollarSign className="w-8 h-8 text-amber-500/20" />
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-mono">LOSS STREAK BONUS</span>
            <span className="text-sm font-bold text-slate-200">
              {lossStreak === 0 ? 'Tier 0 ($1,400 base)' : lossStreak === 1 ? 'Tier 1 ($1,600)' : lossStreak === 2 ? 'Tier 2 ($2,400)' : 'Tier 3 Max ($3,000)'}
            </span>
          </div>
          <TrendingUp className="w-6 h-6 text-slate-600" />
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-mono">TACTICAL STRATEGY</span>
            <span className={`text-xs font-bold ${strategy.color}`}>
              {strategy.label}
            </span>
            <p className="text-[10px] text-slate-400 truncate max-w-[160px]">{strategy.desc}</p>
          </div>
          <AlertCircle className="w-6 h-6 text-slate-600" />
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-mono">SIMULATE ROUND</span>
            <div className="flex items-center space-x-1.5 mt-1">
              <button
                id="sim-win-round-btn"
                onClick={() => handleSimulateRound('win')}
                disabled={isMatchOver}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold font-mono transition-colors disabled:opacity-50"
              >
                WIN
              </button>
              <button
                id="sim-loss-round-btn"
                onClick={() => handleSimulateRound('loss')}
                disabled={isMatchOver}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-bold font-mono transition-colors disabled:opacity-50"
              >
                LOSS
              </button>
              <button
                id="reset-cs-match-btn"
                onClick={handleResetMatch}
                className="p-1 text-slate-400 hover:text-white rounded"
                title="Reset Match"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Equipped Inventory */}
      <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
            <Box className="w-3.5 h-3.5 text-amber-400" />
            <span>Equipped Loadout For Round {round} ({inventory.length} items)</span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Surviving weapons and armor carry into subsequent rounds
          </span>
        </div>

        {inventory.length === 0 ? (
          <div className="text-xs text-slate-400 italic py-2 text-center">
            No equipment purchased yet for this round. Choose items from the buy catalog below.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {inventory.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-2 bg-slate-900 px-2.5 py-1.5 rounded border border-slate-700 text-xs text-slate-200"
              >
                <span className="font-semibold">{item.name}</span>
                <span className="text-[10px] text-amber-400 font-mono">${item.cost}</span>
                <button
                  onClick={() => handleRemoveItem(idx)}
                  className="text-slate-400 hover:text-rose-400 ml-1 font-bold"
                  title="Sell / Refund"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buy Menu Category Tabs */}
      <div className="flex items-center space-x-1 border-b border-slate-800 pb-2">
        {['all', 'pistols', 'smg', 'shotgun', 'rifles', 'armor', 'utility'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded text-xs font-semibold capitalize transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500 text-black font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
        {filteredItems.map(item => {
          const canAfford = teamCash >= item.cost;
          return (
            <div
              key={item.id}
              className={`p-3 rounded-lg border flex flex-col justify-between transition-all ${
                canAfford
                  ? 'bg-slate-900/90 border-slate-800 hover:border-amber-500/50'
                  : 'bg-slate-950/40 border-slate-900 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-slate-100">{item.name}</span>
                  <span className="font-mono font-bold text-xs text-amber-400">
                    ${item.cost}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono text-slate-400">{item.category}</span>
                <button
                  id={`buy-item-${item.id}`}
                  onClick={() => handleBuyItem(item)}
                  disabled={!canAfford}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    canAfford
                      ? 'bg-amber-500 hover:bg-amber-400 text-black active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Purchase
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Match History Event Log */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1">
        <span className="text-slate-400 font-bold block mb-1">MATCH SESSION LOG:</span>
        {matchLog.map((log, i) => (
          <div key={i} className="text-slate-400 flex items-start space-x-2">
            <span className="text-amber-500">▶</span>
            <span>{log}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
