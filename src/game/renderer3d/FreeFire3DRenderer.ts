import * as THREE from 'three';
import { GameEngine } from '../GameEngine';
import { WeaponId, CharacterId, ActiveEmote } from '../types';
import { MAP_SIZE, BERMUDA_POIS } from '../constants';

// Helper to convert 2D map coords (0 to 3200) to 3D world coords (-1600 to 1600)
export function mapTo3D(x: number, y: number): { x: number; z: number } {
  return {
    x: x - MAP_SIZE / 2,
    z: y - MAP_SIZE / 2
  };
}

export class FreeFire3DRenderer {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public canvas: HTMLCanvasElement;

  // Camera angles
  public yaw = 0; // horizontal angle
  public pitch = 0.15; // vertical angle (pitch up/down)
  public cameraDistance = 38;
  public cameraHeight = 16;
  public isLocked = false;

  // Groups and object pools
  private terrainGroup = new THREE.Group();
  private buildingsGroup = new THREE.Group();
  private foliageGroup = new THREE.Group();
  private botsGroup = new THREE.Group();
  private glooWallsGroup = new THREE.Group();
  private lootGroup = new THREE.Group();
  private airdropsGroup = new THREE.Group();
  private bulletsGroup = new THREE.Group();
  private damagePopupsGroup = new THREE.Group();
  private vfxGroup = new THREE.Group();

  // Player 3D Rig
  private playerMesh!: THREE.Group;
  private playerTorso!: THREE.Mesh;
  private playerHead!: THREE.Mesh;
  private playerHelmet!: THREE.Mesh;
  private playerLeftLeg!: THREE.Mesh;
  private playerRightLeg!: THREE.Mesh;
  private playerLeftArm!: THREE.Mesh;
  private playerRightArm!: THREE.Mesh;
  private weaponMeshGroup!: THREE.Group;
  private muzzleFlashLight!: THREE.PointLight;
  private muzzleFlashMesh!: THREE.Mesh;
  private parachuteMesh!: THREE.Group;
  private alokAuraMesh!: THREE.Mesh;
  private chronoShieldMesh!: THREE.Mesh;
  private wukongBushMesh!: THREE.Mesh;

  // 3D Emote Social Billboard & VFX
  private emoteBubbleSprite!: THREE.Sprite;
  private emoteCanvas!: HTMLCanvasElement;
  private emoteCanvasCtx!: CanvasRenderingContext2D;
  private emoteTexture!: THREE.CanvasTexture;
  private emoteParticlesGroup = new THREE.Group();
  private lastEmoteId: string | null = null;
  private emoteConfettiList: { mesh: THREE.Mesh; vx: number; vy: number; vz: number; rotV: number; life: number }[] = [];

  // Bot mesh map
  private botMeshes = new Map<string, { group: THREE.Group; leftLeg: THREE.Mesh; rightLeg: THREE.Mesh; hpBar: THREE.Sprite }>();
  // Gloo wall mesh map
  private glooMeshes = new Map<string, THREE.Group>();
  // Loot item mesh map
  private lootMeshes = new Map<string, THREE.Group>();
  // Airdrop mesh map
  private airdropMeshes = new Map<string, THREE.Group>();

  // Safe zone 3D meshes
  private safeZoneCylinder!: THREE.Mesh;
  private nextSafeZoneRing!: THREE.Line;

