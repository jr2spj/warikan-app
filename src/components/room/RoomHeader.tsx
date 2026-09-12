"use client";

import Link from "next/link";
import { useRoomStore } from "@/store/room-store";

interface RoomHeaderProps {
  saving: boolean;
}

export function RoomHeader({ saving }: RoomHeaderProps) {
  const room = useRoomStore((s) => s.room);
  const updateName = useRoomStore((s) => s.updateName);
  const storageMode = useRoomStore((s) => s.storageMode);

  if (!room) return null;

  return (
    <header className="animate-fade space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/"
          className="text-sm text-[var(--ink-muted)] transition hover:text-[var(--brand)]"
        >
          ← Warikan
        </Link>
        <div className="flex items-center gap-2 text-xs text-[var(--ink-muted)]">
          <span
            className={`inline-block h-2 w-2 rounded-full bg-[var(--brand)] ${saving ? "sync-dot" : ""}`}
          />
          {saving ? "同期中" : "同期済み"}
          {storageMode ? (
            <span className="rounded-md bg-black/5 px-1.5 py-0.5">
              {storageMode === "supabase" ? "Supabase" : "Demo"}
            </span>
          ) : null}
        </div>
      </div>

      <input
        type="text"
        value={room.name}
        onChange={(e) => updateName(e.target.value)}
        className="w-full border-0 bg-transparent font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)]"
        placeholder="割り勘の名前"
        aria-label="割り勘の名前"
      />
      <p className="text-sm text-[var(--ink-muted)]">/w/{room.id}</p>
    </header>
  );
}
