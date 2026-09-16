import { Weapon, EvoGun } from '../types';

export const WEAPONS: Weapon[] = [
  {
    id: 'w-ak47',
    name: 'AK47 Draco-Spec',
    category: 'AR',
    damage: 61,
    rateOfFire: 56,
    range: 73,
    reloadSpeed: 41,
    magazine: 30,
    accuracy: 45,
    upgradeChipCompatible: true,
    tierStats: {
      t0: { damage: 61, fireRate: 56 },
      t1: { damage: 63, fireRate: 58 },
      t2: { damage: 65, fireRate: 61 },
      t3: { damage: 68, fireRate: 64 }
    }
  },
  {
    id: 'w-mp40',
    name: 'MP40 Cobra',
    category: 'SMG',
    damage: 48,
    rateOfFire: 83,
    range: 22,
    reloadSpeed: 48,
    magazine: 32,
    accuracy: 17,
    upgradeChipCompatible: true,
    tierStats: {
      t0: { damage: 48, fireRate: 83 },
      t1: { damage: 49, fireRate: 86 },
      t2: { damage: 51, fireRate: 89 },
      t3: { damage: 53, fireRate: 93 }
    }
  },
  {
    id: 'w-m1887',
    name: 'M1887 Double Barrel',
    category: 'Shotgun',
    damage: 100,
    rateOfFire: 42,
    range: 21,
    reloadSpeed: 55,
    magazine: 2,
    accuracy: 10,
    upgradeChipCompatible: false
  },
  {
    id: 'w-m1014',
    name: 'M1014 Auto-Shotgun',
    category: 'Shotgun',
    damage: 94,
    rateOfFire: 38,
    range: 14,
    reloadSpeed: 20,
    magazine: 6,
    accuracy: 10,
    upgradeChipCompatible: true,
    tierStats: {
      t0: { damage: 94, fireRate: 38 },
      t1: { damage: 96, fireRate: 41 },
      t2: { damage: 98, fireRate: 44 },
      t3: { damage: 102, fireRate: 47 }
    }
  },
  {
    id: 'w-awm',
    name: 'AWM Magnum Arctic',
    category: 'Sniper',
    damage: 90,
    rateOfFire: 27,
    range: 91,
    reloadSpeed: 34,
    magazine: 5,
    accuracy: 90,
    upgradeChipCompatible: false
  },
  {
    id: 'w-woodpecker',
    name: 'Woodpecker DMR',
    category: 'Marksman',
    damage: 72,
    rateOfFire: 39,
    range: 63,
    reloadSpeed: 48,
    magazine: 12,
    accuracy: 69,
    upgradeChipCompatible: false
  },
  {
    id: 'w-m4a1',
    name: 'M4A1 Carbine',
    category: 'AR',
    damage: 53,
    rateOfFire: 57,
    range: 68,
    reloadSpeed: 48,
    magazine: 30,
    accuracy: 55,
    upgradeChipCompatible: true,
    tierStats: {
      t0: { damage: 53, fireRate: 57 },
      t1: { damage: 55, fireRate: 60 },
      t2: { damage: 58, fireRate: 63 },
      t3: { damage: 61, fireRate: 67 }
    }
  },
  {
    id: 'w-deagle',
    name: 'Desert Eagle .50',
    category: 'Pistol',
    damage: 90,
    rateOfFire: 33,
    range: 38,
    reloadSpeed: 69,
    magazine: 7,
    accuracy: 45,
    upgradeChipCompatible: false
  }
];

