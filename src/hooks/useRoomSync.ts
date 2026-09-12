"use client";

import { useEffect, useRef } from "react";
import { saveRecentRoom } from "@/lib/recent-rooms";
import type { Room } from "@/lib/types";
import { useRoomStore } from "@/store/room-store";

const POLL_INTERVAL_MS = 2500;
const SAVE_DEBOUNCE_MS = 600;

async function fetchRoom(id: string): Promise<{
  room: Room;
  storage: "supabase" | "memory";
}> {
  const res = await fetch(`/api/rooms/${id}`, { cache: "no-store" });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "ルームを取得できませんでした");
  }
  return res.json() as Promise<{ room: Room; storage: "supabase" | "memory" }>;
}

async function putRoom(room: Room): Promise<{
  room: Room;
  storage: "supabase" | "memory";
}> {
  const res = await fetch(`/api/rooms/${room.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ room }),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "保存に失敗しました");
  }
  return res.json() as Promise<{ room: Room; storage: "supabase" | "memory" }>;
}

export function useRoomSync(roomId: string) {
  const hydrateFromServer = useRoomStore((s) => s.hydrateFromServer);
  const setLoading = useRoomStore((s) => s.setLoading);
  const setError = useRoomStore((s) => s.setError);
  const setSaving = useRoomStore((s) => s.setSaving);
  const markClean = useRoomStore((s) => s.markClean);
  const room = useRoomStore((s) => s.room);
  const dirty = useRoomStore((s) => s.dirty);

  const savingLock = useRef(false);
  const localUpdatedAt = useRef<string | null>(null);

  // 初回ロード
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const data = await fetchRoom(roomId);
        if (cancelled) return;
        hydrateFromServer(data.room, data.storage);
        localUpdatedAt.current = data.room.updatedAt;
        saveRecentRoom(data.room.id, data.room.name);
      } catch (error) {
        if (cancelled) return;
        // 未作成ルームはクライアント側で空ルームを PUT して作成
        const empty: Room = {
          id: roomId,
          name: "新しい割り勘",
          members: [],
          payments: [],
          roundingMode: "ceil_1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        try {
          const created = await putRoom(empty);
          if (cancelled) return;
          hydrateFromServer(created.room, created.storage);
          localUpdatedAt.current = created.room.updatedAt;
          saveRecentRoom(created.room.id, created.room.name);
        } catch (createError) {
          const message =
            createError instanceof Error
              ? createError.message
              : error instanceof Error
                ? error.message
                : "読み込みに失敗しました";
          setError(message);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [roomId, hydrateFromServer, setLoading, setError]);

  // dirty 時のデバウンス保存
  useEffect(() => {
    if (!room || !dirty) return;

    const timer = window.setTimeout(async () => {
      if (savingLock.current) return;
      savingLock.current = true;
      setSaving(true);
      try {
        const saved = await putRoom(room);
        localUpdatedAt.current = saved.room.updatedAt;
        markClean();
        saveRecentRoom(saved.room.id, saved.room.name);
        useRoomStore.setState({ storageMode: saved.storage });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "保存に失敗しました";
        setError(message);
      } finally {
        setSaving(false);
        savingLock.current = false;
      }
    }, SAVE_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [room, dirty, setSaving, markClean, setError]);

  // 他端末からの更新をポーリング
  useEffect(() => {
    const timer = window.setInterval(async () => {
      if (dirty || savingLock.current) return;
      try {
        const data = await fetchRoom(roomId);
        if (
          localUpdatedAt.current &&
          data.room.updatedAt !== localUpdatedAt.current &&
          !useRoomStore.getState().dirty
        ) {
          hydrateFromServer(data.room, data.storage);
          localUpdatedAt.current = data.room.updatedAt;
          saveRecentRoom(data.room.id, data.room.name);
        }
      } catch {
        // ポーリング失敗は黙ってスキップ
      }
    }, POLL_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [roomId, dirty, hydrateFromServer]);
}
