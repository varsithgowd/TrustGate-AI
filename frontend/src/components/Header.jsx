import React from 'react';
import {
  Menu,
  Bell,
  LogIn,
  MessageSquare,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';
import TrustGateLogo from './TrustGateLogo';
import { SecurityStatusBadge } from './SecurityStatus';

export default function Header({
  backendStatus,
  user,
  onOpenAuth,
  onToggleSidebar,
  currentView = 'chat',
  onSwitchView,
  onOpenOnboarding,
}) {
  const statusMap = {
    online: 'protected',
    offline: 'offline',
    checking: 'scanning',
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-white/8 bg-[#07090E]/95 backdrop-blur-md px-3 sm:px-6">
      
      {/* ─── Left: Mobile menu + Brand ─── */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          id="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-[#8B95A7] hover:text-white hover:bg-white/5 transition-colors cursor-pointer btn-premium"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand logo for mobile & tablet */}
        <div className="lg:hidden">
          <TrustGateLogo size={24} showText textSize="text-sm font-bold" />
        </div>

        {/* Desktop Title & Tagline */}
        <div className="hidden lg:flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-white">
              TrustGate AI
            </h1>
            <span className="text-[10px] font-mono text-[#CBD5E1] bg-white/5 border border-white/10 px-1.5 py-0.2 rounded-full">
              Enterprise
            </span>
          </div>
          <p className="text-[11px] text-[#8B95A7]">AI Security &amp; Privacy Guardian</p>
        </div>
      </div>

      {/* ─── Center: View Switcher (AI Chat vs Command Center) ─── */}
      <div className="hidden md:flex items-center p-1 rounded-2xl bg-[#080D14] border border-white/8 shadow-inner">
        <button
          type="button"
          id="view-switch-chat-btn"
          onClick={() => onSwitchView('chat')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-180 cursor-pointer btn-premium ${
            currentView === 'chat'
              ? 'bg-white text-[#05070B] shadow-sm font-bold'
              : 'text-[#8B95A7] hover:text-white hover:bg-white/4'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>AI Chat</span>
          <span className={`text-[9px] font-mono px-1 rounded ${currentView === 'chat' ? 'bg-black/15 text-black' : 'bg-white/5 text-[#8B95A7]'}`}>
            Primary
          </span>
        </button>

        <button
          type="button"
          id="view-switch-command-btn"
          onClick={() => onSwitchView('command_center')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-180 cursor-pointer btn-premium ${
            currentView === 'command_center'
              ? 'bg-white text-[#05070B] shadow-sm font-bold'
              : 'text-[#8B95A7] hover:text-white hover:bg-white/4'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Security Command Center</span>
        </button>
      </div>

      {/* ─── Right: Actions & Auth ─── */}
      <div className="flex items-center gap-2 shrink-0">
        
        {/* Onboarding tour trigger */}
        <button
          type="button"
          id="header-onboarding-tour-btn"
          onClick={onOpenOnboarding}
          title="Onboarding &amp; Setup Tour"
          aria-label="Replay onboarding setup"
          className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-xl border border-white/10 bg-white/4 hover:bg-white/8 text-[#CBD5E1] hover:text-white text-xs font-medium transition-all duration-150 cursor-pointer btn-premium"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#8B95A7]" />
          <span>Tour</span>
        </button>

        {/* Backend status badge with subtle breathing pulse */}
        <SecurityStatusBadge status={statusMap[backendStatus] || 'offline'} />

        {/* Notifications placeholder */}
        <span
          className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] text-[#8B95A7] hover:text-white hover:bg-white/6 transition-colors cursor-pointer btn-premium"
          aria-label="System notifications"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </span>

        {/* User avatar / Log In button */}
        {user ? (
          <div
            className="flex items-center gap-2 h-9 pl-2 pr-3 rounded-xl border border-white/10 bg-white/[0.03] cursor-default"
            title={`Logged in as ${user.email}`}
          >
            <div className="w-6 h-6 rounded-full bg-white/15 text-white text-xs font-bold flex items-center justify-center border border-white/20">
              {user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="text-xs font-medium text-[#CBD5E1] max-w-[100px] truncate hidden sm:inline font-mono">
              {user.email}
            </span>
          </div>
        ) : (
          <button
            type="button"
            id="header-login-btn"
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-white hover:bg-slate-100 text-[#05070B] text-xs font-bold shadow-md shadow-white/10 transition-all cursor-pointer btn-premium btn-sheen"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Log In</span>
          </button>
        )}
      </div>
    </header>
  );
}
