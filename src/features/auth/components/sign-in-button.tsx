"use client";

import { signIn } from "next-auth/react";
import { GradientButton } from "@/components/design-system/gradient-button";

interface SignInButtonProps {
  provider?: string;
  callbackUrl?: string;
}

export function SignInButton({ provider = "github", callbackUrl = "/dashboard" }: SignInButtonProps) {
  return (
    <GradientButton size="lg" onClick={() => signIn(provider, { callbackUrl })}>
      Sign in with GitHub
    </GradientButton>
  );
}
