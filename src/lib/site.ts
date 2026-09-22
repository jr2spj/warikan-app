export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://warikan-app-umber.vercel.app"
).replace(/\/$/, "");

/** 公開してよい連絡先。未設定なら画面には出さない */
export const CONTACT_EMAIL = (process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "").trim();
