import type {
  Member,
  MemberBalance,
  Payment,
  RoundingMode,
  SettlementResult,
  Transfer,
} from "@/lib/types";

function roundAmount(value: number, mode: RoundingMode): number {
  switch (mode) {
    case "ceil_10":
      return Math.ceil(value / 10) * 10;
    case "ceil_100":
      return Math.ceil(value / 100) * 100;
    case "ceil_1":
    default:
      return Math.ceil(value);
  }
}

/**
 * 各支払いについて、対象メンバーの掛け率比率で負担額を按分し、
 * 立替との差分からネット残高を求める。
 */
export function calculateSettlement(
  members: Member[],
  payments: Payment[],
  roundingMode: RoundingMode = "ceil_1",
): SettlementResult {
  const memberMap = new Map(members.map((m) => [m.id, m]));
  const paid = new Map<string, number>();
  const shouldPayRaw = new Map<string, number>();

  for (const member of members) {
    paid.set(member.id, 0);
    shouldPayRaw.set(member.id, 0);
  }

  let totalPaid = 0;

  for (const payment of payments) {
    if (!memberMap.has(payment.payerId) || payment.amount <= 0) continue;

    totalPaid += payment.amount;
    paid.set(payment.payerId, (paid.get(payment.payerId) ?? 0) + payment.amount);

    const participants = payment.participantIds
      .map((id) => memberMap.get(id))
      .filter((m): m is Member => Boolean(m));

    if (participants.length === 0) continue;

    const weightSum = participants.reduce((sum, m) => sum + m.weight, 0);
    if (weightSum <= 0) continue;

    for (const participant of participants) {
      const share = payment.amount * (participant.weight / weightSum);
      shouldPayRaw.set(
        participant.id,
        (shouldPayRaw.get(participant.id) ?? 0) + share,
      );
    }
  }

  // 端数処理後の負担額
  const shouldPayRounded = new Map<string, number>();
  let roundedSum = 0;
  for (const member of members) {
    const raw = shouldPayRaw.get(member.id) ?? 0;
    const rounded = roundAmount(raw, roundingMode);
    shouldPayRounded.set(member.id, rounded);
    roundedSum += rounded;
  }

  // 切り上げによる超過分をネットが大きい人から調整（送金最小化に影響しにくくする）
  let excess = roundedSum - totalPaid;
  if (excess > 0 && members.length > 0) {
    const unit = roundingMode === "ceil_100" ? 100 : roundingMode === "ceil_10" ? 10 : 1;
    const ordered = [...members].sort(
      (a, b) => (shouldPayRounded.get(b.id) ?? 0) - (shouldPayRounded.get(a.id) ?? 0),
    );
    let i = 0;
    while (excess >= unit && ordered.length > 0) {
      const target = ordered[i % ordered.length];
      const current = shouldPayRounded.get(target.id) ?? 0;
      if (current >= unit) {
        shouldPayRounded.set(target.id, current - unit);
        excess -= unit;
      }
      i += 1;
      if (i > ordered.length * 1000) break;
    }
  }

  const balances: MemberBalance[] = members.map((member) => {
    const p = paid.get(member.id) ?? 0;
    const s = shouldPayRounded.get(member.id) ?? 0;
    return {
      memberId: member.id,
      name: member.name,
      paid: p,
      shouldPay: s,
      net: p - s,
    };
  });

  const transfers = minimizeTransfers(balances);

  return {
    totalPaid,
    balances,
    transfers,
    roundingMode,
  };
}

/**
 * 債権者・債務者を貪欲にマッチングし、送金回数を最小化する。
 * （人数 n に対し最大 n-1 回の送金）
 */
export function minimizeTransfers(balances: MemberBalance[]): Transfer[] {
  type Node = { memberId: string; amount: number };

  const creditors: Node[] = [];
  const debtors: Node[] = [];

  for (const b of balances) {
    if (b.net > 0) creditors.push({ memberId: b.memberId, amount: b.net });
    else if (b.net < 0) debtors.push({ memberId: b.memberId, amount: -b.net });
  }

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transfers: Transfer[] = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(debtor.amount, creditor.amount);

    if (amount > 0) {
      transfers.push({
        fromMemberId: debtor.memberId,
        toMemberId: creditor.memberId,
        amount,
      });
    }

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount === 0) i += 1;
    if (creditor.amount === 0) j += 1;
  }

  return transfers;
}

export function formatSettlementText(
  roomName: string,
  members: Member[],
  result: SettlementResult,
): string {
  const nameOf = (id: string) => members.find((m) => m.id === id)?.name ?? "不明";

  const lines: string[] = [
    `【${roomName}】精算結果`,
    `合計: ¥${result.totalPaid.toLocaleString("ja-JP")}`,
    "",
  ];

  if (result.transfers.length === 0) {
    lines.push("精算の必要はありません。");
  } else {
    lines.push("▼ 送金一覧");
    for (const t of result.transfers) {
      lines.push(
        `${nameOf(t.fromMemberId)} → ${nameOf(t.toMemberId)} : ¥${t.amount.toLocaleString("ja-JP")}`,
      );
    }
  }

  lines.push("", "▼ 内訳");
  for (const b of result.balances) {
    lines.push(
      `${b.name}: 支払¥${b.paid.toLocaleString("ja-JP")} / 負担¥${b.shouldPay.toLocaleString("ja-JP")} / 差引¥${b.net.toLocaleString("ja-JP")}`,
    );
  }

  return lines.join("\n");
}
