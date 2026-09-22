"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type Appearance, type Stripe } from "@stripe/stripe-js";
import { useEffect, useMemo, useState } from "react";
import {
  DONATE_MAX_YEN,
  DONATE_MIN_YEN,
  DONATE_PRESETS,
  STRIPE_IS_TEST,
  STRIPE_PUBLISHABLE_KEY,
  formatYen,
  isAllowedDonateAmount,
} from "@/lib/donate";
import { DonateCheckoutForm } from "@/components/legal/DonateCheckoutForm";

let stripePromise: Promise<Stripe | null> | null = null;

function getStripePromise() {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
}

const APPEARANCE: Appearance = {
  theme: "flat",
  variables: {
    colorPrimary: "#0f766e",
    colorBackground: "#ffffff",
    colorText: "#14313a",
    colorTextSecondary: "#4d6a73",
    colorDanger: "#c45c26",
    borderRadius: "12px",
    fontFamily: "system-ui, sans-serif",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      border: "1px solid rgba(20, 49, 58, 0.12)",
      boxShadow: "none",
      padding: "12px",
    },
    ".Input:focus": {
      border: "1px solid #0f766e",
      boxShadow: "none",
    },
    ".Tab": {
      border: "1px solid rgba(20, 49, 58, 0.12)",
      boxShadow: "none",
    },
    ".Tab--selected": {
      border: "1px solid #0f766e",
      boxShadow: "none",
    },
  },
};

interface DonateSheetProps {
  open: boolean;
  onClose: () => void;
}

export function DonateSheet({ open, onClose }: DonateSheetProps) {
  const [amount, setAmount] = useState<(typeof DONATE_PRESETS)[number] | "custom">(
    500,
  );
  const [customYen, setCustomYen] = useState("800");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const selectedAmount = useMemo(() => {
    if (amount === "custom") {
      const n = Number.parseInt(customYen, 10);
      return Number.isFinite(n) ? n : NaN;
    }
    return amount;
  }, [amount, customYen]);

  useEffect(() => {
    if (!open) return;
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
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setClientSecret(null);
      setError(null);
      setSucceeded(false);
      setPreparing(false);
    }
  }, [open]);

  if (!open) return null;

  async function startCheckout() {
    if (!isAllowedDonateAmount(selectedAmount)) {
      setError(
        `${DONATE_MIN_YEN}〜${DONATE_MAX_YEN}円の範囲で選んでください。`,
      );
      return;
    }
    setPreparing(true);
    setError(null);
    try {
      const res = await fetch("/api/donate/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selectedAmount }),
      });
      const data = (await res.json()) as { clientSecret?: string; error?: string };
      if (!res.ok || !data.clientSecret) {
        throw new Error(data.error ?? "決済の準備に失敗しました。");
      }
      setClientSecret(data.clientSecret);
    } catch (e) {
      setError(e instanceof Error ? e.message : "決済の準備に失敗しました。");
    } finally {
      setPreparing(false);
    }
  }

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
        aria-labelledby="donate-title"
        className="animate-sheet relative z-10 flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[1.75rem] border border-[var(--line)] bg-[var(--bg-1)] shadow-[var(--shadow)] sm:rounded-[1.75rem]"
      >
        <div className="relative overflow-hidden border-b border-[var(--line)] px-6 pb-5 pt-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-[var(--accent)]/15 blur-2xl"
          />
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
            Optional
          </p>
          <h2
            id="donate-title"
            className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--brand-deep)]"
          >
            コーヒーをおごる
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
            いただいた支援は、サーバー代などシステムの維持管理に活用します。会員登録は不要で、Google
            Pay・Apple Pay・クレジットカードで支払えます。任意です。支援の有無で機能は変わりません。
          </p>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          {succeeded ? (
            <div className="space-y-3 py-6 text-center">
              <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--brand-deep)]">
                ありがとうございます
              </p>
              <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
                支援を受け取りました。サーバー代など、システムの維持管理に活用します。
              </p>
            </div>
          ) : clientSecret && isAllowedDonateAmount(selectedAmount) ? (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setClientSecret(null)}
                className="text-sm font-medium text-[var(--brand-deep)] underline decoration-[var(--brand)]/30 underline-offset-4"
              >
                金額を選び直す
              </button>
              <p className="text-sm text-[var(--ink)]">
                {formatYen(selectedAmount)} の支援
              </p>
              {STRIPE_IS_TEST ? (
                <div className="rounded-2xl border border-dashed border-[var(--brand)]/40 bg-white/70 px-4 py-3 text-sm leading-relaxed text-[var(--ink)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
                    テストカード
                  </p>
                  <p className="mt-2 font-mono text-[13px]">4242 4242 4242 4242</p>
                  <p className="mt-1 text-[12px] text-[var(--ink-muted)]">
                    有効期限は未来の月、CVC は 3桁なら何でも可。失敗させるなら
                    4000 0000 0000 0002。本番のカードは使えません。
                  </p>
                </div>
              ) : null}
              <Elements
                key={clientSecret}
                stripe={getStripePromise()}
                options={{
                  clientSecret,
                  appearance: APPEARANCE,
                  locale: "ja",
                }}
              >
                <DonateCheckoutForm
                  amount={selectedAmount}
                  onSuccess={() => setSucceeded(true)}
                />
              </Elements>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
                金額
              </p>
              <div className="grid grid-cols-3 gap-2">
                {DONATE_PRESETS.map((yen) => {
                  const active = amount === yen;
                  return (
                    <button
                      key={yen}
                      type="button"
                      onClick={() => setAmount(yen)}
                      className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                        active
                          ? "border-[var(--brand)] bg-white text-[var(--brand-deep)] shadow-sm"
                          : "border-[var(--line)] bg-white/50 text-[var(--ink-muted)]"
                      }`}
                    >
                      {formatYen(yen)}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setAmount("custom")}
                className={`w-full rounded-2xl border px-3 py-3 text-left text-sm transition ${
                  amount === "custom"
                    ? "border-[var(--brand)] bg-white text-[var(--brand-deep)]"
                    : "border-[var(--line)] bg-white/50 text-[var(--ink-muted)]"
                }`}
              >
                ほかの金額
              </button>
              {amount === "custom" ? (
                <label className="block space-y-2 text-sm">
                  <span className="text-[var(--ink-muted)]">
                    {DONATE_MIN_YEN}〜{DONATE_MAX_YEN}円
                  </span>
                  <input
                    inputMode="numeric"
                    value={customYen}
                    onChange={(e) => setCustomYen(e.target.value.replace(/\D/g, ""))}
                    className="w-full rounded-xl border border-[var(--line)] bg-white/70 px-3 py-3 outline-none focus:border-[var(--brand)]"
                  />
                </label>
              ) : null}
              {error ? <p className="text-sm text-[var(--accent)]">{error}</p> : null}
              <button
                type="button"
                onClick={() => void startCheckout()}
                disabled={preparing}
                className="w-full rounded-2xl bg-[var(--brand)] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--brand-deep)] disabled:opacity-60"
              >
                {preparing ? "準備中…" : "支払いへ"}
              </button>
              <p className="text-center text-[11px] leading-relaxed text-[var(--ink-muted)]">
                決済は Stripe が処理します。カード情報は本アプリのサーバには保存されません。
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-[var(--line)] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3.5 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--brand)]/40"
          >
            {succeeded ? "閉じる" : "いまはしない"}
          </button>
        </div>
      </div>
    </div>
  );
}
