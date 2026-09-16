import { 
  WeaponId, 
  CharacterId, 
  WeaponDef, 
  CharacterDef, 
  GroundItem, 
  GlooWall, 
  Bullet, 
  DamagePopup, 
  KillFeedEntry, 
  SafeZone, 
  Obstacle, 
  Airdrop, 
  BotPlayer, 
  PlayerStats,
  PlayerInput,
  EmoteId,
  ActiveEmote
} from './types';
import { WEAPONS, CHARACTERS, MAP_SIZE, BERMUDA_POIS, BOT_NAMES, SAFE_ZONE_STEPS, EMOTES } from './constants';
import { sound } from './audio';

export interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  health: number;
  maxHealth: number;
  ep: number; // Energy Points (max 200)
  maxEp: number;
  vestLvl: number; // 0, 1, 2, 3
  vestDurability: number;
  helmetLvl: number;
  primaryWeapon: WeaponDef | null;
  secondaryWeapon: WeaponDef | null;
  pistolWeapon: WeaponDef | null;
  activeSlot: 1 | 2 | 3;
  ammo: { ar: number; smg: number; sg: number; sniper: number };
  currentMag: number;
  glooWalls: number;
  medkits: number;
  character: CharacterDef;
  skillCooldown: number;
  skillActiveTimer: number;
  isHealing: boolean;
  healTimer: number;
  isReloading: boolean;
  reloadTimer: number;
  isShooting: boolean;
  shootCooldown: number;
  isScoping: boolean;
  z: number;
  vz: number;
  isJumping: boolean;
  isCrouching: boolean;
  cameraPitch: number;
  cameraYaw: number;
  activeEmote: ActiveEmote | null;
}

export class GameEngine {
  public player: PlayerState;
  public bots: BotPlayer[] = [];
  public obstacles: Obstacle[] = [];
  public groundItems: GroundItem[] = [];
  public glooWalls: GlooWall[] = [];
  public bullets: Bullet[] = [];
  public damagePopups: DamagePopup[] = [];
  public killFeed: KillFeedEntry[] = [];
  public airdrops: Airdrop[] = [];
  public safeZone: SafeZone;
  
  public gameState: 'lobby' | 'skydive' | 'playing' | 'gameover' | 'booyah' = 'lobby';
  public aliveCount: number = 50;
  public stats: PlayerStats = {
    kills: 0,
    headshots: 0,
    damageDealt: 0,
    survivalTime: 0,
    rank: 50,
    glooPlaced: 0,
    medkitsUsed: 0
  };

  public camera = { x: 0, y: 0, zoom: 1 };
  public skydiveAltitude = 1000;
  private safeZonePhaseIndex = 0;
  private epConvertTimer = 0;
  private matchClock = 0;
  private botIdCounter = 0;

  constructor(selectedCharacter: CharacterId = 'alok') {
    const char = CHARACTERS[selectedCharacter] || CHARACTERS.alok;

    this.player = {
      x: 1600,
      y: 1600,
      vx: 0,
      vy: 0,
      angle: 0,
      health: 200,
      maxHealth: 200,
      ep: 100,
      maxEp: 200,
      vestLvl: 1,
      vestDurability: 100,
      helmetLvl: 1,
      primaryWeapon: { ...WEAPONS.ak47 },
      secondaryWeapon: { ...WEAPONS.mp40 },
      pistolWeapon: { ...WEAPONS.deagle },
      activeSlot: 1,
      ammo: { ar: 120, smg: 150, sg: 20, sniper: 15 },
      currentMag: WEAPONS.ak47.magazineSize,
      glooWalls: 3,
      medkits: 2,
      character: char,
      skillCooldown: 0,
      skillActiveTimer: 0,
      isHealing: false,
      healTimer: 0,
      isReloading: false,
      reloadTimer: 0,
      isShooting: false,
      shootCooldown: 0,
      isScoping: false,
      z: 0,
      vz: 0,
      isJumping: false,
      isCrouching: false,
      cameraPitch: 0,
      cameraYaw: 0,
      activeEmote: null
    };

    this.safeZone = {
      currentX: MAP_SIZE / 2,
      currentY: MAP_SIZE / 2,
      currentRadius: 1500,
      targetX: MAP_SIZE / 2 + (Math.random() * 400 - 200),
      targetY: MAP_SIZE / 2 + (Math.random() * 400 - 200),
      targetRadius: 1000,
      phase: 1,
      timer: SAFE_ZONE_STEPS[0].waitDuration,
      isShrinking: false,
      dps: SAFE_ZONE_STEPS[0].dps
    };

    this.initMap();
    const safePos = this.findSafeSpawn(1600, 1600);
    this.player.x = safePos.x;
    this.player.y = safePos.y;
  }

