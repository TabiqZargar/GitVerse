"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useProfileStore } from "@/features/profile/store/profile-store";

const navItems = [
  { label: "Command Center", icon: "dashboard", href: "/dashboard" },
  { label: "Landscape", icon: "terrain", href: "/landscape" },
  { label: "Universe", icon: "public", href: "/dashboard/visualization" },
  { label: "Analytics", icon: "analytics", href: "/dashboard/analytics" },
  { label: "Wrapped", icon: "all_inclusive", href: "/wrapped" },
  { label: "Achievements", icon: "military_tech", href: "/achievements" },
  { label: "Export Studio", icon: "file_present", href: "/export" },
];

export function SideNav() {
  const pathname = usePathname();
  const activeUsername = useProfileStore((s) => s.activeUsername);

  const getHref = (href: string) => {
    if (!activeUsername) return href;
    // For dashboard, we want the base path
    if (href === "/dashboard") return href; 
    return `${href}?username=${encodeURIComponent(activeUsername)}`;
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 bottom-0 w-20 xl:w-64 z-40 hidden xl:flex flex-col pt-[90px] pb-unit-md px-2"
    >
      <div className="h-full bg-surface-container-low/60 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col justify-between py-unit-md shadow-xl hover:shadow-[0_0_30px_-5px_rgba(210,187,255,0.1)] transition-shadow">
        <div className="space-y-1 px-2">
          <div className="mb-unit-md px-3 hidden xl:block">
            <h2 className="font-headline-sm text-primary font-black">Universe</h2>
            <p className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-widest">v2.4 Orbit</p>
          </div>
          <div className="xl:hidden flex justify-center mb-unit-md px-2">
            <span className="material-symbols-outlined text-primary">public</span>
          </div>
          <nav className="space-y-1" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                  <Link
                  key={item.href}
                  href={getHref(item.href)}
                  className={cn(
                    "flex items-center gap-3 px-3 xl:px-4 py-3 rounded-xl transition-all duration-300 group relative",
                    isActive
                      ? "text-primary bg-primary/10 shadow-[0_0_15px_-3px_rgba(210,187,255,0.15)]"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-white/5",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <motion.span
                    whileHover={{ rotate: 10 }}
                    className="material-symbols-outlined relative z-10"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </motion.span>
                  <span className="font-label-mono text-label-mono relative z-10 hidden xl:block">
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary hidden xl:block shadow-[0_0_6px_1px_rgba(210,187,255,0.5)]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="px-2 xl:px-3 space-y-2">
          <div className="xl:hidden flex justify-center">
            <button className="w-10 h-10 bg-primary-container/50 text-primary rounded-xl flex items-center justify-center hover:bg-primary-container transition-colors">
              <span className="material-symbols-outlined text-lg">add</span>
            </button>
          </div>
          <button className="w-full bg-primary-container/30 text-primary py-3 rounded-xl font-bold text-sm border border-primary/20 shadow-lg shadow-primary/5 hover:bg-primary-container/50 hover:shadow-primary/20 transition-all duration-300 hidden xl:block">
            Connect Repository
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
