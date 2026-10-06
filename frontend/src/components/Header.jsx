import React from 'react';
import {
  Menu,
  Sparkles,
  ChevronDown,
  Settings,
  LogIn,
  Sun,
  Moon,
} from 'lucide-react';
import TrustGateLogo from './TrustGateLogo';

export default function Header({
  backendStatus = 'online',
  user,
  onOpenAuth,
  onToggleSidebar,
  onOpenSettings,
  theme = 'white',
  onToggleTheme,
}) {
  const isWhite = theme === 'white';

  return (
    <header className={`sticky top-0 z-30 flex h-18 shrink-0 items-center justify-between gap-4 border-b ${
      isWhite
        ? 'border-[#7C3AED]/12 bg-white/90 shadow-sm shadow-purple-900/5'
        : 'border-[#A78BFA]/12 bg-[#070509]/90'
    } backdrop-blur-xl px-4 sm:px-8 transition-colors duration-200`}>
      {/* ─── Left: Mobile Toggle & Workspace Title ─── */}
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          type="button"
          id="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          className={`lg:hidden p-2 rounded-xl transition-colors cursor-pointer ${
            isWhite ? 'text-[#6B637B] hover:text-[#0F0A1C] hover:bg-purple-50' : 'text-[#A8A0B8] hover:text-[#FFFFFF] hover:bg-white/5'
          }`}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="lg:hidden">
          <TrustGateLogo size={24} showText textSize="text-xs" />
        </div>

        <div className="hidden lg:flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className={`text-sm font-extrabold tracking-tight ${isWhite ? 'text-[#0F0A1C]' : 'text-[#FFFFFF]'}`}>
              TrustGate AI
            </h1>
            <span className="text-[10px] font-mono text-[#7C3AED] bg-[#7C3AED]/10 border border-[#7C3AED]/25 px-2 py-0.5 rounded-full font-bold">
              Enterprise
            </span>
          </div>
          <p className={`text-[11px] ${isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]'}`}>
            Protected AI Workspace
          </p>
        </div>
      </div>

      {/* ─── Center: Persistent TrustGate Active Status + Model Selector ─── */}
      <div className="flex items-center gap-3">
        {/* Status: ● TrustGate Active with Tooltip */}
        <div
          className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-600 text-xs font-mono font-medium cursor-help"
          title="Every request is inspected before reaching Gemini."
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-calm-pulse" />
          <span className="hidden sm:inline font-semibold">TrustGate Active</span>
          <span className="sm:hidden font-semibold">Active</span>

          {/* Interactive Tooltip */}
          <div className={`pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap rounded-xl px-3 py-1.5 text-[11px] font-sans shadow-2xl border ${
            isWhite
              ? 'bg-white text-[#0F0A1C] border-[#7C3AED]/25 shadow-purple-950/10'
              : 'bg-[#160D24] text-[#FFFFFF] border-[#A78BFA]/30'
          }`}>
            🛡 Every request is inspected before reaching Gemini.
          </div>
        </div>

        {/* Model Selector Pill: Gemini 3.8 Flash */}
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs transition-colors cursor-pointer select-none shadow-sm ${
          isWhite
            ? 'bg-purple-50/70 hover:bg-purple-100/70 border-[#7C3AED]/20 text-[#0F0A1C]'
            : 'bg-[#160D24]/70 hover:bg-[#211233] border-[#A78BFA]/20 text-[#FFFFFF]'
        }`}>
          <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span className="font-semibold">Gemini 3.8 Flash</span>
          <ChevronDown className={`w-3 h-3 ${isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]'}`} />
        </div>
      </div>

      {/* ─── Right: Theme Switcher, Settings & User Profile ─── */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Theme Toggle (Sun / Moon) */}
        {onToggleTheme && (
          <button
            type="button"
            onClick={onToggleTheme}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isWhite
                ? 'text-[#6B637B] hover:text-[#7C3AED] hover:bg-purple-50'
                : 'text-[#A8A0B8] hover:text-[#FFFFFF] hover:bg-white/5'
            }`}
            title={isWhite ? 'Switch to Dark Mode' : 'Switch to White Backdrop'}
            aria-label="Toggle theme"
          >
            {isWhite ? <Moon className="w-4 h-4 text-[#7C3AED]" /> : <Sun className="w-4 h-4 text-[#A78BFA]" />}
          </button>
        )}

        {/* Settings button */}
        <button
          type="button"
          onClick={() => onOpenSettings && onOpenSettings()}
          className={`p-2 rounded-xl transition-colors cursor-pointer ${
            isWhite
              ? 'text-[#6B637B] hover:text-[#0F0A1C] hover:bg-purple-50'
              : 'text-[#A8A0B8] hover:text-[#FFFFFF] hover:bg-white/5'
          }`}
          title="Settings"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {user ? (
          <div
            className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl border cursor-pointer select-none transition-all ${
              isWhite
                ? 'bg-purple-50/60 border-[#7C3AED]/15 hover:border-[#7C3AED]/35'
                : 'bg-white/[0.03] border-white/8 hover:border-[#A78BFA]/40'
            }`}
            onClick={() => onOpenSettings && onOpenSettings('account')}
            title={`Signed in as ${user.email}`}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#8B5CF6] border border-[#A78BFA]/40 text-[#FFFFFF] text-xs font-bold flex items-center justify-center shadow-sm shadow-[#7C3AED]/30">
              {user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className={`text-xs font-semibold max-w-[120px] truncate hidden md:inline ${isWhite ? 'text-[#0F0A1C]' : 'text-[#FFFFFF]'}`}>
              {user.email?.split('@')[0]}
            </span>
          </div>
        ) : (
          <button
            type="button"
            id="header-login-btn"
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#A78BFA] text-[#FFFFFF] text-xs font-bold shadow-md shadow-[#7C3AED]/25 transition-all cursor-pointer btn-premium btn-sheen"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Log In</span>
          </button>
        )}
      </div>
    </header>
  );
}
