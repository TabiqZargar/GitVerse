"use client";

import { useEffect, useRef } from "react";
import { useWrappedStore } from "../store";

const SLIDE_DURATION_MS = 8000;

export function useAutoPlay() {
  const isPlaying = useWrappedStore((s) => s.isPlaying);
  const nextChapter = useWrappedStore((s) => s.nextChapter);
  const currentChapter = useWrappedStore((s) => s.currentChapter);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (isPlaying) {
      timerRef.current = setInterval(() => {
        nextChapter();
      }, SLIDE_DURATION_MS);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, currentChapter, nextChapter]);
}
