"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRoomStore } from "@/store/room-store";

export function PaymentSection() {
  const room = useRoomStore((s) => s.room);
  const addPayment = useRoomStore((s) => s.addPayment);
  const removePayment = useRoomStore((s) => s.removePayment);

  const [payerId, setPayerId] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState(true);

  const memberOptions = useMemo(() => room?.members ?? [], [room?.members]);

  const effectiveParticipants = useMemo(() => {
    if (allSelected) return memberOptions.map((m) => m.id);
    return participantIds;
  }, [allSelected, memberOptions, participantIds]);

  if (!room) return null;

  function toggleParticipant(id: string) {
    setAllSelected(false);
    setParticipantIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!room || memberOptions.length === 0) return;

    const resolvedPayer = payerId || memberOptions[0]?.id;
    const parsedAmount = Number.parseInt(amount, 10);
    if (!resolvedPayer || !Number.isFinite(parsedAmount) || parsedAmount <= 0) return;
    if (effectiveParticipants.length === 0) return;

    addPayment({
      payerId: resolvedPayer,
      title,
      amount: parsedAmount,
      participantIds: effectiveParticipants,
    });

    setTitle("");
    setAmount("");
    setAllSelected(true);
    setParticipantIds([]);
  }

  return (
    <section className="space-y-4">
      <h2 className="font-[family-name:var(--font-display)] text-2xl">立替・支払い</h2>

      {memberOptions.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--line)] px-4 py-6 text-center text-sm text-[var(--ink-muted)]">
          先にメンバーを追加してください
        </p>
      ) : (
        <form
          onSubmit={handleAdd}
          className="space-y-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 backdrop-blur-sm"
        >
          <select
            value={payerId || memberOptions[0]?.id || ""}
            onChange={(e) => setPayerId(e.target.value)}
            className="w-full rounded-xl border border-[var(--line)] bg-white/70 px-3 py-3 outline-none focus:border-[var(--brand)]"
            aria-label="支払った人"
          >
            {memberOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} が支払った
              </option>
            ))}
          </select>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="名目（例: 夕食代）"
            className="w-full rounded-xl border border-[var(--line)] bg-white/70 px-3 py-3 outline-none focus:border-[var(--brand)]"
          />

          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="金額（円）"
            className="w-full rounded-xl border border-[var(--line)] bg-white/70 px-3 py-3 outline-none focus:border-[var(--brand)]"
          />

          <fieldset className="space-y-2">
            <legend className="text-sm text-[var(--ink-muted)]">負担する人</legend>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => {
                  setAllSelected(e.target.checked);
                  if (e.target.checked) setParticipantIds([]);
                }}
              />
              全員
            </label>
            {!allSelected ? (
              <div className="flex flex-wrap gap-2">
                {memberOptions.map((m) => {
                  const checked = participantIds.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleParticipant(m.id)}
                      className={`rounded-xl border px-3 py-2 text-sm transition ${
                        checked
                          ? "border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand-deep)]"
                          : "border-[var(--line)] bg-white/60 text-[var(--ink-muted)]"
                      }`}
                    >
                      {m.name}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </fieldset>

          <button
            type="submit"
            className="w-full rounded-xl bg-[var(--brand)] px-4 py-3 font-medium text-white transition hover:bg-[var(--brand-deep)]"
          >
            支払いを追加
          </button>
        </form>
      )}

      <ul className="space-y-2">
        {room.payments.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-[var(--line)] px-4 py-6 text-center text-sm text-[var(--ink-muted)]">
            支払いがまだありません
          </li>
        ) : (
          [...room.payments].reverse().map((payment) => {
            const payer = room.members.find((m) => m.id === payment.payerId);
            const participants = payment.participantIds
              .map((id) => room.members.find((m) => m.id === id)?.name)
              .filter(Boolean)
              .join("・");

            return (
              <li
                key={payment.id}
                className="flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 backdrop-blur-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{payment.title}</p>
                  <p className="mt-1 text-sm text-[var(--ink-muted)]">
                    {payer?.name ?? "不明"}が ¥{payment.amount.toLocaleString("ja-JP")}
                  </p>
                  <p className="mt-1 text-xs text-[var(--ink-muted)]">
                    対象: {participants || "—"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removePayment(payment.id)}
                  className="rounded-lg px-2 py-1 text-sm text-[var(--ink-muted)] hover:bg-black/5 hover:text-[var(--accent)]"
                >
                  削除
                </button>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}
