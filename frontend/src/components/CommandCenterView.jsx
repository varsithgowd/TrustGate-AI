import React from 'react';
import {
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  Sliders,
  Lock,
} from 'lucide-react';
import DashboardPanel from './DashboardPanel';
import { ONBOARDING_MODES, ONBOARDING_PROFILES } from './OnboardingFlow';

export default function CommandCenterView({
  onSwitchToChat,
  protectionMode = 'strict',
  setProtectionMode,
  trustProfile = 'developer',
  history = [],
  backendStatus = 'online',
}) {
  const currentModeObj =
    ONBOARDING_MODES.find((m) => m.id === protectionMode) || ONBOARDING_MODES[0];
  const currentProfileObj =
    ONBOARDING_PROFILES.find((p) => p.id === trustProfile) || ONBOARDING_PROFILES[0];

  const threatsInSession = history.filter(
    (h) => h.action?.toUpperCase() === 'BLOCK' || h.action?.toUpperCase() === 'BLOCKED'
  ).length;

  const redactionsInSession = history.filter(
    (h) => h.result?.redactions && h.result.redactions.length > 0
  ).length;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-7xl w-full mx-auto animate-page-enter">
      
      {/* ─── Top Command Center Hero Header ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#080D14] border border-white/10 shadow-2xl shadow-black/60 card-interactive">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-calm-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#CBD5E1] font-semibold">
              Security Operations Telemetry
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            TrustGate Security Command Center
          </h1>
          <p className="text-xs text-[#8B95A7]">
            Real-time heuristic threat telemetry, audit logging, and automated policy enforcement.
          </p>
        </div>

        {/* CTA to return to AI Chat */}
        <button
          type="button"
          onClick={onSwitchToChat}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-[#05070B] text-xs font-bold shadow-md shadow-white/10 transition-all cursor-pointer btn-premium btn-sheen shrink-0"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Launch AI Chat</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ─── Live Telemetry Stats Strip ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#080D14] border border-white/7 card-interactive">
          <span className="text-[10px] font-mono text-[#8B95A7] uppercase">Local Scans</span>
          <p className="text-xl font-bold text-white mt-1">{history.length}</p>
          <span className="text-[10px] text-[#CBD5E1] font-mono">Stored in session</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#080D14] border border-white/7 card-interactive">
          <span className="text-[10px] font-mono text-[#8B95A7] uppercase">Threats Blocked</span>
          <p className="text-xl font-bold text-rose-400 mt-1">{threatsInSession}</p>
          <span className="text-[10px] text-rose-400/80 font-mono">Injections / Jailbreaks</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#080D14] border border-white/7 card-interactive">
          <span className="text-[10px] font-mono text-[#8B95A7] uppercase">Redacted Payloads</span>
          <p className="text-xl font-bold text-amber-300 mt-1">{redactionsInSession}</p>
          <span className="text-[10px] text-amber-300/80 font-mono">Cards (Luhn), PII</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#080D14] border border-white/7 card-interactive">
          <span className="text-[10px] font-mono text-[#8B95A7] uppercase">Backend Status</span>
          <p className="text-xl font-bold text-emerald-400 mt-1 capitalize">{backendStatus}</p>
          <span className="text-[10px] text-[#CBD5E1] font-mono">Port 5000 · Atlas Connected</span>
        </div>
      </div>

      {/* ─── Secondary Dashboard Panel (Threat Chart & Metrics) ─── */}
      <DashboardPanel />

      {/* ─── Policy Configuration & Profile Overview ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Active Policy Card */}
        <div className="p-5 rounded-3xl bg-[#080D14] border border-white/8 space-y-3 card-interactive">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-white" />
              <h3 className="text-sm font-bold text-white">Active Security Policy</h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-white/20 bg-white/5 text-[#CBD5E1]">
              {currentModeObj.badge}
            </span>
          </div>

          <p className="text-xs font-semibold text-white">{currentModeObj.title}</p>
          <p className="text-xs text-[#8B95A7] leading-relaxed">{currentModeObj.description}</p>

          <div className="pt-2 border-t border-white/5 space-y-1.5 text-xs text-[#8B95A7]">
            {currentModeObj.checks.map((chk, i) => (
              <div key={i} className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{chk}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <span className="text-[11px] text-[#8B95A7] block mb-2 font-mono">Switch Policy:</span>
            <div className="flex flex-wrap gap-2">
              {ONBOARDING_MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    if (setProtectionMode) setProtectionMode(m.id);
                    try { localStorage.setItem('trustgate_protection_mode', m.id); } catch {}
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer border btn-premium ${
                    protectionMode === m.id
                      ? 'bg-white text-black font-bold border-white'
                      : 'bg-white/4 text-[#8B95A7] border-white/8 hover:text-white'
                  }`}
                >
                  {m.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Profile & Telemetry Rules */}
        <div className="p-5 rounded-3xl bg-[#080D14] border border-white/8 space-y-3 card-interactive">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-white" />
              <h3 className="text-sm font-bold text-white">Configured Persona</h3>
            </div>
            <span className="text-[10px] font-mono text-[#CBD5E1] px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
              {currentProfileObj.role}
            </span>
          </div>

          <p className="text-xs font-semibold text-white">{currentProfileObj.title}</p>
          <p className="text-xs text-[#8B95A7] leading-relaxed">{currentProfileObj.desc}</p>

          <div className="pt-3 border-t border-white/5 space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-[#8B95A7]">Prompt Injection Rule Engine</span>
              <span className="text-white font-mono text-[11px] font-semibold">Active · High Strictness</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-[#8B95A7]">Luhn Algorithm Card Scanner</span>
              <span className="text-white font-mono text-[11px] font-semibold">Enabled · [REDACTED_CARD]</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-[#8B95A7]">Contact &amp; Secret Redactor</span>
              <span className="text-emerald-400 font-mono text-[11px] font-semibold">Enabled · [REDACTED_PHONE]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
