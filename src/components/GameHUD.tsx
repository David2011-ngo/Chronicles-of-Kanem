import React from 'react';
import { GameEngine } from '../game/GameEngine';
import { Shield, Crosshair, Zap, Heart, Flame, RefreshCw, Volume2, VolumeX, Smile } from 'lucide-react';
import { sound } from '../game/audio';

interface GameHUDProps {
  engine: GameEngine;
  onDeployGloo: () => void;
  onUseMedkit: () => void;
  onReload: () => void;
  onActivateSkill: () => void;
  onSwitchWeapon: (slot: 1 | 2 | 3) => void;
  onToggleScope: () => void;
  onOpenEmotes?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  viewMode?: '3d' | '2d';
  onToggleViewMode?: () => void;
  isPointerLocked?: boolean;
  onTogglePointerLock?: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  engine,
  onDeployGloo,
  onUseMedkit,
  onReload,
  onActivateSkill,
  onSwitchWeapon,
  onToggleScope,
  onOpenEmotes,
  isMuted,
  onToggleMute,
  viewMode = '3d',
  onToggleViewMode,
  isPointerLocked = false,
  onTogglePointerLock
}) => {
  const player = engine.player;
  const activeWeapon = engine.getActiveWeapon();
  const safeZone = engine.safeZone;

  const hpPercent = Math.max(0, Math.min(100, (player.health / player.maxHealth) * 100));
  const epPercent = Math.max(0, Math.min(100, (player.ep / player.maxEp) * 100));

  return (
    <div id="ff-game-hud" className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-3 sm:p-5">
      {/* TOP HEADER: Match status, Zone timer, Alive counter */}
      <div className="flex items-start justify-between w-full">
        {/* Alive & Kill Counters */}
        <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md border border-amber-500/40 rounded-lg px-3 py-1.5 shadow-lg">
          <div className="flex items-center gap-1.5 border-r border-slate-700 pr-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Alive</span>
            <span className="text-lg font-black text-white font-mono">{engine.aliveCount}</span>
          </div>
          <div className="flex items-center gap-1.5 pl-1">
            <Flame className="w-4 h-4 text-red-500 fill-red-500" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Kills</span>
            <span className="text-lg font-black text-white font-mono">{engine.stats.kills}</span>
          </div>
        </div>

        {/* Center: Safe Zone Timer & Status */}
        <div className="flex flex-col items-center">
          <div className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider shadow-md backdrop-blur-md ${
            safeZone.isShrinking
              ? 'bg-red-950/80 border-red-500 text-red-300 animate-pulse'
              : 'bg-slate-900/80 border-cyan-500/40 text-cyan-300'
          }`}>
            {safeZone.isShrinking ? (
              <span>Safe Zone Shrinking: {Math.max(0, Math.ceil(safeZone.timer))}s</span>
            ) : (
              <span>Safe Zone in: {Math.max(0, Math.ceil(safeZone.timer))}s (Phase {safeZone.phase})</span>
            )}
          </div>

          {/* Kill Feed (Recent eliminations) */}
          <div className="mt-2 flex flex-col gap-1 w-72 items-center">
            {engine.killFeed.slice(0, 3).map(feed => (
              <div
                key={feed.id}
                className={`text-[11px] px-2.5 py-0.5 rounded backdrop-blur-sm border flex items-center justify-between w-full shadow-sm animate-fade-in ${
                  feed.isPlayerKill
                    ? 'bg-amber-500/30 border-amber-400 text-amber-200 font-bold'
                    : 'bg-black/50 border-slate-700/60 text-slate-300'
                }`}
              >
                <span className="truncate max-w-[90px] font-semibold">{feed.killer}</span>
                <span className="mx-1 text-[10px] text-amber-400 font-mono flex items-center gap-1">
                  [{feed.weapon}]
                  {feed.isHeadshot && <span className="text-red-500 font-black">★HS</span>}
                </span>
                <span className="truncate max-w-[90px] text-slate-400">{feed.victim}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Right: View Mode, Mouse Lock & Sound */}
        <div className="pointer-events-auto flex items-center gap-2">
          {onToggleViewMode && (
            <button
              onClick={onToggleViewMode}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
                viewMode === '3d'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-slate-800/80 border-slate-600 text-slate-300'
              }`}
              title="Toggle between 3D Third-Person and 2D Tactical View"
            >
              <span className="font-mono text-[10px] px-1 bg-amber-500 text-black rounded font-black">
                {viewMode.toUpperCase()}
              </span>
              <span>CAMERA</span>
            </button>
          )}

          {viewMode === '3d' && onTogglePointerLock && (
            <button
              onClick={onTogglePointerLock}
              className={`hidden md:flex px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all items-center gap-1 ${
                isPointerLocked
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                  : 'bg-black/60 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title={isPointerLocked ? 'Press ESC to unlock mouse cursor' : 'Click to lock mouse cursor for 3D FPS aim'}
            >
              <Crosshair className="w-3.5 h-3.5 text-amber-400" />
              <span>{isPointerLocked ? 'Aim Locked' : 'Lock Aim'}</span>
            </button>
          )}

          <button
            onClick={onToggleMute}
            className="p-2 rounded-lg bg-black/60 hover:bg-black/80 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* CENTER HUD NOTIFICATIONS (Healing progress or Reloading progress) */}
      <div className="flex flex-col items-center justify-center">
        {player.isHealing && (
          <div className="bg-black/80 border border-emerald-500/60 px-4 py-2 rounded-xl backdrop-blur-md flex items-center gap-2 animate-pulse">
            <Heart className="w-5 h-5 text-emerald-400 fill-emerald-400" />
            <div className="text-xs font-bold text-emerald-300">
              Applying Medkit... ({player.healTimer.toFixed(1)}s)
            </div>
          </div>
        )}

        {player.isReloading && (
          <div className="bg-black/80 border border-amber-500/60 px-4 py-2 rounded-xl backdrop-blur-md flex items-center gap-2 animate-pulse">
            <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
            <div className="text-xs font-bold text-amber-300">
              Reloading {activeWeapon.name}...
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM CONTROL DECK: Health, EP, Weapon Selector, Gloo Wall & Skill Buttons */}
      <div className="flex items-end justify-between w-full">
        {/* Bottom Left: Character Skill & Equipment Badges */}
        <div className="flex items-end gap-3 pointer-events-auto">
          {/* Active Skill Button (DJ Alok / Chrono) */}
          <button
            id="skill-btn"
            onClick={onActivateSkill}
            disabled={player.skillCooldown > 0}
            className={`relative w-16 h-16 rounded-2xl flex flex-col items-center justify-center border-2 transition-all shadow-xl ${
              player.skillCooldown > 0
                ? 'bg-slate-900/80 border-slate-700 text-slate-500 cursor-not-allowed'
                : player.skillActiveTimer > 0
                ? 'bg-cyan-600/60 border-cyan-400 text-white animate-pulse shadow-cyan-500/40'
                : 'bg-slate-900/90 hover:bg-slate-800 border-cyan-500/80 text-cyan-300 hover:scale-105 active:scale-95'
            }`}
            title={`Skill: ${player.character.skillName} (Key F)`}
          >
            <Zap className="w-6 h-6 fill-current" />
            <span className="text-[10px] font-black uppercase tracking-tight mt-0.5">
              {player.character.skillName.split(' ')[0]}
            </span>
            <span className="absolute -top-2 -right-2 bg-slate-950 border border-slate-700 text-[10px] text-slate-300 font-mono px-1.5 py-0.5 rounded-full">
              [F]
            </span>
            {player.skillCooldown > 0 && (
              <div className="absolute inset-0 bg-black/70 rounded-2xl flex items-center justify-center text-sm font-black font-mono text-cyan-400">
                {Math.ceil(player.skillCooldown)}s
              </div>
            )}
          </button>

          {/* Armor & Helmet Status */}
          <div className="bg-black/70 backdrop-blur-md border border-slate-800 rounded-xl p-2 flex flex-col gap-1.5 shadow-md">
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] uppercase font-bold text-slate-400">Vest:</span>
              <span className="font-mono font-bold text-blue-300">Lv.{player.vestLvl}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <div className="w-3.5 h-3.5 rounded-full border border-purple-400 flex items-center justify-center text-[9px] font-bold text-purple-300">
                H
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Helmet:</span>
              <span className="font-mono font-bold text-purple-300">Lv.{player.helmetLvl}</span>
            </div>
          </div>
        </div>

        {/* Bottom Center: Vital Bars (EP & HP) */}
        <div className="flex flex-col items-center gap-1 w-full max-w-sm px-2">
          {/* EP (Energy Points) Bar */}
          <div className="w-full bg-slate-950/80 rounded-full h-3 border border-amber-500/30 overflow-hidden relative shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 transition-all duration-200"
              style={{ width: `${epPercent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-2 text-[9px] font-bold font-mono text-amber-200 drop-shadow">
              <span>EP</span>
              <span>{Math.round(player.ep)} / {player.maxEp}</span>
            </div>
          </div>

          {/* HP (Health Points) Bar */}
          <div className="w-full bg-slate-950/90 rounded-full h-5 border-2 border-red-500/50 overflow-hidden relative shadow-lg">
            <div
              className={`h-full transition-all duration-150 ${
                hpPercent > 50
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                  : hpPercent > 25
                  ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                  : 'bg-gradient-to-r from-red-600 to-red-400 animate-pulse'
              }`}
              style={{ width: `${hpPercent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-black font-mono text-white drop-shadow">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-white" /> HP
              </span>
              <span>{Math.max(0, Math.round(player.health))} / {player.maxHealth}</span>
            </div>
          </div>
        </div>

        {/* Bottom Right: Gloo Wall, Medkit, & Weapons */}
        <div className="flex items-end gap-2.5 pointer-events-auto">
          {/* Gloo Wall Deploy Button */}
          <button
            id="gloo-wall-btn"
            onClick={onDeployGloo}
            disabled={player.glooWalls <= 0}
            className={`relative w-14 h-14 rounded-2xl flex flex-col items-center justify-center border-2 transition-all shadow-lg ${
              player.glooWalls > 0
                ? 'bg-blue-950/90 hover:bg-blue-900 border-blue-400 text-blue-300 hover:scale-105 active:scale-95'
                : 'bg-slate-900/80 border-slate-700 text-slate-600 cursor-not-allowed'
            }`}
            title="Deploy Gloo Wall (Key G)"
          >
            <Shield className="w-5 h-5 fill-current" />
            <span className="text-[10px] font-black uppercase mt-0.5">Gloo</span>
            <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-slate-950 text-[10px] font-black font-mono px-1.5 rounded-full border border-white">
              x{player.glooWalls}
            </span>
            <span className="absolute -bottom-2 bg-slate-900 text-[9px] text-slate-400 font-mono px-1 rounded border border-slate-700">
              [G]
            </span>
          </button>

          {/* Medkit Button */}
          <button
            id="medkit-btn"
            onClick={onUseMedkit}
            disabled={player.medkits <= 0 || player.health >= player.maxHealth || player.isHealing}
            className={`relative w-14 h-14 rounded-2xl flex flex-col items-center justify-center border-2 transition-all shadow-lg ${
              player.medkits > 0 && player.health < player.maxHealth && !player.isHealing
                ? 'bg-emerald-950/90 hover:bg-emerald-900 border-emerald-400 text-emerald-300 hover:scale-105 active:scale-95'
                : 'bg-slate-900/80 border-slate-700 text-slate-600 cursor-not-allowed'
            }`}
            title="Use Medkit (Key 4)"
          >
            <Heart className="w-5 h-5 fill-current" />
            <span className="text-[10px] font-black uppercase mt-0.5">Heal</span>
            <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-slate-950 text-[10px] font-black font-mono px-1.5 rounded-full border border-white">
              x{player.medkits}
            </span>
            <span className="absolute -bottom-2 bg-slate-900 text-[9px] text-slate-400 font-mono px-1 rounded border border-slate-700">
              [4]
            </span>
          </button>

          {/* Emote Radial Wheel Button */}
          <button
            id="emote-menu-btn"
            type="button"
            onClick={onOpenEmotes}
            className={`relative w-14 h-14 rounded-2xl flex flex-col items-center justify-center border-2 transition-all shadow-lg pointer-events-auto cursor-pointer ${
              player.activeEmote
                ? 'bg-amber-500/25 border-amber-400 text-amber-300 scale-105 animate-pulse'
                : 'bg-slate-900/90 hover:bg-slate-800 border-amber-500/40 text-amber-400 hover:border-amber-400 hover:scale-105 active:scale-95'
            }`}
            title="Open Emote Radial Menu (Key B)"
          >
            {player.activeEmote ? (
              <span className="text-xl leading-none">{player.activeEmote.icon}</span>
            ) : (
              <Smile className="w-5 h-5 fill-current" />
            )}
            <span className="text-[10px] font-black uppercase mt-0.5 truncate max-w-[48px]">
              {player.activeEmote ? player.activeEmote.name : 'Emote'}
            </span>
            <span className="absolute -bottom-2 bg-slate-900 text-[9px] text-amber-400 font-mono px-1 rounded border border-amber-500/50">
              [B]
            </span>
          </button>

          {/* Weapon Cards & Slot Switcher */}
          <div className="flex flex-col gap-1.5 bg-black/80 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex items-center gap-1.5">
              {/* Primary Weapon Slot */}
              <button
                id="slot-1-btn"
                onClick={() => onSwitchWeapon(1)}
                className={`px-3 py-1.5 rounded-xl border text-left transition-all flex items-center justify-between min-w-[110px] ${
                  player.activeSlot === 1
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div>
                  <div className="text-[10px] font-mono text-slate-500">[1]</div>
                  <div className="text-xs font-black truncate max-w-[65px]">
                    {player.primaryWeapon?.name || 'Primary'}
                  </div>
                </div>
                {player.activeSlot === 1 && (
                  <div className="text-sm font-black font-mono text-white ml-1">
                    {player.currentMag}
                  </div>
                )}
              </button>

              {/* Secondary Weapon Slot */}
              <button
                id="slot-2-btn"
                onClick={() => onSwitchWeapon(2)}
                className={`px-3 py-1.5 rounded-xl border text-left transition-all flex items-center justify-between min-w-[110px] ${
                  player.activeSlot === 2
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div>
                  <div className="text-[10px] font-mono text-slate-500">[2]</div>
                  <div className="text-xs font-black truncate max-w-[65px]">
                    {player.secondaryWeapon?.name || 'Secondary'}
                  </div>
                </div>
                {player.activeSlot === 2 && (
                  <div className="text-sm font-black font-mono text-white ml-1">
                    {player.currentMag}
                  </div>
                )}
              </button>
            </div>

            {/* Reload & Scope Actions */}
            <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-800">
              <button
                id="reload-btn"
                onClick={onReload}
                disabled={player.isReloading}
                className="flex-1 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-slate-300 flex items-center justify-center gap-1 transition-colors"
                title="Reload (Key R)"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${player.isReloading ? 'animate-spin text-amber-400' : ''}`} />
                <span>Reload [R]</span>
              </button>

              <button
                id="scope-btn"
                onClick={onToggleScope}
                className={`p-1.5 rounded-lg border text-xs font-bold flex items-center justify-center transition-colors ${
                  player.isScoping
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400'
                }`}
                title="Scope Zoom [Right Click / Shift]"
              >
                <Crosshair className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
