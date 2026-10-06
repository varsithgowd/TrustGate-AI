import React from 'react';
import { ShieldX, AlertTriangle } from 'lucide-react';

export default function BlockedAlert({ action, riskLevel }) {
  const isBlocked = action?.toUpperCase() === 'BLOCK' || action?.toUpperCase() === 'BLOCKED';
  const isFlag = action?.toUpperCase() === 'FLAG' || action?.toUpperCase() === 'FLAGGED';

  if (!isBlocked && !isFlag) return null;

  if (isBlocked) {
    return (
      <div className="p-4 rounded-2xl bg-rose-500/8 border border-rose-500/25 animate-intervention card-interactive">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-500/15 shrink-0 mt-0.5">
            <ShieldX className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider font-mono">
              Request Blocked by TrustGate
            </h4>
            <p className="text-xs text-[#CBD5E1] mt-1 leading-relaxed">
              Adversarial pattern or security policy violation detected. Execution halted.
              Risk classification: <span className="font-semibold text-rose-300 font-mono">{riskLevel || 'HIGH'}</span>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-amber-500/8 border border-amber-500/25 animate-intervention card-interactive">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-500/15 shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
            Content Flagged
          </h4>
          <p className="text-xs text-[#CBD5E1] mt-1 leading-relaxed">
            Potential anomalies detected. Verification recommended before processing.
          </p>
        </div>
      </div>
    </div>
  );
}
