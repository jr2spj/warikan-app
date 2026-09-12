"use client";

import { useMemo, useState } from "react";
import {
  calculateSettlement,
  formatSettlementText,
} from "@/lib/settlement";
import type { RoundingMode } from "@/lib/types";
import { useRoomStore } from "@/store/room-store";

const ROUNDING_LABELS: Record<RoundingMode, string> = {
  ceil_1: "1円単位で切り上げ",
  ceil_10: "10円単位で切り上げ",
  ceil_100: "100円単位で切り上げ",
};

export function SettlementSection() {
  const room = useRoomStore((s) => s.room);
  const setRoundingMode = useRoomStore((s) => s.setRoundingMode);
  const [copied, setCopied] = useState<"result" | "url" | null>(null);

  const result = useMemo(() => {
    if (!room) return null;
    return calculateSettlement(room.members, room.payments, room.roundingMode);
  }, [room]);

  if (!room || !result) return null;

  const nameOf = (id: string) =>
    room.members.find((m) => m.id === id)?.name ?? "不明";

  async function copyText(kind: "result" | "url") {
    const text =
      kind === "url"
        ? window.location.href
        : formatSettlementText(room.name, room.members, result!);

    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      // ignore
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">精算結果</h2>
        <select
          value={room.roundingMode}
          onChange={(e) => setRoundingMode(e.target.value as RoundingMode)}
          className="rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2 text-sm outline-none focus:border-[var(--brand)]"
          aria-label="端数処理"
        >
          {(Object.keys(ROUNDING_LABELS) as RoundingMode[]).map((mode) => (
            <option key={mode} value={mode}>
              {ROUNDING_LABELS[mode]}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 backdrop-blur-sm">
        <p className="text-sm text-[var(--ink-muted)]">支払い合計</p>
        <p className="mt-1 font-[family-name:var(--font-display)] text-3xl">
          ¥{result.totalPaid.toLocaleString("ja-JP")}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-[var(--ink-muted)]">最小送金</h3>
        {result.transfers.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[var(--line)] px-4 py-5 text-center text-sm text-[var(--ink-muted)]">
            精算の必要はありません
          </p>
        ) : (
          <ul className="space-y-2">
            {result.transfers.map((t, index) => (
              <li
                key={`${t.fromMemberId}-${t.toMemberId}-${index}`}
                className="rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3"
              >
                <p className="font-medium">
                  {nameOf(t.fromMemberId)}
                  <span className="mx-2 text-[var(--brand)]">→</span>
                  {nameOf(t.toMemberId)}
                </p>
                <p className="mt-1 text-lg text-[var(--brand-deep)]">
                  ¥{t.amount.toLocaleString("ja-JP")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-[var(--ink-muted)]">内訳</h3>
        <ul className="space-y-2">
          {result.balances.map((b) => (
            <li
              key={b.memberId}
              className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm backdrop-blur-sm"
            >
              <p className="font-medium">{b.name}</p>
              <p className="mt-1 text-[var(--ink-muted)]">
                支払 ¥{b.paid.toLocaleString("ja-JP")} / 負担 ¥
                {b.shouldPay.toLocaleString("ja-JP")} / 差引{" "}
                <span
                  className={
                    b.net > 0
                      ? "text-[var(--brand)]"
                      : b.net < 0
                        ? "text-[var(--accent)]"
                        : ""
                  }
                >
                  ¥{b.net.toLocaleString("ja-JP")}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => copyText("result")}
          className="rounded-xl bg-[var(--brand)] px-4 py-3 font-medium text-white transition hover:bg-[var(--brand-deep)]"
        >
          {copied === "result" ? "コピーしました" : "精算結果をコピー"}
        </button>
        <button
          type="button"
          onClick={() => copyText("url")}
          className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 font-medium transition hover:border-[var(--brand)]"
        >
          {copied === "url" ? "コピーしました" : "URLをコピー"}
        </button>
      </div>
    </section>
  );
}
