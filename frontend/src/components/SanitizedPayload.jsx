import React, { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';

export default function SanitizedPayload({ sanitizedText }) {
  const [copied, setCopied] = useState(false);

  if (!sanitizedText) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sanitizedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="animate-fade-in space-y-1.5 pt-1">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-mono font-medium text-[#8B95A7] uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-white/80" /> Sanitized Output
        </p>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy sanitized text"
          title="Copy to clipboard"
          className="flex items-center gap-1.5 text-[11px] text-[#8B95A7] hover:text-white transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-white/5 btn-premium"
        >
          {copied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <div className="relative rounded-xl bg-[#05070B] border border-white/10 p-3.5 overflow-hidden card-interactive">
        {/* Subtle silver top sheen */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <pre className="text-xs text-white font-mono leading-relaxed whitespace-pre-wrap break-words selection:bg-white/20">
          {sanitizedText}
        </pre>
      </div>
    </div>
  );
}