  // Start a new match with 50 players
  public startMatch(characterId: CharacterId) {
    this.player.character = CHARACTERS[characterId] || CHARACTERS.alok;
    this.player.health = 200;
    this.player.ep = 100;
    this.player.glooWalls = 3;
    this.player.medkits = 2;
    this.player.vestLvl = 1;
    this.player.helmetLvl = 1;
    this.player.primaryWeapon = { ...WEAPONS.ak47 };
    this.player.secondaryWeapon = { ...WEAPONS.mp40 };
    this.player.currentMag = WEAPONS.ak47.magazineSize;
    this.player.ammo = { ar: 120, smg: 150, sg: 25, sniper: 15 };
    this.player.skillCooldown = 0;
    this.player.skillActiveTimer = 0;
    this.player.z = 0;
    this.player.vz = 0;
    this.player.isJumping = false;
    this.player.isCrouching = false;
    this.player.cameraPitch = 0;
    this.player.cameraYaw = 0;
    this.player.activeEmote = null;

    this.initMap();

    // Pick drop location at iconic Clock Tower / Peak area and spawn safely in clear terrain
    const dropPOI = BERMUDA_POIS[Math.floor(Math.random() * BERMUDA_POIS.length)];
    const safePos = this.findSafeSpawn(dropPOI.x, dropPOI.y);
    this.player.x = safePos.x;
    this.player.y = safePos.y;
    this.player.vx = 0;
    this.player.vy = 0;

    this.stats = {
      kills: 0,
      headshots: 0,
      damageDealt: 0,
      survivalTime: 0,
      rank: 50,
      glooPlaced: 0,
      medkitsUsed: 0
    };

    this.killFeed = [];
    this.bullets = [];
    this.damagePopups = [];
    this.glooWalls = [];
    this.aliveCount = 50;
    this.matchClock = 0;
    this.skydiveAltitude = 0;
    this.safeZonePhaseIndex = 0;

    // Reset safe zone
    this.safeZone = {
      currentX: MAP_SIZE / 2,
      currentY: MAP_SIZE / 2,
      currentRadius: 1500,
      targetX: MAP_SIZE / 2 + (Math.random() * 300 - 150),
      targetY: MAP_SIZE / 2 + (Math.random() * 300 - 150),
      targetRadius: 1000,
      phase: 1,
      timer: SAFE_ZONE_STEPS[0].waitDuration,
      isShrinking: false,
      dps: SAFE_ZONE_STEPS[0].dps
    };

    this.spawnBots();
    this.gameState = 'playing';
  }

  // Initialize Bermuda Map terrain, buildings, containers, trees
  private initMap() {
    this.obstacles = [];
    this.groundItems = [];
    this.airdrops = [];

    // Outer boundary walls
    this.obstacles.push({ x: 0, y: 0, width: MAP_SIZE, height: 40, type: 'building', color: '#1e293b' });
    this.obstacles.push({ x: 0, y: MAP_SIZE - 40, width: MAP_SIZE, height: 40, type: 'building', color: '#1e293b' });
    this.obstacles.push({ x: 0, y: 0, width: 40, height: MAP_SIZE, type: 'building', color: '#1e293b' });
    this.obstacles.push({ x: MAP_SIZE - 40, y: 0, width: 40, height: MAP_SIZE, type: 'building', color: '#1e293b' });

    // Build POIs with buildings, warehouses, containers
    BERMUDA_POIS.forEach(poi => {
      // Main Center Building
      this.obstacles.push({
        x: poi.x - 70,
        y: poi.y - 70,
        width: 140,
        height: 140,
        type: 'building',
        color: '#334155',
        label: poi.name
      });

      // Side outposts / containers
      this.obstacles.push({
        x: poi.x + 90,
        y: poi.y - 40,
        width: 60,
        height: 100,
        type: 'container',
        color: '#b91c1c'
      });

      this.obstacles.push({
        x: poi.x - 140,
        y: poi.y + 60,
        width: 80,
        height: 50,
        type: 'container',
        color: '#0369a1'
      });

      // Scatter Trees & Rocks
      for (let i = 0; i < 4; i++) {
        const ox = poi.x + (Math.random() * 320 - 160);
        const oy = poi.y + (Math.random() * 320 - 160);
        this.obstacles.push({
          x: ox,
          y: oy,
          width: 32,
          height: 32,
          type: i % 2 === 0 ? 'tree' : 'rock',
          color: i % 2 === 0 ? '#15803d' : '#64748b'
        });
      }

      // Ground Loot around POI
      this.spawnLootAround(poi.x, poi.y, 8);
    });

    // Additional scattered loot in wilderness
    for (let i = 0; i < 60; i++) {
      const rx = 100 + Math.random() * (MAP_SIZE - 200);
      const ry = 100 + Math.random() * (MAP_SIZE - 200);
      this.spawnLootAround(rx, ry, 2);
    }
  }

  private spawnLootAround(cx: number, cy: number, count: number) {
    const weaponPool: WeaponId[] = ['mp40', 'ak47', 'm1887', 'awm', 'deagle'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 120;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;

      const rand = Math.random();
      if (rand < 0.3) {
        // Weapon
        const wId = weaponPool[Math.floor(Math.random() * weaponPool.length)];
        this.groundItems.push({ id: Math.random().toString(), x, y, type: 'weapon', weaponId: wId });
      } else if (rand < 0.5) {
        // Gloo Wall Capsule
        this.groundItems.push({ id: Math.random().toString(), x, y, type: 'gloo', amount: 1 });
      } else if (rand < 0.7) {
        // Medkit
        this.groundItems.push({ id: Math.random().toString(), x, y, type: 'medkit', amount: 1 });
      } else if (rand < 0.85) {
        // Armor / Helmet
        this.groundItems.push({
          id: Math.random().toString(),
          x,
          y,
          type: Math.random() < 0.5 ? 'vest' : 'helmet',
          level: Math.random() < 0.7 ? 2 : 3
        });
      } else {
        // EP Mushroom
        this.groundItems.push({ id: Math.random().toString(), x, y, type: 'mushroom', amount: 50 });
      }
    }
  }

