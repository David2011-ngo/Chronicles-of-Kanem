import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameEngine } from '../game/GameEngine';
import { CharacterId } from '../game/types';
import { BERMUDA_POIS, MAP_SIZE } from '../game/constants';
import { FreeFire3DRenderer } from '../game/renderer3d/FreeFire3DRenderer';
import { GameHUD } from './GameHUD';
import { BooyahScreen } from './BooyahScreen';
import { MobileControls } from './MobileControls';
import { RadarMinimap } from './RadarMinimap';
import { Crosshair3D } from './Crosshair3D';
import { FloatingDamageText } from './FloatingDamageText';
import { EmoteMenu } from './EmoteMenu';
import { sound } from '../game/audio';

interface FreeFireGameProps {
  selectedCharacter: CharacterId;
  onReturnToLobby: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const FreeFireGame: React.FC<FreeFireGameProps> = ({
  selectedCharacter,
  onReturnToLobby,
  isMuted,
  onToggleMute
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine>(new GameEngine(selectedCharacter));
  const renderer3dRef = useRef<FreeFire3DRenderer | null>(null);

  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [isPointerLocked, setIsPointerLocked] = useState<boolean>(false);
  const [isEmoteMenuOpen, setIsEmoteMenuOpen] = useState<boolean>(false);
  const isEmoteMenuOpenRef = useRef(false);
  isEmoteMenuOpenRef.current = isEmoteMenuOpen;
  const [, setHudTick] = useState(0);

  // Input state
  const inputRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
    aimAngle: 0,
    isFiring: false,
    jump: false,
    crouch: false,
    cameraYaw: 0,
    cameraPitch: 0.15
  });

  const isMouseDownRef = useRef(false);

  // Initialize and start match on mount
  useEffect(() => {
    const engine = engineRef.current;
    engine.startMatch(selectedCharacter);
  }, [selectedCharacter]);

  // Setup 3D Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (viewMode === '3d') {
      const r3d = new FreeFire3DRenderer(canvas);
      renderer3dRef.current = r3d;

      // Match current active weapon model
      const w = engineRef.current.getActiveWeapon();
      r3d.setWeaponModel(w.id);

