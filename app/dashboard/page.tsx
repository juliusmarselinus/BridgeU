"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Navbar } from "@/components/Navbar";

type StoredUser = {
  nama: string;
  universitas: string;
  prodi: string;
};

type Pengajuan = {
  id: string;
  judul: string;
  perusahaan: string;
  status: string;
  tanggal: string;
};

const statusStyle: Record<string, string> = {
  Menunggu: "bg-bridge-gold/15 text-bridge-gold border-bridge-gold/30",
  Diproses: "bg-steel/10 text-steel border-steel/20",
  Diterima: "bg-verified/15 text-verified border-verified/30",
  Ditolak: "bg-red-100 text-red-600 border-red-200",
  Selesai: "bg-ink/10 text-ink border-ink/10",
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/* ------------------------------------------------------------------ */
/* Icons                                                              */
/* ------------------------------------------------------------------ */
function IconSigma({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 4H6l6 8-6 8h12" />
    </svg>
  );
}

function IconClock({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconCheckCircle({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconTrophy({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </svg>
  );
}

function IconCompass({ className = "w-5 h-5 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function IconActivity({ className = "w-5 h-5 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Animated number counter                                            */
/* ------------------------------------------------------------------ */
function useSpringNumber(target: number, springConfig = { stiffness: 120, damping: 18 }) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, springConfig);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    motionVal.set(target);
  }, [target, motionVal]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => setDisplay(Math.round(v)));
    return () => unsub();
  }, [spring]);

  return display;
}

/* ------------------------------------------------------------------ */
/* Entrance wrapper                                                    */
/* ------------------------------------------------------------------ */
function RevealCard({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [pengajuan, setPengajuan] = useState<Pengajuan[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("bridgeu_user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const storedPengajuan = localStorage.getItem("bridgeu_pengajuan");
    if (storedPengajuan) setPengajuan(JSON.parse(storedPengajuan));
  }, []);

  const total = pengajuan.length;
  const menunggu = pengajuan.filter((p) => p.status === "Menunggu").length;
  const diterima = pengajuan.filter((p) => p.status === "Diterima").length;
  const level = Math.floor(total / 2) + 1;
  const progress = (total % 2) / 2;
  const sisaMenujuLevel = total % 2 === 0 ? 2 : 2 - (total % 2);

  const animatedTotal = useSpringNumber(total);
  const animatedMenunggu = useSpringNumber(menunggu);
  const animatedDiterima = useSpringNumber(diterima);
  const animatedLevel = useSpringNumber(level);

  return (
    <main className="min-h-screen bg-paper pb-20">
      {/* NAVBAR + HERO dibungkus bareng biar background nyambung */}
      <div className="-mt-20 w-full bg-paper">
        <div className="w-full bg-gradient-to-b from-ink via-ink/90 to-paper relative pt-24 pb-16 sm:pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent)]" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-bridge-gold/15 blur-3xl" />

          <Navbar />

          <div className="relative mx-auto max-w-6xl px-6">
            <div className="flex flex-col justify-between gap-10 sm:flex-row sm:items-end">
              <RevealCard delay={0}>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-bridge-gold">
                  Selamat datang kembali
                </p>
                <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-paper sm:text-6xl">
                  {user ? user.nama : "Mahasiswa"}
                </h1>
                <p className="mt-3 text-sm text-paper/60">
                  {user ? `${user.universitas} — ${user.prodi}` : ""}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1.5 font-mono text-[11px] text-paper/70 border border-white/10">
                    {user?.prodi || "Mahasiswa Aktif"}
                  </span>
                  <span className="rounded-full bg-bridge-gold/15 px-3 py-1.5 font-mono text-[11px] text-bridge-gold border border-bridge-gold/30 flex items-center gap-1.5">
                    <IconTrophy className="w-3 h-3 text-bridge-gold" />
                    Level {animatedLevel}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1.5 font-mono text-[11px] text-paper/70 border border-white/10">
                    {animatedTotal} Kolaborasi
                  </span>
                </div>
              </RevealCard>

              <RevealCard delay={0.1} className="w-full max-w-xs rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wide text-paper/60">
                    Level Kolaborasi
                  </span>
                  <span className="font-display text-lg font-semibold text-bridge-gold">
                    Lv {animatedLevel}
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-bridge-gold"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(progress * 100, 6)}%` }}
                    transition={{ type: "spring", stiffness: 90, damping: 16 }}
                  />
                </div>
                <p className="mt-2 font-mono text-[11px] text-paper/50">
                  {total} kolaborasi diajukan sejauh ini
                </p>
              </RevealCard>
            </div>
          </div>
        </div>
      </div>

      {/* KONTEN */}
      <div className="relative mx-auto max-w-6xl px-6 pt-10">
        {/* STATISTIK */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-5">
          <RevealCard
            delay={0.05}
            className="group rounded-2xl border border-steel/20 bg-paper p-7 transition duration-300 hover:-translate-y-1 hover:border-bridge-gold/40 hover:shadow-lg sm:col-span-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-steel uppercase tracking-wide">
                Total Pengajuan
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-bridge-gold/30 bg-bridge-gold/10 text-bridge-gold">
                <IconSigma className="w-4 h-4 text-bridge-gold" />
              </span>
            </div>
            <p className="mt-3 font-display text-5xl font-semibold text-ink">
              {animatedTotal}
            </p>
            <p className="mt-2 text-sm text-steel">
              Kolaborasi yang sudah kamu ajukan sepanjang perjalanan di BridgeU.
            </p>
          </RevealCard>

          <RevealCard
            delay={0.1}
            className="group rounded-2xl border border-steel/20 bg-paper p-6 transition duration-300 hover:-translate-y-1 hover:border-bridge-gold/40 hover:shadow-lg sm:col-span-2"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-steel uppercase tracking-wide">
                Menunggu
              </p>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-bridge-gold/10 border border-bridge-gold/30">
                <IconClock className="w-4 h-4 text-bridge-gold" />
              </span>
            </div>
            <p className="mt-3 font-display text-4xl font-semibold text-bridge-gold">
              {animatedMenunggu}
            </p>
          </RevealCard>

          <RevealCard
            delay={0.15}
            className="group rounded-2xl border border-steel/20 bg-paper p-6 transition duration-300 hover:-translate-y-1 hover:border-verified/40 hover:shadow-lg sm:col-span-2"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-steel uppercase tracking-wide">
                Diterima
              </p>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-verified/10 border border-verified/30">
                <IconCheckCircle className="w-4 h-4 text-verified" />
              </span>
            </div>
            <p className="mt-3 font-display text-4xl font-semibold text-verified">
              {animatedDiterima}
            </p>
          </RevealCard>

          <RevealCard
            delay={0.2}
            className="rounded-2xl border border-dashed border-steel/25 bg-steel/5 p-6 sm:col-span-3"
          >
            <p className="text-xs font-semibold text-steel uppercase tracking-wide">
              Progress Level
            </p>
            <p className="mt-3 text-sm leading-relaxed text-steel">
              Ajukan <span className="font-bold text-ink">{sisaMenujuLevel}</span> kolaborasi lagi untuk naik ke Level{" "}
              <span className="font-bold text-ink">{level + 1}</span>.
            </p>
          </RevealCard>
        </div>

        {/* CTA UTAMA */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <RevealCard delay={0.1}>
            <Link
              href="/kolaborasi"
              className="group relative block overflow-hidden rounded-2xl bg-ink p-7 text-paper border border-bridge-gold/20 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-bridge-gold/50"
            >
              <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-bridge-gold/15 blur-2xl pointer-events-none group-hover:bg-bridge-gold/25 transition-colors" />
              <div className="relative">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-bridge-gold/15 border border-bridge-gold/30 mb-3">
                  <IconCompass className="w-5 h-5 text-bridge-gold" />
                </span>
                <span className="font-mono text-xs uppercase tracking-wide text-bridge-gold">
                  Aksi Utama
                </span>
                <h3 className="mt-2 font-display text-xl font-semibold">
                  Cari Peluang Kolaborasi
                </h3>
                <p className="mt-2 max-w-xs text-sm text-paper/70">
                  Jelajahi studi kasus, riset, dan magang dari perusahaan terverifikasi.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 font-mono text-sm text-bridge-gold transition group-hover:gap-3">
                  Mulai jelajah <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          </RevealCard>

          <RevealCard delay={0.15}>
            <Link
              href="/status"
              className="group block rounded-2xl border border-steel/20 bg-paper p-7 transition duration-300 hover:-translate-y-1 hover:border-bridge-gold/40 hover:shadow-lg"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-steel/10 border border-steel/20 mb-3">
                <IconActivity className="w-5 h-5 text-bridge-gold" />
              </span>
              <span className="font-mono text-xs uppercase tracking-wide text-steel">
                Pantau
              </span>
              <h3 className="mt-2 font-display text-xl font-semibold text-ink">
                Lihat Status Pengajuan
              </h3>
              <p className="mt-2 text-sm text-steel">
                Pantau perkembangan pengajuan kolaborasi yang sudah kamu kirim.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-mono text-sm text-ink transition group-hover:gap-3">
                Lihat semua <span aria-hidden>→</span>
              </span>
            </Link>
          </RevealCard>
        </div>

        {/* PENGAJUAN TERBARU */}
        {pengajuan.length > 0 && (
          <RevealCard delay={0.2} className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">
                Pengajuan Terbaru
              </h2>
              <Link
                href="/status"
                className="font-mono text-xs text-bridge-gold underline underline-offset-4 transition hover:text-ink"
              >
                Lihat semua
              </Link>
            </div>
            <div className="mt-5 flex flex-col gap-3">
              {pengajuan
                .slice(-3)
                .reverse()
                .map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" }}
                    className="group flex items-center gap-4 rounded-2xl border border-steel/20 bg-paper p-5 transition duration-200 hover:-translate-y-0.5 hover:border-bridge-gold/40 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-xs font-medium text-paper border border-bridge-gold/30">
                      {initials(p.perusahaan)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-ink">{p.judul}</p>
                      <p className="text-sm text-steel">{p.perusahaan}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wide ${
                        statusStyle[p.status] || "bg-steel/10 text-steel border-steel/20"
                      }`}
                    >
                      {p.status}
                    </span>
                  </motion.div>
                ))}
            </div>
          </RevealCard>
        )}
      </div>
    </main>
  );
}