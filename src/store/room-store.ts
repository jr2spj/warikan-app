"use client";

import { create } from "zustand";
import { createEntityId } from "@/lib/id";
import type {
  Member,
  Payment,
  Room,
  RoundingMode,
  WeightPreset,
} from "@/lib/types";
import { WEIGHT_PRESET_VALUES } from "@/lib/types";

interface RoomState {
  room: Room | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  storageMode: "supabase" | "memory" | null;
  dirty: boolean;

  setRoom: (room: Room) => void;
  hydrateFromServer: (room: Room, storageMode: "supabase" | "memory") => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSaving: (saving: boolean) => void;

  updateName: (name: string) => void;
  setRoundingMode: (mode: RoundingMode) => void;

  addMember: (name: string, preset?: WeightPreset, customWeight?: number) => void;
  updateMember: (
    id: string,
    patch: Partial<Pick<Member, "name" | "weight" | "weightPreset">>,
  ) => void;
  removeMember: (id: string) => void;

  addPayment: (input: {
    payerId: string;
    title: string;
    amount: number;
    participantIds: string[];
  }) => void;
  updatePayment: (
    id: string,
    patch: Partial<Pick<Payment, "payerId" | "title" | "amount" | "participantIds">>,
  ) => void;
  removePayment: (id: string) => void;

  markClean: () => void;
}

function touch(room: Room): Room {
  return { ...room, updatedAt: new Date().toISOString() };
}

export const useRoomStore = create<RoomState>((set, get) => ({
  room: null,
  loading: true,
  saving: false,
  error: null,
  storageMode: null,
  dirty: false,

  setRoom: (room) => set({ room, dirty: true }),
  hydrateFromServer: (room, storageMode) =>
    set({ room, storageMode, loading: false, error: null, dirty: false }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  setSaving: (saving) => set({ saving }),
  markClean: () => set({ dirty: false }),

  updateName: (name) => {
    const room = get().room;
    if (!room) return;
    set({ room: touch({ ...room, name }), dirty: true });
  },

  setRoundingMode: (roundingMode) => {
    const room = get().room;
    if (!room) return;
    set({ room: touch({ ...room, roundingMode }), dirty: true });
  },

  addMember: (name, preset = "none", customWeight) => {
    const room = get().room;
    if (!room) return;
    const weight =
      preset === "custom"
        ? Math.max(0.01, customWeight ?? 1)
        : WEIGHT_PRESET_VALUES[preset];

    const member: Member = {
      id: createEntityId(),
      name: name.trim() || "メンバー",
      weight,
      weightPreset: preset,
      createdAt: new Date().toISOString(),
    };

    set({
      room: touch({ ...room, members: [...room.members, member] }),
      dirty: true,
    });
  },

  updateMember: (id, patch) => {
    const room = get().room;
    if (!room) return;

    const members = room.members.map((m) => {
      if (m.id !== id) return m;
      const nextPreset = patch.weightPreset ?? m.weightPreset;
      let weight = patch.weight ?? m.weight;
      if (patch.weightPreset && patch.weightPreset !== "custom") {
        weight = WEIGHT_PRESET_VALUES[patch.weightPreset];
      }
      return {
        ...m,
        ...patch,
        weightPreset: nextPreset,
        weight,
      };
    });

    set({ room: touch({ ...room, members }), dirty: true });
  },

  removeMember: (id) => {
    const room = get().room;
    if (!room) return;

    const members = room.members.filter((m) => m.id !== id);
    const payments = room.payments
      .filter((p) => p.payerId !== id)
      .map((p) => ({
        ...p,
        participantIds: p.participantIds.filter((pid) => pid !== id),
      }))
      .filter((p) => p.participantIds.length > 0);

    set({ room: touch({ ...room, members, payments }), dirty: true });
  },

  addPayment: ({ payerId, title, amount, participantIds }) => {
    const room = get().room;
    if (!room) return;

    const payment: Payment = {
      id: createEntityId(),
      payerId,
      title: title.trim() || "支払い",
      amount: Math.max(0, Math.floor(amount)),
      participantIds,
      createdAt: new Date().toISOString(),
    };

    set({
      room: touch({ ...room, payments: [...room.payments, payment] }),
      dirty: true,
    });
  },

  updatePayment: (id, patch) => {
    const room = get().room;
    if (!room) return;
    const payments = room.payments.map((p) =>
      p.id === id
        ? {
            ...p,
            ...patch,
            amount:
              patch.amount !== undefined
                ? Math.max(0, Math.floor(patch.amount))
                : p.amount,
          }
        : p,
    );
    set({ room: touch({ ...room, payments }), dirty: true });
  },

  removePayment: (id) => {
    const room = get().room;
    if (!room) return;
    set({
      room: touch({
        ...room,
        payments: room.payments.filter((p) => p.id !== id),
      }),
      dirty: true,
    });
  },
}));
