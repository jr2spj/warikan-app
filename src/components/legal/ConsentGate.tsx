"use client";

import { useEffect, useState } from "react";
import {
  CONSENT_COPY,
  LEGAL_PANELS,
  TERMS_STORAGE_KEY,
  type LegalPanel,
} from "@/lib/legal";
import { LegalModal } from "@/components/legal/LegalModal";

export function ConsentGate() {
  const [ready, setReady] = useState(false);
  const [needsConsent, setNeedsConsent] = useState(false);
  const [detail, setDetail] = useState<LegalPanel | null>(null);

  useEffect(() => {
    try {
      const accepted = window.localStorage.getItem(TERMS_STORAGE_KEY) === "1";
      setNeedsConsent(!accepted);
    } catch {
      setNeedsConsent(true);
    }
    setReady(true);
  }, []);

  function accept() {
    try {
      window.localStorage.setItem(TERMS_STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setNeedsConsent(false);
  }

  if (!ready || !needsConsent) return null;

  return (
    <>
      <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
        <div
          aria-hidden
          className="absolute inset-0 bg-[color-mix(in_srgb,var(--ink)_55%,transparent)] backdrop-blur-sm animate-fade"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-title"
          className="animate-sheet relative z-10 flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[1.75rem] border border-white/40 bg-[color-mix(in_srgb,var(--bg-1)_92%,white)] shadow-[var(--shadow)] sm:rounded-[1.75rem]"
        >
          <div className="relative overflow-hidden px-6 pb-2 pt-7">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-[var(--brand)]/20 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-6 top-8 h-32 w-32 rounded-full bg-[var(--accent)]/15 blur-3xl"
            />
            <p className="relative text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
              Welcome
            </p>
            <h2
              id="consent-title"
              className="relative mt-2 font-[family-name:var(--font-display)] text-[2rem] leading-tight tracking-tight text-[var(--brand-deep)]"
            >
              {CONSENT_COPY.title}
            </h2>
            <p className="relative mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
              {CONSENT_COPY.lead}
            </p>
          </div>

          <div className="space-y-3 overflow-y-auto px-6 py-4">
            <ul className="space-y-3 text-sm leading-relaxed text-[var(--ink)]">
              {CONSENT_COPY.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 text-sm">
              <button
                type="button"
                onClick={() => setDetail("notes")}
                className="font-medium text-[var(--brand-deep)] underline decoration-[var(--brand)]/30 underline-offset-4 transition hover:decoration-[var(--brand)]"
              >
                {LEGAL_PANELS.notes.title}を見る
              </button>
              <button
                type="button"
                onClick={() => setDetail("calculation")}
                className="font-medium text-[var(--brand-deep)] underline decoration-[var(--brand)]/30 underline-offset-4 transition hover:decoration-[var(--brand)]"
              >
                {LEGAL_PANELS.calculation.title}を見る
              </button>
            </div>
          </div>

          <div className="border-t border-[var(--line)] px-6 py-5">
            <button
              type="button"
              onClick={accept}
              className="w-full rounded-2xl bg-[var(--brand)] px-4 py-4 text-base font-semibold text-white shadow-[var(--shadow)] transition hover:bg-[var(--brand-deep)]"
            >
              {CONSENT_COPY.acceptLabel}
            </button>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-[var(--ink-muted)]">
              {CONSENT_COPY.footnote}
            </p>
          </div>
        </div>
      </div>

      <LegalModal panel={detail} onClose={() => setDetail(null)} />
    </>
  );
}
