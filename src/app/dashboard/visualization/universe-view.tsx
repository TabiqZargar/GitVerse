"use client";

import { useUniverseData } from "@/features/repository-universe/hooks/use-universe-data";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useProfileStore } from "@/features/profile/store/profile-store";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import Link from "next/link";

const RepositoryUniverse = dynamic(
  () => import("@/features/repository-universe/components/repository-universe")
    .then((mod) => ({ default: mod.RepositoryUniverse })),
  { ssr: false, loading: () => <Skeleton className="h-[700px] w-full rounded-3xl" /> }
);

export function UniverseView() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const profile = useProfileStore((s) => s.profile);
  const { bodies, isLoading } = useUniverseData(username ?? undefined);

  const totalStars = profile?.totalStars ?? 0;
  const totalForks = profile?.repositories.reduce((s, r) => s + r.forks, 0) ?? 0;

  return (
    <div className="h-screen w-full relative overflow-hidden bg-[#050816]">
      <div className="fixed inset-0 z-0">
        <div className="starfield absolute inset-0 opacity-40"></div>
        <div className="absolute inset-0 aurora-bg"></div>
      </div>

      <div className="relative z-10 h-full w-full flex items-center justify-center">
        {isLoading ? (
            <Skeleton className="h-[500px] w-[500px] rounded-full" />
        ) : (
            <RepositoryUniverse bodies={bodies ?? []} isLoading={isLoading} />
        )}
      </div>

      <motion.section
        initial={{ x: 384 }}
        animate={{ x: 0 }}
        className="fixed right-unit-lg top-unit-xxl bottom-unit-lg w-96 z-30 glass-panel bg-surface-dim/40 border border-white/10 rounded-3xl p-unit-lg flex flex-col gap-unit-lg shadow-2xl"
      >
        <div className="space-y-unit-sm">
          <div className="flex justify-between items-start">
            <span className="text-primary font-label-mono text-[10px] tracking-widest uppercase">Currently Inspecting</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Repository Universe</h2>
          <p className="font-body-lg text-on-surface-variant/80 text-sm">Interactive visualization of {username ? `@${username}'s` : "your"} repository constellation.</p>
        </div>

        <div className="grid grid-cols-2 gap-unit-md">
          <div className="bg-white/5 p-unit-md rounded-xl border border-white/5">
            <span className="font-label-mono text-[10px] text-on-surface-variant block mb-1">Stars</span>
            <span className="font-headline-sm text-headline-sm">{totalStars.toLocaleString()}</span>
          </div>
          <div className="bg-white/5 p-unit-md rounded-xl border border-white/5">
            <span className="font-label-mono text-[10px] text-on-surface-variant block mb-1">Forks</span>
            <span className="font-headline-sm text-headline-sm">{totalForks.toLocaleString()}</span>
          </div>
        </div>
      </motion.section>

      {/* Bottom Dock Navigation */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 p-2 bg-surface-container-low/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl"
      >
        {[
            { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
            { label: "Landscape", icon: "terrain", href: "/landscape" },
            { label: "Wrapped", icon: "all_inclusive", href: "/wrapped" },
        ].map(item => (
            <Link key={item.href} href={item.href} className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">{item.icon}</span>
                <span className="text-sm text-on-surface-variant font-label-mono">{item.label}</span>
            </Link>
        ))}
      </motion.div>
    </div>
  );
}
