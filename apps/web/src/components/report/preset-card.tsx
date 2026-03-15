"use client";

interface PresetCardProps {
  presetKey: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: (presetKey: string) => void;
  sectionCount: number;
}

export default function PresetCard({
  presetKey,
  title,
  description,
  icon,
  selected,
  onClick,
  sectionCount,
}: PresetCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(presetKey)}
      className={`group flex flex-col items-start gap-3 rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
        selected
          ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
          : "border-white/[0.06] bg-white/[0.04] hover:border-indigo-400/30 hover:bg-white/[0.06]"
      }`}
    >
      {/* Icon */}
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
          selected
            ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
            : "bg-white/[0.06] text-white/50 group-hover:bg-indigo-500/15 group-hover:text-indigo-400"
        }`}
      >
        {icon}
      </div>

      {/* Content */}
      <div>
        <h3 className={`text-base font-semibold ${selected ? "text-indigo-300" : "text-white/90"}`}>
          {title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-white/50">{description}</p>
      </div>

      {/* Section count */}
      <div className={`mt-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        selected ? "bg-indigo-500/15 text-indigo-300" : "bg-white/[0.06] text-white/50"
      }`}>
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        {sectionCount} sections
      </div>
    </button>
  );
}
