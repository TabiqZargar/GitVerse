"use client";

interface ProfileWrappedProps {
  username: string;
}

export function ProfileWrapped({ username }: ProfileWrappedProps) {
  return (
    <a
      href={`/wrapped?username=${encodeURIComponent(username)}`}
      className="group flex items-center gap-3 rounded-xl border border-chart-1/20 bg-chart-1/5 p-4 transition-all hover:border-chart-1/40 hover:bg-chart-1/10"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/20">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-chart-1">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-semibold">View Developer Wrapped</span>
        <span className="text-xs text-muted-foreground">Your year in code, beautifully presented</span>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground group-hover:text-foreground transition-colors">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </a>
  );
}
