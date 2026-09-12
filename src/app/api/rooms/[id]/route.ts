import { NextResponse } from "next/server";
import { getRoomStore, getStorageMode } from "@/lib/storage";
import type { Room } from "@/lib/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const store = getRoomStore();
    const room = await store.getRoom(id);

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ room, storage: getStorageMode() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch room";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as { room?: Room };
    if (!body.room || body.room.id !== id) {
      return NextResponse.json({ error: "Invalid room payload" }, { status: 400 });
    }

    const store = getRoomStore();
    const existing = await store.getRoom(id);

    const toSave: Room = {
      ...body.room,
      id,
      createdAt: existing?.createdAt ?? body.room.createdAt,
      updatedAt: new Date().toISOString(),
    };

    const room = existing
      ? await store.updateRoom(id, toSave)
      : await store.createRoom(toSave);

    return NextResponse.json({ room, storage: getStorageMode() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update room";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
