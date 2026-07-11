"use client";

import { useRouter } from "next/navigation";
import { SearchBar } from "./search-bar";

export function LandingSearch() {
  const router = useRouter();

  const handleNavigate = (username: string) => {
    router.push(`/dashboard?username=${encodeURIComponent(username)}`);
  };

  return (
    <div className="w-full max-w-2xl">
      <SearchBar variant="hero" onNavigate={handleNavigate} />
    </div>
  );
}
