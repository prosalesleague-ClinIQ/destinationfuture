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
          ? "border-brand-500 bg-brand-50 shadow-md shadow-brand-500/10"
          : "border-surface-200 bg-white hover:border-brand-300 hover:shadow-sm card-hover"
      }`}
    >
      {/* Icon */}
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
          selected
            ? "bg-gradient-to-br from-brand-500 to-cosmic-500 text-white"
            : "bg-surface-100 text-surface-700 group-hover:bg-brand-100 group-hover:text-brand-600"
        }`}
      >
        {icon}
      </div>

      {/* Content */}
      <div>
        <h3 className={`text-base font-semibold ${selected ? "text-brand-700" : "text-surface-900"}`}>
          {title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-surface-700">{description}</p>
      </div>

      {/* Section count */}
      <div className={`mt-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        selected ? "bg-brand-100 text-brand-700" : "bg-surface-100 text-surface-700"
      }`}>
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        {sectionCount} sections
      </div>
    </button>
  );
}
