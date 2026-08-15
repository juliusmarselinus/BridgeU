"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { RecommendedProject } from "../types/dashboard";
import { IconSparkles } from "./DashboardIcons";

interface DashboardRecommendationsProps {
  recommendedProjects: RecommendedProject[];
  loading?: boolean;
}

export function DashboardRecommendations({ recommendedProjects, loading }: DashboardRecommendationsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="rounded-2xl border-2 border-steel/15 bg-white p-6 shadow-lg space-y-4"
    >
      <div className="flex items-center justify-between border-b border-steel/15 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-bridge-gold/20 text-ink font-bold text-xs flex items-center justify-center">
            <IconSparkles className="w-4 h-4 text-bridge-gold" />
          </span>
          <div>
            <h3 className="font-display text-base font-bold text-ink">Rekomendasi Untukmu</h3>
            <p className="text-xs font-medium text-steel">Studi kasus & riset disesuaikan prodi kamu</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-bridge-gold/20 border border-bridge-gold/50 text-ink text-[11px] font-mono font-black shadow-xs">
          Smart Match Engine
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading ? (
          Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="p-5 rounded-2xl border-2 border-steel/15 bg-slate-50 animate-pulse space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-3 w-20 rounded bg-steel/20" />
                <div className="h-4 w-16 rounded bg-steel/20" />
              </div>
              <div className="h-5 w-3/4 rounded bg-steel/20" />
              <div className="h-3 w-1/2 rounded bg-steel/20" />
            </div>
          ))
        ) : (
          recommendedProjects.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4, scale: 1.01 }}
              className="p-5 rounded-2xl border-2 border-steel/15 bg-slate-50 hover:border-bridge-gold/60 hover:bg-white transition-all duration-200 flex flex-col justify-between space-y-3 shadow-xs hover:shadow-md group"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-steel font-semibold mb-2">
                  <span className="truncate max-w-[140px]">{item.tipe}</span>
                  <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {item.matchScore}% Match
                  </span>
                </div>
                <h4 className="text-sm font-bold text-ink group-hover:text-amber-700 transition line-clamp-2">
                  {item.judul}
                </h4>
                <p className="text-xs font-medium text-steel mt-1">{item.perusahaan}</p>
              </div>

              <Link
                href={`/kolaborasi/${item.id}`}
                className="font-mono text-xs font-bold text-ink group-hover:text-amber-700 flex items-center gap-1 transition pt-2 border-t border-steel/10"
              >
                Lihat Detail <span className="group-hover:translate-x-1 transition">→</span>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
