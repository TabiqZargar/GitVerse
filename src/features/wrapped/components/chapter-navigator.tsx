"use client";

import { useWrappedStore } from "../store";
import { CHAPTER_ORDER, CHAPTER_LABELS } from "../types";
import { useKeyboardNavigation } from "../hooks/use-keyboard-navigation";
import { useSwipeNavigation } from "../hooks/use-swipe-navigation";

export function ChapterNavigator() {
  const currentChapter = useWrappedStore((s) => s.currentChapter);
  const nextChapter = useWrappedStore((s) => s.nextChapter);
  const prevChapter = useWrappedStore((s) => s.prevChapter);
  const goToChapter = useWrappedStore((s) => s.goToChapter);
  const isPlaying = useWrappedStore((s) => s.isPlaying);
  const setPlaying = useWrappedStore((s) => s.setPlaying);

  const currentIndex = CHAPTER_ORDER.indexOf(currentChapter);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === CHAPTER_ORDER.length - 1;

  useKeyboardNavigation();

  const swipeHandlers = useSwipeNavigation();

  return (
    <>
      <div
        className="fixed inset-0 z-0"
        {...swipeHandlers}
        onTouchStart={swipeHandlers.onTouchStart}
        onTouchEnd={swipeHandlers.onTouchEnd}
      />

      <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3">
        {CHAPTER_ORDER.map((id) => (
          <button
            key={id}
            onClick={() => goToChapter(id)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              id === currentChapter
                ? "w-8 bg-foreground"
                : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to ${CHAPTER_LABELS[id]}`}
          />
        ))}
      </div>

      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3">
        <button
          onClick={() => setPlaying(!isPlaying)}
          className="flex h-10 w-10 items-center justify-center rounded-full glass text-foreground/70 hover:text-foreground"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="3" y="2" width="4" height="12" rx="1" />
              <rect x="9" y="2" width="4" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 2.5v11l9-5.5z" />
            </svg>
          )}
        </button>
      </div>

      <div className="fixed bottom-8 left-8 z-50 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {currentIndex + 1} / {CHAPTER_ORDER.length}
        </span>
      </div>

      {!isFirst && (
        <button
          onClick={prevChapter}
          className="fixed left-4 top-1/2 z-50 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full glass text-foreground/70 hover:text-foreground"
          aria-label="Previous chapter"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 4l-6 6 6 6" />
          </svg>
        </button>
      )}

      {!isLast && (
        <button
          onClick={nextChapter}
          className="fixed right-4 top-1/2 z-50 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full glass text-foreground/70 hover:text-foreground"
          aria-label="Next chapter"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 4l6 6-6 6" />
          </svg>
        </button>
      )}
    </>
  );
}
