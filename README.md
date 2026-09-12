# Warikan App

URLキー共有型のリアルタイム割り勘 Web アプリです。ログイン不要で、`/w/[id]` を共有するだけで複数人が同じデータを編集・閲覧できます。

## 技術スタック

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Zustand（クライアント状態）
- ストレージ: Supabase（推奨） / メモリ（ローカル Demo）
- デプロイ想定: Vercel

## セットアップ

```bash
cd warikan-app
cp .env.example .env.local
npm install
npm run dev
```

http://localhost:3000 を開きます。

### Supabase（本番・複数人共有に必須）

1. Supabase プロジェクトを作成
2. `supabase/schema.sql` を SQL Editor で実行
3. `.env.local` に以下を設定

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

未設定の場合はプロセス内メモリに保存します（開発用。Vercel 本番ではインスタンス間で共有されません）。

> Vercel では `NEXT_PUBLIC_` 付きだと保存できないことがあります。上記の名前（プレフィックスなし）を使ってください。

## 主な機能

| 機能 | 内容 |
|------|------|
| ルーム作成 | トップのボタンで `/w/xxxxxx` を発行 |
| 最近の割り勘 | LocalStorage に閲覧履歴を保存 |
| メンバー | 追加・削除・掛け率（0.8 / 1.0 / 1.2 / 1.5 / カスタム） |
| 立替 | 支払者・名目・金額・負担対象を記録 |
| 精算 | 傾斜按分 + 端数切り上げ + 最小送金 |
| 共有 | 精算テキスト / URL をクリップボードへ |

## 精算ロジック

各支払いについて、対象メンバーの掛け率比率で負担額を按分します。

```
個人の負担 = 支払い金額 × (個人の掛け率 / 対象者の掛け率合計)
```

ネット残高（支払額 − 負担額）から債権者・債務者を貪欲マッチングし、送金回数を最小化します。

## ディレクトリ構成

```
src/
  app/                 # ページ・API Route
  components/home/     # トップ画面
  components/room/     # ルーム画面（単一 URL）
  hooks/               # ポーリング同期
  lib/                 # 型・精算・ストレージ
  store/               # Zustand
supabase/schema.sql    # DB スキーマ
```

## Vercel デプロイ

1. このリポジトリを Vercel に Import
2. 環境変数に Supabase の値を設定
3. Deploy
