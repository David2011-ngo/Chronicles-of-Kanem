export interface GDDSection {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  summary: string;
  directorNotes: string;
  techArchitectNotes: string;
  subsections: {
    heading: string;
    body: string[];
    specs?: { key: string; val: string }[];
    codeSnippet?: { language: string; code: string };
  }[];
}

export const MASTER_GDD_SECTIONS: GDDSection[] = [
  {
    id: 'executive-summary',
    title: 'Executive Vision & Core Pillars',
    subtitle: 'High-Octane Competitive Mobile Battle Royale Architecture',
    iconName: 'Sparkles',
    summary: 'A fast-paced, 50-player tactical mobile Battle Royale engineered with snappy 10-minute match pacing, instant defensive Gloo Wall deploy mechanics, deep hybrid character synergies, and seamless cross-tier client parity running from $80 entry-level smartphones to $1,500 flagship devices.',
    directorNotes: 'Mobile Battle Royales often fail when matches exceed 15-20 minutes or when sluggish input makes gunplay feel unresponsive. Our core directive is "Fast, Snappy, Decisive". Every combat interaction must offer counter-play via instant deployable physical cover (Gloo Walls), rapid skill combination, and high-stakes round-based economy in Clash Squad.',
    techArchitectNotes: 'We adopt a "Unified Core / Bifurcated Presentation" architecture. Both the Standard Client (compact APK, ASTC 6x6, vertex-lit shaders) and Enhanced Client (URP, PBR materials, dynamic cascading shadow maps, 120 FPS) connect to identical authoritative 30Hz game servers using identical protocol buffers and synchronized physics collision hulls.',
    subsections: [
      {
        heading: '1.1 The Three Non-Negotiable Game Pillars',
        body: [
          'Pillar I: Instant Tactical Counterplay (The Gloo Wall Factor) — Players caught in open terrain are never helpless. Dedicated one-tap instant deployable ice barriers create micro-arenas and dynamic defensive flanking lines within 0.15 seconds.',
          'Pillar II: Micro-Session Density (10-Minute Target BR) — Zone collapse curves, aggressive circle shrinkage, high ground-coin drops, and dynamic airdrops keep player engagement high from drop-plane to Booyah/Victory.',
          'Pillar III: Fair Competitive Parity — No pay-to-win ability locks. All character active and passive abilities are completely maxed out immediately upon acquisition via earnable in-game currency. Monetization focuses on aesthetic Evo Guns, custom animations, banners, and affinity cosmetics.'
        ]
      },
      {
        heading: '1.2 Key Design Constraints & Device Target Specs',
        body: [
          'Target RAM: Standard Client must run rock-solid in under 800MB RAM footprint on 2GB devices without Out-Of-Memory (OOM) OS kill events.',
          'Input Latency: Touch-to-screen glass response budgeted at <35ms for Gloo Wall tap and fire trigger.',
          'Network Resilience: Seamless handling of packet loss up to 12% and latency spikes up to 180ms via client-side extrapolation and server rewind buffers.'
        ],
        specs: [
          { key: 'Target Match Length', val: '9.5 to 11.0 Minutes (Average 610 seconds)' },
          { key: 'Lobby Player Count', val: '50 Players (Solo, Duo, Squad 4-Man)' },
          { key: 'Tick Rate (Dedicated Server)', val: '30 Hz Authoritative Delta Compression' },
          { key: 'Client FPS Targets', val: 'Standard: Locked 60 FPS / Enhanced: 120 FPS' }
        ]
      }
    ]
  },
  {
    id: 'core-game-modes',
    title: 'Core Game Modes & Session Loops',
    subtitle: '50-Player BR, 4v4 Clash Squad, Craftland UGC, and Arcade Suites',
    iconName: 'Swords',
    summary: 'Four distinct pillar modes serving high-stakes competitive esports, short burst tactical duels, custom community sandbox creations, and cooperative PvE horde battles.',
    directorNotes: 'While 50-player BR is our signature flagship experience, Clash Squad 4v4 provides rapid esports tournament accessibility with round-based weapon purchasing, while Craftland empowers community creators to generate viral mini-games.',
    techArchitectNotes: 'Game modes run as stateless room scripts loaded into dedicated game servers via Docker containers orchestrated by Agones on Kubernetes. The exact same game client executes BR, CS, or UGC by instantiating modular state-machine scripts.',
    subsections: [
      {
        heading: '2.1 Battle Royale (50 Players, 10-Minute Dynamic Loop)',
        body: [
          'Session Lifecycle: 40-second pre-match waiting island -> 30-second flight path drop with high-velocity glide -> 8 contracting safe zone phases -> Final sudden death collapse.',
          'Dynamic Safe Zones: Unlike static circles, zone centres are biased towards terrain intersections and avoid empty ocean bodies. Damage scales from 1 HP/s in Phase 1 up to 30 HP/s in Phase 8 (lethal in under 7 seconds without heal).',
          'Dynamic Airdrops: Three tiered airdrop categories: Standard Green Crates (Loot Tier 2), Red Orbital Drops (Tier 3 weapons, AWM, Lv3 armor), and Defense Supply Beacons (contains 3 Gloo Walls + Super Medkits).'
        ],
        specs: [
          { key: 'Total Match Duration', val: '600s to 660s (10 - 11 mins)' },
          { key: 'Flight Speed', val: '120 m/s at 800m altitude' },
          { key: 'Initial Circle Radius', val: '650 meters (covers ~42% of map surface)' },
          { key: 'Coin Spawn Density', val: '120-180 currency nodes per POI cluster' }
        ]
      },
      {
        heading: '2.2 Clash Squad 4v4 (Round-Based Tactical Economy)',
        body: [
          'Structure: Best-of-7 rounds (first to 4 round wins). Two squads of 4 spawn in symmetrical urban combat zones cordoned by an impenetrable barrier for 15 seconds pre-round.',
          'Economy Engine: Round 1 starts with $500 baseline cash (pistol round). Subsequent rounds award cash based on win/loss outcome and kill bounties.',
          'Loss Streak Compensation: Prevents one-sided snowballs. Consecutive losses award escalating budgets: Loss 1 = $1400, Loss 2 = $1600, Loss 3 = $2400, Loss 4+ = $3000 cap.',
          'Individual Performance Bounty: $200 awarded instantly per enemy knockdown; $100 bonus for reviving a squadmate.'
        ],
        specs: [
          { key: 'Pre-round Buy Timer', val: '15 seconds' },
          { key: 'Combat Round Timer', val: '90 seconds + 30s zone collapse' },
          { key: 'Max Retained Coins', val: '$9,900 cap' },
          { key: 'Equipment Carryover', val: 'Surviving players retain armor and weapons into next round' }
        ]
      },
      {
        heading: '2.3 Craftland UGC (User-Generated Content) Suite',
        body: [
          'Architecture: A visual drag-and-drop spatial level editor paired with a node-based event-trigger scripting engine.',
          'Player Creation Tools: Terrain sculpting, modular structure placement (ramps, towers, bounce pads, death traps), and customizable trigger nodes (e.g. OnPlayerKill -> SpawnGlooWall -> GrantCash).',
          'Map Distribution: Creators publish maps with unique 9-digit alphanumeric Map IDs. Maps undergo automated physics bake and polycount budgets (<35,000 tris) before entering global matchmaking.'
        ]
      },
      {
        heading: '2.4 Duels & Arcade: Lone Wolf 1v1/2v2 & Zombie Hunt',
        body: [
          'Lone Wolf (1v1 / 2v2): Compact tactical coliseums (Iron Cage). In round 1, Player A selects weapons for both combatants. In round 2, Player B selects weapons. First to 5 round victories wins.',
          'Team Deathmatch (TDM): Fast-paced 4v4 in compact industrial yards with instant respawn (3 seconds) and infinite Gloo Wall regeneration; first squad to 40 eliminations claims the match.',
          'Zombie Hunt PvE (Rotating Mode): 4-player cooperative survival across 5 progressive waves with currency earned to purchase turret defenses, elemental ammo mods, and culminate in an epic multi-phase Cyber Behemoth boss fight.'
        ]
      }
    ]
  },
  {
    id: 'character-skill-architecture',
    title: 'Character, Skill & Companion Architecture',
    subtitle: '1 Active + 3 Passives Hybrid Slot Matrix & Companion Pets',
    iconName: 'Users',
    summary: 'A competitive, deep build-crafting framework combining one active ability, three passive ability slots, and a specialized companion pet utility perk, completely decoupled from pay-to-win stat gates.',
    directorNotes: 'Monetizing raw character power kills competitive mobile integrity. All characters and abilities are unlocked at full level 100% capacity using earnable in-game Gold currency. Monetization is reserved for cosmetic Bond/Affinity progression: character lore voicelines, exclusive mythic outfits, custom animations, and kill banners.',
    techArchitectNotes: 'The Skill System uses a decoupled Component-Entity-System (CES). Abilities are defined as serialized ScriptableObjects in Unity that implement IActiveSkill or IPassiveSkill interfaces. The server executes ability logic authoritatively and dispatches state synchronization packets.',
    subsections: [
      {
        heading: '3.1 The Hybrid Slot System (1 Active + 3 Passives)',
        body: [
          'Each player loadout consists of exactly ONE Active Skill (activated via primary HUD button, governed by cooldown timers) and THREE Passive Skills (permanent stat modifications, condition-triggered perks, or aura buffs).',
          'Archetype Synergies: Competitive squads balance diverse roles: The Entry Rusher (Tatsuya + Kelly + Jota + Hayato), The Tactical Anchor (Chrono + Andrew + Maxim + Shirou), and The Recon Medic (Dimitri + Moco + Rafael + Kelly).',
          'Skill Stacking Rules: Percentage buffs of the exact same category stack multiplicatively, capping at +35% movement speed and +80% armor penetration to avoid game-breaking exploits.'
        ]
      },
      {
        heading: '3.2 Affinity / Bond Leveling System',
        body: [
          'Playing matches with a character accrues Bond Experience (10 XP per match minute + 25 XP per knockdown).',
          'Bond Level 1: Character Background Lore Audio Diary + Profile Avatar.',
          'Bond Level 2: Signature Tactical Emote & Dynamic Lobby Stance.',
          'Bond Level 3: Exclusive High-Tier Legendary Outfit Set.',
          'Bond Level 4: Mythic Character Title tag visible in kill broadcasts.'
        ]
      },
      {
        heading: '3.3 Companion Pet System (Secondary Tactical Perks)',
        body: [
          'Companion Pets follow the player as dynamic animated companions (automatically concealed inside foliage and smoke to prevent revealing player positions).',
          'Non-Combat Utility: Pets provide passive mechanical support, such as Mr. Waggor generating Gloo Walls every 100s when low, Ottero converting Medkit healing into EP, and Falco accelerating team parachute dive rates.',
          'Universal Pet Skills: Pet skills can be swapped across any pet model once unlocked, ensuring players use their favorite aesthetic companion without being forced into an unwanted visual.'
        ]
      }
    ]
  },
  {
    id: 'combat-tactical-mechanics',
    title: 'Combat, Utility & Tactical Mechanics',
    subtitle: 'Gloo Walls, In-Match Coins, Revival Beacons, and Traversal',
    iconName: 'Shield',
    summary: 'Signature competitive mechanics centered on lightning-fast Gloo Wall physical barriers, ground coin redemption at distributed Vending Machines, multi-layered redeployment systems, and high-mobility traversal.',
    directorNotes: 'The Gloo Wall is the defining tactical mechanic of our Battle Royale. It transforms open fields into dynamic arenas where players can block snipers, create healing alcoves, and execute aggressive wall-hopping maneuvers.',
    techArchitectNotes: 'Gloo Wall placement is computed with a client-side raycast origin 1.8 meters ahead of player camera, validated by the server for terrain mesh penetration. Once spawned, it instantiates an opaque Convex Mesh Collider with 600 HP, synchronized via networked entity state.',
    subsections: [
      {
        heading: '4.1 Instant Cover Gloo Walls: Mechanics & Physics',
        body: [
          'Deployment Latency: Dedicated quick-cast button allows instantaneous deployment in 0.12 seconds without manually selecting the grenade throw trajectory.',
          'Collider Attributes: 600 Base HP, 3.2m width x 2.4m height curved barrier. Completely blocks kinetic bullets, vehicle collisions, and standard explosive shockwaves.',
          'Decay & Degradation: Takes 100% damage from bullets. Evo AK47 Draco deals +25% bonus damage to Gloo Walls. M82B Anti-Materiel Sniper penetrates Gloo Walls dealing 80% damage to players behind.',
          'Natural Melt Timer: Automatically dissolves into water vapor after 45 seconds to prevent map congestion.'
        ],
        specs: [
          { key: 'Gloo Wall Base HP', val: '600 Hit Points' },
          { key: 'Deployment Distance', val: '1.8m to 3.5m forward raycast' },
          { key: 'Natural Lifetime', val: '45 seconds' },
          { key: 'Inventory Capacity', val: 'Standard: Max 3 | Mr. Waggor: Produces up to 2' }
        ]
      },
      {
        heading: '4.2 In-Match Economy: Coins & Vending Machines',
        body: [
          'Coin Economy: In-Match Coins spawn as golden holographic items across all ground loot tiers (stacks of 100, 200, and 300). Eliminating an enemy transfers 50% of their carried coins to their death box.',
          'Vending Machine Placement: Approximately 24-30 armored Vending Machines distributed across key POIs and isolated crossroads.',
          'Catalog Offerings: Teammate Revival Cards (400 Coins), Upgrade Chips (300 Coins), Level 3 Armor/Helmets, Gloo Wall bundles, and UAV Radar Scanners.'
        ]
      },
      {
        heading: '4.3 Multi-Layered Revival & Redeployment Systems',
        body: [
          'Layer 1: Manual Squadmate Revive — 5-second channel on downed teammate within 2m. Downed player has 100 bleed-out HP (ticks down at 4 HP/s).',
          'Layer 2: Localized Revival Capture Points — Stationary holographic beacons. Standing inside the 8m capture zone for 25 seconds revives all eliminated squad members simultaneously, but broadcasts an audible siren and visual smoke beacon to all nearby enemies.',
          'Layer 3: Vending Machine Revival Cards — Purchased for 400 Coins; immediately redeploys the target teammate via parachute drop directly above the machine.'
        ]
      },
      {
        heading: '4.4 Weapon Upgrades & 7-Tier Evo Gun System',
        body: [
          'Standard Weapon Upgrades: Collectible Upgrade Chips (Tier I, II, III) can be slotted into compatible weapons (M4A1, MP5, SCAR) to enhance fire rate, damage falloff curves, and magazine capacity.',
          'Evo Gun System (Levels 1 to 7): Legendary weapon skins featuring progressive 3D mesh evolution, custom firing audio, animated kill broadcast banners, hit particle effects, and exclusive victory emotes unlocked at Level 7.'
        ]
      },
      {
        heading: '4.5 Traversal & Spatial Mobility Systems',
        body: [
          'Vehicles: Dual-cab Pickup Truck (high durability, 4 seats), Amphibious APC (water and land travel), and Sports Car (high top speed 115 km/h, vulnerable tires).',
          'Ziplines: Pre-placed high-tension cable networks bridging high mountain peaks to valley POIs. Speeds travel at 22 m/s; players can fire one-handed SMGs while sliding.',
          'Deployable Launch Pads: Found in airdrops. Players drop a bounce trampoline to launch themselves 180 meters across the map in high arc flight.'
        ]
      }
    ]
  },
  {
    id: 'biomes-environment',
    title: 'Environment & Tactical Map Design',
    subtitle: '4 Diverse Biomes, Zero-Gravity Zones & Spatial Portals',
    iconName: 'MapPin',
    summary: 'Four meticulously designed biomes optimized for tactical diversity, line-of-sight balance, micro-cover density, and dynamic spatial gimmicks including zero-G combat domes and quantum portals.',
    directorNotes: 'A great Battle Royale map is a collection of hundreds of mini-arenas. Sightlines must never exceed 250 meters in open fields without intermediate terrain folds, rocks, or trees providing natural cover.',
    techArchitectNotes: 'Maps are partitioned using an 8x8 spatial grid chunking system. Static geometry utilizes GPU mesh instancing and texture streaming. In the Zero-G zone, PhysX gravity vector is modified dynamically for player CharacterControllers.',
    subsections: [
      {
        heading: '5.1 Tactical Biome Specifications',
        body: [
          'Biome 1: Verdant Archipelago — Balanced mixed-terrain featuring colonial town squares, multi-story clocktowers, gentle hills, and bridge chokepoints.',
          'Biome 2: Kalahari Canyons — Arid desert badlands with high sandstone plateaus, sunken refineries, dry river ravines, and high-elevation sniper perches.',
          'Biome 3: Frostpeak Range — Sub-zero alpine peaks, pine tree forests, frozen riverways (slick vehicle physics), and dynamic blizzard weather cycles.',
          'Biome 4: NeoScylla 2099 — Sci-fi metropolis with magnetic mag-lev tracks, neon skyscraper bases, zero-gravity combat chambers, and teleportation gateways.'
        ]
      },
      {
        heading: '5.2 Zero-Gravity Chambers & Teleportation Gateways',
        body: [
          'Zero-G Physics: Inside the NeoScylla Orbital Sphere, gravity is reduced to 0.25G. Players jump 4x higher, descend slowly, and can deploy Gloo Walls horizontally in mid-air to create airborne floating cover platforms.',
          'Quantum Portals: Linked portal pairs (Gateway A to B) allow instant instantaneous translation across 300m distances with a 15-second cooldown per player.'
        ]
      }
    ]
  },
  {
    id: 'meta-progression-integrity',
    title: 'Meta-Progression, Integrity & Social Ecosystem',
    subtitle: '100-Point Honor Score, Weapon Mastery & Guild GvG',
    iconName: 'Award',
    summary: 'A robust player retention and integrity ecosystem featuring a strict 100-point behavioral rating system, deep per-weapon mastery milestones, and competitive Guild vs. Guild tournament pathways.',
    directorNotes: 'Toxicity, AFK rage-quitting, and deliberate griefing ruin mobile squad matchmaking. The 100-point Honor Score enforces accountability with automatic ranked locks, while rewarding positive team players with free seasonal crates.',
    techArchitectNotes: 'Honor score updates are processed via asynchronous microservices listening to match conclusion telemetry events (e.g. AFK detection via zero client input packets for >60s, verbal report NLP, friendly fire flags).',
    subsections: [
      {
        heading: '6.1 The 100-Point Behavioral Integrity Honor Score',
        body: [
          'All players begin at 100 points (Exemplary Standing).',
          'Penalties: AFK in Clash Squad = -8 points. AFK in Battle Royale = -5 points. Confirmed verbal toxicity report = -4 points. Deliberate friendly grenade griefing = -10 points.',
          'Threshold Tier Locks: Score 90-99 = Normal; Score 80-89 = Locked from Clash Squad Ranked; Score 60-79 = Locked from ALL Ranked Modes; Score <60 = Multiplayer Quarantine (only bot matches).',
          'Rehabilitation: Playing consecutive clean multiplayer or bot matches without report restores +1 to +2 points per match (capped at +5 recovery points per day).'
        ]
      },
      {
        heading: '6.2 Weapon Mastery Progression System',
        body: [
          'Every firearm tracks lifetime kills, headshots, total damage, and victories.',
          'Mastery Tiers: Recruit -> Marksman -> Specialist -> Master -> Grandmaster.',
          'Milestone Unlocks: Custom glowing golden iron-sights, weapon charm cosmetics, dynamic holographic kill trackers on the gun receiver, and the prestigious "Apex Weapon Master" title.'
        ]
      },
      {
        heading: '6.3 Guild Ecosystem & Weekly GvG War Schedule',
        body: [
          'Guilds accommodate up to 50 players with shared progression and daily guild activity score.',
          'Guild Wars: Every Saturday and Sunday evening, guilds compete in structured 4v4 Clash Squad brackets against similarly rated regional guilds, earning Guild Badges and exclusive clan tag colors.'
        ]
      }
    ]
  },
  {
    id: 'client-architecture-dual-pipeline',
    title: 'Client Architecture & Dual-Graphics Pipeline',
    subtitle: 'Standard vs Enhanced Profile, Netcode & Cross-Play Parity',
    iconName: 'Cpu',
    summary: 'Engine engineering on Unity utilizing a bifurcated rendering architecture: a lightweight Standard Profile for low-tier hardware and an Enhanced Profile for flagship devices, connected to a unified authoritative server.',
    directorNotes: 'The absolute core technical requirement: A player on a $75 Android phone playing the Standard Client MUST be able to squad up and fight on identical competitive terms against a friend playing on an iPhone 16 Pro running the Enhanced Client. Physics, collision boxes, and fire rates must remain 100% synchronized.',
    techArchitectNotes: 'We maintain strict asset parity at LOD0 bounding boxes and server-side hitboxes. The Standard Client strips high-order PBR maps and utilizes lightweight vertex-lit shaders, whereas the Enhanced Client renders full 4-cascade shadow maps and Screen-Space Ambient Occlusion.',
    subsections: [
      {
        heading: '7.1 Dual-Client Rendering Pipeline Matrix',
        body: [
          'Standard Profile: Tailored for Snapdragon 665 / Mali-G52 class chipsets with 2GB RAM. Uses Forward Shading, ASTC 6x6 compressed textures, pre-baked lightmaps, and zero dynamic point lights. Memory ceiling is strictly capped at 780MB.',
          'Enhanced Profile: Tailored for flagship Snapdragon 8 Gen 2/3 and Apple Silicon. Renders at native 1080p/1440p at up to 120 FPS, featuring dynamic cascading directional shadows, screen-space reflections on water, volumetric god-rays, and an interactive 360-degree 3D character hangar lobby.'
        ]
      },
      {
        heading: '7.2 Cross-Play Infrastructure & Data Synchronization',
        body: [
          'Unified Database: Player inventory, ranked MMR, friend lists, and guild states reside in a unified distributed database cluster (Spanner / Firestore).',
          'Network Parity: All physics, bullet trajectories, and hit-detection raycasts are calculated with deterministic math on the dedicated 30Hz server. The visual fidelity differences between clients do not alter player hitboxes or line-of-sight occlusions.'
        ]
      },
      {
        heading: '7.3 Netcode & Lag Compensation Architecture',
        body: [
          'Transport Layer: High-performance UDP socket multiplexing utilizing KCP protocol for rapid reliable delivery of critical game events (weapon firing, skill triggers, Gloo Wall placements).',
          'Lag Compensation: The server retains a circular history buffer of player positions for 250 milliseconds. When a client fires, their local timestamp is sent; the server rewinds all player hitboxes to that exact historical tick to evaluate hit validity, eliminating the need to "lead" shots against high-ping targets.'
        ]
      }
    ]
  }
];
