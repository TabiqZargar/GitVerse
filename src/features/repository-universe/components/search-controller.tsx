"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Search, X, Star } from "lucide-react";
import { useUniverseStore } from "../store";
import { getLanguageColor } from "../utils/colors";

export function SearchController() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bodies = useUniverseStore((s) => s.bodies);
  const setSearchQuery = useUniverseStore((s) => s.setSearchQuery);
  const openInspector = useUniverseStore((s) => s.openInspector);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((p) => !p);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setSearchQuery("");
        setQuery("");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSearchQuery]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return bodies
      .filter((b) => b.repo.name.toLowerCase().includes(q))
      .slice(0, 12);
  }, [query, bodies]);

  const handleSelect = useCallback(
    (id: string) => {
      openInspector(id);
      setOpen(false);
      setQuery("");
      setSearchQuery("");
    },
    [openInspector, setSearchQuery]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setSearchQuery("");
    inputRef.current?.focus();
  }, [setSearchQuery]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/40 backdrop-blur-xl transition-colors hover:border-white/20 hover:text-white/60"
        aria-label="Search repositories (Cmd+K)"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search repositories...</span>
        <kbd className="ml-auto rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] text-white/30">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setOpen(false);
              setSearchQuery("");
              setQuery("");
            }}
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-black/80 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-white/40" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchQuery(e.target.value);
                }}
                placeholder="Search repositories..."
                className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
              />
              {query && (
                <button onClick={handleClear} className="text-white/40 hover:text-white/70">
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => {
                  setOpen(false);
                  setSearchQuery("");
                  setQuery("");
                }}
                className="rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] text-white/30"
              >
                ESC
              </button>
            </div>

            {results.length > 0 && (
              <div className="max-h-80 overflow-y-auto py-1">
                {results.map((body, i) => (
                  <button
                    key={body.id}
                    onClick={() => handleSelect(body.id)}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors hover:bg-white/5"
                  >
                    <div
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: getLanguageColor(body.repo.primaryLanguage) }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-white/90">{body.repo.name}</span>
                      {body.repo.description && (
                        <span className="ml-2 text-xs text-white/40 line-clamp-1">
                          {body.repo.description}
                        </span>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2 text-xs text-white/40">
                      <span className="flex items-center gap-0.5">
                        <Star className="h-3 w-3" />
                        {body.repo.stars}
                      </span>
                    </div>
                    {i === 0 && (
                      <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5 text-[9px] text-white/30">
                        ↵
                      </kbd>
                    )}
                  </button>
                ))}
              </div>
            )}

            {query && results.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-white/30">
                No repositories found for &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