  // Spawn 49 AI Bots across Bermuda Island
  private spawnBots() {
    this.bots = [];
    const pool = [...BOT_NAMES];

    for (let i = 0; i < 49; i++) {
      const name = pool[i % pool.length] + (i > 30 ? `_${i}` : '');
      const poi = BERMUDA_POIS[i % BERMUDA_POIS.length];
      const bx = Math.max(100, Math.min(MAP_SIZE - 100, poi.x + (Math.random() * 600 - 300)));
      const by = Math.max(100, Math.min(MAP_SIZE - 100, poi.y + (Math.random() * 600 - 300)));

      const weaponKeys: WeaponId[] = ['ak47', 'mp40', 'm1887', 'deagle', 'awm'];
      const chosenWeapon = WEAPONS[weaponKeys[Math.floor(Math.random() * weaponKeys.length)]];

      this.bots.push({
        id: `bot-${++this.botIdCounter}`,
        name,
        x: bx,
        y: by,
        vx: 0,
        vy: 0,
        angle: Math.random() * Math.PI * 2,
        hp: 200,
        maxHp: 200,
        vestLvl: Math.random() < 0.4 ? 1 : 2,
        helmetLvl: Math.random() < 0.5 ? 1 : 2,
        weapon: { ...chosenWeapon },
        ammo: 100,
        glooWalls: Math.floor(Math.random() * 3) + 1,
        isAlive: true,
        shootCooldown: Math.random() * 1.5,
        glooCooldown: 0,
        targetX: bx + (Math.random() * 200 - 100),
        targetY: by + (Math.random() * 200 - 100),
        state: 'wandering',
        lastSeenPlayer: null,
        reactionTimer: Math.random() * 1.0
      });
    }
  }

  // Active Weapon getter
  public getActiveWeapon(): WeaponDef {
    if (this.player.activeSlot === 1 && this.player.primaryWeapon) return this.player.primaryWeapon;
    if (this.player.activeSlot === 2 && this.player.secondaryWeapon) return this.player.secondaryWeapon;
    if (this.player.activeSlot === 3 && this.player.pistolWeapon) return this.player.pistolWeapon;
    return WEAPONS.fists;
  }

  // Switch weapon slot
  public switchWeapon(slot: 1 | 2 | 3) {
    if (this.player.activeSlot === slot) return;
    this.player.activeSlot = slot;
    this.player.isReloading = false;
    this.player.reloadTimer = 0;
    const w = this.getActiveWeapon();
    this.player.currentMag = w.magazineSize;
  }

  // Instant Gloo Wall Deployment (Crucial Free Fire Skill!)
  public deployGlooWall() {
    if (this.player.glooWalls <= 0) return;

    this.player.glooWalls--;
    this.stats.glooPlaced++;

    // Deploy 45 units directly in front of player
    const dist = 50;
    const gx = this.player.x + Math.cos(this.player.angle) * dist;
    const gy = this.player.y + Math.sin(this.player.angle) * dist;

    this.glooWalls.push({
      id: Math.random().toString(),
      x: gx,
      y: gy,
      z: this.player.z,
      angle: this.player.angle + Math.PI / 2, // perpendicular to view
      hp: 600,
      maxHp: 600,
      ownerId: 'player',
      placedAt: Date.now()
    });

    sound.playGlooDeploy();
  }

  // Bot deploys Gloo Wall for defense
  private botDeployGlooWall(bot: BotPlayer) {
    if (bot.glooWalls <= 0 || bot.glooCooldown > 0) return;
    bot.glooWalls--;
    bot.glooCooldown = 8.0; // cooldown between wall drops

    const dist = 45;
    const gx = bot.x + Math.cos(bot.angle) * dist;
    const gy = bot.y + Math.sin(bot.angle) * dist;

    this.glooWalls.push({
      id: Math.random().toString(),
      x: gx,
      y: gy,
      angle: bot.angle + Math.PI / 2,
      hp: 600,
      maxHp: 600,
      ownerId: bot.id,
      placedAt: Date.now()
    });

    sound.playGlooDeploy();
  }

  // Use Medkit (heals 75 HP over 3s)
  public useMedkit() {
    if (this.player.medkits <= 0 || this.player.health >= this.player.maxHealth || this.player.isHealing) {
      return;
    }
    this.player.isHealing = true;
    this.player.healTimer = 3.0; // 3 seconds
    sound.playMedkitUse();
  }

  // Reload current weapon
  public reloadWeapon() {
    const w = this.getActiveWeapon();
    if (w.id === 'fists' || this.player.isReloading || this.player.currentMag >= w.magazineSize) return;

    this.player.isReloading = true;
    this.player.reloadTimer = w.reloadTime;
  }

  // Activate Character Skill
  public activateSkill() {
    if (this.player.skillCooldown > 0) return;

    const char = this.player.character;
    if (char.skillType === 'active') {
      this.player.skillActiveTimer = char.duration;
      this.player.skillCooldown = char.cooldown;
      sound.playSkillSound();
    }
  }

  // Play Character Emote & Social Animation
  public playEmote(emoteId: EmoteId) {
    const emote = EMOTES[emoteId];
    if (!emote) return;
    if (this.player.health <= 0 || this.gameState !== 'playing') return;

    this.player.activeEmote = {
      id: emote.id,
      name: emote.name,
      icon: emote.icon,
      color: emote.color,
      startTime: performance.now(),
      duration: emote.duration,
      elapsed: 0
    };

    // Synthesize audio
    sound.playEmoteSound(emote.sound);

    // Social notification in combat feed
    this.killFeed.unshift({
      id: Math.random().toString(),
      killer: 'You',
      victim: `Emote: ${emote.name} ${emote.icon}`,
      weapon: 'Social',
      isHeadshot: false,
      isPlayerKill: true,
      time: Date.now()
    });
    if (this.killFeed.length > 5) this.killFeed.pop();
  }

