import React, { useRef, useEffect, useState } from 'react';
import {
  Loader2,
  Sparkles,
  Code2,
  BookOpen,
  FileText,
  RotateCcw,
} from 'lucide-react';
import AIChatMessage from './AIChatMessage';
import GeminiChatInput from './GeminiChatInput';
import TrustGateLogo from './TrustGateLogo';

const LOADING_MESSAGES = [
  'Scanning with TrustGate...',
  'Sending protected request to Gemini...',
  'Gemini is generating...',
];

const SUGGESTIONS = [
  {
    title: 'Explain quantum computing',
    desc: 'Break down superposition and qubits simply',
    icon: Sparkles,
    prompt: 'Explain quantum computing simply with real-world examples.',
  },
  {
    title: 'Review my code',
    desc: 'Check for security flaws and optimize logic',
    icon: Code2,
    prompt: 'Review this code snippet for security vulnerabilities and suggest best practices:\n\nfunction verify(user) { return user.role === "admin"; }',
  },
  {
    title: 'Help me learn JavaScript',
    desc: 'Master closures, async/await, and prototypes',
    icon: BookOpen,
    prompt: 'Help me understand asynchronous JavaScript, event loops, and Promises with clear examples.',
  },
  {
    title: 'Summarize a document',
    desc: 'Extract key takeaways and action items',
    icon: FileText,
    prompt: 'Please provide a structured summary with key takeaways from this technical document.',
  },
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
  theme = 'white',
}) {
  const messagesEndRef = useRef(null);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const isWhite = theme === 'white';

  // Auto-scroll to bottom smoothly on message change or loading state
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Progressive 3-stage loading states:
  // "Scanning with TrustGate..." -> "Sending protected request to Gemini..." -> "Gemini is generating..."
  useEffect(() => {
    if (!loading) {
      setLoadingMsgIdx(0);
      return;
    }
    setLoadingMsgIdx(0);
    const t1 = setTimeout(() => {
      setLoadingMsgIdx(1);
    }, 700);
    const t2 = setTimeout(() => {
      setLoadingMsgIdx(2);
    }, 1600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [loading]);

  const isEmpty = messages.length === 0;

  const handleSelectSuggestion = (prompt) => {
    setInput(prompt);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 relative animate-page-enter">
      {/* ─── Scrollable Chat Feed ─── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 max-w-4xl w-full mx-auto">
        {/* ─── Empty State: Centered AI Welcome Experience ─── */}
        {isEmpty && (
          <div className="py-10 sm:py-16 flex flex-col items-center text-center max-w-2xl mx-auto space-y-8 animate-fade-in">
            {/* Small TrustGate shield / AI icon with soft purple ambient glow */}
            <div className="relative">
              <div
                className="absolute -inset-6 rounded-full opacity-45 blur-2xl pointer-events-none"
                style={{
                  background: isWhite
                    ? 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(124,58,237,0.08) 50%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, rgba(124,58,237,0.18) 50%, transparent 70%)',
                }}
              />
              <div className={`relative w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl border ${
                isWhite
                  ? 'bg-white border-[#7C3AED]/20 shadow-purple-900/5'
                  : 'glass-card border-[#A78BFA]/30 shadow-2xl'
              }`}>
                <TrustGateLogo size={34} theme={theme} />
              </div>
            </div>

            {/* Headings with white backdrop & purple accent */}
            <div className="space-y-3">
              <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight ${
                isWhite ? 'text-[#0F0A1C]' : 'text-[#FFFFFF]'
              }`}>
                Your AI conversations,<br />
                <span className={
                  isWhite
                    ? 'bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#6D28D9] bg-clip-text text-transparent'
                    : 'bg-gradient-to-r from-[#FFFFFF] via-[#DDD6FE] to-[#A78BFA] bg-clip-text text-transparent'
                }>
                  protected by TrustGate.
                </span>
              </h2>
              <p className={`text-xs sm:text-sm max-w-md mx-auto leading-relaxed ${
                isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]'
              }`}>
                Chat with Gemini while TrustGate protects every interaction.
              </p>
            </div>

            {/* ─── 4 Suggestion Cards (Subtle frosted backgrounds & purple hover) ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full pt-4">
              {SUGGESTIONS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => handleSelectSuggestion(item.prompt)}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer group ${
                      isWhite
                        ? 'bg-white/95 border border-[#7C3AED]/12 shadow-sm hover:border-[#7C3AED]/35 hover:shadow-md hover:shadow-purple-900/5 hover:-translate-y-0.5'
                        : 'glass-card hover:border-[#A78BFA]/40 hover:shadow-lg hover:shadow-[#7C3AED]/15'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-all group-hover:scale-110 ${
                      isWhite
                        ? 'bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#7C3AED] group-hover:bg-[#7C3AED] group-hover:text-white'
                        : 'bg-[#7C3AED]/15 border border-[#A78BFA]/25 text-[#A78BFA] group-hover:text-white'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-xs font-bold transition-colors ${
                        isWhite ? 'text-[#0F0A1C] group-hover:text-[#7C3AED]' : 'text-[#FFFFFF] group-hover:text-[#A78BFA]'
                      }`}>
                        {item.title}
                      </h4>
                      <p className={`text-[11px] mt-0.5 line-clamp-1 ${
                        isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]'
                      }`}>
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Message List with Smooth Entrance ─── */}
        {!isEmpty && (
          <div className="space-y-3">
            <div className={`flex items-center justify-between pb-3 mb-2 border-b text-xs ${
              isWhite ? 'border-[#7C3AED]/10 text-[#6B637B]' : 'border-[#A78BFA]/10 text-[#A8A0B8]'
            }`}>
              <span className="font-mono text-[11px] flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                <span className={isWhite ? 'text-[#0F0A1C] font-semibold' : 'text-white'}>Protected Conversation</span>
              </span>
              <button
                type="button"
                onClick={onResetChat}
                className={`flex items-center gap-1 text-[11px] transition-colors cursor-pointer ${
                  isWhite ? 'text-[#6B637B] hover:text-[#0F0A1C]' : 'text-[#A8A0B8] hover:text-[#FFFFFF]'
                }`}
              >
                <RotateCcw className="w-3 h-3" /> Clear chat
              </button>
            </div>

            {messages.map((msg) => (
              <AIChatMessage
                key={msg.id}
                message={msg}
                onOpenAuth={onOpenAuth}
                onRegenerate={(prompt) => onSend(prompt)}
                theme={theme}
              />
            ))}
          </div>
        )}

        {/* ─── Dynamic Loading Status (3 Sequential States) ─── */}
        {loading && (
          <div className="flex items-start gap-3.5 mb-6 animate-message-enter max-w-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7C3AED]/30 to-[#8B5CF6]/40 border border-[#7C3AED]/35 flex items-center justify-center shrink-0 mt-1 shadow-sm shadow-[#7C3AED]/20">
              <Loader2 className="w-4 h-4 text-[#7C3AED] animate-spin" />
            </div>

            <div className={`flex-1 rounded-2xl p-4 space-y-2 border ${
              isWhite
                ? 'bg-white border-[#7C3AED]/20 shadow-md shadow-purple-900/5'
                : 'glass-card border-[#A78BFA]/25'
            }`}>
              <div className="flex items-center justify-between">
                <p className={`text-xs font-bold transition-all duration-300 ${
                  isWhite ? 'text-[#0F0A1C]' : 'text-[#FFFFFF]'
                }`}>
                  {LOADING_MESSAGES[loadingMsgIdx]}
                </p>
                <span className="text-[10px] font-mono text-[#7C3AED] font-bold animate-pulse">
                  ACTIVE
                </span>
              </div>

              {/* Shimmer skeleton bar with purple tint */}
              <div className="space-y-1.5 pt-1">
                <div className={`h-1.5 w-full rounded-full overflow-hidden relative ${
                  isWhite ? 'bg-[#7C3AED]/8' : 'bg-white/5'
                }`}>
                  <div className="absolute inset-0 skeleton-shimmer" />
                </div>
                <div className={`h-1.5 w-3/4 rounded-full overflow-hidden relative ${
                  isWhite ? 'bg-[#7C3AED]/8' : 'bg-white/5'
                }`}>
                  <div className="absolute inset-0 skeleton-shimmer" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── General Error Banner ─── */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs flex items-center justify-between gap-3 animate-message-enter">
            <span className="font-medium">{error}</span>
            {error.toLowerCase().includes('log in') && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white font-bold text-xs shadow-sm cursor-pointer shrink-0 hover:from-[#6D28D9] hover:to-[#7C3AED]"
              >
                Log In
              </button>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ─── Floating Bottom Chat Composer ─── */}
      <div className={`sticky bottom-0 z-20 px-4 sm:px-8 pt-3 pb-6 ${
        isWhite
          ? 'bg-gradient-to-t from-[#FAFAFE] via-[#FAFAFE]/95 to-transparent'
          : 'bg-gradient-to-t from-[#070509] via-[#070509]/95 to-transparent'
      }`}>
        <GeminiChatInput
          input={input}
          setInput={setInput}
          onSend={onSend}
          loading={loading}
          disabled={backendStatus === 'offline'}
          backendOffline={backendStatus === 'offline'}
          theme={theme}
        />
      </div>
    </div>
  );
}
