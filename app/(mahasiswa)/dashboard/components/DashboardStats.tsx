"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { DashboardStats } from "../types/dashboard";
import { IconSum, IconClock, IconCheck } from "./DashboardIcons";

interface DashboardStatsProps {
  stats: DashboardStats;
  loading?: boolean;
}

export function DashboardStatsCards({ stats, loading }: DashboardStatsProps) {
  const { total, menunggu, diterima } = stats;

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="rounded-2xl border-2 border-steel/20 bg-white p-6 shadow-xl animate-pulse space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-steel/20" />
              <div className="h-9 w-9 rounded-xl bg-steel/20" />
            </div>
            <div className="h-10 w-16 rounded bg-steel/20" />
            <div className="h-3 w-32 rounded bg-steel/20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
    >
      {/* Card Total */}
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        className="rounded-2xl border-2 border-steel/20 bg-white p-6 shadow-xl transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-steel uppercase tracking-wider">
            Total Pengajuan
          </p>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-bridge-gold/40 bg-bridge-gold/20 text-ink">
            <IconSum className="w-4 h-4 text-ink" />
          </span>
        </div>
        <p className="mt-3 font-display text-5xl font-black text-ink">
          {total}
        </p>
        <p className="mt-2 text-xs font-medium text-steel">
          Kolaborasi diajukan sepanjang waktu.
        </p>
      </motion.div>

      {/* Card Menunggu */}
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        className="rounded-2xl border-2 border-steel/20 bg-white p-6 shadow-xl transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-bold text-steel uppercase tracking-wider">
              Menunggu
            </p>
            {menunggu > 0 && (
              <span className="h-2.5 w-2.5 rounded-full bg-bridge-gold animate-ping" />
            )}
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-bridge-gold/20 border border-bridge-gold/40 text-ink">
            <IconClock className="w-4 h-4 text-amber-700" />
          </span>
        </div>
        <p className="mt-3 font-display text-5xl font-black text-bridge-gold">
          {menunggu}
        </p>
        <p className="mt-2 text-xs font-medium text-steel">
          Pengajuan dalam proses seleksi.
        </p>
      </motion.div>

      {/* Card Diterima */}
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        className="rounded-2xl border-2 border-steel/20 bg-white p-6 shadow-xl transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-steel uppercase tracking-wider">
            Diterima
          </p>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-700">
            <IconCheck className="w-4 h-4 text-emerald-700" />
          </span>
        </div>
        <p className="mt-3 font-display text-5xl font-black text-verified">
          {diterima}
        </p>
        <p className="mt-2 text-xs font-medium text-steel">
          Kolaborasi disetujui perusahaan.
        </p>
      </motion.div>

      {/* Quick Action Box Stacked */}
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        className="rounded-2xl border-2 border-bridge-gold/40 bg-ink p-6 text-paper flex flex-col justify-between shadow-2xl"
      >
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-bridge-gold font-bold">
            Aksi Utama
          </span>
          <h3 className="mt-1 font-display text-lg font-bold text-paper">
            Cari Peluang Proyek
          </h3>
          <p className="mt-1 text-xs text-paper/80 leading-relaxed">
            Jelajahi tantangan & studi kasus dari mitra industri terverifikasi.
          </p>
        </div>
        <Link
          href="/kolaborasi"
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-bridge-gold px-4 py-2.5 font-mono text-xs font-bold text-ink transition hover:bg-bridge-gold/90 shadow-md"
        >
          Jelajah Sekarang →
        </Link>
      </motion.div>
    </motion.div>
  );
}
