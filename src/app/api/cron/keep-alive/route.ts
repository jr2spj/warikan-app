import { NextResponse } from "next/server";
import { isCronAuthorized } from "@/lib/cron-auth";
import { getRoomStore, getStorageMode } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Vercel Cron / 手動実行: Supabase に最小クエリを投げて休止を防ぐ。
 * 無料プランは一定期間アクセスがないとプロジェクトが一時停止されるため。
 */
export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const storage = getStorageMode();
  if (storage !== "supabase") {
    return NextResponse.json(
      { error: "Supabase is not configured", storage },
      { status: 503 },
    );
  }

  try {
    const rooms = await getRoomStore().ping();
    return NextResponse.json({
      ok: true,
      storage,
      rooms,
      pingedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ping failed";
    return NextResponse.json({ error: message, storage }, { status: 500 });
  }
}
