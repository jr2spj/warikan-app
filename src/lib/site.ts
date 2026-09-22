export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://warikan-app-umber.vercel.app"
).replace(/\/$/, "");

/** 公開してよい開発者ニックネーム */
export const OPERATOR_NAME = (process.env.NEXT_PUBLIC_OPERATOR_NAME ?? "").trim();

/** 公開してよい連絡先。未設定なら画面には出さない */
export const CONTACT_EMAIL = (process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "").trim();

export function operatorContactLabel(): string | null {
  if (OPERATOR_NAME && CONTACT_EMAIL) return `${OPERATOR_NAME}（${CONTACT_EMAIL}）`;
  if (CONTACT_EMAIL) return CONTACT_EMAIL;
  if (OPERATOR_NAME) return OPERATOR_NAME;
  return null;
}
