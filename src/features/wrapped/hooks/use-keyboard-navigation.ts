"use client";

import { useEffect } from "react";
import { useWrappedStore } from "../store";
import { CHAPTER_ORDER } from "../types";

export function useKeyboardNavigation() {
  const nextChapter = useWrappedStore((s) => s.nextChapter);
  const prevChapter = useWrappedStore((s) => s.prevChapter);
  const goToChapter = useWrappedStore((s) => s.goToChapter);
  const setPlaying = useWrappedStore((s) => s.setPlaying);
  const isPlaying = useWrappedStore((s) => s.isPlaying);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          nextChapter();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          prevChapter();
          break;
        case " ":
          e.preventDefault();
          setPlaying(!isPlaying);
          break;
        case "Escape":
          setPlaying(false);
          break;
        case "Home":
          e.preventDefault();
          goToChapter("welcome");
          break;
        case "End":
          e.preventDefault();
          goToChapter("celebration");
          break;
        default: {
          const num = parseInt(e.key, 10);
          if (num >= 1 && num <= 9) {
            const chapter = CHAPTER_ORDER[num - 1];
            if (chapter) {
              e.preventDefault();
              goToChapter(chapter);
            }
          }
          if (e.key === "0") {
            e.preventDefault();
            goToChapter("celebration");
          }
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextChapter, prevChapter, goToChapter, setPlaying, isPlaying]);
}
