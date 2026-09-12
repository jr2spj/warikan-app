-- 既存プロジェクト向け追加分（SQL Editor で実行）
-- 90日自動削除は Vercel Cron → /api/cron/cleanup-rooms が主経路です。
-- service_role は RLS を迂回しますが、delete ポリシーも揃えておきます。

drop policy if exists "Allow public delete rooms" on public.rooms;

create policy "Allow public delete rooms"
  on public.rooms for delete
  using (true);
