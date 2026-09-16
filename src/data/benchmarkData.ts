import { HardwareProfileBenchmark } from '../types';

export const STANDARD_CLIENT_PROFILE: HardwareProfileBenchmark = {
  specTarget: 'Tier 1-2 Budget Devices (Snapdragon 665 / Helio G85 / Mali-G52 / 2-3GB RAM / Android 8.0+)',
  targetResolution: '720p Dynamic Scaler (down to 540p under thermal load)',
  targetFramerate: 'Locked 30 FPS / Optional 60 FPS Performance Mode',
  drawCallsAverage: 120, // Max 150 per frame
  vertexBudget: '150,000 to 220,000 vertices per frame',
  textureBudget: '128MB to 256MB VRAM (ASTC 6x6 / 8x8 compressed)',
  ramUsageMB: 780, // Sub-1GB active memory allocation
  initialApkSizeMB: 650, // Ultra-compact base download
  shadingModel: 'Forward Shading, Custom Blinn-Phong & Half-Lambert, Zero Realtime Point Lights',
  shadowModel: 'Pre-baked Lightmaps + 1 Directional Baked Shadow with Low-Res Blob Shadows for Characters',
  postProcessing: [
    'Color Grading LUT (low overhead)',
    'Zero Depth of Field / Bloom / Motion Blur',
    'Static Screen-Space Vignette'
  ]
};

export const ENHANCED_CLIENT_PROFILE: HardwareProfileBenchmark = {
  specTarget: 'Tier 4-5 Flagship & Gaming Devices (Snapdragon 8 Gen 2/3 / Dimensity 9300 / Apple A16/A17 Pro / 8-16GB RAM)',
  targetResolution: 'Native 1080p / 1440p with MetalFX / FSR 2.2 Upscaling',
  targetFramerate: 'Smooth 90 FPS / 120 FPS High Refresh Mode',
  drawCallsAverage: 450, // Up to 650 in dense urban POIs
  vertexBudget: '600,000 to 1,200,000 vertices per frame',
  textureBudget: '768MB to 1,536MB VRAM (PBR 2K/4K ASTC 4x4 & Uncompressed Normals)',
  ramUsageMB: 2850,
  initialApkSizeMB: 2100, // HD asset pack with 360-degree interactive 3D lobby
  shadingModel: 'Universal Render Pipeline (URP) Deferred+ / Forward+, Full PBR Metallic-Roughness, Realtime Muzzle Flash & Grenade Lights',
  shadowModel: '4-Cascade Directional Shadow Maps (CSM) + Screen Space Contact Shadows + Soft Filtering (PCF 5x5)',
  postProcessing: [
    'ACES Tone-Mapping & Vivid HDR Color Grading',
    'Screen Space Ambient Occlusion (SSAO)',
    'Dynamic Bloom & Volumetric Light Shafts (God Rays)',
    'Screen Space Reflections (SSR) on Water & Glacial Ice',
    'Dynamic Heat Distortion & Weapon Firing Shockwaves'
  ]
};

export const NETCODE_SPEC = {
  architecture: 'Client-Server Authoritative with Client-Side Prediction & Lag Compensation',
  transportProtocol: 'UDP with KCP / RakNet reliable-unreliable multiplexing',
  serverTickRate: '30 Hz (33.33ms snapshot delta tick)',
  clientTickRate: '60 Hz to 120 Hz interpolation buffer',
  lagCompensationWindow: 'Up to 250ms circular historical hit-registration rewind buffer',
  deltaCompression: 'Bit-packed entity snapshots; delta encoding against confirmed base ack frame',
  bandwidthBudget: '18 KB/sec down (50 players active) / 4.5 KB/sec up',
  antiCheatLayers: [
    'Server-side deterministic physics validation (speed, trajectory, teleport detection)',
    'Raycast obstruction verification on authoritative server for all bullet hits and Gloo Wall colliders',
    'Memory signature integrity scanning & obfuscated Lua/C# bytecode via IL2CPP + custom tamper detection',
    'Server-side aimbot anomaly analysis (angular jerk rate, snap-to-target standard deviation)'
  ]
};
