import React, { useRef, useState } from 'react';
import { Shield, Crosshair, Heart, Zap, RefreshCw, ArrowUp, ArrowDown, Smile } from 'lucide-react';

interface MobileControlsProps {
  onMove: (input: { up: boolean; down: boolean; left: boolean; right: boolean }) => void;
  onFireStart: () => void;
  onFireEnd: () => void;
  onDeployGloo: () => void;
  onUseMedkit: () => void;
  onReload: () => void;
  onActivateSkill: () => void;
  onSwitchSlot: (slot: 1 | 2) => void;
  currentSlot: 1 | 2 | 3;
  onJump?: () => void;
  onCrouch?: () => void;
  onLook?: (deltaYaw: number, deltaPitch: number) => void;
  onOpenEmotes?: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onMove,
  onFireStart,
  onFireEnd,
  onDeployGloo,
  onUseMedkit,
  onReload,
  onActivateSkill,
  onSwitchSlot,
  currentSlot,
  onJump,
  onCrouch,
  onLook,
  onOpenEmotes
}) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [touchPos, setTouchPos] = useState<{ x: number; y: number } | null>(null);
  const touchIdRef = useRef<number | null>(null);
  const lastLookTouch = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    updateJoystick(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        updateJoystick(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setTouchPos(null);
        onMove({ up: false, down: false, left: false, right: false });
        break;
      }
    }
  };

  const updateJoystick = (clientX: number, clientY: number) => {
    if (!joystickRef.current) return;
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);
    const maxRadius = 45;

    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(dist, maxRadius);
    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    setTouchPos({ x: knobX, y: knobY });

    // Threshold deadzone
    if (dist > 12) {
      const isUp = dy < -10;
      const isDown = dy > 10;
      const isLeft = dx < -10;
      const isRight = dx > 10;
      onMove({ up: isUp, down: isDown, left: isLeft, right: isRight });
    } else {
      onMove({ up: false, down: false, left: false, right: false });
    }
  };

  return (
    <div id="ff-mobile-controls" className="absolute inset-0 pointer-events-none select-none z-30 flex justify-between items-end p-4 sm:hidden">
      {/* Virtual Joystick (Left) */}
      <div
        ref={joystickRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="w-28 h-28 rounded-full bg-slate-900/60 border-2 border-slate-700/80 backdrop-blur-sm pointer-events-auto flex items-center justify-center relative touch-none shadow-2xl"
      >
        <div className="w-12 h-12 rounded-full border border-slate-600/50 flex items-center justify-center pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
        </div>
        {touchPos && (
          <div
            className="w-12 h-12 rounded-full bg-amber-500/80 border-2 border-white absolute shadow-lg pointer-events-none"
            style={{
              transform: `translate(${touchPos.x}px, ${touchPos.y}px)`
            }}
          />
        )}
      </div>

      {/* Action Buttons (Right) */}
      <div className="flex flex-col items-end gap-3 pointer-events-auto">
        {/* Weapon Toggle & Skill */}
        <div className="flex items-center gap-2">
          <button
            onTouchStart={() => onSwitchSlot(currentSlot === 1 ? 2 : 1)}
            className="w-12 h-12 rounded-xl bg-slate-900/80 border border-slate-700 text-amber-300 font-bold text-xs flex flex-col items-center justify-center shadow-lg active:scale-90"
          >
            <span>WPN</span>
            <span className="text-[10px] text-slate-400 font-mono">#{currentSlot}</span>
          </button>

          <button
            onTouchStart={onActivateSkill}
            className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/80 text-cyan-300 font-bold text-xs flex flex-col items-center justify-center shadow-lg active:scale-90"
          >
            <Zap className="w-4 h-4 fill-cyan-400" />
            <span className="text-[9px] font-black">SKILL</span>
          </button>

          {onOpenEmotes && (
            <button
              onTouchStart={onOpenEmotes}
              className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-500/80 text-amber-300 font-bold text-xs flex flex-col items-center justify-center shadow-lg active:scale-90"
              title="Emote Radial Menu"
            >
              <Smile className="w-4 h-4 fill-amber-400" />
              <span className="text-[9px] font-black">EMOTE</span>
            </button>
          )}
        </div>

        {/* 3D Movement: Jump & Crouch */}
        <div className="flex items-center gap-2">
          {onJump && (
            <button
              onTouchStart={onJump}
              className="w-12 h-12 rounded-2xl bg-amber-950/90 border-2 border-amber-400 text-amber-300 font-black text-xs flex flex-col items-center justify-center shadow-lg active:scale-90"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="text-[9px]">JUMP</span>
            </button>
          )}

          {onCrouch && (
            <button
              onTouchStart={onCrouch}
              className="w-12 h-12 rounded-2xl bg-slate-800/90 border-2 border-slate-400 text-slate-300 font-black text-xs flex flex-col items-center justify-center shadow-lg active:scale-90"
            >
              <ArrowDown className="w-4 h-4" />
              <span className="text-[9px]">CROUCH</span>
            </button>
          )}
        </div>

        {/* Gloo, Heal & Reload */}
        <div className="flex items-center gap-2">
          <button
            onTouchStart={onDeployGloo}
            className="w-12 h-12 rounded-2xl bg-blue-950/90 border-2 border-blue-400 text-blue-300 font-black text-xs flex flex-col items-center justify-center shadow-lg active:scale-90"
          >
            <Shield className="w-4 h-4 fill-blue-400" />
            <span className="text-[9px]">GLOO</span>
          </button>

          <button
            onTouchStart={onUseMedkit}
            className="w-12 h-12 rounded-2xl bg-emerald-950/90 border-2 border-emerald-400 text-emerald-300 font-black text-xs flex flex-col items-center justify-center shadow-lg active:scale-90"
          >
            <Heart className="w-4 h-4 fill-emerald-400" />
            <span className="text-[9px]">HEAL</span>
          </button>

          <button
            onTouchStart={onReload}
            className="w-12 h-12 rounded-2xl bg-slate-900/90 border border-slate-700 text-slate-300 font-black text-xs flex flex-col items-center justify-center shadow-lg active:scale-90"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span className="text-[9px]">RELOAD</span>
          </button>
        </div>

        {/* Primary Fire Button (Large) */}
        <div className="flex items-center justify-end w-full mt-1">
          <button
            id="mobile-fire-btn"
            onTouchStart={(e) => {
              e.preventDefault();
              onFireStart();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              onFireEnd();
            }}
            className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 via-red-600 to-amber-500 border-4 border-amber-300 shadow-2xl flex items-center justify-center text-white active:scale-95 active:brightness-125"
          >
            <Crosshair className="w-10 h-10 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
