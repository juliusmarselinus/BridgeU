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
      className="space-y-3 rounded-2xl border-2 border-[#B9D5EC]/0 bg-gradient-to-br from-[#F7FAFC] via-[#F3F8FC] to-[#EAF3FA] p-6 shadow-md"
    >
      <div className="relative z-10 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-bridge-gold shrink-0">
          <IconFileText className="w-4.5 h-4.5" />
        </span>
        <h4 className="font-display text-sm font-bold text-ink">Student Portfolio Tracker</h4>
      </div>
      <p className="text-xs font-medium text-steel leading-relaxed">
        Portofolio dibuat otomatis berdasarkan riwayat studi kasus & kolaborasi akademik kamu.
      </p>
      <Link
        href="/profile"
        className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 font-mono text-xs font-bold text-paper transition hover:bg-steel hover:shadow-md"
      >
        Cek Profil & Portofolio →
      </Link>
    </motion.div>
  );
}
