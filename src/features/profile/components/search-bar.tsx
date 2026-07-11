"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api-client";

interface SearchResult {
  username: string;
  avatarUrl: string;
  type: string;
}

interface SearchBarProps {
  variant?: "hero" | "nav" | "minimal";
  placeholder?: string;
  onNavigate?: (username: string) => void;
}

export function SearchBar({
  variant = "hero",
  placeholder = "Search any GitHub username...",
  onNavigate,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const router = useRouter();

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    try {
      const res = await apiClient.get<{ data: SearchResult[] }>(
        `/profile/search?q=${encodeURIComponent(q)}`
      );
      if (res.success) {
        setResults(res.data.data);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    }
    setIsSearching(false);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 200);
  };

  const handleSelect = useCallback(
    (username: string) => {
      setQuery("");
      setResults([]);
      setSelectedIndex(-1);
      if (onNavigate) {
        onNavigate(username);
      } else {
        router.push(`/u/${encodeURIComponent(username)}`);
      }
    },
    [onNavigate, router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex].username);
      } else if (query.trim()) {
        handleSelect(query.trim());
      }
    } else if (e.key === "Escape") {
      setResults([]);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.parentElement?.contains(e.target as Node)) {
        setResults([]);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isHero = variant === "hero";
  const isNav = variant === "nav";

  return (
    <div className={`relative ${isHero ? "w-full max-w-2xl mx-auto" : isNav ? "w-64" : "w-full"}`}>
      <div
        className={`relative flex items-center gap-2 ${
          isHero
            ? "px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(210,187,255,0.2)] focus-within:border-primary/40 focus-within:shadow-[0_0_50px_-10px_rgba(210,187,255,0.3)]"
            : "px-3 py-2 rounded-xl bg-surface-container-high/80 border border-white/10 backdrop-blur-xl focus-within:border-primary/40"
        } transition-all duration-300`}
      >
        <span className={`material-symbols-outlined text-on-surface-variant ${isHero ? "text-2xl" : "text-lg"}`}>
          search
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`flex-1 bg-transparent border-none outline-none text-on-surface placeholder:text-on-surface-variant/50 ${
            isHero ? "text-lg" : "text-sm"
          }`}
        />
        {isSearching && (
          <div className={`animate-spin rounded-full border-2 border-primary/30 border-t-primary ${isHero ? "h-5 w-5" : "h-4 w-4"}`} />
        )}
      </div>

      <AnimatePresence>
        {results.length > 0 && isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full left-0 right-0 mt-2 ${
              isHero ? "rounded-xl" : "rounded-lg"
            } bg-surface-container-high/95 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden z-50`}
          >
            {results.map((result, index) => (
              <button
                key={result.username}
                onClick={() => handleSelect(result.username)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  index === selectedIndex
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface hover:bg-white/5"
                }`}
              >
                <Image
                  src={result.avatarUrl}
                  alt={result.username}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{result.username}</p>
                </div>
                <span className="text-xs text-on-surface-variant">GitHub</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
