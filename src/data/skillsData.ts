import { Character, Skill, Pet } from '../types';

export const ACTIVE_SKILLS: Skill[] = [
  {
    id: 'active-chronosphere',
    name: 'Chrono Barrier (Time Turner)',
    type: 'active',
    cooldown: 80,
    icon: 'Shield',
    category: 'defense',
    description: 'Deploys a spherical force field blocking 800 damage from all angles. Enemies cannot shoot inward; allies inside cannot shoot outward. Lasts 6 seconds.',
    formula: 'Duration: 6s | Barrier HP: 800 | Internal Speed: +10% | CD: 80s',
    tacticalRole: 'Anchor / Emergency Clutch'
  },
  {
    id: 'active-dropbeat',
    name: 'Drop The Beat (Sonic Tempo)',
    type: 'active',
    cooldown: 45,
    icon: 'Music',
    category: 'support',
    description: 'Emits a 5m rhythmic aura that increases ally movement speed by 15% and recovers 5 HP/sec for 10 seconds. Effect does not stack.',
    formula: 'Aura Radius: 5m | Speed Buff: +15% | Heal: 5 HP/s (Total 50 HP) | Duration: 10s | CD: 45s',
    tacticalRole: 'Support / Squad Vanguard'
  },
  {
    id: 'active-camouflage',
    name: 'Camouflage (Primal Bush)',
    type: 'active',
    cooldown: 180,
    icon: 'EyeOff',
    category: 'mobility',
    description: 'Transforms user into a natural vegetation bush for 15 seconds. Aim-assist on user is disabled while transformed. Attacking cancels transformation. Takedown instantly resets cooldown.',
    formula: 'Duration: 15s | Speed: -10% | Aim Assist Nullification: 100% | Reset Trigger: On Knockdown',
    tacticalRole: 'Rusher / Flanker'
  },
  {
    id: 'active-healingheart',
    name: 'Healing Heartbeat (Revival Zone)',
    type: 'active',
    cooldown: 60,
    icon: 'Activity',
    category: 'support',
    description: 'Creates an immovable 3.5m healing circle. Inside the zone, allies regenerate 5 HP/s and downed players can self-recover without teammate assistance.',
    formula: 'Zone: 3.5m | Duration: 12s | Heal: 5 HP/s | Self-Revive: Enabled (8s channel) | CD: 60s',
    tacticalRole: 'Tactical Medic'
  },
  {
    id: 'active-rebelrush',
    name: 'Rebel Rush (Hyper Dash)',
    type: 'active',
    cooldown: 30,
    icon: 'Zap',
    category: 'mobility',
    description: 'Performs up to 3 consecutive high-velocity directional dashes within a 4-second window. Grants 50% damage reduction during the dash animation.',
    formula: 'Charges: 3 | Dash Velocity: 14 m/s | Invulnerability Window: 0.3s per dash | CD: 30s',
    tacticalRole: 'Close-Quarters Rusher'
  },
  {
    id: 'active-seekershock',
    name: 'Senses Shock (Hunter Drone)',
    type: 'active',
    cooldown: 90,
    icon: 'Compass',
    category: 'intel',
    description: 'Releases an autonomous micro-drone towards the closest enemy within 100m. Creates a 5m pulse explosion dealing 25 damage, reducing enemy movement speed by 60% and firing rate by 35% for 5s.',
    formula: 'Drone Speed: 24 m/s | Range: 100m | Blast: 25 Dmg + 60% Slow + 35% RoF debuff (5s) | CD: 90s',
    tacticalRole: 'Scout / Breach Initiator'
  }
];

