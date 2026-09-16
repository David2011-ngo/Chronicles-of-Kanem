import React from 'react';
import { 
  Sparkles, 
  Swords, 
  Users, 
  Shield, 
  Coins, 
  MapPin, 
  Award, 
  Cpu,
  Layers,
  Box,
  ShoppingBag,
  Flame,
  Activity,
  Compass
} from 'lucide-react';
import { ActiveTab, SimulatorTool } from '../types';

interface NavigationProps {
  activeView: 'gdd' | 'simulator';
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeSimTool: SimulatorTool;
  setActiveSimTool: (tool: SimulatorTool) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeView,
  activeTab,
  setActiveTab,
  activeSimTool,
  setActiveSimTool
}) => {
  const gddTabs = [
    { id: 'overview' as ActiveTab, label: 'Executive Vision', icon: Sparkles },
    { id: 'gamemodes' as ActiveTab, label: 'Game Modes & Loop', icon: Swords },
    { id: 'characters' as ActiveTab, label: 'Character & Skills', icon: Users },
    { id: 'combat' as ActiveTab, label: 'Combat & Gloo Walls', icon: Shield },
    { id: 'economy' as ActiveTab, label: 'Economy & Revival', icon: Coins },
    { id: 'environment' as ActiveTab, label: 'Biomes & Maps', icon: MapPin },
    { id: 'progression' as ActiveTab, label: 'Honor & Mastery', icon: Award },
    { id: 'architecture' as ActiveTab, label: 'Engine & Dual-Client', icon: Cpu }
  ];

  const simTools = [
    { id: 'gloo-wall' as SimulatorTool, label: 'Gloo Wall Sandbox', icon: Box },
    { id: 'clash-squad' as SimulatorTool, label: 'Clash Squad Economy', icon: ShoppingBag },
    { id: 'skill-builder' as SimulatorTool, label: 'Skill Synergy Lab', icon: Users },
    { id: 'tactical-map' as SimulatorTool, label: 'Safe Zone & Map', icon: Compass },
    { id: 'evo-workshop' as SimulatorTool, label: 'Evo Gun Workshop', icon: Flame },
    { id: 'dual-client' as SimulatorTool, label: 'Dual-Client Profiler', icon: Cpu },
    { id: 'honor-score' as SimulatorTool, label: 'Honor Score Engine', icon: Activity },
    { id: 'ugc-rules' as SimulatorTool, label: 'Craftland UGC Logic', icon: Layers }
  ];

  return (
    <nav className="bg-[#0f1523] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 overflow-x-auto py-2.5 scrollbar-none">
          {activeView === 'gdd' ? (
            gddTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })
          ) : (
            simTools.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeSimTool === tool.id;
              return (
                <button
                  key={tool.id}
                  id={`sim-tool-${tool.id}`}
                  onClick={() => setActiveSimTool(tool.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{tool.label}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </nav>
  );
};
