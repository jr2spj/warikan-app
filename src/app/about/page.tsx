import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/legal/SiteShell";
import { ROOM_RETENTION_DAYS } from "@/lib/retention";
import { CONTACT_EMAIL, OPERATOR_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Warikanについて | ログイン不要の割り勘アプリ",
  description:
    "Warikanは、URLを共有するだけで使える無料の割り勘Webアプリです。ログイン不要で、掛け率つきの負担按分と送金案を出します。",
};

export default function AboutPage() {
  return (
    <SiteShell skipConsent>
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
        About
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--brand-deep)]">
        Warikanについて
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
        Warikan は、飲食や旅行などの私的な割り勘を補助する無料の Web
        アプリです。アカウント登録やログインは不要で、発行されたルーム用
        URL を共有するだけで、複数人が同じデータを閲覧・編集できます。
      </p>

      <section className="mt-10 space-y-3">
        <h2 className="text-base font-semibold text-[var(--ink)]">使い方</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[var(--ink-muted)]">
          <li>トップからルームを作成し、URL を参加者へ共有します。</li>
          <li>メンバーと掛け率（負担の重み）を登録します。</li>
          <li>立替（誰が・何に・いくら・誰の分）を記録します。</li>
          <li>精算タブで負担額と送金案の目安を確認します。</li>
        </ol>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-base font-semibold text-[var(--ink)]">料金</h2>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          割り勘機能の利用は無料です。任意の開発支援のみ受け付けており、支援の有無で機能は変わりません。いただいた支援はサーバー代などシステムの維持管理に活用します。
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-base font-semibold text-[var(--ink)]">データの扱い</h2>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          ルーム用 URL を知っている人は、ログインなしで閲覧・編集できます。最終更新から
          {ROOM_RETENTION_DAYS}
          日が経過したルームは自動削除されます。氏名のフルネームや口座番号などの個人情報は入力しないでください。
        </p>
      </section>

      <section className="mt-8 space-y-3" id="contact">
        <h2 className="text-base font-semibold text-[var(--ink)]">運営者</h2>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {OPERATOR_NAME || CONTACT_EMAIL ? (
            <>
              {OPERATOR_NAME ? (
                <>
                  ニックネーム：{OPERATOR_NAME}
                  <br />
                </>
              ) : null}
              {CONTACT_EMAIL ? (
                <>
                  メール：
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-medium text-[var(--brand-deep)] underline decoration-[var(--brand)]/25 underline-offset-4"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </>
              ) : null}
              <br />
              不具合の報告や個人情報の取扱いに関するご連絡は上記メールまでお願いします。個別の精算相談や金銭トラブルの仲裁には対応できません。
            </>
          ) : (
            "連絡先は、公開できる準備ができたときに本ページへ掲載します。"
          )}
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-base font-semibold text-[var(--ink)]">関連ページ</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <Link
              href="/legal/notes"
              className="font-medium text-[var(--brand-deep)] underline decoration-[var(--brand)]/25 underline-offset-4"
            >
              利用上の注意
            </Link>
          </li>
          <li>
            <Link
              href="/legal/calculation"
              className="font-medium text-[var(--brand-deep)] underline decoration-[var(--brand)]/25 underline-offset-4"
            >
              割り勘の計算方法
            </Link>
          </li>
          <li>
            <Link
              href="/privacy"
              className="font-medium text-[var(--brand-deep)] underline decoration-[var(--brand)]/25 underline-offset-4"
            >
              プライバシーポリシー
            </Link>
          </li>
        </ul>
      </section>
    </SiteShell>
  );
}
