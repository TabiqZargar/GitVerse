"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function TopNav() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-gutter py-unit-sm max-w-container-max mx-auto bg-surface-container-low/80 backdrop-blur-xl border border-white/10 rounded-full mt-unit-md mx-margin shadow-[0_0_20px_-5px_rgba(210,187,255,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(210,187,255,0.4)]"
    >
      <div className="flex items-center gap-unit-md">
        <Link href="/" className="font-headline-sm text-headline-sm font-bold tracking-tighter text-on-surface hover:text-primary transition-colors">GitVerse</Link>
        <div className="hidden md:flex gap-unit-lg ml-unit-xl">
          <Link href="/explore" className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300">Explore</Link>
          <Link href="/universe" className="text-primary font-bold border-b-2 border-primary pb-1" aria-current="page">Universe</Link>
          <Link href="/wrapped" className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300">Wrapped</Link>
        </div>
      </div>
      <div className="flex items-center gap-unit-md">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer" aria-label="Notifications">notifications</motion.button>
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center overflow-hidden">
            <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2vDjGouC4n1coSVtqrkX_lLMi2XTPNItxqy4H0O1VQOm6H3tY1K5ardRFyafipyks8vXPLu5xQGjJaKIdU8qZ3PFN_J9DCQtB0vA7eCvWBn0qdCvLVMMdpzviziGTPq7FGE7W1AmyUeG3Y9BXAR7MRXGtpSANlgyW6VET7ezqK7DXhXc20Vdnr7o5MKL3nw-YEOAQsEokMc0X2VI1aq7VB-nG_qX2yFVKLdkJTpDHtS5xdWTGQ_pm_-2tJEwCz2WGZSwASQWA9LA" alt="Profile" width={32} height={32} className="w-full h-full object-cover" />
          </div>
      </div>
    </motion.nav>
  );
}
