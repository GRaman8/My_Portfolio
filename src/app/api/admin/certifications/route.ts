import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { certificationSchema } from "@/lib/validations/certification";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const certifications = await prisma.certification.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ data: certifications });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = certificationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { issuedDate, expiresDate, credentialUrl, imageUrl, ...rest } = parsed.data;
  const certification = await prisma.certification.create({
    data: {
      ...rest,
      issuedDate: issuedDate ? new Date(issuedDate) : null,
      expiresDate: expiresDate ? new Date(expiresDate) : null,
      credentialUrl: credentialUrl || null,
      imageUrl: imageUrl || null,
    },
  });
  return NextResponse.json({ data: certification }, { status: 201 });
}
