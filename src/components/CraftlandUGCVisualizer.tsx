import React, { useState } from 'react';
import { 
  Layers, 
  Play, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  Box, 
  CheckCircle,
  Copy
} from 'lucide-react';

interface UGCRule {
  id: string;
  eventName: string;
  condition: string;
  action: string;
  enabled: boolean;
}

export const CraftlandUGCVisualizer: React.FC = () => {
  const [rules, setRules] = useState<UGCRule[]>([
    {
      id: 'rule-1',
      eventName: 'On Player Knockdown',
      condition: 'Distance < 15m',
      action: 'Spawn Instant Gloo Wall + Grant $300 In-Match Coins',
      enabled: true
    },
    {
      id: 'rule-2',
      eventName: 'On Gloo Wall Deployed',
      condition: 'Player HP < 30%',
      action: 'Apply Instant +50 EP & 20% Movement Speed Burst for 4s',
      enabled: true
    },
    {
      id: 'rule-3',
      eventName: 'On Safe Zone Phase 5 Shrink',
      condition: 'Always Active',
      action: 'Enable Zero-Gravity Physics (0.3G) Across Entire Arena',
      enabled: false
    }
  ]);

  const [testOutput, setTestOutput] = useState<string>('Ready to test ruleset execution.');
  const [mapPolyCount, setMapPolyCount] = useState<number>(18400); // Budget max 35,000

  const handleTestExecution = (rule: UGCRule) => {
    setTestOutput(`[EXECUTED EVENT] ${rule.eventName} triggered. Condition [${rule.condition}] evaluated TRUE. Executed Action: ${rule.action}`);
  };

  const handleAddRule = () => {
    const newRule: UGCRule = {
      id: Math.random().toString(),
      eventName: 'On Weapon Fired',
      condition: 'Remaining Ammo == 0',
      action: 'Instantly Reload Magazine + Play Neon Spark VFX',
      enabled: true
    };
    setRules(prev => [...prev, newRule]);
  };

  const handleDeleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-5">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-lg text-slate-100">
              Craftland UGC Suite: Visual Node-Based Logic & Ruleset Engine
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              COMMUNITY SANDBOX CREATOR
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Modular visual event scripting enabling custom player-made arenas, parkour challenges, and economy mini-games.
          </p>
        </div>

        {/* Performance Budget Meter */}
        <div className="flex items-center space-x-3 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-xs">
          <span className="text-slate-400">POLYCOUNT BUDGET:</span>
          <span className="text-emerald-400 font-bold">{mapPolyCount} / 35,000 tris</span>
        </div>
      </div>

      {/* Rules Visualizer Container */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-slate-400 font-bold">
            Configured Game Mode Event-Trigger Nodes ({rules.length})
          </span>
          <button
            onClick={handleAddRule}
            className="flex items-center space-x-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black rounded text-xs font-bold font-mono transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event Node</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {rules.map((rule, idx) => (
            <div
              key={rule.id}
              className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              {/* Node Sequence: Event -> Condition -> Action */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                {/* Event Node */}
                <div className="bg-indigo-950/50 border border-indigo-500/40 text-indigo-300 px-3 py-1.5 rounded-lg">
                  <span className="text-[9px] uppercase text-indigo-400 block">EVENT TRIGGER</span>
                  <span className="font-bold">{rule.eventName}</span>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />

                {/* Condition Node */}
                <div className="bg-amber-950/50 border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-lg">
                  <span className="text-[9px] uppercase text-amber-400 block">EVAL CONDITION</span>
                  <span className="font-bold">{rule.condition}</span>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />

                {/* Action Node */}
                <div className="bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-lg flex-1 min-w-[220px]">
                  <span className="text-[9px] uppercase text-emerald-400 block">ACTION PAYLOAD</span>
                  <span className="font-bold">{rule.action}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleTestExecution(rule)}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono border border-slate-700 transition-colors flex items-center space-x-1"
                >
                  <Play className="w-3 h-3 text-emerald-400" />
                  <span>Test Fire</span>
                </button>
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Execution Test Console Output */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs">
        <span className="text-slate-400 font-bold block mb-1">CRAFTLAND RUNTIME DEBUGGER:</span>
        <div className="text-emerald-400 flex items-start space-x-2">
          <span>&gt;</span>
          <span>{testOutput}</span>
        </div>
      </div>
    </div>
  );
};
