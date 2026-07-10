"use client";

interface ProfileScoreProps {
  score: number;
  grade: string;
}

export function ProfileScore({ score, grade }: ProfileScoreProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-glass-border bg-glass p-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-chart-1/30">
        <span className="text-2xl font-black text-chart-1">{grade}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Developer Score</span>
        <span className="text-xl font-bold">{score}/100</span>
      </div>
    </div>
  );
}
