"use client";

import { motion } from "framer-motion";
import { FloatingOverlayType } from "@/lib/avatar-frames";

export function FloatingAvatarOverlay({
  type,
  size = "md",
}: {
  type: FloatingOverlayType;
  size?: "sm" | "md" | "lg";
}) {
  if (!type || type === "none") return null;

  const isSmall = size === "sm";

  switch (type) {
    case "scholarly-hat":
      return (
        <motion.div
          animate={{ y: [0, -3, 0], rotate: [-1, 1, -1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className={`pointer-events-none absolute left-1/2 -translate-x-1/2 z-30 ${
            isSmall ? "-top-3" : "-top-5 sm:-top-7"
          }`}
        >
          <div
            className={`flex items-center justify-center rounded-full bg-slate-900 border border-sky-400/60 shadow-lg text-sky-400 ${
              isSmall ? "h-5 w-5 border-xs" : "h-9 w-9 sm:h-11 sm:w-11"
            }`}
          >
            <svg
              className={isSmall ? "w-3 h-3" : "w-5 h-5 sm:w-6 sm:h-6"}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
            </svg>
          </div>
        </motion.div>
      );

    case "golden-crown":
      return (
        <motion.div
          animate={{ y: [0, -3, 0], scale: [1, 1.04, 1] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className={`pointer-events-none absolute left-1/2 -translate-x-1/2 z-30 ${
            isSmall ? "-top-3.5" : "-top-6 sm:-top-8"
          }`}
        >
          <div
            className={`flex items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border border-amber-200 shadow-amber-400/50 shadow-lg text-amber-950 ${
              isSmall ? "h-5 w-5 border-xs" : "h-9 w-9 sm:h-12 sm:w-12"
            }`}
          >
            <svg
              className={isSmall ? "w-3 h-3" : "w-5 h-5 sm:w-6 sm:h-6"}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
            </svg>
          </div>
        </motion.div>
      );

    case "orbiting-stars":
      return (
        <div className="pointer-events-none absolute inset-0 z-30 overflow-visible">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className="absolute inset-[-10px] sm:inset-[-14px]"
          >
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-amber-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </span>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-orange-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </span>
          </motion.div>
        </div>
      );

    case "floating-sparks":
      return (
        <div className="pointer-events-none absolute inset-0 z-30">
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="absolute -top-2 left-2 text-pink-400"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z" />
            </svg>
          </motion.span>
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4], y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-1 right-2 text-rose-400"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z" />
            </svg>
          </motion.span>
        </div>
      );

    case "cyber-orbs":
      return (
        <div className="pointer-events-none absolute inset-0 z-30">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute inset-[-8px] sm:inset-[-12px]"
          >
            <span className="absolute top-0 right-1 h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] block" />
            <span className="absolute bottom-0 left-1 h-3 w-3 rounded-full bg-purple-400 shadow-[0_0_10px_#c084fc] block" />
          </motion.div>
        </div>
      );

    case "diamond-glimmer":
      return (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.08, 0.95] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="pointer-events-none absolute -top-5 right-0 z-30"
        >
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-sky-400/20 border border-sky-300 text-sky-400 backdrop-blur-xs">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3h12l4 6-10 12L2 9z" />
            </svg>
          </div>
        </motion.div>
      );

    case "phoenix-wings":
      return (
        <div className="pointer-events-none absolute inset-0 z-30">
          <motion.div
            animate={{ scale: [1, 1.06, 1], y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-rose-500"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 rotate-[-20deg]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.99-1.25-3.32-2.5-4.5-1.25 1.18-2.5 2.51-2.5 4.5z" />
            </svg>
            <svg className="w-5 h-5 sm:w-6 sm:h-6 rotate-[20deg] -scale-x-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </motion.div>
        </div>
      );

    case "celestial-halo":
      return (
        <div className="pointer-events-none absolute inset-0 z-30">
          <motion.div
            animate={{ y: [0, -5, 0], scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="absolute -top-7 sm:-top-9 left-1/2 -translate-x-1/2"
          >
            <div className="h-4 w-16 sm:h-5 sm:w-20 rounded-full border-2 border-yellow-300 bg-amber-300/30 shadow-[0_0_18px_rgba(253,224,71,0.9)] blur-[0.5px]" />
          </motion.div>
        </div>
      );

    default:
      return null;
  }
}
