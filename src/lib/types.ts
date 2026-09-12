/** 掛け率プリセット */
export type WeightPreset = "none" | "less" | "more12" | "more15" | "custom";

export const WEIGHT_PRESET_VALUES: Record<Exclude<WeightPreset, "custom">, number> = {
  none: 1.0,
  less: 0.8,
  more12: 1.2,
  more15: 1.5,
};

export const WEIGHT_PRESET_LABELS: Record<WeightPreset, string> = {
  none: "なし (1.0x)",
  less: "少なめ (0.8x)",
  more12: "多め (1.2x)",
  more15: "多め (1.5x)",
  custom: "カスタム",
};

export interface Member {
  id: string;
  name: string;
  /** 傾斜（掛け率）。1.0 = 均等 */
  weight: number;
  weightPreset: WeightPreset;
  createdAt: string;
}

export interface Payment {
  id: string;
  /** 支払った人（立替者）のメンバーID */
  payerId: string;
  /** 名目 */
  title: string;
  /** 金額（円） */
  amount: number;
  /** 負担対象メンバーID。空配列は「全員」扱いにはせず、明示的に全員IDを入れる想定 */
  participantIds: string[];
  createdAt: string;
}

/** 端数処理モード */
export type RoundingMode = "ceil_1" | "ceil_10" | "ceil_100";

export interface Room {
  id: string;
  name: string;
  members: Member[];
  payments: Payment[];
  roundingMode: RoundingMode;
  createdAt: string;
  updatedAt: string;
}

export interface Transfer {
  fromMemberId: string;
  toMemberId: string;
  amount: number;
}

export interface MemberBalance {
  memberId: string;
  name: string;
  /** 支払った合計 */
  paid: number;
  /** 負担すべき合計（端数処理後） */
  shouldPay: number;
  /** 正なら受け取り、負なら支払い */
  net: number;
}

export interface SettlementResult {
  totalPaid: number;
  balances: MemberBalance[];
  transfers: Transfer[];
  roundingMode: RoundingMode;
}

export interface RecentRoom {
  id: string;
  name: string;
  visitedAt: string;
}

export type RoomPatch = Partial<
  Pick<Room, "name" | "members" | "payments" | "roundingMode">
>;

export function createEmptyRoom(id: string, name = "新しい割り勘"): Room {
  const now = new Date().toISOString();
  return {
    id,
    name,
    members: [],
    payments: [],
    roundingMode: "ceil_1",
    createdAt: now,
    updatedAt: now,
  };
}
