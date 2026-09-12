import { NextResponse } from "next/server";
import { ROOM_RETENTION_DAYS, retentionCutoffIso } from "@/lib/retention";
import { getRoomStore, getStorageMode } from "@/lib/storage";

export const runtime = "nodejs";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

/** Vercel Cron / 手動実行: 最終更新から90日超のルームを削除 */
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cutoff = retentionCutoffIso();
    const deleted = await getRoomStore().deleteExpiredRooms(cutoff);
    return NextResponse.json({
      ok: true,
      retentionDays: ROOM_RETENTION_DAYS,
      cutoff,
      deleted,
      storage: getStorageMode(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cleanup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