  // Cancel active emote
  public cancelEmote() {
    this.player.activeEmote = null;
  }

  // Player Shoot
  public shoot() {
    if (this.player.isReloading || this.player.isHealing) return;
    if (this.player.shootCooldown > 0) return;

    const w = this.getActiveWeapon();
    if (this.player.currentMag <= 0 && w.id !== 'fists') {
      this.reloadWeapon();
      return;
    }

    if (w.id !== 'fists') {
      this.player.currentMag--;
    }

    this.player.shootCooldown = 1 / w.fireRate;
    sound.playGunshot(w.id);

    // M1887 Shotgun fires multiple pellets
    const pelletCount = w.id === 'm1887' ? 5 : 1;
    for (let p = 0; p < pelletCount; p++) {
      const spreadOffset = (Math.random() - 0.5) * w.spread;
      const shotAngle = this.player.angle + spreadOffset;
      const pitch = this.player.cameraPitch || 0;
      const hSpeed = Math.cos(pitch) * w.bulletSpeed;
      const vx = Math.cos(shotAngle) * hSpeed;
      const vy = Math.sin(shotAngle) * hSpeed;
      const vz = Math.sin(pitch) * w.bulletSpeed;

      this.bullets.push({
        id: Math.random().toString(),
        x: this.player.x + Math.cos(this.player.angle) * 20,
        y: this.player.y + Math.sin(this.player.angle) * 20,
        z: this.player.z + 16,
        prevX: this.player.x,
        prevY: this.player.y,
        prevZ: this.player.z + 16,
        vx,
        vy,
        vz,
        damage: w.damage,
        headshotMult: w.headshotMultiplier,
        rangeRemaining: w.range,
        shooterId: 'player',
        weaponId: w.id,
        color: w.color
      });
    }

    // Auto-reload on empty
    if (this.player.currentMag <= 0 && w.id !== 'fists') {
      this.reloadWeapon();
    }
  }

