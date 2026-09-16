import { ClashSquadItem, SafeZonePhase } from '../types';

export const CLASH_SQUAD_ITEMS: ClashSquadItem[] = [
  // Pistols
  { id: 'cs-g18', name: 'G18 Auto Pistol', category: 'pistols', cost: 500, icon: 'Crosshair', description: 'Rapid burst sidearm for early eco rounds' },
  { id: 'cs-deagle', name: 'Desert Eagle .50', category: 'pistols', cost: 800, icon: 'Zap', description: 'High caliber sidearm capable of 1-shot headshot' },
  { id: 'cs-usp2', name: 'Dual USP-2', category: 'pistols', cost: 500, icon: 'Crosshair', description: 'Twin pistols for aggressive dual-wielding' },

  // SMGs
  { id: 'cs-mp5', name: 'MP5 SMG', category: 'smg', cost: 1300, icon: 'Shield', description: 'Balanced submachine gun with high stability' },
  { id: 'cs-mp40', name: 'MP40 High-RoF', category: 'smg', cost: 1900, icon: 'Flame', description: 'Extreme close range fire rate monster' },
  { id: 'cs-ump', name: 'UMP Armor-Buster', category: 'smg', cost: 1600, icon: 'ShieldAlert', description: 'Built-in armor penetration for armored targets' },

  // Shotguns
  { id: 'cs-m1887', name: 'M1887 Heavy DB', category: 'shotgun', cost: 1900, icon: 'Zap', description: '2-shot high burst point blank killer' },
  { id: 'cs-mag7', name: 'MAG-7 Tactical Pump', category: 'shotgun', cost: 1700, icon: 'Crosshair', description: 'Magazine fed high-mobility shotgun' },

  // Rifles & Marksman
  { id: 'cs-ak47', name: 'AK47 Assault Rifle', category: 'rifles', cost: 1800, icon: 'Crosshair', description: 'Heavy 7.62mm rifle with immense single bullet punch' },
  { id: 'cs-m4a1', name: 'M4A1 Versatile', category: 'rifles', cost: 1700, icon: 'Crosshair', description: 'Laser accurate at mid range with controllable recoil' },
  { id: 'cs-woodpecker', name: 'Woodpecker DMR', category: 'rifles', cost: 2100, icon: 'Target', description: 'Armor piercing semi-auto marksman rifle' },
  { id: 'cs-awm', name: 'AWM Sniper Rifle', category: 'rifles', cost: 2800, icon: 'Eye', description: 'Deadly .300 magnum sniper; 150 body, 300 headshot' },

  // Armor
  { id: 'cs-vest2', name: 'Level 2 Kevlar Vest', category: 'armor', cost: 400, icon: 'Shield', description: 'Reduces bullet damage by 50% with 220 durability' },
  { id: 'cs-vest3', name: 'Level 3 Reinforced Vest', category: 'armor', cost: 1000, icon: 'ShieldAlert', description: 'Reduces bullet damage by 65% with 260 durability' },
  { id: 'cs-helm2', name: 'Level 2 Tactical Helmet', category: 'armor', cost: 300, icon: 'Shield', description: 'Reduces headshot damage multiplier by 45%' },
  { id: 'cs-repair', name: 'Armor Repair Kit', category: 'armor', cost: 200, icon: 'Wrench', description: 'Restores 100 durability to damaged vest and helmet' },

  // Utility
  { id: 'cs-gloo', name: 'Gloo Wall (x2)', category: 'utility', cost: 400, icon: 'Box', description: 'Physical instant ice barrier; blocks incoming bullets', maxPerRound: 2 },
  { id: 'cs-grenade', name: 'Frag Grenade', category: 'utility', cost: 300, icon: 'Bomb', description: 'Cookable explosive dealing up to 220 damage', maxPerRound: 1 },
  { id: 'cs-flash', name: 'Flashbang', category: 'utility', cost: 200, icon: 'Sun', description: 'Blinds and disorients enemies for 3.5 seconds' },
  { id: 'cs-smoke', name: 'Tactical Smoke', category: 'utility', cost: 200, icon: 'Cloud', description: 'Creates visual obstruction and disables aim-assist through smoke' },
  { id: 'cs-mushroom', name: 'Super Mushroom Lv3', category: 'utility', cost: 100, icon: 'Heart', description: 'Instantly grants 200 Energy Points (EP) for rapid passive health regen' }
];

