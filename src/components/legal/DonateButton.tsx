"use client";

import { DONATE_ENABLED, DONATE_LABEL, DONATE_URL } from "@/lib/donate";

interface DonateButtonProps {
  className?: string;
  compact?: boolean;
}

export function DonateButton({ className = "", compact = false }: DonateButtonProps) {
  if (!DONATE_ENABLED) return null;

  return (
    <a
      href={DONATE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={
        compact
          ? `inline-flex items-center gap-1.5 font-medium text-[var(--accent)] underline decoration-[var(--accent)]/30 underline-offset-4 transition hover:decoration-[var(--accent)] ${className}`
          : `inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--accent)]/25 bg-[color-mix(in_srgb,var(--accent)_8%,white)] px-4 py-3 text-sm font-semibold text-[var(--accent)] transition hover:bg-[color-mix(in_srgb,var(--accent)_14%,white)] ${className}`
      }
    >
      <span aria-hidden>☕</span>
      {DONATE_LABEL}
      <span className="sr-only">（新しいタブで開きます）</span>
    </a>
  );
}
