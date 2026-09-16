import React from 'react';
import { 
  ShieldAlert, 
  Terminal, 
  Download, 
  Cpu, 
  Search, 
  Sparkles, 
  Gamepad2, 
  FileText
} from 'lucide-react';
import { ClientProfileType } from '../types';

interface HeaderProps {
  activeView: 'gdd' | 'simulator';
  setActiveView: (view: 'gdd' | 'simulator') => void;
  clientProfile: ClientProfileType;
  setClientProfile: (profile: ClientProfileType) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  clientProfile,
  setClientProfile,
  searchQuery,
  setSearchQuery,
  onOpenExport
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0b0f17]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/40">
              <Terminal className="w-5 h-5 text-black font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-black text-lg tracking-wider text-slate-100">
                  APEXZONE
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  GDD // TECH ARCH
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                50-Player Competitive Mobile Battle Royale Architecture
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              id="search-gdd-input"
              type="text"
              placeholder="Search mechanics, skills, netcode, Gloo Walls, biomes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            {/* View Mode Toggle: GDD vs Interactive Simulator */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-medium">
              <button
                id="toggle-view-gdd"
                onClick={() => setActiveView('gdd')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all ${
                  activeView === 'gdd'
                    ? 'bg-amber-500 text-black font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>GDD Spec</span>
              </button>
              <button
                id="toggle-view-simulator"
                onClick={() => setActiveView('simulator')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all ${
                  activeView === 'simulator'
                    ? 'bg-amber-500 text-black font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>Systems Lab</span>
              </button>
            </div>

            {/* Client Profile Indicator Toggle */}
            <button
              id="toggle-client-profile"
              onClick={() => setClientProfile(clientProfile === 'standard' ? 'enhanced' : 'standard')}
              className={`hidden lg:flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                clientProfile === 'standard'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-purple-950/40 border-purple-500/40 text-purple-300'
              }`}
              title="Toggle target client profile preview"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{clientProfile === 'standard' ? 'STANDARD (60 FPS)' : 'ENHANCED (120 FPS)'}</span>
            </button>

            {/* Export Master Document Button */}
            <button
              id="export-gdd-btn"
              onClick={onOpenExport}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export GDD</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
