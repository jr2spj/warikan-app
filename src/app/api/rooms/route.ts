import { NextResponse } from "next/server";
import { createRoomId } from "@/lib/id";
import { getRoomStore, getStorageMode } from "@/lib/storage";
import { createEmptyRoom } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { name?: string };
    const store = getRoomStore();

    let id = createRoomId();
    // 衝突回避（メモリ／DB）
    for (let i = 0; i < 5; i += 1) {
      const existing = await store.getRoom(id);
      if (!existing) break;
      id = createRoomId();
    }

    const room = createEmptyRoom(id, body.name?.trim() || "新しい割り勘");
    const created = await store.createRoom(room);

    return NextResponse.json({ room: created, storage: getStorageMode() }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create room";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
