import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { contactSchema } from "@/lib/validations/contact";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const ipTimestamps = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (ipTimestamps.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  if (timestamps.length >= RATE_LIMIT_MAX) return true;
  timestamps.push(now);
  ipTimestamps.set(ip, timestamps);
  return false;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { name, email, message } = parsed.data;

  await prisma.contactMessage.create({ data: { name, email, message } });

  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_your_api_key_here") {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "portfolio@example.com",
      to: process.env.CONTACT_TO_EMAIL ?? "you@example.com",
      replyTo: email,
      subject: `Portfolio contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
  }

  return NextResponse.json({ data: { success: true } }, { status: 201 });
}
