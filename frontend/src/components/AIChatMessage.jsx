import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldX,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Code2,
} from 'lucide-react';
import RiskScore from './RiskScore';
import ThreatTags from './ThreatTags';
import RedactionTags from './RedactionTags';
import SanitizedPayload from './SanitizedPayload';
import BlockedAlert from './BlockedAlert';

export default function AIChatMessage({ message, onOpenAuth }) {
  const [copied, setCopied] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(true);
  const [rawJsonExpanded, setRawJsonExpanded] = useState(false);

  const { sender, text, result, timestamp, error } = message;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  // ─── USER MESSAGE ───
  if (sender === 'user') {
    return (
      <div className="flex items-start justify-end gap-3 mb-5 animate-message-enter">
        <div className="flex flex-col items-end max-w-2xl">
          <div className="flex items-center gap-2 mb-1.5 px-1">
            <span className="text-[11px] font-medium text-[#8B95A7]">You</span>
            <span className="text-[10px] text-[#8B95A7]/50 font-mono">{formattedTime}</span>
          </div>

          <div className="rounded-2xl rounded-tr-sm bg-[#0E131E] border border-white/10 px-4 py-3 text-sm text-[#F5F7FA] shadow-sm group relative card-interactive">
            <p className="whitespace-pre-wrap break-words leading-relaxed selection:bg-white/20">
              {text}
            </p>

            <button
              type="button"
              onClick={handleCopyPrompt}
              aria-label="Copy prompt text"
              title="Copy prompt"
              className="absolute top-2 right-2 p-1.5 rounded-lg text-[#8B95A7]/60 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer btn-premium"
            >
              {copied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0 text-xs font-bold text-white shadow-sm mt-5">
          U
        </div>
      </div>
    );
  }

  // ─── SYSTEM ERROR ───
  if (error) {
    const isAuth = error.toLowerCase().includes('log in') || error.toLowerCase().includes('auth');
    return (
      <div className="flex items-start gap-3 mb-5 animate-message-enter max-w-3xl">
        <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 mt-1">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
        </div>

        <div className="flex-1 rounded-2xl bg-[#120A0D] border border-rose-500/20 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">
              TrustGate System Notice
            </span>
            <span className="text-[10px] text-[#8B95A7]/50 font-mono ml-auto">{formattedTime}</span>
          </div>
          <p className="text-xs text-[#CBD5E1] leading-relaxed">{error}</p>
          {isAuth && (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#05070B] text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer mt-2 btn-premium"
            >
              Log in to authenticate
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─── TRUSTGATE GUARDIAN SECURITY VERDICT ───
  const { riskScore, riskLevel, threats, redactions, sanitizedText, action } = result || {};
  const isBlocked = action?.toUpperCase() === 'BLOCK' || action?.toUpperCase() === 'BLOCKED';
  const isFlagged = action?.toUpperCase() === 'FLAG' || action?.toUpperCase() === 'FLAGGED';

  const primaryThreat = threats && threats.length > 0 ? threats.join(', ') : 'Malicious Prompt Pattern';
  const displayRisk = `${riskLevel || 'HIGH'} (Score: ${riskScore !== undefined ? riskScore : 85}/100)`;

  return (
    <div className="flex items-start gap-3 mb-5 animate-message-enter max-w-3xl">
      {/* Guardian avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm border transition-all ${
          isBlocked
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            : isFlagged
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            : 'bg-white/10 border-white/20 text-white'
        }`}
      >
        {isBlocked ? (
          <ShieldX className="w-4 h-4 stroke-[2.5]" />
        ) : (
          <Check className="w-4 h-4 stroke-[2.5]" />
        )}
      </div>

      {/* Main Response Container */}
      <div className="flex-1 space-y-3 min-w-0">
        {/* Header line */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-tight text-white">
              TrustGate AI Guardian
            </span>
            <span
              className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${
                isBlocked
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : isFlagged
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-white/6 text-white border-white/15'
              }`}
            >
              {action || (isBlocked ? 'BLOCKED' : 'PASSED')}
            </span>
          </div>
          <span className="text-[10px] text-[#8B95A7]/50 font-mono">{formattedTime}</span>
        </div>

        {/* ─── DANGEROUS REQUEST (BLOCKED - REQUIREMENT 6) ─── */}
        {isBlocked ? (
          <div className="rounded-2xl bg-[#0D080A] border border-rose-500/25 p-5 space-y-4 shadow-lg shadow-black/60 animate-intervention card-interactive">
            
            {/* Sequential Blocked Details */}
            <div className="space-y-2 border-b border-rose-500/15 pb-4">
              <div className="flex items-center gap-2 text-rose-400 animate-check-item delay-1">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span className="text-base sm:text-lg font-extrabold tracking-wide">
                  ⚠ REQUEST STOPPED
                </span>
              </div>

              <div className="space-y-1.5 pt-1 text-xs sm:text-sm font-mono">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 animate-check-item delay-2">
                  <span className="text-[#8B95A7]">Threat:</span>
                  <span className="font-bold text-rose-300 font-sans">{primaryThreat}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 animate-check-item delay-3">
                  <span className="text-[#8B95A7]">Risk:</span>
                  <span className="font-bold text-rose-300 font-sans">{displayRisk}</span>
                </div>
                <div className="flex items-center gap-2 animate-check-item delay-4">
                  <span className="text-[#8B95A7]">Action:</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 font-bold uppercase tracking-wider text-xs border border-rose-500/30">
                    BLOCKED
                  </span>
                </div>
              </div>
            </div>

            {/* Expandable Explanation using real backend result */}
            <div className="animate-check-item delay-5">
              <button
                type="button"
                onClick={() => setDetailsExpanded(!detailsExpanded)}
                className="flex items-center justify-between w-full py-1 text-xs font-semibold text-[#8B95A7] hover:text-white transition-colors cursor-pointer"
              >
                <span>Forensic Breakdown &amp; Analysis</span>
                {detailsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {detailsExpanded && (
                <div className="mt-3 space-y-3 pt-2 border-t border-white/5 animate-fade-in">
                  <BlockedAlert action={action} riskLevel={riskLevel} />
                  <RiskScore riskScore={riskScore} riskLevel={riskLevel} />
                  {threats?.length > 0 && <ThreatTags threats={threats} />}
                  {redactions?.length > 0 && <RedactionTags redactions={redactions} />}
                  {sanitizedText && <SanitizedPayload sanitizedText={sanitizedText} />}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ─── SAFE REQUEST (REQUIREMENT 7) ─── */
          <div className="rounded-2xl bg-[#090D15] border border-white/12 p-5 space-y-4 shadow-lg shadow-black/40 animate-fade-in card-interactive">
            
            {/* Checked by TrustGate AI Header with Checkmark Animation */}
            <div className="space-y-3 pb-3 border-b border-white/8">
              <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-black animate-check-pop">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
                <span>✓ Checked by TrustGate AI</span>
              </div>

              {/* 4 Sequential Security Checks as requested */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono pt-1">
                {[
                  { label: 'Prompt Safety', delay: 'delay-1' },
                  { label: 'Sensitive Data', delay: 'delay-2' },
                  { label: 'AI Safety', delay: 'delay-3' },
                  { label: 'Trust', delay: 'delay-4' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/8 text-[#E2E8F0] font-semibold animate-check-item ${item.delay}`}
                  >
                    <span>{item.label}</span>
                    <span className="text-white font-bold">✓</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verdict Meta Pill */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] font-mono text-[#8B95A7]">Verdict:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-white/10 text-white border border-white/20 font-bold uppercase">
                {action || 'ALLOWED'}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-white/4 text-[#8B95A7] border border-white/8 font-mono">
                Risk Score: {typeof riskScore === 'number' ? riskScore : 0}/100 ({riskLevel || 'LOW'})
              </span>
            </div>

            {/* Redacted Data if any (e.g. Card, Email, Phone) */}
            {redactions?.length > 0 && (
              <div className="space-y-2 pt-2">
                <RedactionTags redactions={redactions} />
              </div>
            )}

            {/* Sanitized Payload if redacted */}
            {sanitizedText && sanitizedText !== text && (
              <div className="pt-1">
                <SanitizedPayload sanitizedText={sanitizedText} />
              </div>
            )}

            <p className="text-xs text-[#8B95A7] leading-relaxed pt-1">
              Your prompt complies with enterprise safety policies. Downstream model execution is permitted.
            </p>
          </div>
        )}

        {/* Raw JSON Telemetry Toggle */}
        <div className="pt-1 px-1">
          <button
            type="button"
            onClick={() => setRawJsonExpanded(!rawJsonExpanded)}
            className="flex items-center gap-1.5 text-[10px] font-mono text-[#8B95A7]/60 hover:text-white transition-colors cursor-pointer"
          >
            <Code2 className="w-3 h-3" />
            <span>{rawJsonExpanded ? 'Hide Raw Telemetry' : 'Inspect Raw Telemetry JSON'}</span>
            {rawJsonExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {rawJsonExpanded && (
            <div className="mt-2 p-3 rounded-xl bg-[#040609] border border-white/6 animate-fade-in">
              <pre className="text-[11px] font-mono text-[#CBD5E1] overflow-x-auto whitespace-pre">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
