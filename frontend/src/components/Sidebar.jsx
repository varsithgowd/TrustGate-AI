import React from 'react';
import {
  Plus,
  LogOut,
  LogIn,
  MessageSquare,
  LayoutDashboard,
  Sparkles,
  X,
} from 'lucide-react';
import TrustGateLogo from './TrustGateLogo';
import ScanHistory from './ScanHistory';

export default function Sidebar({
  isOpen,
  onClose,
  onNewScan,
  history,
  onSelectHistory,
  onClearHistory,
  user,
  onLogout,
  onOpenAuth,
  currentView = 'chat',
  onSwitchView,
  onOpenOnboarding,
}) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar aside */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 w-72 flex flex-col bg-[#07090E] border-r border-white/8
          transform transition-transform duration-250 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:z-30`}
        aria-label="TrustGate AI navigation"
      >
        {/* Brand header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/7 shrink-0">
          <TrustGateLogo size={28} showText textSize="text-sm font-bold" />
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-xl text-[#8B95A7] hover:text-white hover:bg-white/5 transition-colors cursor-pointer btn-premium"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat / Scan button with sheen and scale */}
        <div className="px-4 pt-4 pb-2 shrink-0">
          <button
            type="button"
            id="sidebar-new-scan-btn"
            onClick={() => {
              onNewScan();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/12 hover:border-white/25 text-white text-xs font-bold transition-all duration-180 cursor-pointer group shadow-sm btn-premium"
          >
            <Plus className="w-4 h-4 transition-transform duration-200 group-hover:scale-125" />
            <span>New Chat / Scan</span>
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="px-3 py-2 shrink-0 space-y-1" aria-label="Main Navigation">
          <div className="px-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-[#8B95A7]/60">
            Navigation
          </div>

          {/* AI Chat (Primary) */}
          <button
            type="button"
            id="sidebar-nav-chat"
            onClick={() => {
              onSwitchView('chat');
              onClose();
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-180 cursor-pointer group ${
              currentView === 'chat'
                ? 'sidebar-nav-active border border-white/15 shadow-sm'
                : 'text-[#8B95A7] hover:text-white hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 group-hover:text-white transition-all duration-150" />
              <span>AI Chat</span>
            </div>
            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/8 text-[#CBD5E1] border border-white/10">
              Primary
            </span>
          </button>

          {/* Security Command Center (Secondary) */}
          <button
            type="button"
            id="sidebar-nav-command"
            onClick={() => {
              onSwitchView('command_center');
              onClose();
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-180 cursor-pointer group ${
              currentView === 'command_center'
                ? 'sidebar-nav-active border border-white/15 shadow-sm'
                : 'text-[#8B95A7] hover:text-white hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 group-hover:text-white transition-all duration-150" />
              <span>Command Center</span>
            </div>
            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/4 text-[#8B95A7]">
              Dashboard
            </span>
          </button>

          {/* Onboarding Tour */}
          <button
            type="button"
            id="sidebar-nav-tour"
            onClick={() => {
              onOpenOnboarding();
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#8B95A7] hover:text-white hover:bg-white/[0.04] transition-all duration-150 cursor-pointer group"
          >
            <Sparkles className="w-4 h-4 text-[#8B95A7] group-hover:text-white group-hover:translate-x-0.5 transition-all duration-150" />
            <span>Guardian Setup Tour</span>
          </button>
        </nav>

        {/* Divider */}
        <div className="h-px bg-white/7 mx-4 my-2 shrink-0" />

        {/* Scan History Feed */}
        <div className="flex-1 overflow-y-auto px-1 py-1 min-h-0">
          <ScanHistory
            history={history}
            onSelectHistory={(item) => {
              onSelectHistory(item);
              onClose();
            }}
            onClearHistory={onClearHistory}
          />
        </div>

        {/* Bottom system status & user profile */}
        <div className="shrink-0 border-t border-white/7 p-4 space-y-3 bg-[#05070B]">
          
          {/* Real-time status with calm pulse */}
          <div className="flex items-center gap-2.5 rounded-xl border border-white/7 bg-white/[0.02] px-3 py-2 card-interactive">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-calm-pulse shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-semibold text-white">TrustGate Guardrails</span>
              <span className="text-[10px] text-[#8B95A7] font-mono">System Secure</span>
            </div>
          </div>

          {/* User row */}
          {user ? (
            <div className="flex items-center gap-2.5 px-1 py-0.5">
              <div className="w-7 h-7 rounded-full bg-white/10 text-white text-xs font-bold flex items-center justify-center shrink-0 border border-white/20">
                {user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="flex-1 text-xs text-[#CBD5E1] truncate font-mono" title={user.email}>
                {user.email}
              </span>
              <button
                type="button"
                id="sidebar-logout-btn"
                onClick={onLogout}
                aria-label="Log out"
                title="Log out"
                className="p-1.5 rounded-xl hover:bg-white/8 text-[#8B95A7] hover:text-white transition-colors cursor-pointer btn-premium"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              id="sidebar-login-btn"
              onClick={() => {
                onOpenAuth();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white text-[#05070B] text-xs font-bold transition-all cursor-pointer shadow-sm btn-premium btn-sheen"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log in to Scan</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