  // Animation clocks
  private animClock = 0;
  private muzzleFlashTimer = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    // 1. Scene & Atmosphere
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0c1322');
    this.scene.fog = new THREE.FogExp2('#111a2e', 0.0012);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.5, 2500);
    this.camera.position.set(0, 20, 40);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Add root groups
    this.scene.add(this.terrainGroup);
    this.scene.add(this.buildingsGroup);
    this.scene.add(this.foliageGroup);
    this.scene.add(this.lootGroup);
    this.scene.add(this.glooWallsGroup);
    this.scene.add(this.airdropsGroup);
    this.scene.add(this.botsGroup);
    this.scene.add(this.bulletsGroup);
    this.scene.add(this.damagePopupsGroup);
    this.scene.add(this.vfxGroup);

    // 4. Setup Lighting
    this.setupLighting();

    // 5. Setup Sky & Environment
    this.setupSkyAndTerrain();

    // 6. Setup Landmark Buildings (Clock Tower, Factory, Peak, Pochinok)
    this.setupLandmarks();

    // 7. Setup Player Avatar Model
    this.setupPlayerAvatar();

    // 8. Setup Safe Zone Cylinders
    this.setupSafeZone();
  }

  // Sunlight and Ambient Lighting
  private setupLighting() {
    const ambientLight = new THREE.AmbientLight('#a0b4d0', 0.85);
    this.scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight('#87ceeb', '#2d4a22', 0.6);
    this.scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight('#fff1db', 1.4);
    sunLight.position.set(300, 500, 200);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 1500;
    const shadowD = 300;
    sunLight.shadow.camera.left = -shadowD;
    sunLight.shadow.camera.right = shadowD;
    sunLight.shadow.camera.top = shadowD;
    sunLight.shadow.camera.bottom = -shadowD;
    this.scene.add(sunLight);
  }

  // 3D Bermuda Island Terrain & Roads
  private setupSkyAndTerrain() {
    // Large Island Terrain Ground Plane
    const groundGeo = new THREE.PlaneGeometry(MAP_SIZE, MAP_SIZE, 64, 64);
    groundGeo.rotateX(-Math.PI / 2);

    // Procedural lush grass canvas texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#1c3924'; // Tropical grass base
    ctx.fillRect(0, 0, 512, 512);

    // Grass grid pattern & accents
    ctx.strokeStyle = '#16311e';
    ctx.lineWidth = 4;
    for (let i = 0; i < 512; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }
    // Random subtle grass specks
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = Math.random() < 0.5 ? '#23472d' : '#142c1b';
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 6, 6);
    }

    const groundTex = new THREE.CanvasTexture(canvas);
    groundTex.wrapS = THREE.RepeatWrapping;
    groundTex.wrapT = THREE.RepeatWrapping;
    groundTex.repeat.set(32, 32);

    const groundMat = new THREE.MeshLambertMaterial({
      map: groundTex,
      roughness: 0.9
    } as any);

    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.receiveShadow = true;
    ground.position.set(0, 0, 0);
    this.terrainGroup.add(ground);

    // Surrounding Ocean Plane
    const oceanGeo = new THREE.PlaneGeometry(MAP_SIZE * 2.5, MAP_SIZE * 2.5);
    oceanGeo.rotateX(-Math.PI / 2);
    const oceanMat = new THREE.MeshLambertMaterial({
      color: '#083344',
      transparent: true,
      opacity: 0.85
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.position.set(0, -2, 0);
    this.terrainGroup.add(ocean);

    // Roads connecting Bermuda POIs
    const roadMat = new THREE.MeshLambertMaterial({ color: '#27272a' });
    for (let i = 0; i < BERMUDA_POIS.length - 1; i++) {
      const p1 = mapTo3D(BERMUDA_POIS[i].x, BERMUDA_POIS[i].y);
      const p2 = mapTo3D(BERMUDA_POIS[i + 1].x, BERMUDA_POIS[i + 1].y);
      const dist = Math.hypot(p2.x - p1.x, p2.z - p1.z);
      const roadGeo = new THREE.PlaneGeometry(16, dist);
      roadGeo.rotateX(-Math.PI / 2);
      const roadMesh = new THREE.Mesh(roadGeo, roadMat);
      roadMesh.position.set((p1.x + p2.x) / 2, 0.05, (p1.z + p2.z) / 2);
      roadMesh.rotation.y = Math.atan2(p2.x - p1.x, p2.z - p1.z);
      this.terrainGroup.add(roadMesh);
    }

    // Circular POI Landing Zone Ground Rings
    BERMUDA_POIS.forEach(poi => {
      const p = mapTo3D(poi.x, poi.y);
      const ringGeo = new THREE.RingGeometry(80, 84, 32);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: poi.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(p.x, 0.1, p.z);
      this.terrainGroup.add(ringMesh);
    });
  }

  // 3D POI Landmark Architecture
  private setupLandmarks() {
    BERMUDA_POIS.forEach(poi => {
      const p = mapTo3D(poi.x, poi.y);

      if (poi.name === 'CLOCK TOWER') {
        this.buildClockTower(p.x, p.z);
      } else if (poi.name === 'FACTORY') {
        this.buildFactory(p.x, p.z);
      } else if (poi.name === 'PEAK') {
        this.buildPeakEstate(p.x, p.z);
      } else if (poi.name === 'POCHINOK') {
        this.buildPochinokVillage(p.x, p.z);
      } else if (poi.name === 'BIMASAKTI STRIP') {
        this.buildBimasaktiHangars(p.x, p.z);
      } else {
        // Generic Outpost / Warehouse
        this.buildStandardCompound(p.x, p.z, poi.color);
      }

      // Scatter natural cover (3D Trees & Boulders) around POI
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.4;
        const rad = 80 + Math.random() * 70;
        const tx = p.x + Math.cos(angle) * rad;
        const tz = p.z + Math.sin(angle) * rad;

        if (i % 2 === 0) {
          this.buildTree(tx, tz);
        } else {
          this.buildRock(tx, tz);
        }
      }
    });
  }

  // 3D Clock Tower Landmark
  private buildClockTower(x: number, z: number) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const brickMat = new THREE.MeshLambertMaterial({ color: '#7c2d12' }); // Brick Red
    const stoneMat = new THREE.MeshLambertMaterial({ color: '#57534e' }); // Stone Trim
    const roofMat = new THREE.MeshLambertMaterial({ color: '#0f172a' }); // Slate Dark Roof

    // Base Tier
    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(40, 20, 40), brickMat);
    baseMesh.position.y = 10;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    // Stone Mid Trim
    const trimMesh = new THREE.Mesh(new THREE.BoxGeometry(44, 2, 44), stoneMat);
    trimMesh.position.y = 21;
    group.add(trimMesh);

    // Main Tower Column (Height 55m)
    const towerMesh = new THREE.Mesh(new THREE.BoxGeometry(26, 45, 26), brickMat);
    towerMesh.position.y = 43.5;
    towerMesh.castShadow = true;
    group.add(towerMesh);

    // Clock Tier
    const clockTierMesh = new THREE.Mesh(new THREE.BoxGeometry(30, 16, 30), stoneMat);
    clockTierMesh.position.y = 74;
    clockTierMesh.castShadow = true;
    group.add(clockTierMesh);

    // 4 Functional Clock Dials on 4 faces
    const clockDialGeo = new THREE.CircleGeometry(6, 24);
    const clockDialMat = new THREE.MeshBasicMaterial({ color: '#fef08a' }); // Glowing amber clock face

    const dialNorth = new THREE.Mesh(clockDialGeo, clockDialMat);
    dialNorth.position.set(0, 74, 15.2);
    group.add(dialNorth);

    const dialSouth = new THREE.Mesh(clockDialGeo, clockDialMat);
    dialSouth.position.set(0, 74, -15.2);
    dialSouth.rotation.y = Math.PI;
    group.add(dialSouth);

    const dialEast = new THREE.Mesh(clockDialGeo, clockDialMat);
    dialEast.position.set(15.2, 74, 0);
    dialEast.rotation.y = Math.PI / 2;
    group.add(dialEast);

    const dialWest = new THREE.Mesh(clockDialGeo, clockDialMat);
    dialWest.position.set(-15.2, 74, 0);
    dialWest.rotation.y = -Math.PI / 2;
    group.add(dialWest);

    // Peaked Roof Spire
    const roofGeo = new THREE.ConeGeometry(22, 26, 4);
    roofGeo.rotateY(Math.PI / 4);
    const roofMesh = new THREE.Mesh(roofGeo, roofMat);
    roofMesh.position.y = 95;
    roofMesh.castShadow = true;
    group.add(roofMesh);

    // Surrounding Stone Courtyard Walls
    const wallGeo = new THREE.BoxGeometry(70, 5, 3);
    const wall1 = new THREE.Mesh(wallGeo, stoneMat);
    wall1.position.set(0, 2.5, 35);
    group.add(wall1);
    const wall2 = new THREE.Mesh(wallGeo, stoneMat);
    wall2.position.set(0, 2.5, -35);
    group.add(wall2);

    this.buildingsGroup.add(group);
  }

  // 3D Factory Landmark
  private buildFactory(x: number, z: number) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const factoryWallMat = new THREE.MeshLambertMaterial({ color: '#475569' }); // Industrial slate
    const steelRoofMat = new THREE.MeshLambertMaterial({ color: '#b91c1c' }); // Crimson metal roof
    const pipeMat = new THREE.MeshLambertMaterial({ color: '#dc2626' }); // Hazard Red

    // Main Factory Warehouse
    const warehouseMesh = new THREE.Mesh(new THREE.BoxGeometry(70, 32, 50), factoryWallMat);
    warehouseMesh.position.y = 16;
    warehouseMesh.castShadow = true;
    warehouseMesh.receiveShadow = true;
    group.add(warehouseMesh);

    // Pitched Roof
    const roofGeo = new THREE.ConeGeometry(55, 14, 4);
    roofGeo.rotateY(Math.PI / 4);
    const roofMesh = new THREE.Mesh(roofGeo, steelRoofMat);
    roofMesh.scale.set(1, 1, 0.7);
    roofMesh.position.y = 39;
    group.add(roofMesh);

    // Twin Industrial Smokestacks
    const stackGeo = new THREE.CylinderGeometry(3, 4, 60, 16);
    const stack1 = new THREE.Mesh(stackGeo, pipeMat);
    stack1.position.set(-26, 30, -18);
    stack1.castShadow = true;
    group.add(stack1);

    const stack2 = new THREE.Mesh(stackGeo, pipeMat);
    stack2.position.set(-26, 30, 18);
    stack2.castShadow = true;
    group.add(stack2);

    // Cargo Containers around factory
    this.buildContainer(group, 42, 6, 12, '#0284c7'); // Blue container
    this.buildContainer(group, 42, 6, -12, '#ea580c'); // Orange container
    this.buildContainer(group, -42, 6, 0, '#16a34a'); // Green container

    this.buildingsGroup.add(group);
  }

  // 3D Peak Hilltop Estate & Comms Tower
  private buildPeakEstate(x: number, z: number) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const villaMat = new THREE.MeshLambertMaterial({ color: '#f8fafc' }); // Modern white stucco
    const glassMat = new THREE.MeshLambertMaterial({ color: '#38bdf8', transparent: true, opacity: 0.6 });
    const metalMat = new THREE.MeshLambertMaterial({ color: '#334155' });

    // Main 2-Story Villa
    const villaMesh = new THREE.Mesh(new THREE.BoxGeometry(50, 18, 40), villaMat);
    villaMesh.position.y = 9;
    villaMesh.castShadow = true;
    group.add(villaMesh);

    const floor2Mesh = new THREE.Mesh(new THREE.BoxGeometry(36, 14, 28), villaMat);
    floor2Mesh.position.set(0, 25, 0);
    floor2Mesh.castShadow = true;
    group.add(floor2Mesh);

    // Balcony glass railing
    const balconyMesh = new THREE.Mesh(new THREE.BoxGeometry(38, 4, 30), glassMat);
    balconyMesh.position.set(0, 20, 0);
    group.add(balconyMesh);

    // Satellite Communications Mast
    const towerGeo = new THREE.CylinderGeometry(0.5, 2, 50, 8);
    const tower = new THREE.Mesh(towerGeo, metalMat);
    tower.position.set(32, 25, -20);
    group.add(tower);

    // Blinking red beacon on top of Peak tower
    const beaconGeo = new THREE.SphereGeometry(1.5, 8, 8);
    const beaconMat = new THREE.MeshBasicMaterial({ color: '#ef4444' });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(32, 50, -20);
    group.add(beacon);

    this.buildingsGroup.add(group);
  }

  // 3D Pochinok Village Houses
  private buildPochinokVillage(x: number, z: number) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const wallColors = ['#f1f5f9', '#fed7aa', '#e2e8f0'];
    const roofColors = ['#991b1b', '#854d0e', '#334155'];

    // 3 Houses arranged along a village street
    for (let i = 0; i < 3; i++) {
      const hx = (i - 1) * 35;
      const hz = (i % 2 === 0 ? 1 : -1) * 20;

      const houseMesh = new THREE.Mesh(
        new THREE.BoxGeometry(24, 12, 18),
        new THREE.MeshLambertMaterial({ color: wallColors[i % wallColors.length] })
      );
      houseMesh.position.set(hx, 6, hz);
      houseMesh.castShadow = true;
      group.add(houseMesh);

      const roofGeo = new THREE.ConeGeometry(19, 9, 4);
      roofGeo.rotateY(Math.PI / 4);
      const roofMesh = new THREE.Mesh(
        roofGeo,
        new THREE.MeshLambertMaterial({ color: roofColors[i % roofColors.length] })
      );
      roofMesh.position.set(hx, 16.5, hz);
      group.add(roofMesh);
    }

    this.buildingsGroup.add(group);
  }

  // 3D Bimasakti Military Hangars
  private buildBimasaktiHangars(x: number, z: number) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const hangarMat = new THREE.MeshLambertMaterial({ color: '#3b82f6' });

    // Open Arch Hangar
    const archGeo = new THREE.CylinderGeometry(20, 20, 50, 16, 1, true, 0, Math.PI);
    archGeo.rotateZ(Math.PI / 2);
    const hangar1 = new THREE.Mesh(archGeo, hangarMat);
    hangar1.position.set(0, 10, 0);
    hangar1.castShadow = true;
    group.add(hangar1);

    this.buildContainer(group, -30, 6, 25, '#eab308');
    this.buildContainer(group, 30, 6, 25, '#dc2626');

    this.buildingsGroup.add(group);
  }

  // Standard military outpost compound
  private buildStandardCompound(x: number, z: number, color: string) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const buildingMesh = new THREE.Mesh(
      new THREE.BoxGeometry(34, 16, 28),
      new THREE.MeshLambertMaterial({ color: '#334155' })
    );
    buildingMesh.position.y = 8;
    buildingMesh.castShadow = true;
    group.add(buildingMesh);

    const roofMesh = new THREE.Mesh(
      new THREE.BoxGeometry(38, 2, 32),
      new THREE.MeshLambertMaterial({ color })
    );
    roofMesh.position.y = 17;
    group.add(roofMesh);

    this.buildingsGroup.add(group);
  }

  // Shipping Container
  private buildContainer(parent: THREE.Group, x: number, y: number, z: number, colorHex: string) {
    const contMesh = new THREE.Mesh(
      new THREE.BoxGeometry(22, 11, 10),
      new THREE.MeshLambertMaterial({ color: colorHex })
    );
    contMesh.position.set(x, y, z);
    contMesh.castShadow = true;
    parent.add(contMesh);
  }

  // 3D Stylized Pine Tree
  private buildTree(x: number, z: number) {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(x, 0, z);

    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(1.2, 1.8, 12, 8);
    const trunkMat = new THREE.MeshLambertMaterial({ color: '#451a03' });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 6;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    // 3 Layered Foliage Cones
    const foliageMat = new THREE.MeshLambertMaterial({ color: '#15803d' });
    const cone1 = new THREE.Mesh(new THREE.ConeGeometry(9, 12, 8), foliageMat);
    cone1.position.y = 14;
    cone1.castShadow = true;
    treeGroup.add(cone1);

    const cone2 = new THREE.Mesh(new THREE.ConeGeometry(7, 10, 8), foliageMat);
    cone2.position.y = 19;
    cone2.castShadow = true;
    treeGroup.add(cone2);

    const cone3 = new THREE.Mesh(new THREE.ConeGeometry(5, 8, 8), foliageMat);
    cone3.position.y = 24;
    cone3.castShadow = true;
    treeGroup.add(cone3);

    this.foliageGroup.add(treeGroup);
  }

  // 3D Tactical Boulder / Cover
  private buildRock(x: number, z: number) {
    const rockGeo = new THREE.DodecahedronGeometry(5 + Math.random() * 3, 0);
    const rockMat = new THREE.MeshLambertMaterial({ color: '#64748b' });
    const rock = new THREE.Mesh(rockGeo, rockMat);
    rock.position.set(x, 3.5, z);
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    rock.castShadow = true;
    rock.receiveShadow = true;
    this.foliageGroup.add(rock);
  }

  // 3D Player Avatar Model with Hierarchical Limbs
  private setupPlayerAvatar() {
    this.playerMesh = new THREE.Group();

    // 1. Torso / Combat Vest (Free Fire Gold & Black)
    const torsoGeo = new THREE.BoxGeometry(4.2, 6.5, 2.8);
    const torsoMat = new THREE.MeshLambertMaterial({ color: '#f59e0b' });
    this.playerTorso = new THREE.Mesh(torsoGeo, torsoMat);
    this.playerTorso.position.y = 9;
    this.playerTorso.castShadow = true;
    this.playerMesh.add(this.playerTorso);

    // 2. Head & Combat Helmet
    const headGeo = new THREE.SphereGeometry(1.6, 16, 16);
    const headMat = new THREE.MeshLambertMaterial({ color: '#ffedd5' });
    this.playerHead = new THREE.Mesh(headGeo, headMat);
    this.playerHead.position.set(0, 13.5, 0);
    this.playerHead.castShadow = true;
    this.playerMesh.add(this.playerHead);

    // Tactical Helmet Visor
    const helmGeo = new THREE.SphereGeometry(1.8, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.7);
    const helmMat = new THREE.MeshLambertMaterial({ color: '#0f172a' }); // Dark tactical helmet
    this.playerHelmet = new THREE.Mesh(helmGeo, helmMat);
    this.playerHelmet.position.set(0, 13.8, 0);
    this.playerMesh.add(this.playerHelmet);

    // Tactical Backpack
    const packGeo = new THREE.BoxGeometry(3.6, 5, 2);
    const packMat = new THREE.MeshLambertMaterial({ color: '#1e293b' });
    const backpack = new THREE.Mesh(packGeo, packMat);
    backpack.position.set(0, 9, -1.8);
    backpack.castShadow = true;
    this.playerMesh.add(backpack);

    // 3. Legs
    const legGeo = new THREE.BoxGeometry(1.6, 7, 1.8);
    const legMat = new THREE.MeshLambertMaterial({ color: '#1e293b' });

    this.playerLeftLeg = new THREE.Mesh(legGeo, legMat);
    this.playerLeftLeg.position.set(-1.2, 3.5, 0);
    this.playerLeftLeg.castShadow = true;
    this.playerMesh.add(this.playerLeftLeg);

    this.playerRightLeg = new THREE.Mesh(legGeo, legMat);
    this.playerRightLeg.position.set(1.2, 3.5, 0);
    this.playerRightLeg.castShadow = true;
    this.playerMesh.add(this.playerRightLeg);

    // 4. Arms & Weapon Mount
    const armGeo = new THREE.BoxGeometry(1.4, 6, 1.6);
    const armMat = new THREE.MeshLambertMaterial({ color: '#d97706' });

    this.playerLeftArm = new THREE.Mesh(armGeo, armMat);
    this.playerLeftArm.position.set(-2.8, 9, 1.5);
    this.playerLeftArm.rotation.x = -Math.PI / 4;
    this.playerLeftArm.castShadow = true;
    this.playerMesh.add(this.playerLeftArm);

    this.playerRightArm = new THREE.Mesh(armGeo, armMat);
    this.playerRightArm.position.set(2.8, 9, 1.5);
    this.playerRightArm.rotation.x = -Math.PI / 3;
    this.playerRightArm.castShadow = true;
    this.playerMesh.add(this.playerRightArm);

    // 5. 3D Weapon Model Group
    this.weaponMeshGroup = new THREE.Group();
    this.weaponMeshGroup.position.set(1.5, 9, 3.5);
    this.buildWeaponMesh(this.weaponMeshGroup, 'ak47');
    this.playerMesh.add(this.weaponMeshGroup);

    // Muzzle flash point light
    this.muzzleFlashLight = new THREE.PointLight('#f59e0b', 0, 30);
    this.muzzleFlashLight.position.set(0, 0, 5);
    this.weaponMeshGroup.add(this.muzzleFlashLight);

    const flashGeo = new THREE.SphereGeometry(1.2, 8, 8);
    const flashMat = new THREE.MeshBasicMaterial({ color: '#fef08a' });
    this.muzzleFlashMesh = new THREE.Mesh(flashGeo, flashMat);
    this.muzzleFlashMesh.position.set(0, 0, 5);
    this.muzzleFlashMesh.visible = false;
    this.weaponMeshGroup.add(this.muzzleFlashMesh);

    // 6. Character Skill 3D Visual Effects
    // Alok 5m Cyan DJ Equalizer Aura
    const auraGeo = new THREE.RingGeometry(16, 17.5, 32);
    auraGeo.rotateX(-Math.PI / 2);
    const auraMat = new THREE.MeshBasicMaterial({
      color: '#06b6d4',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    this.alokAuraMesh = new THREE.Mesh(auraGeo, auraMat);
    this.alokAuraMesh.position.y = 0.2;
    this.alokAuraMesh.visible = false;
    this.playerMesh.add(this.alokAuraMesh);

    // Chrono Forcefield 800HP Dome
    const domeGeo = new THREE.SphereGeometry(15, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshBasicMaterial({
      color: '#3b82f6',
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    this.chronoShieldMesh = new THREE.Mesh(domeGeo, domeMat);
    this.chronoShieldMesh.position.y = 0;
    this.chronoShieldMesh.visible = false;
    this.playerMesh.add(this.chronoShieldMesh);

    // Wukong Camouflage Bush
    const bushGeo = new THREE.DodecahedronGeometry(7, 1);
    const bushMat = new THREE.MeshLambertMaterial({ color: '#16a34a' });
    this.wukongBushMesh = new THREE.Mesh(bushGeo, bushMat);
    this.wukongBushMesh.position.y = 6;
    this.wukongBushMesh.visible = false;
    this.playerMesh.add(this.wukongBushMesh);

    // Skydive Parachute Glider
    this.parachuteMesh = new THREE.Group();
    const chuteGeo = new THREE.SphereGeometry(16, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2.2);
    const chuteMat = new THREE.MeshLambertMaterial({
      color: '#f59e0b',
      side: THREE.DoubleSide
    });
    const canopy = new THREE.Mesh(chuteGeo, chuteMat);
    canopy.position.y = 22;
    this.parachuteMesh.add(canopy);
    this.parachuteMesh.visible = false;
    this.playerMesh.add(this.parachuteMesh);

    // 7. 3D Floating Emote Billboard Sprite
    this.emoteCanvas = document.createElement('canvas');
    this.emoteCanvas.width = 256;
    this.emoteCanvas.height = 128;
    this.emoteCanvasCtx = this.emoteCanvas.getContext('2d')!;
    this.emoteTexture = new THREE.CanvasTexture(this.emoteCanvas);
    const emoteSpriteMat = new THREE.SpriteMaterial({
      map: this.emoteTexture,
      transparent: true,
      depthTest: false
    });
    this.emoteBubbleSprite = new THREE.Sprite(emoteSpriteMat);
    this.emoteBubbleSprite.position.set(0, 19, 0);
    this.emoteBubbleSprite.scale.set(16, 8, 1);
    this.emoteBubbleSprite.visible = false;
    this.playerMesh.add(this.emoteBubbleSprite);

    this.scene.add(this.emoteParticlesGroup);

    this.scene.add(this.playerMesh);
  }

  // Build 3D Weapon Model
  private buildWeaponMesh(parent: THREE.Group, weaponId: WeaponId) {
    // Clear previous
    while (parent.children.length > 2) {
      parent.remove(parent.children[2]);
    }

    const gunMat = new THREE.MeshLambertMaterial({ color: '#1e293b' });
    const woodMat = new THREE.MeshLambertMaterial({ color: '#854d0e' });
    const goldMat = new THREE.MeshLambertMaterial({ color: '#eab308' });
    const cyanMat = new THREE.MeshLambertMaterial({ color: '#06b6d4' });

    if (weaponId === 'ak47') {
      // AK47 Body + Wood Stock + Curved Mag
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 5.5), gunMat);
      body.position.set(0, 0, 1.5);
      parent.add(body);
      const stock = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.4, 2.5), woodMat);
      stock.position.set(0, -0.4, -1.5);
      parent.add(stock);
      const mag = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.4, 1.2), gunMat);
      mag.position.set(0, -1.4, 1.2);
      mag.rotation.x = 0.3;
      parent.add(mag);
    } else if (weaponId === 'mp40') {
      // High-tech MP40 Submachine Gun (Yellow Cobra)
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.1, 4.5), goldMat);
      body.position.set(0, 0, 1.5);
      parent.add(body);
      const mag = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.2, 0.8), gunMat);
      mag.position.set(0, -1.8, 1);
      parent.add(mag);
    } else if (weaponId === 'm1887') {
      // M1887 Double-Barrel Shotgun
      const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 4.5), gunMat);
      b1.rotateX(Math.PI / 2);
      b1.position.set(-0.35, 0, 1.8);
      parent.add(b1);
      const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 4.5), gunMat);
      b2.rotateX(Math.PI / 2);
      b2.position.set(0.35, 0, 1.8);
      parent.add(b2);
      const stock = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.6, 2.5), woodMat);
      stock.position.set(0, -0.4, -1.2);
      parent.add(stock);
    } else if (weaponId === 'awm') {
      // Long AWM Sniper Rifle with High Scope
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 8), cyanMat);
      barrel.rotateX(Math.PI / 2);
      barrel.position.set(0, 0, 3.5);
      parent.add(barrel);
      const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 3), gunMat);
      scope.rotateX(Math.PI / 2);
      scope.position.set(0, 1.2, 1);
      parent.add(scope);
      const stock = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.8, 3.5), gunMat);
      stock.position.set(0, -0.4, -1.5);
      parent.add(stock);
    } else {
      // Desert Eagle Heavy Pistol
      const slide = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 3), gunMat);
      slide.position.set(0, 0, 1);
      parent.add(slide);
      const grip = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2, 1), woodMat);
      grip.position.set(0, -1.2, 0.2);
      parent.add(grip);
    }
  }

  // 3D Safe Zone Setup
  private setupSafeZone() {
    // Translucent Electric Cyan Force-Field Cylinder
    const cylGeo = new THREE.CylinderGeometry(1500, 1500, 400, 48, 1, true);
    const cylMat = new THREE.MeshBasicMaterial({
      color: '#06b6d4',
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide
    });
    this.safeZoneCylinder = new THREE.Mesh(cylGeo, cylMat);
    this.safeZoneCylinder.position.set(0, 200, 0);
    this.scene.add(this.safeZoneCylinder);

    // Next Safe Zone Ring on Ground (White dashed indicator)
    const ringGeo = new THREE.RingGeometry(995, 1005, 64);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    this.nextSafeZoneRing = new THREE.Mesh(ringGeo, ringMat) as any;
    this.nextSafeZoneRing.position.set(0, 0.5, 0);
    this.scene.add(this.nextSafeZoneRing);
  }

  // Trigger weapon firing muzzle flash vfx
  public triggerMuzzleFlash() {
    this.muzzleFlashTimer = 0.08;
    this.muzzleFlashLight.intensity = 3.5;
    this.muzzleFlashMesh.visible = true;
  }

  // Main 3D Render Tick
  public render(engine: GameEngine, dt: number) {
    this.animClock += dt;

    // 1. Update Player 3D Position & Rotation
    const p3D = mapTo3D(engine.player.x, engine.player.y);
    const playerY = (engine.gameState === 'skydive' ? engine.skydiveAltitude * 0.4 : engine.player.z);
    this.playerMesh.position.set(p3D.x, playerY, p3D.z);
    this.playerMesh.rotation.y = -engine.player.angle + Math.PI / 2; // match Free Fire angle

    // Crouching model squash
    if (engine.player.isCrouching) {
      this.playerMesh.scale.set(1, 0.7, 1);
    } else {
      this.playerMesh.scale.set(1, 1, 1);
    }

    // Walking / Running leg animation
    const isMoving = engine.player.vx !== 0 || engine.player.vy !== 0;
    if (isMoving) {
      const legSwing = Math.sin(this.animClock * 14) * 0.6;
      this.playerLeftLeg.rotation.x = legSwing;
      this.playerRightLeg.rotation.x = -legSwing;
    } else {
      this.playerLeftLeg.rotation.x = 0;
      this.playerRightLeg.rotation.x = 0;
    }

    // Skill VFX Toggles
    this.alokAuraMesh.visible = engine.player.character.id === 'alok' && engine.player.skillActiveTimer > 0;
    this.chronoShieldMesh.visible = engine.player.character.id === 'chrono' && engine.player.skillActiveTimer > 0;
    this.wukongBushMesh.visible = engine.player.character.id === 'wukong' && engine.player.skillActiveTimer > 0;
    this.parachuteMesh.visible = engine.gameState === 'skydive';

    // Emote Procedural 3D Animations & Social Bubble
    this.updateEmoteAnimation(engine, dt);

    // Muzzle Flash Decay
    if (this.muzzleFlashTimer > 0) {
      this.muzzleFlashTimer -= dt;
      if (this.muzzleFlashTimer <= 0) {
        this.muzzleFlashLight.intensity = 0;
        this.muzzleFlashMesh.visible = false;
      }
    }

    // 2. Third-Person Camera Tracking
    this.updateCamera(engine);

    // 3. Update 3D Bots
    this.updateBots(engine);

    // 4. Update 3D Gloo Walls
    this.updateGlooWalls(engine);

    // 5. Update 3D Ground Loot
    this.updateGroundLoot(engine);

    // 6. Update 3D Airdrops
    this.updateAirdrops(engine);

    // 7. Update 3D Bullets & Tracers
    this.updateBullets(engine);

    // 8. Update 3D Safe Zone
    this.updateSafeZoneVisuals(engine);

    // 9. Render Scene
    this.renderer.render(this.scene, this.camera);
  }

  // Third-Person Over-the-Shoulder Camera
  private updateCamera(engine: GameEngine) {
    const p3D = mapTo3D(engine.player.x, engine.player.y);
    const playerY = engine.gameState === 'skydive' ? engine.skydiveAltitude * 0.4 : engine.player.z;

    const zoom = engine.player.isScoping ? 0.45 : 1.0;
    const dist = this.cameraDistance * zoom;
    const height = this.cameraHeight * (engine.player.isCrouching ? 0.7 : 1.0) * zoom;

    // Camera offset behind player using yaw & pitch
    const camX = p3D.x - Math.sin(this.yaw) * Math.cos(this.pitch) * dist;
    const camZ = p3D.z - Math.cos(this.yaw) * Math.cos(this.pitch) * dist;
    const camY = playerY + height + Math.sin(this.pitch) * dist;

    this.camera.position.set(camX, Math.max(1.5, camY), camZ);

    // Look at player chest/head with over-shoulder crosshair offset
    const lookTarget = new THREE.Vector3(
      p3D.x + Math.sin(this.yaw) * 4,
      playerY + 11,
      p3D.z + Math.cos(this.yaw) * 4
    );
    this.camera.lookAt(lookTarget);

    // FOV adjustment for sniper zoom
    const targetFov = engine.player.isScoping ? 28 : 60;
    if (Math.abs(this.camera.fov - targetFov) > 0.5) {
      this.camera.fov += (targetFov - this.camera.fov) * 0.2;
      this.camera.updateProjectionMatrix();
    }
  }

  // Synchronize 3D Enemy Bots
  private updateBots(engine: GameEngine) {
    const activeBotIds = new Set<string>();

    engine.bots.forEach(bot => {
      if (!bot.isAlive) return;
      activeBotIds.add(bot.id);

      const b3D = mapTo3D(bot.x, bot.y);
      let botEntry = this.botMeshes.get(bot.id);

      if (!botEntry) {
        // Create 3D Bot Mesh
        const group = new THREE.Group();

        // Torso (Red / Black Tactical)
        const torsoMat = new THREE.MeshLambertMaterial({ color: '#991b1b' });
        const torso = new THREE.Mesh(new THREE.BoxGeometry(4.2, 6.5, 2.8), torsoMat);
        torso.position.y = 9;
        torso.castShadow = true;
        group.add(torso);

        // Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(1.6, 12, 12), new THREE.MeshLambertMaterial({ color: '#fed7aa' }));
        head.position.set(0, 13.5, 0);
        head.castShadow = true;
        group.add(head);

        // Legs
        const legMat = new THREE.MeshLambertMaterial({ color: '#1e293b' });
        const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(1.6, 7, 1.8), legMat);
        leftLeg.position.set(-1.2, 3.5, 0);
        leftLeg.castShadow = true;
        group.add(leftLeg);

        const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(1.6, 7, 1.8), legMat);
        rightLeg.position.set(1.2, 3.5, 0);
        rightLeg.castShadow = true;
        group.add(rightLeg);

        // Gun in hands
        const gun = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1, 4), new THREE.MeshLambertMaterial({ color: '#0f172a' }));
        gun.position.set(1.4, 9, 2.5);
        group.add(gun);

        // Floating HP Bar Sprite
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 32;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(0, 10, 128, 12);
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: texture });
        const hpBar = new THREE.Sprite(spriteMat);
        hpBar.position.set(0, 17, 0);
        hpBar.scale.set(10, 2.5, 1);
        group.add(hpBar);

        this.botsGroup.add(group);
        botEntry = { group, leftLeg, rightLeg, hpBar };
        this.botMeshes.set(bot.id, botEntry);
      }

      // Update position & rotation
      botEntry.group.position.set(b3D.x, bot.z || 0, b3D.z);
      botEntry.group.rotation.y = -bot.angle + Math.PI / 2;

      // Leg swing animation
      if (bot.vx !== 0 || bot.vy !== 0) {
        const swing = Math.sin(this.animClock * 12 + parseFloat(bot.id) * 2) * 0.5;
        botEntry.leftLeg.rotation.x = swing;
        botEntry.rightLeg.rotation.x = -swing;
      }
    });

    // Remove eliminated bots
    this.botMeshes.forEach((entry, id) => {
      if (!activeBotIds.has(id)) {
        this.botsGroup.remove(entry.group);
        this.botMeshes.delete(id);
      }
    });
  }

  // Synchronize 3D Gloo Walls (Crucial Free Fire Signature Defense!)
  private updateGlooWalls(engine: GameEngine) {
    const activeGlooIds = new Set<string>();

    engine.glooWalls.forEach(gw => {
      activeGlooIds.add(gw.id);
      const gw3D = mapTo3D(gw.x, gw.y);
      let wallGroup = this.glooMeshes.get(gw.id);

      if (!wallGroup) {
        wallGroup = new THREE.Group();

        // Authentic Curved 3D Ice Wall Geometry
        const curveGeo = new THREE.CylinderGeometry(18, 18, 14, 16, 1, true, -Math.PI / 3, (Math.PI * 2) / 3);
        const iceMat = new THREE.MeshLambertMaterial({
          color: '#38bdf8',
          transparent: true,
          opacity: 0.85,
          side: THREE.DoubleSide
        });
        const iceWall = new THREE.Mesh(curveGeo, iceMat);
        iceWall.position.y = 7;
        iceWall.castShadow = true;
        iceWall.receiveShadow = true;
        wallGroup.add(iceWall);

        // Glowing Ice Edge Trim
        const edgeGeo = new THREE.RingGeometry(17.8, 18.2, 16, 1, -Math.PI / 3, (Math.PI * 2) / 3);
        edgeGeo.rotateX(-Math.PI / 2);
        const edgeMat = new THREE.MeshBasicMaterial({ color: '#e0f2fe', side: THREE.DoubleSide });
        const edge = new THREE.Mesh(edgeGeo, edgeMat);
        edge.position.y = 14;
        wallGroup.add(edge);

        this.glooWallsGroup.add(wallGroup);
        this.glooMeshes.set(gw.id, wallGroup);
      }

      wallGroup.position.set(gw3D.x, gw.z || 0, gw3D.z);
      wallGroup.rotation.y = -gw.angle;

      // Pulse color red if damaged
      if (gw.hp < 300) {
        const mesh = wallGroup.children[0] as THREE.Mesh;
        (mesh.material as THREE.MeshLambertMaterial).color.set('#f87171');
      }
    });

    // Remove destroyed walls
    this.glooMeshes.forEach((group, id) => {
      if (!activeGlooIds.has(id)) {
        this.glooWallsGroup.remove(group);
        this.glooMeshes.delete(id);
      }
    });
  }

  // Synchronize 3D Ground Loot
  private updateGroundLoot(engine: GameEngine) {
    const activeLootIds = new Set<string>();

    engine.groundItems.forEach(item => {
      activeLootIds.add(item.id);
      const l3D = mapTo3D(item.x, item.y);
      let group = this.lootMeshes.get(item.id);

      if (!group) {
        group = new THREE.Group();

        if (item.type === 'weapon') {
          // Floating 3D Gun + Glowing Rarity Light Beam
          const gun = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 4), new THREE.MeshLambertMaterial({ color: '#f59e0b' }));
          gun.castShadow = true;
          group.add(gun);

          // Rarity Beam
          const beamGeo = new THREE.CylinderGeometry(0.8, 0.8, 25, 8);
          const beamMat = new THREE.MeshBasicMaterial({ color: '#f59e0b', transparent: true, opacity: 0.35 });
          const beam = new THREE.Mesh(beamGeo, beamMat);
          beam.position.y = 12.5;
          group.add(beam);
        } else if (item.type === 'gloo') {
          // Cyan Gloo Grenade
          const orb = new THREE.Mesh(new THREE.SphereGeometry(1.5, 12, 12), new THREE.MeshLambertMaterial({ color: '#06b6d4' }));
          group.add(orb);
        } else if (item.type === 'medkit') {
          // Green Medkit
          const med = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 2.5), new THREE.MeshLambertMaterial({ color: '#10b981' }));
          group.add(med);
        } else {
          // Mushroom or Armor
          const shroom = new THREE.Mesh(new THREE.CylinderGeometry(2, 0.8, 2), new THREE.MeshLambertMaterial({ color: '#f97316' }));
          group.add(shroom);
        }

        this.lootGroup.add(group);
        this.lootMeshes.set(item.id, group);
      }

      // Rotate and float loot
      group.position.set(l3D.x, 2.5 + Math.sin(this.animClock * 3 + item.x) * 0.6, l3D.z);
      group.rotation.y += 0.025;
    });

    this.lootMeshes.forEach((group, id) => {
      if (!activeLootIds.has(id)) {
        this.lootGroup.remove(group);
        this.lootMeshes.delete(id);
      }
    });
  }

  // Synchronize 3D Airdrop Crates & Golden Smoke Beacons
  private updateAirdrops(engine: GameEngine) {
    const activeAdIds = new Set<string>();

    engine.airdrops.forEach(ad => {
      activeAdIds.add(ad.id);
      const ad3D = mapTo3D(ad.x, ad.y);
      let group = this.airdropMeshes.get(ad.id);

      if (!group) {
        group = new THREE.Group();

        // Red & Blue Military Crate
        const crate = new THREE.Mesh(new THREE.BoxGeometry(8, 8, 8), new THREE.MeshLambertMaterial({ color: '#dc2626' }));
        crate.position.y = 4;
        crate.castShadow = true;
        group.add(crate);

        // Towering Golden Smoke / Light Beacon piercing the clouds
        const beaconGeo = new THREE.CylinderGeometry(2.5, 4, 350, 16);
        const beaconMat = new THREE.MeshBasicMaterial({
          color: '#eab308',
          transparent: true,
          opacity: 0.45,
          side: THREE.DoubleSide
        });
        const beacon = new THREE.Mesh(beaconGeo, beaconMat);
        beacon.position.y = 175;
        group.add(beacon);

        this.airdropsGroup.add(group);
        this.airdropMeshes.set(ad.id, group);
      }

      group.position.set(ad3D.x, ad.altitude * 0.4, ad3D.z);
    });

    this.airdropMeshes.forEach((group, id) => {
      if (!activeAdIds.has(id)) {
        this.airdropsGroup.remove(group);
        this.airdropMeshes.delete(id);
      }
    });
  }

  // Synchronize 3D Bullets & Glowing Tracers
  private updateBullets(engine: GameEngine) {
    // Clear bullet group children
    while (this.bulletsGroup.children.length > 0) {
      this.bulletsGroup.remove(this.bulletsGroup.children[0]);
    }

    const tracerMat = new THREE.LineBasicMaterial({ color: '#fbbf24', linewidth: 2 });

    engine.bullets.forEach(b => {
      const p1 = mapTo3D(b.prevX, b.prevY);
      const p2 = mapTo3D(b.x, b.y);
      const z1 = b.prevZ || 12;
      const z2 = b.z || 12;

      const points = [new THREE.Vector3(p1.x, z1, p1.z), new THREE.Vector3(p2.x, z2, p2.z)];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeo, tracerMat);
      this.bulletsGroup.add(line);
    });
  }

  // Update Safe Zone Cylinders
  private updateSafeZoneVisuals(engine: GameEngine) {
    const zone = engine.safeZone;
    const current3D = mapTo3D(zone.currentX, zone.currentY);
    const target3D = mapTo3D(zone.targetX, zone.targetY);

    this.safeZoneCylinder.position.set(current3D.x, 200, current3D.z);
    this.safeZoneCylinder.scale.set(zone.currentRadius / 1500, 1, zone.currentRadius / 1500);

    this.nextSafeZoneRing.position.set(target3D.x, 0.6, target3D.z);
    this.nextSafeZoneRing.scale.set(zone.targetRadius / 1000, zone.targetRadius / 1000, 1);
  }

  // Procedural Emote Animations & Floating Social Badge
  private updateEmoteAnimation(engine: GameEngine, dt: number) {
    const activeEmote = engine.player.activeEmote;

    // Confetti particles update
    for (let i = this.emoteConfettiList.length - 1; i >= 0; i--) {
      const p = this.emoteConfettiList[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.emoteParticlesGroup.remove(p.mesh);
        this.emoteConfettiList.splice(i, 1);
        continue;
      }
      p.mesh.position.x += p.vx * dt;
      p.mesh.position.y += p.vy * dt;
      p.mesh.position.z += p.vz * dt;
      p.vy -= 16 * dt; // gravity
      p.mesh.rotation.x += p.rotV * dt;
      p.mesh.rotation.y += p.rotV * dt;
    }

    if (activeEmote) {
      // 1. Draw Emote Canvas Badge if changed
      if (this.lastEmoteId !== activeEmote.id) {
        const ctx = this.emoteCanvasCtx;
        ctx.clearRect(0, 0, 256, 128);

        // Backdrop rounded chamber pill
        ctx.save();
        ctx.shadowColor = activeEmote.color;
        ctx.shadowBlur = 18;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(12, 12, 232, 104, [24]);
        } else {
          ctx.rect(12, 12, 232, 104);
        }
        ctx.fill();

        ctx.strokeStyle = activeEmote.color;
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();

        // Inner border highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(16, 16, 224, 96, [20]);
        } else {
          ctx.rect(16, 16, 224, 96);
        }
        ctx.stroke();

        // Emote Emoji Icon (Large)
        ctx.font = '50px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(activeEmote.icon, 70, 64);

        // Emote Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(activeEmote.name.toUpperCase(), 112, 52);

        // Badge subtitle
        ctx.fillStyle = activeEmote.color;
        ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
        ctx.fillText('★ FREE FIRE EMOTE ★', 112, 76);

        this.emoteTexture.needsUpdate = true;
        this.lastEmoteId = activeEmote.id;
      }

      this.emoteBubbleSprite.visible = true;
      const pulse = 1 + Math.sin(this.animClock * 8) * 0.08;
      this.emoteBubbleSprite.scale.set(16 * pulse, 8 * pulse, 1);

      // Holster weapon during emote
      this.weaponMeshGroup.visible = false;

      // 2. Procedural Rig Animations based on Emote
      switch (activeEmote.id) {
        case 'booyah': {
          // Double arm victory pump in the sky
          const pump = Math.sin(this.animClock * 12) * 0.2;
          this.playerLeftArm.position.set(-2.4, 13 + pump * 2, 0);
          this.playerLeftArm.rotation.set(0, 0, Math.PI - 0.2 + pump);
          this.playerRightArm.position.set(2.4, 13 + pump * 2, 0);
          this.playerRightArm.rotation.set(0, 0, -Math.PI + 0.2 - pump);
          this.playerTorso.rotation.set(-0.15, 0, 0);
          this.playerTorso.position.set(0, 9, 0);
          this.playerHead.rotation.set(-0.35, 0, 0);

          // Golden victory confetti
          if (Math.random() < 0.35 && this.emoteConfettiList.length < 60) {
            const piece = new THREE.Mesh(
              new THREE.PlaneGeometry(1, 1),
              new THREE.MeshBasicMaterial({
                color: Math.random() < 0.5 ? '#f59e0b' : '#fde047',
                side: THREE.DoubleSide
              })
            );
            const p = this.playerMesh.position;
            piece.position.set(
              p.x + (Math.random() * 10 - 5),
              p.y + 4 + Math.random() * 8,
              p.z + (Math.random() * 10 - 5)
            );
            this.emoteParticlesGroup.add(piece);
            this.emoteConfettiList.push({
              mesh: piece,
              vx: (Math.random() - 0.5) * 8,
              vy: 10 + Math.random() * 8,
              vz: (Math.random() - 0.5) * 8,
              rotV: (Math.random() - 0.5) * 12,
              life: 1.4
            });
          }
          break;
        }
        case 'dance': {
          // Shark Groove Wave Dance
          const danceSpeed = 9;
          const swing = Math.sin(this.animClock * danceSpeed);
          this.playerTorso.rotation.set(0, swing * 0.45, 0);
          this.playerTorso.position.set(0, 9 + Math.abs(Math.sin(this.animClock * danceSpeed * 2)) * 0.8, 0);
          this.playerLeftArm.position.set(-2.8, 10 + swing * 1.6, 0.5);
          this.playerLeftArm.rotation.set(-0.3, 0, Math.PI / 2.2 + swing * 0.45);
          this.playerRightArm.position.set(2.8, 10 - swing * 1.6, 0.5);
          this.playerRightArm.rotation.set(-0.3, 0, -Math.PI / 2.2 - swing * 0.45);
          this.playerLeftLeg.rotation.set(0, 0, swing * 0.25);
          this.playerRightLeg.rotation.set(0, 0, swing * 0.25);
          this.playerHead.rotation.set(0, -swing * 0.3, 0);
          break;
        }
        case 'laugh': {
          // LOL clutching belly laughing
          const laughBounce = Math.sin(this.animClock * 16);
          this.playerLeftArm.position.set(-2.2, 7.5, 1.2);
          this.playerLeftArm.rotation.set(-Math.PI / 4, 0, 0.35);
          this.playerRightArm.position.set(2.2, 7.5, 1.2);
          this.playerRightArm.rotation.set(-Math.PI / 4, 0, -0.35);
          this.playerTorso.position.set(0, 9 + Math.abs(laughBounce) * 0.9, 0);
          this.playerTorso.rotation.set(0.25 + laughBounce * 0.1, 0, 0);
          this.playerHead.rotation.set(-0.35 + laughBounce * 0.15, 0, 0);
          break;
        }
        case 'applause': {
          // Clapping hands in front
          const clap = Math.sin(this.animClock * 22) * 0.3;
          this.playerLeftArm.position.set(-1.4, 9, 2);
          this.playerLeftArm.rotation.set(-Math.PI / 2.4, Math.PI / 4 + clap, 0);
          this.playerRightArm.position.set(1.4, 9, 2);
          this.playerRightArm.rotation.set(-Math.PI / 2.4, -Math.PI / 4 - clap, 0);
          this.playerTorso.position.set(0, 9, 0);
          this.playerTorso.rotation.set(0, 0, 0);
          this.playerHead.rotation.set(Math.sin(this.animClock * 11) * 0.1, 0, 0);
          break;
        }
        case 'wave': {
          // Friendly high wave
          const waveSwing = Math.sin(this.animClock * 14) * 0.45;
          this.playerLeftArm.position.set(-2.8, 8, 0);
          this.playerLeftArm.rotation.set(0, 0, 0.15);
          this.playerRightArm.position.set(2.8, 12, 0);
          this.playerRightArm.rotation.set(0, 0, -Math.PI + 0.3 + waveSwing);
          this.playerTorso.position.set(0, 9, 0);
          this.playerTorso.rotation.set(0, 0, 0);
          this.playerHead.rotation.set(0, 0, Math.sin(this.animClock * 7) * 0.15);
          break;
        }
        case 'flex': {
          // Bodybuilder Double Biceps
          this.playerLeftArm.position.set(-3.2, 11, 0.5);
          this.playerLeftArm.rotation.set(0, 0.4, Math.PI / 2.2);
          this.playerRightArm.position.set(3.2, 11, 0.5);
          this.playerRightArm.rotation.set(0, -0.4, -Math.PI / 2.2);
          this.playerTorso.position.set(0, 9, 0);
          this.playerTorso.rotation.set(-0.15, 0, 0);
          this.playerTorso.scale.set(1.15, 1.05, 1.15);
          this.playerHead.rotation.set(0, Math.sin(this.animClock * 4) * 0.35, 0);
          break;
        }
        case 'threaten': {
          // Threatening throat slice
          const slashT = (this.animClock * 2.5) % 1;
          const handX = 2.0 - slashT * 4.2;
          this.playerLeftArm.position.set(-2.6, 7.5, 0.5);
          this.playerLeftArm.rotation.set(-0.2, 0, 0.2);
          this.playerRightArm.position.set(handX, 11.5, 1.5);
          this.playerRightArm.rotation.set(-Math.PI / 3, 0, -Math.PI / 4);
          this.playerTorso.position.set(0, 9, 0);
          this.playerTorso.rotation.set(0, 0, 0);
          this.playerHead.rotation.set(0.25, 0, 0);
          break;
        }
        case 'dab': {
          // Fast Tactical Dab
          this.playerLeftArm.position.set(-1.6, 12, 1.4);
          this.playerLeftArm.rotation.set(-Math.PI / 3, 0.2, 0.85);
          this.playerRightArm.position.set(3.2, 13, -0.5);
          this.playerRightArm.rotation.set(0.25, 0, -Math.PI / 2.7);
          this.playerTorso.position.set(0, 9, 0);
          this.playerTorso.rotation.set(0, 0, 0);
          this.playerHead.rotation.set(0.35, 0.2, 0.45);
          break;
        }
      }
    } else {
      // Emote is inactive -> restore normal stance
      this.emoteBubbleSprite.visible = false;
      this.lastEmoteId = null;
      this.weaponMeshGroup.visible = true;

      // Reset arm and torso kinematics to standard weapon hold
      this.playerLeftArm.position.set(-2.8, 9, 1.5);
      this.playerLeftArm.rotation.set(-Math.PI / 4, 0, 0);
      this.playerRightArm.position.set(2.8, 9, 1.5);
      this.playerRightArm.rotation.set(-Math.PI / 3, 0, 0);
      this.playerTorso.position.set(0, 9, 0);
      this.playerTorso.rotation.set(0, 0, 0);
      this.playerTorso.scale.set(1, 1, 1);
      this.playerHead.rotation.set(0, 0, 0);
      this.playerLeftLeg.rotation.z = 0;
      this.playerRightLeg.rotation.z = 0;
    }
  }

  // Switch Active Weapon Model
  public setWeaponModel(weaponId: WeaponId) {
    this.buildWeaponMesh(this.weaponMeshGroup, weaponId);
  }

  // Resize Viewport
  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // Dispose Resources
  public dispose() {
    this.renderer.dispose();
  }
}
