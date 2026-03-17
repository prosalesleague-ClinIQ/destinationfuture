"use client";

import { useState } from "react";

interface GoogleAccountPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (account: { email: string; firstName: string; lastName?: string }) => void;
}

export default function GoogleAccountPicker({ isOpen, onClose, onSelect }: GoogleAccountPickerProps) {
  const [step, setStep] = useState<"pick" | "email" | "name">("pick");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleUseAnother = () => {
    setStep("email");
    setError("");
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Enter a valid email address");
      return;
    }
    setStep("name");
    setError("");
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError("Enter your name");
      return;
    }
    onSelect({ email: email.trim(), firstName: firstName.trim() });
    // Reset
    setStep("pick");
    setEmail("");
    setFirstName("");
    setError("");
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
      setStep("pick");
      setEmail("");
      setFirstName("");
      setError("");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
        {/* Google header */}
        <div className="px-8 pt-8 pb-2">
          <svg className="h-6 mb-4" viewBox="0 0 74 24">
            <path d="M9.24 8.19v2.46h5.88a5.1 5.1 0 01-2.22 3.34l3.6 2.8a10.17 10.17 0 003.11-8.11 12 12 0 00-.17-1.49H9.24z" fill="#4285F4"/>
            <path d="M3.65 14.2a6.18 6.18 0 01-.93-3.2 6.18 6.18 0 01.93-3.2l-3.7-2.88A10.23 10.23 0 00-1 11a10.23 10.23 0 001.95 6.08L4.65 14.2z" fill="#FBBC05"/>
            <path d="M9.24 21.4a9.83 9.83 0 006.92-2.53l-3.6-2.8a5.73 5.73 0 01-8.51-3.02L.34 15.93A10.24 10.24 0 009.24 21.4z" fill="#34A853"/>
            <path d="M.34 6.07l3.7 2.88a5.73 5.73 0 018.51-3.02l3.6-2.8A10.24 10.24 0 009.24.6 10.24 10.24 0 00.34 6.07z" fill="#EA4335"/>
            <text x="24" y="18" fill="#5F6368" fontSize="16" fontFamily="Arial, sans-serif" fontWeight="500">oogle</text>
          </svg>

          {step === "pick" && (
            <>
              <h2 className="text-xl font-normal text-gray-800">Choose an account</h2>
              <p className="mt-1 text-sm text-gray-500">to continue to Destination Future</p>
            </>
          )}
          {step === "email" && (
            <>
              <h2 className="text-xl font-normal text-gray-800">Sign in</h2>
              <p className="mt-1 text-sm text-gray-500">Use your Google Account</p>
            </>
          )}
          {step === "name" && (
            <>
              <h2 className="text-xl font-normal text-gray-800">Welcome</h2>
              <p className="mt-1 text-sm text-gray-500">{email}</p>
            </>
          )}
        </div>

        <div className="px-8 py-4">
          {step === "pick" && (
            <div className="space-y-1">
              {/* Use another account option */}
              <button
                onClick={handleUseAnother}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                  <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Use another account</p>
                </div>
              </button>
            </div>
          )}

          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or phone"
                  autoFocus
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-gray-500">
                Enter your Gmail to sign in or create an account automatically.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setStep("pick"); setError(""); }}
                  className="rounded-md px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </form>
          )}

          {step === "name" && (
            <form onSubmit={handleNameSubmit} className="space-y-4">
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Your name"
                  autoFocus
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-gray-500">
                This is how you&apos;ll appear on Destination Future.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setStep("email"); setError(""); }}
                  className="rounded-md px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-8 py-4 flex justify-between">
          <span className="text-xs text-gray-400">Destination Future</span>
          <button
            onClick={() => { onClose(); setStep("pick"); setEmail(""); setFirstName(""); setError(""); }}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
