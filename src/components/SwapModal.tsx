import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Settings2, Sparkles, AlertCircle, Save, ExternalLink } from 'lucide-react';
import { BuildComponent, ComponentCategory } from '../types';
import { formatKSh } from '../utils';

interface SwapModalProps {
  category: ComponentCategory;
  component: BuildComponent;
  isOpen: boolean;
  onClose: () => void;
  onSwap: (newComponent: BuildComponent) => void;
  currentBuild: { components: BuildComponent[] };
}

export default function SwapModal({ category, component, isOpen, onClose, onSwap, currentBuild }: SwapModalProps) {
  const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('ai');
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchResult, setSearchResult] = useState<BuildComponent | null>(null);

  // Manual Form State
  const [manualName, setManualName] = useState(component.name);
  const [manualBrand, setManualBrand] = useState(component.brand);
  const [manualModel, setManualModel] = useState(component.model);
  const [manualPrice, setManualPrice] = useState(component.priceKSh.toString());
  const [manualSpecs, setManualSpecs] = useState({
    socket: component.specs.socket || '',
    ramType: component.specs.ramType || 'DDR4',
    ramSpeed: component.specs.ramSpeed || '',
    formFactor: component.specs.formFactor || 'ATX',
    maxGpuLength: component.specs.maxGpuLength || 320,
    gpuLength: component.specs.gpuLength || 240,
    powerDraw: component.specs.powerDraw || 65,
    wattage: component.specs.wattage || 600,
    gpuPowerConnectors: component.specs.gpuPowerConnectors || '8-pin',
    details: component.specs.details || ''
  });
  const [manualWhy, setManualWhy] = useState(component.whyThisPick);
  const [manualSource, setManualSource] = useState(component.sourceName);
  const [manualUrl, setManualUrl] = useState(component.sourceUrl);

  const handleAISearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchError('');
    setSearchResult(null);

    try {
      const response = await fetch('/api/build/swap-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          query: searchQuery,
          currentBuild
        })
      });

      if (!response.ok) {
        throw new Error('Search failed to retrieve models.');
      }

      const data = await response.json();
      if (data && data.component) {
        setSearchResult(data.component);
      } else {
        throw new Error("No component details retrieved.");
      }
    } catch (err: any) {
      setSearchError(err.message || 'Error occurred while fetching live store products.');
    } finally {
      setSearching(false);
    }
  };

  const handleApplySwap = (comp: BuildComponent) => {
    onSwap(comp);
    onClose();
  };

  const handleSaveManual = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(manualPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      alert("Please enter a valid price.");
      return;
    }

    const manualComponent: BuildComponent = {
      category,
      name: manualName,
      brand: manualBrand,
      model: manualModel,
      priceKSh: priceNum,
      specs: {
        ...manualSpecs,
        // Ensure numbers are typed correctly
        maxGpuLength: Number(manualSpecs.maxGpuLength),
        gpuLength: Number(manualSpecs.gpuLength),
        powerDraw: Number(manualSpecs.powerDraw),
        wattage: Number(manualSpecs.wattage),
      },
      whyThisPick: manualWhy || `Manually selected ${category}`,
      sourceName: manualSource || 'Manual Entry',
      sourceUrl: manualUrl || '#'
    };

    onSwap(manualComponent);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-2xl overflow-hidden border border-natural-border-light dark:border-zinc-850 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-natural-border-light dark:border-zinc-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C8376]">
              Component Swap Manager
            </span>
            <h2 className="text-xl font-bold text-natural-text dark:text-zinc-50">
              Customize {category}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-natural-secondary text-natural-muted hover:text-natural-text transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-natural-secondary dark:bg-zinc-900 border-b border-natural-border-light dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-4 text-center font-bold text-sm cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'ai'
                ? 'bg-white dark:bg-zinc-900 border-b-2 border-natural-primary text-natural-primary'
                : 'text-natural-muted hover:text-natural-primary bg-transparent'
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>AI Intelligent Search</span>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-4 text-center font-bold text-sm cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'manual'
                ? 'bg-white dark:bg-zinc-900 border-b-2 border-natural-primary text-natural-primary'
                : 'text-natural-muted hover:text-natural-primary bg-transparent'
            }`}
          >
            <Settings2 className="h-4 w-4" />
            <span>Manual Specs Editor</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'ai' ? (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-natural-secondary/80 dark:bg-amber-950/10 border border-natural-border-light dark:border-zinc-800/40 text-xs text-natural-text">
                <p className="font-bold text-natural-primary mb-1 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Live Google Search Grounding Active
                </p>
                Explain what you are looking for in the field below. Model will check online inventories (Jumia, Avechi, Phone Place, Skyworld, etc.) to fetch a compatible component.
              </div>

              <form onSubmit={handleAISearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search e.g. 'Ryzen 5 5600', 'cheaper motherboards', 'DDR5 16GB'`}
                  className="flex-1 px-4 py-3 rounded-xl border border-natural-border dark:border-zinc-700 bg-white/40 dark:bg-transparent text-sm text-natural-text dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-natural-primary"
                />
                <button
                  type="submit"
                  disabled={searching || !searchQuery.trim()}
                  className="px-5 py-3 rounded-xl bg-natural-primary hover:bg-natural-primary-hover dark:bg-[#4A5D4E] dark:hover:bg-[#3d4f41] text-white font-bold text-sm shadow-sm select-none cursor-pointer disabled:opacity-50 flex items-center gap-1.5 border-0"
                >
                  {searching ? (
                    <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  <span>Search</span>
                </button>
              </form>

              {searchError && (
                <div className="p-3.5 rounded-xl bg-rose-50/65 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/40 text-xs text-rose-600 dark:text-rose-450 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{searchError}</span>
                </div>
              )}

              {/* AI Search Result display */}
              {searchResult && (
                <div className="border border-natural-border-light dark:border-zinc-800 rounded-2xl p-5 bg-natural-secondary/50 dark:bg-zinc-800/10 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-natural-primary">
                        Search Result Found
                      </span>
                      <h3 className="font-bold text-base text-natural-text dark:text-zinc-50">{searchResult.name}</h3>
                      <p className="text-natural-muted text-xs mt-0.5 font-bold">
                        Brand: {searchResult.brand} | Model: {searchResult.model}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-natural-text dark:text-zinc-100">
                        {formatKSh(searchResult.priceKSh)}
                      </span>
                      <p className="text-[10px] text-natural-muted font-bold">{searchResult.sourceName}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-zinc-850/50 text-xs space-y-1.5 border border-natural-border-light dark:border-zinc-805">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-[#8C8376]">Technical Specs Extracted:</span>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] font-mono leading-relaxed text-natural-text dark:text-zinc-300">
                      {searchResult.specs.socket && <div>Socket: {searchResult.specs.socket}</div>}
                      {searchResult.specs.ramType && <div>RAM: {searchResult.specs.ramType}</div>}
                      {searchResult.specs.ramSpeed && <div>Speed: {searchResult.specs.ramSpeed}</div>}
                      {searchResult.specs.formFactor && <div>Size: {searchResult.specs.formFactor}</div>}
                      {searchResult.specs.wattage && <div>Watts: {searchResult.specs.wattage}W</div>}
                      {searchResult.specs.powerDraw && <div>Power: {searchResult.specs.powerDraw}W</div>}
                      {searchResult.specs.gpuLength && <div>Length: {searchResult.specs.gpuLength}mm</div>}
                      {searchResult.specs.details && <div className="col-span-2 mt-1 border-t border-dashed border-zinc-100 dark:border-zinc-800/50 pt-1 text-zinc-400">Details: {searchResult.specs.details}</div>}
                    </div>
                  </div>

                  <div className="text-xs text-natural-muted italic font-medium">
                    &ldquo;{searchResult.whyThisPick}&rdquo;
                  </div>

                  {/* Pricing Grounding Verification Options */}
                  <div className="p-3.5 bg-neutral-50/50 dark:bg-zinc-800/20 rounded-2xl border border-natural-border-light dark:border-zinc-800/70 space-y-2">
                    <span className="block font-bold text-[9px] uppercase tracking-wider text-natural-primary dark:text-[#8C8376]">
                      Alternative Verification Store Options
                    </span>
                    {searchResult.alternativeOptions && searchResult.alternativeOptions.length > 0 ? (
                      <div className="space-y-1.5">
                        {searchResult.alternativeOptions.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center justify-between bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-xl text-[10px] border border-natural-border-light dark:border-zinc-800/80 shadow-xs">
                            <span className="font-bold text-natural-text dark:text-zinc-300">{opt.storeName}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-natural-primary">{formatKSh(opt.priceKSh)}</span>
                              <a href={opt.url} target="_blank" rel="noreferrer" className="text-natural-muted hover:text-natural-primary cursor-pointer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-1.5">
                        <a
                          href={`https://www.jumia.co.ke/catalog/?q=${encodeURIComponent(searchResult.brand + ' ' + searchResult.model)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-natural-border-light hover:border-natural-primary px-2.5 py-1.5 rounded-xl text-[9px] text-natural-text dark:text-zinc-350 hover:text-natural-primary transition font-bold shadow-xs animate-fade-in"
                        >
                          <span>Compare on Jumia</span>
                          <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                        </a>
                        <a
                          href={`https://avechi.co.ke/?s=${encodeURIComponent(searchResult.brand + ' ' + searchResult.model)}&post_type=product`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-natural-border-light hover:border-natural-primary px-2.5 py-1.5 rounded-xl text-[9px] text-natural-text dark:text-zinc-350 hover:text-natural-primary transition font-bold shadow-xs animate-fade-in"
                        >
                          <span>Compare on Avechi</span>
                          <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                        </a>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleApplySwap(searchResult)}
                    className="w-full py-3 rounded-xl bg-natural-primary hover:bg-natural-primary-hover text-white font-bold text-sm shadow-sm select-none cursor-pointer text-center border-0"
                  >
                    Replace Current Part with This One
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Manual Specs Form */
            <form onSubmit={handleSaveManual} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-450 dark:text-zinc-400 mb-1.5">Brand</label>
                  <input
                    type="text"
                    required
                    value={manualBrand}
                    onChange={(e) => setManualBrand(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-450 dark:text-zinc-400 mb-1.5">Model</label>
                  <input
                    type="text"
                    required
                    value={manualModel}
                    onChange={(e) => setManualModel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-800"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-450 dark:text-zinc-400 mb-1.5">Display Component Name</label>
                  <input
                    type="text"
                    required
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent text-sm text-zinc-800 dark:text-zinc-105 focus:outline-none focus:ring-2 focus:ring-zinc-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-450 dark:text-zinc-400 mb-1.5">Price in KSh</label>
                  <input
                    type="number"
                    required
                    value={manualPrice}
                    onChange={(e) => setManualPrice(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-450 dark:text-zinc-400 mb-1.5">Retailer Source Name</label>
                  <input
                    type="text"
                    required
                    value={manualSource}
                    onChange={(e) => setManualSource(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-800"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-450 dark:text-zinc-400 mb-1.5">Retailer URL / Store Link</label>
                  <input
                    type="text"
                    value={manualUrl}
                    onChange={(e) => setManualUrl(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-800"
                  />
                </div>
              </div>

              {/* Dynamic Specs input based on category */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-850/30 border border-zinc-100 dark:border-zinc-800 space-y-3 mt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Technical Attributes (Configures Compatibility Rule Checks)</span>
                <div className="grid grid-cols-2 gap-4">
                  {(category === 'CPU' || category === 'Motherboard') && (
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-450 dark:text-zinc-400 mb-1">CPU Socket (e.g. LGA1700, AM5, AM4)</label>
                      <input
                        type="text"
                        value={manualSpecs.socket}
                        onChange={(e) => setManualSpecs({ ...manualSpecs, socket: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                      />
                    </div>
                  )}

                  {(category === 'RAM' || category === 'Motherboard') && (
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-450 dark:text-zinc-400 mb-1">RAM Generation Type</label>
                      <select
                        value={manualSpecs.ramType}
                        onChange={(e) => setManualSpecs({ ...manualSpecs, ramType: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                      >
                        <option value="DDR4">DDR4</option>
                        <option value="DDR5">DDR5</option>
                      </select>
                    </div>
                  )}

                  {category === 'Motherboard' && (
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-450 dark:text-zinc-400 mb-1">Board Form Factor Size</label>
                      <select
                        value={manualSpecs.formFactor}
                        onChange={(e) => setManualSpecs({ ...manualSpecs, formFactor: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                      >
                        <option value="ATX">ATX</option>
                        <option value="Micro-ATX">Micro-ATX</option>
                        <option value="Mini-ITX">Mini-ITX</option>
                      </select>
                    </div>
                  )}

                  {category === 'Case' && (
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-450 dark:text-zinc-400 mb-1">Max GPU Length support (mm)</label>
                      <input
                        type="number"
                        value={manualSpecs.maxGpuLength}
                        onChange={(e) => setManualSpecs({ ...manualSpecs, maxGpuLength: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                      />
                    </div>
                  )}

                  {category === 'GPU' && (
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-450 dark:text-zinc-400 mb-1">GPU Length (mm)</label>
                      <input
                        type="number"
                        value={manualSpecs.gpuLength}
                        onChange={(e) => setManualSpecs({ ...manualSpecs, gpuLength: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                      />
                    </div>
                  )}

                  {category === 'PSU' && (
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-450 dark:text-zinc-400 mb-1">Rated PSU Wattage (W)</label>
                      <input
                        type="number"
                        value={manualSpecs.wattage}
                        onChange={(e) => setManualSpecs({ ...manualSpecs, wattage: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                      />
                    </div>
                  )}

                  {(category === 'CPU' || category === 'GPU' || category === 'RAM') && (
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-450 dark:text-zinc-400 mb-1">Device Electrical Draw / TDP (W)</label>
                      <input
                        type="number"
                        value={manualSpecs.powerDraw}
                        onChange={(e) => setManualSpecs({ ...manualSpecs, powerDraw: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-450 dark:text-zinc-400 mb-1">RAM Speed / Power Pins Specs</label>
                    <input
                      type="text"
                      placeholder="e.g. 3200 MHz or 8-pin PCIe"
                      value={category === 'RAM' ? manualSpecs.ramSpeed : manualSpecs.gpuPowerConnectors}
                      onChange={(e) => {
                        if (category === 'RAM') {
                          setManualSpecs({ ...manualSpecs, ramSpeed: e.target.value });
                        } else {
                          setManualSpecs({ ...manualSpecs, gpuPowerConnectors: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-450 dark:text-zinc-400 mb-1">Detailed Listing Notes</label>
                  <input
                    type="text"
                    value={manualSpecs.details}
                    onChange={(e) => setManualSpecs({ ...manualSpecs, details: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                    placeholder="e.g. 1080p, 1ms, 165Hz IPS panels, or CL16 timing modules"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-450 dark:text-zinc-400 mb-1.5">Advisor Notes (&ldquo;Why this pick&rdquo; justification)</label>
                <textarea
                  value={manualWhy}
                  onChange={(e) => setManualWhy(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent text-sm text-zinc-800 dark:text-zinc-100 h-16 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-150 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-semibold text-sm shadow-sm select-none cursor-pointer flex items-center justify-center gap-1.5 mt-4"
              >
                <Save className="h-4 w-4" />
                <span>Save Manual Setup Changes</span>
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
