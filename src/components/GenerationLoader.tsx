import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Loader2, CheckCircle2, Sparkles, Cpu, Search, Check, ShieldAlert, Zap } from 'lucide-react';
import { formatKSh } from '../utils';

interface GenerationLoaderProps {
  budgetKSh: number;
  useCase: string;
}

const STEPS = [
  { id: 1, label: 'Formulating smart budget allocation weights', duration: 1800, icon: Cpu },
  { id: 2, label: 'Querying live Kenyan online shops (Avechi, Skyworld, Jumia, etc.)', duration: 3200, icon: Search },
  { id: 3, label: 'Running technical hardware rule matrix comparisons', duration: 2200, icon: Zap },
  { id: 4, label: 'Ensuring absolute power, form-factor, and architectural compatibility', duration: 2000, icon: Check },
  { id: 5, label: 'Validating primary seller prices and competitor alternatives', duration: 1500, icon: Sparkles },
];

export default function GenerationLoader({ budgetKSh, useCase }: GenerationLoaderProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // Increment percent progress bar smoothly over ~10 seconds
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 98) return 98; // hold at 98 until complete
        const change = Math.floor(Math.random() * 3) + 1;
        return Math.min(prev + change, 98);
      });
    }, 280);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const runSteps = (idx: number) => {
      if (idx >= STEPS.length) return;
      timeout = setTimeout(() => {
        setCurrentStepIdx(idx + 1);
        runSteps(idx + 1);
      }, STEPS[idx].duration);
    };

    runSteps(0);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="max-w-xl mx-auto my-12 bg-white dark:bg-zinc-900 border border-natural-border-light dark:border-zinc-805 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      {/* Absolute Decorative Glows */}
      <div className="absolute top-0 right-0 h-40 w-40 bg-natural-primary/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-40 w-40 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-1.5 bg-natural-primary/10 border border-natural-primary/20 text-natural-primary px-3 py-1 rounded-full text-xs font-bold">
          <Sparkles className="h-3 w-3 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Active Grounded Generation</span>
        </div>
        <h3 className="text-2xl font-serif italic text-natural-primary dark:text-zinc-50 leading-tight">
          Sourcing the Perfect PC Setup
        </h3>
        <p className="text-xs text-natural-muted">
          Assembling optimal compatible hardware within <strong className="text-natural-text dark:text-zinc-200">{formatKSh(budgetKSh)}</strong> calibrated for <strong className="text-natural-text dark:text-zinc-205">{useCase}</strong> use.
        </p>

        {/* Progress Bar Area */}
        <div className="pt-4 space-y-1.5">
          <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold text-natural-muted">
            <span>Grounding scan performance</span>
            <span>{percent}%</span>
          </div>
          <div className="h-2 w-full bg-natural-secondary dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-natural-primary"
              style={{ width: `${percent}%` }}
              layoutId="loader-bar"
              transition={{ ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Connection verification steps container */}
      <div className="space-y-3.5">
        <span className="block text-[10px] font-mono uppercase text-natural-muted font-bold tracking-wider mb-2">
          Grounded Rule Assessment Log:
        </span>
        
        {STEPS.map((step, idx) => {
          const isDone = currentStepIdx > idx;
          const isActive = currentStepIdx === idx;
          const StepIcon = step.icon;

          return (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15 }}
              key={step.id}
              className={`flex items-start gap-3.5 p-3 rounded-2xl border transition-all duration-300 ${
                isDone 
                  ? 'border-natural-primary/15 bg-natural-primary/[0.02] text-natural-text dark:text-zinc-300'
                  : isActive
                  ? 'border-natural-primary bg-natural-secondary dark:bg-zinc-800/40 text-natural-text dark:text-zinc-100 shadow-sm'
                  : 'border-transparent text-natural-muted/65 opacity-60'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="h-4.5 w-4.5 text-natural-primary" />
                ) : isActive ? (
                  <Loader2 className="h-4.5 w-4.5 text-natural-primary animate-spin" />
                ) : (
                  <div className="h-4.5 w-4.5 rounded-full border border-natural-border-light dark:border-zinc-700 flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {step.label}
                </p>
                {isActive && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: step.duration / 1000 }}
                    className="h-[1px] bg-natural-primary/30 mt-1.5"
                  />
                )}
              </div>
              <div className={`p-1.5 rounded-xl ${isDone || isActive ? 'bg-natural-primary/5 text-natural-primary' : 'bg-transparent text-natural-muted/50'}`}>
                <StepIcon className="h-3.5 w-3.5" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Safety compliance seal */}
      <div className="mt-6 flex items-center gap-2 justify-center py-2.5 border-t border-dashed border-natural-border-light dark:border-zinc-800/60 text-[10px] text-natural-muted font-bold">
        <ShieldAlert className="h-3.5 w-3.5 text-natural-primary" />
        <span>Hardware structural and power values strictly checked</span>
      </div>
    </div>
  );
}
