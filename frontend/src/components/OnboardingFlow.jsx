import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Lock,
  Zap,
  EyeOff,
  Sliders,
  UserCheck,
  CheckCircle2,
  X,
  FileCode,
  Radio,
} from 'lucide-react';
import TrustGateLogo from './TrustGateLogo';

export const ONBOARDING_MODES = [
  {
    id: 'strict',
    title: 'Strict Enterprise Shield',
    badge: 'Recommended',
    description:
      'Zero-tolerance policy for prompt injections, jailbreaks, and heuristic anomalies. Aggressive redaction for all payment cards and PII.',
    icon: Shield,
    checks: ['Instant block on injection heuristics', 'Luhn-verified card masking', 'Zero data retention'],
  },
  {
    id: 'balanced',
    title: 'Balanced SaaS Guard',
    badge: 'Standard',
    description:
      'Ideal for production conversational chatbots and customer workflows. Redacts sensitive PII and flags ambiguous prompts without breaking user flow.',
    icon: ShieldCheck,
    checks: ['Real-time PII tokenization', 'Contextual prompt validation', 'Low-friction verification'],
  },
  {
    id: 'audit',
    title: 'Developer & Audit Mode',
    badge: 'Diagnostic',
    description:
      'Permissive mode tailored for AI engineering and red-teaming. Comprehensive forensic breakdown, risk scores, and telemetry inspection.',
    icon: Sliders,
    checks: ['Full threat score breakdown', 'Raw forensic payload review', 'High-telemetry logging'],
  },
];

export const ONBOARDING_PROFILES = [
  {
    id: 'secops',
    title: 'Security Engineer / SecOps',
    role: 'Threat Defense & Forensics',
    icon: ShieldAlert,
    desc: 'Monitor prompt injection vectors, investigate jailbreak attempts, and audit attack payloads.',
  },
  {
    id: 'developer',
    title: 'AI & LLM Application Developer',
    role: 'API Gateways & Sanitization',
    icon: FileCode,
    desc: 'Protect model endpoints, sanitize user inputs before LLM execution, and prevent credential leaks.',
  },
  {
    id: 'compliance',
    title: 'Compliance & Privacy Officer',
    role: 'GDPR / PCI-DSS / HIPAA',
    icon: Lock,
    desc: 'Enforce automatic payment card (Luhn), email, phone, and confidential token redaction.',
  },
  {
    id: 'enterprise',
    title: 'Enterprise Team Member',
    role: 'Conversational AI Safety',
    icon: UserCheck,
    desc: 'Interact with AI models with continuous, zero-trust automated privacy and security guardrails.',
  },
];

