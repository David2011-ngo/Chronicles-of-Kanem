import React, { useState } from 'react';
import { 
  Sparkles, 
  Swords, 
  Users, 
  Shield, 
  Coins, 
  MapPin, 
  Award, 
  Cpu, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Code,
  CheckCircle2,
  Terminal
} from 'lucide-react';
import { MASTER_GDD_SECTIONS, GDDSection } from '../data/gddContent';
import { ActiveTab, SimulatorTool } from '../types';

interface GDDDocumentViewerProps {
  activeTab: ActiveTab;
  onNavigateToSimTool: (tool: SimulatorTool) => void;
  searchQuery: string;
}

export const GDDDocumentViewer: React.FC<GDDDocumentViewerProps> = ({
  activeTab,
  onNavigateToSimTool,
  searchQuery
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'executive-summary': true,
    'core-game-modes': true,
    'character-skill-architecture': true,
    'combat-tactical-mechanics': true,
    'biomes-environment': true,
    'meta-progression-integrity': true,
    'client-architecture-dual-pipeline': true
  });

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Map activeTab to section ID if filtered
  const tabToSectionId: Record<ActiveTab, string | null> = {
    overview: 'executive-summary',
    gamemodes: 'core-game-modes',
    characters: 'character-skill-architecture',
    combat: 'combat-tactical-mechanics',
    economy: 'combat-tactical-mechanics', // or core-game-modes
    environment: 'biomes-environment',
    progression: 'meta-progression-integrity',
    architecture: 'client-architecture-dual-pipeline',
    simulator: null
  };

  const currentSectionId = tabToSectionId[activeTab];

  // Filter sections by search query or current tab
  const filteredSections = MASTER_GDD_SECTIONS.filter(section => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = section.title.toLowerCase().includes(q);
      const matchSubtitle = section.subtitle.toLowerCase().includes(q);
      const matchSummary = section.summary.toLowerCase().includes(q);
      const matchBody = section.subsections.some(sub => 
        sub.heading.toLowerCase().includes(q) || 
        sub.body.some(b => b.toLowerCase().includes(q))
      );
      return matchTitle || matchSubtitle || matchSummary || matchBody;
    }

    if (currentSectionId) {
      return section.id === currentSectionId;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {filteredSections.map(section => {
        const isExpanded = expandedSections[section.id] ?? true;

        return (
          <article
            key={section.id}
            id={`gdd-section-${section.id}`}
            className="bg-slate-900/80 rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl backdrop-blur-sm transition-all"
          >
            {/* Section Header Card */}
            <div 
              onClick={() => toggleSection(section.id)}
              className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900 border-b border-slate-800/80 cursor-pointer flex items-start justify-between gap-4 select-none hover:bg-slate-800/40 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                    MASTER ARCHITECTURE SPEC
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-100 tracking-wide">
                  {section.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  {section.subtitle}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white transition-colors"
                  aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
                >
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="p-5 sm:p-6 space-y-6">
                {/* Executive Summary Paragraph */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 text-slate-300 text-sm leading-relaxed">
                  <span className="text-amber-400 font-bold block text-xs font-mono mb-1">
                    EXECUTIVE SUMMARY:
                  </span>
                  {section.summary}
                </div>

                {/* Lead Game Director vs Technical Architect Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Director Notes */}
                  <div className="bg-amber-950/15 p-4 rounded-xl border border-amber-500/30 space-y-2">
                    <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono font-bold">
                      <Sparkles className="w-4 h-4" />
                      <span>LEAD GAME DIRECTOR NOTES</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {section.directorNotes}
                    </p>
                  </div>

                  {/* Technical Architect Notes */}
                  <div className="bg-sky-950/15 p-4 rounded-xl border border-sky-500/30 space-y-2">
                    <div className="flex items-center space-x-2 text-sky-400 text-xs font-mono font-bold">
                      <Cpu className="w-4 h-4" />
                      <span>TECHNICAL GAME ARCHITECT NOTES</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {section.techArchitectNotes}
                    </p>
                  </div>
                </div>

                {/* Subsections Detail */}
                <div className="space-y-6 pt-2">
                  {section.subsections.map((sub, idx) => (
                    <div key={idx} className="space-y-3">
                      <h3 className="text-base font-bold font-display text-slate-100 flex items-center space-x-2 border-b border-slate-800 pb-2">
                        <span className="text-amber-500 font-mono text-sm">▶</span>
                        <span>{sub.heading}</span>
                      </h3>

                      <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {sub.body.map((para, pIdx) => (
                          <p key={pIdx}>{para}</p>
                        ))}
                      </div>

                      {/* Technical Specs Key-Value Table if present */}
                      {sub.specs && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                          {sub.specs.map((sp, sIdx) => (
                            <div 
                              key={sIdx}
                              className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono"
                            >
                              <span className="text-slate-400">{sp.key}:</span>
                              <span className="text-amber-400 font-bold">{sp.val}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Deep-link to Interactive Sandbox Tool */}
                <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-400 font-mono">
                    Interact directly with this architecture module:
                  </span>

                  {section.id === 'combat-tactical-mechanics' && (
                    <button
                      onClick={() => onNavigateToSimTool('gloo-wall')}
                      className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 text-xs font-mono font-bold transition-colors"
                    >
                      <span>Open Gloo Wall Combat Arena</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {section.id === 'core-game-modes' && (
                    <button
                      onClick={() => onNavigateToSimTool('clash-squad')}
                      className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 text-xs font-mono font-bold transition-colors"
                    >
                      <span>Open Clash Squad Economy Simulator</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {section.id === 'character-skill-architecture' && (
                    <button
                      onClick={() => onNavigateToSimTool('skill-builder')}
                      className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 text-xs font-mono font-bold transition-colors"
                    >
                      <span>Open Skill Synergy Lab</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {section.id === 'biomes-environment' && (
                    <button
                      onClick={() => onNavigateToSimTool('tactical-map')}
                      className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 text-xs font-mono font-bold transition-colors"
                    >
                      <span>Open 50-Player Safe Zone Simulator</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {section.id === 'meta-progression-integrity' && (
                    <button
                      onClick={() => onNavigateToSimTool('honor-score')}
                      className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 text-xs font-mono font-bold transition-colors"
                    >
                      <span>Open Honor Score Integrity Tester</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {section.id === 'client-architecture-dual-pipeline' && (
                    <button
                      onClick={() => onNavigateToSimTool('dual-client')}
                      className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 text-xs font-mono font-bold transition-colors"
                    >
                      <span>Open Dual-Client Hardware Profiler</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
};
