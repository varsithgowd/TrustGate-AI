import React from 'react';
import { ShieldCheck, AlertCircle, Loader2, Lock, ArrowRight } from 'lucide-react';
import RiskScore from './RiskScore';
import ThreatTags from './ThreatTags';
import RedactionTags from './RedactionTags';
import SanitizedPayload from './SanitizedPayload';
import BlockedAlert from './BlockedAlert';

function ScanResultSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Scanning indicator */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 card-interactive">
        <div className="relative w-10 h-10 shrink-0">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Analyzing security context...</p>
          <p className="text-xs text-[#8B95A7] mt-0.5">
            Running PII detection, injection analysis, and credential verification
          </p>
        </div>
      </div>
      {/* Skeleton blocks */}
      <div className="space-y-3">
        <div className="skeleton-shimmer h-16 rounded-2xl" />
        <div className="skeleton-shimmer h-8 rounded-xl" />
        <div className="skeleton-shimmer h-24 rounded-xl" />
      </div>
    </div>
  );
}

function EmptyState({ onOpenAuth: _onOpenAuth }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-in">
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center card-interactive">
          <ShieldCheck className="w-8 h-8 text-[#8B95A7]" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#05070B] border border-white/8 flex items-center justify-center">
          <span className="text-[9px] font-bold text-[#8B95A7]">AI</span>
        </div>
      </div>
      <h3 className="text-sm font-bold text-white mb-1">Analysis Ready</h3>
      <p className="text-xs text-[#8B95A7] leading-relaxed max-w-xs">
        Submit text on the left to run a full security scan — threat detection, PII redaction, and risk scoring in real-time.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-2.5 w-full max-w-xs text-left">
        {[
          'Prompt Injection',
          'PII Detection',
          'Secret Scanning',
          'Risk Scoring',
        ].map((label) => (
          <div key={label} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/7 card-interactive">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <span className="text-[11px] text-[#8B95A7]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ScanResult({ result, loading, error, onOpenAuth }) {
  if (loading) return <ScanResultSkeleton />;

  if (error) {
    const isAuth = error.toLowerCase().includes('log in') || error.toLowerCase().includes('auth');
    return (
      <div className="p-5 rounded-2xl bg-rose-500/8 border border-rose-500/25 animate-fade-in card-interactive">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-rose-300">Scan Error</p>
            <p className="text-xs text-rose-300/70 mt-1 leading-relaxed">{error}</p>
            {isAuth && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-white hover:underline transition-colors cursor-pointer btn-premium"
              >
                <Lock className="w-3.5 h-3.5" /> Authenticate now
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!result) return <EmptyState onOpenAuth={onOpenAuth} />;

  const { riskScore, riskLevel, threats, redactions, sanitizedText, action } = result;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-white" />
        <span className="text-xs font-semibold text-[#8B95A7] uppercase tracking-wider font-mono">
          Analysis Results
        </span>
      </div>

      {/* Blocked / Flagged alert */}
      <BlockedAlert action={action} riskLevel={riskLevel} />

      {/* Risk Score Ring with 800ms count-up */}
      <RiskScore riskScore={riskScore} riskLevel={riskLevel} />

      {/* Threats */}
      {threats?.length > 0 && <ThreatTags threats={threats} />}

      {/* Redactions */}
      {redactions?.length > 0 && <RedactionTags redactions={redactions} />}

      {/* Safe result */}
      {!threats?.length && !redactions?.length && action?.toUpperCase() !== 'BLOCK' && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/12 animate-fade-in card-interactive">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white">All Clear</p>
            <p className="text-xs text-[#8B95A7] mt-0.5">No threats, PII, or secrets detected in this content.</p>
          </div>
        </div>
      )}

      {/* Sanitized output */}
      <SanitizedPayload sanitizedText={sanitizedText} />

      {/* Action verdict */}
      {action && (
        <div className="flex items-center gap-2 pt-1 font-mono">
          <span className="text-[11px] text-[#8B95A7] uppercase tracking-wider font-medium">Recommended Action:</span>
          <span className="text-[11px] font-bold uppercase px-2.5 py-1 rounded-lg bg-white/8 text-white border border-white/15">
            {action}
          </span>
        </div>
      )}
    </div>
  );
}
