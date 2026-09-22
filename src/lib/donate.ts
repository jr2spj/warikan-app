/** 任意の開発支援。Stripe があればアプリ内シート、なければ外部URL。 */

export const DONATE_URL = (process.env.NEXT_PUBLIC_DONATE_URL ?? "").trim();

export const DONATE_LABEL =
  process.env.NEXT_PUBLIC_DONATE_LABEL?.trim() || "コーヒーをおごる";

export const STRIPE_PUBLISHABLE_KEY = (
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
).trim();

export const STRIPE_DONATE_ENABLED = STRIPE_PUBLISHABLE_KEY.startsWith("pk_");

/** テストキーのときだけ、シートにテストカードを表示する */
export const STRIPE_IS_TEST = STRIPE_PUBLISHABLE_KEY.startsWith("pk_test_");

export const DONATE_ENABLED = STRIPE_DONATE_ENABLED || DONATE_URL.length > 0;

/** 円。ゲストが選びやすいコーヒー代サイズ */
export const DONATE_PRESETS = [300, 500, 1000] as const;

export const DONATE_MIN_YEN = 100;
export const DONATE_MAX_YEN = 3000;

export function isAllowedDonateAmount(value: unknown): value is number {
  if (typeof value !== "number" || !Number.isInteger(value)) return false;
  if (DONATE_PRESETS.includes(value as (typeof DONATE_PRESETS)[number])) {
    return true;
  }
  return value >= DONATE_MIN_YEN && value <= DONATE_MAX_YEN;
}

export function formatYen(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`;
}
