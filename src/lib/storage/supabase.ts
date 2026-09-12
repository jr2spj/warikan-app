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

function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );
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

      if (error) throw new Error(error.message);
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

      if (error) throw new Error(error.message);
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

      if (error) throw new Error(error.message);
      return rowToRoom(data as RoomRow);
    },
  };
}
