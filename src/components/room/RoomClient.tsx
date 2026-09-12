"use client";

import { useState } from "react";
import { useRoomSync } from "@/hooks/useRoomSync";
import { MemberSection } from "@/components/room/MemberSection";
import { PaymentSection } from "@/components/room/PaymentSection";
import { RoomHeader } from "@/components/room/RoomHeader";
import { SettlementSection } from "@/components/room/SettlementSection";
import { SiteShell } from "@/components/legal/SiteShell";
import { useRoomStore } from "@/store/room-store";

type Tab = "members" | "payments" | "settlement";

const TABS: { id: Tab; label: string }[] = [
  { id: "members", label: "メンバー" },
  { id: "payments", label: "立替" },
  { id: "settlement", label: "精算" },
];

interface RoomClientProps {
  roomId: string;
}

export function RoomClient({ roomId }: RoomClientProps) {
  useRoomSync(roomId);
  const loading = useRoomStore((s) => s.loading);
  const error = useRoomStore((s) => s.error);
  const saving = useRoomStore((s) => s.saving);
  const [tab, setTab] = useState<Tab>("members");

  if (loading) {
    return (
      <SiteShell dense>
        <p className="py-24 text-center text-[var(--ink-muted)] sync-dot">
          読み込み中…
        </p>
      </SiteShell>
    );
  }

  if (error) {
    return (
      <SiteShell dense>
        <p className="py-24 text-center text-[var(--accent)]">{error}</p>
      </SiteShell>
    );
  }

  return (
    <SiteShell dense>
      <RoomHeader saving={saving} />

      <nav className="sticky top-0 z-20 -mx-5 mt-6 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-1)_88%,transparent)] px-5 py-2 backdrop-blur-md">
        <div className="grid grid-cols-3 gap-1 rounded-2xl bg-black/5 p-1">
          {TABS.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-white text-[var(--brand-deep)] shadow-sm"
                    : "text-[var(--ink-muted)]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="animate-rise mt-6">
        {tab === "members" ? <MemberSection /> : null}
        {tab === "payments" ? <PaymentSection /> : null}
        {tab === "settlement" ? <SettlementSection /> : null}
      </div>
    </SiteShell>
  );
}
