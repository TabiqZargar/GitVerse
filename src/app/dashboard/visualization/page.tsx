"use client";

import { useUniverseData } from "@/features/repository-universe/hooks/use-universe-data";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const RepositoryUniverse = dynamic(
  () => import("@/features/repository-universe/components/repository-universe")
    .then((mod) => ({ default: mod.RepositoryUniverse })),
  { ssr: false, loading: () => <Skeleton className="h-[700px] w-full rounded-3xl" /> }
);

export default function UniversePage() {
  const { bodies, isLoading } = useUniverseData();

  return (
    <div className="h-screen w-full relative overflow-hidden bg-[#050816]">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 z-0">
        <div className="starfield absolute inset-0 opacity-40"></div>
        <div className="absolute inset-0 aurora-bg"></div>
      </div>

      {/* Main Universe View */}
      <div className="relative z-10 h-full w-full flex items-center justify-center">
        {isLoading ? (
            <Skeleton className="h-[500px] w-[500px] rounded-full" />
        ) : (
            <RepositoryUniverse bodies={bodies ?? []} isLoading={isLoading} />
        )}
      </div>
      
      {/* Inspector Panel - Polished */}
      <motion.section 
        initial={{ x: 384 }}
        animate={{ x: 0 }}
        className="fixed right-unit-lg top-unit-xxl bottom-unit-lg w-96 z-30 glass-panel bg-surface-dim/40 border border-white/10 rounded-3xl p-unit-lg flex flex-col gap-unit-lg shadow-2xl"
      >
        <div className="space-y-unit-sm">
          <div className="flex justify-between items-start">
            <span className="text-primary font-label-mono text-[10px] tracking-widest uppercase">Currently Inspecting</span>
            <button className="material-symbols-outlined text-on-surface-variant hover:text-on-surface transition-colors">close</button>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Repository Universe</h2>
          <p className="font-body-lg text-on-surface-variant/80 text-sm">Interactive visualization of your repository constellation.</p>
        </div>
        
        <div className="grid grid-cols-2 gap-unit-md">
          <div className="bg-white/5 p-unit-md rounded-xl border border-white/5">
            <span className="font-label-mono text-[10px] text-on-surface-variant block mb-1">Stars</span>
            <span className="font-headline-sm text-headline-sm">0</span>
          </div>
          <div className="bg-white/5 p-unit-md rounded-xl border border-white/5">
            <span className="font-label-mono text-[10px] text-on-surface-variant block mb-1">Forks</span>
            <span className="font-headline-sm text-headline-sm">0</span>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
