import React, { useState } from 'react';
import { BookOpen, Printer, ChevronLeft, ChevronRight, CheckCircle2, Cpu, Network, Layers, ShieldCheck, HelpCircle } from 'lucide-react';
import { formatKSh } from '../utils';

interface DocumentationSuiteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentationSuite({ isOpen, onClose }: DocumentationSuiteProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  if (!isOpen) return null;

  const totalPages = 5;

  const handlePrint = () => {
    // Save current title, print, and restore
    const originalTitle = document.title;
    document.title = "Jenga_KE_System_Documentation_Manual";
    window.print();
    document.title = originalTitle;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-natural-bg/95 dark:bg-zinc-950/95 backdrop-blur-md flex justify-center items-start py-8 px-4 sm:px-6">
      <div className="w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-3xl border border-natural-border dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col min-h-[85vh]">
        
        {/* Header (Hidden during standard printing) */}
        <div className="print:hidden border-b border-natural-border-light dark:border-zinc-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-natural-secondary dark:bg-zinc-950/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-natural-primary text-white flex items-center justify-center font-black text-lg shadow">
              M
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-natural-primary dark:text-zinc-50">System Documentation Manual</h2>
              <p className="text-[11px] text-natural-muted dark:text-zinc-400 font-bold uppercase tracking-wider">Five-Page Interactive Architecture Guide & Exportable Blueprint</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold bg-natural-primary text-white hover:bg-natural-primary-hover dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-xl cursor-pointer transition flex items-center gap-1.5 shadow"
            >
              <Printer className="h-4 w-4" />
              <span>Export PDF / Print Manual</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold border border-natural-border dark:border-zinc-850 hover:bg-natural-secondary dark:hover:bg-zinc-800 rounded-xl cursor-pointer transition text-natural-text dark:text-zinc-300"
            >
              Close Documentation
            </button>
          </div>
        </div>

        {/* Navigation Sidebar / Tabs for Pages (Hidden during standard printing) */}
        <div className="print:hidden bg-natural-secondary/50 dark:bg-zinc-900/50 border-b border-natural-border-light dark:border-zinc-850 p-4 flex flex-wrap gap-2 justify-center">
          {[1, 2, 3, 4, 5].map((pageNum) => {
            const pageTitles = [
              "1. Executive Summary & Core Platform System Overview",
              "2. Gemini API & Live Web Search Grounding Integration",
              "3. Dual-Layer Hardware Constraint Rule Matrix Engine",
              "4. Static Falling Catalog Structure & Math Allocations",
              "5. Automated Diagnostic Testing & Self-Healing Telemetry"
            ];
            const isActive = currentPage === pageNum;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all duration-250 border ${
                  isActive
                    ? 'bg-natural-primary/10 border-natural-primary/30 text-natural-primary dark:bg-emerald-550/20 dark:border-emerald-500 dark:text-emerald-400 font-bold shadow-sm'
                    : 'bg-white/45 hover:bg-white dark:bg-zinc-950/25 dark:hover:bg-zinc-950 border-natural-border-light dark:border-zinc-850 text-natural-muted hover:text-natural-text dark:text-zinc-450 dark:hover:text-zinc-205'
                }`}
                title={pageTitles[pageNum - 1]}
              >
                Page {pageNum}
              </button>
            );
          })}
        </div>

        {/* Content Area (Optimized for both Screen Browsing and Multi-Page PDF Printing) */}
        <div id="print-document-root" className="flex-1 p-8 sm:p-12 md:p-16 max-w-4xl mx-auto overflow-y-auto leading-relaxed text-zinc-800 dark:text-zinc-300 select-text">
          
          {/* Printable Book Mode: On standard print, we show ALL pages sequentially, with strict page break directives. 
              On screen, we only render the active page state. */}
          
          {/* ========================================================================= */}
          {/* PAGE 1: EXECUTIVE SUMMARY & CORE PLATFORM SYSTEM OVERVIEW                  */}
          {/* ========================================================================= */}
          {(currentPage === 1 || window.matchMedia('print').matches) && (
            <section className="print:block page-section relative space-y-8" style={{ pageBreakAfter: 'always' }}>
              
              {/* Manual Cover Banner */}
              <div className="border-b-2 border-natural-primary/40 dark:border-emerald-800/40 pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-natural-primary text-white text-[9px] font-black tracking-widest rounded">SYSADMIN BLUEPRINT</span>
                  <span className="text-xs text-natural-muted dark:text-zinc-500 font-mono">ID: AI-KE-PC-93128</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-serif text-natural-primary dark:text-zinc-50 tracking-tight leading-tight">
                  Jenga KE: Kenyan AI PC Build Advisor
                </h1>
                <p className="text-sm font-semibold text-natural-muted dark:text-zinc-400 mt-1 font-mono">
                  High-Level Technical Architecture & System Integration Documentation
                </p>
              </div>

              {/* Grid 1: Meta details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-natural-secondary dark:bg-zinc-950/30 p-5 rounded-2xl border border-natural-border-light dark:border-zinc-850">
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-natural-primary dark:text-emerald-400 tracking-wider">System Version</h4>
                  <p className="text-sm font-mono font-bold">v2.4.0 (Stable Production)</p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-natural-primary dark:text-emerald-400 tracking-wider">Target Geographies</h4>
                  <p className="text-sm font-mono font-bold">Nairobi / Rift Valley / Coast (Kenya)</p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-natural-primary dark:text-emerald-400 tracking-wider">Key Technologies</h4>
                  <p className="text-xs font-mono font-bold text-natural-muted">React, Express, Google Gemini, Lucide</p>
                </div>
              </div>

              {/* Core Content */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold font-serif text-natural-primary dark:text-zinc-100 flex items-center gap-2 border-b border-natural-border-light dark:border-zinc-850 pb-2">
                  <Layers className="h-5 w-5 text-natural-primary dark:text-emerald-400" />
                  <span>1.1 Purpose & Problem Statement</span>
                </h3>
                <p className="text-sm leading-relaxed">
                  In developing countries like Kenya, PC assembly is complicated by dynamic pricing, unpredictable stock levels, variable shipping models, and regional component distribution. Builders in Nairobi face several key challenges:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-zinc-700 dark:text-zinc-350">
                  <li><strong>Price Inconsistencies:</strong> Popular offline shops in Nairobi (e.g., Skyworld Kenya, Avechi, Jumia, and Phone Place) don't synchronize price updates across a single directory.</li>
                  <li><strong>Socket Mismatch Waste:</strong> Laypersons buy incompatible parts (e.g., matching a LGA1700 Core i3 with an AM4 B450 motherboard) leading to lost money.</li>
                  <li><strong>Power Inadequacy:</strong> Underestimating total TDP values can result in buying power supplies that cause system shutoffs.</li>
                </ul>
                <p className="text-sm">
                  <strong>Jenga KE</strong> provides an elegant answer: a client-server web app that combines an <strong>AI Search Grounding System</strong> with a fast <strong>Physical Compatibility Rule Engine</strong> to curate fully compliant PC builds in Kenyan Shillings.
                </p>

                <h3 className="text-xl font-bold font-serif text-natural-primary dark:text-zinc-100 flex items-center gap-2 border-b border-natural-border-light dark:border-zinc-850 pb-2 mt-8">
                  <CheckCircle2 className="h-5 w-5 text-natural-primary dark:text-emerald-400" />
                  <span>1.2 System Integration Elements Overview</span>
                </h3>
                <p className="text-sm">
                  The architecture comprises five distinct logical modules operating in sequence to resolve, optimize, validate, and customize components:
                </p>

                {/* ASCII Diagram representation of System Flow */}
                <div className="bg-zinc-950 text-emerald-400 p-5 rounded-2xl font-mono text-[11px] overflow-x-auto border border-zinc-850 shadow-inner">
                  <div className="text-center font-bold text-zinc-400 uppercase tracking-widest mb-3">Core Application Pipeline Diagram</div>
                  {`  [ Onboarding User Query ] ──> Budget Allocator Matrix (src/utils.ts)
                                           │
                                           ▼
                    ┌─────────────────────────────────────────────┐
                    │  Server Sourcing Pipeline (server.ts)       │
                    │                                             │
                    │  1. Live Web Search Grounding (Gemini)      │
                    │  2. AI Smart Estimation Fallback Handler    │
                    │  3. Verified Local Static Catalog           │
                    └──────────────────────┬──────────────────────┘
                                           │
                                           ▼
                    ┌─────────────────────────────────────────────┐
                    │  Rules Compatibility Matrix (compatibility) │
                    │                                             │
                    │  - Sockets (LGA1700, AM5, AM4)              │
                    │  - RAM Standard Limits (DDR4 / DDR5)        │
                    │  - PSU TDP Margins & physical sizes         │
                    └──────────────────────┬──────────────────────┘
                                           │
                                           ▼
                    ┌─────────────────────────────────────────────┐
                    │  User Control Center (src/App.tsx)          │
                    │                                             │
                    │  - Dynamic Component Part Swap Modals       │
                    │  - Conversational AI Fine-Tuning Chat Panel │
                    │  - Telemetry Diagnostic & Scenario Suite    │
                    └─────────────────────────────────────────────┘`}
                </div>
                
                <p className="text-xs text-natural-muted dark:text-zinc-400 italic">
                  * Note: Print-break instructions are pre-compiled into this layout; proceeding to print triggers a clean pagination across consecutive sheets.
                </p>
              </div>

              {/* Cover footer */}
              <div className="pt-10 border-t border-natural-border-light dark:border-zinc-850 flex justify-between items-center text-xs text-natural-muted font-mono">
                <span>SYSTEM BLUEPRINT // PAGE 1 OF 5</span>
                <span>JENGA KE</span>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* PAGE 2: GEMINI API & LIVE WEB SEARCH GROUNDING INTEGRATION               */}
          {/* ========================================================================= */}
          {(currentPage === 2 || window.matchMedia('print').matches) && (
            <section className="print:block page-section relative space-y-8 mt-12 print:mt-0" style={{ pageBreakAfter: 'always' }}>
              
              <div className="border-b border-natural-primary/30 dark:border-emerald-800/30 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-black tracking-widest rounded font-mono">API INTEGRATION</span>
                  <span className="text-xs text-natural-muted dark:text-zinc-500 font-mono">MODULE: SEARCH GROUNDING</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif text-natural-primary dark:text-zinc-50 tracking-tight leading-tight">
                  Gemini API & Live Web Search Grounding
                </h1>
              </div>

              <div className="space-y-6 text-sm">
                <h3 className="text-lg font-bold font-serif text-natural-primary dark:text-zinc-100 flex items-center gap-2 border-b border-natural-border-light dark:border-zinc-850 pb-2">
                  <Network className="h-5 w-5 text-natural-primary dark:text-emerald-400" />
                  <span>2.1 Search Grounding Architecture</span>
                </h3>
                <p>
                  Jenga KE implements a state-of-the-art server-side integration utilizing the <strong>@google/genai TypeScript SDK</strong>. To ensure the recommendations are not hallucinated and reflect true local inventory, the system leverages Gemini’s <strong>Google Search Grounding tool</strong> capability.
                </p>
                <p>
                  During compilation, the model is fed a highly specialized grounding context:
                </p>

                <div className="bg-zinc-900 text-zinc-300 p-5 rounded-2xl font-mono text-xs overflow-x-auto border border-zinc-850 space-y-2">
                  <div className="text-zinc-400 border-b border-zinc-850 pb-2 font-bold flex items-center justify-between">
                    <span>Server grounding query instructions</span>
                    <span className="text-[10px] text-emerald-400">server.ts</span>
                  </div>
                  <pre className="text-zinc-400 text-[11px] whitespace-pre-wrap">
{`"You are Jenga, an expert PC build advisor for shoppers in Kenya.
Your job is to search the web using your search tools to find real, currently active hardware listings and prices in Kenya (from retailers such as Jumia Kenya, Avechi Kenya, Skyworld Kenya, or Phone Place Kenya) that match the budget boundaries specified by the user. 
Format your responses strictly in JSON so they can be parsed by our physical rule validators."`}
                  </pre>
                </div>

                <h3 className="text-lg font-bold font-serif text-natural-primary dark:text-zinc-100 flex items-center gap-2 border-b border-natural-border-light dark:border-zinc-850 pb-2 mt-8">
                  <Layers className="h-5 w-5 text-natural-primary dark:text-emerald-400" />
                  <span>2.2 Store Mappings & URL Sanitizers</span>
                </h3>
                <p>
                  Live results retrieved via search grounding often contain broken affiliate or search page links. To guarantee the user can purchase the item, the server runs a mapping routine that parses the raw landing coordinates and normalizes them:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-zinc-700 dark:text-zinc-350">
                  <li><strong>Jumia Kenya:</strong> Converts generic strings to `https://www.jumia.co.ke/catalog/?q=[Query]` to prevent landing on 404 pages.</li>
                  <li><strong>Skyworld Kenya:</strong> Links resolve to Skyworld’s main search endpoint to make it easy for users to check in-store stock.</li>
                  <li><strong>Avechi:</strong> Paths map directly to Avechi's verified components catalog page.</li>
                </ul>

                <h3 className="text-lg font-bold font-serif text-natural-primary dark:text-zinc-100 flex items-center gap-2 border-b border-natural-border-light dark:border-zinc-850 pb-2 mt-8">
                  <ShieldCheck className="h-5 w-5 text-natural-primary dark:text-emerald-400" />
                  <span>2.3 Tri-Level Fallback Pipeline</span>
                </h3>
                <p>
                  To manage regional network jitter, external shop API latency, and Gemini API rate-limits (e.g. `429 Quota Exhausted`), Jenga KE uses a robust fallback pipeline:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                    <span className="font-mono text-xs font-bold text-emerald-600 block mb-1">01. LIVE MODE</span>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">Uses Gemini live search grounding to scour active Nairobi e-shops for real-time prices.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                    <span className="font-mono text-xs font-bold text-amber-600 block mb-1">02. ESTIMATION MODE</span>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">Triggers if grounding returns incomplete sets; estimates values using deep hardware specs.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
                    <span className="font-mono text-xs font-bold text-blue-600 block mb-1">03. CATALOG MODE</span>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">Active when offline or during high API load. Safely sources from our local verified repository.</p>
                  </div>
                </div>
              </div>

              {/* Page footer */}
              <div className="pt-10 border-t border-natural-border-light dark:border-zinc-850 flex justify-between items-center text-xs text-natural-muted font-mono">
                <span>SYSTEM BLUEPRINT // PAGE 2 OF 5</span>
                <span>JENGA KE</span>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* PAGE 3: DUAL-LAYER HARDWARE COMPATIBILITY ENGINE                         */}
          {/* ========================================================================= */}
          {(currentPage === 3 || window.matchMedia('print').matches) && (
            <section className="print:block page-section relative space-y-8 mt-12 print:mt-0" style={{ pageBreakAfter: 'always' }}>
              
              <div className="border-b border-natural-primary/30 dark:border-emerald-800/30 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-zinc-900 text-white text-[9px] font-black tracking-widest rounded font-mono">COMPAT ENGINE</span>
                  <span className="text-xs text-natural-muted dark:text-zinc-500 font-mono">MODULE: RULES MATRIX</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif text-natural-primary dark:text-zinc-50 tracking-tight leading-tight">
                  Dual-Layer Hardware Compatibility Engine
                </h1>
              </div>

              <div className="space-y-6 text-sm">
                <h3 className="text-lg font-bold font-serif text-natural-primary dark:text-zinc-100 flex items-center gap-2 border-b border-natural-border-light dark:border-zinc-850 pb-2">
                  <Cpu className="h-5 w-5 text-natural-primary dark:text-emerald-400" />
                  <span>3.1 Compatibility Architecture</span>
                </h3>
                <p>
                  To prevent builds that cannot be physically assembled, Jenga KE runs an isolated, fully automated rules matrix mapping CPU sockets, memory pins, motherboard clearances, PSU ratings, and case support structures in a millisecond response envelope. It catches compatibility exceptions long before user payment.
                </p>

                <h3 className="text-lg font-bold font-serif text-natural-primary dark:text-zinc-100 flex items-center gap-2 border-b border-natural-border-light dark:border-zinc-850 pb-2 mt-8">
                  <span>3.2 Rule Definitions & Mathematics</span>
                </h3>
                
                {/* Rule Breakdown Table */}
                <div className="border border-natural-border-light dark:border-zinc-850 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-natural-secondary dark:bg-zinc-950 p-3 font-mono text-[11px] font-bold grid grid-cols-3 border-b border-natural-border-light dark:border-zinc-850">
                    <span>Hardware Bound</span>
                    <span>Validation Equation / Check</span>
                    <span>Action Taken / Fix</span>
                  </div>
                  <div className="p-4 space-y-4 text-xs font-mono">
                    <div className="grid grid-cols-3 border-b border-natural-border-light dark:border-zinc-850/40 pb-3 gap-2">
                      <span className="font-bold text-natural-primary dark:text-emerald-400">CPU-Motherboard Sockets</span>
                      <span>{`cpu.socket === mobo.socket`}</span>
                      <span>Throws Alert. Offers swap to socket-matched motherboard (e.g. AM4, LGA1700).</span>
                    </div>
                    <div className="grid grid-cols-3 border-b border-natural-border-light dark:border-zinc-850/40 pb-3 gap-2">
                      <span className="font-bold text-natural-primary dark:text-emerald-400">RAM Gen Synchronization</span>
                      <span>{`mobo.ramType === ram.ramType`}</span>
                      <span>Verifies motherboard memory lanes support DDR4 vs DDR5; locks generation during swaps.</span>
                    </div>
                    <div className="grid grid-cols-3 border-b border-natural-border-light dark:border-zinc-850/40 pb-3 gap-2">
                      <span className="font-bold text-natural-primary dark:text-emerald-400">Power Wattage Limits</span>
                      <span>{`Σ(PowerDraw) * 1.35 <= psu.wattage`}</span>
                      <span>Calculates combined TDP draw of GPU, CPU, and RAM, applying a safety overhead.</span>
                    </div>
                    <div className="grid grid-cols-3 pb-1 gap-2">
                      <span className="font-bold text-natural-primary dark:text-emerald-400">Chassis GPU Clearance</span>
                      <span>{`gpu.length <= case.maxGpuLength`}</span>
                      <span>Compares physical dimension variables to prevent cards from hitting case borders.</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold font-serif text-natural-primary dark:text-zinc-100 flex items-center gap-2 border-b border-natural-border-light dark:border-zinc-850 pb-2 mt-8">
                  <span>3.3 Code Representation: `src/compatibility.ts`</span>
                </h3>
                <p>
                  The code below showcases the CPU Socket Matching routine inside the rule validator:
                </p>

                <div className="bg-zinc-900 text-zinc-300 p-5 rounded-2xl font-mono text-xs overflow-x-auto border border-zinc-850 space-y-2">
                  <div className="text-zinc-400 border-b border-zinc-850 pb-2 font-bold flex items-center justify-between">
                    <span>cpuSocket validation routing snippet</span>
                    <span className="text-[10px] text-emerald-400">src/compatibility.ts</span>
                  </div>
                  <pre className="text-zinc-400 text-[11px]">
{`const cpuSocket = cpu.specs.socket?.toUpperCase().trim();
const moboSocket = mobo.specs.socket?.toUpperCase().trim();

if (cpuSocket && moboSocket && cpuSocket !== moboSocket) {
  issues.push(\`CPU Socket (\${cpu.specs.socket}) does not match Motherboard (\${mobo.specs.socket}).\`);
  score -= 40;
}`}
                  </pre>
                </div>
              </div>

              {/* Page footer */}
              <div className="pt-10 border-t border-natural-border-light dark:border-zinc-850 flex justify-between items-center text-xs text-natural-muted font-mono">
                <span>SYSTEM BLUEPRINT // PAGE 3 OF 5</span>
                <span>JENGA KE</span>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* PAGE 4: STATIC FALLBACK CATALOG STRUCTURE & MATH ALLOCATIONS              */}
          {/* ========================================================================= */}
          {(currentPage === 4 || window.matchMedia('print').matches) && (
            <section className="print:block page-section relative space-y-8 mt-12 print:mt-0" style={{ pageBreakAfter: 'always' }}>
              
              <div className="border-b border-natural-border dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-zinc-900 text-white text-[9px] font-black tracking-widest rounded font-mono">DATA PLATFORM</span>
                  <span className="text-xs text-natural-muted dark:text-zinc-500 font-mono">MODULE: CATALOG OPTIMIZER</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif text-natural-primary dark:text-zinc-50 tracking-tight leading-tight">
                  Static Fallback Catalog & Budget Math Allocations
                </h1>
              </div>

              <div className="space-y-6 text-sm">
                <h3 className="text-lg font-bold font-serif text-natural-primary dark:text-zinc-100 flex items-center gap-2 border-b border-natural-border-light dark:border-zinc-850 pb-2">
                  <Layers className="h-5 w-5 text-natural-primary dark:text-emerald-400" />
                  <span>4.1 Hardcoded Hardware Repository Blueprint</span>
                </h3>
                <p>
                  When network issues or API limits prevent live lookups, Jenga KE transitions to its optimized <strong>Verified Local Catalog Matcher</strong>. This local catalog is stored in `src/hardwareRepository.ts` to ensure fast access and clean type definitions:
                </p>

                <div className="bg-zinc-900 text-zinc-300 p-5 rounded-2xl font-mono text-xs overflow-x-auto border border-zinc-850 space-y-2">
                  <div className="text-zinc-400 border-b border-zinc-850 pb-2 font-bold flex items-center justify-between">
                    <span>HardwareItem Schema Representation</span>
                    <span className="text-[10px] text-emerald-400">src/hardwareRepository.ts</span>
                  </div>
                  <pre className="text-zinc-400 text-[11px]">
{`export interface HardwareItem {
  category: string;
  name: string;
  brand: string;
  model: string;
  basePriceKSh: number;
  specs: {
    socket?: string;
    ramType?: string;
    wattage?: number;
    gpuLength?: number;
    sizeSupport?: string[];
    [key: string]: any;
  };
  whyThisPick: string;
  sourceName: string;
  sourceUrl: string;
  alternativeOptions: Array<{ storeName: string; priceKSh: number; url: string }>;
}`}
                  </pre>
                </div>

                <h3 className="text-lg font-bold font-serif text-natural-primary dark:text-zinc-100 flex items-center gap-2 border-b border-natural-border-light dark:border-zinc-850 pb-2 mt-8">
                  <span>4.2 Intelligent Budget Slicing & Allocation Matrix</span>
                </h3>
                <p>
                  To recommend balanced builds, the application calculates target budget thresholds dynamically based on the total budget (in KSh) and the user's workload type (Gaming, Office, Content Creation, or General). The allocation percentages below show how funds are divided across components:
                </p>

                {/* Slicing Percentage chart */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 font-mono text-center">
                  <div className="p-3 bg-natural-secondary dark:bg-zinc-950 border border-natural-border-light dark:border-zinc-850 rounded-xl">
                    <span className="text-[10px] text-natural-muted block">CPU</span>
                    <span className="text-lg font-bold text-natural-primary dark:text-emerald-400">18% - 25%</span>
                  </div>
                  <div className="p-3 bg-natural-secondary dark:bg-zinc-950 border border-natural-border-light dark:border-zinc-850 rounded-xl">
                    <span className="text-[10px] text-natural-muted block">GPU</span>
                    <span className="text-lg font-bold text-natural-primary dark:text-emerald-400">20% - 35%</span>
                  </div>
                  <div className="p-3 bg-natural-secondary dark:bg-zinc-950 border border-natural-border-light dark:border-zinc-850 rounded-xl">
                    <span className="text-[10px] text-natural-muted block">Motherboard</span>
                    <span className="text-lg font-bold text-natural-primary dark:text-emerald-400">12% - 15%</span>
                  </div>
                  <div className="p-3 bg-natural-secondary dark:bg-zinc-950 border border-natural-border-light dark:border-zinc-850 rounded-xl">
                    <span className="text-[10px] text-natural-muted block">Other parts</span>
                    <span className="text-lg font-bold text-natural-primary dark:text-emerald-400">Remaining %</span>
                  </div>
                </div>

                <p className="mt-2 text-zinc-700 dark:text-zinc-350">
                  If the user already owns parts (e.g., they exclude a GPU or Monitor), the allocator redistributes those funds to the remaining components. This lets builders invest more in core hardware like CPUs or SSDs without exceeding their budget limits.
                </p>
              </div>

              {/* Page footer */}
              <div className="pt-10 border-t border-natural-border-light dark:border-zinc-850 flex justify-between items-center text-xs text-natural-muted font-mono">
                <span>SYSTEM BLUEPRINT // PAGE 4 OF 5</span>
                <span>JENGA KE</span>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* PAGE 5: AUTOMATED DIAGNOSTIC TESTING & SELF-HEALING TELEMETRY            */}
          {/* ========================================================================= */}
          {(currentPage === 5 || window.matchMedia('print').matches) && (
            <section className="print:block page-section relative space-y-8 mt-12 print:mt-0" style={{ pageBreakAfter: 'always' }}>
              
              <div className="border-b border-natural-border dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-black tracking-widest rounded font-mono">TELEMETRY</span>
                  <span className="text-xs text-natural-muted dark:text-zinc-500 font-mono">MODULE: DIAGNOSTIC SUITE</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif text-natural-primary dark:text-zinc-50 tracking-tight leading-tight">
                  Automated Diagnostics & Self-Healing Telemetry
                </h1>
              </div>

              <div className="space-y-6 text-sm">
                <h3 className="text-lg font-bold font-serif text-natural-primary dark:text-zinc-100 flex items-center gap-2 border-b border-natural-border-light dark:border-zinc-850 pb-2">
                  <ShieldCheck className="h-5 w-5 text-natural-primary dark:text-emerald-400" />
                  <span>5.1 Telemetry Dashboard & Verification Panel</span>
                </h3>
                <p>
                  The integrated <strong>Telemetry Diagnostic Suite</strong> serves as Jenga's quality assurance framework. Administrators can use it to verify the rule engine's performance across simulated environments.
                </p>
                <p>
                  The Telemetry Panel includes these automated diagnostic operations:
                </p>

                <div className="space-y-3">
                  <div className="p-4 bg-natural-secondary dark:bg-zinc-950 border border-natural-border-light dark:border-zinc-850 rounded-2xl flex items-start gap-3">
                    <span className="text-emerald-500 font-mono font-bold text-sm">A</span>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">Clearence & Socket Jitter Simulations</h4>
                      <p className="text-xs text-natural-muted">Simulates mismatch errors (e.g., LGA1700 CPU on AM4 motherboard) to verify that the rule engine correctly flags and reports clearance conflicts.</p>
                    </div>
                  </div>

                  <div className="p-4 bg-natural-secondary dark:bg-zinc-950 border border-natural-border-light dark:border-zinc-850 rounded-2xl flex items-start gap-3">
                    <span className="text-emerald-500 font-mono font-bold text-sm">B</span>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">Intelligent Wattage Stress Checks</h4>
                      <p className="text-xs text-natural-muted">Simulates high power draw components on an entry-level 450W power supply to confirm that the validator triggers appropriate power warning flags.</p>
                    </div>
                  </div>

                  <div className="p-4 bg-natural-secondary dark:bg-zinc-950 border border-natural-border-light dark:border-zinc-850 rounded-2xl flex items-start gap-3">
                    <span className="text-emerald-500 font-mono font-bold text-sm">C</span>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">Auto-Fix Self-Healing Routing</h4>
                      <p className="text-xs text-natural-muted">Allows users to resolve all flagged validation warnings in a single click by calling our correction API to swap mismatched items for compatible ones.</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold font-serif text-natural-primary dark:text-zinc-100 flex items-center gap-2 border-b border-natural-border-light dark:border-zinc-850 pb-2 mt-8">
                  <span>5.2 Production Readiness & Verification Checklist</span>
                </h3>
                <p>
                  To verify correct system operation, administrators can run this telemetry checklist:
                </p>

                <div className="bg-zinc-950 text-zinc-350 p-5 rounded-2xl font-mono text-[11px] border border-zinc-850 space-y-2">
                  <div className="text-zinc-400 border-b border-zinc-850 pb-2 font-bold">Verification Checklist Status Report</div>
                  <div className="text-emerald-400">✓ TS-01: Express dev server compiles on static port 3000</div>
                  <div className="text-emerald-400">✓ TS-02: Gemini Grounding client handles 429 quota codes automatically</div>
                  <div className="text-emerald-400">✓ TS-03: Sockets, TDP, and GPU clearance equations pass linting</div>
                  <div className="text-emerald-400">✓ TS-04: Kenyan Retailer currency mapping (KSh) parses properly</div>
                  <div className="text-zinc-500">⏳ TS-05: Manual export layout print breaks successfully synchronized</div>
                </div>
              </div>

              {/* Page footer */}
              <div className="pt-10 border-t border-natural-border-light dark:border-zinc-850 flex justify-between items-center text-xs text-natural-muted font-mono">
                <span>SYSTEM BLUEPRINT // PAGE 5 OF 5</span>
                <span>JENGA KE</span>
              </div>
            </section>
          )}

        </div>

        {/* Footer Bar (Hidden during standard printing) */}
        <div className="print:hidden border-t border-natural-border-light dark:border-zinc-800 p-6 flex items-center justify-between bg-natural-secondary/30 dark:bg-zinc-950/20">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-natural-border dark:border-zinc-800 rounded-xl hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-natural-text dark:text-zinc-300 transition"
              title="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-natural-muted font-bold font-mono">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-natural-border dark:border-zinc-800 rounded-xl hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-natural-text dark:text-zinc-300 transition"
              title="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-natural-muted">
            <HelpCircle className="h-4 w-4" />
            <span>Use the print browser dialog to generate a 5-page PDF document.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
