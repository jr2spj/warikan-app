const STORAGE_KEY = "warikan:recent-rooms";

export interface RecentRoomEntry {
  id: string;
  name: string;
  visitedAt: string;
}

export function loadRecentRooms(): RecentRoomEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentRoomEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((r) => r && typeof r.id === "string" && typeof r.name === "string")
      .sort((a, b) => (a.visitedAt < b.visitedAt ? 1 : -1));
  } catch {
    return [];
  }
}

export function saveRecentRoom(id: string, name: string): void {
  if (typeof window === "undefined") return;
  const now = new Date().toISOString();
  const current = loadRecentRooms().filter((r) => r.id !== id);
  const next = [{ id, name, visitedAt: now }, ...current].slice(0, 12);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function removeRecentRoom(id: string): void {
  if (typeof window === "undefined") return;
  const next = loadRecentRooms().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
