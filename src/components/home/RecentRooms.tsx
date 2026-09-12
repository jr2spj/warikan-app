"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  loadRecentRooms,
  removeRecentRoom,
  type RecentRoomEntry,
} from "@/lib/recent-rooms";

export function RecentRooms() {
  const [rooms, setRooms] = useState<RecentRoomEntry[]>([]);

  useEffect(() => {
    setRooms(loadRecentRooms());
  }, []);

  if (rooms.length === 0) return null;

  function handleRemove(id: string) {
    removeRecentRoom(id);
    setRooms(loadRecentRooms());
  }

  return (
    <section className="animate-rise-delay-2 space-y-4">
      <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
        最近の割り勘
      </h2>
      <ul className="space-y-2">
        {rooms.map((room) => (
          <li
            key={room.id}
            className="flex items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 backdrop-blur-sm"
          >
            <Link
              href={`/w/${room.id}`}
              className="min-w-0 flex-1 transition hover:text-[var(--brand)]"
            >
              <p className="truncate font-medium">{room.name}</p>
              <p className="truncate text-xs text-[var(--ink-muted)]">/w/{room.id}</p>
            </Link>
            <button
              type="button"
              onClick={() => handleRemove(room.id)}
              className="shrink-0 rounded-lg px-2 py-1 text-xs text-[var(--ink-muted)] hover:bg-black/5 hover:text-[var(--ink)]"
              aria-label={`${room.name}を履歴から削除`}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
