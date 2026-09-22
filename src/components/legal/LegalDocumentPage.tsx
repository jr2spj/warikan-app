import Link from "next/link";
import { LEGAL_PANELS, type LegalPanel } from "@/lib/legal";
import { SiteShell } from "@/components/legal/SiteShell";

export function LegalDocumentPage({ panel }: { panel: LegalPanel }) {
  const content = LEGAL_PANELS[panel];

  return (
    <SiteShell skipConsent>
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
        {content.eyebrow}
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--brand-deep)]">
        {content.title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
        {content.lead}
      </p>

      <div className="mt-10 space-y-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
          要約
        </p>
        {content.summary.map((section) => (
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

      <div className="mt-12 space-y-6 border-t border-[var(--line)] pt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
          全文
        </p>
        <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--ink-muted)]">
          {content.fullLead}
        </p>
        {content.articles.map((article) => (
          <section key={article.title} className="space-y-2">
            <h2 className="text-base font-semibold text-[var(--ink)]">
              {article.title}
            </h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--ink-muted)]">
              {article.body}
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
