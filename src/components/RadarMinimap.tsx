import React, { useRef, useEffect } from 'react';
import { GameEngine } from '../game/GameEngine';

interface RadarMinimapProps {
  engine: GameEngine;
}

export const RadarMinimap: React.FC<RadarMinimapProps> = ({ engine }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerRx = width / 2;
    const centerRy = height / 2;
    const radarRadius = width / 2 - 4;
    const radarScale = 0.12; // 12% scale to view ~500m area

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    // Circular clip
    ctx.beginPath();
    ctx.arc(centerRx, centerRy, radarRadius, 0, Math.PI * 2);
    ctx.clip();

    // Background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(0, 0, width, height);

    // Grid rings
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerRx, centerRy, radarRadius * 0.5, 0, Math.PI * 2);
    ctx.stroke();

    // Safe Zone Circle
    const safeZone = engine.safeZone;
    const relSzX = centerRx + (safeZone.currentX - engine.player.x) * radarScale;
    const relSzY = centerRy + (safeZone.currentY - engine.player.y) * radarScale;
    const relSzRad = safeZone.currentRadius * radarScale;

    ctx.strokeStyle = 'rgba(6, 182, 212, 0.9)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(relSzX, relSzY, relSzRad, 0, Math.PI * 2);
    ctx.stroke();

    // Next Safe Zone Target (White dashed)
    const relTgtX = centerRx + (safeZone.targetX - engine.player.x) * radarScale;
    const relTgtY = centerRy + (safeZone.targetY - engine.player.y) * radarScale;
    const relTgtRad = safeZone.targetRadius * radarScale;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.setLineDash([3, 2]);
    ctx.beginPath();
    ctx.arc(relTgtX, relTgtY, relTgtRad, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Nearby Enemies (Red gunshot pings)
    engine.bots.forEach(bot => {
      if (!bot.isAlive) return;
      const bx = centerRx + (bot.x - engine.player.x) * radarScale;
      const by = centerRy + (bot.y - engine.player.y) * radarScale;
      const d = Math.hypot(bx - centerRx, by - centerRy);
      if (d < radarRadius - 4) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Player Direction Pointer (Yellow Arrow)
    ctx.save();
    ctx.translate(centerRx, centerRy);
    ctx.rotate(engine.player.angle);
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(-5, -5);
    ctx.lineTo(-3, 0);
    ctx.lineTo(-5, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.restore();

    // Outer Glowing Amber Border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(centerRx, centerRy, radarRadius, 0, Math.PI * 2);
    ctx.stroke();

    // North Compass Indicator
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('N', centerRx, 12);
  });

  return (
    <div className="absolute top-16 right-4 pointer-events-none select-none z-20 flex flex-col items-center">
      <div className="relative rounded-full shadow-2xl p-0.5 bg-black/60 border border-amber-500/50 backdrop-blur-md">
        <canvas ref={canvasRef} width={110} height={110} className="rounded-full block" />
      </div>
      <span className="text-[9px] font-mono font-bold text-amber-400 mt-1 uppercase tracking-widest drop-shadow">
        BERMUDA RADAR
      </span>
    </div>
  );
};
