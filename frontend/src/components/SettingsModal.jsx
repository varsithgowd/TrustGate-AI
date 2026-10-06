import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  Lock,
  User,
  Trash2,
  LogOut,
  Check,
} from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  initialTab = 'security',
  user,
  onLogout,
  onClearHistory,
  theme = 'white',
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [toggles, setToggles] = useState({
    trustgateProtection: true,
    promptInjection: true,
    piiRedaction: true,
    secretDetection: true,
    saveHistory: true,
    auditLogging: true,
  });
  const [historyCleared, setHistoryCleared] = useState(false);

  if (!isOpen) return null;

  const isWhite = theme === 'white';

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClearHistoryClick = () => {
    if (onClearHistory) onClearHistory();
    setHistoryCleared(true);
    setTimeout(() => setHistoryCleared(false), 2500);
  };

  const tabs = [
    { id: 'ai', label: 'AI Model', icon: Sparkles },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'account', label: 'Account', icon: User },
  ];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in ${
      isWhite ? 'bg-black/40' : 'bg-black/85'
    }`}>
      <div className={`relative w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl animate-page-enter ${
        isWhite
          ? 'bg-white/98 border border-[#7C3AED]/20 shadow-purple-950/10 text-[#0F0A1C]'
          : 'glass-panel border border-[#A78BFA]/25 shadow-black/95 text-white'
      }`}>
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-6 right-6 p-2 rounded-xl transition-colors cursor-pointer ${
            isWhite ? 'text-[#6B637B] hover:text-[#0F0A1C] hover:bg-black/5' : 'text-[#A8A0B8] hover:text-[#FFFFFF] hover:bg-white/5'
          }`}
          aria-label="Close settings"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="mb-6">
          <h2 className={`text-xl font-extrabold tracking-tight ${isWhite ? 'text-[#0F0A1C]' : 'text-[#FFFFFF]'}`}>
            TrustGate Settings
          </h2>
          <p className={`text-xs ${isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]'}`}>
            Configure AI models, security policies, and privacy preferences
          </p>
        </div>

        {/* Nav Tabs */}
        <div className={`flex items-center gap-1.5 p-1 rounded-2xl mb-6 overflow-x-auto border ${
          isWhite ? 'bg-[#FAFAFE] border-[#7C3AED]/12' : 'bg-white/[0.03] border border-white/8'
        }`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? isWhite
                      ? 'bg-[#7C3AED]/12 text-[#7C3AED] border border-[#7C3AED]/25 shadow-sm font-bold'
                      : 'bg-[#7C3AED]/25 text-[#FFFFFF] border border-[#A78BFA]/35 shadow-sm font-bold'
                    : isWhite
                    ? 'text-[#6B637B] hover:text-[#0F0A1C] hover:bg-black/5'
                    : 'text-[#A8A0B8] hover:text-[#FFFFFF] hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#7C3AED]' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
          {/* ─── 1. AI MODEL TAB ─── */}
          {activeTab === 'ai' && (
            <div className="space-y-4 animate-fade-in">
              <div className={`p-4 rounded-2xl space-y-3 border ${
                isWhite ? 'bg-[#FAFAFE] border-[#7C3AED]/15 shadow-sm' : 'glass-card border-[#A78BFA]/15'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                    <span className={`text-xs font-bold ${isWhite ? 'text-[#0F0A1C]' : 'text-[#FFFFFF]'}`}>Primary Model</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                    isWhite
                      ? 'bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#7C3AED]'
                      : 'bg-[#7C3AED]/15 border border-[#A78BFA]/30 text-[#A78BFA]'
                  }`}>
                    Connected
                  </span>
                </div>
                <p className={`text-xs ${isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]'}`}>
                  Currently serving requests via Google Gemini 3.8 Flash through the backend protected gateway.
                </p>
                <div className={`pt-2 grid grid-cols-2 gap-2 text-xs font-mono ${isWhite ? 'text-[#4B4459]' : 'text-[#A8A0B8]'}`}>
                  <div className={`p-2.5 rounded-xl border ${
                    isWhite ? 'bg-white border-[#7C3AED]/12' : 'bg-black/50 border-white/5'
                  }`}>
                    <span className={`text-[10px] block ${isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]/60'}`}>PROVIDER</span>
                    <span className={`font-semibold ${isWhite ? 'text-[#0F0A1C]' : 'text-[#FFFFFF]'}`}>Google Generative AI</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${
                    isWhite ? 'bg-white border-[#7C3AED]/12' : 'bg-black/50 border-white/5'
                  }`}>
                    <span className={`text-[10px] block ${isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]/60'}`}>LATENCY TARGET</span>
                    <span className={`font-semibold ${isWhite ? 'text-[#0F0A1C]' : 'text-[#FFFFFF]'}`}>&lt; 1500ms</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── 2. SECURITY TAB ─── */}
          {activeTab === 'security' && (
            <div className="space-y-3 animate-fade-in">
              {[
                {
                  key: 'trustgateProtection',
                  title: 'TrustGate Active Protection',
                  desc: 'Pre-flight safety inspection before any request reaches Gemini.',
                },
                {
                  key: 'promptInjection',
                  title: 'Prompt Injection Prevention',
                  desc: 'Identifies and blocks jailbreaks, override rules, and system prompt exfiltration.',
                },
                {
                  key: 'piiRedaction',
                  title: 'Zero-Trust PII Redaction',
                  desc: 'Automatically replaces emails, phone numbers, and Luhn credit cards with safe placeholders.',
                },
                {
                  key: 'secretDetection',
                  title: 'API Secret Detection',
                  desc: 'Redacts leaked tokens, API keys, and credential strings before downstream transmission.',
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className={`flex items-center justify-between gap-4 p-4 rounded-2xl border ${
                    isWhite ? 'bg-[#FAFAFE] border-[#7C3AED]/15 shadow-sm' : 'glass-card border-[#A78BFA]/15'
                  }`}
                >
                  <div className="space-y-0.5">
                    <h4 className={`text-xs font-bold ${isWhite ? 'text-[#0F0A1C]' : 'text-[#FFFFFF]'}`}>{item.title}</h4>
                    <p className={`text-[11px] leading-relaxed ${isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]'}`}>{item.desc}</p>
                  </div>
                  {/* Purple ON / Gray OFF toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggle(item.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                      toggles[item.key]
                        ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6]'
                        : isWhite
                        ? 'bg-slate-200'
                        : 'bg-white/10'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out mt-1 ml-1 ${
                        toggles[item.key] ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ─── 3. PRIVACY TAB ─── */}
          {activeTab === 'privacy' && (
            <div className="space-y-3 animate-fade-in">
              <div className={`flex items-center justify-between gap-4 p-4 rounded-2xl border ${
                isWhite ? 'bg-[#FAFAFE] border-[#7C3AED]/15 shadow-sm' : 'glass-card border-[#A78BFA]/15'
              }`}>
                <div className="space-y-0.5">
                  <h4 className={`text-xs font-bold ${isWhite ? 'text-[#0F0A1C]' : 'text-[#FFFFFF]'}`}>Conversation History</h4>
                  <p className={`text-[11px] ${isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]'}`}>Store previous chat prompts locally in browser storage.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('saveHistory')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                    toggles.saveHistory
                      ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6]'
                      : isWhite
                      ? 'bg-slate-200'
                      : 'bg-white/10'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 mt-1 ml-1 ${
                      toggles.saveHistory ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className={`flex items-center justify-between gap-4 p-4 rounded-2xl border ${
                isWhite ? 'bg-[#FAFAFE] border-[#7C3AED]/15 shadow-sm' : 'glass-card border-[#A78BFA]/15'
              }`}>
                <div className="space-y-0.5">
                  <h4 className={`text-xs font-bold ${isWhite ? 'text-[#0F0A1C]' : 'text-[#FFFFFF]'}`}>Security Audit Telemetry</h4>
                  <p className={`text-[11px] ${isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]'}`}>Record anonymized threat metrics and redaction counts for enterprise audits.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('auditLogging')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                    toggles.auditLogging
                      ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6]'
                      : isWhite
                      ? 'bg-slate-200'
                      : 'bg-white/10'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 mt-1 ml-1 ${
                      toggles.auditLogging ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className={`p-4 rounded-2xl flex items-center justify-between border ${
                isWhite ? 'bg-[#FAFAFE] border-[#7C3AED]/15 shadow-sm' : 'glass-card border-[#A78BFA]/15'
              }`}>
                <div>
                  <h4 className={`text-xs font-bold ${isWhite ? 'text-[#0F0A1C]' : 'text-[#FFFFFF]'}`}>Clear Chat History</h4>
                  <p className={`text-[11px] ${isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]'}`}>Remove all locally saved prompts and security verdicts.</p>
                </div>
                <button
                  type="button"
                  onClick={handleClearHistoryClick}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/25 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs font-semibold transition-all cursor-pointer"
                >
                  {historyCleared ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Cleared</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ─── 4. ACCOUNT TAB ─── */}
          {activeTab === 'account' && (
            <div className="space-y-3 animate-fade-in">
              <div className={`p-4 rounded-2xl space-y-3 border ${
                isWhite ? 'bg-[#FAFAFE] border-[#7C3AED]/15 shadow-sm' : 'glass-card border-[#A78BFA]/15'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#8B5CF6] border border-[#A78BFA]/40 flex items-center justify-center text-sm font-bold text-white shadow-sm shadow-[#7C3AED]/30">
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isWhite ? 'text-[#0F0A1C]' : 'text-[#FFFFFF]'}`}>{user?.email || 'Anonymous Guest'}</h4>
                    <span className="text-[10px] font-mono text-[#7C3AED] font-semibold">Enterprise Authenticated Session</span>
                  </div>
                </div>

                <div className={`pt-2 border-t flex items-center justify-between ${
                  isWhite ? 'border-[#7C3AED]/10' : 'border-white/6'
                }`}>
                  <span className={`text-xs ${isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]'}`}>Session Status: Active (JWT Verified)</span>
                  {user && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onLogout) onLogout();
                        onClose();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
