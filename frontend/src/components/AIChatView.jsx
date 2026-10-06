import React, { useRef, useEffect, useState } from 'react';
import {
  ShieldCheck,
  Loader2,
  Sparkles,
  Zap,
  Lock,
  RotateCcw,
} from 'lucide-react';
import AIChatMessage from './AIChatMessage';
import GeminiChatInput from './GeminiChatInput';
import TrustGateLogo from './TrustGateLogo';

const LOADING_MESSAGES = [
  'TrustGate is checking your request...',
  'Analyzing security context...',
  'Protecting your interaction...',
];

export default function AIChatView({
  messages = [],
  input,
  setInput,
  onSend,
  loading,
  error,
  backendStatus,
  onOpenAuth,
  onResetChat,
  protectionMode = 'strict',
  onOpenOnboarding,
}) {
  const messagesEndRef = useRef(null);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  // Auto-scroll to bottom smoothly on message change or loading state
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Progressive loading status message cycler
  useEffect(() => {
    if (!loading) {
      setLoadingMsgIdx(0);
      return;
    }
    const timer = setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 900);
    return () => clearInterval(timer);
  }, [loading]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 flex flex-col min-h-0 relative animate-page-enter">
      
      {/* ─── Scrollable Chat Feed ─── */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4 max-w-4xl w-full mx-auto">
        
        {/* If no messages yet, show welcome hero */}
        {isEmpty && (
          <div className="py-6 sm:py-12 flex flex-col items-center text-center max-w-2xl mx-auto space-y-6 animate-fade-in">
            
            {/* Shield Logo Emblem with subtle silver light */}
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-full blur-xl opacity-20 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                }}
              />
              <div className="relative w-16 h-16 rounded-3xl bg-[#090D14] border border-white/20 flex items-center justify-center shadow-2xl shadow-black/80 card-interactive">
                <TrustGateLogo size={36} />
              </div>
            </div>

            {/* Welcome Titles */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                TrustGate AI Guardian
              </h1>
              <p className="text-sm font-medium text-[#CBD5E1]">
                AI Security &amp; Privacy Guardian
              </p>
              <p className="text-xs sm:text-sm text-[#8B95A7] max-w-md mx-auto leading-relaxed">
                Enter any prompt, code snippet, or payload. TrustGate will inspect for prompt injections, secrets, payment cards (Luhn), and PII in real time.
              </p>
            </div>

            {/* Mode & Tour Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/4 border border-white/10 text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Active Policy: <span className="text-[#CBD5E1] capitalize">{protectionMode} Shield</span>
              </span>

              <button
                type="button"
                onClick={onOpenOnboarding}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono bg-white/5 hover:bg-white/10 border border-white/12 text-white transition-all duration-150 cursor-pointer btn-premium"
              >
                <Sparkles className="w-3 h-3 text-[#CBD5E1]" /> Setup Guide
              </button>
            </div>

            {/* 3 Quick Feature Cards with interactive hover */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left pt-2">
              <div className="p-3.5 rounded-2xl bg-[#080C14] border border-white/8 card-interactive">
                <div className="flex items-center gap-2 text-white text-xs font-semibold mb-1">
                  <Zap className="w-3.5 h-3.5 text-[#CBD5E1]" /> Prompt Injection
                </div>
                <p className="text-[11px] text-[#8B95A7] leading-relaxed">
                  Stops jailbreaks, DAN commands &amp; system prompt exfiltration.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#080C14] border border-white/8 card-interactive">
                <div className="flex items-center gap-2 text-white text-xs font-semibold mb-1">
                  <Lock className="w-3.5 h-3.5 text-[#CBD5E1]" /> Zero-Trust PII
                </div>
                <p className="text-[11px] text-[#8B95A7] leading-relaxed">
                  Luhn payment cards, phone numbers, emails &amp; API keys auto-redacted.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#080C14] border border-white/8 card-interactive">
                <div className="flex items-center gap-2 text-white text-xs font-semibold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Real-Time Verdict
                </div>
                <p className="text-[11px] text-[#8B95A7] leading-relaxed">
                  Sub-second latency verification before prompts reach LLMs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── Message List with Smooth Entrance ─── */}
        {!isEmpty && (
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/6 text-xs text-[#8B95A7]">
              <span className="flex items-center gap-2 font-mono text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Protected Thread</span>
              </span>
              <button
                type="button"
                onClick={onResetChat}
                className="flex items-center gap-1 text-[11px] text-[#8B95A7] hover:text-white transition-colors cursor-pointer btn-premium"
              >
                <RotateCcw className="w-3 h-3" /> Clear Thread
              </button>
            </div>

            {messages.map((msg) => (
              <AIChatMessage
                key={msg.id}
                message={msg}
                onOpenAuth={onOpenAuth}
              />
            ))}
          </div>
        )}

        {/* ─── Dynamic Loading Status (Never a frozen screen) ─── */}
        {loading && (
          <div className="flex items-start gap-3 mb-5 animate-message-enter max-w-xl">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-1 shadow-sm">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>

            <div className="flex-1 rounded-2xl bg-[#090D15] border border-white/15 p-4 space-y-2 card-interactive">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-white transition-all duration-300">
                  {LOADING_MESSAGES[loadingMsgIdx]}
                </p>
                <span className="text-[10px] font-mono text-white/50 animate-pulse">
                  ACTIVE
                </span>
              </div>

              {/* Shimmer skeleton bar */}
              <div className="space-y-1.5 pt-1">
                <div className="h-1.5 w-full rounded-full skeleton-shimmer" />
                <div className="h-1.5 w-3/4 rounded-full skeleton-shimmer" />
              </div>
            </div>
          </div>
        )}

        {/* ─── General Error Banner ─── */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center justify-between gap-3 animate-message-enter">
            <span>{error}</span>
            {error.toLowerCase().includes('log in') && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-3 py-1 rounded-xl bg-white text-[#05070B] font-bold text-xs shadow-sm cursor-pointer shrink-0 btn-premium"
              >
                Log In
              </button>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ─── Fixed Bottom Gemini-Style AI Input ─── */}
      <div className="sticky bottom-0 z-20 px-3 sm:px-6 pt-2 pb-4 bg-gradient-to-t from-[#05070B] via-[#05070B]/95 to-transparent">
        <GeminiChatInput
          input={input}
          setInput={setInput}
          onSend={onSend}
          loading={loading}
          disabled={backendStatus === 'offline'}
          backendOffline={backendStatus === 'offline'}
        />
      </div>
    </div>
  );
}
