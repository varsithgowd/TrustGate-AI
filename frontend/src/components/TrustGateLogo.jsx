import React from 'react';

// TrustGate AI Logo — geometric shield + gateway concept (refined monochrome)
export default function TrustGateLogo({ size = 28, showText = false, textSize = 'text-base' }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Shield + Gateway geometric mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="TrustGate AI logo"
      >
        {/* Outer shield shape */}
        <path
          d="M16 3L4 8V17C4 23.6274 9.37258 29 16 29C22.6274 29 28 23.6274 28 17V8L16 3Z"
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Inner gateway arch */}
        <path
          d="M16 10C13.2386 10 11 12.2386 11 15V20H21V15C21 12.2386 18.7614 10 16 10Z"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          fill="none"
          strokeLinejoin="round"
        />
        {/* Gateway door */}
        <rect x="14" y="17" width="4" height="3" rx="1" fill="#FFFFFF" />
        {/* Top keystone dot with calm pulse */}
        <circle cx="16" cy="9" r="1.5" fill="#FFFFFF" />
      </svg>

      {showText && (
        <span className={`font-bold tracking-tight text-white ${textSize}`}>
          TrustGate AI
        </span>
      )}
    </div>
  );
}
