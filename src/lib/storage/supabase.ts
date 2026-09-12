import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Room } from "@/lib/types";
import type { RoomStore } from "@/lib/storage/memory";

interface RoomRow {
  id: string;
  name: string;
  members: Room["members"];
  payments: Room["payments"];
  rounding_mode: Room["roundingMode"];
  created_at: string;
  updated_at: string;
}

/** Project URL only. Fixes common copy-paste mistakes from the Supabase dashboard. */
function normalizeSupabaseUrl(raw: string): string {
  let url = raw.trim().replace(/^['"]|['"]$/g, "");
  url = url.replace(/\/+$/, "");
  url = url.replace(/\/rest\/v1(?:\/.*)?$/i, "");
  url = url.replace(/\/+$/, "");
  return url;
}

function assertValidSupabaseUrl(url: string): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(
      "Supabase URL が不正です。https://xxxx.supabase.co の形で設定してください（/rest/v1 は不要）",
    );
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error(
      "Supabase URL が不正です。https://xxxx.supabase.co の形で設定してください",
    );
  }

  if (!parsed.hostname.includes("supabase")) {
    throw new Error(
      "Supabase URL が不正です。Project URL（https://xxxx.supabase.co）を貼ってください",
    );
  }
}

function getSupabaseAdmin(): SupabaseClient | null {
  const rawUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!rawUrl?.trim() || !key?.trim()) return null;
  const url = normalizeSupabaseUrl(rawUrl);
  assertValidSupabaseUrl(url);
  return createClient(url, key.trim(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function throwSupabaseError(error: { message: string }): never {
  const message = error.message;
  if (/invalid path/i.test(message)) {
    throw new Error(
      "Invalid path specified in request URL（Supabase URL の設定を確認してください。正しくは https://xxxx.supabase.co のみ）",
    );
  }
  throw new Error(message);
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url?.trim() && key?.trim());
}

function rowToRoom(row: RoomRow): Room {
  return {
    id: row.id,
    name: row.name,
    members: row.members ?? [],
    payments: row.payments ?? [],
    roundingMode: row.rounding_mode ?? "ceil_1",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createSupabaseStore(): RoomStore | null {
  const client = getSupabaseAdmin();
  if (!client) return null;

  return {
    async getRoom(id) {
      const { data, error } = await client
        .from("rooms")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throwSupabaseError(error);
      if (!data) return null;
      return rowToRoom(data as RoomRow);
    },

    async createRoom(room) {
      const { data, error } = await client
        .from("rooms")
        .insert({
          id: room.id,
          name: room.name,
          members: room.members,
          payments: room.payments,
          rounding_mode: room.roundingMode,
          created_at: room.createdAt,
          updated_at: room.updatedAt,
        })
        .select("*")
        .single();

      if (error) throwSupabaseError(error);
      return rowToRoom(data as RoomRow);
    },

    async updateRoom(id, room) {
      const updatedAt = new Date().toISOString();
      const { data, error } = await client
        .from("rooms")
        .update({
          name: room.name,
          members: room.members,
          payments: room.payments,
          rounding_mode: room.roundingMode,
          updated_at: updatedAt,
        })
        .eq("id", id)
        .select("*")
        .single();

      if (error) throwSupabaseError(error);
      return rowToRoom(data as RoomRow);
    },
  };
}
