import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reorderSchema = z.array(z.object({ id: z.string(), order: z.number().int() }));

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await prisma.$transaction(
    parsed.data.map(({ id, order }) =>
      prisma.project.update({ where: { id }, data: { order } })
    )
  );

  revalidatePath("/");
  revalidatePath("/admin/projects");
  return NextResponse.json({ data: { updated: parsed.data.length } });
}
