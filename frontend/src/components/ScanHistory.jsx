import React from 'react';
import { Clock, Trash2, ChevronRight, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

function RiskBadge({ riskLevel }) {
  const level = riskLevel?.toUpperCase();
  if (level === 'CRITICAL' || level === 'HIGH') {
    return (
      <span className="flex items-center gap-0.5 text-[9px] font-mono font-bold text-rose-400">
        <ShieldX className="w-2.5 h-2.5" />{level}
      </span>
    );
  }
  if (level === 'MEDIUM') {
    return (
      <span className="flex items-center gap-0.5 text-[9px] font-mono font-bold text-amber-400">
        <ShieldAlert className="w-2.5 h-2.5" />{level}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-0.5 text-[9px] font-mono font-bold text-emerald-400">
      <ShieldCheck className="w-2.5 h-2.5" />{level || 'LOW'}
    </span>
  );
}

function formatTimeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function ScanHistory({ history = [], onSelectHistory, onClearHistory }) {
  if (!history.length) {
    return (
      <div className="px-3 py-6 text-center">
        <Clock className="w-5 h-5 text-[#8B95A7]/40 mx-auto mb-2" />
        <p className="text-[11px] text-[#8B95A7]/60 font-mono">No scans yet</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between px-3 mb-1.5">
        <span className="text-[10px] font-mono text-[#8B95A7]/60 uppercase tracking-wider">Recent Scans</span>
        <button
          type="button"
          onClick={onClearHistory}
          aria-label="Clear scan history"
          title="Clear scan history"
          className="p-1 rounded-lg hover:bg-white/5 text-[#8B95A7]/50 hover:text-white transition-colors cursor-pointer btn-premium"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      <div className="space-y-1">
        {history.slice(0, 15).map((item) => (
          <button
            key={item.id}
            type="button"
            id={`history-item-${item.id}`}
            onClick={() => onSelectHistory(item)}
            className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/10 transition-all duration-150 group cursor-pointer"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-[#8B95A7] group-hover:text-white transition-colors truncate leading-snug">
                {item.inputSnippet}
              </p>
              <div className="flex items-center gap-2 mt-0.5 font-mono">
                <RiskBadge riskLevel={item.riskLevel} />
                <span className="text-[9px] text-[#8B95A7]/40">{formatTimeAgo(item.timestamp)}</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#8B95A7]/30 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
