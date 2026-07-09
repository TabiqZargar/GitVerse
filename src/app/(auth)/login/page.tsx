import { SignInButton } from "@/features/auth/components/sign-in-button";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="text-3xl font-bold">Welcome to GitVerse</h1>
      <p className="text-muted-foreground max-w-sm">
        Sign in with your GitHub account to visualize your contributions
      </p>
      <SignInButton />
    </div>
  );
}
