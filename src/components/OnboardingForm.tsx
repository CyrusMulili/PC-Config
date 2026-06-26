import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gamepad2, Briefcase, Camera, Laptop, Info, Check, Sparkles, Database, Search, Settings2, Sliders } from 'lucide-react';
import { ComponentCategory, OwnedSpecs } from '../types';
import { formatKSh } from '../utils';

interface OnboardingFormProps {
  onGenerate: (data: {
    budgetKSh: number;
    useCase: 'Gaming' | 'Office' | 'ContentCreation' | 'General';
    excludedCategories: ComponentCategory[];
    sourcingPreference: 'hybrid' | 'local_only';
    ownedSpecs?: Record<string, OwnedSpecs>;
  }) => void;
  loading: boolean;
}

const USE_CASES = [
  {
    id: 'Gaming' as const,
    title: 'Gaming',
    desc: 'Favors GPU and high-frequency active cooling.',
    icon: Gamepad2,
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: 'Office' as const,
    title: 'Office & Work',
    desc: 'Prioritizes CPU speed, SSD storage, quiet running.',
    icon: Briefcase,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'ContentCreation' as const,
    title: 'Content Creation',
    desc: 'Maximum RAM, CPU multi-threading, GPU-accel.',
    icon: Camera,
    color: 'from-purple-500 to-violet-600',
  },
  {
    id: 'General' as const,
    title: 'General / Everyday',
    desc: 'Affordable, low power, fast internet, standard media.',
    icon: Laptop,
    color: 'from-emerald-500 to-teal-600',
  },
];

const BUDGET_PRESETS = [
  { label: 'Budget', value: 60000, desc: 'Entry-level full build with monitor' },
  { label: 'Mid-Range', value: 120000, desc: 'Sweet-spot gaming / solid production' },
  { label: 'High-End', value: 250000, desc: 'Ultimate tier specs' },
];

const CATEGORIES: { label: string; value: ComponentCategory }[] = [
  { label: 'Monitor', value: 'Monitor' },
  { label: 'Graphics Card (GPU)', value: 'GPU' },
  { label: 'Processor (CPU)', value: 'CPU' },
  { label: 'Motherboard', value: 'Motherboard' },
  { label: 'RAM Memory', value: 'RAM' },
  { label: 'SSD/HDD Storage', value: 'Storage' },
  { label: 'Power Supply (PSU)', value: 'PSU' },
  { label: 'Computer Case', value: 'Case' },
];

