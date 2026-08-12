"use client";

import React from "react";
import { motion } from "framer-motion";
import { GradientBars } from "@/components/ui/gradient-bars-background";
import type { StoredUser, DashboardStats } from "../types/dashboard";
import { IconBook, IconTrophy, IconRocket, IconLightning, IconSparkles } from "./DashboardIcons";
import { getGamificationMetrics } from "@/lib/gamification";

interface DashboardHeroProps {
  loading: boolean;
  user: StoredUser | null;
  stats: DashboardStats;
}

export function DashboardHero({ loading, user, stats }: DashboardHeroProps) {
  const { xp, streakCount, reputationScore, responseRate } = stats;
  const gMetrics = getGamificationMetrics(xp);

  return (
    <div className="w-full bg-clouds">
      <div
        className="relative w-full pt-28 pb-24 overflow-hidden rounded-b-[2.5rem] shadow-[0_20px_50px_-20px_rgba(18,40,75,0.45)]"
        style={{
          background: "linear-gradient(160deg, #12284B 0%, #1B3A63 45%, #8CC1E9 100%)",
        }}
      >
        {/* Animated Bars Texture */}
        <GradientBars
          numBars={16}
          gradientFrom="rgba(140, 193, 233, 0.3)"
          gradientTo="transparent"
          animationDuration={3.5}
        />

        {/* Ambient Glow Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(140,193,233,0.15),transparent_60%)]" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-sky/25 blur-3xl" />

        {/* Hero Main Header Content */}
        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-sky/20 border border-sky/40 px-3.5 py-1 text-xs font-mono font-bold text-sky shadow-sm">
                <span className="h-2 w-2 rounded-full bg-sky animate-ping" />
                SELAMAT DATANG KEMBALI
              </div>

              <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white capitalize drop-shadow-md">
                {loading ? (
                  <span className="inline-block h-12 w-64 animate-pulse rounded-xl bg-white/10" />
                ) : (
                  user?.nama || "Mahasiswa"
                )}
              </h1>

              <p className="text-base font-medium text-paper/90 max-w-xl drop-shadow-sm">
                {user?.universitas && user?.prodi
                  ? `${user.universitas} — ${user.prodi}`
                  : "Profil Mahasiswa Belum Lengkap"}
              </p>

              {/* INCOMPLETE PROFILE WARNING BANNER */}
              {(!user?.universitas || !user?.prodi) && (
                <div className="mt-3 p-3.5 rounded-xl bg-rose-500/15 border border-rose-400/40 text-rose-100 text-xs font-mono flex items-center justify-between gap-3">
                  <span>Profil kamu belum lengkap. Lengkapi universitas & prodi kamu untuk membuka akses penuh.</span>
                  <a
                    href="/profile"
                    className="shrink-0 rounded-lg bg-white px-3 py-1.5 font-bold text-ocean hover:bg-sky transition"
                  >
                    Lengkapi Profil →
                  </a>
                </div>
              )}

              {/* HIGH VISIBILITY METRIC CHIPS */}
              <div className="mt-5 flex flex-wrap gap-2.5 pt-2">
                <span className="rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-xs font-bold text-paper shadow-md backdrop-blur-md flex items-center gap-2">
                  <IconBook className="w-3.5 h-3.5 text-sky" />
                  {user?.prodi || "Belum diatur"}
                </span>
                <span className="rounded-xl bg-sky text-ocean font-extrabold px-4 py-2 text-xs shadow-lg flex items-center gap-2">
                  <IconTrophy className="w-3.5 h-3.5 text-ink" />
                  Level {gMetrics.level} • {gMetrics.tier} ({gMetrics.tierTitle})
                </span>
                <span className="rounded-xl bg-amber-400 text-amber-950 font-extrabold px-4 py-2 text-xs shadow-lg flex items-center gap-1.5">
                  <IconSparkles className="w-3.5 h-3.5 text-amber-950" />
                  {gMetrics.pts} Pts
                </span>
                <span className="rounded-xl bg-white/15 border border-white/30 backdrop-blur-md px-4 py-2 text-xs font-bold text-paper shadow-md flex items-center gap-2">
                  <IconLightning className="w-3.5 h-3.5 text-sky" />
                  {streakCount} Hari Streak
                </span>
                <span className="rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold px-4 py-2 text-xs shadow-md flex items-center gap-2">
                  <IconSparkles className="w-3.5 h-3.5 text-emerald-300" />
                  Reputasi {reputationScore}/100 ({responseRate}% Respon)
                </span>
              </div>
            </div>

            {/* LEVEL & XP WIDGET WITH HIGH CONTRAST */}
            <div className="w-full md:w-80 rounded-2xl bg-white/10 p-6 backdrop-blur-md shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-paper/70">
                  Target XP = 100 × n²
                </span>
                <span className="font-display text-2xl font-black text-sky">
                  Lv {gMetrics.level}
                </span>
              </div>

              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10 relative">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-sky to-secondary"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(gMetrics.progressPercent, 8)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>

              <div className="flex items-center justify-between font-mono text-xs text-paper/70">
                <span>{gMetrics.xpInCurrentLevel}/{gMetrics.xpSpanForNextLevel} XP</span>
                <span className="text-sky font-bold">+{gMetrics.sisaMenujuLevel} XP ke Lv {gMetrics.level + 1}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
