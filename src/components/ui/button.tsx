"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { ButtonLoadingState } from "@/components/loaders/button-loading-state";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "text" | "ghost";
  className?: string;
  loading?: boolean;
  loadingLabel?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const styles = {
  primary:
    "border-black bg-black text-white before:absolute before:inset-0 before:origin-right before:scale-x-0 before:bg-charcoal before:transition-transform before:duration-500 hover:border-charcoal hover:before:origin-left hover:before:scale-x-100",
  secondary:
    "border-black bg-white text-black before:absolute before:inset-0 before:origin-right before:scale-x-0 before:bg-black before:transition-transform before:duration-500 hover:text-white hover:before:origin-left hover:before:scale-x-100",
  text:
    "link-underline border-transparent bg-transparent px-0 text-black",
  ghost:
    "group border-transparent bg-transparent px-0 text-black",
};

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  loading = false,
  loadingLabel,
  type = "button",
  disabled,
  ...props
}: ButtonProps) {
  const { pending } = useFormStatus();
  const submitPending = !href && type === "submit" && pending;
  const isLoading = loading || submitPending;
  const classes = `relative inline-flex min-h-11 cursor-pointer items-center justify-center overflow-hidden border px-6 text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-500 disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant]} ${className}`;
  const content = isLoading ? (
    <ButtonLoadingState label={loadingLabel || "Processing..."} />
  ) : (
    <span className="relative z-10 flex items-center gap-3">
      {children}
      {variant === "ghost" && (
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">
          →
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      aria-busy={isLoading || undefined}
      disabled={isLoading || disabled}
      {...props}
    >
      {content}
    </button>
  );
}
