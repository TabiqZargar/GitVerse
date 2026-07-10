import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateId } from "@/lib/utils";

export type ShareContentType = "profile-snapshot" | "achievement" | "wrapped" | "streak";

interface CreateShareInput {
  userId: string;
  type: ShareContentType;
  data: Record<string, unknown>;
  expiresInDays?: number;
}

export async function createShareLink(input: CreateShareInput) {
  const id = generateId(12);
  const expiresAt = input.expiresInDays
    ? new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  const share = await prisma.share.create({
    data: {
      id,
      userId: input.userId,
      type: input.type,
      data: input.data as unknown as Prisma.InputJsonValue,
      expiresAt,
    },
  });

  return {
    id: share.id,
    url: `/share/${share.id}`,
  };
}

export async function getShareData(id: string) {
  const share = await prisma.share.findUnique({ where: { id } });
  if (!share) return null;
  if (share.expiresAt && new Date() > share.expiresAt) return null;

  await prisma.share.update({
    where: { id },
    data: { views: { increment: 1 } },
  });

  return {
    type: share.type as ShareContentType,
    data: share.data as Record<string, unknown>,
    createdAt: share.createdAt,
    views: share.views,
  };
}
