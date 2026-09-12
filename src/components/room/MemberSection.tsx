"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  WEIGHT_PRESET_LABELS,
  WEIGHT_PRESET_VALUES,
  type WeightPreset,
} from "@/lib/types";
import { useRoomStore } from "@/store/room-store";

const PRESETS: WeightPreset[] = ["none", "less", "more12", "more15", "custom"];

export function MemberSection() {
  const room = useRoomStore((s) => s.room);
  const addMember = useRoomStore((s) => s.addMember);
  const updateMember = useRoomStore((s) => s.updateMember);
  const removeMember = useRoomStore((s) => s.removeMember);

  const [name, setName] = useState("");
  const [preset, setPreset] = useState<WeightPreset>("none");
  const [customWeight, setCustomWeight] = useState("1.0");

  const weightSum = useMemo(
    () => room?.members.reduce((sum, m) => sum + m.weight, 0) ?? 0,
    [room?.members],
  );

  if (!room) return null;

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const custom = Number.parseFloat(customWeight);
    addMember(name, preset, Number.isFinite(custom) ? custom : 1);
    setName("");
    setPreset("none");
    setCustomWeight("1.0");
  }

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">メンバー</h2>
        <p className="text-xs text-[var(--ink-muted)]">
          掛け率合計 {weightSum.toFixed(1)}
        </p>
      </div>

      <form
        onSubmit={handleAdd}
        className="space-y-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 backdrop-blur-sm"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="名前を入力"
          className="w-full rounded-xl border border-[var(--line)] bg-white/70 px-3 py-3 outline-none focus:border-[var(--brand)]"
        />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value as WeightPreset)}
            className="rounded-xl border border-[var(--line)] bg-white/70 px-3 py-3 outline-none focus:border-[var(--brand)]"
          >
            {PRESETS.map((p) => (
              <option key={p} value={p}>
                {WEIGHT_PRESET_LABELS[p]}
              </option>
            ))}
          </select>
          {preset === "custom" ? (
            <input
              type="number"
              min={0.01}
              step={0.1}
              value={customWeight}
              onChange={(e) => setCustomWeight(e.target.value)}
              className="rounded-xl border border-[var(--line)] bg-white/70 px-3 py-3 outline-none focus:border-[var(--brand)]"
              placeholder="掛け率"
            />
          ) : (
            <p className="flex items-center px-1 text-sm text-[var(--ink-muted)]">
              {WEIGHT_PRESET_VALUES[preset]}x
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-[var(--brand)] px-4 py-3 font-medium text-white transition hover:bg-[var(--brand-deep)]"
        >
          メンバーを追加
        </button>
      </form>

      <ul className="space-y-2">
        {room.members.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-[var(--line)] px-4 py-6 text-center text-sm text-[var(--ink-muted)]">
            まだメンバーがいません
          </li>
        ) : (
          room.members.map((member) => (
            <li
              key={member.id}
              className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 backdrop-blur-sm"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1 space-y-2">
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) =>
                      updateMember(member.id, { name: e.target.value })
                    }
                    className="w-full border-0 bg-transparent text-base font-medium outline-none"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={member.weightPreset}
                      onChange={(e) => {
                        const next = e.target.value as WeightPreset;
                        updateMember(member.id, {
                          weightPreset: next,
                          weight:
                            next === "custom"
                              ? member.weight
                              : WEIGHT_PRESET_VALUES[next],
                        });
                      }}
                      className="rounded-lg border border-[var(--line)] bg-white/80 px-2 py-1.5 text-sm"
                    >
                      {PRESETS.map((p) => (
                        <option key={p} value={p}>
                          {WEIGHT_PRESET_LABELS[p]}
                        </option>
                      ))}
                    </select>
                    {member.weightPreset === "custom" ? (
                      <input
                        type="number"
                        min={0.01}
                        step={0.1}
                        value={member.weight}
                        onChange={(e) =>
                          updateMember(member.id, {
                            weightPreset: "custom",
                            weight: Number.parseFloat(e.target.value) || 1,
                          })
                        }
                        className="w-24 rounded-lg border border-[var(--line)] bg-white/80 px-2 py-1.5 text-sm"
                      />
                    ) : (
                      <span className="text-sm text-[var(--ink-muted)]">
                        {member.weight}x
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeMember(member.id)}
                  className="rounded-lg px-2 py-1 text-sm text-[var(--ink-muted)] hover:bg-black/5 hover:text-[var(--accent)]"
                >
                  削除
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
