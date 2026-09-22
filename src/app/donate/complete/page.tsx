"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/legal/SiteShell";
import { STRIPE_PUBLISHABLE_KEY } from "@/lib/donate";

export default function DonateCompletePage() {
  const [message, setMessage] = useState("決済結果を確認しています…");

  useEffect(() => {
    const secret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret",
    );
    if (!secret || !STRIPE_PUBLISHABLE_KEY) {
      setMessage("このページは決済の戻り用です。トップから開発者を支援できます。");
      return;
    }

    let cancelled = false;
    (async () => {
      const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
      if (!stripe) {
        if (!cancelled) setMessage("決済ライブラリを読み込めませんでした。");
        return;
      }
      const { paymentIntent } = await stripe.retrievePaymentIntent(secret);
      if (cancelled) return;
      if (paymentIntent?.status === "succeeded") {
        setMessage("ありがとうございます。支援を受け取りました。");
      } else if (paymentIntent?.status === "processing") {
        setMessage("決済を処理しています。完了までしばらくお待ちください。");
      } else {
        setMessage("決済は完了していません。もう一度お試しください。");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SiteShell skipConsent>
      <header className="space-y-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
          Support
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--brand-deep)]">
          コーヒーをおごる
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-[var(--ink-muted)]">
          {message}
        </p>
      </header>
    </SiteShell>
  );
}
