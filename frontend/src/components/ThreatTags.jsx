import React from 'react';
import { AlertTriangle, Zap, Database, ShieldAlert } from 'lucide-react';

const THREAT_CONFIGS = {
  'PROMPT_INJECTION': { label: 'Prompt Injection', icon: Zap, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/25' },
  'JAILBREAK': { label: 'Jailbreak Attempt', icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/25' },
  'DATA_EXFILTRATION': { label: 'Data Exfiltration', icon: Database, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/25' },
  'SQL_INJECTION': { label: 'SQL Injection', icon: Database, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/25' },
  'XSS': { label: 'XSS Attack', icon: Zap, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/25' },
  'DEFAULT': { label: null, icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25' },
};

export default function ThreatTags({ threats = [] }) {
  if (!threats || threats.length === 0) return null;

  return (
    <div>
      <p className="text-[11px] font-mono font-medium text-[#8B95A7] uppercase tracking-wider mb-2">
        Threats Detected
      </p>
      <div className="flex flex-wrap gap-2">
        {threats.map((threat, i) => {
          const key = threat?.toUpperCase?.() || 'DEFAULT';
          const cfg = THREAT_CONFIGS[key] || THREAT_CONFIGS.DEFAULT;
          const Icon = cfg.icon;
          return (
            <div
              key={i}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-mono border ${cfg.color} ${cfg.bg} ${cfg.border} animate-check-item card-interactive`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cfg.label || threat}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
