import React, { useState, useEffect } from 'react';

const RISK_CONFIG = {
  CRITICAL: { label: 'CRITICAL', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', ring: 'stroke-rose-400', numeric: 95 },
  HIGH: { label: 'HIGH', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', ring: 'stroke-rose-400', numeric: 75 },
  MEDIUM: { label: 'MEDIUM', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', ring: 'stroke-amber-400', numeric: 50 },
  LOW: { label: 'LOW', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', ring: 'stroke-emerald-400', numeric: 20 },
  NONE: { label: 'NONE', color: 'text-white', bg: 'bg-white/10', border: 'border-white/20', ring: 'stroke-white', numeric: 5 },
};

export default function RiskScore({ riskScore, riskLevel }) {
  const level = riskLevel?.toUpperCase() || 'NONE';
  const config = RISK_CONFIG[level] || RISK_CONFIG.NONE;
  const targetScore = typeof riskScore === 'number' ? riskScore : config.numeric;

  // Animated count-up from 0 to targetScore over 800ms
  const [displayScore, setDisplayScore] = useState(0);
  const [ringProgress, setRingProgress] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const duration = 800; // ms

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * targetScore));
      setRingProgress(eased * targetScore);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [targetScore]);

  // SVG ring params
  const radius = 36;
  const stroke = 5;
  const norm = radius - stroke / 2;
  const circ = 2 * Math.PI * norm;
  const offset = circ - (ringProgress / 100) * circ;

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-2xl border ${config.border} ${config.bg} animate-fade-in card-interactive`}
    >
      {/* Circular progress ring with animated stroke and counter */}
      <div className="relative shrink-0 w-[76px] h-[76px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 76 76" fill="none">
          {/* Track */}
          <circle cx="38" cy="38" r={norm} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
          {/* Animated Progress */}
          <circle
            cx="38"
            cy="38"
            r={norm}
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className={`${config.ring} transition-all duration-75`}
          />
        </svg>
        {/* Center animated counter */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-xl font-bold tabular-nums ${config.color}`}>{displayScore}</span>
          <span className="text-[9px] text-[#8B95A7] tracking-wide font-mono uppercase">Score</span>
        </div>
      </div>

      {/* Right info */}
      <div className="min-w-0">
        <div
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${config.border} ${config.bg} ${config.color}`}
        >
          {config.label} RISK
        </div>
        <p className="text-xs text-[#8B95A7] mt-2 leading-relaxed">
          {level === 'NONE' || level === 'LOW'
            ? 'No significant threats detected. Content complies with baseline guardrails.'
            : level === 'MEDIUM'
            ? 'Sensitive identifiers or moderate anomalies identified.'
            : 'High-severity prompt threats or critical PII detected.'}
        </p>
      </div>
    </div>
  );
}
