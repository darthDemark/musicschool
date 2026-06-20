"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Subtle entrance: fade + slight upward motion (200ms). Pass a changing
 * `motionKey` to retrigger the animation when content swaps (e.g. lessons,
 * exercises, reports). Respects reduced-motion via framer-motion defaults.
 */
export function FadeIn({
  children,
  className,
  motionKey,
}: {
  children: ReactNode;
  className?: string;
  motionKey?: string | number;
}) {
  return (
    <motion.div
      key={motionKey}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
