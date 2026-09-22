/** 開発者支援ページ。OFUSE / Ko-fi / Buy Me a Coffee などの公開URL */
export const DONATE_URL = (process.env.NEXT_PUBLIC_DONATE_URL ?? "").trim();

export const DONATE_LABEL =
  process.env.NEXT_PUBLIC_DONATE_LABEL?.trim() || "コーヒーを送る";

export const DONATE_ENABLED = DONATE_URL.length > 0;
