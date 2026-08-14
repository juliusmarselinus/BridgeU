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
            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
            className={`absolute ${isSmall ? "inset-[-6px]" : "inset-[-10px] sm:inset-[-14px]"}`}
          >
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-amber-300 drop-shadow-[0_0_8px_#fde047]">
              <svg className={isSmall ? "w-2.5 h-2.5" : "w-4 h-4 sm:w-5 sm:h-5"} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </span>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-orange-400 drop-shadow-[0_0_8px_#fb923c]">
              <svg className={isSmall ? "w-2.5 h-2.5" : "w-4 h-4 sm:w-5 sm:h-5"} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </span>
          </motion.div>
          {!isSmall && (
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute inset-[-4px] sm:inset-[-8px]"
            >
              <span className="absolute top-1/2 -left-1 -translate-y-1/2 text-red-500 drop-shadow-[0_0_8px_#ef4444]">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </span>
              <span className="absolute top-1/2 -right-1 -translate-y-1/2 text-yellow-300 drop-shadow-[0_0_8px_#fde047]">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </span>
            </motion.div>
          )}
        </div>
      );

    case "floating-sparks":
      return (
        <div className="pointer-events-none absolute inset-0 z-30 overflow-visible">
          {/* Level 15 Cyber Matrix Animated Rotating Orbits */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className={`absolute ${isSmall ? "inset-[-6px]" : "inset-[-12px] sm:inset-[-16px]"}`}
          >
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-cyan-300 border border-cyan-100 shadow-[0_0_12px_#67e8f9] block" />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-teal-300 border border-teal-100 shadow-[0_0_12px_#5eead4] block" />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 9, ease: "linear" }}
            className={`absolute ${isSmall ? "inset-[-4px]" : "inset-[-8px] sm:inset-[-12px]"}`}
          >
            <span className="absolute top-1/2 -left-1 -translate-y-1/2 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] block" />
            <span className="absolute top-1/2 -right-1 -translate-y-1/2 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-sky-300 shadow-[0_0_10px_#7dd3fc] block" />
          </motion.div>
        </div>
      );

    case "cyber-orbs":
      return (
        <div className="pointer-events-none absolute inset-0 z-30 overflow-visible">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className={`absolute ${isSmall ? "inset-[-6px]" : "inset-[-10px] sm:inset-[-14px]"}`}
          >
            <span className="absolute top-0 right-1 h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full bg-purple-400 border border-purple-200 shadow-[0_0_12px_#c084fc] block" />
            <span className="absolute bottom-0 left-1 h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full bg-indigo-400 border border-indigo-200 shadow-[0_0_12px_#818cf8] block" />
          </motion.div>
          {!isSmall && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 9, ease: "linear" }}
              className="absolute inset-[-4px] sm:inset-[-8px]"
            >
              <span className="absolute top-1/2 left-0 h-2.5 w-2.5 rounded-full bg-pink-400 shadow-[0_0_10px_#f472b6] block" />
              <span className="absolute top-1/2 right-0 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] block" />
            </motion.div>
          )}
        </div>
      );

    case "diamond-glimmer":
      return (
        <div className="pointer-events-none absolute inset-0 z-30 overflow-visible">
          {/* Level 17 Diamond Rotating Ring with Floating Diamond Top */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className={`absolute ${isSmall ? "inset-[-6px]" : "inset-[-12px] sm:inset-[-16px]"}`}
          >
            <span className="absolute top-0 right-0 text-cyan-300 drop-shadow-[0_0_10px_#67e8f9]">
              <svg className={isSmall ? "w-3 h-3" : "w-4 h-4 sm:w-5 sm:h-5"} fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 3h12l4 6-10 12L2 9z" />
              </svg>
            </span>
            <span className="absolute bottom-0 left-0 text-sky-200 drop-shadow-[0_0_10px_#bae6fd]">
              <svg className={isSmall ? "w-3 h-3" : "w-4 h-4 sm:w-5 sm:h-5"} fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 3h12l4 6-10 12L2 9z" />
              </svg>
            </span>
          </motion.div>
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.1, 0.95], y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className={`absolute z-30 ${isSmall ? "-top-3 right-0" : "-top-6 sm:-top-7 right-1"}`}
          >
            <div
              className={`flex items-center justify-center rounded-full bg-gradient-to-tr from-cyan-400 to-sky-300 border border-white text-slate-950 shadow-[0_0_16px_rgba(56,189,248,0.9)] ${
                isSmall ? "h-4.5 w-4.5" : "h-8 w-8 sm:h-10 sm:w-10"
              }`}
            >
              <svg
                className={isSmall ? "w-2.5 h-2.5" : "w-4 h-4 sm:w-5 sm:h-5"}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 3h12l4 6-10 12L2 9z" />
              </svg>
            </div>
          </motion.div>
        </div>
      );

    case "phoenix-wings":
      return (
        <div className="pointer-events-none absolute inset-0 z-30 overflow-visible">
          {/* Level 19 Phoenix Rotating Flame Orbit + Flapping Wings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 7, ease: "linear" }}
            className={`absolute ${isSmall ? "inset-[-6px]" : "inset-[-12px] sm:inset-[-18px]"}`}
          >
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-amber-400 drop-shadow-[0_0_12px_#fbbf24]">
              <svg className={isSmall ? "w-3 h-3" : "w-4 h-4 sm:w-5 sm:h-5"} fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.99-1.25-3.32-2.5-4.5-1.25 1.18-2.5 2.51-2.5 4.5z" />
              </svg>
            </span>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-rose-500 drop-shadow-[0_0_12px_#f43f5e]">
              <svg className={isSmall ? "w-3 h-3" : "w-4 h-4 sm:w-5 sm:h-5"} fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.99-1.25-3.32-2.5-4.5-1.25 1.18-2.5 2.51-2.5 4.5z" />
              </svg>
            </span>
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.08, 1], y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className={`absolute left-1/2 -translate-x-1/2 flex items-center justify-between text-rose-500 drop-shadow-[0_0_14px_rgba(244,63,94,0.9)] ${
              isSmall ? "-top-4 w-12" : "-top-7 sm:-top-9 w-24 sm:w-32"
            }`}
          >
            <svg
              className={`${isSmall ? "w-4 h-4" : "w-7 h-7 sm:w-9 sm:h-9"} rotate-[-25deg] text-amber-400`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <svg
              className={`${isSmall ? "w-3 h-3" : "w-5 h-5 sm:w-6 sm:h-6"} text-rose-500 animate-pulse`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.99-1.25-3.32-2.5-4.5-1.25 1.18-2.5 2.51-2.5 4.5z" />
            </svg>
            <svg
              className={`${isSmall ? "w-4 h-4" : "w-7 h-7 sm:w-9 sm:h-9"} rotate-[25deg] -scale-x-100 text-amber-400`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </motion.div>
        </div>
      );

    case "celestial-halo":
      return (
        <div className="pointer-events-none absolute inset-0 z-30 overflow-visible">
          {/* Level 20 Celestial 360° Rotating Wings + Floating Godlike Halo */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            className={`absolute ${isSmall ? "inset-[-8px]" : "inset-[-16px] sm:inset-[-22px]"}`}
          >
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-yellow-300 drop-shadow-[0_0_16px_#fde047]">
              <svg className={isSmall ? "w-3.5 h-3.5" : "w-6 h-6 sm:w-8 sm:h-8"} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </span>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-amber-400 drop-shadow-[0_0_16px_#fbbf24]">
              <svg className={isSmall ? "w-3.5 h-3.5" : "w-6 h-6 sm:w-8 sm:h-8"} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </span>
          </motion.div>

          <motion.div
            animate={{ y: [0, -6, 0], scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className={`absolute left-1/2 -translate-x-1/2 ${
              isSmall ? "-top-4" : "-top-8 sm:-top-11"
            }`}
          >
            <div
              className={`rounded-full border-2 border-yellow-200 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 shadow-[0_0_24px_rgba(250,204,21,1)] blur-[0.3px] ${
                isSmall ? "h-3 w-10 border-xs" : "h-5 w-24 sm:h-6 sm:w-32 border-2"
              }`}
            />
          </motion.div>
        </div>
      );

    default:
      return null;
  }
}
