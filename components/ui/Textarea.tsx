"use client";

import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block font-semibold mb-2 text-[var(--foreground)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full px-4 py-3 border-2 rounded-lg bg-white text-[var(--foreground)] transition-all duration-300 resize-y min-h-[120px]",
            "placeholder:text-[var(--foreground-muted)]",
            "focus:outline-none focus:ring-0",
            error
              ? "border-[var(--error)] focus:border-[var(--error)]"
              : "border-[var(--border)] focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_rgba(30,58,95,0.1)]",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-[var(--error)]">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-[var(--foreground-muted)]">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };

