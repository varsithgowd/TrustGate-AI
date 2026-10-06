import React from 'react';
import { Eye, EyeOff, CreditCard, Phone, Mail, Key, Hash } from 'lucide-react';

const REDACTION_CONFIGS = {
  EMAIL: { label: 'Email Redacted', icon: Mail, color: 'text-white', bg: 'bg-white/5', border: 'border-white/15' },
  PHONE: { label: 'Phone Redacted', icon: Phone, color: 'text-white', bg: 'bg-white/5', border: 'border-white/15' },
  CARD: { label: 'Payment Card (Luhn)', icon: CreditCard, color: 'text-white', bg: 'bg-white/5', border: 'border-white/15' },
  API_KEY: { label: 'API Key Redacted', icon: Key, color: 'text-white', bg: 'bg-white/5', border: 'border-white/15' },
  SECRET: { label: 'Secret Redacted', icon: EyeOff, color: 'text-white', bg: 'bg-white/5', border: 'border-white/15' },
  SSN: { label: 'SSN Redacted', icon: Hash, color: 'text-white', bg: 'bg-white/5', border: 'border-white/15' },
  DEFAULT: { label: null, icon: Eye, color: 'text-white', bg: 'bg-white/5', border: 'border-white/15' },
};

export default function RedactionTags({ redactions = [] }) {
  if (!redactions || redactions.length === 0) return null;

  return (
    <div>
      <p className="text-[11px] font-mono font-medium text-[#8B95A7] uppercase tracking-wider mb-2">
        Redacted PII / Tokens
      </p>
      <div className="flex flex-wrap gap-2">
        {redactions.map((r, i) => {
          const key = r?.toUpperCase?.() || 'DEFAULT';
          const cfg = REDACTION_CONFIGS[key] || REDACTION_CONFIGS.DEFAULT;
          const Icon = cfg.icon;
          return (
            <div
              key={i}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-mono border ${cfg.color} ${cfg.bg} ${cfg.border} animate-check-item card-interactive`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <Icon className="w-3.5 h-3.5 text-[#CBD5E1]" />
              <span>{cfg.label || r}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
