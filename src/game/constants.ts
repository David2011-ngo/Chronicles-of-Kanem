import { WeaponDef, CharacterDef, WeaponId, CharacterId, EmoteId, EmoteDef } from './types';

export const MAP_SIZE = 3200; // 3200x3200 world canvas

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  m1887: {
    id: 'm1887',
    name: 'M1887',
    category: 'Shotgun',
    damage: 32, // fires 6 pellets = up to 192 body damage!
    headshotMultiplier: 2.2,
    fireRate: 2.2,
    magazineSize: 2,
    reloadTime: 1.4,
    range: 350,
    bulletSpeed: 950,
    spread: 0.16,
    color: '#f97316',
    icon: 'Double-Barrel SG'
  },
  mp40: {
    id: 'mp40',
    name: 'MP40',
    category: 'SMG',
    damage: 22,
    headshotMultiplier: 2.4,
    fireRate: 14.5, // blazing fast SMG
    magazineSize: 32,
    reloadTime: 1.6,
    range: 520,
    bulletSpeed: 1100,
    spread: 0.08,
    color: '#eab308',
    icon: 'Cobra MP40'
  },
  ak47: {
    id: 'ak47',
    name: 'AK-47',
    category: 'AR',
    damage: 38,
    headshotMultiplier: 2.5,
    fireRate: 8.5,
    magazineSize: 30,
    reloadTime: 2.1,
    range: 850,
    bulletSpeed: 1350,
    spread: 0.06,
    color: '#ef4444',
    icon: 'Blue Flame Draco'
  },
  awm: {
    id: 'awm',
    name: 'AWM',
    category: 'Sniper',
    damage: 150, // 150 body, 300 headshot (instant knock!)
    headshotMultiplier: 2.5,
    fireRate: 1.1,
    magazineSize: 5,
    reloadTime: 2.8,
    range: 1600,
    bulletSpeed: 2100,
    spread: 0.01,
    color: '#06b6d4',
    icon: 'AWM Sniper'
  },
  deagle: {
    id: 'deagle',
    name: 'Desert Eagle',
    category: 'Pistol',
    damage: 48,
    headshotMultiplier: 2.6,
    fireRate: 3.2,
    magazineSize: 7,
    reloadTime: 1.5,
    range: 600,
    bulletSpeed: 1150,
    spread: 0.04,
    color: '#a855f7',
    icon: 'One-Tap Deagle'
  },
  fists: {
    id: 'fists',
    name: 'Combat Fists',
    category: 'Melee',
    damage: 55,
    headshotMultiplier: 2.0,
    fireRate: 2.2,
    magazineSize: 999,
    reloadTime: 0.1,
    range: 65,
    bulletSpeed: 300,
    spread: 0.2,
    color: '#94a3b8',
    icon: 'Fists'
  }
};

export const CHARACTERS: Record<CharacterId, CharacterDef> = {
  alok: {
    id: 'alok',
    name: 'DJ Alok',
    title: 'World Renowned DJ',
    skillName: 'Drop the Beat',
    skillType: 'active',
    cooldown: 45,
    duration: 10,
    description: 'Creates a 5m aura that increases movement speed by 15% and restores 5 HP/s for 10s.',
    color: '#06b6d4'
  },
  chrono: {
    id: 'chrono',
    name: 'Chrono',
    title: 'Time Traveler',
    skillName: 'Time Turner',
    skillType: 'active',
    cooldown: 55,
    duration: 6,
    description: 'Creates a force field that blocks 800 incoming bullet damage for 6 seconds.',
    color: '#3b82f6'
  },
  kelly: {
    id: 'kelly',
    name: 'Kelly (Awakened)',
    title: 'High School Sprinter',
    skillName: 'Deadly Velocity',
    skillType: 'passive',
    cooldown: 0,
    duration: 0,
    description: 'Sprinting speed increased by 6%. First shot after sprint deals +106% critical damage.',
    color: '#eab308'
  },
  hayato: {
    id: 'hayato',
    name: 'Hayato (Firebrand)',
    title: 'Legendary Samurai',
    skillName: 'Bushido',
    skillType: 'passive',
    cooldown: 0,
    duration: 0,
    description: 'When maximum HP is decreased by 10%, armor penetration increases by 7.5%.',
    color: '#ec4899'
  },
  wukong: {
    id: 'wukong',
    name: 'Wukong',
    title: 'Monkey King',
    skillName: 'Camouflage',
    skillType: 'active',
    cooldown: 60,
    duration: 15,
    description: 'Transforms into a stealth bush, resetting enemy aim lock. Cooldown resets on knock!',
    color: '#22c55e'
  }
};

