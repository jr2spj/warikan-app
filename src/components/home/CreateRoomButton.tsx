"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateRoomButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "新しい割り勘" }),
      });
      const data = (await res.json()) as { room?: { id: string }; error?: string };
      if (!res.ok || !data.room) {
        throw new Error(data.error ?? "作成に失敗しました");
      }
      router.push(`/w/${data.room.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "作成に失敗しました");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleCreate}
        disabled={loading}
        className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-[var(--brand)] px-6 py-4 text-base font-semibold text-white shadow-[var(--shadow)] transition hover:bg-[var(--brand-deep)] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-[240px]"
      >
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition duration-700 group-hover:translate-x-full" />
        {loading ? "作成中…" : "新しい割り勘を作成"}
      </button>
      {error ? <p className="text-sm text-[var(--accent)]">{error}</p> : null}
    </div>
  );
}
