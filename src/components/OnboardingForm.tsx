import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gamepad2, Briefcase, Camera, Laptop, Info, Check, Sparkles } from 'lucide-react';
import { ComponentCategory } from '../types';
import { formatKSh } from '../utils';

interface OnboardingFormProps {
  onGenerate: (data: {
    budgetKSh: number;
    useCase: 'Gaming' | 'Office' | 'ContentCreation' | 'General';
    excludedCategories: ComponentCategory[];
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

export default function OnboardingForm({ onGenerate, loading }: OnboardingFormProps) {
  const [budgetInput, setBudgetInput] = useState<string>('120000');
  const [useCase, setUseCase] = useState<'Gaming' | 'Office' | 'ContentCreation' | 'General'>('Gaming');
  const [excluded, setExcluded] = useState<ComponentCategory[]>([]);

  const handlePresetSelect = (val: number) => {
    setBudgetInput(val.toString());
  };

  const handleToggleExclude = (cat: ComponentCategory) => {
    if (excluded.includes(cat)) {
      setExcluded(prev => prev.filter(item => item !== cat));
    } else {
      setExcluded(prev => [...prev, cat]);
    }
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
              <span>Consulting live store inventory...</span>
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
          <span>BuildWise queries live shops via Google Search grounding to discover real hardware prices & specs.</span>
        </div>
      </div>
    </form>
  );
}
