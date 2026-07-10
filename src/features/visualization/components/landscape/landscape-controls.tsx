"use client";

import { useEffect } from "react";

interface LandscapeControlsProps {
  onResetView?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
  reducedMotion?: boolean;
}

export function LandscapeControls({
  onResetView,
  onZoomIn,
  onZoomOut,
  onRotateLeft,
  onRotateRight,
}: LandscapeControlsProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "r":
        case "R":
          onResetView?.();
          break;
        case "+":
        case "=":
          onZoomIn?.();
          break;
        case "-":
        case "_":
          onZoomOut?.();
          break;
        case "ArrowLeft":
          onRotateLeft?.();
          break;
        case "ArrowRight":
          onRotateRight?.();
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onResetView, onZoomIn, onZoomOut, onRotateLeft, onRotateRight]);

  return null;
}