export function getBudgetSanityReport(budget: number, useCase: string, excluded: ComponentCategory[]) {
  const hasGPU = !excluded.includes('GPU');
  const hasMonitor = !excluded.includes('Monitor');

  let minRecommended = 20000;
  if (useCase === 'Gaming') {
    minRecommended = 35000;
    if (hasGPU) minRecommended += 20000;
    if (hasMonitor) minRecommended += 10000;
  } else if (useCase === 'ContentCreation') {
    minRecommended = 30000;
    if (hasGPU) minRecommended += 15000;
    if (hasMonitor) minRecommended += 10000;
  } else if (useCase === 'Office') {
    minRecommended = 15000;
    if (hasMonitor) minRecommended += 8000;
  } else {
    minRecommended = 15000;
    if (hasMonitor) minRecommended += 8000;
  }

  const ratio = budget / minRecommended;
  let status: 'critical' | 'tight' | 'healthy' | 'excellent' = 'healthy';
  let message = "";
  let colorClass = "";
  let bgClass = "";
  let borderClass = "";

  if (ratio < 0.6) {
    status = 'critical';
    colorClass = 'text-rose-700 dark:text-rose-400';
    bgClass = 'bg-rose-50/50 dark:bg-rose-950/10';
    borderClass = 'border-rose-100 dark:border-rose-900/40';
    message = `⚠️ Extremely Tight Budget: The selected budget (${formatKSh(budget)}) is very low for a standard ${useCase} machine. Sourcing real, high-quality compatible parts might be difficult or force extremely low-end or refurbished choices. Consider raising the budget or excluding parts you already own (e.g., Monitor or GPU) to re-allocate funds.`;
  } else if (ratio < 0.95) {
    status = 'tight';
    colorClass = 'text-amber-700 dark:text-amber-550';
    bgClass = 'bg-amber-50/50 dark:bg-amber-950/10';
    borderClass = 'border-amber-100 dark:border-amber-900/30';
    message = `⚠️ Tight Budget: While a ${useCase} PC is buildable, choices will be constrained to entry-level hardware. The AI recommender will prioritize stable, budget-oriented parts to complete the specifications. Reusing accessories or excluding categories you already own can help free up budget for bulkier parts!`;
  } else if (ratio < 1.6) {
    status = 'healthy';
    colorClass = 'text-[#4A5D4E] dark:text-emerald-450';
    bgClass = 'bg-natural-secondary bg-opacity-40 dark:bg-zinc-950/30';
    borderClass = 'border-natural-border-light dark:border-zinc-800';
    message = `✓ Perfect Match! This budget (${formatKSh(budget)}) is perfectly aligned for a solid, reliable, and performant ${useCase} system. Our AI will select well-rated and balanced components with optimal socket and TDP matches.`;
  } else {
    status = 'excellent';
    colorClass = 'text-emerald-700 dark:text-emerald-400';
    bgClass = 'bg-emerald-500/5 dark:bg-emerald-950/10';
    borderClass = 'border-emerald-500/10 dark:border-emerald-550/15';
    message = `⭐ Premium Build: An excellent budget room! Expect high-end, future-proof selections like top-tier multicore CPUs, fast storage, premium gold-rated power supplies, and highly efficient cooling parts optimized for ${useCase} performance.`;
  }

  return { status, message, colorClass, bgClass, borderClass, minRecommended };
}

