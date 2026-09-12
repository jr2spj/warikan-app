"use client";

import { useEffect } from "react";
import { LEGAL_PANELS, type LegalPanel } from "@/lib/legal";

interface LegalModalProps {
  panel: LegalPanel | null;
  onClose: () => void;
}

export function LegalModal({ panel, onClose }: LegalModalProps) {
  useEffect(() => {
    if (!panel) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [panel, onClose]);

  if (!panel) return null;

  const content = LEGAL_PANELS[panel];

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="閉じる"
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--ink)_45%,transparent)] backdrop-blur-[2px] animate-fade"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        className="animate-sheet relative z-10 flex max-h-[88dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[1.75rem] border border-[var(--line)] bg-[var(--bg-1)] shadow-[var(--shadow)] sm:rounded-[1.75rem]"
      >
        <div className="relative overflow-hidden border-b border-[var(--line)] px-6 pb-5 pt-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-[var(--brand)]/15 blur-2xl"
          />
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
            {content.eyebrow}
          </p>
          <h2
            id="legal-modal-title"
            className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--brand-deep)]"
          >
            {content.title}
          </h2>
        </div>

        <div className="space-y-6 overflow-y-auto px-6 py-6">
          {content.sections.map((section) => (
            <section key={section.heading} className="space-y-2">
              <h3 className="text-sm font-semibold text-[var(--ink)]">
                {section.heading}
              </h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--ink-muted)]">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <div className="border-t border-[var(--line)] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl bg-[var(--brand)] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--brand-deep)]"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
