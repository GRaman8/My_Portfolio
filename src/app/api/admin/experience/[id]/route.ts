import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { experienceSchema } from "@/lib/validations/experience";
import { revalidatePath } from "next/cache";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const experience = await prisma.experience.findUnique({ where: { id } });
  if (!experience) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: experience });
}

export async function PUT(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = experienceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { startDate, endDate, ...rest } = parsed.data;
  const experience = await prisma.experience.update({
    where: { id },
    data: {
      ...rest,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/experience");
  return NextResponse.json({ data: experience });
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.experience.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/experience");
  return NextResponse.json({ data: { id } });
}
