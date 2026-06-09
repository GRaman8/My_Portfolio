import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { certificationSchema } from "@/lib/validations/certification";
import { revalidatePath } from "next/cache";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const certification = await prisma.certification.findUnique({ where: { id } });
  if (!certification) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: certification });
}

export async function PUT(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = certificationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { issuedDate, expiresDate, credentialUrl, imageUrl, ...rest } = parsed.data;
  const certification = await prisma.certification.update({
    where: { id },
    data: {
      ...rest,
      issuedDate: issuedDate ? new Date(issuedDate) : null,
      expiresDate: expiresDate ? new Date(expiresDate) : null,
      credentialUrl: credentialUrl || null,
      imageUrl: imageUrl || null,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/certifications");
  return NextResponse.json({ data: certification });
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.certification.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/certifications");
  return NextResponse.json({ data: { id } });
}
