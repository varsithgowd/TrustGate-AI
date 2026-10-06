import React from 'react';
import { Check } from 'lucide-react';

export function SecurityStatusBadge({ status = 'protected' }) {
  const configs = {
    protected: {
      label: 'PROTECTED',
      dot: 'bg-emerald-400',
      textColor: 'text-white',
      bg: 'bg-white/5',
      border: 'border-white/15',
    },
    scanning: {
      label: 'SCANNING',
      dot: 'bg-white',
      textColor: 'text-white',
      bg: 'bg-white/5',
      border: 'border-white/15',
    },
    warning: {
      label: 'ATTENTION',
      dot: 'bg-amber-400',
      textColor: 'text-amber-300',
      bg: 'bg-amber-500/8',
      border: 'border-amber-500/25',
    },
    blocked: {
      label: 'BLOCKED',
      dot: 'bg-rose-400',
      textColor: 'text-rose-300',
      bg: 'bg-rose-500/8',
      border: 'border-rose-500/25',
    },
    offline: {
      label: 'OFFLINE',
      dot: 'bg-slate-500',
      textColor: 'text-slate-400',
      bg: 'bg-white/3',
      border: 'border-white/8',
    },
  };

  const config = configs[status] || configs.protected;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-mono font-semibold tracking-wider ${config.bg} ${config.border} ${config.textColor}`}
      role="status"
      aria-label={config.label}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-calm-pulse shrink-0`} />
      <span>{config.label}</span>
    </div>
  );
}

export function SecurityCheckRow({ label, passed = true, pending = false }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className={`text-xs ${pending ? 'text-[#8B95A7]' : passed ? 'text-[#F5F7FA]' : 'text-rose-400'}`}>
        {label}
      </span>
      {pending ? (
        <span className="h-1.5 w-1.5 rounded-full bg-[#8B95A7]/40 animate-pulse" />
      ) : passed ? (
        <span className="text-xs font-medium text-white flex items-center gap-1">
          <Check className="w-3 h-3 stroke-[2.5]" />
          Passed
        </span>
      ) : (
        <span className="text-xs font-medium text-rose-400">Blocked</span>
      )}
    </div>
  );
}