export const PASSIVE_SKILLS: Skill[] = [
  {
    id: 'passive-hackers-eye',
    name: "Moco's Hacker's Eye",
    type: 'passive',
    icon: 'Target',
    category: 'intel',
    description: 'Tag enemies shot for 5 seconds. Tagged position is shared in real time with all squad mates on mini-map and overhead indicator.',
    formula: 'Duration: 5.0s | Squad Broadcast: 100% | Refresh on re-hit',
    tacticalRole: 'Team Recon'
  },
  {
    id: 'passive-bushido',
    name: "Hayato's Bushido",
    type: 'passive',
    icon: 'Swords',
    category: 'offense',
    description: 'With every 10% decrease in maximum HP, armor penetration increases by 10.5%. Frontal damage taken is reduced by 3.5% per 10% missing HP.',
    formula: 'Penetration: +1.05% per 1% Missing HP (Max +73.5% Armor Pierce) | Frontal DR: +24.5%',
    tacticalRole: 'Duels & Clutch'
  },
  {
    id: 'passive-dash',
    name: "Kelly's Deadly Velocity",
    type: 'passive',
    icon: 'Wind',
    category: 'mobility',
    description: 'Sprint speed is permanently increased by 6%. After sprinting for 4 seconds, first shot awakens to deal 106% critical damage.',
    formula: 'Sprint: +6% flat | Awakened Strike: +6% extra damage on initial shot every 5s',
    tacticalRole: 'Rotation & Aggression'
  },
  {
    id: 'passive-gluttony',
    name: "Maxim's Gluttony",
    type: 'passive',
    icon: 'Coffee',
    category: 'support',
    description: 'Consumes medkits and eats mushrooms 25% faster. Significantly cuts healing vulnerability window in mid-firefight cover.',
    formula: 'Medkit Channel Time: 4.0s -> 3.0s (-25%) | Mushroom Eat: 3.0s -> 2.25s',
    tacticalRole: 'Sustained Combat'
  },
  {
    id: 'passive-sustained-raids',
    name: "Jota's Sustained Raids",
    type: 'passive',
    icon: 'HeartPulse',
    category: 'offense',
    description: 'Hitting an enemy with guns recovers 1.5% HP. Knocking down an enemy instantly restores 20% of maximum HP.',
    formula: 'On-Hit: +1.5% Max HP (3 HP/hit) | On-Knockdown: +20% Max HP (40 HP flat)',
    tacticalRole: 'Aggressive Rusher'
  },
  {
    id: 'passive-dead-silent',
    name: "Rafael's Dead Silent",
    type: 'passive',
    icon: 'VolumeX',
    category: 'offense',
    description: 'Firing sound is naturally suppressed when using Sniper Rifles and Marksman Rifles. Knocked down enemies suffer 85% faster bleed-out rate.',
    formula: 'Suppression: 100% Built-in Silencer | Bleed-out Acceleration: +85% speed',
    tacticalRole: 'Long-Range Sniper'
  },
  {
    id: 'passive-iron-will',
    name: "Andrew's Wolf Pack",
    type: 'passive',
    icon: 'ShieldAlert',
    category: 'defense',
    description: 'Vest durability loss decreased by 20%. Teammates within 10m gain an additional 15% damage reduction from firearm hits.',
    formula: 'Armor Durability: +20% | Squad Aura DR: +15% within 10m radius',
    tacticalRole: 'Squad Anchor'
  },
  {
    id: 'passive-damage-delivered',
    name: "Shirou's Damage Delivered",
    type: 'passive',
    icon: 'Crosshair',
    category: 'offense',
    description: 'When hit by an enemy within 80m, the attacker is tagged for 6s (visible only to user). First shot on tagged enemy grants 100% armor penetration.',
    formula: 'Trigger Range: 80m | Tag Duration: 6s | 1st Shot Armor Penetration: 100% | CD: 10s',
    tacticalRole: 'Counter-Sniper / Trader'
  }
];

export const PETS: Pet[] = [
  {
    id: 'pet-waggor',
    name: 'Mr. Waggor',
    species: 'Cybernetic Penguin',
    perkName: 'Smooth Gloo',
    perkDescription: 'When the player has fewer than 2 Gloo Walls in inventory, Mr. Waggor manufactures 1 Gloo Wall every 100 seconds.',
    formula: 'Threshold: <2 Gloo Walls | Cycle: 100s per Gloo Wall | Passive Automation',
    icon: 'ShieldCheck'
  },
  {
    id: 'pet-ottero',
    name: 'Ottero',
    species: 'Beanie Otter',
    perkName: 'Double Blubber',
    perkDescription: 'When using Treatment Pistol or Medkit, the user also recovers EP equal to 65% of the HP recovered.',
    formula: 'EP Conversion: 65% of HP restored | Medkit (+75 HP) yields +48.75 EP',
    icon: 'Droplet'
  },
  {
    id: 'pet-falco',
    name: 'Falco',
    species: 'Peregrine Falcon',
    perkName: 'Skyline Spree',
    perkDescription: 'Increases squad gliding speed by 45% upon parachute open and increases dive speed by 50% after parachute cord pulls.',
    formula: 'Squad Glide: +45% | Dive Rate: +50% | Contests hot-drops 4.2s earlier than lobby',
    icon: 'Feather'
  },
  {
    id: 'pet-rockie',
    name: 'Rockie',
    species: 'Punk Raccoon',
    perkName: 'Stay Chill',
    perkDescription: 'Reduces the cooldown time of equipped Active Skills by 15%, dramatically accelerating tactical rotation cycles.',
    formula: 'Cooldown Reduction: -15% | Chrono (80s -> 68s) | Alok (45s -> 38.25s)',
    icon: 'Clock'
  },
  {
    id: 'pet-beaston',
    name: 'Beaston',
    species: 'Cyber Baboon',
    perkName: 'Helping Hand',
    perkDescription: 'Increases the throwing distance of Grenades, Gloo Walls, Flashbangs, and Smoke Grenades by 30%.',
    formula: 'Trajectory Arc Distance: +30% | Safe Gloo placement range expanded from 15m to 19.5m',
    icon: 'Send'
  }
];

