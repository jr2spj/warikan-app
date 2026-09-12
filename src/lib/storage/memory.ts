import type { Room } from "@/lib/types";

export interface RoomStore {
  getRoom(id: string): Promise<Room | null>;
  createRoom(room: Room): Promise<Room>;
  updateRoom(id: string, room: Room): Promise<Room>;
}

declare global {
  // eslint-disable-next-line no-var
  var __warikanMemoryStore: Map<string, Room> | undefined;
}

function getMemoryMap(): Map<string, Room> {
  if (!globalThis.__warikanMemoryStore) {
    globalThis.__warikanMemoryStore = new Map<string, Room>();
  }
  return globalThis.__warikanMemoryStore;
}

export const memoryStore: RoomStore = {
  async getRoom(id) {
    return getMemoryMap().get(id) ?? null;
  },
  async createRoom(room) {
    getMemoryMap().set(room.id, room);
    return room;
  },
  async updateRoom(id, room) {
    getMemoryMap().set(id, { ...room, id, updatedAt: new Date().toISOString() });
    return getMemoryMap().get(id)!;
  },
};
