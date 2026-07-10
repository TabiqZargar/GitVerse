"use client";

import { useAnimation } from "framer-motion";
import { useEffect } from "react";

export function useSlideAnimation(reducedMotion: boolean = false) {
  const controls = useAnimation();

  useEffect(() => {
    if (reducedMotion) {
      controls.set({ opacity: 1, y: 0 });
      return;
    }

    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    });
  }, [controls, reducedMotion]);

  const getInitial = () =>
    reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 };

  const getItemVariants = (delay: number = 0) => ({
    hidden: reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  });

  return { controls, getInitial, getItemVariants };
}
