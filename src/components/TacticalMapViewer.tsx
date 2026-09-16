import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Play, 
  Pause, 
  RotateCcw, 
  MapPin, 
  Users, 
  AlertTriangle, 
  ShoppingBag, 
  Heart, 
  Package, 
  Zap
} from 'lucide-react';
import { BIOMES } from '../data/biomesData';
import { SAFE_ZONE_PHASES } from '../data/economyData';
import { Biome } from '../types';

export const TacticalMapViewer: React.FC = () => {
  const [selectedBiome, setSelectedBiome] = useState<Biome>(BIOMES[0]);
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState<number>(0);
  const [matchSeconds, setMatchSeconds] = useState<number>(0); // 0 to 600 seconds
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showVending, setShowVending] = useState<boolean>(true);
  const [showRevival, setShowRevival] = useState<boolean>(true);
  const [showAirdrops, setShowAirdrops] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mapSize = 560;

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setMatchSeconds(sec => {
        if (sec >= 600) {
          setIsPlaying(false);
          return 600;
        }
        return sec + 4; // 4x speed simulation
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Determine current phase from matchSeconds
  useEffect(() => {
    // 600 seconds total over 8 phases
    const phaseIndex = Math.min(
      7,
      Math.floor((matchSeconds / 600) * 8)
    );
    setCurrentPhaseIdx(phaseIndex);
  }, [matchSeconds]);

  // Player count calculation based on match time
  const calculateAlivePlayers = (sec: number) => {
    if (sec < 60) return 50 - Math.floor(sec * 0.15); // Drop skirmish
    if (sec < 200) return 41 - Math.floor((sec - 60) * 0.08);
    if (sec < 400) return 30 - Math.floor((sec - 200) * 0.07);
    if (sec < 540) return 16 - Math.floor((sec - 400) * 0.08);
    return Math.max(1, 5 - Math.floor((sec - 540) * 0.06));
  };

  const currentPhase = SAFE_ZONE_PHASES[currentPhaseIdx];
  const alivePlayers = calculateAlivePlayers(matchSeconds);

  // Render Map Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background terrain based on biome
    ctx.fillStyle = selectedBiome.id === 'biome-mixed'
      ? '#0f241a'
      : selectedBiome.id === 'biome-arid'
      ? '#261b12'
      : selectedBiome.id === 'biome-alpine'
      ? '#111d2b'
      : '#1a1128';
    ctx.fillRect(0, 0, mapSize, mapSize);

    // Subtle topographical contour lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 2;
    for (let r = 50; r < mapSize; r += 50) {
      ctx.beginPath();
      ctx.arc(mapSize / 2, mapSize / 2, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Grid coordinates
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    for (let c = 70; c < mapSize; c += 70) {
      ctx.beginPath();
      ctx.moveTo(c, 0);
      ctx.lineTo(c, mapSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, c);
      ctx.lineTo(mapSize, c);
      ctx.stroke();
    }

    // Draw Biome Special Features
    if (selectedBiome.id === 'biome-scifi') {
      // Zero-G Orbital Sphere (Center)
      ctx.save();
      ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
      ctx.strokeStyle = '#a78bfa';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.arc(mapSize / 2, mapSize / 2, 75, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#c4b5fd';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('ZERO-G ORBITAL SPHERE (0.25G)', mapSize / 2, mapSize / 2);

      // Portals A & B
      const portalA = { x: 140, y: 150 };
      const portalB = { x: 420, y: 400 };

      // Connecting quantum line
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(portalA.x, portalA.y);
      ctx.lineTo(portalB.x, portalB.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Portal nodes
      [portalA, portalB].forEach((pt, idx) => {
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f3e8ff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#e9d5ff';
        ctx.font = '8px monospace';
        ctx.fillText(`QUANTUM GATEWAY ${idx === 0 ? 'ALPHA' : 'BETA'}`, pt.x, pt.y - 12);
      });
    }

    // Draw POIs
    const pois = [
      { name: selectedBiome.keyPOIs[0], x: 150, y: 130 },
      { name: selectedBiome.keyPOIs[1], x: 380, y: 160 },
      { name: selectedBiome.keyPOIs[2], x: 180, y: 390 },
      { name: selectedBiome.keyPOIs[3], x: 410, y: 380 }
    ];

    pois.forEach(poi => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.arc(poi.x, poi.y, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 10px Chakra Petch, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(poi.name, poi.x, poi.y + 34);

      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(poi.x, poi.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Safe Zone Circles
    // Outer Zone (Electric Danger Gas)
    const progress = (matchSeconds % 75) / 75;
    const baseRadius = (currentPhase.radiusMeters / 650) * (mapSize * 0.44);
    const center = { x: mapSize / 2, y: mapSize / 2 };

    // Outer Danger Fog Ring
    ctx.save();
    ctx.fillStyle = 'rgba(239, 68, 68, 0.18)';
    ctx.fillRect(0, 0, mapSize, mapSize);

    // Cut out safe zone from danger fog
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(center.x, center.y, Math.max(10, baseRadius), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Safe Zone Outline
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(center.x, center.y, Math.max(10, baseRadius), 0, Math.PI * 2);
    ctx.stroke();

    // Shrinking next circle preview (Dashed White)
    const nextRadius = Math.max(5, baseRadius * 0.65);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(center.x + 15, center.y - 10, nextRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Vending Machines
    if (showVending) {
      const vendings = [
        { x: 190, y: 180 },
        { x: 350, y: 220 },
        { x: 260, y: 340 },
        { x: 440, y: 310 }
      ];
      vendings.forEach(vm => {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(vm.x - 5, vm.y - 5, 10, 10);
        ctx.strokeStyle = '#fef3c7';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(vm.x - 5, vm.y - 5, 10, 10);
      });
    }

    // Draw Revival Beacons
    if (showRevival) {
      const revivals = [
        { x: 280, y: 120 },
        { x: 120, y: 280 },
        { x: 420, y: 240 }
      ];
      revivals.forEach(rv => {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(rv.x, rv.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#d1fae5';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    }

    // Draw Dynamic Airdrops
    if (showAirdrops && currentPhase.airdropCount > 0) {
      const airdropPos = { x: center.x - 20, y: center.y + 30 };
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(airdropPos.x - 6, airdropPos.y - 6, 12, 12);
      ctx.strokeStyle = '#fee2e2';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(airdropPos.x - 6, airdropPos.y - 6, 12, 12);

      // Yellow flare beam
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(airdropPos.x, airdropPos.y - 6);
      ctx.lineTo(airdropPos.x, airdropPos.y - 25);
      ctx.stroke();
    }

  }, [selectedBiome, currentPhaseIdx, matchSeconds, showVending, showRevival, showAirdrops, currentPhase]);

  const formatClock = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const rem = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-5">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <h3 className="font-display font-bold text-lg text-slate-100">
              50-Player Dynamic Safe Zone & Tactical Biome Simulator
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              10-MINUTE MATCH TIMELINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Test 8-phase safe zone contraction, dynamic airdrops, Vending Machines, Revival Beacons, and Zero-G chambers.
          </p>
        </div>

        {/* Live Match Counters */}
        <div className="flex items-center space-x-4 bg-slate-950 px-4 py-2 rounded-lg border border-slate-800 font-mono text-xs">
          <div>
            <span className="text-slate-500 mr-2">MATCH TIME:</span>
            <span className="text-amber-400 font-bold text-sm">{formatClock(matchSeconds)} / 10:00</span>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <span className="text-slate-500 mr-2">ALIVE:</span>
            <span className="text-emerald-400 font-bold text-sm">{alivePlayers} / 50</span>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <span className="text-slate-500 mr-2">PHASE:</span>
            <span className="text-sky-400 font-bold text-sm">Phase {currentPhase.phase}/8</span>
          </div>
        </div>
      </div>

      {/* Biome Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {BIOMES.map(biome => {
          const isSelected = selectedBiome.id === biome.id;
          return (
            <button
              key={biome.id}
              onClick={() => setSelectedBiome(biome)}
              className={`p-3 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-emerald-950/40 border-emerald-500 text-slate-100 shadow'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="font-bold text-xs block truncate">{biome.name}</span>
              <span className="text-[10px] text-slate-400 block truncate">{biome.theme}</span>
            </button>
          );
        })}
      </div>

      {/* Main Map & Interactive Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Map Canvas Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-black">
            <canvas
              ref={canvasRef}
              width={mapSize}
              height={mapSize}
              className="w-full max-w-[560px] h-auto block"
            />

            {/* In-canvas Legend */}
            <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800 text-[11px] font-mono space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                <span className="text-slate-300">Active Safe Circle ({currentPhase.radiusMeters}m)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full border border-dashed border-white" />
                <span className="text-slate-400">Next Shrink Projected Zone</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                <span className="text-slate-400">Electric Gas ({currentPhase.damagePerSec} HP/s)</span>
              </div>
            </div>
          </div>

          {/* Timeline Playback Controls */}
          <div className="w-full max-w-[560px] bg-slate-950 p-3 rounded-lg border border-slate-800 mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  id="toggle-map-play-btn"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  id="reset-map-time-btn"
                  onClick={() => {
                    setMatchSeconds(0);
                    setIsPlaying(false);
                  }}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Reset to 0:00"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-slate-300">
                  {isPlaying ? 'Simulating (4x Speed)' : 'Paused'}
                </span>
              </div>

              {/* Toggle Icons Filter */}
              <div className="flex items-center space-x-3 text-xs font-mono">
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showVending}
                    onChange={(e) => setShowVending(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-amber-500"
                  />
                  <span className="text-amber-400">Vending</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showRevival}
                    onChange={(e) => setShowRevival(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-emerald-500"
                  />
                  <span className="text-emerald-400">Revivals</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAirdrops}
                    onChange={(e) => setShowAirdrops(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-rose-500"
                  />
                  <span className="text-rose-400">Airdrops</span>
                </label>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={0}
              max={600}
              value={matchSeconds}
              onChange={(e) => setMatchSeconds(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>

        {/* Phase Details & Biome Specs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Phase Telemetry Card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono uppercase text-slate-400">
                Phase {currentPhase.phase} Telemetry Spec
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Radius: {currentPhase.radiusMeters}m
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">ZONE DAMAGE</span>
                <span className="text-rose-400 font-bold text-sm">
                  {currentPhase.damagePerSec} HP / sec
                </span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">AIRDROPS ACTIVE</span>
                <span className="text-amber-400 font-bold text-sm">
                  {currentPhase.airdropCount} drops spawned
                </span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">HOLD WAIT TIMER</span>
                <span className="text-slate-200 font-bold text-sm">
                  {currentPhase.waitDurationSec} seconds
                </span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">SHRINK DURATION</span>
                <span className="text-slate-200 font-bold text-sm">
                  {currentPhase.shrinkDurationSec} seconds
                </span>
              </div>
            </div>
          </div>

          {/* Active Biome Features Card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-mono uppercase text-slate-400 border-b border-slate-800 pb-2">
              Tactical Biome Features: {selectedBiome.name}
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedBiome.tacticalDescription}
            </p>

            <div className="text-xs bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-bold text-amber-400 block">
                DISTINCT SPATIAL GIMMICK:
              </span>
              <p className="text-slate-400">{selectedBiome.distinctFeature}</p>
            </div>

            <div className="text-xs bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-bold text-sky-400 block">
                CLIMATE & VISIBILITY MODIFIER:
              </span>
              <p className="text-slate-400">{selectedBiome.climateEffect}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
