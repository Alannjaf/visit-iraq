"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "pending" | "approved" | "rejected" | "delisted" | "default" | "host" | "admin" | "user";
}

const Badge = ({ className, variant = "default", children, ...props }: BadgeProps) => {
  const variants = {
    pending: "bg-[var(--secondary)]/20 text-[var(--secondary-dark)] border-[var(--secondary)]/30",
    approved: "bg-[var(--success)]/20 text-[var(--success)] border-[var(--success)]/30",
    rejected: "bg-[var(--error)]/20 text-[var(--error)] border-[var(--error)]/30",
    delisted: "bg-yellow-100 text-yellow-700 border-yellow-200",
    default: "bg-[var(--background-alt)] text-[var(--foreground-muted)] border-[var(--border)]",
    host: "bg-[var(--primary)]/20 text-[var(--primary)] border-[var(--primary)]/30",
    admin: "bg-purple-100 text-purple-700 border-purple-200",
    user: "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export { Badge };

