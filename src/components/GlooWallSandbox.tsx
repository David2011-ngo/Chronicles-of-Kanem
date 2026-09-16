import React, { useState, useEffect, useRef } from 'react';
import { Shield, Target, Play, RotateCcw, Zap, AlertTriangle, Crosshair, Sparkles } from 'lucide-react';

interface GlooWall {
  id: string;
  x: number;
  y: number;
  rotation: number;
  hp: number;
  maxHp: number;
  timestamp: number;
}

interface Bullet {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  source: 'enemy' | 'player';
  weapon: 'ar' | 'sniper';
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
}

export const GlooWallSandbox: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [walls, setWalls] = useState<GlooWall[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [playerHp, setPlayerHp] = useState<number>(200);
  const [glooCount, setGlooCount] = useState<number>(3);
  const [damageMitigated, setDamageMitigated] = useState<number>(0);
  const [shotsBlocked, setShotsBlocked] = useState<number>(0);
  const [turretActive, setTurretActive] = useState<boolean>(true);
  const [turretWeapon, setTurretWeapon] = useState<'ar' | 'sniper'>('ar');
  const [specialEvoDracoBonus, setSpecialEvoDracoBonus] = useState<boolean>(false);
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 380, y: 350 });

  // Canvas bounds: 760 x 420
  const width = 760;
  const height = 420;

  // Turret fire timer
  useEffect(() => {
    if (!turretActive) return;

    const intervalTime = turretWeapon === 'ar' ? 240 : 1200;
    const interval = setInterval(() => {
      const turretX = 380;
      const turretY = 45;
      const angle = Math.atan2(playerPos.y - turretY, playerPos.x - turretX) + (Math.random() * 0.1 - 0.05);
      const speed = turretWeapon === 'ar' ? 8 : 14;
      const damage = turretWeapon === 'ar' ? 28 : 120;

      const newBullet: Bullet = {
        id: Math.random().toString(),
        x: turretX,
        y: turretY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        damage: specialEvoDracoBonus ? Math.round(damage * 1.25) : damage,
        source: 'enemy',
        weapon: turretWeapon
      };

      setBullets(prev => [...prev.slice(-30), newBullet]);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [turretActive, turretWeapon, playerPos, specialEvoDracoBonus]);

  // Main physics loop
  useEffect(() => {
    let animId: number;

    const tick = () => {
      // 1. Move bullets and test collision against Gloo walls or player
      setBullets(prevBullets => {
        const nextBullets: Bullet[] = [];

        prevBullets.forEach(b => {
          const nextX = b.x + b.vx;
          const nextY = b.y + b.vy;

          // Check boundary
          if (nextX < 0 || nextX > width || nextY < 0 || nextY > height) {
            return;
          }

          // Check collision with Gloo walls
          let hitWallId: string | null = null;
          for (const wall of walls) {
            const dx = nextX - wall.x;
            const dy = nextY - wall.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Wall width is roughly 40px radius
            if (dist < 32 && wall.hp > 0) {
              hitWallId = wall.id;
              break;
            }
          }

          if (hitWallId) {
            // Bullet blocked by wall!
            setWalls(currWalls =>
              currWalls.map(w => {
                if (w.id === hitWallId) {
                  const newHp = Math.max(0, w.hp - b.damage);
                  return { ...w, hp: newHp };
                }
                return w;
              }).filter(w => w.hp > 0)
            );

            setDamageMitigated(d => d + b.damage);
            setShotsBlocked(s => s + 1);

            // Spawn ice particles
            spawnIceParticles(nextX, nextY);
            return; // Destroy bullet
          }

          // Check collision with player
          const distToPlayer = Math.hypot(nextX - playerPos.x, nextY - playerPos.y);
          if (distToPlayer < 18) {
            setPlayerHp(hp => Math.max(0, hp - b.damage));
            spawnBloodParticles(nextX, nextY);
            return; // Destroy bullet
          }

          nextBullets.push({ ...b, x: nextX, y: nextY });
        });

        return nextBullets;
      });

      // 2. Age particles
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.05
          }))
          .filter(p => p.life > 0)
      );

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [walls, playerPos, width, height]);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#0a0e17';
    ctx.fillRect(0, 0, width, height);

    // Draw tactical grid
    ctx.strokeStyle = '#1e293b40';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Enemy Turret / Sniper at Top Center
    const turretX = 380;
    const turretY = 45;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(turretX, turretY, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f87171';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Turret barrel aimed at player
    const turretAngle = Math.atan2(playerPos.y - turretY, playerPos.x - turretX);
    ctx.beginPath();
    ctx.moveTo(turretX, turretY);
    ctx.lineTo(turretX + Math.cos(turretAngle) * 25, turretY + Math.sin(turretAngle) * 25);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#fca5a5';
    ctx.stroke();

    // Turret text
    ctx.fillStyle = '#fca5a5';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(turretWeapon === 'ar' ? 'ENEMY AR SQUAD' : 'ENEMY AWM SNIPER', turretX, turretY - 20);

    // Draw Gloo Walls
    walls.forEach(w => {
      const hpPct = w.hp / w.maxHp;
      ctx.save();
      ctx.translate(w.x, w.y);
      ctx.rotate(w.rotation);

      // Outer glow
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#38bdf8';

      // Curved Gloo Wall shape
      ctx.beginPath();
      ctx.ellipse(0, 0, 36, 14, 0, 0, Math.PI * 2);
      ctx.fillStyle = hpPct > 0.4 ? 'rgba(56, 189, 248, 0.85)' : 'rgba(239, 68, 68, 0.75)';
      ctx.fill();

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#e0f2fe';
      ctx.stroke();

      // Draw ice crystalline internal lines
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(20, 0);
      ctx.moveTo(-10, -5);
      ctx.lineTo(10, 5);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();

      // HP Bar above wall
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(w.x - 24, w.y - 24, 48, 5);
      ctx.fillStyle = hpPct > 0.5 ? '#38bdf8' : hpPct > 0.25 ? '#f59e0b' : '#ef4444';
      ctx.fillRect(w.x - 24, w.y - 24, 48 * hpPct, 5);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.strokeRect(w.x - 24, w.y - 24, 48, 5);

      ctx.fillStyle = '#bae6fd';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${w.hp} / ${w.maxHp} HP`, w.x, w.y - 30);
    });

    // Draw Bullets
    bullets.forEach(b => {
      ctx.save();
      ctx.shadowBlur = 8;
      ctx.shadowColor = b.weapon === 'sniper' ? '#f59e0b' : '#ef4444';

      ctx.fillStyle = b.weapon === 'sniper' ? '#fbbf24' : '#f87171';
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.weapon === 'sniper' ? 4 : 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Tracer line
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x - b.vx * 2, b.y - b.vy * 2);
      ctx.strokeStyle = b.weapon === 'sniper' ? 'rgba(251, 191, 36, 0.4)' : 'rgba(248, 113, 113, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    });

    // Draw Particles
    particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Draw Player
    ctx.save();
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#10b981';

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(playerPos.x, playerPos.y, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Direction line to mouse or turret
    ctx.beginPath();
    ctx.moveTo(playerPos.x, playerPos.y);
    ctx.lineTo(playerPos.x, playerPos.y - 20);
    ctx.strokeStyle = '#a7f3d0';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();

    // Player HP label
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px Chakra Petch, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`PLAYER (${playerHp} HP)`, playerPos.x, playerPos.y + 28);

  }, [walls, bullets, particles, playerPos, playerHp, turretWeapon]);

  const spawnIceParticles = (x: number, y: number) => {
    const newP: Particle[] = [];
    for (let i = 0; i < 6; i++) {
      newP.push({
        id: Math.random().toString(),
        x,
        y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        color: '#7dd3fc',
        life: 1.0
      });
    }
    setParticles(prev => [...prev.slice(-40), ...newP]);
  };

  const spawnBloodParticles = (x: number, y: number) => {
    const newP: Particle[] = [];
    for (let i = 0; i < 8; i++) {
      newP.push({
        id: Math.random().toString(),
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color: '#ef4444',
        life: 1.0
      });
    }
    setParticles(prev => [...prev.slice(-40), ...newP]);
  };

  const handleDeployGlooWall = () => {
    if (glooCount <= 0) return;

    // Place wall 40px in front of player towards incoming fire
    const angleToTurret = Math.atan2(45 - playerPos.y, 380 - playerPos.x);
    const wallX = playerPos.x + Math.cos(angleToTurret) * 42;
    const wallY = playerPos.y + Math.sin(angleToTurret) * 42;

    const newWall: GlooWall = {
      id: Math.random().toString(),
      x: wallX,
      y: wallY,
      rotation: angleToTurret + Math.PI / 2,
      hp: 600,
      maxHp: 600,
      timestamp: Date.now()
    };

    setWalls(prev => [...prev, newWall]);
    setGlooCount(c => c - 1);
    spawnIceParticles(wallX, wallY);
  };

  const handleReset = () => {
    setWalls([]);
    setBullets([]);
    setParticles([]);
    setPlayerHp(200);
    setGlooCount(3);
    setDamageMitigated(0);
    setShotsBlocked(0);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Move player on canvas click in lower half
    if (clickY > 150) {
      setPlayerPos({ x: clickX, y: clickY });
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-4">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-sky-400" />
            <h3 className="font-display font-bold text-lg text-slate-100">
              Gloo Wall Ballistics & Instant Deployment Simulator
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
              600 HP CONVEX ICE BARRIER
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Test instant physical cover deployment, bullet trajectory blocking, degradation under fire, and counter-tactics.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
            <span className="text-slate-500 mr-2">DAMAGE MITIGATED:</span>
            <span className="text-sky-400 font-bold">{damageMitigated} HP</span>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
            <span className="text-slate-500 mr-2">SHOTS BLOCKED:</span>
            <span className="text-emerald-400 font-bold">{shotsBlocked}</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Instant Deploy Gloo Wall Action Button */}
        <button
          id="deploy-gloo-wall-btn"
          onClick={handleDeployGlooWall}
          disabled={glooCount <= 0}
          className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg font-display font-bold text-sm transition-all ${
            glooCount > 0
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-blue-500 active:scale-95'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>DEPLOY GLOO WALL ({glooCount})</span>
        </button>

        {/* Restock Gloo Button */}
        <button
          id="restock-gloo-btn"
          onClick={() => setGlooCount(c => Math.min(6, c + 3))}
          className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Restock Mr. Waggor (+3)</span>
        </button>

        {/* Turret Weapon Toggle */}
        <button
          id="toggle-turret-weapon-btn"
          onClick={() => setTurretWeapon(tw => tw === 'ar' ? 'sniper' : 'ar')}
          className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
        >
          <Crosshair className="w-3.5 h-3.5 text-rose-400" />
          <span>Enemy: {turretWeapon === 'ar' ? 'Assault Rifle' : 'AWM Sniper'}</span>
        </button>

        {/* Reset Arena */}
        <button
          id="reset-sandbox-btn"
          onClick={handleReset}
          className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Arena</span>
        </button>
      </div>

      {/* Options Row */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={turretActive}
              onChange={(e) => setTurretActive(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
            />
            <span>Active Incoming Fire</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={specialEvoDracoBonus}
              onChange={(e) => setSpecialEvoDracoBonus(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
            />
            <span className="text-amber-300">Apply Evo AK47 Draco +25% Wall Breaker Perk</span>
          </label>
        </div>

        <div className="text-[11px] text-slate-400">
          Tip: Click on lower battlefield to reposition player.
        </div>
      </div>

      {/* Canvas Battlefield */}
      <div className="relative rounded-lg overflow-hidden border border-slate-800 shadow-inner">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onClick={handleCanvasClick}
          className="w-full h-auto cursor-crosshair block"
        />
        
        {/* Floating Quick Action Overlay */}
        <div className="absolute bottom-3 right-3 bg-slate-950/85 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700/60 text-xs flex items-center space-x-2">
          <span className="text-slate-400">Quick-cast hotkey:</span>
          <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-amber-400 font-mono text-[10px] border border-slate-700">TAP BUTTON</kbd>
        </div>
      </div>

      {/* Technical Architecture Notes Callout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-950/80 p-3 rounded-lg border border-slate-800 font-mono">
        <div>
          <span className="text-sky-400 font-bold block mb-1">Collision Matrix:</span>
          <span className="text-slate-400">Convex Mesh Collider synced at 30Hz server tick. Disables weapon aim-assist cones when raycast intersects wall mesh.</span>
        </div>
        <div>
          <span className="text-emerald-400 font-bold block mb-1">Placement Raycast:</span>
          <span className="text-slate-400">Origin 1.8m forward from camera. Snaps to terrain normal vector with 0.12s interpolation dampening.</span>
        </div>
        <div>
          <span className="text-amber-400 font-bold block mb-1">Melt & Degradation:</span>
          <span className="text-slate-400">Natural melt timer at 45s. Damage threshold triggers 3-stage visual crack alpha mapping at 400, 200, and 0 HP.</span>
        </div>
      </div>
    </div>
  );
};
