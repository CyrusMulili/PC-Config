import React, { useState } from 'react';
import { checkCompatibility } from '../compatibility';
import { BuildComponent } from '../types';
import { CheckCircle2, AlertTriangle, HelpCircle, Flame, Sparkles, ShieldAlert, Sliders, Settings2 } from 'lucide-react';

interface CompatDisplayProps {
  components: BuildComponent[];
  ownedSpecs?: Record<string, any>;
  onAutoFix?: () => void;
  loadingFix?: boolean;
  onUpdateOwnedSpecs?: (specs: Record<string, any>) => void;
  useCase?: string;
}

export default function CompatDisplay({ components, ownedSpecs, onAutoFix, loadingFix, onUpdateOwnedSpecs, useCase }: CompatDisplayProps) {
  const [isEditingSpecs, setIsEditingSpecs] = useState(false);
  const [validationMode, setValidationMode] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.localStorage.getItem('system_validation_mode') === 'true';
  });

  const toggleValidationMode = () => {
    const nextMode = !validationMode;
    setValidationMode(nextMode);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('system_validation_mode', nextMode ? 'true' : 'false');
      // Dispatch a storage event so other components or App state can reload/repaint
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleSpecChange = (cat: string, key: string, val: any) => {
    if (!onUpdateOwnedSpecs || !ownedSpecs) return;
    
    // Create a deep copy of the ownedSpecs record
    const nextSpecs = JSON.parse(JSON.stringify(ownedSpecs));
    if (!nextSpecs[cat]) {
      nextSpecs[cat] = {};
    }
    
    // Update target parameter
    nextSpecs[cat][key] = val;

    // --- Mitigation Option 1: Co-dependency Auto-Alignment ---
    // If user selects Socket "AM5" (exclusively DDR5), auto-align Motherboard & RAM type to "DDR5"
    if (cat === 'CPU' && key === 'socket') {
      const socket = val;
      if (socket === 'AM5') {
        if (nextSpecs['Motherboard']) {
          nextSpecs['Motherboard'].socket = 'AM5';
          nextSpecs['Motherboard'].ramType = 'DDR5';
        }
        if (nextSpecs['RAM']) {
          nextSpecs['RAM'].ramType = 'DDR5';
        }
      } else if (socket === 'AM4' || socket === 'LGA1200') {
        // Exclusively DDR4 platforms
        if (nextSpecs['Motherboard']) {
          nextSpecs['Motherboard'].socket = socket;
          nextSpecs['Motherboard'].ramType = 'DDR4';
        }
        if (nextSpecs['RAM']) {
          nextSpecs['RAM'].ramType = 'DDR4';
        }
      } else if (socket === 'LGA1700') {
        if (nextSpecs['Motherboard']) {
          nextSpecs['Motherboard'].socket = 'LGA1700';
        }
      }
    }

    if (cat === 'Motherboard' && key === 'socket') {
      const socket = val;
      if (socket === 'AM5') {
        nextSpecs['Motherboard'].ramType = 'DDR5';
        if (nextSpecs['CPU']) {
          nextSpecs['CPU'].socket = 'AM5';
        }
        if (nextSpecs['RAM']) {
          nextSpecs['RAM'].ramType = 'DDR5';
        }
      } else if (socket === 'AM4' || socket === 'LGA1200') {
        nextSpecs['Motherboard'].ramType = 'DDR4';
        if (nextSpecs['CPU']) {
          nextSpecs['CPU'].socket = socket;
        }
        if (nextSpecs['RAM']) {
          nextSpecs['RAM'].ramType = 'DDR4';
        }
      } else if (socket === 'LGA1700') {
        if (nextSpecs['CPU']) {
          nextSpecs['CPU'].socket = 'LGA1700';
        }
      }
    }

    if (cat === 'RAM' && key === 'ramType') {
      if (val === 'DDR5') {
        if (nextSpecs['Motherboard'] && (nextSpecs['Motherboard'].socket === 'AM4' || nextSpecs['Motherboard'].socket === 'LGA1200')) {
          nextSpecs['Motherboard'].socket = 'AM5';
          nextSpecs['Motherboard'].ramType = 'DDR5';
        }
        if (nextSpecs['CPU'] && (nextSpecs['CPU'].socket === 'AM4' || nextSpecs['CPU'].socket === 'LGA1200')) {
          nextSpecs['CPU'].socket = 'AM5';
        }
      } else if (val === 'DDR4') {
        if (nextSpecs['Motherboard'] && nextSpecs['Motherboard'].socket === 'AM5') {
          nextSpecs['Motherboard'].socket = 'AM4';
          nextSpecs['Motherboard'].ramType = 'DDR4';
        }
        if (nextSpecs['CPU'] && nextSpecs['CPU'].socket === 'AM5') {
          nextSpecs['CPU'].socket = 'AM4';
        }
      }
    }

    // --- Mitigation Option 2: Wattage Upper/Lower Bounds Safeguards ---
    if (cat === 'PSU' && key === 'wattage') {
      let watt = parseInt(val);
      if (isNaN(watt)) watt = 650;
      if (watt < 150) watt = 150;     // Limit lower bound to prevent broken TDP errors
      if (watt > 2200) watt = 2200;   // Upper bounds sanity
      nextSpecs[cat][key] = watt;
    }

    // --- Mitigation Option 3: Form Factor Dimensions Safeguards ---
    if (cat === 'Motherboard' && key === 'formFactor') {
      const form = val;
      if (nextSpecs['Case']) {
        const caseForm = nextSpecs['Case'].formFactor || 'ATX';
        // If a larger motherboard size is chosen, make sure the Case is scaled up or alert
        if (form === 'ATX' && (caseForm === 'MICRO-ATX' || caseForm === 'MINI-ITX')) {
          nextSpecs['Case'].formFactor = 'ATX';
        } else if (form === 'MICRO-ATX' && caseForm === 'MINI-ITX') {
          nextSpecs['Case'].formFactor = 'MICRO-ATX';
        }
      }
    }

    if (cat === 'Case' && key === 'formFactor') {
      const caseForm = val;
      if (nextSpecs['Motherboard']) {
        const moboForm = nextSpecs['Motherboard'].formFactor || 'ATX';
        // If case is shrunk to mini-ITX, shrink Motherboard to mini-ITX to prevent compatibility error loops
        if (caseForm === 'MINI-ITX' && moboForm !== 'MINI-ITX') {
          nextSpecs['Motherboard'].formFactor = 'MINI-ITX';
        } else if (caseForm === 'MICRO-ATX' && moboForm === 'ATX') {
          nextSpecs['Motherboard'].formFactor = 'MICRO-ATX';
        }
      }
    }

    onUpdateOwnedSpecs(nextSpecs);
  };

  const report = checkCompatibility(components, ownedSpecs, useCase);

  // Define the core compatibility checks we ran in code
  const checks = [
    { name: 'Socket Alignment', desc: 'Motherboard matching CPU socket (e.g., LGA1700, AM5, AM4)' },
    { name: 'RAM Support', desc: 'Memory modules matches slot type (DDR4 vs DDR5)' },
    { name: 'Case Dimension Fits', desc: 'Case fits Motherboard size (ATX/M-ATX/Mini-ITX)' },
    { name: 'GPU Length Clearance', desc: "GPU fits inside Case's physical clearance (mm)" },
    { name: 'Power Supply Sufficiency', desc: 'PSU wattage covers TDP demands + 20% comfort cushion' },
    { name: 'PCIe Connector Coverage', desc: 'PSU includes required power plugs for high-end GPUs' },
    { name: 'Workload Suitability', desc: 'Core hardware tier and discrete GPU alignment matches target use-case requirements.' },
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
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-lg text-natural-text dark:text-zinc-50">
                {report.compatible ? (validationMode ? 'System Validation Active' : 'Compatible Build Checked') : 'Compatibility Conflict Found'}
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
                ? (validationMode ? '🧪 System Validation Testing active: All checks forced to successful state (compatible = true).' : 'All expert hardware rules checked out successfully. Your parts fit and power each other correctly.') 
                : `${report.issues.length} physical or electrical conflicts flagged in the build list. Use the AI auto-fix link or swap candidates.`
              }
            </p>
          </div>
        </div>

        {/* Control Button Group */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 shrink-0">
          <button
            type="button"
            onClick={toggleValidationMode}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 border flex items-center gap-2 cursor-pointer select-none shadow-xs active:scale-95 ${
              validationMode
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 animate-pulse'
                : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-805 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80'
            }`}
            title="Force compatibility checking status to always true for system testing"
          >
            <span className={`h-2 w-2 rounded-full ${validationMode ? 'bg-emerald-500 animate-ping' : 'bg-zinc-400'}`} />
            <span>validation_testing = {validationMode ? 'true' : 'false'}</span>
          </button>

          {/* AI Autocorrect Action */}
          {!report.compatible && onAutoFix && (
            <button
              type="button"
              onClick={onAutoFix}
              disabled={loadingFix}
              className="px-4.5 py-2.5 rounded-xl bg-natural-primary hover:bg-natural-primary-hover dark:bg-[#4A5D4E] dark:hover:bg-[#3d4f41] text-white font-bold text-xs transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow active:scale-98 disabled:opacity-50 select-none cursor-pointer"
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

      {/* Owned Parts Validated Badge Section */}
      {ownedSpecs && Object.keys(ownedSpecs).length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="p-3 bg-white/50 dark:bg-zinc-950/40 border border-zinc-150 dark:border-zinc-805 rounded-2xl flex flex-wrap gap-2 items-center justify-between text-[10.5px]">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-bold text-zinc-500 dark:text-[#8C8376] uppercase tracking-wider mr-1 text-[9.5px]">
                Already Owned Parts in Loop Check:
              </span>
              {Object.entries(ownedSpecs).map(([cat, spec]) => (
                <span key={cat} className="px-2.5 py-1 bg-white dark:bg-zinc-900 rounded-xl border border-natural-border-light dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold flex items-center gap-1.5 shadow-2xs">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{cat}</span>
                  {spec && (spec.socket || spec.ramType || spec.wattage || spec.formFactor || spec.model) && (
                    <span className="text-[9.5px] text-zinc-400 dark:text-zinc-500 font-normal">
                      ({spec.model || [spec.socket, spec.ramType, spec.formFactor, spec.wattage ? `${spec.wattage}W` : ''].filter(Boolean).join(', ')})
                    </span>
                  )}
                </span>
              ))}
            </div>

            {onUpdateOwnedSpecs && (
              <button 
                onClick={() => setIsEditingSpecs(!isEditingSpecs)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#A17C5B] text-white hover:bg-[#8B6748] dark:bg-zinc-800 dark:hover:bg-zinc-750 transition rounded-lg text-[10px] font-bold shadow-xs cursor-pointer"
              >
                <Sliders className="h-3 w-3" />
                <span>{isEditingSpecs ? "Hide Tool" : "Tune Owned Parts"}</span>
              </button>
            )}
          </div>

          {isEditingSpecs && onUpdateOwnedSpecs && (
            <div className="p-4 bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4 animate-fade-in text-xs shadow-xs">
              <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <Settings2 className="h-4 w-4 text-[#A17C5B]" />
                <span className="font-bold text-natural-text dark:text-zinc-200">Adjust Owned Specifications Real-Time</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {Object.entries(ownedSpecs).map(([cat, spec]) => {
                  return (
                    <div key={cat} className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-150 dark:border-zinc-805 space-y-2">
                      <span className="font-bold text-zinc-700 dark:text-zinc-300 capitalize text-xs block">{cat} Params</span>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-2 sm:col-span-1 border-r border-zinc-100/50 dark:border-zinc-805/40 pr-1.5 last:border-0">
                          <label className="block text-[9px] uppercase font-bold text-zinc-400 mb-0.5">Model / Name</label>
                          <input
                            type="text"
                            value={spec.model || ''}
                            onChange={(e) => handleSpecChange(cat, 'model', e.target.value)}
                            className="w-full px-2 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-[11px]"
                            placeholder="e.g. Owned Part"
                          />
                        </div>

                        {/* Socket Type input for CPU / Motherboard */}
                        {(cat === 'CPU' || cat === 'Motherboard') && (
                          <div className="col-span-2 sm:col-span-1">
                            <label className="block text-[9px] uppercase font-bold text-zinc-400 mb-0.5">Socket Match</label>
                            <select
                              value={spec.socket || 'AM5'}
                              onChange={(e) => handleSpecChange(cat, 'socket', e.target.value)}
                              className="w-full px-2 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-[11px]"
                            >
                              <option value="AM5">AM5 (AMD)</option>
                              <option value="LGA1700">LGA1700 (Intel)</option>
                              <option value="AM4">AM4 (AMD)</option>
                              <option value="LGA1200">LGA1200 (Intel)</option>
                            </select>
                          </div>
                        )}

                        {/* RAM Type for RAM / Motherboard */}
                        {(cat === 'RAM' || cat === 'Motherboard') && (
                          <div className="col-span-2 sm:col-span-1">
                            <label className="block text-[9px] uppercase font-bold text-zinc-400 mb-0.5">RAM Slot</label>
                            <select
                              value={spec.ramType || 'DDR5'}
                              onChange={(e) => handleSpecChange(cat, 'ramType', e.target.value)}
                              className="w-full px-2 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-[11px]"
                            >
                              <option value="DDR5">DDR5 Channel</option>
                              <option value="DDR4">DDR4 Channel</option>
                            </select>
                          </div>
                        )}

                        {/* Wattage for PSU */}
                        {cat === 'PSU' && (
                          <div className="col-span-2 sm:col-span-1">
                            <label className="block text-[9px] uppercase font-bold text-zinc-400 mb-0.5">Wattage (150W-2200W)</label>
                            <input
                              type="number"
                              value={spec.wattage || 650}
                              onChange={(e) => handleSpecChange(cat, 'wattage', e.target.value)}
                              className="w-full px-2 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-[11px] font-semibold"
                            />
                          </div>
                        )}

                        {/* Form Factor for Case / Mobo */}
                        {(cat === 'Case' || cat === 'Motherboard') && (
                          <div className="col-span-2 sm:col-span-1">
                            <label className="block text-[9px] uppercase font-bold text-zinc-400 mb-0.5">Form Factor</label>
                            <select
                              value={spec.formFactor || 'ATX'}
                              onChange={(e) => handleSpecChange(cat, 'formFactor', e.target.value)}
                              className="w-full px-2 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-[11px]"
                            >
                              <option value="ATX">ATX (Standard)</option>
                              <option value="MICRO-ATX">Micro-ATX</option>
                              <option value="MINI-ITX">Mini-ITX</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Dynamic Guardrail Mitigation Note */}
              <div className="p-2.5 bg-emerald-500/5 dark:bg-emerald-950/10 border border-emerald-500/10 dark:border-emerald-550/15 rounded-xl text-[10.5px] text-zinc-650 dark:text-zinc-350 flex items-start gap-2 select-text">
                <span className="text-emerald-500 font-bold shrink-0">⭐ Mitigation Active:</span>
                <span>
                  Adjusting one specification automatically aligns co-dependent parts (e.g. choosing <strong className="font-semibold text-natural-text dark:text-zinc-200">AM5</strong> auto-sets matching RAM to <strong className="font-semibold text-natural-text dark:text-zinc-200">DDR5</strong>; and case / motherboard form factor size limits are kept safe).
                </span>
              </div>
            </div>
          )}
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
            if (ck.name.includes('Workload') && report.issues.some(i => i.toLowerCase().includes('gaming workload') || i.toLowerCase().includes('content creation') || i.toLowerCase().includes('workload'))) hasIssue = true;

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
