"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { SearchBar } from "@/features/profile/components/search-bar";

export function TopNav() {
  const { user } = useAuth();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-gutter py-unit-sm max-w-container-max mx-auto bg-surface-container-low/60 backdrop-blur-xl border border-white/10 rounded-full mt-unit-md mx-margin shadow-[0_0_20px_-5px_rgba(210,187,255,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(210,187,255,0.4)]"
    >
      <div className="flex items-center gap-unit-md">
        <Link href="/" className="relative group">
          <div className="absolute -inset-2 bg-primary/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="font-headline-sm text-headline-sm font-bold tracking-tighter bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            GitVerse
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-unit-sm ml-unit-md">
          {[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Landscape", href: "/landscape" },
            { label: "Universe", href: "/dashboard/visualization" },
            { label: "Wrapped", href: "/wrapped" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative px-3 py-1.5 text-sm text-on-surface-variant/80 hover:text-primary transition-colors duration-300 group"
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-unit-sm">
        <div className="hidden sm:block">
          <SearchBar variant="nav" />
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer p-2"
          aria-label="Notifications"
        >
          notifications
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-secondary animate-pulse" />
        </motion.button>
        <Link href="/dashboard">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 border border-primary/40 flex items-center justify-center overflow-hidden cursor-pointer hover:scale-110 transition-transform">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "Profile"}
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs font-medium text-primary">
                {user?.name?.charAt(0) ?? "?"}
              </span>
            )}
          </div>
        </Link>
      </div>
    </motion.nav>
  );
}
