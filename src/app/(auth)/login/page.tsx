import { SignInButton } from "@/features/auth/components/sign-in-button";
import { LoginSearch } from "./login-search";

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Welcome to GitVerse</h1>
        <p className="text-muted-foreground max-w-sm">
          Enter a GitHub username to explore their coding universe, or sign in for richer insights.
        </p>
      </div>
      <LoginSearch />
      <div className="w-full max-w-sm flex items-center gap-3">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-on-surface-variant/50">or</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>
      <SignInButton callbackUrl={callbackUrl ?? "/dashboard"} />
    </div>
  );
}