export default function OnboardingFlow({
  isOpen,
  onClose,
  onComplete,
  user,
  onOpenAuth,
  currentMode = 'strict',
  setProtectionMode,
  currentProfile = 'developer',
  setTrustProfile,
}) {
  const [step, setStep] = useState('landing');
  const [selectedMode, setSelectedMode] = useState(currentMode || 'strict');
  const [selectedProfile, setSelectedProfile] = useState(currentProfile || 'developer');

  if (!isOpen) return null;

  const handleFinish = () => {
    if (setProtectionMode) setProtectionMode(selectedMode);
    if (setTrustProfile) setTrustProfile(selectedProfile);
    try {
      localStorage.setItem('trustgate_protection_mode', selectedMode);
      localStorage.setItem('trustgate_trust_profile', selectedProfile);
      localStorage.setItem('trustgate_onboarded', 'true');
    } catch {}
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Background ambient moving light / grid */}
      <div className="fixed inset-0 security-grid pointer-events-none opacity-40" aria-hidden="true" />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle 600px at 50% 30%, rgba(255,255,255,0.03), transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Main container with subtle entrance */}
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#080C14] border border-white/12 p-5 sm:p-8 shadow-2xl shadow-black/90 my-auto text-[#F5F7FA] overflow-hidden animate-page-enter">
        
        {/* Top subtle silver line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Header bar with step progress and close */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/8">
          <div className="flex items-center gap-3">
            <TrustGateLogo size={28} showText textSize="text-sm sm:text-base font-bold" />
            <span className="hidden sm:inline-block text-[11px] font-mono text-[#8B95A7] px-2 py-0.5 rounded-full bg-white/4 border border-white/8">
              Guardian Setup
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Step progress pills */}
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#8B95A7]">
              {['landing', 'activation', 'introduction', 'protection_choice', 'trust_profile', 'enter_trustgate'].map(
                (s, i) => {
                  const stepNames = ['landing', 'activation', 'introduction', 'protection_choice', 'trust_profile', 'enter_trustgate'];
                  const currentIndex = stepNames.indexOf(step);
                  const isDone = i < currentIndex;
                  const isCurrent = i === currentIndex;
                  return (
                    <span
                      key={s}
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        isCurrent
                          ? 'w-6 bg-white'
                          : isDone
                          ? 'w-2 bg-white/50'
                          : 'w-1.5 bg-white/15'
                      }`}
                    />
                  );
                }
              )}
            </div>

            {/* Close button with micro-interaction */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#8B95A7] hover:text-white hover:bg-white/8 transition-colors cursor-pointer btn-premium"
              aria-label="Close setup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ──────── STEP 1: LANDING ──────── */}
        {step === 'landing' && (
          <div className="space-y-6 animate-page-enter">
            {/* Hero badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/15 text-white text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-white/80" />
              <span>Next-Gen Enterprise Security Gateway</span>
            </div>

            {/* Title & Tagline */}
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                TrustGate AI
              </h1>
              <p className="text-base sm:text-lg font-medium text-[#CBD5E1] mt-1">
                AI Security &amp; Privacy Guardian
              </p>
              <p className="text-sm text-[#8B95A7] mt-3 leading-relaxed max-w-xl">
                Inspect, sanitize, and verify every prompt before it reaches large language models.
                Real-time prompt injection defense, zero-trust PII redaction, and enterprise safety guardrails.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 card-interactive">
                <div className="w-8 h-8 rounded-xl bg-white/8 text-white flex items-center justify-center mb-3">
                  <Zap className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-semibold text-white">Injection Defense</h2>
                <p className="text-xs text-[#8B95A7] mt-1 leading-relaxed">
                  Neutralizes DAN, jailbreaks, system overrides, and exfiltration prompts.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 card-interactive">
                <div className="w-8 h-8 rounded-xl bg-white/8 text-white flex items-center justify-center mb-3">
                  <EyeOff className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-semibold text-white">PII &amp; Card Masking</h2>
                <p className="text-xs text-[#8B95A7] mt-1 leading-relaxed">
                  Luhn-validated card numbers, emails, phone numbers &amp; API keys auto-redacted.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 card-interactive">
                <div className="w-8 h-8 rounded-xl bg-white/8 text-white flex items-center justify-center mb-3">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-semibold text-white">Real-Time Guardrails</h2>
                <p className="text-xs text-[#8B95A7] mt-1 leading-relaxed">
                  Sub-second latency verification with real ALLOW, FLAG, or BLOCK verdicts.
                </p>
              </div>
            </div>

            {/* Bottom Actions with Sheen CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleFinish}
                className="text-xs text-[#8B95A7] hover:text-white transition-colors cursor-pointer order-2 sm:order-1"
              >
                Skip directly to AI Chat →
              </button>

              <button
                type="button"
                id="onboarding-get-started-btn"
                onClick={() => setStep('activation')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-[#05070B] font-bold text-sm border border-white/30 shadow-lg shadow-white/10 cursor-pointer btn-premium btn-sheen order-1 sm:order-2"
              >
                <span>GET STARTED</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ──────── STEP 2: TRUSTGATE ACTIVATION ──────── */}
        {step === 'activation' && (
          <div className="space-y-6 animate-page-enter">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/15 text-white">
                <Radio className="w-5 h-5 animate-calm-pulse" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">TrustGate Activation</h2>
                <p className="text-xs text-[#8B95A7]">
                  Calibrating neural security telemetry and scanning nodes
                </p>
              </div>
            </div>

            {/* Cyber Activation Sequence Box */}
            <div className="rounded-2xl bg-[#060A10] border border-white/10 p-5 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[#8B95A7] pb-2 border-b border-white/6">
                <span className="flex items-center gap-2 text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-calm-pulse" />
                  INITIALIZING GUARDIAN CORE
                </span>
                <span className="text-white font-bold">100% ONLINE</span>
              </div>

              {[
                { title: 'Zero-Trust Neural Interceptor', desc: 'Active prompt gateway listening on port 5000', status: 'ARMED' },
                { title: 'Luhn Credit Card & PII Matrix', desc: '13–19 digit card pattern matching & Luhn checksum verification', status: 'READY' },
                { title: 'Heuristic Prompt Injection Shield', desc: 'Adversarial jailbreak heuristics & role-play detectors loaded', status: 'ACTIVE' },
                { title: 'Response & Latency Telemetry', desc: 'Average verification latency < 15ms per payload', status: 'SYNCHRONIZED' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 card-interactive">
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white font-sans">{item.title}</p>
                    <p className="text-[11px] text-[#8B95A7] mt-0.5">{item.desc}</p>
                  </div>
                  <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded bg-white/10 border border-white/15">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('landing')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium text-[#8B95A7] hover:text-white hover:bg-white/5 transition-colors cursor-pointer btn-premium"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <button
                type="button"
                id="onboarding-activation-next-btn"
                onClick={() => setStep('introduction')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#05070B] font-bold text-xs shadow-md shadow-white/10 cursor-pointer btn-premium btn-sheen"
              >
                Continue to Introduction <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ──────── STEP 3: TRUSTGATE INTRODUCTION ──────── */}
        {step === 'introduction' && (
          <div className="space-y-6 animate-page-enter">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">TrustGate Introduction</h2>
              <p className="text-xs text-[#8B95A7] mt-1">
                Understanding how TrustGate safeguards generative AI interactions
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 flex items-start gap-4 card-interactive">
                <div className="p-2.5 rounded-xl bg-white/5 text-white border border-white/15 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Prompt Injection &amp; Jailbreak Interception</h3>
                  <p className="text-xs text-[#8B95A7] mt-1 leading-relaxed">
                    Adversarial prompts attempting to override system constraints, extract sensitive instructions, or jailbreak safety filters are intercepted and marked with <code className="text-white font-mono bg-white/10 px-1 py-0.5 rounded">ACTION: BLOCKED</code>.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 flex items-start gap-4 card-interactive">
                <div className="p-2.5 rounded-xl bg-white/5 text-white border border-white/15 shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Zero-Trust PII &amp; Sensitive Token Redaction</h3>
                  <p className="text-xs text-[#8B95A7] mt-1 leading-relaxed">
                    Credit cards (validated with the Luhn algorithm), phone numbers, email addresses, and API credentials are substituted with anonymized tokens such as <code className="text-white font-mono bg-white/10 px-1 py-0.5 rounded">[REDACTED_CARD]</code> so downstream models never receive raw secrets.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 flex items-start gap-4 card-interactive">
                <div className="p-2.5 rounded-xl bg-white/5 text-white border border-white/15 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Auditable Trust Telemetry</h3>
                  <p className="text-xs text-[#8B95A7] mt-1 leading-relaxed">
                    Every evaluated prompt produces an auditable security record with numerical risk scores, threat tags, and a 4-point conversational safety checklist before passing to AI models.
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('activation')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium text-[#8B95A7] hover:text-white hover:bg-white/5 transition-colors cursor-pointer btn-premium"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <button
                type="button"
                id="onboarding-intro-next-btn"
                onClick={() => setStep('protection_choice')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#05070B] font-bold text-xs shadow-md shadow-white/10 cursor-pointer btn-premium btn-sheen"
              >
                Protection Choice <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ──────── STEP 4: PROTECTION CHOICE ──────── */}
        {step === 'protection_choice' && (
          <div className="space-y-6 animate-page-enter">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Protection Choice</h2>
              <p className="text-xs text-[#8B95A7] mt-1">
                Choose the security enforcement level for your TrustGate Guardian
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {ONBOARDING_MODES.map((mode) => {
                const Icon = mode.icon;
                const isSelected = selectedMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSelectedMode(mode.id)}
                    className={`p-4 rounded-2xl text-left transition-all duration-180 border cursor-pointer relative card-interactive ${
                      isSelected
                        ? 'bg-white/[0.08] border-white text-white shadow-lg shadow-black/50'
                        : 'bg-white/[0.02] border-white/8 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-white text-[#05070B]'
                              : 'bg-white/5 text-[#8B95A7]'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-white">{mode.title}</h3>
                            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-white/20 bg-white/5 text-[#CBD5E1]">
                              {mode.badge}
                            </span>
                          </div>
                          <p className="text-xs text-[#8B95A7] mt-1 leading-relaxed">
                            {mode.description}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                          isSelected
                            ? 'bg-white border-white text-[#05070B]'
                            : 'border-white/20 bg-transparent'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('introduction')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium text-[#8B95A7] hover:text-white hover:bg-white/5 transition-colors cursor-pointer btn-premium"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <button
                type="button"
                id="onboarding-mode-next-btn"
                onClick={() => setStep('trust_profile')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#05070B] font-bold text-xs shadow-md shadow-white/10 cursor-pointer btn-premium btn-sheen"
              >
                Trust Profile <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ──────── STEP 5: TRUST PROFILE ──────── */}
        {step === 'trust_profile' && (
          <div className="space-y-6 animate-page-enter">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Trust Profile</h2>
              <p className="text-xs text-[#8B95A7] mt-1">
                Select your primary operational role to customize telemetry focus
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ONBOARDING_PROFILES.map((prof) => {
                const Icon = prof.icon;
                const isSelected = selectedProfile === prof.id;
                return (
                  <button
                    key={prof.id}
                    type="button"
                    onClick={() => setSelectedProfile(prof.id)}
                    className={`p-4 rounded-2xl text-left transition-all duration-180 border cursor-pointer card-interactive ${
                      isSelected
                        ? 'bg-white/[0.08] border-white text-white shadow-lg shadow-black/50'
                        : 'bg-white/[0.02] border-white/8 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white text-black' : 'bg-white/5 text-[#8B95A7]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-white truncate">{prof.title}</h3>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                        </div>
                        <p className="text-[11px] text-[#CBD5E1] font-mono mt-0.5">{prof.role}</p>
                        <p className="text-[11px] text-[#8B95A7] mt-1 leading-snug">{prof.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('protection_choice')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium text-[#8B95A7] hover:text-white hover:bg-white/5 transition-colors cursor-pointer btn-premium"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <button
                type="button"
                id="onboarding-profile-next-btn"
                onClick={() => setStep('enter_trustgate')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#05070B] font-bold text-xs shadow-md shadow-white/10 cursor-pointer btn-premium btn-sheen"
              >
                Enter TrustGate <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ──────── STEP 6: ENTER TRUSTGATE ──────── */}
        {step === 'enter_trustgate' && (
          <div className="space-y-6 animate-page-enter">
            <div className="text-center py-2">
              <div className="inline-flex p-3 rounded-3xl bg-white/5 border border-white/20 text-white mb-3 shadow-lg shadow-white/5">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-extrabold text-white">TrustGate AI Guardian Armed</h2>
              <p className="text-xs text-[#8B95A7] mt-1 max-w-md mx-auto">
                Your configuration is active. You are now prepared to test prompts with real-time cybersecurity protection.
              </p>
            </div>

            {/* Summary card */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/8 p-4 space-y-2.5 card-interactive">
              <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                <span className="text-[#8B95A7]">Protection Mode:</span>
                <span className="font-semibold text-white">
                  {ONBOARDING_MODES.find((m) => m.id === selectedMode)?.title || 'Strict Enterprise Shield'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                <span className="text-[#8B95A7]">Trust Profile:</span>
                <span className="font-semibold text-white">
                  {ONBOARDING_PROFILES.find((p) => p.id === selectedProfile)?.title || 'AI Developer'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-[#8B95A7]">Authentication State:</span>
                {user ? (
                  <span className="font-semibold text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Logged In ({user.email})
                  </span>
                ) : (
                  <span className="text-[#CBD5E1] text-[11px] font-mono">
                    Guest (Login required for live backend scans)
                  </span>
                )}
              </div>
            </div>

            {/* Auth note if not logged in */}
            {!user && (
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/12 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-left">
                  <p className="text-xs font-semibold text-white">Authentication Required for Scans</p>
                  <p className="text-[11px] text-[#8B95A7]">
                    You can sign in now with 1-click Quick Demo or log in later in chat.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="px-3.5 py-1.5 rounded-xl bg-white text-[#05070B] text-xs font-bold transition-all cursor-pointer shrink-0 btn-premium"
                >
                  Log In / Register Now
                </button>
              </div>
            )}

            {/* Final CTA Buttons */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('trust_profile')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium text-[#8B95A7] hover:text-white hover:bg-white/5 transition-colors cursor-pointer btn-premium"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <button
                type="button"
                id="enter-trustgate-btn"
                onClick={handleFinish}
                className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-white text-[#05070B] font-bold text-sm shadow-xl shadow-white/15 cursor-pointer btn-premium btn-sheen"
              >
                Enter TrustGate AI Chat <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
