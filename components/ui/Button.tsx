"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white hover:from-[var(--primary-light)] hover:to-[var(--primary)] focus:ring-[var(--primary)] shadow-md hover:shadow-lg",
      secondary: "bg-gradient-to-r from-[var(--secondary)] to-[var(--secondary-light)] text-[var(--primary-dark)] hover:from-[var(--secondary-light)] hover:to-[var(--secondary)] focus:ring-[var(--secondary)] shadow-md hover:shadow-lg",
      accent: "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] text-white hover:from-[var(--accent-light)] hover:to-[var(--accent)] focus:ring-[var(--accent)] shadow-md hover:shadow-lg",
      outline: "border-2 border-[var(--primary)] text-[var(--primary)] bg-transparent hover:bg-[var(--primary)] hover:text-white focus:ring-[var(--primary)]",
      ghost: "text-[var(--foreground)] hover:bg-[var(--background-alt)] focus:ring-[var(--primary)]",
      danger: "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-600 focus:ring-red-500 shadow-md hover:shadow-lg",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-base",
      lg: "px-7 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };

