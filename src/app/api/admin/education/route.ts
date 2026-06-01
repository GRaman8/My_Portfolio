import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { educationSchema } from "@/lib/validations/education";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const education = await prisma.education.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ data: education });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = educationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { startDate, endDate, ...rest } = parsed.data;
  const item = await prisma.education.create({
    data: { ...rest, startDate: new Date(startDate), endDate: endDate ? new Date(endDate) : null },
  });
  return NextResponse.json({ data: item }, { status: 201 });
}
