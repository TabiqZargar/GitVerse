"use client";

import { SearchBar } from "@/features/profile/components/search-bar";

export function LoginSearch() {
  return (
    <div className="w-full max-w-sm">
      <SearchBar
        variant="minimal"
        placeholder="Search any GitHub username..."
        onNavigate={(username) => {
          window.location.href = `/u/${encodeURIComponent(username)}`;
        }}
      />
    </div>
  );
}
