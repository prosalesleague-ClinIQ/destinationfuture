"use client";

import { useState, useRef, useEffect } from "react";
import { useFutureYouStore, type ChatMessage } from "@/stores/future-you-store";

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-xs font-bold text-white shadow-lg shadow-emerald-500/20">
          FY
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
            : "bg-white/[0.08] text-white/90 border border-white/[0.06]"
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-xs font-bold text-white shadow-lg shadow-emerald-500/20">
        FY
      </div>
      <div className="rounded-2xl bg-white/[0.08] border border-white/[0.06] px-4 py-3">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-white/40 animate-bounce [animation-delay:0ms]" />
          <span className="h-2 w-2 rounded-full bg-white/40 animate-bounce [animation-delay:150ms]" />
          <span className="h-2 w-2 rounded-full bg-white/40 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

export default function FutureYouChat({ variant = "popup", userContext = "" }: { variant?: "popup" | "full"; userContext?: string }) {
  const { messages, isLoading, error, sendMessage, clearChat } = useFutureYouStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim(), userContext);
    setInput("");
  };

  const isPopup = variant === "popup";

  return (
    <div className={`flex flex-col ${isPopup ? "h-full" : "h-[600px]"}`}>
      {/* Messages */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto px-4 py-4 ${isPopup ? "" : "scrollbar-hide"}`}
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-xl shadow-emerald-500/20 mb-4">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
              </svg>
            </div>
            <p className="text-white/80 font-medium text-base mb-1">Hey, it&apos;s Future You.</p>
            <p className="text-white/40 text-sm max-w-[260px]">
              I&apos;ve been where you are. Ask me anything — I&apos;ll give it to you straight.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {[
                "I'm feeling stuck",
                "I need motivation",
                "What should I focus on?",
                "I keep self-sabotaging",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt, userContext)}
                  className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-white/50 hover:bg-white/[0.08] hover:text-white/70 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        {error && (
          <div className="mx-4 mb-3 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-white/[0.06] p-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk to Future You..."
            className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-emerald-500/40 focus:bg-white/[0.06] transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </form>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="mt-2 w-full text-center text-xs text-white/20 hover:text-white/40 transition-colors"
          >
            Clear conversation
          </button>
        )}
      </div>
    </div>
  );
}
