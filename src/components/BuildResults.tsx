import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu as CpuIcon, 
  Layers, 
  Power, 
  ExternalLink,
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  RefreshCw,
  TrendingDown, 
  TrendingUp, 
  Sparkles,
  DollarSign
} from 'lucide-react';
import { BuildComponent, ComponentCategory } from '../types';
import { formatKSh } from '../utils';

interface BuildResultsProps {
  components: BuildComponent[];
  budgetKSh: number;
  totalCostKSh: number;
  onRemoveComponent: (category: ComponentCategory) => void;
  onOpenSwapModal: (category: ComponentCategory, component: BuildComponent) => void;
  onRestart: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function BuildResults({
  components,
  budgetKSh,
  totalCostKSh,
  onRemoveComponent,
  onOpenSwapModal,
  onRestart
}: BuildResultsProps) {
  const [expandedCard, setExpandedCard] = useState<ComponentCategory | null>(null);

  const toggleExpand = (cat: ComponentCategory) => {
    setExpandedCard(prev => (prev === cat ? null : cat));
  };

  const getCategoryIcon = (category: ComponentCategory) => {
    switch (category) {
      case 'CPU': return CpuIcon;
      default: return Layers;
    }
  };

  const budgetUsagePercent = Math.min((totalCostKSh / budgetKSh) * 100, 150);
  const isOverBudget = totalCostKSh > budgetKSh;

  return (
    <div className="space-y-6">
      {/* Top Budget Meter Summary */}
      <div className="bg-white dark:bg-zinc-900 border border-natural-border-light dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-natural-muted">
              Build Summary metrics
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-2xl font-bold text-natural-text dark:text-zinc-50">
                {formatKSh(totalCostKSh)}
              </h2>
              <span className="text-natural-muted text-sm font-bold">
                spent of {formatKSh(budgetKSh)} budget
              </span>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={onRestart}
              className="flex-1 sm:flex-initial px-4.5 py-2.5 rounded-xl border border-natural-border hover:border-natural-primary hover:bg-natural-secondary/40 font-bold text-xs text-natural-primary bg-transparent transition cursor-pointer select-none text-center"
            >
              Reset / New Build Form
            </button>
          </div>
        </div>

        {/* Meter Line Bar */}
        <div className="space-y-1.5">
          <div className="h-2 rounded-full w-full bg-natural-secondary dark:bg-zinc-800 overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${budgetUsagePercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                isOverBudget 
                  ? 'bg-rose-500' // Red if over-budget
                  : totalCostKSh > budgetKSh * 0.9 
                    ? 'bg-amber-500' // Yellow if close
                    : 'bg-natural-primary' // Sage green instead of black!
              }`}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-natural-muted font-mono font-bold">
            <span>0%</span>
            <span className={isOverBudget ? 'text-rose-500 font-bold' : ''}>
              {budgetUsagePercent.toFixed(0)}% Budget Consumed 
              {isOverBudget && ` (+${formatKSh(totalCostKSh - budgetKSh)} Over)`}
            </span>
            <span>100% Target</span>
          </div>
        </div>
      </div>

      {/* Grid of Part Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {components.map((part) => {
          const isExpanded = expandedCard === part.category;
          const IconComponent = getCategoryIcon(part.category);

          return (
            <motion.div
              layout
              variants={cardVariants}
              key={part.category}
              className={`bg-white dark:bg-zinc-900 border rounded-3xl overflow-hidden transition-all duration-300 shadow-sm hover:translate-y-[-2px] hover:shadow ${
                isExpanded 
                  ? 'border-natural-primary dark:border-emerald-500 ring-1 ring-natural-primary/20' 
                  : 'border-natural-border-light dark:border-zinc-800/80'
              }`}
            >
              {/* Card Header Content Area */}
              <div className="p-5">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-natural-secondary dark:bg-zinc-800 border border-natural-border-light dark:border-zinc-750 text-natural-primary dark:text-zinc-350">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-natural-muted">
                        {part.category}
                      </span>
                      <h3 className="font-bold text-sm text-natural-text dark:text-zinc-50 mt-0.5 line-clamp-1">
                        {part.name}
                      </h3>
                      <p className="text-[11px] text-natural-muted">
                        Brand: <span className="font-bold text-natural-text dark:text-zinc-350">{part.brand}</span> | Model: <span className="font-bold text-natural-text dark:text-zinc-350">{part.model}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-natural-text dark:text-zinc-50">
                      {formatKSh(part.priceKSh)}
                    </span>
                    <p className="text-[9px] font-bold text-natural-primary uppercase tracking-widest mt-0.5">
                      {part.sourceName}
                    </p>
                  </div>
                </div>

                {/* Pick explanation */}
                <p className="text-xs text-natural-text/90 dark:text-zinc-400 italic mt-3 leading-relaxed border-l-2 border-natural-primary/50 pl-3">
                  &ldquo;{part.whyThisPick}&rdquo;
                </p>

                {/* Card Lower Controls */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-50 dark:border-zinc-850 pb-0.5">
                  <div className="flex gap-1.5">
                    {/* Swap Item Trigger */}
                    <button
                      onClick={() => onOpenSwapModal(part.category, part)}
                      className="px-3 py-1.5 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:border-zinc-250 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-605 dark:text-zinc-305 text-[11px] font-semibold flex items-center gap-1 cursor-pointer select-none transition"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>Swap / Edit</span>
                    </button>

                    {/* Exclude Item */}
                    <button
                      onClick={() => onRemoveComponent(part.category)}
                      className="px-3 py-1.5 rounded-lg border border-transparent text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-[11px] font-semibold flex items-center gap-1 cursor-pointer select-none transition"
                      title="Already own this? Exclude it from budget build recommendation"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Exclude</span>
                    </button>
                  </div>

                  {/* Expand Specs Toggle */}
                  <button
                    onClick={() => toggleExpand(part.category)}
                    className="p-1 px-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:text-zinc-750 rounded-lg flex items-center gap-1 text-[11px] font-medium cursor-pointer transition select-none"
                  >
                    <span>Specs</span>
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Expandable Specifications Area */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="border-t border-zinc-50 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-950/20 overflow-hidden"
                  >
                    <div className="p-5 space-y-4 text-xs">
                      {/* Specs List */}
                      <div>
                        <h4 className="font-bold text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                          Technical Attributes Checklist
                        </h4>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-zinc-605 dark:text-zinc-305 font-mono text-[11px]">
                          {part.specs.socket && (
                            <div className="flex justify-between border-b border-dashed border-zinc-100 dark:border-zinc-800/50 py-1">
                              <span>CPU Socket:</span>
                              <span className="font-bold text-zinc-800 dark:text-zinc-200">{part.specs.socket}</span>
                            </div>
                          )}
                          {part.specs.ramType && (
                            <div className="flex justify-between border-b border-dashed border-zinc-100 dark:border-zinc-800/50 py-1">
                              <span>RAM Type:</span>
                              <span className="font-bold text-zinc-800 dark:text-zinc-200">{part.specs.ramType}</span>
                            </div>
                          )}
                          {part.specs.ramSpeed && (
                            <div className="flex justify-between border-b border-dashed border-zinc-100 dark:border-zinc-800/50 py-1">
                              <span>RAM Speed:</span>
                              <span className="font-bold text-zinc-800 dark:text-zinc-200">{part.specs.ramSpeed}</span>
                            </div>
                          )}
                          {part.specs.formFactor && (
                            <div className="flex justify-between border-b border-dashed border-zinc-100 dark:border-zinc-800/50 py-1">
                              <span>Form Sizing:</span>
                              <span className="font-bold text-zinc-800 dark:text-zinc-200">{part.specs.formFactor}</span>
                            </div>
                          )}
                          {part.specs.maxGpuLength && (
                            <div className="flex justify-between border-b border-dashed border-zinc-100 dark:border-zinc-800/50 py-1">
                              <span>GPU Space:</span>
                              <span className="font-bold text-zinc-800 dark:text-zinc-200">{part.specs.maxGpuLength}mm</span>
                            </div>
                          )}
                          {part.specs.gpuLength && (
                            <div className="flex justify-between border-b border-dashed border-zinc-100 dark:border-zinc-800/50 py-1">
                              <span>Card Length:</span>
                              <span className="font-bold text-zinc-800 dark:text-zinc-200">{part.specs.gpuLength}mm</span>
                            </div>
                          )}
                          {part.specs.powerDraw && (
                            <div className="flex justify-between border-b border-dashed border-zinc-100 dark:border-zinc-800/50 py-1">
                              <span>TDP Watt Draw:</span>
                              <span className="font-bold text-zinc-800 dark:text-zinc-200">{part.specs.powerDraw}W</span>
                            </div>
                          )}
                          {part.specs.wattage && (
                            <div className="flex justify-between border-b border-dashed border-zinc-100 dark:border-zinc-800/50 py-1">
                              <span>Rated Watts:</span>
                              <span className="font-bold text-zinc-800 dark:text-zinc-200">{part.specs.wattage}W</span>
                            </div>
                          )}
                          {part.specs.gpuPowerConnectors && (
                            <div className="flex justify-between border-b border-dashed border-zinc-100 dark:border-zinc-800/50 py-1 col-span-2">
                              <span>GPU Power Plug Required:</span>
                              <span className="font-bold text-zinc-800 dark:text-zinc-200">{part.specs.gpuPowerConnectors}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Other notes details */}
                      {part.specs.details && (
                        <div className="p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl">
                          <span className="block font-bold text-[9px] uppercase tracking-wider text-zinc-400 mb-1">
                            Hardware Description Details:
                          </span>
                          <span className="text-zinc-650 dark:text-zinc-300 tracking-tight leading-relaxed select-text">
                            {part.specs.details}
                          </span>
                        </div>
                      )}

                      {/* Price Validation & Alternatives Section */}
                      <div className="p-3 bg-natural-secondary dark:bg-zinc-800/20 rounded-2xl border border-natural-border-light dark:border-zinc-800/70 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="block font-bold text-[10px] uppercase tracking-wider text-natural-primary dark:text-[#8C8376]">
                            Price Validation & Alternative Listing Options
                          </span>
                          <span className="bg-natural-primary/10 text-natural-primary dark:text-emerald-450 dark:bg-emerald-900/25 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Live Grounded
                          </span>
                        </div>
                        
                        <p className="text-[10px] text-natural-muted leading-relaxed">
                          To validate listed prices: compare regional taxes/delivery costs, verify in-stock item levels, or cross-reference rival retailer quotes below.
                        </p>

                        {part.alternativeOptions && part.alternativeOptions.length > 0 ? (
                          <div className="space-y-1.5 pt-0.5">
                            {part.alternativeOptions.map((opt, oIdx) => (
                              <div key={oIdx} className="flex items-center justify-between bg-white dark:bg-zinc-900 px-3 py-2 rounded-xl text-[11px] border border-natural-border-light dark:border-zinc-800/80 shadow-xs">
                                <div className="flex items-center gap-1.5">
                                  <span className="h-1.5 w-1.5 rounded-full bg-natural-primary" />
                                  <span className="font-bold text-natural-text dark:text-zinc-300">{opt.storeName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-natural-primary dark:text-emerald-400">{formatKSh(opt.priceKSh)}</span>
                                  <a 
                                    href={opt.url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="p-1 hover:bg-natural-secondary dark:hover:bg-zinc-800 rounded text-natural-muted hover:text-natural-primary transition"
                                    title={`Verify on ${opt.storeName}`}
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          /* Fallback Search ground cross-referencers */
                          <div className="space-y-1.5">
                            <span className="text-[9px] font-bold text-natural-muted uppercase block">Instant Compare Shortcuts:</span>
                            <div className="grid grid-cols-2 gap-1.5">
                              <a
                                href={`https://www.jumia.co.ke/catalog/?q=${encodeURIComponent(part.brand + ' ' + part.model)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-natural-border-light hover:border-natural-primary dark:border-zinc-805 dark:hover:border-emerald-500 px-2.5 py-1.5 rounded-xl text-[10px] text-natural-text dark:text-zinc-350 transition hover:text-natural-primary font-bold shadow-xs"
                              >
                                <span>Check Jumia</span>
                                <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                              </a>
                              <a
                                href={`https://avechi.co.ke/?s=${encodeURIComponent(part.brand + ' ' + part.model)}&post_type=product`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-natural-border-light hover:border-natural-primary dark:border-zinc-805 dark:hover:border-emerald-500 px-2.5 py-1.5 rounded-xl text-[10px] text-natural-text dark:text-zinc-350 transition hover:text-natural-primary font-bold shadow-xs"
                              >
                                <span>Check Avechi</span>
                                <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                              </a>
                              <a
                                href={`https://jiji.co.ke/search?query=${encodeURIComponent(part.brand + ' ' + part.model)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-natural-border-light hover:border-natural-primary dark:border-zinc-805 dark:hover:border-emerald-500 px-2.5 py-1.5 rounded-xl text-[10px] text-natural-text dark:text-zinc-350 transition hover:text-natural-primary font-bold shadow-xs"
                              >
                                <span>Check Jiji Kenya</span>
                                <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                              </a>
                              <a
                                href={`https://www.google.com/search?q=${encodeURIComponent(part.brand + ' ' + part.name + " price Kenya")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-natural-border-light hover:border-natural-primary dark:border-zinc-805 dark:hover:border-emerald-500 px-2.5 py-1.5 rounded-xl text-[10px] text-natural-text dark:text-zinc-350 transition hover:text-natural-primary font-bold shadow-xs"
                              >
                                <span>Search Local Shops</span>
                                <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Source/Retail Link */}
                      <div className="flex justify-between items-center pt-2 border-t border-dashed border-natural-border-light dark:border-zinc-800/40">
                        <span className="text-[10px] font-bold text-natural-muted dark:text-zinc-500">
                          Primary seller: <span className="text-natural-primary dark:text-[#8C8376]">{part.sourceName}</span>
                        </span>
                        <a
                          href={part.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-natural-primary hover:bg-natural-primary-hover dark:bg-[#4A5D4E] dark:hover:bg-[#3d4f41] text-white hover:opacity-90 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer text-[11px] leading-none transition shadow-sm hover:shadow active:scale-98"
                        >
                          <span>Verify Price on {part.sourceName}</span>
                          <ExternalLink className="h-3 w-3 stroke-[2.5]" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
