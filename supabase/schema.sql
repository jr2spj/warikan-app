-- Warikan App: Supabase schema
-- Supabase SQL Editor で実行してください。

create table if not exists public.rooms (
  id text primary key,
  name text not null default '新しい割り勘',
  members jsonb not null default '[]'::jsonb,
  payments jsonb not null default '[]'::jsonb,
  rounding_mode text not null default 'ceil_1'
    check (rounding_mode in ('ceil_1', 'ceil_10', 'ceil_100')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rooms_updated_at_idx on public.rooms (updated_at desc);

-- ログイン不要の共有アプリ向け: anon に CRUD を許可
-- ※ URLキーを知っている人のみアクセスする前提の簡易モデルです。
alter table public.rooms enable row level security;

drop policy if exists "Allow public read rooms" on public.rooms;
drop policy if exists "Allow public insert rooms" on public.rooms;
drop policy if exists "Allow public update rooms" on public.rooms;
drop policy if exists "Allow public delete rooms" on public.rooms;

create policy "Allow public read rooms"
  on public.rooms for select
  using (true);

create policy "Allow public insert rooms"
  on public.rooms for insert
  with check (true);

create policy "Allow public update rooms"
  on public.rooms for update
  using (true)
  with check (true);

create policy "Allow public delete rooms"
  on public.rooms for delete
  using (true);

-- Realtime（任意）
-- Dashboard > Database > Replication で rooms を有効化してください。
-- 既に追加済みの場合はエラーになるので、そのときはスキップで構いません。
-- alter publication supabase_realtime add table public.rooms;

-- 最終更新から90日超のルーム削除（手動確認用）
-- delete from public.rooms where updated_at < now() - interval '90 days';
