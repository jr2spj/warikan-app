import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/legal/SiteShell";
import { PRIVACY_PAGE } from "@/lib/legal";

export const metadata: Metadata = {
  title: `${PRIVACY_PAGE.title} | Warikan`,
  description: PRIVACY_PAGE.lead,
};

export default function PrivacyPage() {
  return (
    <SiteShell skipConsent>
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
        Privacy
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--brand-deep)]">
        {PRIVACY_PAGE.title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
        {PRIVACY_PAGE.lead}
      </p>
      <div className="mt-10 space-y-6">
        {PRIVACY_PAGE.sections.map((section) => (
          <section key={section.heading} className="space-y-2">
            <h2 className="text-base font-semibold text-[var(--ink)]">
              {section.heading}
            </h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--ink-muted)]">
              {section.body}
            </p>
          </section>
        ))}
      </div>
      <p className="mt-10 text-sm">
        <Link
          href="/"
          className="font-medium text-[var(--brand-deep)] underline decoration-[var(--brand)]/25 underline-offset-4"
        >
          トップへ戻る
        </Link>
      </p>
    </SiteShell>
  );
}
