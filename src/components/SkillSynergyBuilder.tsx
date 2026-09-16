import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  Shield, 
  Zap, 
  HeartPulse, 
  Clock, 
  Wind, 
  CheckCircle2, 
  Activity,
  Layers,
  Award
} from 'lucide-react';
import { ACTIVE_SKILLS, PASSIVE_SKILLS, PETS, CHARACTERS } from '../data/skillsData';
import { Skill, Pet, Character } from '../types';

export const SkillSynergyBuilder: React.FC = () => {
  const [selectedActive, setSelectedActive] = useState<Skill>(ACTIVE_SKILLS[0]);
  const [selectedPassives, setSelectedPassives] = useState<Skill[]>([
    PASSIVE_SKILLS[0],
    PASSIVE_SKILLS[1],
    PASSIVE_SKILLS[2]
  ]);
  const [selectedPet, setSelectedPet] = useState<Pet>(PETS[0]);

  // Handle toggling passives (max 3)
  const handleTogglePassive = (skill: Skill) => {
    const isSelected = selectedPassives.some(p => p.id === skill.id);
    if (isSelected) {
      // Don't allow less than 1 passive
      if (selectedPassives.length > 1) {
        setSelectedPassives(prev => prev.filter(p => p.id !== skill.id));
      }
    } else {
      if (selectedPassives.length < 3) {
        setSelectedPassives(prev => [...prev, skill]);
      } else {
        // Replace last one
        setSelectedPassives(prev => [prev[0], prev[1], skill]);
      }
    }
  };

  // Presets
  const applyPreset = (presetName: string) => {
    if (presetName === 'rusher') {
      setSelectedActive(ACTIVE_SKILLS.find(s => s.id === 'active-rebelrush') || ACTIVE_SKILLS[4]);
      setSelectedPassives([
        PASSIVE_SKILLS.find(s => s.id === 'passive-dash')!,
        PASSIVE_SKILLS.find(s => s.id === 'passive-sustained-raids')!,
        PASSIVE_SKILLS.find(s => s.id === 'passive-bushido')!
      ]);
      setSelectedPet(PETS.find(p => p.id === 'pet-waggor')!);
    } else if (presetName === 'medic') {
      setSelectedActive(ACTIVE_SKILLS.find(s => s.id === 'active-healingheart') || ACTIVE_SKILLS[3]);
      setSelectedPassives([
        PASSIVE_SKILLS.find(s => s.id === 'passive-gluttony')!,
        PASSIVE_SKILLS.find(s => s.id === 'passive-hackers-eye')!,
        PASSIVE_SKILLS.find(s => s.id === 'passive-iron-will')!
      ]);
      setSelectedPet(PETS.find(p => p.id === 'pet-ottero')!);
    } else if (presetName === 'anchor') {
      setSelectedActive(ACTIVE_SKILLS.find(s => s.id === 'active-chronosphere') || ACTIVE_SKILLS[0]);
      setSelectedPassives([
        PASSIVE_SKILLS.find(s => s.id === 'passive-iron-will')!,
        PASSIVE_SKILLS.find(s => s.id === 'passive-bushido')!,
        PASSIVE_SKILLS.find(s => s.id === 'passive-damage-delivered')!
      ]);
      setSelectedPet(PETS.find(p => p.id === 'pet-rockie')!);
    } else if (presetName === 'sniper') {
      setSelectedActive(ACTIVE_SKILLS.find(s => s.id === 'active-seekershock') || ACTIVE_SKILLS[5]);
      setSelectedPassives([
        PASSIVE_SKILLS.find(s => s.id === 'passive-dead-silent')!,
        PASSIVE_SKILLS.find(s => s.id === 'passive-hackers-eye')!,
        PASSIVE_SKILLS.find(s => s.id === 'passive-dash')!
      ]);
      setSelectedPet(PETS.find(p => p.id === 'pet-falco')!);
    }
  };

  // Calculate stats
  const hasRockie = selectedPet.id === 'pet-rockie';
  const effectiveCooldown = hasRockie && selectedActive.cooldown
    ? Math.round(selectedActive.cooldown * 0.85)
    : selectedActive.cooldown;

  const hasKelly = selectedPassives.some(p => p.id === 'passive-dash');
  const sprintBuff = hasKelly ? '+6% (Permanent)' : '0% (Standard)';

  const hasHayato = selectedPassives.some(p => p.id === 'passive-bushido');
  const armorPierceMax = hasHayato ? 'Up to +73.5%' : 'Standard Base';

  const hasJota = selectedPassives.some(p => p.id === 'passive-sustained-raids');
  const vampireDrain = hasJota ? '+1.5% hit / +20% knock' : 'None';

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-5">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className="font-display font-bold text-lg text-slate-100">
              Character Hybrid Skill Matrix & Companion Pet Synergy Lab
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
              1 ACTIVE + 3 PASSIVES + 1 PET
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Test mechanical synergies, cooldown reduction stacking, combat survivability, and affinity progression rewards.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center space-x-1.5 text-xs font-mono">
          <span className="text-slate-400 mr-1 hidden sm:inline">META PRESETS:</span>
          <button
            onClick={() => applyPreset('rusher')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded border border-slate-700 transition-colors"
          >
            Entry Rusher
          </button>
          <button
            onClick={() => applyPreset('anchor')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded border border-slate-700 transition-colors"
          >
            Zone Anchor
          </button>
          <button
            onClick={() => applyPreset('medic')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded border border-slate-700 transition-colors"
          >
            Tactical Medic
          </button>
          <button
            onClick={() => applyPreset('sniper')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-purple-400 rounded border border-slate-700 transition-colors"
          >
            Ghost Scout
          </button>
        </div>
      </div>

      {/* Calculated Synergy Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-[11px] text-slate-400 block font-mono flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>ACTIVE COOLDOWN</span>
          </span>
          <span className="text-lg font-bold font-mono text-indigo-300">
            {effectiveCooldown}s
          </span>
          <span className="text-[10px] text-slate-400 block truncate">
            {hasRockie ? '15% Rockie perk applied' : 'Base cooldown time'}
          </span>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-[11px] text-slate-400 block font-mono flex items-center space-x-1">
            <Wind className="w-3.5 h-3.5 text-amber-400" />
            <span>SPRINT MOBILITY</span>
          </span>
          <span className="text-lg font-bold font-mono text-amber-300">
            {sprintBuff}
          </span>
          <span className="text-[10px] text-slate-400 block truncate">
            {hasKelly ? 'Deadly Velocity awakened' : 'Standard speed'}
          </span>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-[11px] text-slate-400 block font-mono flex items-center space-x-1">
            <Shield className="w-3.5 h-3.5 text-rose-400" />
            <span>ARMOR PIERCE SCALING</span>
          </span>
          <span className="text-lg font-bold font-mono text-rose-300">
            {armorPierceMax}
          </span>
          <span className="text-[10px] text-slate-400 block truncate">
            {hasHayato ? 'Bushido missing-HP scaling' : 'Base armor penetration'}
          </span>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-[11px] text-slate-400 block font-mono flex items-center space-x-1">
            <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
            <span>COMBAT VAMPIRISM</span>
          </span>
          <span className="text-lg font-bold font-mono text-emerald-300">
            {vampireDrain}
          </span>
          <span className="text-[10px] text-slate-400 block truncate">
            {hasJota ? 'Sustained Raids active' : 'No leeching on gun hit'}
          </span>
        </div>
      </div>

      {/* Selected Loadout Deck Summary */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
        <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
          Currently Equipped Hybrid Loadout
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Active Skill */}
          <div className="bg-slate-900 p-3 rounded-lg border border-indigo-500/40">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                1 ACTIVE SKILL
              </span>
              <span className="text-xs font-mono text-indigo-400">{selectedActive.cooldown}s CD</span>
            </div>
            <h5 className="text-sm font-bold text-slate-100">{selectedActive.name}</h5>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{selectedActive.description}</p>
            <div className="mt-2 text-[10px] font-mono text-indigo-400 bg-indigo-950/30 p-1.5 rounded">
              {selectedActive.formula}
            </div>
          </div>

          {/* 3 Passive Skills */}
          <div className="bg-slate-900 p-3 rounded-lg border border-amber-500/40 md:col-span-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                3 PASSIVE SKILLS ({selectedPassives.length}/3)
              </span>
            </div>
            <div className="space-y-1.5 mt-2">
              {selectedPassives.map(p => (
                <div key={p.id} className="text-xs flex items-center justify-between bg-slate-950/70 px-2 py-1 rounded">
                  <span className="font-semibold text-slate-200">{p.name}</span>
                  <span className="text-[10px] text-amber-400 font-mono capitalize">{p.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Companion Pet */}
          <div className="bg-slate-900 p-3 rounded-lg border border-sky-500/40">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                COMPANION PET UTILITY
              </span>
              <span className="text-xs font-mono text-sky-400">{selectedPet.species}</span>
            </div>
            <h5 className="text-sm font-bold text-slate-100">{selectedPet.name} ({selectedPet.perkName})</h5>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{selectedPet.perkDescription}</p>
            <div className="mt-2 text-[10px] font-mono text-sky-400 bg-sky-950/30 p-1.5 rounded">
              {selectedPet.formula}
            </div>
          </div>
        </div>
      </div>

      {/* Select Active Skill List */}
      <div>
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
          Step 1: Choose 1 Active Skill
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {ACTIVE_SKILLS.map(skill => {
            const isSelected = selectedActive.id === skill.id;
            return (
              <div
                key={skill.id}
                onClick={() => setSelectedActive(skill)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-200">{skill.name}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{skill.description}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Role: {skill.tacticalRole}</span>
                  <span className="text-indigo-400">CD: {skill.cooldown}s</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Select Passives List */}
      <div>
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
          Step 2: Choose 3 Passive Skills (Click to toggle)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PASSIVE_SKILLS.map(skill => {
            const isSelected = selectedPassives.some(p => p.id === skill.id);
            return (
              <div
                key={skill.id}
                onClick={() => handleTogglePassive(skill)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-950/40 border-amber-500 shadow-md shadow-amber-500/10'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-200">{skill.name}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{skill.description}</p>
                <div className="mt-2 text-[10px] font-mono text-amber-400 truncate">
                  {skill.formula}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Select Companion Pet */}
      <div>
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
          Step 3: Choose Companion Pet Secondary Perk
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {PETS.map(pet => {
            const isSelected = selectedPet.id === pet.id;
            return (
              <div
                key={pet.id}
                onClick={() => setSelectedPet(pet)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-sky-950/40 border-sky-500 shadow-md shadow-sky-500/10'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-200">{pet.name}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                </div>
                <span className="text-[10px] text-sky-400 font-mono block mt-0.5">{pet.perkName}</span>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{pet.perkDescription}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
