"use client";

import { useState } from "react";
import { GlassCard } from "@/components/shared/glass-card";
import { SectionHeader } from "@/components/shared/section-header";
import { cn } from "@/lib/utils";

export function ExportContent() {
  const [template, setTemplate] = useState("minimal");

  return (
    <div className="px-gutter py-unit-xxl max-w-container-max mx-auto space-y-gutter">
      <SectionHeader 
        title="Export Studio" 
        subtitle="Turn your insights into shareable art" 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <GlassCard className="lg:col-span-2 aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-surface-container to-surface-dim">
            <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-primary/30 mb-4">preview</span>
                <p className="text-on-surface-variant font-label-mono">Live Preview Placeholder</p>
            </div>
        </GlassCard>

        <div className="space-y-gutter">
            <GlassCard>
                <SectionHeader title="Templates" />
                <div className="grid grid-cols-2 gap-2 mt-4">
                    {["minimal", "aurora", "cyber", "retro"].map(t => (
                        <button 
                            key={t}
                            onClick={() => setTemplate(t)}
                            className={cn(
                                "p-3 rounded-lg text-sm capitalize border transition-all",
                                template === t ? "border-primary bg-primary/10 text-primary" : "border-white/10 bg-white/5 hover:border-white/20"
                            )}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </GlassCard>
            
            <GlassCard>
                <SectionHeader title="Settings" />
                <div className="mt-4 space-y-4">
                    <button className="w-full py-3 bg-primary text-on-primary rounded-lg font-bold hover:scale-105 transition-transform">
                        Export as PNG
                    </button>
                    <button className="w-full py-3 bg-white/5 border border-white/10 text-on-surface rounded-lg font-medium hover:bg-white/10 transition-colors">
                        Copy to Clipboard
                    </button>
                </div>
            </GlassCard>
        </div>
      </div>
    </div>
  );
}
