import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  Battery, 
  Smartphone, 
  Sliders, 
  Check, 
  Activity, 
  Sparkles,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { STANDARD_CLIENT_PROFILE, ENHANCED_CLIENT_PROFILE, NETCODE_SPEC } from '../data/benchmarkData';
import { ClientProfileType } from '../types';

interface DualClientBenchmarkProps {
  currentProfile: ClientProfileType;
  setCurrentProfile: (p: ClientProfileType) => void;
}

export const DualClientBenchmark: React.FC<DualClientBenchmarkProps> = ({
  currentProfile,
  setCurrentProfile
}) => {
  const [activeTab, setActiveTab] = useState<'profiler' | 'netcode' | 'pipeline'>('profiler');

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-5">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            <h3 className="font-display font-bold text-lg text-slate-100">
              Unity Engine & Dual-Graphics Pipeline Performance Profiler
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
              STANDARD (60 FPS) VS ENHANCED (120 FPS)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Architectural parity ensuring identical hitboxes, movement physics, and netcode across 2GB budget phones to 16GB flagships.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('profiler')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeTab === 'profiler'
                ? 'bg-purple-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hardware Profiler
          </button>
          <button
            onClick={() => setActiveTab('netcode')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeTab === 'netcode'
                ? 'bg-purple-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            30Hz Netcode Spec
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeTab === 'pipeline'
                ? 'bg-purple-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Shader Pipeline
          </button>
        </div>
      </div>

      {/* Main Profiler View */}
      {activeTab === 'profiler' && (
        <div className="space-y-4">
          {/* Client Toggle Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setCurrentProfile('standard')}
              className={`p-4 rounded-xl border text-left transition-all ${
                currentProfile === 'standard'
                  ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-display font-bold text-sm text-emerald-300">
                  STANDARD CLIENT PROFILE
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  LOW-SPEC FOCUS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tailored for Snapdragon 665 / Helio G85 with 2-3GB RAM. Target: Rock solid 60 FPS, sub-800MB RAM, 650MB APK.
              </p>
            </button>

            <button
              onClick={() => setCurrentProfile('enhanced')}
              className={`p-4 rounded-xl border text-left transition-all ${
                currentProfile === 'enhanced'
                  ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-display font-bold text-sm text-purple-300">
                  ENHANCED CLIENT PROFILE
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  FLAGSHIP 120 FPS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tailored for Snapdragon 8 Gen 2 / Apple A16. Target: 120 FPS, 4K PBR textures, 4-cascade shadows, 360° 3D lobby.
              </p>
            </button>
          </div>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Standard Profile Spec Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-emerald-400 text-sm">STANDARD PROFILE SPECS</span>
                <span className="text-[10px] text-slate-400">BUDGET TIER</span>
              </div>

              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-400">Target Framerate:</span>
                  <span className="text-emerald-400 font-bold">{STANDARD_CLIENT_PROFILE.targetFramerate}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-400">Resolution:</span>
                  <span>{STANDARD_CLIENT_PROFILE.targetResolution}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-400">Draw Calls Budget:</span>
                  <span className="text-emerald-400 font-bold">{STANDARD_CLIENT_PROFILE.drawCallsAverage} max</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-400">RAM Footprint:</span>
                  <span className="text-emerald-400 font-bold">{STANDARD_CLIENT_PROFILE.ramUsageMB} MB</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-400">Initial Download Size:</span>
                  <span className="text-emerald-400 font-bold">{STANDARD_CLIENT_PROFILE.initialApkSizeMB} MB</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-400">Texture Compression:</span>
                  <span>ASTC 6x6 & 8x8 (128-256MB VRAM)</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-400">Shading Model:</span>
                  <span className="truncate max-w-[200px]">{STANDARD_CLIENT_PROFILE.shadingModel}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-400">Shadow System:</span>
                  <span className="truncate max-w-[200px]">{STANDARD_CLIENT_PROFILE.shadowModel}</span>
                </div>
              </div>
            </div>

            {/* Enhanced Profile Spec Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-purple-400 text-sm">ENHANCED PROFILE SPECS</span>
                <span className="text-[10px] text-slate-400">FLAGSHIP TIER</span>
              </div>

              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-400">Target Framerate:</span>
                  <span className="text-purple-400 font-bold">{ENHANCED_CLIENT_PROFILE.targetFramerate}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-400">Resolution:</span>
                  <span>{ENHANCED_CLIENT_PROFILE.targetResolution}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-400">Draw Calls Budget:</span>
                  <span className="text-purple-400 font-bold">{ENHANCED_CLIENT_PROFILE.drawCallsAverage} average</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-400">RAM Footprint:</span>
                  <span className="text-purple-400 font-bold">{ENHANCED_CLIENT_PROFILE.ramUsageMB} MB</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-400">Initial Download Size:</span>
                  <span className="text-purple-400 font-bold">{ENHANCED_CLIENT_PROFILE.initialApkSizeMB} MB</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-400">Texture Compression:</span>
                  <span>PBR 2K/4K ASTC 4x4 (1GB+ VRAM)</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-400">Shading Model:</span>
                  <span className="truncate max-w-[200px]">{ENHANCED_CLIENT_PROFILE.shadingModel}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-400">Shadow System:</span>
                  <span className="truncate max-w-[200px]">{ENHANCED_CLIENT_PROFILE.shadowModel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Netcode Architecture Spec View */}
      {activeTab === 'netcode' && (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-slate-100 text-sm flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>DEDICATED 30HZ AUTHORITATIVE SERVER NETCODE SPEC</span>
            </span>
            <span className="text-sky-400 text-[10px]">UDP / KCP MULTIPLEX</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900 p-3 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">SERVER TICK RATE</span>
              <span className="text-sky-400 font-bold text-base">{NETCODE_SPEC.serverTickRate}</span>
              <span className="text-[10px] text-slate-400 block mt-1">33.33ms snapshot deltas</span>
            </div>
            <div className="bg-slate-900 p-3 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">LAG COMPENSATION</span>
              <span className="text-emerald-400 font-bold text-base">250ms Buffer</span>
              <span className="text-[10px] text-slate-400 block mt-1">Rewinds hitboxes to client time</span>
            </div>
            <div className="bg-slate-900 p-3 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">BANDWIDTH BUDGET</span>
              <span className="text-amber-400 font-bold text-base">18 KB/s Down</span>
              <span className="text-[10px] text-slate-400 block mt-1">Bit-packed delta compression</span>
            </div>
          </div>

          <div className="space-y-2 mt-2">
            <span className="font-bold text-slate-200 block">Authoritative Anti-Cheat Verification Layers:</span>
            <ul className="space-y-1.5">
              {NETCODE_SPEC.antiCheatLayers.map((layer, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-slate-400">
                  <span className="text-sky-400 font-bold">[{idx + 1}]</span>
                  <span>{layer}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Shader Pipeline Flowchart View */}
      {activeTab === 'pipeline' && (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4 font-mono text-xs">
          <span className="font-bold text-slate-100 text-sm block border-b border-slate-800 pb-2">
            Asset LOD & Cross-Version Parity Protocol
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-2">
              <span className="text-emerald-400 font-bold block">Standard Asset Pipeline (LOD2/LOD3)</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Uses single combined diffuse atlas (1024x1024). Character models simplified to 4,500 polygons. 
                Gloo Wall uses transparent unlit shader with vertex alpha pulse. Completely eliminates multi-pass 
                render passes to prevent thermal throttling on 28nm/14nm chipsets.
              </p>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-2">
              <span className="text-purple-400 font-bold block">Enhanced Asset Pipeline (LOD0/LOD1)</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Full 4K albedo, normal, roughness, metallic, and ambient occlusion maps. Character models feature 
                22,000 polygons with skeletal cloth physics simulation. 360° 3D lobby utilizes realtime dynamic 
                character spotlights with soft area ray tracing approximations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
