"use client";

import { create } from "zustand";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface FutureYouState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;

  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  sendMessage: (content: string, userContext?: string) => Promise<void>;
  clearChat: () => void;
}

export const useFutureYouStore = create<FutureYouState>((set, get) => ({
  messages: [],
  isOpen: false,
  isLoading: false,
  error: null,

  toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),
  setOpen: (open) => set({ isOpen: open }),

  sendMessage: async (content: string, userContext?: string) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: Date.now(),
    };

    set((s) => ({
      messages: [...s.messages, userMsg],
      isLoading: true,
      error: null,
    }));

    try {
      const history = get().messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/future-you", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, history, userContext }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || "Request failed");
      }

      const { reply } = await res.json();

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: reply,
        timestamp: Date.now(),
      };

      set((s) => ({
        messages: [...s.messages, assistantMsg],
        isLoading: false,
      }));
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  },

  clearChat: () => set({ messages: [], error: null }),
}));
