import React, { useRef, useEffect } from 'react';
import { Send, Loader2, Shield } from 'lucide-react';
import TestButtons from './TestButtons';

export default function ScanInput({ input, setInput, onScan, loading, disabled }) {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 220)}px`;
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !loading && !disabled && input.trim()) {
      e.preventDefault();
      onScan(input);
    }
  };

  const handleSelectPreset = (text) => {
    setInput(text);
    textareaRef.current?.focus();
  };

  const canSend = input.trim().length > 0 && !loading && !disabled;

  return (
    <div className="flex flex-col gap-4">
      {/* Quick test scenarios */}
      <TestButtons onSelectPreset={handleSelectPreset} disabled={loading || disabled} />

      {/* AI Input Box with silver glow */}
      <div className={`rounded-2xl ai-input-wrapper ${loading ? 'ai-input-processing' : ''}`}>
        <div className="rounded-2xl overflow-hidden bg-[#080D14] border border-white/10">
          {/* Top label bar */}
          <div className="flex items-center gap-2 px-4 pt-3.5 pb-2 border-b border-white/6">
            <Shield className="w-3.5 h-3.5 text-white/80" />
            <span className="text-[11px] font-mono font-medium text-[#8B95A7] tracking-wider uppercase">
              Security Analysis Payload
            </span>
            {loading && (
              <span className="ml-auto text-[11px] text-white flex items-center gap-1.5 font-mono">
                <Loader2 className="w-3 h-3 animate-spin" /> Scanning...
              </span>
            )}
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            id="security-scan-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading || disabled}
            rows={4}
            spellCheck={false}
            placeholder={
              disabled
                ? 'Backend offline — check server status...'
                : 'Paste text to analyze for threats, PII, secrets, or prompt injection...'
            }
            aria-label="Text to scan for security threats"
            className="w-full bg-transparent px-4 pt-3 pb-2 text-sm text-[#F5F7FA] placeholder-[#8B95A7]/40 resize-none focus:outline-none leading-relaxed disabled:opacity-40 disabled:cursor-not-allowed selection:bg-white/20 selection:text-white"
            style={{ minHeight: '120px', maxHeight: '220px' }}
          />

          {/* Bottom action bar */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/6">
            <div className="text-[11px] text-[#8B95A7]/60 font-mono">
              {input.length > 0 ? (
                <span>{input.length.toLocaleString()} chars</span>
              ) : (
                <span>⌘+Enter to scan</span>
              )}
            </div>

            <button
              type="button"
              id="scan-submit-btn"
              disabled={!canSend}
              onClick={() => onScan(input)}
              aria-label="Start security scan"
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all duration-180 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed bg-white text-[#05070B] hover:bg-slate-100 shadow-md shadow-white/10 btn-premium btn-sheen"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Scanning
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Scan
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Disabled Hint */}
      {disabled && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/6 border border-rose-500/20 text-rose-300 text-xs animate-fade-in font-mono">
          <Shield className="w-4 h-4 shrink-0" />
          Backend server is offline. Run <code className="bg-white/8 px-1 py-0.5 rounded text-xs mx-1 text-white">node server.js</code> to start.
        </div>
      )}
    </div>
  );
}