      const handleResize = () => {
        if (!canvas) return;
        r3d.resize(canvas.clientWidth, canvas.clientHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        r3d.dispose();
        renderer3dRef.current = null;
      };
    } else {
      if (renderer3dRef.current) {
        renderer3dRef.current.dispose();
        renderer3dRef.current = null;
      }
    }
  }, [viewMode]);

  // Handle pointer lock change events
  useEffect(() => {
    const onPointerLockChange = () => {
      const locked = document.pointerLockElement === canvasRef.current;
      setIsPointerLocked(locked);
      if (renderer3dRef.current) {
        renderer3dRef.current.isLocked = locked;
      }
    };

    document.addEventListener('pointerlockchange', onPointerLockChange);
    return () => {
      document.removeEventListener('pointerlockchange', onPointerLockChange);
    };
  }, []);

  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);

  // Auto-focus canvas on mount so keyboard controls work immediately
  useEffect(() => {
    canvasRef.current?.focus();
  }, []);

  // Request / release pointer lock
  const togglePointerLock = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (document.pointerLockElement === canvas) {
      document.exitPointerLock();
    } else {
      try {
        canvas.requestPointerLock?.();
      } catch {
        // Pointer lock fallback
      }
    }
  }, []);

  const handleCanvasClick = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.focus();
    // Only request pointer lock on canvas click if not already locked
    if (document.pointerLockElement !== canvas) {
      try {
        canvas.requestPointerLock?.();
      } catch {
        // Graceful fallback if pointer lock is restricted in iframe
      }
    }
  }, []);

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const code = e.code;
      const engine = engineRef.current;

      const isUp = key === 'w' || key === 'arrowup' || code === 'KeyW' || code === 'ArrowUp';
      const isDown = key === 's' || key === 'arrowdown' || code === 'KeyS' || code === 'ArrowDown';
      const isLeft = key === 'a' || key === 'arrowleft' || code === 'KeyA' || code === 'ArrowLeft';
      const isRight = key === 'd' || key === 'arrowright' || code === 'KeyD' || code === 'ArrowRight';
      const isJump = key === ' ' || key === 'spacebar' || code === 'Space';

      if (isUp) inputRef.current.up = true;
      if (isDown) inputRef.current.down = true;
      if (isLeft) inputRef.current.left = true;
      if (isRight) inputRef.current.right = true;
      if (isJump) inputRef.current.jump = true;

      // If user moves or jumps while emote menu is open, automatically close emote menu
      if (isEmoteMenuOpenRef.current && (isUp || isDown || isLeft || isRight || isJump)) {
        setIsEmoteMenuOpen(false);
      }

      // 3D Jump & Crouch
      if (key === 'c' || code === 'KeyC') {
        inputRef.current.crouch = !inputRef.current.crouch;
      }

      // Free Fire Combat Shortcuts
      if (key === 'b' || code === 'KeyB') {
        if (isEmoteMenuOpenRef.current) {
          setIsEmoteMenuOpen(false);
        } else {
          setIsEmoteMenuOpen(true);
          if (document.pointerLockElement) {
            document.exitPointerLock?.();
          }
        }
        return;
      }

      if (isEmoteMenuOpenRef.current) {
        if (key === 'escape') {
          setIsEmoteMenuOpen(false);
        }
        return;
      }

      if (key === 'g' || code === 'KeyG') engine.deployGlooWall();
      if (key === '4' || code === 'Digit4') engine.useMedkit();
      if (key === 'r' || code === 'KeyR') engine.reloadWeapon();
      if (key === 'f' || code === 'KeyF') engine.activateSkill();
      if (key === '1' || code === 'Digit1') {
        engine.switchWeapon(1);
        renderer3dRef.current?.setWeaponModel(engine.getActiveWeapon().id);
      }
      if (key === '2' || code === 'Digit2') {
        engine.switchWeapon(2);
        renderer3dRef.current?.setWeaponModel(engine.getActiveWeapon().id);
      }
      if (key === '3' || code === 'Digit3') {
        engine.switchWeapon(3);
        renderer3dRef.current?.setWeaponModel(engine.getActiveWeapon().id);
      }
      if (key === 'shift' || code === 'ShiftLeft' || code === 'ShiftRight') {
        engine.player.isScoping = !engine.player.isScoping;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const code = e.code;
      const isUp = key === 'w' || key === 'arrowup' || code === 'KeyW' || code === 'ArrowUp';
      const isDown = key === 's' || key === 'arrowdown' || code === 'KeyS' || code === 'ArrowDown';
      const isLeft = key === 'a' || key === 'arrowleft' || code === 'KeyA' || code === 'ArrowLeft';
      const isRight = key === 'd' || key === 'arrowright' || code === 'KeyD' || code === 'ArrowRight';
      const isJump = key === ' ' || key === 'spacebar' || code === 'Space';

      if (isUp) inputRef.current.up = false;
      if (isDown) inputRef.current.down = false;
      if (isLeft) inputRef.current.left = false;
      if (isRight) inputRef.current.right = false;
      if (isJump) inputRef.current.jump = false;
    };

    const handleBlur = () => {
      inputRef.current.up = false;
      inputRef.current.down = false;
      inputRef.current.left = false;
      inputRef.current.right = false;
      inputRef.current.jump = false;
      inputRef.current.isFiring = false;
      isMouseDownRef.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Handle mouse aim and firing
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (viewMode === '3d') {
      const r3d = renderer3dRef.current;
      if (r3d) {
        const isLocked = document.pointerLockElement === canvas;
        let dx = e.movementX;
        let dy = e.movementY;

        // Fallback smooth deltas if movementX/Y is zero or unavailable outside pointer lock
        if (lastMousePosRef.current) {
          if (dx === undefined || (!isLocked && dx === 0)) {
            dx = e.clientX - lastMousePosRef.current.x;
          }
          if (dy === undefined || (!isLocked && dy === 0)) {
            dy = e.clientY - lastMousePosRef.current.y;
          }
        }
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };

        const sensitivity = 0.0032;
        if (isLocked || isMouseDownRef.current) {
          if (typeof dx === 'number' && !isNaN(dx)) {
            r3d.yaw += dx * sensitivity;
          }
          if (typeof dy === 'number' && !isNaN(dy)) {
            r3d.pitch = Math.max(-0.6, Math.min(0.65, r3d.pitch - dy * sensitivity));
          }
        } else {
          // Free look slightly steered towards cursor in un-locked mode
          const rect = canvas.getBoundingClientRect();
          const cx = rect.width / 2;
          const mx = e.clientX - rect.left - cx;
          r3d.yaw += (mx / cx) * 0.008;
        }

        inputRef.current.cameraYaw = r3d.yaw;
        inputRef.current.cameraPitch = r3d.pitch;
        inputRef.current.aimAngle = r3d.yaw;
      }
    } else {
      // 2D Tactical View aim
      const rect = canvas.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const angle = Math.atan2(mouseY - cy, mouseX - cx);
      inputRef.current.aimAngle = angle;
    }
  }, [viewMode]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    isMouseDownRef.current = true;
    if (e.button === 0) {
      inputRef.current.isFiring = true;
      if (viewMode === '3d') {
        renderer3dRef.current?.triggerMuzzleFlash();
      }
    } else if (e.button === 2) {
      e.preventDefault();
      engineRef.current.player.isScoping = !engineRef.current.player.isScoping;
    }
  }, [viewMode]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 0) {
      inputRef.current.isFiring = false;
      isMouseDownRef.current = false;
    }
  }, []);

  // Main 60FPS Game Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    let tickCounter = 0;

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const engine = engineRef.current;
      const canvas = canvasRef.current;

      if (canvas && engine) {
        // 1. Update Game Engine Physics and State
        engine.update(dt, inputRef.current);

        // 2. Render Viewport
        if (viewMode === '3d' && renderer3dRef.current) {
          renderer3dRef.current.render(engine, dt);
        } else {
          // 2D Tactical View
          if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
          }
          const ctx = canvas.getContext('2d');
          if (ctx) {
            drawScene2D(ctx, canvas.width, canvas.height, engine);
          }
        }

        // Synchronize HUD state ~15 times per second
        tickCounter++;
        if (tickCounter % 4 === 0) {
          setHudTick(t => t + 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [viewMode]);

  // 2D Tactical View Routine (Fallback / Minimap view)
  const drawScene2D = (ctx: CanvasRenderingContext2D, width: number, height: number, engine: GameEngine) => {
    ctx.clearRect(0, 0, width, height);

    const zoom = engine.player.isScoping ? 1.4 : 1.0;

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-engine.player.x, -engine.player.y);

    // Island Ground
    ctx.fillStyle = '#1e3a24';
    ctx.fillRect(0, 0, MAP_SIZE, MAP_SIZE);

    // Roads
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 36;
    ctx.lineCap = 'round';
    ctx.beginPath();
    BERMUDA_POIS.forEach((poi, idx) => {
      if (idx === 0) ctx.moveTo(poi.x, poi.y);
      else ctx.lineTo(poi.x, poi.y);
    });
    ctx.stroke();

    // POIs
    BERMUDA_POIS.forEach(poi => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.beginPath();
      ctx.arc(poi.x, poi.y, 200, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = poi.color;
      ctx.font = 'bold 22px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(poi.name, poi.x, poi.y + 7);
    });

    // Safe Zone
    const safeZone = engine.safeZone;
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(safeZone.currentX, safeZone.currentY, safeZone.currentRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Next safe zone
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.arc(safeZone.targetX, safeZone.targetY, safeZone.targetRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Gloo Walls
    engine.glooWalls.forEach(gw => {
      ctx.save();
      ctx.translate(gw.x, gw.y);
      ctx.rotate(gw.angle);
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(-22, -4, 44, 8);
      ctx.restore();
    });

    // Ground Loot
    engine.groundItems.forEach(item => {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(item.x, item.y, 8, 0, Math.PI * 2);
      ctx.fill();
    });

    // Bots
    engine.bots.forEach(bot => {
      if (!bot.isAlive) return;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(bot.x, bot.y, 14, 0, Math.PI * 2);
      ctx.fill();
    });

    // Player
    ctx.save();
    ctx.translate(engine.player.x, engine.player.y);
    ctx.rotate(engine.player.angle);
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    // Gun barrel
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(10, -3, 16, 6);
    ctx.restore();

    ctx.restore();
  };

  const engine = engineRef.current;

  return (
    <div id="ff-game-container" className="relative w-full h-full min-h-screen bg-black overflow-hidden select-none">
      {/* 3D WebGL Canvas Viewport */}
      <canvas
        ref={canvasRef}
        tabIndex={0}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onContextMenu={(e) => e.preventDefault()}
        className="w-full h-full min-h-screen cursor-crosshair block outline-none"
      />

      {/* 3D Combat Reticle / ADS Sniper Scope */}
      {viewMode === '3d' && (
        <Crosshair3D engine={engine} isFiring={inputRef.current.isFiring} />
      )}

      {/* Floating Damage Combat Text */}
      <FloatingDamageText popups={engine.damagePopups} />

      {/* Circular Tactical Radar Minimap */}
      <RadarMinimap engine={engine} />

      {/* Free Fire Tactical HUD */}
      <GameHUD
        engine={engine}
        onDeployGloo={() => engine.deployGlooWall()}
        onUseMedkit={() => engine.useMedkit()}
        onReload={() => engine.reloadWeapon()}
        onActivateSkill={() => engine.activateSkill()}
        onSwitchWeapon={(slot) => {
          engine.switchWeapon(slot);
          renderer3dRef.current?.setWeaponModel(engine.getActiveWeapon().id);
        }}
        onToggleScope={() => {
          engine.player.isScoping = !engine.player.isScoping;
        }}
        onOpenEmotes={() => {
          setIsEmoteMenuOpen(true);
          if (document.pointerLockElement) {
            document.exitPointerLock?.();
          }
        }}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(v => (v === '3d' ? '2d' : '3d'))}
        isPointerLocked={isPointerLocked}
        onTogglePointerLock={togglePointerLock}
      />

      {/* Mobile Touch Controls for Phones & Tablets */}
      <MobileControls
        onMove={(mv) => {
          inputRef.current.up = mv.up;
          inputRef.current.down = mv.down;
          inputRef.current.left = mv.left;
          inputRef.current.right = mv.right;
        }}
        onFireStart={() => {
          inputRef.current.isFiring = true;
          if (viewMode === '3d') {
            renderer3dRef.current?.triggerMuzzleFlash();
          }
        }}
        onFireEnd={() => {
          inputRef.current.isFiring = false;
        }}
        onDeployGloo={() => engine.deployGlooWall()}
        onUseMedkit={() => engine.useMedkit()}
        onReload={() => engine.reloadWeapon()}
        onActivateSkill={() => engine.activateSkill()}
        onOpenEmotes={() => {
          setIsEmoteMenuOpen(true);
          if (document.pointerLockElement) {
            document.exitPointerLock?.();
          }
        }}
        onSwitchSlot={(s) => {
          engine.switchWeapon(s);
          renderer3dRef.current?.setWeaponModel(engine.getActiveWeapon().id);
        }}
        currentSlot={engine.player.activeSlot}
        onJump={() => {
          inputRef.current.jump = true;
          setTimeout(() => {
            inputRef.current.jump = false;
          }, 150);
        }}
        onCrouch={() => {
          inputRef.current.crouch = !inputRef.current.crouch;
        }}
        onLook={(deltaYaw, deltaPitch) => {
          if (renderer3dRef.current) {
            renderer3dRef.current.yaw += deltaYaw;
            renderer3dRef.current.pitch = Math.max(-0.6, Math.min(0.65, renderer3dRef.current.pitch + deltaPitch));
            inputRef.current.cameraYaw = renderer3dRef.current.yaw;
            inputRef.current.cameraPitch = renderer3dRef.current.pitch;
            inputRef.current.aimAngle = renderer3dRef.current.yaw;
          }
        }}
      />

      {/* Free Fire Radial Emote Social Wheel */}
      <EmoteMenu
        isOpen={isEmoteMenuOpen}
        onClose={() => setIsEmoteMenuOpen(false)}
        onSelectEmote={(emoteId) => {
          engine.playEmote(emoteId);
        }}
        activeEmote={engine.player.activeEmote}
      />

      {/* BOOYAH Victory or Defeat Screen */}
      {(engine.gameState === 'booyah' || engine.gameState === 'gameover') && (
        <BooyahScreen
          isBooyah={engine.gameState === 'booyah'}
          stats={engine.stats}
          onPlayAgain={() => {
            engine.startMatch(selectedCharacter);
            renderer3dRef.current?.setWeaponModel(engine.getActiveWeapon().id);
          }}
          onReturnLobby={onReturnToLobby}
        />
      )}
    </div>
  );
};
