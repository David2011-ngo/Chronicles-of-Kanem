import { Biome } from '../types';

export const BIOMES: Biome[] = [
  {
    id: 'biome-mixed',
    name: 'Verdant Archipelago (Balanced Mixed)',
    theme: 'Temperate Coastal & Urban Complexes',
    tacticalDescription: 'Balanced multi-tier landscape featuring colonial township grids, clocktower verticalities, gentle rolling highlands, and wide river crossings.',
    distinctFeature: 'High tactical diversity: Urban CQB, mid-range hill-peeking, and dynamic water bridge chokepoints.',
    keyPOIs: ['Clocktower Citadel', 'Central Peak Observatory', 'Pochinok Residential', 'Dry Docks Warehouse'],
    climateEffect: 'Clear daylight with high visibility and natural tree foliage soft cover.',
    color: '#10b981'
  },
  {
    id: 'biome-arid',
    name: 'Kalahari Canyons (Arid Badlands)',
    theme: 'Sunken Quarries & High Mesa Escarpments',
    tacticalDescription: 'Dramatic vertical elevation with sheer sandstone cliffs, sunken industrial refineries, and long-range sniper plateaus connected by high-tension ziplines.',
    distinctFeature: 'Extreme verticality where controlling high ground dictates zone rotations; grapple guns and zipline interception are paramount.',
    keyPOIs: ['The Refinery Core', 'Santa Catarina Stranded Ship', 'Council Hall Amphitheater', 'Sub-Zero Cave'],
    climateEffect: 'Dry heat shimmer with occasional sand squalls dampening gunfire audio past 120m.',
    color: '#f59e0b'
  },
  {
    id: 'biome-alpine',
    name: 'Frostpeak Range (Alpine Sub-Zero)',
    theme: 'Glacial Valleys, Pine Ridge & Industrial Rail',
    tacticalDescription: 'Snow-capped mountain pass with dense pine cover, frozen river ice sheets (low friction vehicle sliding), and modular alpine research stations.',
    distinctFeature: 'Dynamic blizzard squalls that temporarily reduce vision to 40 meters, forcing squads into intense infrared or sound-based close quarters.',
    keyPOIs: ['Snowfall Research Station', 'Fusion Power Substation', 'Railroad Freight Terminal', 'Vantage Point Ridge'],
    climateEffect: 'Sub-zero blizzards causing audio dampening and icy terrain physics modifier on vehicle traction.',
    color: '#06b6d4'
  },
  {
    id: 'biome-scifi',
    name: 'NeoScylla 2099 (Futuristic Sci-Fi)',
    theme: 'Anti-Gravity Rings & Quantum Portals',
    tacticalDescription: 'Next-gen metropolis built around an orbital magnetic accelerator. Features permanent Zero-Gravity combat chambers and instantaneous quantum teleportation gateways.',
    distinctFeature: 'Zero-G Chambers allow 3D aerial jumping and mid-air Gloo Wall placement. Teleportation portals allow instant tactical squad flanking across 300m distances.',
    keyPOIs: ['Zero-G Orbital Sphere', 'Quantum Gateway Node A & B', 'Mag-Lev Sky-Train Track', 'Plasma Core Tower'],
    climateEffect: 'Neon bioluminescence, magnetic particle storms that cause minor minimap static interference.',
    color: '#8b5cf6'
  }
];
