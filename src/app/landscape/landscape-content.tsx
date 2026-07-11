"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useProfileStore } from "@/features/profile/store/profile-store";
import { LandscapeScene } from "@/features/visualization/components/landscape/landscape-scene";
import { GlassCard } from "@/components/shared/glass-card";
import { SectionHeader } from "@/components/shared/section-header";

export function LandscapeContent() {
  const searchParams = useSearchParams();
  const usernameParam = searchParams.get("username");
  const { profile, isLoading, fetchProfile } = useProfileStore();

  useEffect(() => {
    if (usernameParam) {
      fetchProfile(usernameParam);
    }
  }, [usernameParam, fetchProfile]);

  return (
    <div className="px-gutter py-unit-xxl max-w-container-max mx-auto space-y-gutter">
      <SectionHeader 
        title="Contribution Landscape" 
        subtitle="3D visualization of your contribution activity" 
      />
      
      <GlassCard className="h-[70vh] relative overflow-hidden" padding="sm">
        <LandscapeScene 
          days={profile?.contributions.map((d, i) => ({ 
            date: d.date, 
            count: d.count, 
            week: Math.floor(i / 7),
            dayOfWeek: i % 7,
            isCurrentStreak: false // Simplified for now
          }))} 
          isLoading={isLoading}
        />
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <GlassCard>
            <h3 className="font-label-mono text-primary text-[10px] uppercase">Terrain Biome</h3>
            <p className="text-sm text-on-surface-variant mt-2">The landscape is generated based on your yearly contribution volume, creating unique peaks and valleys for each year.</p>
        </GlassCard>
        <GlassCard>
            <h3 className="font-label-mono text-primary text-[10px] uppercase">Camera Controls</h3>
            <p className="text-sm text-on-surface-variant mt-2">Use mouse drag to rotate, scroll to zoom, and right-click to pan around the contribution terrain.</p>
        </GlassCard>
        <GlassCard>
            <h3 className="font-label-mono text-primary text-[10px] uppercase">Data Binding</h3>
            <p className="text-sm text-on-surface-variant mt-2">Every tile on this landscape is bound to your real GitHub contribution data from the active profile.</p>
        </GlassCard>
      </div>
    </div>
  );
}
