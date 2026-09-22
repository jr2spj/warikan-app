"use client";

import {
  ExpressCheckoutElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { formatYen } from "@/lib/donate";

interface DonateCheckoutFormProps {
  amount: number;
  onSuccess: () => void;
}

function returnUrl(): string {
  return `${window.location.origin}/donate/complete`;
}

export function DonateCheckoutForm({ amount, onSuccess }: DonateCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wallets, setWallets] = useState(false);

  async function confirm() {
    if (!stripe || !elements) return;
    setBusy(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? "入力内容を確認してください。");
      setBusy(false);
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl() },
      redirect: "if_required",
    });

    if (result.error) {
      setError(result.error.message ?? "決済を完了できませんでした。");
      setBusy(false);
      return;
    }

    if (result.paymentIntent?.status === "succeeded") {
      onSuccess();
    }
    setBusy(false);
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        void confirm();
      }}
    >
      <ExpressCheckoutElement
        options={{
          buttonHeight: 48,
          buttonType: { googlePay: "donate", applePay: "donate" },
          layout: { maxColumns: 2, maxRows: 2 },
          paymentMethods: {
            applePay: "always",
            googlePay: "always",
            paypal: "never",
            link: "never",
            amazonPay: "never",
            klarna: "never",
          },
        }}
        onReady={(event) => {
          const methods = event.availablePaymentMethods;
          setWallets(Boolean(methods?.applePay || methods?.googlePay));
        }}
        onConfirm={() => {
          void confirm();
        }}
      />

      {wallets ? (
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
          <span className="h-px flex-1 bg-[var(--line)]" />
          またはカード
          <span className="h-px flex-1 bg-[var(--line)]" />
        </div>
      ) : null}

      <PaymentElement
        options={{
          layout: "tabs",
          wallets: { applePay: "never", googlePay: "never" },
          fields: {
            billingDetails: {
              name: "auto",
              email: "auto",
            },
          },
        }}
      />

      {error ? <p className="text-sm text-[var(--accent)]">{error}</p> : null}

      <button
        type="submit"
        disabled={!stripe || busy}
        className="w-full rounded-2xl bg-[var(--brand)] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--brand-deep)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "処理中…" : `${formatYen(amount)} をおごる`}
      </button>
    </form>
  );
}
