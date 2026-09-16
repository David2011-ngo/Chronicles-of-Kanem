import React, { useState } from 'react';
import { FreeFireGame } from './components/FreeFireGame';
import { LobbyScreen } from './components/LobbyScreen';
import { CharacterId } from './game/types';
import { sound } from './game/audio';
import { Gamepad2, BookOpen, Volume2, VolumeX } from 'lucide-react';
import { GDDDocumentViewer } from './components/GDDDocumentViewer';

export default function App() {
  const [appMode, setAppMode] = useState<'game' | 'systems'>('game');
  const [gameScreen, setGameScreen] = useState<'lobby' | 'match'>('lobby');
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId>('alok');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const handleStartMatch = (characterId: CharacterId) => {
    setSelectedCharacter(characterId);
    setGameScreen('match');
  };

  const handleReturnToLobby = () => {
    setGameScreen('lobby');
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#080d16] text-slate-100 flex flex-col select-none overflow-x-hidden font-sans">
      {/* Top Floating App Bar */}
      <nav className="bg-[#060a12]/90 border-b border-slate-800/80 px-4 py-2 flex items-center justify-between z-40 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center font-black text-slate-950 text-sm shadow-md shadow-amber-500/20">
            FF
          </div>
          <div>
            <span className="font-black text-sm tracking-wider uppercase bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Free Fire: Bermuda
            </span>
            <span className="ml-2 text-[10px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
              50-PLAYER BR
            </span>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-900/90 border border-slate-800 p-0.5 rounded-lg flex items-center">
            <button
              id="mode-play-btn"
              onClick={() => {
                setAppMode('game');
                if (gameScreen !== 'match') setGameScreen('lobby');
              }}
              className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                appMode === 'game'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>PLAY MATCH</span>
            </button>
            <button
              id="mode-systems-btn"
              onClick={() => setAppMode('systems')}
              className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                appMode === 'systems'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>SYSTEMS & GDD</span>
            </button>
          </div>

          <button
            onClick={handleToggleMute}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </nav>

      {/* Main Viewport */}
      <main className="flex-1 relative flex flex-col">
        {appMode === 'game' ? (
          gameScreen === 'lobby' ? (
            <LobbyScreen
              onStartMatch={handleStartMatch}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
            />
          ) : (
            <FreeFireGame
              selectedCharacter={selectedCharacter}
              onReturnToLobby={handleReturnToLobby}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
            />
          )
        ) : (
          <div className="max-w-7xl w-full mx-auto px-4 py-6">
            <GDDDocumentViewer
              activeTab="overview"
              onNavigateToSimTool={() => setAppMode('game')}
              searchQuery=""
            />
          </div>
        )}
      </main>
    </div>
  );
}
