import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const productSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  priceInCents: z.coerce.number().int().positive(),
  category: z.string().min(2),
  images: z.array(z.string().url()).min(1),
  redirectUrl: z.string().url(),
  inventoryCount: z.coerce.number().int().min(0).default(0),
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export async function POST(request: Request) {
  const { userId, sessionClaims } = await auth();

  if (!userId || sessionClaims?.metadata?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await request.json();
  const parsed = productSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;
  const baseSlug = slugify(payload.title);
  const duplicateCount = await prisma.product.count({ where: { slug: { startsWith: baseSlug } } });

  const product = await prisma.product.create({
    data: {
      ...payload,
      slug: duplicateCount === 0 ? baseSlug : `${baseSlug}-${duplicateCount + 1}`,
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}
