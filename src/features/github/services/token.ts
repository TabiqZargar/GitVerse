/**
 * Token retrieval helper.
 *
 * Architecture decision: tokens are fetched from the database on every request
 * rather than stored in the session. This ensures:
 * 1. The token can be revoked/replaced without re-authentication via session
 * 2. No sensitive data ever reaches the client bundle
 * 3. Prisma's connection pooling makes this cheap
 */

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuthenticationError } from "../errors";

export async function getGitHubToken(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new AuthenticationError();
  }

  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      provider: "github",
    },
    select: { access_token: true },
  });

  if (!account?.access_token) {
    throw new AuthenticationError();
  }

  return account.access_token;
}

export async function getAuthenticatedUser() {
  const session = await auth();
  if (!session?.user) {
    throw new AuthenticationError();
  }
  return session.user;
}
