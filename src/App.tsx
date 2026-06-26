import React, { useState, useEffect } from 'react';
import OnboardingForm from './components/OnboardingForm';
import BuildResults from './components/BuildResults';
import CompatDisplay from './components/CompatDisplay';
import ChatPanel from './components/ChatPanel';
import SwapModal from './components/SwapModal';
import GenerationLoader from './components/GenerationLoader';
import DiagnosticSuite from './components/DiagnosticSuite';
import DocumentationSuite from './components/DocumentationSuite';
import { BuildComponent, ComponentCategory, PCBuild, ChatMessage } from './types';
import { formatKSh } from './utils';
import { checkCompatibility } from './compatibility';
import { Sparkles, MonitorUp, Sun, Moon, HelpCircle, Laptop, Settings, ChevronRight, Shield, BookOpen } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [loading, setLoading] = useState(false);
  const [loadingFix, setLoadingFix] = useState(false);
  const [build, setBuild] = useState<PCBuild | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [swapModalState, setSwapModalState] = useState<{ category: ComponentCategory; component: BuildComponent } | null>(null);
  const [pendingSpec, setPendingSpec] = useState<{ budgetKSh: number; useCase: string } | null>(null);
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const [documentationOpen, setDocumentationOpen] = useState(false);

  // Apply dark mode theme class toggle on HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleGenerateBuild = async (formData: {
    budgetKSh: number;
    useCase: 'Gaming' | 'Office' | 'ContentCreation' | 'General';
    excludedCategories: ComponentCategory[];
    sourcingPreference: 'hybrid' | 'local_only';
    ownedSpecs?: Record<string, any>;
  }) => {
    setPendingSpec({ budgetKSh: formData.budgetKSh, useCase: formData.useCase });
    setLoading(true);
    setBuild(null);
    setChatHistory([]);

    try {
      const response = await fetch('/api/build/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to generate recommended PC build.");
      }

      const data = await response.json();
      
      if (data && data.components) {
        const total = data.components.reduce((sum: number, c: any) => sum + (c.priceKSh || 0), 0);
        const resolvedMode = data.sourcingMode || (formData.sourcingPreference === 'local_only' ? 'local_catalog' : 'live');
        const newBuild: PCBuild = {
          components: data.components,
          budgetKSh: formData.budgetKSh,
          totalCostKSh: total,
          useCase: formData.useCase,
          excludedCategories: formData.excludedCategories,
          sourcingMode: resolvedMode,
          ownedSpecs: formData.ownedSpecs
        };
        setBuild(newBuild);
        
        let sourcingMethodSnippet = "";
        if (resolvedMode === 'live') {
          sourcingMethodSnippet = "Sourced **live** using Google Search Grounding across top Kenyan shops (such as Jumia, Avechi, and Skyworld) for up-to-the-minute local retail figures.";
        } else if (resolvedMode === 'estimation') {
          sourcingMethodSnippet = "Retrieved via **AI Smart Estimation** using deep hardware catalogs (as live search queries hit regional rate-limits).";
        } else {
          sourcingMethodSnippet = "Loaded directly from our **Verified Offline Local Catalog**, ensuring absolute 100% price stability, guaranteed compatibility, and immune to API quota limits!";
        }

        // Push initial greeting from AI build assistant
        setChatHistory([
          {
            id: 'init-greet',
            sender: 'assistant',
            text: `🔧 **Jenga PC Build Recommendations Generated!**\n\nI have structured a customized build matching your budget of **${formatKSh(formData.budgetKSh)}** optimized for **${formData.useCase}** tasks.\n\n**Sourcing Method:** ${sourcingMethodSnippet}\n\nExpand any component card below to inspect electrical clearance rules, socket types, competitor listings, or to perform a direct parts comparison!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error("No computer parts returned from the AI recommender.");
      }
    } catch (error: any) {
      alert(`⚠️ Build Gen Alert: ${error.message || 'Trouble reaching the backend server.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBuildFromChat = (updatedBuild: PCBuild, reply: string) => {
    setBuild(updatedBuild);
    const newMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender: 'assistant',
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory(prev => [...prev, newMsg]);
  };

  const handleAddChatMessage = (msg: ChatMessage) => {
    setChatHistory(prev => [...prev, msg]);
  };

  const handleUpdateOwnedSpecs = (specs: Record<string, any>) => {
    if (!build) return;
    setBuild({
      ...build,
      ownedSpecs: specs
    });
  };

  const handleRemoveComponent = (category: ComponentCategory) => {
    if (!build) return;
    
    // Add this category to the exclusions list
    const updatedExclusions = build.excludedCategories.includes(category)
      ? build.excludedCategories
      : [...build.excludedCategories, category];

    // Filter parts active list
    const updatedComponents = build.components.filter(c => c.category !== category);
    const total = updatedComponents.reduce((sum, c) => sum + (c.priceKSh || 0), 0);

    setBuild({
      ...build,
      components: updatedComponents,
      excludedCategories: updatedExclusions,
      totalCostKSh: total
    });

    // Notify user
    const assistantMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender: 'assistant',
      text: `❌ Removed the **${category}** component category from the running build. Your active exclusions have been updated, and the budget re-allocator will ignore this part.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory(prev => [...prev, assistantMsg]);
  };

  const handleSwapComponent = (newComponent: BuildComponent) => {
    if (!build) return;

    // Replace component matching category
    const listIndex = build.components.findIndex(c => c.category === newComponent.category);
    let updatedComponents = [...build.components];

    if (listIndex > -1) {
      updatedComponents[listIndex] = newComponent;
    } else {
      updatedComponents.push(newComponent);
    }

    const total = updatedComponents.reduce((sum, c) => sum + (c.priceKSh || 0), 0);

    setBuild({
      ...build,
      components: updatedComponents,
      totalCostKSh: total
    });

    // Notify chat of successful swap
    const assistantMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender: 'assistant',
      text: `🔄 Dynamic Swap Completed: Replaced current part with **${newComponent.name}** (${formatKSh(newComponent.priceKSh)} via ${newComponent.sourceName}).\n\nRunning rule validation matrix on the revised build now...`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory(prev => [...prev, assistantMsg]);
  };

  const handleAutoFix = async () => {
    if (!build) return;
    setLoadingFix(true);

    const checkReport = checkCompatibility(build.components, build.ownedSpecs, build.useCase);
    const promptInstructions = `I have minor compatibility report alerts in my build. Please check these errors and substitute any mismatched parts for fully compliant ones within budget.

Active Conflicts:
${checkReport.issues.join('\n')}`;

    try {
      const response = await fetch('/api/build/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentBuild: build,
          message: promptInstructions,
          history: chatHistory
        })
      });

      if (!response.ok) {
        throw new Error('Correction failed.');
      }

      const data = await response.json();
      if (data && data.components) {
        const revisedBuild: PCBuild = {
          ...build,
          components: data.components,
          totalCostKSh: data.components.reduce((sum: number, c: any) => sum + (c.priceKSh || 0), 0)
        };
        handleUpdateBuildFromChat(revisedBuild, data.reply);
      }
    } catch (err) {
      alert("⚠️ Correction Error: Failed to perform AI auto-fix. Please check parts manually or ask in the chat panel.");
    } finally {
      setLoadingFix(false);
    }
  };

  return (
    <div className="min-h-screen bg-natural-bg/90 text-natural-text dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-300 font-sans">
      {/* Decorative Blur Backdrops */}
      <div className="absolute top-0 left-1/4 h-[400px] w-[500px] bg-natural-primary/5 dark:bg-emerald-950/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-48 right-1/4 h-[350px] w-[450px] bg-natural-muted/5 dark:bg-zinc-950/5 blur-3xl pointer-events-none rounded-full" />

      {/* Header Panel */}
      <header className="sticky top-0 z-40 border-b border-natural-border-light dark:border-zinc-900 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-natural-primary text-white flex items-center justify-center font-black text-xl shadow-md">
              J
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-natural-primary dark:text-zinc-50">Jenga</h1>
              <p className="text-[10px] text-natural-muted font-bold">Kenyan AI PC Build Advisor</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {build ? (
              <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                build.sourcingMode === 'live'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/45 dark:text-emerald-350'
                  : build.sourcingMode === 'estimation'
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/45 dark:text-amber-300'
                    : 'bg-blue-50 text-blue-750 dark:bg-blue-950/45 dark:text-blue-300'
              }`}>
                <span className={`h-2 w-2 rounded-full animate-pulse ${
                  build.sourcingMode === 'live'
                    ? 'bg-emerald-600'
                    : build.sourcingMode === 'estimation'
                      ? 'bg-amber-500'
                      : 'bg-blue-500'
                }`} />
                <span>
                  {build.sourcingMode === 'live' && 'Grounded in Live Search'}
                  {build.sourcingMode === 'estimation' && 'AI Estimated Senses'}
                  {build.sourcingMode === 'local_catalog' && 'Verified Local Catalog'}
                </span>
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-natural-secondary dark:bg-zinc-900 uppercase tracking-wider text-natural-primary">
                <span className="h-2 w-2 rounded-full bg-natural-primary animate-pulse" />
                <span>Smart PC Build Grounding</span>
              </span>
            )}

            {/* System Blueprint / PDF Documentation Manual */}
            <button
              onClick={() => setDocumentationOpen(true)}
              className="p-2 py-1.5 rounded-xl border border-natural-border-light dark:border-zinc-850 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs cursor-pointer hover:bg-indigo-500/15 transition flex items-center gap-1.5 select-none"
              title="Open Five-Page System Documentation & Architecture Guide"
            >
              <BookOpen className="h-4 w-4 text-indigo-500 animate-pulse" />
              <span className="hidden sm:inline">System Manual</span>
            </button>

            {/* System Testing & Telemetry Diagnostic Suite */}
            <button
              onClick={() => setDiagnosticOpen(true)}
              className="p-2 py-1.5 rounded-xl border border-natural-border-light dark:border-zinc-850 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs cursor-pointer hover:bg-emerald-500/15 transition flex items-center gap-1.5 select-none"
              title="Open System Validation Testing & Diagnostics Suite"
            >
              <Shield className="h-4 w-4 text-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Telemetry & Testing</span>
            </button>

            {/* Light/Dark Toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-xl hover:bg-natural-secondary/80 dark:hover:bg-zinc-850 border border-natural-border-light dark:border-zinc-850 cursor-pointer text-natural-muted transition"
              title="Toggle theme visual display"
            >
              {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Stage */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative">
        {!build ? (
          loading && pendingSpec ? (
            <GenerationLoader budgetKSh={pendingSpec.budgetKSh} useCase={pendingSpec.useCase} />
          ) : (
            /* Onboarding Form Screen */
            <div className="space-y-8 animate-fade-in">
              <div className="text-center space-y-3 max-w-2xl mx-auto mb-6">
                <div className="inline-flex items-center gap-1.5 bg-natural-primary/10 border border-natural-primary/20 text-natural-primary px-3 py-1 rounded-full text-xs font-bold">
                  <Sparkles className="h-3 w-3" />
                  <span>Search Grounding Advisor</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-serif italic text-natural-primary dark:text-zinc-50 leading-tight">
                  Build the Perfect Computer
                </h2>
                <p className="text-sm text-natural-muted leading-relaxed max-w-lg mx-auto font-medium">
                  Enter your total budget in Kenyan Shillings. Jenga's rule-engine translates details to find compatible component deals from popular shops.
                </p>
              </div>
              
              <OnboardingForm onGenerate={handleGenerateBuild} loading={loading} />
            </div>
          )
        ) : (
          /* Build Results & Chat Assistant View Screen */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Main Build results display (Left 2 columns) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Compatibility warning display widget */}
              <CompatDisplay 
                components={build.components} 
                ownedSpecs={build.ownedSpecs}
                onAutoFix={handleAutoFix}
                loadingFix={loadingFix}
                onUpdateOwnedSpecs={handleUpdateOwnedSpecs}
                useCase={build.useCase}
              />

              <BuildResults
                components={build.components}
                budgetKSh={build.budgetKSh}
                totalCostKSh={build.totalCostKSh}
                onRemoveComponent={handleRemoveComponent}
                onOpenSwapModal={(cat, comp) => setSwapModalState({ category: cat, component: comp })}
                onRestart={() => setBuild(null)}
                sourcingMode={build.sourcingMode}
              />
            </div>

            {/* Chat Assistant Sidebar layout (Right 1 column) */}
            <div className="lg:sticky lg:top-24">
              <ChatPanel
                currentBuild={build}
                onUpdateBuild={handleUpdateBuildFromChat}
                chatHistory={chatHistory}
                onAddMessage={handleAddChatMessage}
                loading={loading}
                setLoading={setLoading}
              />

              {/* Informational Guide Area */}
              <div className="mt-4 p-4 rounded-3xl border border-natural-border-light dark:border-zinc-850 bg-white/40 dark:bg-zinc-900/40 text-xs text-natural-muted leading-relaxed space-y-2">
                <p className="font-bold uppercase tracking-wider text-[10px] text-natural-primary">Notes regarding stocks & price tags</p>
                <p>Jenga recommends hardware matching complex physical rule restrictions. Grounding connects live data; however, local store pricing fluctuates frequently. Source links are provided to let you verify individual retail item stock levels.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Component swap editor slider portal modal */}
      {swapModalState && build && (
        <SwapModal
          category={swapModalState.category}
          component={swapModalState.component}
          isOpen={!!swapModalState}
          onClose={() => setSwapModalState(null)}
          onSwap={handleSwapComponent}
          currentBuild={build}
        />
      )}

      {/* System Validation Testing and Diagnostic Board */}
      <DiagnosticSuite
        isOpen={diagnosticOpen}
        onClose={() => setDiagnosticOpen(false)}
        currentComponents={build?.components || []}
        ownedSpecs={build?.ownedSpecs}
        onLoadScenario={(components, specs) => {
          if (!build) return;
          setBuild({
            ...build,
            components,
            ownedSpecs: specs || {},
            totalCostKSh: components.reduce((sum, c) => sum + (c.priceKSh || 0), 0)
          });
        }}
      />

      {/* Five-Page Interactive Technical & System Blueprint Manual */}
      <DocumentationSuite
        isOpen={documentationOpen}
        onClose={() => setDocumentationOpen(false)}
      />
    </div>
  );
}
