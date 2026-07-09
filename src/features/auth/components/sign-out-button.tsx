"use client";

import { signOut } from "next-auth/react";
import { GradientButton } from "@/components/design-system/gradient-button";

export function SignOutButton() {
  return (
    <GradientButton variant="subtle" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
      Sign Out
    </GradientButton>
  );
}
