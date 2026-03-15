"use client";

interface SectionToggleProps {
  sectionKey: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  premiumOnly: boolean;
  locked: boolean;
  onToggle: (sectionKey: string) => void;
}

export default function SectionToggle({
  sectionKey,
  title,
  description,
  icon,
  enabled,
  premiumOnly,
  locked,
  onToggle,
}: SectionToggleProps) {
  const handleClick = () => {
    if (!locked) {
      onToggle(sectionKey);
    }
  };

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition-all duration-200 ${
        locked
          ? "border-white/[0.06] bg-white/[0.06] opacity-60 cursor-not-allowed"
          : enabled
            ? "border-indigo-400/20 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
            : "border-white/[0.06] bg-white/[0.04] hover:border-white/[0.08]"
      }`}
    >
      {/* Icon */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
          enabled
            ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
            : "bg-white/[0.06] text-white/50"
        }`}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-white/90 truncate">{title}</p>
          {premiumOnly && (
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Premium
            </span>
          )}
          {locked && (
            <svg className="h-4 w-4 shrink-0 text-white/30" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          )}
        </div>
        <p className="text-xs text-white/50 truncate">{description}</p>
      </div>

      {/* Toggle Switch */}
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={`Toggle ${title}`}
        disabled={locked}
        onClick={handleClick}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-2 focus:ring-offset-[#0a0e27] disabled:cursor-not-allowed ${
          enabled ? "bg-gradient-to-r from-indigo-500 to-purple-500" : "bg-white/[0.08]"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
