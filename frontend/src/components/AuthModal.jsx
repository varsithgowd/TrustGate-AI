import React, { useState } from 'react';
import { X, Mail, KeyRound, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { login, register } from '../services/api';
import TrustGateLogo from './TrustGateLogo';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, theme = 'white' }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const isWhite = theme === 'white';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        await register(email, password);
        await login(email, password);
      } else {
        await login(email, password);
      }
      onAuthSuccess({ email });
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.message ||
          err.message ||
          'Authentication failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    setError('');
    const demoEmail = 'judge_demo@trustgate.ai';
    const demoPassword = 'password123';
    try {
      try {
        await login(demoEmail, demoPassword);
      } catch {
        await register(demoEmail, demoPassword);
        await login(demoEmail, demoPassword);
      }
      onAuthSuccess({ email: demoEmail });
      onClose();
    } catch {
      setError('Demo login failed. Please enter credentials above.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl animate-fade-in ${
      isWhite ? 'bg-black/40' : 'bg-black/85'
    }`}>
      {/* ─── Glowing Ambient Purple AI Effects behind Card ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div
          className="w-[520px] h-[520px] rounded-full opacity-40 blur-3xl animate-calm-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, rgba(124,58,237,0.15) 50%, transparent 70%)',
          }}
        />
        <div className="absolute inset-0 bg-dot-matrix opacity-20" />
      </div>

      {/* ─── Glassmorphic Authentication Card ─── */}
      <div className={`relative w-full max-w-md rounded-3xl p-7 sm:p-9 shadow-2xl animate-page-enter ${
        isWhite
          ? 'bg-white/98 border border-[#7C3AED]/20 shadow-purple-950/10 text-[#0F0A1C]'
          : 'glass-panel border border-[#A78BFA]/30 shadow-black/95 text-white'
      }`}>
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-xl transition-colors cursor-pointer ${
            isWhite ? 'text-[#6B637B] hover:text-[#0F0A1C] hover:bg-black/5' : 'text-[#A8A0B8] hover:text-[#FFFFFF] hover:bg-white/5'
          }`}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large TrustGate AI Branding */}
        <div className="flex flex-col items-center text-center space-y-3 mb-7">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-1 border ${
            isWhite
              ? 'bg-white border-[#7C3AED]/20 shadow-purple-900/10'
              : 'glass-card border-[#A78BFA]/35 shadow-[#7C3AED]/20'
          }`}>
            <TrustGateLogo size={32} theme={theme} />
          </div>

          <div className="space-y-1">
            <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
              isWhite ? 'text-[#0F0A1C]' : 'text-[#FFFFFF]'
            }`}>
              Secure every{' '}
              <span className="bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] bg-clip-text text-transparent">
                AI
              </span>{' '}
              interaction.
            </h2>
            <p className={`text-xs leading-relaxed max-w-xs mx-auto ${
              isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]'
            }`}>
              TrustGate protects your conversations before they reach Gemini.
            </p>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs leading-relaxed animate-fade-in font-medium">
            {error}
          </div>
        )}

        {/* 1-Click Evaluator Quick Demo Login */}
        <div className={`mb-5 p-3 rounded-2xl flex items-center justify-between gap-3 border ${
          isWhite
            ? 'bg-[#7C3AED]/5 border-[#7C3AED]/20'
            : 'bg-white/[0.03] border-[#A78BFA]/20'
        }`}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#7C3AED]" />
            <span className={`text-xs font-semibold ${isWhite ? 'text-[#0F0A1C]' : 'text-[#FFFFFF]'}`}>
              Evaluator Demo Login
            </span>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={handleQuickDemoLogin}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-white transition-all cursor-pointer shadow-sm shadow-[#7C3AED]/30 disabled:opacity-40"
          >
            Instant Demo
          </button>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isWhite ? 'text-[#4B4459]' : 'text-[#A8A0B8]'}`}>
              Email
            </label>
            <div className="relative">
              <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]/60'}`} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@enterprise.com"
                className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none transition-colors ${
                  isWhite
                    ? 'bg-[#F8F7FC] border border-[#7C3AED]/20 text-[#0F0A1C] placeholder-[#8E86A0] focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/30'
                    : 'bg-[#0D0814]/90 border border-white/10 text-[#FFFFFF] placeholder-[#A8A0B8]/40 focus:border-[#A78BFA] focus:ring-1 focus:ring-[#A78BFA]/30'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isWhite ? 'text-[#4B4459]' : 'text-[#A8A0B8]'}`}>
              Password
            </label>
            <div className="relative">
              <KeyRound className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isWhite ? 'text-[#6B637B]' : 'text-[#A8A0B8]/60'}`} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none transition-colors ${
                  isWhite
                    ? 'bg-[#F8F7FC] border border-[#7C3AED]/20 text-[#0F0A1C] placeholder-[#8E86A0] focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/30'
                    : 'bg-[#0D0814]/90 border border-white/10 text-[#FFFFFF] placeholder-[#A8A0B8]/40 focus:border-[#A78BFA] focus:ring-1 focus:ring-[#A78BFA]/30'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-white text-xs font-extrabold transition-all cursor-pointer shadow-xl shadow-[#7C3AED]/30 disabled:opacity-40 btn-sheen"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : isRegister ? (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Log In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className={`mt-5 pt-4 border-t text-center text-xs ${
          isWhite ? 'border-[#7C3AED]/10 text-[#6B637B]' : 'border-white/6 text-[#A8A0B8]'
        }`}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className={`font-bold hover:underline cursor-pointer ml-1 ${
              isWhite ? 'text-[#7C3AED] hover:text-[#6D28D9]' : 'text-[#A78BFA] hover:text-white'
            }`}
          >
            {isRegister ? 'Log in' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
}
