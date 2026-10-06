import React from 'react';

export default function TrustGateLogo({
  size = 28,
  showText = false,
  stackedText = false,
  textSize = 'text-sm',
  theme = 'white',
}) {
  const isWhite = theme === 'white';
  const textColor = isWhite ? 'text-[#0F0A1C]' : 'text-[#FFFFFF]';

  return (
    <div className="flex items-center gap-2.5 select-none group">
      {/* Futuristic Shield + AI Nexus mark with purple/violet glow */}
      <div className="relative flex items-center justify-center">
        <div
          className="absolute -inset-1 rounded-xl opacity-35 blur-sm pointer-events-none transition-opacity duration-300 group-hover:opacity-85"
          style={{ background: 'radial-gradient(circle, #8B5CF6 0%, rgba(124,58,237,0.45) 60%, transparent 100%)' }}
        />
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="TrustGate AI logo"
          className="relative transition-transform duration-200 group-hover:scale-105"
        >
          <defs>
            <linearGradient id="purpleShieldGrad" x1="4" y1="3" x2="28" y2="29" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8B5CF6" stopOpacity="0.95" />
              <stop offset="1" stopColor="#7C3AED" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="purpleCoreGrad" x1="11" y1="10" x2="21" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor={isWhite ? '#7C3AED' : '#FFFFFF'} />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>

          {/* Outer futuristic shield */}
          <path
            d="M16 3L4 8V17C4 23.6274 9.37258 29 16 29C22.6274 29 28 23.6274 28 17V8L16 3Z"
            fill={isWhite ? 'rgba(124, 58, 237, 0.08)' : 'rgba(124, 58, 237, 0.12)'}
            stroke="url(#purpleShieldGrad)"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />

          {/* Inner gateway node */}
          <path
            d="M16 9C12.6863 9 10 11.6863 10 15V21H22V15C22 11.6863 19.3137 9 16 9Z"
            stroke="url(#purpleCoreGrad)"
            strokeWidth="1.3"
            fill={isWhite ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.18)'}
            strokeLinejoin="round"
          />

          {/* Core AI nexus spark */}
          <circle cx="16" cy="15" r="2" fill={isWhite ? '#7C3AED' : '#FFFFFF'} />
          <path d="M16 11V13M16 17V19M12 15H14M18 15H20" stroke="#8B5CF6" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>

      {showText && (
        stackedText ? (
          <div className="flex flex-col leading-none">
            <span className={`font-extrabold tracking-wider text-xs ${textColor} font-mono`}>TRUSTGATE</span>
            <span className="text-[10px] font-bold tracking-widest text-[#7C3AED] uppercase mt-0.5">AI</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-extrabold tracking-tight ${textColor} ${textSize}`}>TrustGate</span>
            <span className="text-xs font-bold text-[#7C3AED] px-1.5 py-0.5 rounded-md bg-[#7C3AED]/12 border border-[#7C3AED]/25 font-mono">
              AI
            </span>
          </div>
        )
      )}
    </div>
  );
}