export const EVO_GUNS: EvoGun[] = [
  {
    id: 'evo-ak47-draco',
    name: 'AK47 - Blue Flame Draco',
    baseWeapon: 'AK47',
    elementTheme: 'Draconic Azure Plasma',
    accentColor: '#38bdf8',
    maxLevel: 7,
    tiers: [
      {
        level: 1,
        title: 'Draco Hatchling',
        features: ['Base draconic skin geometry', 'Subtle blue bioluminescent barrel glow'],
        statBuffs: 'Damage +1 | Rate of Fire +1 | Movement Speed -1',
        visualUnlock: 'Level 1: Basic Dragon Scale Model',
        killBannerVfx: 'Standard Blue Broadcast Tag',
        exclusiveEmote: 'Locked'
      },
      {
        level: 2,
        title: 'Kill Broadcast Unleashed',
        features: ['Custom animated kill feed alert with draconic claw imprint', 'Enhanced muzzle shimmer'],
        statBuffs: 'Damage +1 | Rate of Fire +1 | Movement Speed -1',
        visualUnlock: 'Level 2: Metallic Dragon Bone Sight Rail',
        killBannerVfx: 'Animated Azure Flame Kill Banner with Roar Sound',
        exclusiveEmote: 'Locked'
      },
      {
        level: 3,
        title: 'Draco Wing Evolution',
        features: ['Articulated mechanical dragon wings sprout from receiver', 'Pulsing cyan energy veins'],
        statBuffs: 'Damage +1 | Rate of Fire +1 | Movement Speed -1',
        visualUnlock: 'Level 3: Articulated Wing Mesh Geometry',
        killBannerVfx: 'Azure Flame Kill Banner with Roar Sound',
        exclusiveEmote: 'Locked'
      },
      {
        level: 4,
        title: 'Draco Plasma Hit Effect',
        features: ['Custom target hit particle burst: Ice-blue dragon breath flashes upon bullet impact'],
        statBuffs: 'Damage +2 | Rate of Fire +1 | Movement Speed -1',
        visualUnlock: 'Level 4: Glowing Horns on Gas Tube',
        killBannerVfx: 'Upgraded Kill Banner with Dragon Wing Frame',
        exclusiveEmote: 'Locked'
      },
      {
        level: 5,
        title: 'Firing & Kill VFX Burst',
        features: ['Continuous flame breath muzzle flash', 'Target elimination spawns an ascending phantom dragon spirit'],
        statBuffs: 'Damage +2 | Rate of Fire +1 | Reload Speed -1',
        visualUnlock: 'Level 5: Dual Spine Spikes & Wing Flares',
        killBannerVfx: 'Dynamic Holographic Skull & Dragon Head Broadcast',
        exclusiveEmote: 'Locked'
      },
      {
        level: 6,
        title: 'Alpha Draco Morph',
        features: ['Full biological morph: Dragon eyes blink, jaw articulates during reload sequence', 'Additional damage to Gloo Walls'],
        statBuffs: 'Damage +2 | Rate of Fire +2 | Movement Speed -1 | +15% Damage to Gloo Walls',
        visualUnlock: 'Level 6: Full Dragon Skull Receiver Geometry',
        killBannerVfx: 'Full Screen Shaker Azure Draco Broadcast',
        exclusiveEmote: 'Locked'
      },
      {
        level: 7,
        title: 'Max Draco Sovereign & Exclusive Emote',
        features: [
          'Permanent Azure aura shrouding the weapon',
          'Exclusive Emote: "Draco Summoning" (Player ascends on dragon wings breathing flame into the sky)',
          'Custom reload sound effect and bullet casing vapor particles'
        ],
        statBuffs: 'Damage +2 | Rate of Fire +2 | Movement Speed Normal | +25% Damage to Gloo Walls',
        visualUnlock: 'Level 7: Sovereign Azure Plasma Crown & Flaming Wings',
        killBannerVfx: 'Mythic Blue Draco Global Kill Broadcast with Roar',
        exclusiveEmote: 'Unlocked: "Draco Summoning" Apex Emote'
      }
    ]
  },
  {
    id: 'evo-mp40-cobra',
    name: 'MP40 - Predatory Cobra',
    baseWeapon: 'MP40',
    elementTheme: 'Crimson Venom Serpent',
    accentColor: '#ef4444',
    maxLevel: 7,
    tiers: [
      {
        level: 1,
        title: 'Viper Strike',
        features: ['Crimson snake scale receiver plating', 'Twin red fang sights'],
        statBuffs: 'Damage +1 | Rate of Fire +1 | Reload Speed -1',
        visualUnlock: 'Level 1: Red Scale Alloy Shell',
        killBannerVfx: 'Red Serpent Kill Alert',
        exclusiveEmote: 'Locked'
      },
      {
        level: 2,
        title: 'Venom Kill Broadcast',
        features: ['Blood-red customized kill notification with dripping venom particles'],
        statBuffs: 'Damage +1 | Rate of Fire +1 | Reload Speed -1',
        visualUnlock: 'Level 2: Cobra Hood Barrel Shroud',
        killBannerVfx: 'Animated Venom Drip Kill Banner',
        exclusiveEmote: 'Locked'
      },
      {
        level: 3,
        title: 'Cobra Hood Manifest',
        features: ['Dynamic cobra hood that flares outward when aiming down sights'],
        statBuffs: 'Damage +1 | Rate of Fire +1 | Reload Speed -1',
        visualUnlock: 'Level 3: Expanded Flaring Hood Geometry',
        killBannerVfx: 'Animated Venom Drip Kill Banner',
        exclusiveEmote: 'Locked'
      },
      {
        level: 4,
        title: 'Bio-Toxin Impact VFX',
        features: ['Splashing toxic crimson acid bursts upon hitting enemies'],
        statBuffs: 'Damage +2 | Rate of Fire +1 | Reload Speed -1',
        visualUnlock: 'Level 4: Bio-Luminescent Spine Ridges',
        killBannerVfx: 'Cobra Head Framed Kill Broadcast',
        exclusiveEmote: 'Locked'
      },
      {
        level: 5,
        title: 'Fang Firing & Slain VFX',
        features: ['Venom needle muzzle sparks', 'Eliminated foes dissolve in a crimson snake spiral'],
        statBuffs: 'Damage +2 | Rate of Fire +1 | Accuracy -1',
        visualUnlock: 'Level 5: Dual Poison Gas Vents on Stock',
        killBannerVfx: 'Blood Cobra Strike Banner with Hissing Sound',
        exclusiveEmote: 'Locked'
      },
      {
        level: 6,
        title: 'King Cobra Apex',
        features: ['Full serpent body entwined along barrel', 'Bonus damage when shooting moving targets'],
        statBuffs: 'Damage +2 | Rate of Fire +2 | Reload Speed -1 | +12% Damage vs Sprinting Foes',
        visualUnlock: 'Level 6: Golden Crowned Cobra Skull',
        killBannerVfx: 'Global Screen Flash Cobra Broadcast',
        exclusiveEmote: 'Locked'
      },
      {
        level: 7,
        title: 'Venom Sovereign & Apex Emote',
        features: [
          'Crimson smoke and ember aura surrounding the entire firearm',
          'Exclusive Emote: "Cobra Dance" (Player summons a giant holographic blood cobra coiling around their torso)',
          'Custom mechanical hiss reload animation'
        ],
        statBuffs: 'Damage +2 | Rate of Fire +2 | Movement Speed Normal | +20% Damage vs Sprinting Foes',
        visualUnlock: 'Level 7: Sovereign Blood Aura & Glowing Ruby Fangs',
        killBannerVfx: 'Mythic Red Cobra Global Kill Broadcast with Hiss & Strike',
        exclusiveEmote: 'Unlocked: "Cobra Dance" Apex Emote'
      }
    ]
  }
];
