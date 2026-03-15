import React from "react";
import { cn } from "./utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "bordered" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", padding = "md", children, ...props }, ref) => {
    const variants = {
      default: "bg-white rounded-xl shadow-sm",
      glass: "bg-white/80 backdrop-blur-lg rounded-xl border border-white/20 shadow-sm",
      bordered: "bg-white rounded-xl border border-surface-200",
      elevated: "bg-white rounded-xl shadow-lg",
    };

    const paddings = {
      none: "",
      sm: "p-3",
      md: "p-5",
      lg: "p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(variants[variant], paddings[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";
