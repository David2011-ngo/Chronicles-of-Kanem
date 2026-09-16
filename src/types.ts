export type ActiveTab = 
  | 'overview' 
  | 'gamemodes' 
  | 'characters' 
  | 'combat' 
  | 'economy' 
  | 'environment' 
  | 'progression' 
  | 'architecture' 
  | 'simulator';

export type SimulatorTool = 
  | 'gloo-wall' 
  | 'clash-squad' 
  | 'skill-builder' 
  | 'tactical-map' 
  | 'evo-workshop' 
  | 'dual-client' 
  | 'honor-score'
  | 'ugc-rules';

export type ClientProfileType = 'standard' | 'enhanced';

export interface Skill {
  id: string;
  name: string;
  type: 'active' | 'passive';
  cooldown?: number; // in seconds
  icon: string;
  category: 'mobility' | 'defense' | 'offense' | 'intel' | 'support';
  description: string;
  formula: string;
  tacticalRole: string;
}

export interface Character {
  id: string;
  name: string;
  codenamed: string;
  lore: string;
  signatureActiveSkillId: string;
  affinityRewards: { level: number; reward: string }[];
  portrait: string;
  role: 'Rusher' | 'Sniper' | 'Support' | 'Anchor' | 'Scout';
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  perkName: string;
  perkDescription: string;
  formula: string;
  icon: string;
}

export interface Weapon {
  id: string;
  name: string;
  category: 'AR' | 'SMG' | 'Shotgun' | 'Sniper' | 'Pistol' | 'Marksman';
  damage: number;
  rateOfFire: number;
  range: number;
  reloadSpeed: number;
  magazine: number;
  accuracy: number;
  upgradeChipCompatible: boolean;
  tierStats?: {
    t0: { damage: number; fireRate: number };
    t1: { damage: number; fireRate: number };
    t2: { damage: number; fireRate: number };
    t3: { damage: number; fireRate: number };
  };
}

export interface EvoGunTier {
  level: number;
  title: string;
  features: string[];
  statBuffs: string;
  visualUnlock: string;
  killBannerVfx: string;
  exclusiveEmote: string;
}

export interface EvoGun {
  id: string;
  name: string;
  baseWeapon: string;
  elementTheme: string;
  accentColor: string;
  maxLevel: number;
  tiers: EvoGunTier[];
}

export interface Biome {
  id: string;
  name: string;
  theme: string;
  tacticalDescription: string;
  distinctFeature: string;
  keyPOIs: string[];
  climateEffect: string;
  color: string;
}

export interface SafeZonePhase {
  phase: number;
  waitDurationSec: number;
  shrinkDurationSec: number;
  radiusMeters: number;
  damagePerSec: number;
  airdropCount: number;
}

export interface ClashSquadItem {
  id: string;
  name: string;
  category: 'pistols' | 'smg' | 'shotgun' | 'rifles' | 'armor' | 'utility';
  cost: number;
  icon: string;
  description: string;
  maxPerRound?: number;
}

export interface HardwareProfileBenchmark {
  specTarget: string;
  targetResolution: string;
  targetFramerate: string;
  drawCallsAverage: number;
  vertexBudget: string;
  textureBudget: string;
  ramUsageMB: number;
  initialApkSizeMB: number;
  shadingModel: string;
  shadowModel: string;
  postProcessing: string[];
}