  // Main Update Loop (dt in seconds)
  public update(dt: number, input: PlayerInput) {
    this.matchClock += dt;
    this.stats.survivalTime = Math.floor(this.matchClock);

    // Skydive phase transition
    if (this.gameState === 'skydive') {
      this.skydiveAltitude -= dt * 280;
      if (this.skydiveAltitude <= 0) {
        this.skydiveAltitude = 0;
        this.gameState = 'playing';
      }
      return;
    }

    if (this.gameState !== 'playing') return;

    // 1. Player Movement
    let speed = 210; // base speed
    // Kelly passive buff
    if (this.player.character.id === 'kelly') speed *= 1.06;
    // Alok active skill speed buff (+15%)
    if (this.player.character.id === 'alok' && this.player.skillActiveTimer > 0) speed *= 1.15;
    // Slow down during healing
    if (this.player.isHealing) speed *= 0.6;
    // Slow down during scoping
    if (this.player.isScoping) speed *= 0.5;

    // Crouching
    this.player.isCrouching = !!input.crouch;
    if (this.player.isCrouching) speed *= 0.65;

    let moveX = 0;
    let moveY = 0;

    if (input.cameraYaw !== undefined) {
      // 3D camera-oriented movement
      this.player.cameraYaw = input.cameraYaw;
      this.player.cameraPitch = input.cameraPitch || 0;
      // In 2D engine: angle 0 = +X, angle PI/2 = +Y (which is +Z in 3D)
      this.player.angle = Math.PI / 2 - input.cameraYaw;

      let forward = 0;
      let strafe = 0;
      if (input.up) forward += 1;
      if (input.down) forward -= 1;
      if (input.left) strafe -= 1;
      if (input.right) strafe += 1;

      if (forward !== 0 || strafe !== 0) {
        const yaw = input.cameraYaw;
        const sinY = Math.sin(yaw);
        const cosY = Math.cos(yaw);

        // Forward vector in 2D engine (+Z in 3D): (sinY, cosY)
        // Strafe right vector in 2D engine (+X in 3D): (cosY, -sinY)
        moveX = forward * sinY + strafe * cosY;
        moveY = forward * cosY - strafe * sinY;

        const mag = Math.hypot(moveX, moveY);
        if (mag > 0) {
          moveX /= mag;
          moveY /= mag;
        }
      }
    } else {
      // 2D cardinal movement fallback
      if (input.up) moveY -= 1;
      if (input.down) moveY += 1;
      if (input.left) moveX -= 1;
      if (input.right) moveX += 1;

      if (moveX !== 0 && moveY !== 0) {
        moveX *= 0.7071;
        moveY *= 0.7071;
      }
      this.player.angle = input.aimAngle;
    }

    const nextPx = this.player.x + moveX * speed * dt;
    const nextPy = this.player.y + moveY * speed * dt;

    // Check if player is currently stuck inside any obstacle
    const currentlyStuck = this.checkObstacleCollision(this.player.x, this.player.y, 14);

    if (!this.checkObstacleCollision(nextPx, nextPy, 16)) {
      this.player.x = Math.max(50, Math.min(MAP_SIZE - 50, nextPx));
      this.player.y = Math.max(50, Math.min(MAP_SIZE - 50, nextPy));
    } else {
      // Smooth wall-sliding physics along individual axes
      let moved = false;
      if (!this.checkObstacleCollision(nextPx, this.player.y, 16)) {
        this.player.x = Math.max(50, Math.min(MAP_SIZE - 50, nextPx));
        moved = true;
      }
      if (!this.checkObstacleCollision(this.player.x, nextPy, 16)) {
        this.player.y = Math.max(50, Math.min(MAP_SIZE - 50, nextPy));
        moved = true;
      }
      // If player was already stuck, allow movement outward to free space
      if (!moved && currentlyStuck) {
        this.player.x = Math.max(50, Math.min(MAP_SIZE - 50, nextPx));
        this.player.y = Math.max(50, Math.min(MAP_SIZE - 50, nextPy));
      }
    }

    // Set player velocity for animation & physics
    this.player.vx = moveX * speed;
    this.player.vy = moveY * speed;

    // Jumping physics
    if (input.jump && this.player.z <= 0.05) {
      this.player.vz = 260;
      this.player.isJumping = true;
    }

    // Apply gravity
    this.player.vz -= 650 * dt;
    this.player.z = Math.max(0, this.player.z + this.player.vz * dt);
    if (this.player.z === 0) {
      this.player.vz = 0;
      this.player.isJumping = false;
    }

    // 2. Camera tracking
    this.camera.x = this.player.x;
    this.camera.y = this.player.y;

    // Emote lifecycle and player interruption (cancel if moving/firing/jumping)
    if (this.player.activeEmote) {
      if (moveX !== 0 || moveY !== 0 || input.isFiring || (input.jump && this.player.isJumping)) {
        this.player.activeEmote = null;
      } else {
        this.player.activeEmote.elapsed += dt;
        if (this.player.activeEmote.elapsed >= this.player.activeEmote.duration) {
          this.player.activeEmote = null;
        }
      }
    }

    // 3. Firing
    if (this.player.shootCooldown > 0) {
      this.player.shootCooldown -= dt;
    }
    if (input.isFiring) {
      this.shoot();
    }

    // 4. Reloading
    if (this.player.isReloading) {
      this.player.reloadTimer -= dt;
      if (this.player.reloadTimer <= 0) {
        this.player.isReloading = false;
        const w = this.getActiveWeapon();
        this.player.currentMag = w.magazineSize;
      }
    }

    // 5. Healing Medkit
    if (this.player.isHealing) {
      this.player.healTimer -= dt;
      if (this.player.healTimer <= 0) {
        this.player.isHealing = false;
        this.player.health = Math.min(this.player.maxHealth, this.player.health + 75);
        this.player.medkits--;
        this.stats.medkitsUsed++;
      }
    }

    // 6. Character Skills & Cooldowns
    if (this.player.skillCooldown > 0) {
      this.player.skillCooldown -= dt;
    }
    if (this.player.skillActiveTimer > 0) {
      this.player.skillActiveTimer -= dt;
      // Alok aura heals 5 HP per second
      if (this.player.character.id === 'alok') {
        this.player.health = Math.min(this.player.maxHealth, this.player.health + 5 * dt);
      }
    }

    // 7. EP Conversion (1 EP -> 1 HP every second when wounded)
    this.epConvertTimer += dt;
    if (this.epConvertTimer >= 1.0) {
      this.epConvertTimer = 0;
      if (this.player.health < this.player.maxHealth && this.player.ep > 0) {
        this.player.health = Math.min(this.player.maxHealth, this.player.health + 3);
        this.player.ep = Math.max(0, this.player.ep - 2);
      }
    }

    // 8. Safe Zone Contraction
    this.updateSafeZone(dt);

    // 9. Zone Damage to Player & Bots
    this.applyZoneDamage(dt);

    // 10. Bullets Physics & Raycasting
    this.updateBullets(dt);

    // 11. Bots AI Behavior
    this.updateBots(dt);

    // 12. Floating Popups
    this.updateDamagePopups(dt);

    // 13. Gloo Walls Lifespan & Decay
    this.updateGlooWalls(dt);

    // 14. Auto-Pickup Loot
    this.checkLootPickup();

    // 15. Periodic Airdrop Plane
    this.updateAirdrops(dt);

    // 16. Check Victory Condition
    if (this.aliveCount <= 1 && this.gameState === 'playing') {
      this.gameState = 'booyah';
      this.stats.rank = 1;
      sound.playBooyahFanfare();
    }
  }

  // Safe Zone Management
  private updateSafeZone(dt: number) {
    const zone = this.safeZone;
    zone.timer -= dt;

    if (zone.timer <= 0) {
      if (!zone.isShrinking) {
        // Start shrinking phase
        zone.isShrinking = true;
        const step = SAFE_ZONE_STEPS[this.safeZonePhaseIndex] || SAFE_ZONE_STEPS[SAFE_ZONE_STEPS.length - 1];
        zone.timer = step.shrinkDuration;
        sound.playZoneWarning();
      } else {
        // Finished shrinking, advance phase
        zone.isShrinking = false;
        this.safeZonePhaseIndex = Math.min(SAFE_ZONE_STEPS.length - 1, this.safeZonePhaseIndex + 1);
        const nextStep = SAFE_ZONE_STEPS[this.safeZonePhaseIndex];
        zone.phase = this.safeZonePhaseIndex + 1;
        zone.timer = nextStep.waitDuration;
        zone.dps = nextStep.dps;

        // Establish next circle inside current
        zone.currentRadius = zone.targetRadius;
        zone.currentX = zone.targetX;
        zone.currentY = zone.targetY;

        const maxOffset = zone.currentRadius * 0.35;
        zone.targetX = zone.currentX + (Math.random() * maxOffset * 2 - maxOffset);
        zone.targetY = zone.currentY + (Math.random() * maxOffset * 2 - maxOffset);
        zone.targetRadius = nextStep.radius;
      }
    }

    // Interpolate circle while shrinking
    if (zone.isShrinking) {
      const step = SAFE_ZONE_STEPS[this.safeZonePhaseIndex];
      const shrinkSpeed = (zone.currentRadius - zone.targetRadius) / (step.shrinkDuration || 30);
      zone.currentRadius = Math.max(zone.targetRadius, zone.currentRadius - shrinkSpeed * dt);
    }
  }

