"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconFileText } from "./DashboardIcons";

export function DashboardPortfolioTracker() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="rounded-2xl border-2 border-bridge-gold/40 bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent p-6 space-y-3 shadow-md"
    >
      <div className="flex items-center gap-2">
        <IconFileText className="w-5 h-5 text-bridge-gold" />
        <h4 className="font-display text-sm font-bold text-ink">Student Portfolio Tracker</h4>
      </div>
      <p className="text-xs font-medium text-steel leading-relaxed">
        Portofolio dibuat otomatis berdasarkan riwayat studi kasus & kolaborasi akademik kamu.
      </p>
      <Link
        href="/profile"
        className="inline-block font-mono text-xs font-bold text-ink hover:text-bridge-gold underline underline-offset-4"
      >
        Cek Profil & Portofolio →
      </Link>
    </motion.div>
  );
}
