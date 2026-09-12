import {
  calculateSettlement,
  minimizeTransfers,
} from "@/lib/settlement";
import type { Member, Payment } from "@/lib/types";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

const members: Member[] = [
  {
    id: "a",
    name: "A",
    weight: 1,
    weightPreset: "none",
    createdAt: "",
  },
  {
    id: "b",
    name: "B",
    weight: 1,
    weightPreset: "none",
    createdAt: "",
  },
  {
    id: "c",
    name: "C",
    weight: 1.5,
    weightPreset: "more15",
    createdAt: "",
  },
];

const payments: Payment[] = [
  {
    id: "p1",
    payerId: "a",
    title: "dinner",
    amount: 3000,
    participantIds: ["a", "b", "c"],
    createdAt: "",
  },
];

const result = calculateSettlement(members, payments, "ceil_1");

assert(result.totalPaid === 3000, "totalPaid should be 3000");
assert(result.transfers.length > 0, "should have transfers");
assert(
  result.balances.reduce((s, b) => s + b.net, 0) === 0,
  "nets should sum to 0",
);

const transfers = minimizeTransfers([
  { memberId: "a", name: "A", paid: 0, shouldPay: 0, net: -1000 },
  { memberId: "b", name: "B", paid: 0, shouldPay: 0, net: -500 },
  { memberId: "c", name: "C", paid: 0, shouldPay: 0, net: 1500 },
]);

assert(transfers.length === 2, "minimizeTransfers should use 2 transfers");
assert(
  transfers.reduce((s, t) => s + t.amount, 0) === 1500,
  "transfer sum should match creditor",
);

console.log("settlement self-check OK");
