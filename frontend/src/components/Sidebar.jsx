import React from 'react';
import {
  Plus,
  MessageSquare,
  ShieldCheck,
  History,
  Lock,
  Settings,
  LogOut,
  LogIn,
  X,
  Trash2,
} from 'lucide-react';
import TrustGateLogo from './TrustGateLogo';

export default function Sidebar({
  isOpen,
  onClose,
  onNewScan,
  history = [],
  onSelectHistory,
  onClearHistory,
  user,
  onLogout,
  onOpenAuth,
  currentView = 'chat',
  onSwitchView,
  onOpenSettings,
  theme = 'white',
}) {
  const isWhite = theme === 'white';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-40 ${isWhite ? 'bg-black/40' : 'bg-black/85'} backdrop-blur-md lg:hidden animate-fade-in`}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Luxury Purple Glassmorphic Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 w-72 flex flex-col
          ${isWhite ? 'bg-white/95 border-r border-[#7C3AED]/12 shadow-xl shadow-purple-950/5' : 'glass-panel border-r border-[#A78BFA]/15'}
          backdrop-blur-2xl transform transition-transform duration-250 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:z-30`}
        aria-label="TrustGate AI Workspace"
      >
        {/* Top: Logo + Brand */}
        <div className={`flex items-center justify-between h-20 px-6 border-b shrink-0 ${
          isWhite ? 'border-[#7C3AED]/10' : 'border-[#A78BFA]/10'
        }`}>
          <TrustGateLogo size={32} showText stackedText theme={theme} />
          <button
            type="button"
            onClick={onClose}
            className={`lg:hidden p-1.5 rounded-xl transition-colors cursor-pointer ${
              isWhite ? 'text-[#6B637B] hover:text-[#0F0A1C] hover:bg-black/5' : 'text-[#A8A0B8] hover:text-[#FFFFFF] hover:bg-white/5'
            }`}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action: + New Chat (Purple gradient button) */}
        <div className="px-5 pt-5 pb-3 shrink-0">
          <button
            type="button"
            id="sidebar-new-chat-btn"
            onClick={() => {
              onNewScan();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-white text-xs font-bold transition-all duration-200 cursor-pointer shadow-lg shadow-[#7C3AED]/20 btn-premium group"
          >
            <Plus className="w-4 h-4 text-white/90 transition-transform duration-200 group-hover:scale-125 group-hover:text-white" />
            <span className="tracking-wide text-white">New Chat</span>
          </button>
        </div>

        {/* Scrollable Middle: Navigation + Recent Chats */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 min-h-0">
          {/* Recent Chats Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-2 pb-1">
              <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]'
              }`}>
                Recent Chats
              </span>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={onClearHistory}
                  title="Clear history"
                  className={`p-1 transition-colors cursor-pointer ${
                    isWhite ? 'text-[#6B637B]/70 hover:text-rose-500' : 'text-[#A8A0B8]/60 hover:text-rose-400'
                  }`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className={`px-3 py-3 rounded-xl border text-center ${
                isWhite ? 'border-[#7C3AED]/12 bg-[#7C3AED]/[0.03]' : 'border-white/5 bg-white/[0.01]'
              }`}>
                <p className={`text-[11px] ${isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]/70'}`}>No conversations yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {history.slice(0, 8).map((item) => {
                  const isBlocked = item.action === 'BLOCKED';
                  const isSanitized = item.action === 'SANITIZED';
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectHistory(item);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs transition-all duration-150 text-left group cursor-pointer ${
                        isWhite
                          ? 'text-[#4B4459] hover:text-[#0F0A1C] hover:bg-[#7C3AED]/8'
                          : 'text-[#A8A0B8] hover:text-[#FFFFFF] hover:bg-[#7C3AED]/10'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                          isWhite
                            ? 'text-[#6B637B] group-hover:text-[#7C3AED]'
                            : 'text-[#A8A0B8]/60 group-hover:text-[#A78BFA]'
                        }`} />
                        <span className="truncate max-w-[150px] font-sans font-medium">
                          {item.inputSnippet || item.rawInput}
                        </span>
                      </div>
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          isBlocked
                            ? 'bg-rose-500'
                            : isSanitized
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Security Section */}
          <div className="space-y-1">
            <div className={`px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider ${
              isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]'
            }`}>
              Security
            </div>

            {/* Protection Overview */}
            <button
              type="button"
              id="sidebar-nav-overview"
              onClick={() => {
                onSwitchView('command_center');
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                currentView === 'command_center'
                  ? 'sidebar-nav-active font-semibold'
                  : isWhite
                  ? 'text-[#4B4459] hover:text-[#0F0A1C] hover:bg-[#7C3AED]/8'
                  : 'text-[#A8A0B8] hover:text-[#FFFFFF] hover:bg-[#7C3AED]/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />
                <span>Protection Overview</span>
              </div>
            </button>

            {/* Threat History */}
            <button
              type="button"
              id="sidebar-nav-threats"
              onClick={() => {
                onSwitchView('command_center');
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                isWhite
                  ? 'text-[#4B4459] hover:text-[#0F0A1C] hover:bg-[#7C3AED]/8'
                  : 'text-[#A8A0B8] hover:text-[#FFFFFF] hover:bg-[#7C3AED]/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <History className={`w-4 h-4 ${isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]'}`} />
                <span>Threat History</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                isWhite
                  ? 'bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20'
                  : 'bg-[#7C3AED]/15 text-[#A78BFA] border border-[#A78BFA]/20'
              }`}>
                {history.filter((h) => h.action === 'BLOCKED').length}
              </span>
            </button>

            {/* Privacy */}
            <button
              type="button"
              id="sidebar-nav-privacy"
              onClick={() => {
                if (onOpenSettings) onOpenSettings('privacy');
                onClose();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                isWhite
                  ? 'text-[#4B4459] hover:text-[#0F0A1C] hover:bg-[#7C3AED]/8'
                  : 'text-[#A8A0B8] hover:text-[#FFFFFF] hover:bg-[#7C3AED]/10'
              }`}
            >
              <Lock className={`w-4 h-4 ${isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]'}`} />
              <span>Privacy</span>
            </button>
          </div>

          {/* Settings Section */}
          <div className="space-y-1">
            <button
              type="button"
              id="sidebar-nav-settings"
              onClick={() => {
                if (onOpenSettings) onOpenSettings();
                onClose();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer group ${
                isWhite
                  ? 'text-[#4B4459] hover:text-[#0F0A1C] hover:bg-[#7C3AED]/8'
                  : 'text-[#A8A0B8] hover:text-[#FFFFFF] hover:bg-[#7C3AED]/10'
              }`}
            >
              <Settings className={`w-4 h-4 transition-transform duration-200 group-hover:rotate-45 ${
                isWhite ? 'text-[#6B637B] group-hover:text-[#7C3AED]' : 'text-[#A8A0B8] group-hover:text-[#A78BFA]'
              }`} />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Bottom: User Profile / Login */}
        <div className={`shrink-0 border-t p-4 ${
          isWhite ? 'border-[#7C3AED]/12 bg-[#FAFAFE]/95' : 'border-[#A78BFA]/10 bg-[#09060E]/95'
        }`}>
          {user ? (
            <div className={`flex items-center justify-between gap-3 p-2 rounded-2xl border ${
              isWhite ? 'bg-white border-[#7C3AED]/15 shadow-sm' : 'bg-white/[0.03] border-white/8'
            }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] border border-[#A78BFA]/40 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm shadow-[#7C3AED]/30">
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className={`text-xs font-bold truncate ${isWhite ? 'text-[#0F0A1C]' : 'text-white'}`} title={user.email}>
                    {user.email?.split('@')[0] || 'User'}
                  </span>
                  <span className={`text-[10px] truncate font-mono ${isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]'}`}>
                    {user.email}
                  </span>
                </div>
              </div>
              <button
                type="button"
                id="sidebar-logout-btn"
                onClick={onLogout}
                aria-label="Log out"
                title="Log out"
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isWhite ? 'text-[#6B637B] hover:text-rose-500 hover:bg-rose-50' : 'text-[#A8A0B8] hover:text-rose-400 hover:bg-rose-500/10'
                }`}
              >
                <LogOut className="w-4 h-4" />
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
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-[#7C3AED]/25 btn-premium btn-sheen"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log in to TrustGate</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
