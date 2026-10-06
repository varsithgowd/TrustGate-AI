import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export default function AIChatMessage({
  message,
  onOpenAuth,
  onRegenerate,
  theme = 'white',
}) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedAi, setCopiedAi] = useState(false);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState(null);
  const [whyBlockedOpen, setWhyBlockedOpen] = useState(false);
  const [sanitizedPreviewOpen, setSanitizedPreviewOpen] = useState(false);

  const isWhite = theme === 'white';

  const {
    sender,
    text,
    result,
    security,
    aiResponse,
    blocked,
    timestamp,
    error,
  } = message;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(text || '');
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {}
  };

  const handleCopyAi = async () => {
    try {
      await navigator.clipboard.writeText(aiResponse || '');
      setCopiedAi(true);
      setTimeout(() => setCopiedAi(false), 2000);
    } catch {}
  };

  const handleCopyCodeSnippet = async (codeSnippet, idx) => {
    try {
      await navigator.clipboard.writeText(codeSnippet);
      setCopiedCodeIdx(idx);
      setTimeout(() => setCopiedCodeIdx(null), 2000);
    } catch {}
  };

  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  // ─── 1. USER MESSAGE ───
  if (sender === 'user') {
    return (
      <div className="flex items-start justify-end gap-3 mb-6 animate-message-enter">
        <div className="flex flex-col items-end max-w-2xl">
          <div className="flex items-center gap-2 mb-1.5 px-1">
            <span className={`text-[11px] font-semibold ${isWhite ? 'text-[#0F0A1C]' : 'text-[#A8A0B8]'}`}>You</span>
            <span className={`text-[10px] font-mono ${isWhite ? 'text-[#6B637B]/70' : 'text-[#A8A0B8]/50'}`}>{formattedTime}</span>
          </div>

          <div className={`rounded-3xl rounded-tr-md px-5 py-3.5 text-sm group relative ${
            isWhite
              ? 'bg-[#F3E8FF] border border-[#DDD6FE] text-[#1E1035] shadow-sm'
              : 'bg-[#160D24]/90 border border-[#A78BFA]/20 text-[#FFFFFF] shadow-md shadow-black/40'
          }`}>
            <p className="whitespace-pre-wrap break-words leading-relaxed selection:bg-[#7C3AED]/30 font-medium">
              {text}
            </p>

            <button
              type="button"
              onClick={handleCopyPrompt}
              aria-label="Copy prompt"
              title="Copy prompt"
              className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer ${
                isWhite
                  ? 'text-[#6B637B] hover:text-[#0F0A1C] hover:bg-[#7C3AED]/10'
                  : 'text-[#A8A0B8] hover:text-[#FFFFFF] hover:bg-white/10'
              }`}
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5 text-[#7C3AED]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* User avatar with purple gradient */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] border border-[#A78BFA]/40 flex items-center justify-center shrink-0 text-xs font-bold text-white mt-5 shadow-sm shadow-[#7C3AED]/30">
          U
        </div>
      </div>
    );
  }

  // ─── 2. SYSTEM / AUTH ERROR NOTICE ───
  if (error && !security && !result) {
    const isAuth = error.toLowerCase().includes('log in') || error.toLowerCase().includes('auth');
    return (
      <div className="flex items-start gap-3 mb-6 animate-message-enter max-w-2xl">
        <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center shrink-0 mt-1">
          <ShieldAlert className="w-4 h-4 text-rose-500" />
        </div>

        <div className={`flex-1 rounded-2xl p-4 space-y-2 border ${
          isWhite ? 'bg-rose-50/70 border-rose-200 text-[#0F0A1C]' : 'bg-[#160A0E] border-rose-500/20 text-[#CBD5E1]'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-wide">
              TrustGate System Notice
            </span>
            <span className={`text-[10px] font-mono ml-auto ${isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]/50'}`}>{formattedTime}</span>
          </div>
          <p className="text-xs leading-relaxed">{error}</p>
          {isAuth && (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white text-xs font-bold hover:opacity-95 transition-all cursor-pointer mt-2"
            >
              Log in to authenticate
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─── 3. TRUSTGATE SECURITY + GEMINI AI ASSISTANT ───
  const sec = security || result || {};
  const { riskScore, riskLevel, threats, redactions, sanitizedText, action } = sec;
  const isBlocked = blocked || action?.toUpperCase() === 'BLOCKED' || action?.toUpperCase() === 'BLOCK';
  const isSanitized = action?.toUpperCase() === 'SANITIZED' || (redactions && redactions.length > 0);

  // Markdown renderer for Gemini responses with dark code block accents
  const renderFormattedAiResponse = (content) => {
    if (!content) return null;

    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const language = lines[0].match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : '';
        const codeContent = language ? lines.slice(1).join('\n') : lines.join('\n');

        return (
          <div key={index} className="my-3 rounded-2xl overflow-hidden border border-[#7C3AED]/25 bg-[#0B0810] shadow-xl">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.03]">
              <span className="text-[11px] font-mono text-[#A78BFA] uppercase font-semibold">
                {language || 'Code'}
              </span>
              <button
                type="button"
                onClick={() => handleCopyCodeSnippet(codeContent, index)}
                className="flex items-center gap-1 text-[11px] text-[#A8A0B8] hover:text-[#FFFFFF] transition-colors cursor-pointer"
              >
                {copiedCodeIdx === index ? (
                  <>
                    <Check className="w-3 h-3 text-[#A78BFA]" />
                    <span className="text-[#A78BFA]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-xs font-mono text-[#FFFFFF] leading-relaxed">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      return (
        <div key={index} className={`whitespace-pre-wrap leading-relaxed space-y-2 ${
          isWhite ? 'text-[#0F0A1C]' : 'text-[#FFFFFF]'
        }`}>
          {part}
        </div>
      );
    });
  };

  return (
    <div className="flex items-start gap-3.5 mb-8 animate-message-enter max-w-4xl">
      {/* Gemini Avatar with Purple Accent */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7C3AED]/25 to-[#8B5CF6]/35 border border-[#7C3AED]/35 flex items-center justify-center shrink-0 mt-1 shadow-sm shadow-[#7C3AED]/15">
        {isBlocked ? (
          <ShieldAlert className="w-4 h-4 text-rose-500" />
        ) : (
          <Sparkles className="w-4 h-4 text-[#7C3AED]" />
        )}
      </div>

      <div className="flex-1 space-y-3 min-w-0">
        {/* ─── Top Security Badge Bar (Distinct Semantic Colors) ─── */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2.5">
            <span className={`text-xs font-bold ${isWhite ? 'text-[#0F0A1C]' : 'text-[#FFFFFF]'}`}>Gemini</span>

            {/* Security Semantic Badges */}
            {isBlocked ? (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold ${
                isWhite
                  ? 'bg-rose-50 border border-rose-200 text-rose-700'
                  : 'bg-rose-500/10 border border-rose-500/25 text-rose-400'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span>🔴 Blocked · HIGH · 95/100</span>
              </span>
            ) : isSanitized ? (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold ${
                isWhite
                  ? 'bg-amber-50 border border-amber-200 text-amber-800'
                  : 'bg-amber-500/10 border border-amber-500/25 text-amber-300'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>🟡 Sanitized · MEDIUM · 50/100</span>
              </span>
            ) : (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold ${
                isWhite
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-300'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>🟢 Protected · LOW · 5/100</span>
              </span>
            )}
          </div>

          <span className={`text-[10px] font-mono ${isWhite ? 'text-[#6B637B]/70' : 'text-[#A8A0B8]/50'}`}>{formattedTime}</span>
        </div>

        {/* ─── CASE A: BLOCKED REQUEST (Security Intervention Panel) ─── */}
        {isBlocked ? (
          <div className={`rounded-3xl p-6 space-y-4 shadow-xl animate-fade-in ${
            isWhite
              ? 'bg-white border border-rose-200 shadow-rose-950/5'
              : 'glass-card border-rose-500/30 shadow-rose-950/20'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-rose-500">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-mono font-bold tracking-wider uppercase">
                    🛡 TRUSTGATE PROTECTION
                  </span>
                </div>
                <h3 className={`text-lg font-extrabold tracking-tight ${
                  isWhite ? 'text-[#0F0A1C]' : 'text-[#FFFFFF]'
                }`}>
                  Request blocked
                </h3>
              </div>

              <span className="px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-500 font-mono text-xs font-bold">
                Risk: 95 / 100
              </span>
            </div>

            <div className={`p-3.5 rounded-2xl space-y-2 border ${
              isWhite ? 'bg-rose-50/70 border-rose-200' : 'bg-black/50 border border-rose-500/20'
            }`}>
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-600">
                <AlertTriangle className="w-4 h-4" />
                <span>Prompt injection detected</span>
              </div>
              <p className={`text-xs leading-relaxed ${isWhite ? 'text-[#332233]' : 'text-[#CBD5E1]'}`}>
                The request was prevented before reaching Gemini. Downstream LLM execution was terminated to preserve enterprise security policies.
              </p>
            </div>

            {/* "Why was this blocked?" button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setWhyBlockedOpen(!whyBlockedOpen)}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  isWhite ? 'text-[#7C3AED] hover:text-[#6D28D9]' : 'text-[#A78BFA] hover:text-[#FFFFFF]'
                }`}
              >
                <span>Why was this blocked?</span>
                {whyBlockedOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {whyBlockedOpen && (
                <div className={`mt-3 p-4 rounded-2xl text-xs space-y-2.5 animate-fade-in border ${
                  isWhite ? 'bg-[#FAFAFE] border-[#7C3AED]/12 text-[#4B4459]' : 'bg-white/[0.02] border-white/8 text-[#A8A0B8]'
                }`}>
                  <p>
                    <strong className={isWhite ? 'text-[#0F0A1C]' : 'text-[#FFFFFF]'}>Security Engine Telemetry:</strong> An adversarial pattern was detected in your input matching known prompt extraction, rule-override, or DAN jailbreak signatures.
                  </p>
                  <p>
                    <strong className={isWhite ? 'text-[#0F0A1C]' : 'text-[#FFFFFF]'}>Action Enforced:</strong> The request was dropped by the TrustGate Security Engine. No text from this payload was forwarded to the Gemini API.
                  </p>
                  <div className={`pt-1 font-mono text-[11px] p-2.5 rounded-xl border ${
                    isWhite ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-rose-300/80 bg-black/60 border-rose-500/15'
                  }`}>
                    {sanitizedText || '[BLOCKED BY TRUSTGATE] Adversarial prompt injection detected.'}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ─── CASE B & C: SANITIZED OR SAFE REQUEST ─── */
          <div className="space-y-3">
            {/* Sanitized callout banner (if PII detected) */}
            {isSanitized && (
              <div className={`rounded-2xl p-4 space-y-2.5 animate-fade-in border ${
                isWhite
                  ? 'bg-amber-50/70 border-amber-200'
                  : 'glass-card border-amber-500/25'
              }`}>
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 text-xs font-bold ${
                    isWhite ? 'text-amber-800' : 'text-amber-300'
                  }`}>
                    <ShieldCheck className="w-4 h-4" />
                    <span>🛡 TrustGate protected your data</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSanitizedPreviewOpen(!sanitizedPreviewOpen)}
                    className={`text-[11px] font-semibold hover:underline cursor-pointer ${
                      isWhite ? 'text-[#7C3AED]' : 'text-[#A78BFA]'
                    }`}
                  >
                    {sanitizedPreviewOpen ? 'Hide details' : 'View redaction'}
                  </button>
                </div>

                <p className={`text-xs ${isWhite ? 'text-[#3E2A00]' : 'text-[#CBD5E1]'}`}>
                  Sensitive information was detected and redacted before reaching Gemini.
                </p>

                {sanitizedPreviewOpen && (
                  <div className={`p-3 rounded-xl border space-y-1.5 font-mono text-[11px] animate-fade-in ${
                    isWhite ? 'bg-white border-amber-200 text-[#4B4459]' : 'bg-black/50 border-white/8 text-[#A8A0B8]'
                  }`}>
                    <div>
                      <span className={isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]'}>Original Prompt: </span>
                      <span className={isWhite ? 'text-[#0F0A1C]' : 'text-[#FFFFFF]'}>{text}</span>
                    </div>
                    <div>
                      <span className={isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]'}>Protected Payload: </span>
                      <span className={isWhite ? 'text-amber-700 font-bold' : 'text-amber-300'}>{sanitizedText}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── REAL GEMINI AI RESPONSE ─── */}
            <div className={`rounded-3xl p-6 shadow-xl space-y-4 ${
              isWhite
                ? 'bg-white border border-[#7C3AED]/12 shadow-purple-950/5'
                : 'glass-card shadow-black/50'
            }`}>
              {aiResponse ? (
                <div className="text-sm leading-relaxed selection:bg-[#7C3AED]/30">
                  {renderFormattedAiResponse(aiResponse)}
                </div>
              ) : error ? (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-500">
                  <p className="font-semibold mb-1">Gemini API Service Notice</p>
                  <p>{error}</p>
                </div>
              ) : (
                <p className={`text-xs italic ${isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]'}`}>No response returned from Gemini.</p>
              )}

              {/* Action Toolbar: Copy, Regenerate */}
              {aiResponse && (
                <div className={`flex items-center gap-3 pt-3 border-t text-xs ${
                  isWhite ? 'border-[#7C3AED]/10 text-[#6B637B]' : 'border-white/6 text-[#A8A0B8]'
                }`}>
                  <button
                    type="button"
                    onClick={handleCopyAi}
                    className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isWhite ? 'hover:text-[#0F0A1C]' : 'hover:text-[#FFFFFF]'
                    }`}
                  >
                    {copiedAi ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#7C3AED]" />
                        <span className="text-[#7C3AED] font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  {onRegenerate && (
                    <button
                      type="button"
                      onClick={() => onRegenerate(text)}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer ml-2 ${
                        isWhite ? 'hover:text-[#0F0A1C]' : 'hover:text-[#FFFFFF]'
                      }`}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Regenerate</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