export const BERMUDA_POIS = [
  { name: 'CLOCK TOWER', x: 900, y: 1500, color: '#f59e0b' },
  { name: 'FACTORY', x: 1600, y: 1900, color: '#ef4444' },
  { name: 'PEAK', x: 1600, y: 1300, color: '#8b5cf6' },
  { name: 'POCHINOK', x: 1150, y: 2200, color: '#10b981' },
  { name: 'BIMASAKTI STRIP', x: 1750, y: 1500, color: '#3b82f6' },
  { name: 'MILL', x: 2400, y: 900, color: '#f97316' },
  { name: 'MARS ELECTRIC', x: 2300, y: 2300, color: '#06b6d4' },
  { name: 'HANGAR', x: 750, y: 1050, color: '#84cc16' },
  { name: 'SHIPYARD', x: 1600, y: 650, color: '#6366f1' },
  { name: 'KATULISTIWA', x: 1250, y: 1100, color: '#14b8a6' }
];

export const BOT_NAMES = [
  'Vincenzo_FF', 'Raistar_Headshot', 'B2K_Sniper', 'Nobru_King',
  'Total_Ajay', 'Ajjubhai_94', 'Badshah_007', 'Ghost_Rider_FF',
  'Killer_OP', 'Legend_Sniper', 'Pro_Rusher', 'Skyler_Hero',
  'Kelly_Fan', 'Alok_Beats', 'Chrono_God', 'M1887_King',
  'OneTap_God', 'Bermuda_Ace', 'Factory_King', 'Headshot_Machine',
  'Savage_Player', 'Toxic_Striker', 'Shadow_Ninja', 'Apex_Predator',
  'Thunder_Bolt', 'Viper_Strike', 'Zero_Ping', 'Clutch_Master',
  'Bullet_Storm', 'Dragon_Lord', 'Titan_Slayer', 'Phoenix_Rises',
  'Neo_Matrix', 'Crimson_Dawn', 'Frost_Bite', 'Cyber_Ghost',
  'Night_Hawk', 'Alpha_Wolf', 'Lone_Survivor', 'Iron_Fist',
  'Rapid_Fire', 'Delta_Force', 'Storm_Bringer', 'Blaze_Runner',
  'Phantom_Shooter', 'Havoc_Maker', 'Vortex_Hunter', 'Strike_Eagle',
  'Bermuda_Ghost'
];

export const SAFE_ZONE_STEPS = [
  { waitDuration: 35, shrinkDuration: 40, radius: 1400, dps: 1 },
  { waitDuration: 30, shrinkDuration: 35, radius: 950, dps: 2 },
  { waitDuration: 25, shrinkDuration: 30, radius: 600, dps: 4 },
  { waitDuration: 20, shrinkDuration: 25, radius: 350, dps: 8 },
  { waitDuration: 15, shrinkDuration: 20, radius: 120, dps: 15 }
];

export const EMOTES: Record<EmoteId, EmoteDef> = {
  booyah: {
    id: 'booyah',
    name: 'BOOYAH!',
    icon: '🏆',
    description: 'Raise the legendary championship trophy with celebratory gold sparks.',
    duration: 3.5,
    rarity: 'Legendary',
    color: '#f59e0b',
    sound: 'booyah'
  },
  dance: {
    id: 'dance',
    name: 'Shark Groove',
    icon: '🦈',
    description: 'Bust out the iconic viral dance moves to flex on the battlefield.',
    duration: 3.2,
    rarity: 'Epic',
    color: '#a855f7',
    sound: 'dance'
  },
  laugh: {
    id: 'laugh',
    name: 'LOL',
    icon: '😆',
    description: 'Point and laugh uncontrollably at defeated squad enemies.',
    duration: 3.0,
    rarity: 'Epic',
    color: '#3b82f6',
    sound: 'laugh'
  },
  applause: {
    id: 'applause',
    name: 'Applause',
    icon: '👏',
    description: 'Clap with genuine sportsmanship for clutch combat moments.',
    duration: 2.8,
    rarity: 'Rare',
    color: '#06b6d4',
    sound: 'applause'
  },
  wave: {
    id: 'wave',
    name: 'Hello',
    icon: '👋',
    description: 'A friendly military wave to greet fellow Bermuda survivors.',
    duration: 2.5,
    rarity: 'Common',
    color: '#10b981',
    sound: 'wave'
  },
  flex: {
    id: 'flex',
    name: 'Power Flex',
    icon: '💪',
    description: 'Pump iron and show off peak Bermuda warrior physique.',
    duration: 3.0,
    rarity: 'Rare',
    color: '#f97316',
    sound: 'flex'
  },
  threaten: {
    id: 'threaten',
    name: 'Threaten',
    icon: '⚔️',
    description: 'Draw a menacing horizontal slash to intimidate incoming rushers.',
    duration: 2.6,
    rarity: 'Epic',
    color: '#ef4444',
    sound: 'threaten'
  },
  dab: {
    id: 'dab',
    name: 'Speed Dab',
    icon: '🔥',
    description: 'Hit a lightning-fast victory dab after pulling off a sick one-tap.',
    duration: 2.2,
    rarity: 'Rare',
    color: '#eab308',
    sound: 'dab'
  }
};

export const EMOTE_LIST: EmoteDef[] = [
  EMOTES.booyah,
  EMOTES.dance,
  EMOTES.laugh,
  EMOTES.applause,
  EMOTES.wave,
  EMOTES.flex,
  EMOTES.threaten,
  EMOTES.dab
];
