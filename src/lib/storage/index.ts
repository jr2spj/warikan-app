import { memoryStore, type RoomStore } from "@/lib/storage/memory";
import { createSupabaseStore, isSupabaseConfigured } from "@/lib/storage/supabase";

let cached: RoomStore | null = null;

export function getRoomStore(): RoomStore {
  if (cached) return cached;

  if (isSupabaseConfigured()) {
    const supabase = createSupabaseStore();
    if (supabase) {
      cached = supabase;
      return cached;
    }
  }

  cached = memoryStore;
  return cached;
}

export function getStorageMode(): "supabase" | "memory" {
  return isSupabaseConfigured() ? "supabase" : "memory";
}
