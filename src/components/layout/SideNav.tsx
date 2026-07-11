"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function SideNav() {
  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-unit-xl bottom-0 w-64 z-40 hidden xl:flex flex-col p-unit-md"
    >
      <div className="h-full bg-surface-container-low/80 backdrop-blur-md border-r border-white/5 rounded-2xl flex flex-col justify-between py-unit-lg shadow-xl">
        <div className="space-y-unit-sm px-unit-md">
          <div className="mb-unit-lg px-unit-sm">
            <h2 className="font-headline-sm text-primary font-black">Universe</h2>
            <p className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-widest">v2.4 Orbit</p>
          </div>
          <nav className="space-y-1" aria-label="Main navigation">
            {[
              { label: "Command Center", icon: "dashboard", href: "/dashboard" },
              { label: "Visualization", icon: "public", href: "/dashboard/visualization" },
              { label: "Analytics", icon: "analytics", href: "/dashboard/analytics" },
              { label: "Achievements", icon: "military_tech", href: "/achievements" },
              { label: "Settings", icon: "settings", href: "/settings" },
            ].map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-white/5 hover:text-on-surface rounded-lg transition-all duration-300 group"
              >
                <motion.span whileHover={{ rotate: 10 }} className="material-symbols-outlined" aria-hidden="true">{item.icon}</motion.span>
                <span className="font-label-mono text-label-mono">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="px-unit-md">
          <button className="w-full bg-primary-container text-on-primary-container py-3 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            Connect Repository
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
