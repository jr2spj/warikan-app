import Link from "next/link";
import { ROOM_RETENTION_DAYS } from "@/lib/retention";
import { DONATE_ENABLED } from "@/lib/donate";
import { DonateButton } from "@/components/legal/DonateButton";
import { CONTACT_EMAIL, OPERATOR_NAME } from "@/lib/site";

export function AppFooter() {
  return (
    <footer className="relative z-10 mt-auto border-t border-[var(--line)] pt-8 text-sm text-[var(--ink-muted)]">
      <p className="leading-relaxed">
        最終更新から{ROOM_RETENTION_DAYS}
        日経過したルームは自動削除されます。精算結果は参考値です。
      </p>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        <Link
          href="/about"
          className="font-medium text-[var(--brand-deep)] underline decoration-[var(--brand)]/25 underline-offset-4 transition hover:decoration-[var(--brand)]"
        >
          Warikanについて
        </Link>
        <Link
          href="/legal/notes"
          className="font-medium text-[var(--brand-deep)] underline decoration-[var(--brand)]/25 underline-offset-4 transition hover:decoration-[var(--brand)]"
        >
          利用上の注意
        </Link>
        <Link
          href="/legal/calculation"
          className="font-medium text-[var(--brand-deep)] underline decoration-[var(--brand)]/25 underline-offset-4 transition hover:decoration-[var(--brand)]"
        >
          計算方法
        </Link>
        <Link
          href="/privacy"
          className="font-medium text-[var(--brand-deep)] underline decoration-[var(--brand)]/25 underline-offset-4 transition hover:decoration-[var(--brand)]"
        >
          プライバシー
        </Link>
        {CONTACT_EMAIL ? (
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-[var(--brand-deep)] underline decoration-[var(--brand)]/25 underline-offset-4 transition hover:decoration-[var(--brand)]"
          >
            お問い合わせ
          </a>
        ) : null}
      </div>
      {DONATE_ENABLED ? (
        <div className="mt-6 border-t border-[var(--line)] pt-5">
          <p className="text-sm font-medium text-[var(--ink)]">開発者を支援できます</p>
          <p className="mt-1 max-w-sm text-xs leading-relaxed">
            いただいた支援は、サーバー代などシステムの維持管理に活用します。任意です。支援の有無で機能は変わりません。
          </p>
          <div className="mt-3">
            <DonateButton />
          </div>
        </div>
      ) : null}
      {OPERATOR_NAME || CONTACT_EMAIL ? (
        <p className="mt-5 text-xs leading-relaxed">
          開発者
          {OPERATOR_NAME ? `：${OPERATOR_NAME}` : ""}
          {CONTACT_EMAIL ? (
            <>
              {OPERATOR_NAME ? " / " : "："}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline decoration-[var(--line)] underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>
            </>
          ) : null}
        </p>
      ) : null}
      <p className="mt-2 text-xs tracking-wide">Warikan · URLキー共有型</p>
    </footer>
  );
}
