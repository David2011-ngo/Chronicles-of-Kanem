export type WeaponId = 'm1887' | 'mp40' | 'ak47' | 'awm' | 'deagle' | 'fists';

export interface WeaponDef {
  id: WeaponId;
  name: string;
  category: 'Shotgun' | 'SMG' | 'AR' | 'Sniper' | 'Pistol' | 'Melee';
  damage: number; // base body damage
  headshotMultiplier: number;
  fireRate: number; // shots per sec
  magazineSize: number;
  reloadTime: number; // seconds
  range: number;
  bulletSpeed: number;
  spread: number; // radians
  color: string;
  icon: string;
}

export type CharacterId = 'alok' | 'chrono' | 'kelly' | 'hayato' | 'wukong';

export interface CharacterDef {
  id: CharacterId;
  name: string;
  title: string;
  skillName: string;
  skillType: 'active' | 'passive';
  cooldown: number; // seconds
  duration: number; // seconds
  description: string;
  color: string;
}

export type EmoteId =
  | 'booyah'
  | 'dance'
  | 'laugh'
  | 'applause'
  | 'wave'
  | 'flex'
  | 'threaten'
  | 'dab';

export type EmoteRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface EmoteDef {
  id: EmoteId;
  name: string;
  icon: string; // Emoji or visual symbol
  description: string;
  duration: number; // in seconds
  rarity: EmoteRarity;
  color: string;
  sound: 'booyah' | 'dance' | 'laugh' | 'applause' | 'wave' | 'flex' | 'threaten' | 'dab';
}

export interface ActiveEmote {
  id: EmoteId;
  name: string;
  icon: string;
  color: string;
  startTime: number;
  duration: number;
  elapsed: number;
}

export interface GroundItem {
  id: string;
  x: number;
  y: number;
  z?: number;
  type: 'weapon' | 'ammo' | 'gloo' | 'medkit' | 'vest' | 'helmet' | 'mushroom';
  weaponId?: WeaponId;
  amount?: number;
  level?: number;
}

export interface GlooWall {
  id: string;
  x: number;
  y: number;
  z?: number;
  angle: number; // orientation facing
  hp: number;
  maxHp: number;
  ownerId: string;
  placedAt: number;
}

export interface Bullet {
  id: string;
  x: number;
  y: number;
  z?: number;
  prevX: number;
  prevY: number;
  prevZ?: number;
  vx: number;
  vy: number;
  vz?: number;
  damage: number;
  headshotMult: number;
  rangeRemaining: number;
  shooterId: string;
  weaponId: WeaponId;
  color: string;
}

export interface DamagePopup {
  id: string;
  x: number;
  y: number;
  z?: number;
  amount: number;
  isHeadshot: boolean;
  alpha: number;
  life: number;
}

export interface KillFeedEntry {
  id: string;
  killer: string;
  victim: string;
  weapon: string;
  isHeadshot: boolean;
  isPlayerKill: boolean;
  time: number;
}

export interface SafeZone {
  currentX: number;
  currentY: number;
  currentRadius: number;
  targetX: number;
  targetY: number;
  targetRadius: number;
  phase: number;
  timer: number;
  isShrinking: boolean;
  dps: number;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'building' | 'container' | 'rock' | 'tree' | 'fence';
  color: string;
  label?: string;
}

export interface Airdrop {
  id: string;
  x: number;
  y: number;
  landed: boolean;
  altitude: number;
  weapons: WeaponId[];
  hasLvl3Armor: boolean;
  opened: boolean;
}

export interface BotPlayer {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  hp: number;
  maxHp: number;
  vestLvl: number;
  helmetLvl: number;
  weapon: WeaponDef;
  ammo: number;
  glooWalls: number;
  isAlive: boolean;
  shootCooldown: number;
  glooCooldown: number;
  targetX: number;
  targetY: number;
  state: 'wandering' | 'hunting' | 'fleeing' | 'shooting';
  lastSeenPlayer: { x: number; y: number } | null;
  reactionTimer: number;
  z?: number;
  vz?: number;
}

export interface PlayerInput {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  aimAngle: number;
  isFiring: boolean;
  cameraYaw?: number;
  cameraPitch?: number;
  jump?: boolean;
  crouch?: boolean;
}

export interface PlayerStats {
  kills: number;
  headshots: number;
  damageDealt: number;
  survivalTime: number;
  rank: number;
  glooPlaced: number;
  medkitsUsed: number;
}
