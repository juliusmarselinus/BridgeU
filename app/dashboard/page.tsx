"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

type StoredUser = {
  nama: string;
  universitas: string;
  prodi: string;
  fotoUrl?: string;
  skills?: string[];
  minatKategori?: string[];
};

type Pengajuan = {
  id: string;
  judul: string;
  perusahaan: string;
  status: "Menunggu" | "Diproses" | "Diterima" | "Ditolak" | "Selesai";
  tanggal: string;
  kategori?: string;
};

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

// Rekomendasi berdasarkan proposal
const recommendedProjects = [
  {
    id: "rec-1",
    judul: "Optimasi UI/UX & Redesign E-Commerce Mobile App",
    perusahaan: "PT Digital Innovate Indonesia",
    kategori: "UI/UX & System Design",
    matchScore: 95,
    tipe: "Studi Kasus Akademik",
  },
  {
    id: "rec-2",
    judul: "Analisis Sentimen Data Pelanggan Berbasis Machine Learning",
    perusahaan: "DataTech Nusantara",
    kategori: "Data Science & Analytics",
    matchScore: 88,
    tipe: "Riset Industri",
  },
];

// Badges Gamifikasi
const userBadges = [
  { icon: "🚀", title: "Pionir Kolaborasi", desc: "Mengirim pengajuan pertama" },
  { icon: "🎓", title: "Akademisi Aktif", desc: "Terhubung dengan industri" },
  { icon: "⚡", title: "Quick Learner", desc: "Profil terverifikasi 100%" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [pengajuan, setPengajuan] = useState<Pengajuan[]>([]);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/?auth=login");
        return;
      }

      setAuthChecked(true);

      try {
        const res = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser({
            nama: data.nama,
            universitas: data.universitas,
            prodi: data.prodi,
            fotoUrl: data.fotoUrl,
            skills: data.skills ?? [],
            minatKategori: data.minatKategori ?? [],
          });
        }
      } catch (err) {
        console.error("Gagal fetch /api/me:", err);
      }

      const stored = localStorage.getItem("bridgeu_pengajuan");
      if (stored) {
        try {
          setPengajuan(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }

      setLoading(false);
    };

    init();
  }, [router]);

  const total = pengajuan.length;
  const menunggu = pengajuan.filter((p) => p.status === "Menunggu").length;
  const diterima = pengajuan.filter((p) => p.status === "Diterima").length;
  const level = Math.floor(total / 2) + 1;
  const progressPercent = Math.min(((total % 2) / 2) * 100, 100);
  const sisaMenujuLevel = total % 2 === 0 ? 2 : 1;

  if (!authChecked && !loading) return null;

  return (
    <main className="min-h-screen bg-paper pb-24 font-sans text-ink">
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HERO SECTION — Modern Deep Navy Theme                           */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="-mt-20 w-full bg-paper">
        <div className="relative w-full bg-gradient-to-b from-ink via-ink/95 to-ink/80 pt-28 pb-28 overflow-hidden shadow-2xl">
          {/* Ambient Glow Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(201,168,76,0.15),transparent_60%)]" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-bridge-gold/20 blur-3xl" />

          {/* Navbar Floating */}
          <div className="relative z-40">
            <Navbar />
          </div>

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
                    📚 {user?.prodi || "Sistem Informasi"}
                  </span>
                  <span className="rounded-xl bg-bridge-gold text-ink font-extrabold px-4 py-2 text-xs shadow-lg flex items-center gap-2">
                    🏆 Level {level} Kolaborator
                  </span>
                  <span className="rounded-xl bg-white/15 border border-white/30 backdrop-blur-md px-4 py-2 text-xs font-bold text-paper shadow-md">
                    🚀 {total} Kolaborasi
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

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* OVERLAPPING / STACKED CARDS ANIMATION (-mt-20 TIMPAH TINDIH)   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="relative mx-auto max-w-6xl px-6 -mt-16 z-30 space-y-10">

        {/* 1. TIMPAH TINDIH STATS CARDS GRID */}
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
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-bridge-gold/40 bg-bridge-gold/20 text-ink font-mono font-black text-sm">
                ∑
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
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-bridge-gold/20 border border-bridge-gold/40 text-ink font-mono font-bold text-sm">
                ⏳
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
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-700 font-mono font-bold text-sm">
                ✓
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

        {/* 2. MAIN LAYOUT GRID (LEFT 2/3, RIGHT 1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* PENGAJUAN TERBARU STACKED LIST */}
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
                  className="font-mono text-xs font-bold text-bridge-gold underline underline-offset-4 transition hover:text-ink"
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

            {/* SMART RECOMMENDATION STACKED CARDS */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="rounded-2xl border-2 border-steel/15 bg-white p-6 shadow-lg space-y-4"
            >
              <div className="flex items-center justify-between border-b border-steel/15 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-bridge-gold/20 text-ink font-bold text-xs">✨</span>
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
                {recommendedProjects.map((item) => (
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
                      <h4 className="text-sm font-bold text-ink group-hover:text-bridge-gold transition line-clamp-2">
                        {item.judul}
                      </h4>
                      <p className="text-xs font-medium text-steel mt-1">{item.perusahaan}</p>
                    </div>

                    <Link
                      href="/kolaborasi"
                      className="font-mono text-xs font-bold text-ink group-hover:text-bridge-gold flex items-center gap-1 transition pt-2 border-t border-steel/10"
                    >
                      Lihat Detail <span className="group-hover:translate-x-1 transition">→</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">

            {/* GAMIFICATION BADGES OVERLAPPING STACK */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="rounded-2xl border-2 border-steel/15 bg-white p-6 shadow-lg space-y-4"
            >
              <div className="flex items-center justify-between border-b border-steel/15 pb-3">
                <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
                  <span>🏅</span> Pencapaian kamu
                </h3>
                <span className="font-mono text-xs font-bold text-bridge-gold bg-bridge-gold/15 px-2.5 py-1 rounded-md border border-bridge-gold/30">
                  {userBadges.length} Badge Unlocked
                </span>
              </div>

              <div className="space-y-3">
                {userBadges.map((b, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3.5 p-3.5 rounded-xl border border-steel/15 bg-slate-50 hover:bg-white transition hover:shadow-sm"
                  >
                    <span className="text-2xl p-2.5 rounded-xl bg-white border border-steel/20 shrink-0 shadow-xs">
                      {b.icon}
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-ink">{b.title}</h5>
                      <p className="text-[11px] font-medium text-steel">{b.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* STUDENT PORTFOLIO TRACKER CARD */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="rounded-2xl border-2 border-bridge-gold/40 bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent p-6 space-y-3 shadow-md"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">📄</span>
                <h4 className="font-display text-sm font-bold text-ink">Student Portfolio Tracker</h4>
              </div>
              <p className="text-xs font-medium text-steel leading-relaxed">
                Portofolio dibuat otomatis berdasarkan riwayat studi kasus & kolaborasi akademik kamu.
              </p>
              <Link
                href="/profil"
                className="inline-block font-mono text-xs font-bold text-ink hover:text-bridge-gold underline underline-offset-4"
              >
                Cek Profil & Portofolio →
              </Link>
            </motion.div>

          </div>

        </div>

      </div>
    </main>
  );
}