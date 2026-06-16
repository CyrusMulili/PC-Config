import React, { useState, useRef, useEffect } from 'react';
import { Send, HelpCircle, MessageSquare, Sparkles, Server } from 'lucide-react';
import { ChatMessage, PCBuild } from '../types';

interface ChatPanelProps {
  currentBuild: PCBuild;
  onUpdateBuild: (updatedBuild: PCBuild, reply: string) => void;
  chatHistory: ChatMessage[];
  onAddMessage: (msg: ChatMessage) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const SUGGESTIONS = [
  "explain why this motherboard is compatible",
  "swap the GPU for something cheaper",
  "upgrade the RAM memory to a 32GB kit",
  "adapt this build for 1085p gaming",
  "adjust this build for video editing"
];

export default function ChatPanel({
  currentBuild,
  onUpdateBuild,
  chatHistory,
  onAddMessage,
  loading,
  setLoading
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest chats
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    // Send user message
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    onAddMessage(userMsg);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/build/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentBuild,
          message: textToSend,
          history: chatHistory
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      // Update build and display response
      if (data && data.components) {
        const revisedBuild: PCBuild = {
          ...currentBuild,
          components: data.components,
          totalCostKSh: data.components.reduce((sum: number, c: any) => sum + (c.priceKSh || 0), 0)
        };
        onUpdateBuild(revisedBuild, data.reply);
      } else if (data && data.reply) {
        const assistantMsg: ChatMessage = {
          id: Math.random().toString(36).substring(7),
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        onAddMessage(assistantMsg);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        sender: 'assistant',
        text: `⚠️ **Error occurred**: Failing to process your advice request. Make sure your internet connection is active and try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      onAddMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div className="flex flex-col h-full border border-natural-border-light dark:border-zinc-855 rounded-3xl bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
      {/* Title Bar Banner */}
      <div className="p-4 bg-natural-secondary dark:bg-zinc-850/30 border-b border-natural-border-light dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-natural-primary text-white flex items-center justify-center">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-natural-text dark:text-zinc-50">BuildWise Chat Assistant</h3>
            <span className="text-[10px] text-natural-muted font-mono flex items-center gap-1 mt-0.5 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-natural-primary animate-pulse" />
              <span>Grounded Google Search Session</span>
            </span>
          </div>
        </div>
      </div>

      {/* Messages View Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[500px] lg:max-h-[600px]">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-natural-secondary dark:bg-zinc-800/40 border border-natural-border-light dark:border-zinc-800 flex items-center justify-center text-natural-primary">
              <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-natural-text dark:text-zinc-300">BuildWise Assistant Active</p>
              <p className="text-[11px] text-natural-muted mt-1">
                Type instructions here to filter your parts list or ask compatibility inquiries.
              </p>
            </div>
          </div>
        ) : (
          chatHistory.map((msg) => {
            const isMe = msg.sender === 'user';
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  isMe 
                    ? 'bg-natural-primary text-white rounded-tr-none shadow-sm' 
                    : 'bg-natural-secondary dark:bg-zinc-800 text-natural-text dark:text-zinc-200 rounded-tl-none border border-natural-border-light dark:border-zinc-800/50'
                }`}>
                  <p className="whitespace-pre-line leading-relaxed font-sans">{msg.text}</p>
                  <span className={`block text-[8px] mt-1 text-right ${isMe ? 'text-white/85' : 'text-natural-muted'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })
        )}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-natural-secondary dark:bg-zinc-800 border border-natural-border-light dark:border-zinc-850 rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center gap-2 text-natural-muted">
              <svg className="animate-spin h-3.5 w-3.5 text-natural-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>BuildWise is searching stores...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Pills */}
      {chatHistory.length === 0 && (
        <div className="px-4 py-3 bg-natural-secondary/50 dark:bg-zinc-900/10 border-t border-natural-border-light dark:border-zinc-800/50">
          <p className="text-[10px] font-bold uppercase tracking-wider text-natural-muted mb-1.5 flex items-center gap-1">
            <HelpCircle className="h-3 w-3 text-natural-primary" /> Quick Questions:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSendMessage(s)}
                className="px-2.5 py-1 text-[10px] rounded-lg bg-white dark:bg-zinc-800 border border-natural-border-light dark:border-zinc-700 text-natural-text dark:text-zinc-350 hover:bg-natural-secondary cursor-pointer transition text-left font-bold"
              >
                &ldquo;{s}&rdquo;
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input Panel */}
      <form onSubmit={handleFormSubmit} className="p-3 border-t border-natural-border-light dark:border-zinc-800 flex gap-2 bg-natural-secondary/20">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask BuildWise to tweak specs or swap models..."
          className="flex-1 px-3.5 py-2.5 rounded-xl border border-natural-border dark:border-zinc-700 bg-white/70 dark:bg-transparent text-xs text-natural-text dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-natural-primary"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="h-9 w-9 shrink-0 rounded-xl bg-natural-primary hover:bg-natural-primary-hover text-white flex items-center justify-center hover:scale-103 transition disabled:opacity-50 select-none cursor-pointer border-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
