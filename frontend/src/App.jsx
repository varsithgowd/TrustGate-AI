import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AIChatView from './components/AIChatView';
import CommandCenterView from './components/CommandCenterView';
import AuthModal from './components/AuthModal';
import SettingsModal from './components/SettingsModal';
import LandingPage from './components/LandingPage';
import {
  sendChatMessage,
  checkBackendHealth,
  getStoredToken,
  getStoredUser,
  removeStoredToken,
} from './services/api';

const HISTORY_STORAGE_KEY = 'trustgate_scan_history';
const MODE_KEY = 'trustgate_protection_mode';
const PROFILE_KEY = 'trustgate_trust_profile';

export default function App() {
  const [route, setRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/\/+$/, '') || '/';
      if (path === '/app') return '/app';
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/\/+$/, '') || '/';
      if (path === '/app') {
        setRoute('/app');
      } else {
        setRoute('/');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToApp = () => {
    if (window.location.pathname !== '/app') {
      window.history.pushState({}, '', '/app');
    }
    setRoute('/app');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const [theme, setTheme] = useState('white'); // 'white' (default white backdrop) | 'dark'
  const [view, setView] = useState('chat'); // 'chat' (primary AI workspace) | 'command_center' (security overview)
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(() => {
    try {
      const token = getStoredToken();
      const storedUser = getStoredUser();
      return token ? storedUser || { email: 'enterprise_user@trustgate.ai' } : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('security');

  const [protectionMode, setProtectionMode] = useState(() => {
    try {
      return localStorage.getItem(MODE_KEY) || 'strict';
    } catch {
      return 'strict';
    }
  });

  const [trustProfile, setTrustProfile] = useState(() => {
    try {
      return localStorage.getItem(PROFILE_KEY) || 'developer';
    } catch {
      return 'developer';
    }
  });

  const [backendStatus, setBackendStatus] = useState('checking');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Verify backend health
  useEffect(() => {
    const verifyHealth = async () => {
      const health = await checkBackendHealth();
      setBackendStatus(health.ok ? 'online' : 'offline');
    };
    verifyHealth();
    const timer = setInterval(verifyHealth, 15000);
    return () => clearInterval(timer);
  }, []);

  const saveScanToHistory = (inputText, scanData) => {
    const historyItem = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      inputSnippet: inputText.slice(0, 48) + (inputText.length > 48 ? '...' : ''),
      rawInput: inputText,
      riskScore: scanData.riskScore,
      riskLevel: scanData.riskLevel,
      action: scanData.action,
      result: scanData,
    };
    setHistory((prev) => {
      const updated = [historyItem, ...prev.filter((i) => i.rawInput !== inputText)].slice(0, 25);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleSendMessage = async (textToSend) => {
    if (!textToSend?.trim()) {
      setError('Enter some text before sending.');
      return;
    }

    const token = getStoredToken();
    if (!token) {
      setError('Please log in before sending an AI request.');
      setIsAuthModalOpen(true);
      return;
    }

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const data = await sendChatMessage(textToSend);
      const securityData = data.security || {};
      const isBlocked = data.blocked || securityData.action === 'BLOCKED';

      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: textToSend,
        result: securityData,
        security: securityData,
        aiResponse: data.response,
        blocked: isBlocked,
        error: data.error,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      saveScanToHistory(textToSend, securityData);
    } catch (err) {
      const errMsg = err.message || 'TrustGate encountered an unexpected error.';
      setError(errMsg);
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: textToSend,
        error: errMsg,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);

      if (
        err.isAuthError ||
        err.message?.includes('Authentication') ||
        err.message?.includes('log in')
      ) {
        setUser(null);
        setIsAuthModalOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setInput('');
    setMessages([]);
    setError(null);
    setView('chat');
  };

  const handleSelectHistory = (item) => {
    setView('chat');
    setInput('');
    setError(null);

    const userMsg = {
      id: item.id || Date.now(),
      sender: 'user',
      text: item.rawInput,
      timestamp: item.timestamp,
    };
    const assistantMsg = {
      id: (item.id || Date.now()) + 1,
      sender: 'assistant',
      text: item.rawInput,
      result: item.result,
      security: item.result,
      aiResponse: item.result?.action === 'BLOCKED' ? null : 'Past session record restored from audit history.',
      blocked: item.result?.action === 'BLOCKED',
      timestamp: item.timestamp,
    };
    setMessages([userMsg, assistantMsg]);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {}
  };

  const handleLogout = () => {
    removeStoredToken();
    setUser(null);
    setError(null);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setError(null);
  };

  const handleOpenSettings = (tab = 'security') => {
    setSettingsTab(tab);
    setIsSettingsModalOpen(true);
  };

  // If route is landing page ('/'), show the Premium Landing Page
  if (route === '/') {
    return <LandingPage onLaunchApp={navigateToApp} />;
  }

  return (
    <div className={`min-h-screen ${theme === 'white' ? 'theme-white bg-[#FAFAFE] text-[#0F0A1C]' : 'theme-dark bg-[#070509] text-[#FFFFFF]'} flex font-sans selection:bg-[#7C3AED]/25 selection:text-[#7C3AED] relative overflow-x-hidden transition-colors duration-300`}>
      {/* ─── Ambient Purple Glow & Matrix Background ─── */}
      <div className="fixed inset-0 bg-ai-aura pointer-events-none" aria-hidden="true" />
      <div className="fixed inset-0 bg-dot-matrix pointer-events-none opacity-40" aria-hidden="true" />

      {/* ─── Left Sidebar ─── */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewScan={handleNewChat}
        history={history}
        onSelectHistory={handleSelectHistory}
        onClearHistory={handleClearHistory}
        user={user}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        currentView={view}
        onSwitchView={setView}
        onOpenSettings={handleOpenSettings}
        theme={theme}
      />

      {/* ─── Main Content Area (Offset by sidebar width on desktop) ─── */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 relative min-h-screen z-10">
        {/* Main Header with Theme Switcher */}
        <Header
          backendStatus={backendStatus}
          user={user}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenSettings={() => handleOpenSettings('ai')}
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'white' ? 'dark' : 'white')}
        />

        {/* ─── Main View Experience ─── */}
        <main id="main-content" className="flex-1 flex flex-col min-h-0 w-full">
          {view === 'chat' ? (
            /* AI Chat Workspace (Primary Experience) */
            <AIChatView
              messages={messages}
              input={input}
              setInput={setInput}
              onSend={handleSendMessage}
              loading={loading}
              error={error}
              backendStatus={backendStatus}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onResetChat={handleNewChat}
              protectionMode={protectionMode}
              theme={theme}
            />
          ) : (
            /* Security Overview (Secondary Experience) */
            <CommandCenterView
              onSwitchToChat={() => setView('chat')}
              protectionMode={protectionMode}
              setProtectionMode={setProtectionMode}
              trustProfile={trustProfile}
              history={history}
              backendStatus={backendStatus}
              theme={theme}
            />
          )}
        </main>
      </div>

      {/* ─── Modals ─── */}
      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        theme={theme}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        initialTab={settingsTab}
        user={user}
        onLogout={handleLogout}
        onClearHistory={handleClearHistory}
        theme={theme}
      />
    </div>
  );
}
