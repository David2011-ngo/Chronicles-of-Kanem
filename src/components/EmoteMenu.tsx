import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Volume2, ShieldCheck, Flame } from 'lucide-react';
import { EmoteDef, EmoteId, ActiveEmote } from '../game/types';
import { EMOTE_LIST } from '../game/constants';
import { sound } from '../game/audio';

interface EmoteMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmote: (emoteId: EmoteId) => void;
  activeEmote: ActiveEmote | null;
}

export const EmoteMenu: React.FC<EmoteMenuProps> = ({
  isOpen,
  onClose,
  onSelectEmote,
  activeEmote
}) => {
  const [hoveredEmote, setHoveredEmote] = useState<EmoteDef | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Keep an active or first emote as default preview if none hovered
  const previewEmote = hoveredEmote || (activeEmote ? EMOTE_LIST.find(e => e.id === activeEmote.id) : null) || EMOTE_LIST[0];

  // Play hover audio feedback
  const handleHover = useCallback((emote: EmoteDef) => {
    if (hoveredEmote?.id !== emote.id) {
      setHoveredEmote(emote);
      sound.playMenuHover();
    }
  }, [hoveredEmote]);

  const handleTrigger = useCallback((emoteId: EmoteId) => {
    onSelectEmote(emoteId);
    onClose();
  }, [onSelectEmote, onClose]);

  // Keyboard navigation [1-8] and Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Check number keys 1 through 8
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= EMOTE_LIST.length) {
        e.preventDefault();
        const selected = EMOTE_LIST[num - 1];
        if (selected) {
          handleTrigger(selected.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleTrigger, onClose]);

  // Pointer dragging / angle calculation for authentic mobile/controller radial selection
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.hypot(dx, dy);

    // Only select if pointer is outside deadzone (> 50px)
    if (dist > 50) {
      isDraggingRef.current = true;
      // Calculate angle in radians, starting with top (-PI/2) as index 0
      let angle = Math.atan2(dy, dx) + Math.PI / 2;
      if (angle < 0) angle += Math.PI * 2;

      const sliceAngle = (Math.PI * 2) / EMOTE_LIST.length;
      // Shift by half slice to center segments
      const shifted = (angle + sliceAngle / 2) % (Math.PI * 2);
      const index = Math.floor(shifted / sliceAngle);

      if (index >= 0 && index < EMOTE_LIST.length) {
        const item = EMOTE_LIST[index];
        if (hoveredEmote?.id !== item.id) {
          setHoveredEmote(item);
          sound.playMenuHover();
        }
      }
    }
  };

  const handlePointerUp = () => {
    if (isDraggingRef.current && hoveredEmote) {
      handleTrigger(hoveredEmote.id);
      isDraggingRef.current = false;
    }
  };

  if (!isOpen) return null;

  const totalSlices = EMOTE_LIST.length;
  const radius = 185; // pixel offset from center

  return (
    <AnimatePresence>
      <div 
        id="radial-emote-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center select-none bg-black/65 backdrop-blur-md p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <motion.div
          id="radial-emote-dialog"
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-[500px] h-[500px] max-w-[95vw] max-h-[95vw] flex items-center justify-center"
        >
          {/* Outer Tactical Reticle & Hexagon Ring Background */}
          <div className="absolute inset-0 rounded-full border border-amber-500/20 pointer-events-none" />
          <div className="absolute inset-4 rounded-full border border-dashed border-amber-500/15 animate-spin-slow pointer-events-none" />
          <div className="absolute inset-12 rounded-full border border-cyan-500/15 pointer-events-none" />

          {/* Compass / Tactical Corner Ticks */}
          <div className="absolute -top-6 text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>FREE FIRE SOCIAL WHEEL • PRESS [B] OR [1-8]</span>
          </div>

          {/* 8 Radial Emote Wedges */}
          {EMOTE_LIST.map((emote, idx) => {
            const angle = (idx / totalSlices) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const isHovered = hoveredEmote?.id === emote.id;
            const isCurrentlyPlaying = activeEmote?.id === emote.id;

            return (
              <motion.button
                key={emote.id}
                id={`emote-radial-item-${emote.id}`}
                type="button"
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => handleHover(emote)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTrigger(emote.id);
                }}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  boxShadow: isHovered
                    ? `0 0 24px ${emote.color}66, inset 0 0 14px ${emote.color}44`
                    : '0 4px 16px rgba(0,0,0,0.6)'
                }}
                className={`absolute w-20 h-20 -ml-10 -mt-10 rounded-2xl flex flex-col items-center justify-center p-1.5 transition-all duration-200 cursor-pointer ${
                  isHovered
                    ? 'bg-slate-900/95 border-2 text-white z-20 scale-110'
                    : isCurrentlyPlaying
                    ? 'bg-amber-950/80 border-2 border-amber-400 text-amber-200 z-10'
                    : 'bg-slate-950/85 border border-slate-700/70 text-slate-200 hover:border-slate-500 z-0'
                }`}
              >
                {/* Rarity Color Indicator Pip */}
                <div 
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                  style={{ backgroundColor: emote.color }}
                />

                {/* Hotkey Number Pill */}
                <div className="absolute top-1 left-1.5 text-[9px] font-mono font-black text-slate-400 bg-slate-800/80 px-1 rounded">
                  {idx + 1}
                </div>

                {/* Emote Emoji Icon */}
                <span className="text-2xl filter drop-shadow-md select-none mt-1">
                  {emote.icon}
                </span>

                {/* Emote Name */}
                <span className="text-[10px] font-bold font-mono tracking-tight text-center leading-tight truncate w-full mt-0.5">
                  {emote.name}
                </span>

                {/* Active Playing Badge */}
                {isCurrentlyPlaying && (
                  <span className="absolute -bottom-2 px-1.5 py-0.5 bg-amber-500 text-black text-[8px] font-black uppercase rounded-full shadow">
                    Active
                  </span>
                )}
              </motion.button>
            );
          })}

          {/* Central Hub & Holographic Emote Preview Card */}
          <div 
            id="emote-hub-preview"
            className="relative w-56 h-56 rounded-full bg-slate-950/95 border-2 border-amber-500/60 p-4 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-xl z-30"
          >
            {/* Center Background Ambient Glow */}
            <div 
              className="absolute inset-0 rounded-full opacity-20 pointer-events-none blur-xl"
              style={{ backgroundColor: previewEmote.color }}
            />

            {/* Rarity & Sound Tag */}
            <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 mb-1">
              <Sparkles className="w-2.5 h-2.5" style={{ color: previewEmote.color }} />
              <span style={{ color: previewEmote.color }}>{previewEmote.rarity}</span>
              <span className="text-slate-500">•</span>
              <Volume2 className="w-2.5 h-2.5 text-slate-400" />
            </div>

            {/* Huge Preview Emoji */}
            <motion.div 
              key={previewEmote.id}
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="text-4xl my-0.5 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]"
            >
              {previewEmote.icon}
            </motion.div>

            {/* Preview Title */}
            <h3 className="text-sm font-black tracking-wide text-white uppercase truncate max-w-[180px]">
              {previewEmote.name}
            </h3>

            {/* Description */}
            <p className="text-[10px] text-slate-300 font-sans line-clamp-2 max-w-[170px] leading-snug my-1 px-1">
              {previewEmote.description}
            </p>

            {/* Action Trigger Button */}
            <button
              id="emote-hub-play-button"
              type="button"
              onClick={() => handleTrigger(previewEmote.id)}
              style={{ borderColor: previewEmote.color }}
              className="mt-1 px-3 py-1 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black font-black text-[10px] uppercase tracking-wider rounded-lg transition shadow-md flex items-center gap-1 cursor-pointer"
            >
              <span>Play Emote</span>
              <span className="text-[8px] bg-black/20 px-1 rounded font-mono">ENTER</span>
            </button>

            {/* Close Cross in Corner of Dialog */}
            <button
              id="emote-hub-close-button"
              type="button"
              onClick={onClose}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-800 border border-slate-600 text-slate-300 hover:text-white hover:bg-red-900/80 hover:border-red-500 flex items-center justify-center transition shadow cursor-pointer"
              title="Close Menu (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Footer Hint Bar */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/90 border border-slate-700/80 px-4 py-2 rounded-xl text-xs font-mono text-slate-300 shadow-xl pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="bg-amber-500 text-black font-bold px-1.5 py-0.5 rounded text-[10px]">1-8</span>
            <span>Quick Select</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1.5">
            <span className="bg-slate-700 text-white font-bold px-1.5 py-0.5 rounded text-[10px]">DRAG</span>
            <span>Radial Aim & Release</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1.5">
            <span className="bg-slate-700 text-white font-bold px-1.5 py-0.5 rounded text-[10px]">ESC / B</span>
            <span>Close</span>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};
