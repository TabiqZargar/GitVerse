"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function TopNav() {
  const { user } = useAuth();

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-gutter py-unit-sm max-w-container-max mx-auto bg-surface-container-low/80 backdrop-blur-xl border border-white/10 rounded-full mt-unit-md mx-margin shadow-[0_0_20px_-5px_rgba(210,187,255,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(210,187,255,0.4)]"
    >
      <div className="flex items-center gap-unit-md">
        <Link href="/" className="font-headline-sm text-headline-sm font-bold tracking-tighter text-on-surface hover:text-primary transition-colors">GitVerse</Link>
        <div className="hidden md:flex gap-unit-lg ml-unit-xl">
          <Link href="/dashboard" className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300">Dashboard</Link>
          <Link href="/achievements" className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300">Achievements</Link>
          <Link href="/wrapped" className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300">Wrapped</Link>
        </div>
      </div>
      <div className="flex items-center gap-unit-md">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer" aria-label="Notifications">notifications</motion.button>
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center overflow-hidden">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name ?? "Profile"}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs font-medium text-primary">
              {user?.name?.charAt(0) ?? "?"}
            </span>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
