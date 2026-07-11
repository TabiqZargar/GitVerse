import { SignInButton } from "@/features/auth/components/sign-in-button";

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="text-3xl font-bold">Welcome to GitVerse</h1>
      <p className="text-muted-foreground max-w-sm">
        Sign in with your GitHub account to visualize your contributions
      </p>
      <SignInButton callbackUrl={callbackUrl ?? "/dashboard"} />
    </div>
  );
}
