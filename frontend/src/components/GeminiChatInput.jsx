import React, { useRef, useEffect, useState } from 'react';
import {
  Send,
  Loader2,
  Paperclip,
  Mic,
  MicOff,
  Sparkles,
  Shield,
  X,
} from 'lucide-react';

export default function GeminiChatInput({
  input,
  setInput,
  onSend,
  loading,
  disabled,
  backendOffline,
  theme = 'white',
}) {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [attachedFileName, setAttachedFileName] = useState(null);
  const isWhite = theme === 'white';

  // Auto-resize textarea smoothly
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(Math.max(ta.scrollHeight, 48), 200)}px`;
  }, [input]);

  // Voice toggle
  const toggleSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setInput('Explain quantum computing simply.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setInput(content.slice(0, 10000));
        textareaRef.current?.focus();
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading && !disabled && input.trim()) {
        onSend(input);
        setAttachedFileName(null);
      }
    }
  };

  const canSend = input.trim().length > 0 && !loading && !disabled;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-2">
      {/* Attached file chip */}
      {attachedFileName && (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs animate-fade-in ${
          isWhite
            ? 'bg-[#F3E8FF] border border-[#DDD6FE] text-[#1E1035]'
            : 'bg-[#160D24] border border-[#A78BFA]/20 text-[#FFFFFF]'
        }`}>
          <Paperclip className={`w-3 h-3 ${isWhite ? 'text-[#7C3AED]' : 'text-[#A78BFA]'}`} />
          <span className="font-mono truncate max-w-xs">{attachedFileName}</span>
          <button
            type="button"
            onClick={() => setAttachedFileName(null)}
            className={`p-0.5 transition-colors cursor-pointer ${
              isWhite ? 'text-[#6B637B] hover:text-[#0F0A1C]' : 'text-[#A8A0B8] hover:text-white'
            }`}
            aria-label="Remove attachment"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ─── Large Floating Purple Glassmorphic Composer ─── */}
      <div className={`relative rounded-3xl glass-composer overflow-hidden transition-all duration-200 ${
        isWhite ? 'bg-white/95 border border-[#7C3AED]/20 shadow-xl shadow-purple-950/5' : ''
      }`}>
        {/* Main Textarea */}
        <div className="px-5 pt-4 pb-2">
          <textarea
            ref={textareaRef}
            id="gemini-chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading || disabled}
            rows={1}
            spellCheck={false}
            placeholder={
              backendOffline
                ? 'TrustGate backend offline (start node server.js)...'
                : 'Message Gemini securely...'
            }
            aria-label="Message Gemini securely"
            className={`w-full bg-transparent text-sm sm:text-base resize-none focus:outline-none leading-relaxed disabled:opacity-40 disabled:cursor-not-allowed font-sans selection:bg-[#7C3AED]/30 ${
              isWhite
                ? 'text-[#0F0A1C] placeholder-[#8E86A0]'
                : 'text-[#FFFFFF] placeholder-[#A8A0B8]/50'
            }`}
            style={{ minHeight: '48px', maxHeight: '200px' }}
          />
        </div>

        {/* Bottom Toolbar inside Composer */}
        <div className={`flex items-center justify-between px-4 pb-3 pt-1 border-t ${
          isWhite ? 'border-[#7C3AED]/10' : 'border-white/[0.04]'
        }`}>
          {/* Left Controls & Status Badges */}
          <div className="flex items-center gap-2">
            {/* Attachment Button */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.json,.csv,.md,.js,.py,.ts"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              id="chat-attach-btn"
              title="Attach document or code snippet"
              aria-label="Attach file"
              disabled={loading || disabled}
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 rounded-xl transition-all cursor-pointer disabled:opacity-40 ${
                isWhite
                  ? 'text-[#6B637B] hover:text-[#0F0A1C] hover:bg-black/5'
                  : 'text-[#A8A0B8] hover:text-[#FFFFFF] hover:bg-white/5'
              }`}
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Voice Input / Mic */}
            <button
              type="button"
              id="chat-mic-btn"
              title={isListening ? 'Stop listening' : 'Voice input'}
              aria-label="Voice input"
              disabled={loading || disabled}
              onClick={toggleSpeech}
              className={`p-2 rounded-xl transition-all cursor-pointer disabled:opacity-40 ${
                isListening
                  ? 'text-[#7C3AED] bg-[#7C3AED]/20 animate-pulse'
                  : isWhite
                  ? 'text-[#6B637B] hover:text-[#0F0A1C] hover:bg-black/5'
                  : 'text-[#A8A0B8] hover:text-[#FFFFFF] hover:bg-white/5'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Inside Badges: Purple TrustGate Shield & Gemini 3.8 Flash */}
            <div className="hidden sm:flex items-center gap-1.5 ml-1">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                isWhite
                  ? 'bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#7C3AED] font-bold'
                  : 'bg-[#7C3AED]/15 border border-[#A78BFA]/25 text-[#A78BFA]'
              }`}>
                <Shield className="w-3 h-3 text-[#7C3AED]" />
                <span>TrustGate Active</span>
              </span>

              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono ${
                isWhite
                  ? 'bg-black/[0.04] border border-black/8 text-[#6B637B]'
                  : 'bg-white/[0.04] border border-white/8 text-[#A8A0B8]'
              }`}>
                <Sparkles className={`w-3 h-3 ${isWhite ? 'text-[#7C3AED]' : 'text-[#A78BFA]'}`} />
                <span>Gemini 3.8 Flash</span>
              </span>
            </div>
          </div>

          {/* Right Controls: Send Button (Purple → Violet Gradient) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="chat-send-btn"
              disabled={!canSend}
              onClick={() => {
                onSend(input);
                setAttachedFileName(null);
              }}
              aria-label="Send message to Gemini"
              className={`flex items-center justify-center w-9 h-9 rounded-2xl transition-all duration-200 cursor-pointer ${
                canSend
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/30 hover:scale-105 active:scale-95'
                  : isWhite
                  ? 'bg-black/5 text-[#8E86A0]/40 cursor-not-allowed'
                  : 'bg-white/5 text-[#A8A0B8]/30 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Send className="w-4 h-4 fill-current translate-x-px text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard info */}
      <div className={`flex items-center justify-between px-3 text-[10px] font-mono ${
        isWhite ? 'text-[#6B637B]/70' : 'text-[#A8A0B8]/50'
      }`}>
        <span>Press <kbd className={`px-1 rounded border ${
          isWhite ? 'text-[#0F0A1C] bg-black/5 border-black/10' : 'text-[#A8A0B8]/80 bg-white/5 border-white/8'
        }`}>Enter</kbd> to send · <kbd className={`px-1 rounded border ${
          isWhite ? 'text-[#0F0A1C] bg-black/5 border-black/10' : 'text-[#A8A0B8]/80 bg-white/5 border-white/8'
        }`}>Shift+Enter</kbd> for newline</span>
        <span className="hidden sm:inline">Protected by TrustGate AI</span>
      </div>
    </div>
  );
}
