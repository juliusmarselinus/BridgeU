"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Pengajuan } from "../types/dashboard";

const statusStyle: Record<string, string> = {
  Menunggu: "bg-bridge-gold/20 text-amber-700 border-bridge-gold/50 font-bold",
  Diproses: "bg-blue-100 text-blue-800 border-blue-300 font-bold",
  Diterima: "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
  Ditolak: "bg-red-100 text-red-700 border-red-300 font-bold",
  Selesai: "bg-slate-200 text-slate-800 border-slate-300 font-bold",
};

function initials(name: string) {
  if (!name) return "MU";
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

interface DashboardPengajuanListProps {
  pengajuan: Pengajuan[];
}

export function DashboardPengajuanList({ pengajuan }: DashboardPengajuanListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="rounded-2xl border-2 border-steel/15 bg-white p-6 shadow-lg space-y-4"
    >
      <div className="flex items-center justify-between pb-4 border-b border-steel/15">
        <div>
          <h2 className="font-display text-lg font-bold text-ink">
            Pengajuan Terbaru
          </h2>
          <p className="text-xs font-medium text-steel">Status pendaftaran kolaborasi kamu</p>
        </div>
        <Link
          href="/status"
          className="font-mono text-xs font-bold text-blue underline underline-offset-4 transition hover:text-ink"
        >
          Lihat semua →
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {pengajuan.length > 0 ? (
          pengajuan.slice(-3).reverse().map((p, i) => (
            <motion.div
              key={p.id || i}
              whileHover={{ x: 4 }}
              className="group flex items-center gap-4 rounded-2xl border border-steel/20 bg-slate-50 p-4 transition duration-200 hover:border-bridge-gold/50 hover:bg-white hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-xs font-bold text-paper border-2 border-bridge-gold/40 shadow-sm">
                {initials(p.perusahaan)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink text-sm">{p.judul}</p>
                <p className="text-xs font-medium text-steel">{p.perusahaan}</p>
              </div>
              <span
                className={`shrink-0 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider ${
                  statusStyle[p.status] || "bg-steel/10 text-steel border-steel/20"
                }`}
              >
                {p.status}
              </span>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-steel/20 rounded-2xl bg-slate-50/50">
            <p className="font-display text-base font-bold text-ink">Belum Ada Pengajuan</p>
            <p className="text-xs text-steel mt-1 max-w-xs mx-auto">
              Mulai kirim pengajuan kolaborasi pertamamu sekarang!
            </p>
            <Link
              href="/kolaborasi"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-paper font-mono text-xs font-bold hover:bg-steel transition shadow-md"
            >
              Jelajahi Peluang Kolaborasi →
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
