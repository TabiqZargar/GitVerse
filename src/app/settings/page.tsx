"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/use-auth";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("appearance");

  return (
    <div className="p-unit-xxl">
      <div className="glass-panel rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-white/5 p-unit-lg flex flex-col gap-unit-md border-r border-white/5">
          <h2 className="font-headline-sm text-headline-sm font-black text-primary tracking-tighter mb-unit-lg">GitVerse Settings</h2>
          <nav className="flex flex-col gap-2">
            {[
              { id: "appearance", label: "Appearance", icon: "palette" },
              { id: "github", label: "GitHub Connection", icon: "hub" },
              { id: "export", label: "Export Assets", icon: "output" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                  activeTab === tab.id
                    ? "text-primary bg-primary/10 shadow-[0_0_15px_-3px_rgba(210,187,255,0.2)]"
                    : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface"
                )}
              >
                <span className="material-symbols-outlined">{tab.icon}</span>
                <span className="font-label-mono text-label-mono">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <section className="flex-1 overflow-y-auto p-unit-xxl">
          {activeTab === "appearance" && (
            <div className="flex flex-col gap-unit-xl">
              <header>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Visual Environment</h2>
                <p className="text-on-surface-variant font-body-sm">Customize how your galaxy and repository clusters are rendered.</p>
              </header>
              <div className="grid gap-unit-lg">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="font-label-mono text-label-mono text-primary uppercase">Theme Mode</span>
                  <div className="flex bg-surface-dim p-1 rounded-full border border-white/10">
                    <button className="p-2 rounded-full text-on-surface-variant">Light</button>
                    <button className="p-2 rounded-full bg-primary text-on-primary shadow-lg">Dark</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "github" && (
            <div className="flex flex-col gap-unit-xl">
              <header>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">GitHub Connection</h2>
                <p className="text-on-surface-variant font-body-sm">Manage your GitHub account connection and permissions.</p>
              </header>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-on-surface-variant text-sm mb-2">Connected as <strong className="text-on-surface">{user?.name ?? "GitHub user"}</strong></p>
                <p className="text-on-surface-variant text-xs">Your OAuth token is managed by Auth.js. Re-authenticate below if needed.</p>
                <div className="mt-unit-lg flex gap-unit-md">
                  <Link href="/api/auth/signin" className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-label-mono uppercase hover:bg-primary hover:text-on-primary transition-all">Reconnect</Link>
                  <Link href="/api/auth/signout" className="px-4 py-2 rounded-xl bg-white/5 text-on-surface-variant font-label-mono uppercase hover:bg-white/10 transition-all">Disconnect</Link>
                </div>
              </div>
            </div>
          )}
          {activeTab === "export" && (
            <div className="flex flex-col gap-unit-xl">
              <header>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Export Snapshot</h2>
                <p className="text-on-surface-variant font-body-sm">Download high-fidelity renders.</p>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
                <div className="p-4 rounded-3xl bg-white/5 border border-white/5">
                  <h4 className="font-bold text-on-surface mb-1">Static Canvas</h4>
                  <button className="w-full py-2 mt-4 rounded-xl bg-primary/10 text-primary font-label-mono uppercase hover:bg-primary hover:text-on-primary">Download PNG</button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
