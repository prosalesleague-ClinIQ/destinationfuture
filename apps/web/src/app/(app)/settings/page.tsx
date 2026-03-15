"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "privacy" | "subscription" | "data">("profile");

  const tabs = [
    { key: "profile" as const, label: "Profile" },
    { key: "privacy" as const, label: "Privacy" },
    { key: "subscription" as const, label: "Subscription" },
    { key: "data" as const, label: "Data & Export" },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-surface-900 mb-6">Settings</h1>

      <div className="flex gap-1 rounded-lg bg-surface-100 p-1 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-white text-surface-900 shadow-sm"
                : "text-surface-300 hover:text-surface-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">First Name</label>
                <input className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm" defaultValue="Alex" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Nickname</label>
                <input className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm" defaultValue="DemoExplorer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Email</label>
                <input className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm" defaultValue="demo@destinationfuture.app" disabled />
              </div>
            </div>
            <button className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors">
              Save Changes
            </button>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Birth Information</h2>
            <p className="text-sm text-surface-300 mb-4">Update your birth details to improve report accuracy.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Date of Birth</label>
                <input type="date" className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm" defaultValue="1992-07-15" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Exact Birth Time</label>
                <input type="time" className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm" defaultValue="14:30" />
              </div>
            </div>
            <button className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors">
              Update Birth Info
            </button>
          </div>
        </div>
      )}

      {activeTab === "privacy" && (
        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Privacy Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-900">Anonymous Leaderboard</p>
                  <p className="text-xs text-surface-300">Show your nickname instead of real name on leaderboards</p>
                </div>
                <button className="relative h-6 w-11 rounded-full bg-brand-600 transition-colors">
                  <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform translate-x-5" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-900">Share Profile</p>
                  <p className="text-xs text-surface-300">Allow others to view your public profile</p>
                </div>
                <button className="relative h-6 w-11 rounded-full bg-surface-200 transition-colors">
                  <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-900">Local Draft Mode</p>
                  <p className="text-xs text-surface-300">Keep report drafts on your device only</p>
                </div>
                <button className="relative h-6 w-11 rounded-full bg-surface-200 transition-colors">
                  <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "subscription" && (
        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Current Plan</h2>
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 text-xs font-medium text-white mb-4">
              Premium
            </div>
            <p className="text-sm text-surface-300">You have full access to all modules, reports, and features.</p>
          </div>
          <div className="rounded-xl border-2 border-dashed border-surface-200 p-6 text-center">
            <p className="text-sm text-surface-300">Billing management coming soon</p>
          </div>
        </div>
      )}

      {activeTab === "data" && (
        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Export Your Data</h2>
            <p className="text-sm text-surface-300 mb-4">Download all your reports and profile data.</p>
            <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors">
              Export All Data (JSON)
            </button>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm border border-red-200">
            <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
            <p className="text-sm text-surface-300 mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
            <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors">
              Delete My Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
