"use client";

import Link from "next/link";
import { useAdminDashboard } from "./hooks/useAdminDashboard";
import { GradientBars } from "@/components/ui/gradient-bars-background";

export default function AdminDashboardPage() {
  const { stats, isLoading } = useAdminDashboard();

  const totalUsers = stats.totalUsers;
  const totalKolaborasi = stats.totalKolaborasi;
  const pendingCompanies = stats.pendingCompanies;
  const verifiedCompanies = stats.verifiedCompanies;

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-secondary/15 via-clouds to-clouds pb-12 font-sans text-ink">
      {/* Background ambient animation */}
      <GradientBars
        numBars={20}
        gradientFrom="rgb(176, 208, 218)"
        gradientTo="transparent"
        animationDuration={7}
        className="opacity-70"
      />

      {/* 1. ADMIN DASHBOARD HERO SECTION */}
      <div className="relative z-10 w-full bg-clouds">
        <div
          className="relative w-full pt-28 pb-24 overflow-hidden rounded-b-[2.5rem] shadow-[0_20px_50px_-20px_rgba(18,40,75,0.45)]"
          style={{
            background: "linear-gradient(160deg, #12284B 0%, #1B3A63 45%, #8CC1E9 100%)",
          }}
        >
          <GradientBars
            numBars={16}
            gradientFrom="rgba(140, 193, 233, 0.3)"
            gradientTo="transparent"
            animationDuration={3.5}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(140,193,233,0.15),transparent_60%)]" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-sky/25 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-6xl px-6 pt-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="flex-1 space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-sky/20 border border-sky/40 px-3.5 py-1 text-xs font-mono font-bold text-sky shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  SYSTEM ADMINISTRATION
                </div>

                <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-md">
                  Dashboard Admin <span className="text-sky">BridgeU</span>
                </h1>

                <p className="text-base font-medium text-paper/90 max-w-2xl drop-shadow-sm leading-relaxed">
                  Pusat kendali untuk memoderasi postingan proyek kolaborasi, memverifikasi legalitas perusahaan mitra, dan mengelola akun pengguna platform.
                </p>
              </div>

              <div className="flex flex-wrap md:flex-col gap-3 shrink-0">
                <Link
                  href="/admin/kolaborasi"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-sky px-6 py-3 font-mono text-xs font-bold text-ocean transition hover:bg-white shadow-lg"
                >
                  Moderasi Proyek →
                </Link>
                <Link
                  href="/admin/perusahaan"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-6 py-3 font-mono text-xs font-semibold text-paper transition hover:bg-white/20"
                >
                  Verifikasi Perusahaan ({isLoading ? "..." : pendingCompanies})
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. OVERLAPPING CONTENT (STATS + MODULE CARDS) */}
      <div className="relative mx-auto max-w-6xl px-6 -mt-16 z-30 space-y-10">
        {/* STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-32 rounded-3xl border border-white/60 bg-white/80 p-5 shadow-lg backdrop-blur-xl animate-pulse"
              />
            ))
          ) : (
            <>
              <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur-xl transition hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-steel">
                    Total Pengguna
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-4 font-display text-3xl font-bold text-ink">{totalUsers}</p>
                <p className="mt-1 font-mono text-[11px] text-steel">Akun Mahasiswa & Perusahaan</p>
              </div>

              <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur-xl transition hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-steel">
                    Kolaborasi
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-4 font-display text-3xl font-bold text-ink">{totalKolaborasi}</p>
                <p className="mt-1 font-mono text-[11px] text-steel">Total Peluang Aktif & Moderasi</p>
              </div>

              <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur-xl transition hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-steel">
                    Perlu Verifikasi
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-4 font-display text-3xl font-bold text-amber-600">{pendingCompanies}</p>
                <p className="mt-1 font-mono text-[11px] text-steel">Perusahaan Menunggu Action</p>
              </div>

              <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur-xl transition hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-steel">
                    Mitra Resmi
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-4 font-display text-3xl font-bold text-emerald-600">{verifiedCompanies}</p>
                <p className="mt-1 font-mono text-[11px] text-steel">Perusahaan Terverifikasi</p>
              </div>
            </>
          )}
        </div>

        {/* MODULE CARDS */}
        <section>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">
                Modul Pengelolaan Platform
              </h2>
              <p className="font-mono text-xs text-steel mt-1">
                Pilih modul di bawah ini untuk melakukan tugas administratif
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Modul Moderasi */}
            <Link
              href="/admin/kolaborasi"
              className="group rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur-xl transition hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-display text-xl font-bold group-hover:scale-110 transition">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-ink group-hover:text-primary transition">
                  Moderasi Kolaborasi
                </h3>
                <p className="mt-2 text-xs text-steel leading-relaxed">
                  Pantau setiap postingan studi kasus akademik dan magang dari perusahaan. Pastikan sesuai dengan aturan dan standar kualitas BridgeU.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between font-mono text-xs text-primary font-semibold">
                <span>Buka Moderasi →</span>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] text-blue-700 font-medium">
                  {isLoading ? "..." : totalKolaborasi} Proyek
                </span>
              </div>
            </Link>

            {/* Modul Verifikasi Perusahaan */}
            <Link
              href="/admin/perusahaan"
              className="group rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur-xl transition hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 font-display text-xl font-bold group-hover:scale-110 transition">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-ink group-hover:text-emerald-700 transition">
                  Verifikasi Perusahaan
                </h3>
                <p className="mt-2 text-xs text-steel leading-relaxed">
                  Tinjau kelengkapan NIB & profil hukum perusahaan mitra baru untuk memberikan centang verified resmi pada platform.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between font-mono text-xs text-emerald-700 font-semibold">
                <span>Buka Verifikasi →</span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] text-amber-700 font-medium">
                  {isLoading ? "..." : pendingCompanies} Perlu Tindakan
                </span>
              </div>
            </Link>

            {/* Modul Manajemen Pengguna */}
            <Link
              href="/admin/pengguna"
              className="group rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur-xl transition hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 font-display text-xl font-bold group-hover:scale-110 transition">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-ink group-hover:text-purple-700 transition">
                  Manajemen Pengguna
                </h3>
                <p className="mt-2 text-xs text-steel leading-relaxed">
                  Kelola hak akses seluruh pengguna mahasiswa dan perusahaan terdaftar. Penangguhan akun jika terjadi penyalahgunaan.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between font-mono text-xs text-purple-700 font-semibold">
                <span>Kelola Pengguna →</span>
                <span className="rounded-full bg-purple-50 px-3 py-1 text-[11px] text-purple-700 font-medium">
                  {isLoading ? "..." : totalUsers} Akun
                </span>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

