import React, { useState } from 'react';
import { Download, Copy, Check, X, FileText } from 'lucide-react';
import { MASTER_GDD_SECTIONS } from '../data/gddContent';
import { STANDARD_CLIENT_PROFILE, ENHANCED_CLIENT_PROFILE, NETCODE_SPEC } from '../data/benchmarkData';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Generate complete Markdown text
  const generateMarkdown = () => {
    let md = `# APEXZONE: MASTER GAME DESIGN DOCUMENT & TECHNICAL ARCHITECTURE\n`;
    md += `**Role:** Lead Game Director & Technical Game Architect\n`;
    md += `**Target System:** 50-Player Competitive Mobile Battle Royale (Low-to-High-End Cross-Parity)\n`;
    md += `**Date:** ${new Date().toISOString().split('T')[0]}\n\n`;
    md += `---\n\n`;

    MASTER_GDD_SECTIONS.forEach(sec => {
      md += `## ${sec.title}\n`;
      md += `*${sec.subtitle}*\n\n`;
      md += `> **Executive Summary:** ${sec.summary}\n\n`;
      md += `### Game Director Design Rationale\n${sec.directorNotes}\n\n`;
      md += `### Technical Game Architect Spec\n${sec.techArchitectNotes}\n\n`;

      sec.subsections.forEach(sub => {
        md += `#### ${sub.heading}\n`;
        sub.body.forEach(b => {
          md += `- ${b}\n`;
        });
        if (sub.specs) {
          md += `\n| Metric / Parameter | Specification Value |\n| --- | --- |\n`;
          sub.specs.forEach(s => {
            md += `| ${s.key} | ${s.val} |\n`;
          });
        }
        md += `\n`;
      });
      md += `---\n\n`;
    });

    md += `## DUAL-GRAPHICS PIPELINE BENCHMARK SPECIFICATIONS\n\n`;
    md += `### Standard Client Profile (Low-End Mobile):\n`;
    md += `- Spec: ${STANDARD_CLIENT_PROFILE.specTarget}\n`;
    md += `- Target Framerate: ${STANDARD_CLIENT_PROFILE.targetFramerate}\n`;
    md += `- Max Draw Calls: ${STANDARD_CLIENT_PROFILE.drawCallsAverage}\n`;
    md += `- RAM Limit: ${STANDARD_CLIENT_PROFILE.ramUsageMB} MB\n`;
    md += `- Initial Package: ${STANDARD_CLIENT_PROFILE.initialApkSizeMB} MB\n`;
    md += `- Shading: ${STANDARD_CLIENT_PROFILE.shadingModel}\n\n`;

    md += `### Enhanced Client Profile (Flagship Mobile):\n`;
    md += `- Spec: ${ENHANCED_CLIENT_PROFILE.specTarget}\n`;
    md += `- Target Framerate: ${ENHANCED_CLIENT_PROFILE.targetFramerate}\n`;
    md += `- Average Draw Calls: ${ENHANCED_CLIENT_PROFILE.drawCallsAverage}\n`;
    md += `- RAM Allocation: ${ENHANCED_CLIENT_PROFILE.ramUsageMB} MB\n`;
    md += `- Initial Package: ${ENHANCED_CLIENT_PROFILE.initialApkSizeMB} MB\n`;
    md += `- Shading: ${ENHANCED_CLIENT_PROFILE.shadingModel}\n\n`;

    md += `### Dedicated Server Netcode Specification:\n`;
    md += `- Transport: ${NETCODE_SPEC.transportProtocol}\n`;
    md += `- Server Tick Rate: ${NETCODE_SPEC.serverTickRate}\n`;
    md += `- Lag Compensation: ${NETCODE_SPEC.lagCompensationWindow}\n`;
    md += `- Delta Compression: ${NETCODE_SPEC.deltaCompression}\n`;

    return md;
  };

  const markdownText = generateMarkdown();

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ApexZone_Master_GDD_Architecture.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f1523] border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-base text-slate-100">
              Export Master Game Design Document & Technical Plan (.md)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Text Preview Box */}
        <div className="flex-1 p-4 overflow-y-auto bg-[#070b14]">
          <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
            {markdownText}
          </pre>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950">
          <span className="text-xs font-mono text-slate-400">
            Formatted in Markdown with complete formulas, network protocols & tables.
          </span>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY ALL TEXT'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD .MD FILE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
