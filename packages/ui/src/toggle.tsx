import React from "react";
import { cn } from "./utils";

export interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  label?: string;
}

export function Toggle({ enabled, onChange, disabled, size = "md", label }: ToggleProps) {
  const sizes = {
    sm: { track: "h-5 w-9", thumb: "h-3.5 w-3.5", translate: "translate-x-4" },
    md: { track: "h-6 w-11", thumb: "h-4 w-4", translate: "translate-x-5" },
  };

  const s = sizes[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!enabled)}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
        s.track,
        enabled ? "bg-brand-600" : "bg-surface-200",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block transform rounded-full bg-white shadow-sm ring-0 transition duration-200",
          s.thumb,
          enabled ? s.translate : "translate-x-0.5",
          "mt-0.5 ml-0.5"
        )}
      />
    </button>
  );
}
