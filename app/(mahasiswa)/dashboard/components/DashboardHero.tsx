"use client";

import React from "react";
import { motion } from "framer-motion";
import type { StoredUser, DashboardStats } from "../types/dashboard";
import { IconBook, IconTrophy, IconRocket } from "./DashboardIcons";

interface DashboardHeroProps {
  loading: boolean;
  user: StoredUser | null;
  stats: DashboardStats;
}

export function DashboardHero({ loading, user, stats }: DashboardHeroProps) {
  const { level, progressPercent, sisaMenujuLevel, total } = stats;

  return (
    <div className="w-full bg-paper">
      <div className="relative w-full bg-gradient-to-b from-ink via-ink/95 to-ink/80 pt-28 pb-28 overflow-hidden shadow-2xl">
        {/* Ambient Glow Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(201,168,76,0.15),transparent_60%)]" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-bridge-gold/20 blur-3xl" />

        {/* Hero Main Header Content */}
        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-bridge-gold/20 border border-bridge-gold/40 px-3.5 py-1 text-xs font-mono font-bold text-bridge-gold shadow-sm">
                <span className="h-2 w-2 rounded-full bg-bridge-gold animate-ping" />
                SELAMAT DATANG KEMBALI
              </div>

              <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white capitalize drop-shadow-md">
                {loading ? (
                  <span className="inline-block h-12 w-64 animate-pulse rounded-xl bg-white/10" />
                ) : (
                  user?.nama || "Julius Marselinus"
                )}
              </h1>

              <p className="text-base font-medium text-paper/90 max-w-xl drop-shadow-sm">
                {user ? (
                  `${user.universitas || "Universitas Multimedia Nusantara (UMN)"} — ${user.prodi || "Sistem Informasi"}`
                ) : (
                  "Universitas Multimedia Nusantara (UMN) — Sistem Informasi"
                )}
              </p>

              {/* HIGH VISIBILITY BADGES / CHIPS */}
              <div className="mt-5 flex flex-wrap gap-2.5 pt-2">
                <span className="rounded-xl bg-ink/90 border border-bridge-gold/40 px-4 py-2 text-xs font-bold text-paper shadow-md flex items-center gap-2">
                  <IconBook className="w-3.5 h-3.5 text-bridge-gold" />
                  {user?.prodi || "Sistem Informasi"}
                </span>
                <span className="rounded-xl bg-bridge-gold text-ink font-extrabold px-4 py-2 text-xs shadow-lg flex items-center gap-2">
                  <IconTrophy className="w-3.5 h-3.5 text-ink" />
                  Level {level} Kolaborator
                </span>
                <span className="rounded-xl bg-white/15 border border-white/30 backdrop-blur-md px-4 py-2 text-xs font-bold text-paper shadow-md flex items-center gap-2">
                  <IconRocket className="w-3.5 h-3.5 text-bridge-gold" />
                  {total} Kolaborasi
                </span>
              </div>
            </div>

            {/* LEVEL CARD WIDGET WITH HIGH CONTRAST */}
            <div className="w-full md:w-80 rounded-2xl border-2 border-bridge-gold/40 bg-ink/90 p-6 backdrop-blur-md shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-paper/70">
                  Level Kolaborasi
                </span>
                <span className="font-display text-2xl font-black text-bridge-gold">
                  Lv {level}
                </span>
              </div>

              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10 relative border border-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-bridge-gold to-amber-300"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(progressPercent, 8)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>

              <p className="font-mono text-xs text-paper/70">
                Ajukan <span className="text-bridge-gold font-bold">{sisaMenujuLevel}</span> kolaborasi lagi untuk naik ke <span className="text-paper font-bold">Level {level + 1}</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
