import React from 'react';
import { checkCompatibility } from '../compatibility';
import { BuildComponent } from '../types';
import { CheckCircle2, AlertTriangle, HelpCircle, Flame, Sparkles } from 'lucide-react';

interface CompatDisplayProps {
  components: BuildComponent[];
  onAutoFix?: () => void;
  loadingFix?: boolean;
}

export default function CompatDisplay({ components, onAutoFix, loadingFix }: CompatDisplayProps) {
  const report = checkCompatibility(components);

  // Define the core compatibility checks we ran in code
  const checks = [
    { name: 'Socket Alignment', desc: 'Motherboard matching CPU socket (e.g., LGA1700, AM5, AM4)' },
    { name: 'RAM Support', desc: 'Memory modules matches slot type (DDR4 vs DDR5)' },
    { name: 'Case Dimension Fits', desc: 'Case fits Motherboard size (ATX/M-ATX/Mini-ITX)' },
    { name: 'GPU Length Clearance', desc: "GPU fits inside Case's physical clearance (mm)" },
    { name: 'Power Supply Sufficiency', desc: 'PSU wattage covers TDP demands + 20% comfort cushion' },
    { name: 'PCIe Connector Coverage', desc: 'PSU includes required power plugs for high-end GPUs' },
  ];

  return (
    <div className={`rounded-3xl p-6 border transition-all duration-300 ${
      report.compatible 
        ? 'bg-natural-secondary/80 dark:bg-emerald-950/20 border-natural-primary/30 dark:border-emerald-900/60' 
        : 'bg-amber-50/40 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/50'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Badge */}
        <div className="flex items-start gap-3.5">
          {report.compatible ? (
            <div className="h-10 w-10 rounded-full bg-natural-primary/15 dark:bg-emerald-900/40 flex items-center justify-center text-natural-primary dark:text-emerald-450 shrink-0">
              <CheckCircle2 className="h-6 w-6 stroke-[2.5]" />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <AlertTriangle className="h-6 w-6 stroke-[2.5]" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-natural-text dark:text-zinc-50">
                {report.compatible ? 'Compatible Build Checked' : 'Compatibility Conflict Found'}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold leading-none ${
                report.compatible 
                  ? 'bg-natural-primary/20 text-natural-primary dark:bg-emerald-900/50 dark:text-emerald-300' 
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
              }`}>
                {report.compatible ? 'Active Status: True' : 'Active Status: Flagged'}
              </span>
            </div>
            <p className="text-sm mt-0.5 text-natural-muted dark:text-zinc-400 leading-relaxed">
              {report.compatible 
                ? 'All expert hardware rules checked out successfully. Your parts fit and power each other correctly.' 
                : `${report.issues.length} physical or electrical conflicts flagged in the build list. Use the AI auto-fix link or swap candidates.`
              }
            </p>
          </div>
        </div>

        {/* AI Autocorrect Action */}
        {!report.compatible && onAutoFix && (
          <button
            type="button"
            onClick={onAutoFix}
            disabled={loadingFix}
            className="self-start sm:self-center px-4.5 py-2.5 rounded-xl bg-natural-primary hover:bg-natural-primary-hover dark:bg-[#4A5D4E] dark:hover:bg-[#3d4f41] text-white font-bold text-xs transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow active:scale-98 disabled:opacity-50 select-none cursor-pointer"
          >
            {loadingFix ? (
              <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            )}
            <span>Auto-Correct with AI</span>
          </button>
        )}
      </div>

      {/* Flagged Issues List */}
      {!report.compatible && (
        <div className="mt-4 p-4 rounded-2xl bg-amber-100/40 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 text-amber-900 dark:text-amber-200 font-mono text-xs leading-relaxed space-y-1.5">
          {report.issues.map((msg, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <span className="text-amber-500 font-bold">⚠️</span>
              <span>{msg}</span>
            </div>
          ))}
        </div>
      )}

      {/* Grid of Rule Checks */}
      <div className="mt-5 border-t border-natural-border-light dark:border-zinc-800/60 pt-4">
        <h4 className="text-xs font-bold uppercase tracking-widest text-[#8C8376] dark:text-zinc-500 mb-3">
          Rule-Based Hardware Verification Matrix
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {checks.map((ck) => {
            // Check if this specific criteria failed
            let hasIssue = false;
            if (ck.name.includes('Socket') && report.issues.some(i => i.toLowerCase().includes('socket'))) hasIssue = true;
            if (ck.name.includes('RAM') && report.issues.some(i => i.toLowerCase().includes('ram type') || i.toLowerCase().includes('ram slot'))) hasIssue = true;
            if (ck.name.includes('Case Dimension') && report.issues.some(i => i.toLowerCase().includes('fit') || i.toLowerCase().includes('case form factor'))) hasIssue = true;
            if (ck.name.includes('GPU Length') && report.issues.some(i => i.toLowerCase().includes('gpu length'))) hasIssue = true;
            if (ck.name.includes('Power Supply') && report.issues.some(i => i.toLowerCase().includes('wattage') || i.toLowerCase().includes('power draw'))) hasIssue = true;
            if (ck.name.includes('PCIe') && report.issues.some(i => i.toLowerCase().includes('cable') || i.toLowerCase().includes('connectors') || i.toLowerCase().includes('12vhpwr'))) hasIssue = true;

            return (
              <div key={ck.name} className="flex items-start gap-2 p-2 rounded-xl border border-natural-border-light dark:border-zinc-800/30 bg-natural-secondary/60 dark:bg-zinc-800/10">
                <span className="mt-0.5 shrink-0">
                  {hasIssue ? (
                    <span className="text-amber-500">❌</span>
                  ) : !report.compatible ? (
                    <span className="text-zinc-300 dark:text-zinc-650">⚪</span>
                  ) : (
                    <span className="text-natural-primary">✓</span>
                  )}
                </span>
                <div>
                  <span className={`text-xs font-bold ${hasIssue ? 'text-amber-600 dark:text-amber-400' : 'text-natural-text dark:text-zinc-300'}`}>
                    {ck.name}
                  </span>
                  <p className="text-[10px] text-natural-muted dark:text-zinc-500 mt-0.5 leading-tight">
                    {ck.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