export default function OnboardingForm({ onGenerate, loading }: OnboardingFormProps) {
  const [budgetInput, setBudgetInput] = useState<string>('120000');
  const [useCase, setUseCase] = useState<'Gaming' | 'Office' | 'ContentCreation' | 'General'>('Gaming');
  const [excluded, setExcluded] = useState<ComponentCategory[]>([]);
  const [sourcingPreference, setSourcingPreference] = useState<'hybrid' | 'local_only'>('hybrid');
  const [ownedSpecs, setOwnedSpecs] = useState<Record<string, OwnedSpecs>>({});

  const numericBudget = parseFloat(budgetInput.replace(/,/g, '')) || 0;
  const sanityReport = getBudgetSanityReport(numericBudget, useCase, excluded);

  const handlePresetSelect = (val: number) => {
    setBudgetInput(val.toString());
  };

  const handleToggleExclude = (cat: ComponentCategory) => {
    if (excluded.includes(cat)) {
      setExcluded(prev => prev.filter(item => item !== cat));
      // Clean up ownedSpecs entry to avoid stale states
      setOwnedSpecs(prev => {
        const next = { ...prev };
        delete next[cat];
        return next;
      });
    } else {
      setExcluded(prev => [...prev, cat]);
      // Initialize a default shell if critical or customizable
      setOwnedSpecs(prev => ({
        ...prev,
        [cat]: {
          model: '',
          socket: cat === 'CPU' || cat === 'Motherboard' ? 'AM5' : undefined,
          ramType: cat === 'RAM' || cat === 'Motherboard' ? 'DDR5' : undefined,
          formFactor: cat === 'Motherboard' ? 'ATX' : undefined,
          wattage: cat === 'PSU' ? 650 : undefined
        }
      }));
    }
  };

  const handleUpdateOwnedSpec = (cat: string, key: keyof OwnedSpecs, value: any) => {
    setOwnedSpecs(prev => ({
      ...prev,
      [cat]: {
        ...(prev[cat] || {}),
        [key]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedBudget = parseFloat(budgetInput.replace(/,/g, ''));
    if (isNaN(parsedBudget) || parsedBudget < 15000) {
      alert("Please enter a valid budget of at least KSh 15,000.");
      return;
    }
    onGenerate({
      budgetKSh: parsedBudget,
      useCase,
      excludedCategories: excluded,
      sourcingPreference,
      ownedSpecs,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {/* Step 1: Budget Selection */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-natural-border-light dark:border-zinc-800 transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-2xl bg-natural-primary/10 text-natural-primary flex items-center justify-center font-bold">
            1
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-natural-text dark:text-zinc-50">Set Your Total Budget</h2>
            <p className="text-sm text-natural-muted dark:text-zinc-400">Total funds in KSh to build the entire system</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {BUDGET_PRESETS.map((preset) => {
            const isSelected = budgetInput === preset.value.toString();
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetSelect(preset.value)}
                className={`p-4 rounded-2xl text-left border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'border-natural-primary dark:border-emerald-500 bg-natural-secondary dark:bg-zinc-800/50 shadow-sm'
                    : 'border-natural-border-light dark:border-zinc-800 hover:border-natural-border dark:hover:border-zinc-700 bg-transparent'
                }`}
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-natural-muted dark:text-zinc-500">
                    {preset.label}
                  </span>
                  <h3 className="text-lg font-bold text-natural-text dark:text-zinc-200 mt-1">
                    {formatKSh(preset.value)}
                  </h3>
                </div>
                <p className="text-xs text-natural-muted mt-2">{preset.desc}</p>
              </button>
            );
          })}
        </div>

        <div className="relative">
          <label className="block text-xs font-bold uppercase tracking-wider text-natural-muted mb-2">
            Custom Budget (KSh)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-natural-muted font-bold">KSh</span>
            <input
              type="text"
              pattern="[0-9]*"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 150000"
              className="w-full pl-14 pr-4 py-4 rounded-2xl border border-natural-border dark:border-zinc-700 bg-white/40 dark:bg-transparent text-lg font-bold text-natural-text dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-natural-primary focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Step 2: Use Case Selection */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-natural-border-light dark:border-zinc-800 transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-2xl bg-natural-primary/10 text-natural-primary flex items-center justify-center font-bold">
            2
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-natural-text dark:text-zinc-50">Select Intended Use Case</h2>
            <p className="text-sm text-natural-muted dark:text-zinc-400">Determines how the hardware budget is smartly split</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {USE_CASES.map((uc) => {
            const isSelected = useCase === uc.id;
            const Icon = uc.icon;
            return (
              <button
                key={uc.id}
                type="button"
                onClick={() => setUseCase(uc.id)}
                className={`p-5 rounded-3xl text-left border cursor-pointer transition-all duration-300 flex items-start gap-4 ${
                  isSelected
                    ? 'border-natural-primary dark:border-emerald-500 bg-natural-secondary dark:bg-zinc-800/40 shadow-sm'
                    : 'border-natural-border-light dark:border-zinc-800 hover:border-natural-border dark:hover:border-zinc-700 bg-transparent'
                }`}
              >
                <div className={`p-3 rounded-2xl ${isSelected ? 'bg-natural-primary text-white' : 'bg-natural-primary/10 text-natural-primary'}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-natural-text dark:text-zinc-100">{uc.title}</h3>
                  <p className="text-sm text-natural-muted dark:text-zinc-400 mt-1">{uc.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Budget Sanity Checker */}
        <div id="budget-sanity-checker" className={`mt-6 p-5 rounded-2xl border transition-all duration-300 ${sanityReport.borderClass} ${sanityReport.bgClass} flex items-start gap-4 animate-fade-in`}>
          <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 bg-white dark:bg-zinc-950 border border-natural-border-light dark:border-zinc-805 shadow-2xs">
            {sanityReport.status === 'critical' && <span className="text-sm">⚠️</span>}
            {sanityReport.status === 'tight' && <span className="text-sm">🔍</span>}
            {sanityReport.status === 'healthy' && <span className="text-sm">✓</span>}
            {sanityReport.status === 'excellent' && <span className="text-sm">⭐</span>}
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-extrabold capitalize tracking-tight ${sanityReport.colorClass}`}>
                {sanityReport.status} Alignment Index
              </span>
              <span className="text-[10px] bg-zinc-150/50 dark:bg-zinc-800 text-zinc-550 dark:text-zinc-400 px-1.5 py-0.5 rounded font-mono font-bold leading-normal">
                Target base: {formatKSh(sanityReport.minRecommended)}
              </span>
            </div>
            <p className="text-zinc-650 dark:text-[#A1998A] leading-relaxed font-sans mt-1">
              {sanityReport.message}
            </p>
          </div>
        </div>
      </div>

      {/* Step 3: Owned Components/Exclusions */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-natural-border-light dark:border-zinc-800 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-2xl bg-natural-primary/10 text-natural-primary flex items-center justify-center font-bold">
            3
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-natural-text dark:text-zinc-50">Already Own Some Parts?</h2>
            <p className="text-sm text-natural-muted dark:text-zinc-400">Check components you already have to exclude them (budget will reallocate to remaining items!)</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => {
            const isExcluded = excluded.includes(cat.value);
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => handleToggleExclude(cat.value)}
                className={`p-3 rounded-2xl border text-center cursor-pointer transition-all duration-200 text-sm font-bold flex flex-col justify-center items-center gap-2 ${
                  isExcluded
                    ? 'border-natural-primary bg-natural-primary text-white'
                    : 'border-natural-border-light dark:border-zinc-800 hover:border-natural-border dark:hover:border-zinc-700 bg-transparent text-natural-text dark:text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-1">
                  {isExcluded ? (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white text-natural-primary">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="h-4 w-4 rounded border border-natural-border dark:border-zinc-600 inline-block" />
                  )}
                  <span>{cat.label}</span>
                </div>
                {isExcluded && (
                  <span className="text-[10px] opacity-90 uppercase tracking-widest font-bold">
                    Excluded
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Specifications Configurator for Owned Parts */}
        {excluded.some(it => ['CPU', 'Motherboard', 'RAM', 'PSU', 'Case'].includes(it)) && (
          <div className="mt-6 p-5 bg-natural-secondary/50 dark:bg-zinc-950/40 rounded-2xl border border-natural-border-light dark:border-zinc-850 space-y-4 animate-fade-in text-xs">
            <div className="flex items-center gap-2">
              <Sliders className="h-4.5 w-4.5 text-natural-primary dark:text-emerald-400" />
              <h3 className="font-bold text-natural-text dark:text-zinc-200">Specify Owned Part Attributes (Enables Precise Linter Checks)</h3>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Providing details about parts you already own allows our compatibility engine to run socket, physical, and power clearance checks against newly recommended parts!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {excluded.includes('CPU') && (
                <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-natural-border-light dark:border-zinc-805 space-y-2.5">
                  <span className="font-bold text-natural-text dark:text-zinc-300 block">Owned CPU</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Socket Type</label>
                      <select
                        value={ownedSpecs['CPU']?.socket || 'AM5'}
                        onChange={(e) => handleUpdateOwnedSpec('CPU', 'socket', e.target.value)}
                        className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs"
                      >
                        <option value="AM5">AM5 (AMD Ryzen 7000/8050/9000)</option>
                        <option value="LGA1700">LGA1700 (Intel 12/13/14th Gen)</option>
                        <option value="AM4">AM4 (AMD Ryzen 1000-5000)</option>
                        <option value="LGA1200">LGA1200 (Intel 10/11th Gen)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Model / Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Ryzen 5 7600X"
                        value={ownedSpecs['CPU']?.model || ''}
                        onChange={(e) => handleUpdateOwnedSpec('CPU', 'model', e.target.value)}
                        className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {excluded.includes('Motherboard') && (
                <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-natural-border-light dark:border-zinc-805 space-y-2.5">
                  <span className="font-bold text-natural-text dark:text-zinc-300 block">Owned Motherboard</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Socket Type</label>
                      <select
                        value={ownedSpecs['Motherboard']?.socket || 'AM5'}
                        onChange={(e) => handleUpdateOwnedSpec('Motherboard', 'socket', e.target.value)}
                        className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs"
                      >
                        <option value="AM5">AM5 (AMD)</option>
                        <option value="LGA1700">LGA1700 (Intel)</option>
                        <option value="AM4">AM4 (AMD)</option>
                        <option value="LGA1200">LGA1200 (Intel)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">RAM Support</label>
                      <select
                        value={ownedSpecs['Motherboard']?.ramType || 'DDR5'}
                        onChange={(e) => handleUpdateOwnedSpec('Motherboard', 'ramType', e.target.value as any)}
                        className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs"
                      >
                        <option value="DDR5">DDR5 Slots</option>
                        <option value="DDR4">DDR4 Slots</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Size Form</label>
                      <select
                        value={ownedSpecs['Motherboard']?.formFactor || 'ATX'}
                        onChange={(e) => handleUpdateOwnedSpec('Motherboard', 'formFactor', e.target.value as any)}
                        className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs"
                      >
                        <option value="ATX">ATX (Standard)</option>
                        <option value="MICRO-ATX">Micro-ATX</option>
                        <option value="MINI-ITX">Mini-ITX</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {excluded.includes('RAM') && (
                <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-natural-border-light dark:border-zinc-805 space-y-2.5">
                  <span className="font-bold text-natural-text dark:text-zinc-300 block">Owned RAM</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Generation Type</label>
                      <select
                        value={ownedSpecs['RAM']?.ramType || 'DDR5'}
                        onChange={(e) => handleUpdateOwnedSpec('RAM', 'ramType', e.target.value as any)}
                        className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs"
                      >
                        <option value="DDR5">DDR5 Stick</option>
                        <option value="DDR4">DDR4 Stick</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Model Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Corsair Vengeance"
                        value={ownedSpecs['RAM']?.model || ''}
                        onChange={(e) => handleUpdateOwnedSpec('RAM', 'model', e.target.value)}
                        className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {excluded.includes('PSU') && (
                <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-natural-border-light dark:border-zinc-805 space-y-2.5">
                  <span className="font-bold text-natural-text dark:text-zinc-300 block">Owned Power Supply (PSU)</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Capacity (W)</label>
                      <input
                        type="number"
                        min="250"
                        max="2000"
                        value={ownedSpecs['PSU']?.wattage || 650}
                        onChange={(e) => handleUpdateOwnedSpec('PSU', 'wattage', parseInt(e.target.value) || 650)}
                        className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-bold font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Model name / rating</label>
                      <input
                        type="text"
                        placeholder="e.g. EVGA SuperNova"
                        value={ownedSpecs['PSU']?.model || ''}
                        onChange={(e) => handleUpdateOwnedSpec('PSU', 'model', e.target.value)}
                        className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {excluded.includes('Case') && (
                <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-natural-border-light dark:border-zinc-805 space-y-2.5">
                  <span className="font-bold text-natural-text dark:text-zinc-300 block">Owned Computer Case</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Supported Mobo Size</label>
                      <select
                        value={ownedSpecs['Case']?.formFactor || 'ATX'}
                        onChange={(e) => handleUpdateOwnedSpec('Case', 'formFactor', e.target.value as any)}
                        className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs"
                      >
                        <option value="ATX">ATX (Fits all)</option>
                        <option value="MICRO-ATX">Micro-ATX or below</option>
                        <option value="MINI-ITX">Mini-ITX only</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Model / Brand name</label>
                      <input
                        type="text"
                        placeholder="e.g. NZXT H5 Flow"
                        value={ownedSpecs['Case']?.model || ''}
                        onChange={(e) => handleUpdateOwnedSpec('Case', 'model', e.target.value)}
                        className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Step 4: Sourcing Preference & Price Quality */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-natural-border-light dark:border-zinc-800 transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-2xl bg-natural-primary/10 text-natural-primary flex items-center justify-center font-bold">
            4
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-natural-text dark:text-zinc-50">Select Pricing Sourcing Mode</h2>
            <p className="text-sm text-natural-muted dark:text-zinc-400">Control how regional Kenyan hardware prices are queried</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setSourcingPreference('hybrid')}
            className={`p-5 rounded-3xl text-left border cursor-pointer transition-all duration-300 flex items-start gap-4 ${
              sourcingPreference === 'hybrid'
                ? 'border-natural-primary dark:border-emerald-500 bg-natural-secondary dark:bg-zinc-800/40 shadow-sm'
                : 'border-natural-border-light dark:border-zinc-800 hover:border-natural-border dark:hover:border-zinc-700 bg-transparent'
            }`}
          >
            <div className={`p-3 rounded-2xl ${sourcingPreference === 'hybrid' ? 'bg-natural-primary text-white' : 'bg-natural-primary/10 text-natural-primary'}`}>
              <Search className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-natural-text dark:text-zinc-100 font-sans">Live Grounded Search</h3>
                <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">Default</span>
              </div>
              <p className="text-sm text-natural-muted dark:text-zinc-400 mt-1">
                Launches real-time Google Search queries to retrieve currently live active listings and competitor prices from Jumia, Avechi, and local computer shops.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSourcingPreference('local_only')}
            className={`p-5 rounded-3xl text-left border cursor-pointer transition-all duration-300 flex items-start gap-4 ${
              sourcingPreference === 'local_only'
                ? 'border-natural-primary dark:border-emerald-500 bg-natural-secondary dark:bg-zinc-800/40 shadow-sm'
                : 'border-natural-border-light dark:border-zinc-800 hover:border-natural-border dark:hover:border-zinc-700 bg-transparent'
            }`}
          >
            <div className={`p-3 rounded-2xl ${sourcingPreference === 'local_only' ? 'bg-natural-primary text-white' : 'bg-natural-primary/10 text-natural-primary'}`}>
              <Database className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-natural-text dark:text-zinc-100 font-sans">Verified Curated Database</h3>
                <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">Super Fast</span>
              </div>
              <p className="text-sm text-natural-muted dark:text-zinc-400 mt-1">
                Generates recommendations strictly using our internally verified, pre-curated ledger of local hardware specs and fixed catalog price indices. 100% stable, lightning fast, and failsafe.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col items-center justify-center pb-8">
        <button
          type="submit"
          disabled={loading}
          className="relative inline-flex items-center gap-3 px-8 py-5 rounded-2xl text-white font-bold shadow-md cursor-pointer select-none border-0 overflow-hidden bg-natural-primary hover:bg-natural-primary-hover dark:bg-emerald-600 dark:hover:bg-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{sourcingPreference === 'hybrid' ? 'Consulting live store inventory...' : 'Loading verified compatible components...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Generate Compatible PC Build</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-1.5 mt-4 text-xs text-natural-muted max-w-md text-center leading-relaxed">
          <Info className="h-3.5 w-3.5 shrink-0" />
          <span>
            {sourcingPreference === 'hybrid'
              ? 'Jenga searches live Kenyan retailers via AI grounding to match actual current listings.'
              : 'Jenga is running in local stable mode. Recommendations are directly sourced from the verified local offline hardware catalog.'}
          </span>
        </div>
      </div>
    </form>
  );
}
