import React, { useState, useEffect } from 'react';
import { ShieldCheck, Radar, Timer, BadgeCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react';

function ThreatChart() {
  return (
    <div className="relative mt-3 flex-1" style={{ minHeight: 80 }}>
      <svg viewBox="0 0 500 100" preserveAspectRatio="none" className="w-full h-full" aria-hidden="true">
        <defs>
          <linearGradient id="tgSilverFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[25, 50, 75].map((y) => (
          <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        {/* Area fill */}
        <path
          d="M0,75 C40,70 50,65 90,60 C130,55 150,80 190,77 C230,74 250,52 290,50 C330,48 350,60 390,56 C430,52 460,36 500,34 L500,100 L0,100 Z"
          fill="url(#tgSilverFill)"
        />
        {/* Main silver line */}
        <path
          className="animated-path"
          d="M0,75 C40,70 50,65 90,60 C130,55 150,80 190,77 C230,74 250,52 290,50 C330,48 350,60 390,56 C430,52 460,36 500,34"
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Dashed secondary line */}
        <path
          d="M0,88 C40,85 55,82 90,80 C140,77 155,84 200,82 C250,80 265,73 300,71 C350,69 370,75 420,73 C460,71 480,65 500,63"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.2"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
        {/* Active point with calm breathing */}
        <circle cx="500" cy="34" r="3" fill="#FFFFFF" />
        <circle cx="500" cy="34" r="6" fill="rgba(255,255,255,0.25)" className="animate-calm-pulse" style={{ transformOrigin: '500px 34px' }} />
      </svg>
    </div>
  );
}

function MetricNumber({ targetValue, suffix = '', decimals = 0 }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let start = null;
    const duration = 750;

    const tick = (now) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(eased * targetValue);
      if (progress < 1) requestAnimationFrame(tick);
    };

    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [targetValue]);

  return (
    <span className="text-xl font-bold tracking-tight text-white tabular-nums">
      {decimals > 0
        ? val.toFixed(decimals)
        : Math.round(val).toLocaleString()}
      {suffix}
    </span>
  );
}

const STAT_CARDS = [
  {
    label: 'Threats Blocked',
    target: 12847,
    suffix: '',
    decimals: 0,
    change: '+14.2%',
    up: true,
    icon: ShieldCheck,
  },
  {
    label: 'Scans Today',
    target: 3204,
    suffix: '',
    decimals: 0,
    change: '+2.1%',
    up: true,
    icon: Radar,
  },
  {
    label: 'Compliance Score',
    target: 98.6,
    suffix: '%',
    decimals: 1,
    change: '+0.8%',
    up: true,
    icon: BadgeCheck,
  },
  {
    label: 'Avg. Response',
    target: 1.2,
    suffix: 's',
    decimals: 1,
    change: '-0.3s',
    up: false,
    icon: Timer,
  },
];

const RECENT_ALERTS = [
  { title: 'Prompt injection attempt', severity: 'Critical', source: 'api-gateway', time: '2m', status: 'Blocked', dot: 'bg-rose-400' },
  { title: 'PII data in payload', severity: 'High', source: 'user-service', time: '9m', status: 'Redacted', dot: 'bg-amber-400' },
  { title: 'Credential exposure', severity: 'Medium', source: 'auth-service', time: '34m', status: 'Flagged', dot: 'bg-amber-400' },
  { title: 'Safe content scan', severity: 'Low', source: 'chat-api', time: '1h', status: 'Allowed', dot: 'bg-emerald-400' },
];

export default function DashboardPanel() {
  return (
    <div className="rounded-3xl border border-white/8 bg-[#07090E] overflow-hidden animate-page-enter">
      {/* Window chrome */}
      <div className="relative flex h-8 items-center border-b border-white/6 px-3 bg-[#05070B]">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
        </div>
        <span className="pointer-events-none absolute inset-x-0 text-center text-[11px] font-mono font-medium text-[#8B95A7]/70">
          TrustGate AI · Security Command Center
        </span>
      </div>

      {/* Stat Cards with Animated Count-up */}
      <div className="grid grid-cols-2 gap-2.5 p-3.5 lg:grid-cols-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          const Arrow = card.up ? ArrowUpRight : ArrowDownRight;
          return (
            <div
              key={card.label}
              className="flex flex-col justify-between rounded-2xl border border-white/7 bg-white/[0.02] p-3.5 card-interactive"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#8B95A7] font-medium">{card.label}</span>
                <Icon className="h-4 w-4 text-[#8B95A7]/60" aria-hidden="true" />
              </div>
              <div className="mt-3 flex items-end justify-between gap-1">
                <MetricNumber
                  targetValue={card.target}
                  suffix={card.suffix}
                  decimals={card.decimals}
                />
                <span
                  className={`flex items-center gap-0.5 text-[11px] font-mono font-semibold ${
                    card.up ? 'text-emerald-400' : 'text-white/70'
                  }`}
                >
                  <Arrow className="h-3 w-3" aria-hidden="true" />
                  {card.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lower section: chart + recent alerts */}
      <div className="grid grid-cols-1 gap-2.5 p-3.5 pt-0 lg:grid-cols-3">
        {/* Threat chart */}
        <div
          className="flex min-h-0 flex-col rounded-2xl border border-white/7 bg-white/[0.02] p-4 lg:col-span-2 card-interactive"
          style={{ minHeight: 160 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xs font-bold tracking-tight text-white">Threat Activity</h3>
              <p className="text-[11px] text-[#8B95A7]">Detections vs. automated responses</p>
            </div>
            <div className="hidden sm:flex items-center gap-1 rounded-lg border border-white/7 p-0.5 bg-black/30">
              {['24h', '7d', '30d'].map((t, i) => (
                <span
                  key={t}
                  className={`rounded-md px-2 py-0.5 text-[11px] font-mono cursor-pointer transition-colors ${
                    i === 0 ? 'bg-white/10 text-white' : 'text-[#8B95A7] hover:text-white'
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[11px] text-[#8B95A7]">
              <span className="h-1.5 w-1.5 rounded-full bg-white" /> Detections
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-[#8B95A7]">
              <span className="h-1.5 w-1.5 rounded-full bg-white/30" /> Responses
            </span>
          </div>
          <ThreatChart />
        </div>

        {/* Recent alerts */}
        <div className="flex min-h-0 flex-col rounded-2xl border border-white/7 bg-white/[0.02] p-4 card-interactive">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold tracking-tight text-white">Recent Alerts</h3>
            <span className="flex items-center gap-0.5 text-[11px] font-medium text-[#8B95A7] hover:text-white cursor-pointer transition-colors">
              View all <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <ul className="flex flex-1 flex-col divide-y divide-white/5">
            {RECENT_ALERTS.map((alert, i) => (
              <li key={i} className="flex items-center gap-2.5 py-2 first:pt-0 last:pb-0">
                <span className={`mt-1 h-1.5 w-1.5 shrink-0 self-start rounded-full ${alert.dot}`} aria-hidden="true" />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-xs font-medium text-white">{alert.title}</span>
                  <span className="truncate text-[10px] text-[#8B95A7]/70 font-mono">
                    {alert.severity} · {alert.source} · {alert.time}
                  </span>
                </span>
                <span className="shrink-0 rounded border border-white/8 px-1.5 py-0.5 text-[9px] font-mono text-[#8B95A7]">
                  {alert.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