  // Safe Zone Electric Gas Damage
  private applyZoneDamage(dt: number) {
    const zone = this.safeZone;
    const pDist = Math.hypot(this.player.x - zone.currentX, this.player.y - zone.currentY);

    if (pDist > zone.currentRadius) {
      const dmg = zone.dps * dt;
      this.player.health -= dmg;

      if (this.player.health <= 0) {
        this.player.health = 0;
        this.handlePlayerDeath('Electric Danger Zone');
      }
    }

    // Zone damage to bots
    this.bots.forEach(bot => {
      if (!bot.isAlive) return;
      const bDist = Math.hypot(bot.x - zone.currentX, bot.y - zone.currentY);
      if (bDist > zone.currentRadius) {
        bot.hp -= zone.dps * dt * 1.5;
        if (bot.hp <= 0) {
          bot.isAlive = false;
          this.aliveCount--;
          this.killFeed.unshift({
            id: Math.random().toString(),
            killer: 'Danger Zone',
            victim: bot.name,
            weapon: 'Electric Gas',
            isHeadshot: false,
            isPlayerKill: false,
            time: Date.now()
          });
        }
      }
    });
  }

  // Update Bullets
  private updateBullets(dt: number) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.prevX = b.x;
      b.prevY = b.y;
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      const traveled = Math.hypot(b.vx * dt, b.vy * dt);
      b.rangeRemaining -= traveled;

      if (b.rangeRemaining <= 0 || b.x < 0 || b.x > MAP_SIZE || b.y < 0 || b.y > MAP_SIZE) {
        this.bullets.splice(i, 1);
        continue;
      }

      // Check collision with Obstacles (walls, buildings)
      if (this.checkObstacleCollision(b.x, b.y, 4)) {
        this.bullets.splice(i, 1);
        continue;
      }

      // Check collision with Gloo Walls
      let hitGloo = false;
      for (const gw of this.glooWalls) {
        const d = Math.hypot(b.x - gw.x, b.y - gw.y);
        if (d < 35) {
          gw.hp -= b.damage;
          hitGloo = true;
          break;
        }
      }
      if (hitGloo) {
        this.bullets.splice(i, 1);
        continue;
      }

      // Chrono Forcefield Protection
      if (this.player.character.id === 'chrono' && this.player.skillActiveTimer > 0 && b.shooterId !== 'player') {
        const d = Math.hypot(b.x - this.player.x, b.y - this.player.y);
        if (d < 70) {
          // Blocked by Chrono shield!
          this.bullets.splice(i, 1);
          continue;
        }
      }

      // Bullet hit Player (if shot by Bot)
      if (b.shooterId !== 'player') {
        const dist = Math.hypot(b.x - this.player.x, b.y - this.player.y);
        if (dist < 18) {
          // Headshot chance (20% or if hitting top)
          const isHeadshot = Math.random() < 0.25;
          let finalDmg = b.damage;
          if (isHeadshot) {
            finalDmg *= b.headshotMult;
            if (this.player.helmetLvl === 1) finalDmg *= 0.75;
            if (this.player.helmetLvl === 2) finalDmg *= 0.60;
            if (this.player.helmetLvl === 3) finalDmg *= 0.45;
            sound.playHeadshotDing();
          } else {
            if (this.player.vestLvl === 1) finalDmg *= 0.70;
            if (this.player.vestLvl === 2) finalDmg *= 0.55;
            if (this.player.vestLvl === 3) finalDmg *= 0.40;
            sound.playHitMarker();
          }

          this.player.health -= finalDmg;
          this.damagePopups.push({
            id: Math.random().toString(),
            x: this.player.x + (Math.random() * 20 - 10),
            y: this.player.y - 20,
            amount: Math.round(finalDmg),
            isHeadshot,
            alpha: 1.0,
            life: 0.8
          });

          if (this.player.health <= 0) {
            this.player.health = 0;
            const shooterBot = this.bots.find(bot => bot.id === b.shooterId);
            this.handlePlayerDeath(shooterBot?.name || 'Enemy Rusher');
          }

          this.bullets.splice(i, 1);
          continue;
        }
      }