export const CHARACTERS: Character[] = [
  {
    id: 'char-chrono',
    name: 'Chrono',
    codenamed: 'Temporal Guard',
    role: 'Anchor',
    signatureActiveSkillId: 'active-chronosphere',
    lore: 'A cyber-enhanced temporal operative from a parallel reality dedicated to defending squads from orbital orbital artillery and crossfire.',
    portrait: 'chrono-portrait',
    affinityRewards: [
      { level: 1, reward: 'Chrono Holographic Avatar Banner' },
      { level: 2, reward: 'Signature Audio Emote: Temporal Clock' },
      { level: 3, reward: 'Exotic Skin: Cyber Chrono Zenith' },
      { level: 4, reward: 'Mythic Title: Master of Continuum' }
    ]
  },
  {
    id: 'char-alok',
    name: 'Alok',
    codenamed: 'Pulse Maestro',
    role: 'Support',
    signatureActiveSkillId: 'active-dropbeat',
    lore: 'World-famous DJ using acoustic kinetic resonators to heal his allies and accelerate squad breaches in high-stakes warzones.',
    portrait: 'alok-portrait',
    affinityRewards: [
      { level: 1, reward: 'Neon Equalizer Banner' },
      { level: 2, reward: 'Exclusive Lobby Theme: Vale Vale' },
      { level: 3, reward: 'Stage Legend Costume Set' },
      { level: 4, reward: 'Mythic Title: The Sound of Victory' }
    ]
  },
  {
    id: 'char-wukong',
    name: 'Wukong',
    codenamed: 'Shadow Simian',
    role: 'Rusher',
    signatureActiveSkillId: 'active-camouflage',
    lore: 'A bio-synthetic stealth infiltration unit capable of mimicking environmental flora to eliminate high-value targets without detection.',
    portrait: 'wukong-portrait',
    affinityRewards: [
      { level: 1, reward: 'Golden Staff Profile Frame' },
      { level: 2, reward: 'Acrobatic Taunt Emote' },
      { level: 3, reward: 'Cyber Shaman Armored Gi' },
      { level: 4, reward: 'Mythic Title: Ghost of the Canopy' }
    ]
  },
  {
    id: 'char-dimitri',
    name: 'Dimitri',
    codenamed: 'Resonance Medic',
    role: 'Support',
    signatureActiveSkillId: 'active-healingheart',
    lore: 'Sound engineer who repurposed sub-bass frequency nodes to stimulate cellular regeneration and autonomic revival.',
    portrait: 'dimitri-portrait',
    affinityRewards: [
      { level: 1, reward: 'Sub-Zero Pulse Banner' },
      { level: 2, reward: 'Acoustic Guitar Rest Emote' },
      { level: 3, reward: 'Synthesizer Pilot Outfit' },
      { level: 4, reward: 'Mythic Title: Guardian Frequency' }
    ]
  },
  {
    id: 'char-tatsuya',
    name: 'Tatsuya',
    codenamed: 'Phantom Dasher',
    role: 'Rusher',
    signatureActiveSkillId: 'active-rebelrush',
    lore: 'Griot District speedster with modified neural reflex boosters, enabling triple-blink evasion through lethal crosshairs.',
    portrait: 'tatsuya-portrait',
    affinityRewards: [
      { level: 1, reward: 'Neon Streak Banner' },
      { level: 2, reward: 'High-Kicking Breaker Emote' },
      { level: 3, reward: 'Shadow Speedster Leather Rig' },
      { level: 4, reward: 'Mythic Title: Lightning In Flesh' }
    ]
  },
  {
    id: 'char-homer',
    name: 'Homer',
    codenamed: 'Apex Seeker',
    role: 'Scout',
    signatureActiveSkillId: 'active-seekershock',
    lore: 'Blind recon specialist whose tactical sonar sensor-drones map structural layout and blind hostile defenders before breaching.',
    portrait: 'homer-portrait',
    affinityRewards: [
      { level: 1, reward: 'Sensor Sweep Banner' },
      { level: 2, reward: 'Drone Perch Interaction Emote' },
      { level: 3, reward: 'Blind Tactician Trenchcoat' },
      { level: 4, reward: 'Mythic Title: The Unseen Eagle' }
    ]
  }
];
