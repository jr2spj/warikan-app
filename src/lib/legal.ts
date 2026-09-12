import { ROOM_RETENTION_DAYS } from "@/lib/retention";

export const TERMS_STORAGE_KEY = "warikan:terms-accepted-v1";

export type LegalPanel = "notes" | "calculation";

export const LEGAL_PANELS: Record<
  LegalPanel,
  { title: string; eyebrow: string; sections: { heading: string; body: string }[] }
> = {
  notes: {
    title: "利用上の注意",
    eyebrow: "Before you start",
    sections: [
      {
        heading: "ログインなし・URL共有",
        body: "このサービスはログイン不要です。ルームURLを知っている人は誰でも閲覧・編集できます。URLの共有範囲には十分注意してください。",
      },
      {
        heading: "個人情報・機密情報",
        body: "氏名のフルネーム、口座番号、電話番号、住所など、特定につながる情報は入力しないでください。ニックネーム程度にとどめてください。",
      },
      {
        heading: `データの自動削除（${ROOM_RETENTION_DAYS}日）`,
        body: `最終更新日から${ROOM_RETENTION_DAYS}日が経過したルームは、自動的に削除されます。必要な精算結果は、期限前にコピーして保管してください。`,
      },
      {
        heading: "参考計算であること",
        body: "表示される精算結果は便宜上の参考値です。実際の送金・会計・トラブルについては、利用者同士で確認・責任を負うものとし、本サービスはその結果について責任を負いません。",
      },
      {
        heading: "可用性",
        body: "無料枠のインフラ上で動作するため、予告なく停止・データ消失・仕様変更が起こる可能性があります。重要な記録の唯一の保管場所としては使わないでください。",
      },
    ],
  },
  calculation: {
    title: "割り勘の計算方法",
    eyebrow: "How it works",
    sections: [
      {
        heading: "掛け率による按分",
        body: "各立替について、負担対象メンバーの掛け率の比率で金額を分けます。\n個人の負担 ＝ 支払金額 ×（個人の掛け率 ÷ 対象者の掛け率合計）",
      },
      {
        heading: "端数処理",
        body: "負担額は 1円 / 10円 / 100円 単位での切り上げを選べます。切り上げで合計が支払いを超えた分は、ネット残高が大きい人から順に調整します。",
      },
      {
        heading: "最小送金",
        body: "各人の「支払った額 − 負担すべき額」から債権者・債務者を求め、送金回数が少なくなるようマッチングします。表示は目安であり、実際の送金は利用者間で行ってください。",
      },
    ],
  },
};