      // Bullet hit Bot (if shot by Player or other Bot)
      let hitBot = false;
      for (const bot of this.bots) {
        if (!bot.isAlive || bot.id === b.shooterId) continue;

        const dist = Math.hypot(b.x - bot.x, b.y - bot.y);
        if (dist < 18) {
          hitBot = true;
          const isHeadshot = Math.random() < 0.35; // Headshot mechanics
          let finalDmg = b.damage;

          // Hayato passive armor pierce boost
          if (b.shooterId === 'player' && this.player.character.id === 'hayato') {
            const lostHpPercent = (this.player.maxHealth - this.player.health) / this.player.maxHealth;
            finalDmg *= 1 + lostHpPercent * 0.4;
          }

          if (isHeadshot) {
            finalDmg *= b.headshotMult;
            sound.playHeadshotDing();
          } else {
            sound.playHitMarker();
          }

          bot.hp -= finalDmg;

          if (b.shooterId === 'player') {
            this.stats.damageDealt += Math.round(finalDmg);
            if (isHeadshot) this.stats.headshots++;

            // Bot reflex: Deploy Gloo Wall if under fire!
            if (bot.hp > 0 && Math.random() < 0.5) {
              this.botDeployGlooWall(bot);
            }
          }

          this.damagePopups.push({
            id: Math.random().toString(),
            x: bot.x + (Math.random() * 20 - 10),
            y: bot.y - 20,
            amount: Math.round(finalDmg),
            isHeadshot,
            alpha: 1.0,
            life: 0.8
          });

          // Bot eliminated!
          if (bot.hp <= 0) {
            bot.isAlive = false;
            this.aliveCount--;

            // Drop bot loot
            this.groundItems.push({
              id: Math.random().toString(),
              x: bot.x,
              y: bot.y,
              type: 'weapon',
              weaponId: bot.weapon.id
            });
            this.groundItems.push({
              id: Math.random().toString(),
              x: bot.x + 15,
              y: bot.y + 10,
              type: 'gloo',
              amount: 2
            });
            this.groundItems.push({
              id: Math.random().toString(),
              x: bot.x - 15,
              y: bot.y - 10,
              type: 'medkit',
              amount: 1
            });

            const killerName = b.shooterId === 'player' ? 'YOU' : (this.bots.find(x => x.id === b.shooterId)?.name || 'Hunter');
            if (b.shooterId === 'player') {
              this.stats.kills++;
            }

            this.killFeed.unshift({
              id: Math.random().toString(),
              killer: killerName,
              victim: bot.name,
              weapon: b.weaponId.toUpperCase(),
              isHeadshot,
              isPlayerKill: b.shooterId === 'player',
              time: Date.now()
            });
          }

          break;
        }
      }

