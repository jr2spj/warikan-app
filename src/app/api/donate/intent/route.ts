import { NextResponse } from "next/server";
import { isAllowedDonateAmount } from "@/lib/donate";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "支援の決済は現在利用できません。" },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as { amount?: unknown };
  const amount = typeof body.amount === "number" ? body.amount : Number(body.amount);

  if (!isAllowedDonateAmount(amount)) {
    return NextResponse.json({ error: "この金額では支援できません。" }, { status: 400 });
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: "jpy",
      payment_method_types: ["card"],
      description: `Warikan 任意の開発支援 ${amount}円`,
      metadata: { app: "warikan", kind: "coffee" },
      statement_descriptor_suffix: "WARIKAN",
    });

    if (!intent.client_secret) {
      return NextResponse.json({ error: "決済の準備に失敗しました。" }, { status: 500 });
    }

    return NextResponse.json({ clientSecret: intent.client_secret, amount });
  } catch (error) {
    const message = error instanceof Error ? error.message : "決済の準備に失敗しました。";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
