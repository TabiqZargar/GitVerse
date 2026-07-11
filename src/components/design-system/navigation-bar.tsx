"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Settings, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeveloperAvatar } from "./developer-avatar";
import { GradientButton } from "./gradient-button";
import { useAuth } from "@/features/auth/hooks/use-auth";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Repositories", href: "/dashboard/repos" },
  { label: "Analytics", href: "/dashboard/analytics" },
  { label: "Visualization", href: "/dashboard/visualization" },
];

export function NavigationBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const nav = document.getElementById("mobile-nav");
    if (!nav) return;

    const focusable = nav.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusable.length === 0) return;

    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    first.focus();

    window.addEventListener("keydown", handleTab);
    return () => window.removeEventListener("keydown", handleTab);
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-100 transition-all duration-500",
        scrolled
          ? "bg-background/70 backdrop-blur-2xl border-b border-glass-border shadow-glass"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-primary to-primary/60 flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold text-primary-foreground shadow-glow transition-transform duration-300 group-hover:scale-105">
              G
            </div>
            <span className="text-sm font-semibold tracking-tight">GitVerse</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" role="navigation" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground hover:bg-glass rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={cn(
              "hidden items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-all duration-300 md:flex",
              searchFocused
                ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                : "border-border bg-glass"
            )}
          >
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search repositories..."
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 w-40 outline-none lg:w-56"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              aria-label="Search repositories"
            />
          </div>

          <button
            className="text-muted-foreground hover:text-foreground hover:bg-glass rounded-lg p-2 transition-all duration-200"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

          <button
            className="text-muted-foreground hover:text-foreground hover:bg-glass rounded-lg p-2 transition-all duration-200"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>

          {isAuthenticated ? (
            <Link href="/dashboard" aria-label="Profile">
              <DeveloperAvatar
                name={user?.name}
                image={user?.image}
                size="sm"
                glow
              />
            </Link>
          ) : (
            <Link href="/login">
              <GradientButton size="sm">Sign In</GradientButton>
            </Link>
          )}

          <button
            className="md:hidden text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            id="mobile-nav"
            className="border-t border-glass-border bg-background/95 backdrop-blur-2xl md:hidden overflow-hidden"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="space-y-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="hover:bg-glass block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