      if (hitBot) {
        this.bullets.splice(i, 1);
      }
    }
  }

  // Update Bot AI
  private updateBots(dt: number) {
    this.bots.forEach(bot => {
      if (!bot.isAlive) return;

      if (bot.shootCooldown > 0) bot.shootCooldown -= dt;
      if (bot.glooCooldown > 0) bot.glooCooldown -= dt;

      // Check distance to player
      const distToPlayer = Math.hypot(this.player.x - bot.x, this.player.y - bot.y);

      // Bot targets Safe Zone if outside
      const distToZone = Math.hypot(bot.x - this.safeZone.currentX, bot.y - this.safeZone.currentY);
      if (distToZone > this.safeZone.currentRadius) {
        // Move towards safe zone center
        const angleToCenter = Math.atan2(this.safeZone.currentY - bot.y, this.safeZone.currentX - bot.x);
        bot.x += Math.cos(angleToCenter) * 160 * dt;
        bot.y += Math.sin(angleToCenter) * 160 * dt;
        bot.angle = angleToCenter;
        return;
      }

      // If player is close, engage player!
      if (distToPlayer < 450 && this.gameState === 'playing') {
        bot.angle = Math.atan2(this.player.y - bot.y, this.player.x - bot.x);

        // Approach or strafe
        if (distToPlayer > 180) {
          bot.x += Math.cos(bot.angle) * 140 * dt;
          bot.y += Math.sin(bot.angle) * 140 * dt;
        } else {
          // Strafe sideways
          const strafeAngle = bot.angle + Math.PI / 2;
          bot.x += Math.cos(strafeAngle) * 80 * dt;
          bot.y += Math.sin(strafeAngle) * 80 * dt;
        }

        // Bot shoots at player
        if (bot.shootCooldown <= 0) {
          bot.shootCooldown = 1 / bot.weapon.fireRate + Math.random() * 0.4;
          sound.playGunshot(bot.weapon.id);

          const spread = (Math.random() - 0.5) * bot.weapon.spread * 1.5;
          const shotAngle = bot.angle + spread;
          this.bullets.push({
            id: Math.random().toString(),
            x: bot.x + Math.cos(bot.angle) * 15,
            y: bot.y + Math.sin(bot.angle) * 15,
            prevX: bot.x,
            prevY: bot.y,
            vx: Math.cos(shotAngle) * bot.weapon.bulletSpeed,
            vy: Math.sin(shotAngle) * bot.weapon.bulletSpeed,
            damage: bot.weapon.damage * 0.75, // balanced bot damage
            headshotMult: bot.weapon.headshotMultiplier,
            rangeRemaining: bot.weapon.range,
            shooterId: bot.id,
            weaponId: bot.weapon.id,
            color: bot.weapon.color
          });
        }
      } else {
        // Wandering / Fighting other bots
        const dx = bot.targetX - bot.x;
        const dy = bot.targetY - bot.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 30) {
          bot.targetX = Math.max(100, Math.min(MAP_SIZE - 100, bot.x + (Math.random() * 400 - 200)));
          bot.targetY = Math.max(100, Math.min(MAP_SIZE - 100, bot.y + (Math.random() * 400 - 200)));
        } else {
          bot.angle = Math.atan2(dy, dx);
          bot.x += Math.cos(bot.angle) * 120 * dt;
          bot.y += Math.sin(bot.angle) * 120 * dt;
        }

        // Random bot-on-bot skirmish simulator (keeps match active & dynamic)
        if (Math.random() < 0.003 && this.aliveCount > 2) {
          const victim = this.bots.find(b => b.isAlive && b.id !== bot.id);
          if (victim) {
            victim.isAlive = false;
            this.aliveCount--;
            this.killFeed.unshift({
              id: Math.random().toString(),
              killer: bot.name,
              victim: victim.name,
              weapon: bot.weapon.name,
              isHeadshot: Math.random() < 0.3,
              isPlayerKill: false,
              time: Date.now()
            });
          }
        }
      }
    });
  }

  // Gloo Walls Update
  private updateGlooWalls(dt: number) {
    const now = Date.now();
    for (let i = this.glooWalls.length - 1; i >= 0; i--) {
      const gw = this.glooWalls[i];
      // Wall lasts 30 seconds or until destroyed
      if (gw.hp <= 0 || now - gw.placedAt > 30000) {
        this.glooWalls.splice(i, 1);
      }
    }
  }

  // Floating Damage Numbers Animation
  private updateDamagePopups(dt: number) {
    for (let i = this.damagePopups.length - 1; i >= 0; i--) {
      const p = this.damagePopups[i];
      p.y -= 35 * dt;
      p.life -= dt;
      p.alpha = Math.max(0, p.life / 0.8);
      if (p.life <= 0) {
        this.damagePopups.splice(i, 1);
      }
    }
  }

  // Auto-pickup ground loot when close
  private checkLootPickup() {
    for (let i = this.groundItems.length - 1; i >= 0; i--) {
      const item = this.groundItems[i];
      const dist = Math.hypot(this.player.x - item.x, this.player.y - item.y);
      if (dist < 40) {
        if (item.type === 'gloo') {
          this.player.glooWalls = Math.min(10, this.player.glooWalls + (item.amount || 1));
          sound.playPickup();
          this.groundItems.splice(i, 1);
        } else if (item.type === 'medkit') {
          this.player.medkits = Math.min(6, this.player.medkits + (item.amount || 1));
          sound.playPickup();
          this.groundItems.splice(i, 1);
        } else if (item.type === 'mushroom') {
          this.player.ep = Math.min(this.player.maxEp, this.player.ep + 50);
          sound.playPickup();
          this.groundItems.splice(i, 1);
        } else if (item.type === 'vest') {
          if ((item.level || 1) > this.player.vestLvl) {
            this.player.vestLvl = item.level || 2;
            sound.playPickup();
            this.groundItems.splice(i, 1);
          }
        } else if (item.type === 'helmet') {
          if ((item.level || 1) > this.player.helmetLvl) {
            this.player.helmetLvl = item.level || 2;
            sound.playPickup();
            this.groundItems.splice(i, 1);
          }
        } else if (item.type === 'weapon' && item.weaponId) {
          // If secondary is empty, put in secondary, else primary
          if (!this.player.secondaryWeapon) {
            this.player.secondaryWeapon = { ...WEAPONS[item.weaponId] };
            sound.playPickup();
            this.groundItems.splice(i, 1);
          }
        }
      }
    }
  }

  // Periodic Airdrops
  private updateAirdrops(dt: number) {
    if (this.airdrops.length === 0 && this.matchClock > 25) {
      // Spawn central airdrop
      this.airdrops.push({
        id: 'airdrop-1',
        x: this.safeZone.currentX + (Math.random() * 200 - 100),
        y: this.safeZone.currentY + (Math.random() * 200 - 100),
        landed: true,
        altitude: 0,
        weapons: ['awm'],
        hasLvl3Armor: true,
        opened: false
      });
    }

    // Check player looting airdrop
    this.airdrops.forEach(ad => {
      if (!ad.opened) {
        const d = Math.hypot(this.player.x - ad.x, this.player.y - ad.y);
        if (d < 50) {
          ad.opened = true;
          this.player.vestLvl = 3;
          this.player.helmetLvl = 3;
          this.player.glooWalls += 3;
          this.player.medkits += 2;
          this.player.secondaryWeapon = { ...WEAPONS.awm };
          sound.playPickup();
        }
      }
    });
  }

  // Check collision with buildings / obstacles
  public checkObstacleCollision(x: number, y: number, radius: number): boolean {
    for (const obs of this.obstacles) {
      if (
        x + radius > obs.x &&
        x - radius < obs.x + obs.width &&
        y + radius > obs.y &&
        y - radius < obs.y + obs.height
      ) {
        return true;
      }
    }
    return false;
  }

  // Find guaranteed safe and open spawn position outside any obstacle
  public findSafeSpawn(cx: number, cy: number): { x: number; y: number } {
    const radii = [140, 170, 200, 240, 280];
    const angles = [
      0,
      Math.PI / 4,
      Math.PI / 2,
      (3 * Math.PI) / 4,
      Math.PI,
      (5 * Math.PI) / 4,
      (3 * Math.PI) / 2,
      (7 * Math.PI) / 4
    ];
    for (const r of radii) {
      for (const a of angles) {
        const tx = Math.max(100, Math.min(MAP_SIZE - 100, cx + Math.cos(a) * r));
        const ty = Math.max(100, Math.min(MAP_SIZE - 100, cy + Math.sin(a) * r));
        if (!this.checkObstacleCollision(tx, ty, 30)) {
          return { x: tx, y: ty };
        }
      }
    }
    return {
      x: Math.max(120, Math.min(MAP_SIZE - 120, cx + 180)),
      y: Math.max(120, Math.min(MAP_SIZE - 120, cy + 180))
    };
  }

  // Player Death
  private handlePlayerDeath(killer: string) {
    this.gameState = 'gameover';
    this.stats.rank = this.aliveCount;
    this.killFeed.unshift({
      id: Math.random().toString(),
      killer,
      victim: 'YOU',
      weapon: 'Combat',
      isHeadshot: false,
      isPlayerKill: false,
      time: Date.now()
    });
  }
}
