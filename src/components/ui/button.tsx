import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
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
    "border-black bg-black text-white before:absolute before:inset-0 before:origin-right before:scale-x-0 before:bg-charcoal before:transition-transform before:duration-500 hover:before:origin-left hover:before:scale-x-100",
  secondary:
    "border-black bg-transparent text-black before:absolute before:inset-0 before:origin-right before:scale-x-0 before:bg-black before:transition-transform before:duration-500 hover:text-white hover:before:origin-left hover:before:scale-x-100",
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
  const classes = `relative inline-flex min-h-11 items-center justify-center overflow-hidden border px-6 text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-500 disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant]} ${className}`;
  const content = loading ? (
    <ButtonLoadingState label={loadingLabel} />
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
    <button type={type} className={classes} aria-busy={loading || undefined} disabled={loading || disabled} {...props}>
      {content}
    </button>
  );
}
