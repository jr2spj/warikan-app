"use client";

import { useState } from "react";
import {
  DONATE_ENABLED,
  DONATE_LABEL,
  DONATE_URL,
  STRIPE_DONATE_ENABLED,
} from "@/lib/donate";
import { DonateSheet } from "@/components/legal/DonateSheet";

interface DonateButtonProps {
  className?: string;
  compact?: boolean;
}

export function DonateButton({ className = "", compact = false }: DonateButtonProps) {
  const [open, setOpen] = useState(false);

  if (!DONATE_ENABLED) return null;

  const style = compact
    ? `inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ink-muted)] underline decoration-[var(--line)] underline-offset-4 transition hover:text-[var(--ink)] hover:decoration-[var(--ink)]/30 ${className}`
    : `inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-white/50 px-3 py-1.5 text-xs font-medium text-[var(--ink-muted)] transition hover:border-[var(--brand)]/30 hover:text-[var(--brand-deep)] ${className}`;

  if (STRIPE_DONATE_ENABLED) {
    return (
      <>
        <button type="button" onClick={() => setOpen(true)} className={style}>
          <span aria-hidden>☕</span>
          {DONATE_LABEL}
        </button>
        <DonateSheet open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  return (
    <a
      href={DONATE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={style}
    >
      <span aria-hidden>☕</span>
      {DONATE_LABEL}
      <span className="sr-only">（新しいタブで開きます）</span>
    </a>
  );
}
