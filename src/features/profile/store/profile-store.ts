"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProfileData, ProfileSearchResult } from "../types";
import { apiClient } from "@/lib/api-client";

interface ProfileState {
  activeUsername: string | null;
  profile: ProfileData | null;
  searchResults: ProfileSearchResult[];
  recentSearches: { username: string; name: string; avatarUrl: string; timestamp: number }[];

  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  lastFetched: number | null;

  cache: Record<string, { data: ProfileData; timestamp: number }>;
  cacheTTL: number;

  searchProfile: (username: string) => Promise<void>;
  fetchProfile: (username: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearProfile: () => void;
  clearCache: () => void;
  clearError: () => void;
}

const CACHE_TTL = 5 * 60 * 1000;
const MAX_RECENT = 10;

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      activeUsername: null,
      profile: null,
      searchResults: [],
      recentSearches: [],
      isLoading: false,
      isSearching: false,
      error: null,
      lastFetched: null,
      cache: {},
      cacheTTL: CACHE_TTL,

      searchProfile: async (username: string) => {
        const trimmed = username.trim();
        if (!trimmed) return;
        set({ isSearching: true, error: null });
        try {
          const res = await apiClient.get<{ data: ProfileSearchResult[] }>(
            `/profile/search?q=${encodeURIComponent(trimmed)}`
          );
          if (!res.success) {
            set({ searchResults: [], isSearching: false, error: res.error.message });
            return;
          }
          set({ searchResults: res.data.data, isSearching: false });
        } catch {
          set({ searchResults: [], isSearching: false, error: "Search failed" });
        }
      },

      fetchProfile: async (username: string) => {
        const trimmed = username.trim();
        if (!trimmed) return;

        const state = get();
        const cached = state.cache[trimmed.toLowerCase()];
        if (cached && Date.now() - cached.timestamp < state.cacheTTL) {
          set({
            profile: cached.data,
            activeUsername: trimmed.toLowerCase(),
            lastFetched: cached.timestamp,
            error: null,
          });
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const res = await apiClient.get<{ data: ProfileData }>(
            `/profile/${encodeURIComponent(trimmed)}`
          );
          if (!res.success) {
            set({ isLoading: false, error: res.error.message ?? "Profile not found" });
            return;
          }
          const profile = res.data.data;

          const recent = state.recentSearches.filter(
            (r) => r.username.toLowerCase() !== trimmed.toLowerCase()
          );
          recent.unshift({
            username: profile.username,
            name: profile.name,
            avatarUrl: profile.avatarUrl,
            timestamp: Date.now(),
          });

          set({
            profile,
            activeUsername: trimmed.toLowerCase(),
            isLoading: false,
            lastFetched: Date.now(),
            error: null,
            recentSearches: recent.slice(0, MAX_RECENT),
            cache: {
              ...state.cache,
              [trimmed.toLowerCase()]: { data: profile, timestamp: Date.now() },
            },
          });
        } catch {
          set({ isLoading: false, error: "Failed to fetch profile" });
        }
      },

      refreshProfile: async () => {
        const { activeUsername } = get();
        if (!activeUsername) return;
        await get().fetchProfile(activeUsername);
      },

      clearProfile: () =>
        set({
          activeUsername: null,
          profile: null,
          error: null,
          isLoading: false,
        }),

      clearCache: () => set({ cache: {} }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "gitverse-profile",
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        cache: state.cache,
      }),
    }
  )
);