export const SAFE_ZONE_PHASES: SafeZonePhase[] = [
  { phase: 1, waitDurationSec: 120, shrinkDurationSec: 60, radiusMeters: 650, damagePerSec: 1, airdropCount: 1 },
  { phase: 2, waitDurationSec: 90, shrinkDurationSec: 50, radiusMeters: 450, damagePerSec: 2, airdropCount: 1 },
  { phase: 3, waitDurationSec: 75, shrinkDurationSec: 45, radiusMeters: 300, damagePerSec: 4, airdropCount: 2 },
  { phase: 4, waitDurationSec: 60, shrinkDurationSec: 40, radiusMeters: 180, damagePerSec: 6, airdropCount: 1 },
  { phase: 5, waitDurationSec: 50, shrinkDurationSec: 35, radiusMeters: 100, damagePerSec: 10, airdropCount: 1 },
  { phase: 6, waitDurationSec: 40, shrinkDurationSec: 30, radiusMeters: 50, damagePerSec: 15, airdropCount: 0 },
  { phase: 7, waitDurationSec: 30, shrinkDurationSec: 20, radiusMeters: 20, damagePerSec: 20, airdropCount: 0 },
  { phase: 8, waitDurationSec: 15, shrinkDurationSec: 15, radiusMeters: 0, damagePerSec: 30, airdropCount: 0 }
];

export const VENDING_MACHINE_CATALOG = [
  { item: 'Teammate Revival Card', costCoins: 400, limit: 3, category: 'Life Support', note: 'Redeploys knocked out squadmate from drop-plane' },
  { item: 'Upgrade Chip (Tier +1)', costCoins: 300, limit: 3, category: 'Firearm Tech', note: 'Evolves compatible weapons up to Tier III' },
  { item: 'Level 3 Reinforced Vest', costCoins: 300, limit: 2, category: 'Armor', note: '65% bullet damage mitigation' },
  { item: 'Level 3 Helmet', costCoins: 200, limit: 2, category: 'Armor', note: '45% headshot reduction' },
  { item: 'Super Medkit (Full 200 HP)', costCoins: 150, limit: 4, category: 'Medical', note: 'Restores HP + EP to 100% in 4s' },
  { item: 'Gloo Wall Bundle (x3)', costCoins: 200, limit: 5, category: 'Tactical', note: '600 HP deployable ice wall' },
  { item: 'AWM Ammo Cache (.300 Magnum x10)', costCoins: 250, limit: 2, category: 'Munitions', note: 'Heavy anti-armor ordnance' },
  { item: 'UAV Recon Radar Drone', costCoins: 400, limit: 1, category: 'Intel', note: 'Scans 150m radius for 15s revealing enemy pings' }
];

export const HONOR_SCORE_TIERS = [
  {
    minScore: 100,
    maxScore: 100,
    status: 'Exemplary Honor',
    color: '#10b981',
    access: 'Unrestricted (Ranked BR, Clash Squad Ranked, Lone Wolf Ranked, Tournaments)',
    rewards: 'Weekly 500 Gold + 2x Evo Weapon Token Crate bonus'
  },
  {
    minScore: 90,
    maxScore: 99,
    status: 'Good Standing',
    color: '#3b82f6',
    access: 'Unrestricted full access across all competitive modes',
    rewards: 'Standard weekly rewards'
  },
  {
    minScore: 80,
    maxScore: 89,
    status: 'Ranked Clash Squad Restricted',
    color: '#f59e0b',
    access: 'LOCKED OUT of Clash Squad Ranked. Permitted in Normal BR, Ranked BR, and Arcade.',
    rewards: 'Weekly rewards suspended until score reaches 90+'
  },
  {
    minScore: 60,
    maxScore: 79,
    status: 'Ranked Battle Royale Restricted',
    color: '#ef4444',
    access: 'LOCKED OUT of ALL Ranked queues (BR Ranked & CS Ranked). Only Casual/Arcade permitted.',
    rewards: 'No progression rewards. Warning prompt displayed upon login.'
  },
  {
    minScore: 0,
    maxScore: 59,
    status: 'Multiplayer Quarantine',
    color: '#991b1b',
    access: 'LOCKED OUT of all multiplayer matchmaking queues. Only solo training / bot modes allowed.',
    rewards: 'Must complete 10 clean bot matches without disconnection to begin rehabilitation (+1/match).'
  }
];
