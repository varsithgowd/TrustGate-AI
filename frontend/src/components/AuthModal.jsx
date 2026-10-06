import React, { useState } from 'react';
import { X, Mail, KeyRound, Loader2, Sparkles } from 'lucide-react';
import { login, register } from '../services/api';
import TrustGateLogo from './TrustGateLogo';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-[#090D15] border border-white/12 p-6 sm:p-7 shadow-2xl shadow-black/90 animate-page-enter">
        
        {/* Close Button with micro-interaction */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-[#8B95A7] hover:text-white hover:bg-white/6 transition-colors cursor-pointer btn-premium"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <TrustGateLogo size={32} />
          <div>
            <h3 className="text-sm font-bold text-white">
              {isRegister ? 'Create Account' : 'Authenticate'}
            </h3>
            <p className="text-xs text-[#8B95A7]">Enterprise JWT session verification</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs leading-relaxed animate-fade-in">
            {error}
          </div>
        )}

        {/* Quick Demo Login */}
        <div className="mb-5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 card-interactive">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-white/80" /> Evaluator Quick Demo
              </div>
              <p className="text-[11px] text-[#8B95A7] mt-0.5">1-click token issuance</p>
            </div>
            <button
              type="button"
              disabled={loading}
              onClick={handleQuickDemoLogin}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white text-[#05070B] hover:bg-slate-200 transition-all cursor-pointer disabled:opacity-40 btn-premium btn-sheen"
            >
              Quick Login
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#8B95A7] mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B95A7]/60" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@enterprise.com"
                className="w-full bg-[#05070B] border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-[#8B95A7]/40 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#8B95A7] mb-1.5">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B95A7]/60" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#05070B] border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-[#8B95A7]/40 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-[#05070B] text-xs font-bold transition-all cursor-pointer disabled:opacity-40 btn-premium btn-sheen"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-black" />
            ) : isRegister ? (
              'Create Account'
            ) : (
              'Log In'
            )}
          </button>
        </form>

        {/* Toggle */}
        <div className="mt-4 pt-3 border-t border-white/6 text-center text-xs text-[#8B95A7]">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="font-semibold text-white hover:underline cursor-pointer ml-1"
          >
            {isRegister ? 'Log in' : 'Create one'}
          </button>
        </div>
      </div>
    </div>
  );
}
