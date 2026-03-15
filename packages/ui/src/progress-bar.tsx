import React from "react";
import { cn } from "./utils";

export interface ProgressBarProps {
  value: number; // 0-100
  size?: "sm" | "md" | "lg";
  variant?: "brand" | "cosmic" | "success";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function ProgressBar({
  value,
  size = "md",
  variant = "brand",
  showLabel = false,
  label,
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const variants = {
    brand: "bg-brand-500",
    cosmic: "bg-gradient-to-r from-brand-500 to-cosmic-500",
    success: "bg-emerald-500",
  };

  return (
    <div className={cn("w-full", className)}>
      {(showLabel || label) && (
        <div className="mb-1 flex justify-between text-xs text-surface-300">
          {label && <span>{label}</span>}
          {showLabel && <span>{clamped}%</span>}
        </div>
      )}
      <div className={cn("w-full overflow-hidden rounded-full bg-surface-100", sizes[size])}>
        <div
          className={cn("rounded-full transition-all duration-500 ease-out", sizes[size], variants[variant])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
