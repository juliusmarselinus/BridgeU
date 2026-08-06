"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  Menunggu: "bg-bridge-gold/15 text-bridge-gold",
  Diproses: "bg-steel/15 text-steel",
  Diterima: "bg-verified/15 text-verified",
  Ditolak: "bg-red-100 text-red-600",
  Selesai: "bg-ink/10 text-ink",
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
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

  return (
    <main>
      {/* NAVBAR + HERO dibungkus bareng biar backgroundnya nyambung, gak ada celah biru */}
      <div className="bg-ink">
        <Navbar />

        {/* HERO SECTION — berhenti bersih, tanpa overlap */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
            style={{ background: "var(--color-bridge-gold)" }}
          />
          <div
            className="pointer-events-none absolute bottom-0 left-0 h-64 w-96 rounded-full opacity-10 blur-3xl"
            style={{ background: "var(--color-steel)" }}
          />

          <svg
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full"
            viewBox="0 0 1200 60"
            preserveAspectRatio="none"
          >
            <path
              d="M0 40 Q600 0 1200 40"
              stroke="var(--color-bridge-gold)"
              strokeOpacity="0.25"
              strokeWidth="1"
              fill="none"
            />
          </svg>

          <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-8 sm:pb-20 sm:pt-10">
            <div className="flex flex-col justify-between gap-10 sm:flex-row sm:items-end">
              <div>
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
                  <span className="rounded-full bg-white/10 px-3 py-1.5 font-mono text-[11px] text-paper/70">
                    {user?.prodi || "Mahasiswa Aktif"}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1.5 font-mono text-[11px] text-paper/70">
                    Level {level}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1.5 font-mono text-[11px] text-paper/70">
                    {total} Kolaborasi
                  </span>
                </div>
              </div>

              <div className="w-full max-w-xs rounded-2xl bg-white/5 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wide text-paper/60">
                    Level Kolaborasi
                  </span>
                  <span className="font-display text-lg font-semibold text-bridge-gold">
                    Lv {level}
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-bridge-gold transition-all duration-500"
                    style={{ width: `${Math.max(progress * 100, 6)}%` }}
                  />
                </div>
                <p className="mt-2 font-mono text-[11px] text-paper/50">
                  {total} kolaborasi diajukan sejauh ini
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* KONTEN — jarak normal, tanpa overlap ke hero */}
      <div className="relative mx-auto max-w-6xl px-6 pb-12 pt-10">
        {/* STATISTIK */}
        <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-5">
          <div className="group rounded-2xl bg-[#FAF7EE] p-7 shadow-[0_4px_6px_-1px_rgba(27,39,64,0.1),0_12px_28px_-6px_rgba(27,39,64,0.15)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_8px_12px_-2px_rgba(27,39,64,0.14),0_20px_40px_-8px_rgba(27,39,64,0.22)] sm:col-span-3">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-wide text-steel">
                Total Pengajuan
              </p>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/5 font-mono text-xs text-ink">
                Σ
              </span>
            </div>
            <p className="mt-3 font-display text-5xl font-semibold text-ink">
              {total}
            </p>
            <p className="mt-2 text-sm text-steel">
              Kolaborasi yang sudah kamu ajukan sepanjang perjalanan di
              BridgeU.
            </p>
          </div>

          <div className="group rounded-2xl bg-[#FAF7EE] p-6 shadow-[0_4px_6px_-1px_rgba(27,39,64,0.1),0_12px_28px_-6px_rgba(27,39,64,0.15)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_8px_12px_-2px_rgba(27,39,64,0.14),0_20px_40px_-8px_rgba(27,39,64,0.22)] sm:col-span-2">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-wide text-steel">
                Menunggu
              </p>
              <span className="h-2 w-2 rounded-full bg-bridge-gold" />
            </div>
            <p className="mt-3 font-display text-4xl font-semibold text-bridge-gold">
              {menunggu}
            </p>
          </div>

          <div className="group rounded-2xl bg-[#FAF7EE] p-6 shadow-[0_4px_6px_-1px_rgba(27,39,64,0.1),0_12px_28px_-6px_rgba(27,39,64,0.15)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_8px_12px_-2px_rgba(27,39,64,0.14),0_20px_40px_-8px_rgba(27,39,64,0.22)] sm:col-span-2">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-wide text-steel">
                Diterima
              </p>
              <span className="h-2 w-2 rounded-full bg-verified" />
            </div>
            <p className="mt-3 font-display text-4xl font-semibold text-verified">
              {diterima}
            </p>
          </div>

          <div className="rounded-2xl bg-ink/[0.04] p-6 shadow-[inset_0_1px_2px_rgba(27,39,64,0.06)] sm:col-span-3">
            <p className="font-mono text-xs uppercase tracking-wide text-steel">
              Progress Level
            </p>
            <p className="mt-3 text-sm leading-relaxed text-steel">
              Ajukan {sisaMenujuLevel} kolaborasi lagi untuk naik ke Level{" "}
              {level + 1}.
            </p>
          </div>
        </div>

        {/* CTA UTAMA */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Link
            href="/kolaborasi"
            className="group relative overflow-hidden rounded-2xl bg-ink p-7 text-paper shadow-[0_4px_6px_-1px_rgba(27,39,64,0.2),0_12px_28px_-6px_rgba(27,39,64,0.3)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_8px_16px_-2px_rgba(27,39,64,0.25),0_20px_40px_-8px_rgba(27,39,64,0.4)]"
          >
            <span className="font-mono text-xs uppercase tracking-wide text-bridge-gold">
              Aksi Utama
            </span>
            <h3 className="mt-2 font-display text-xl font-semibold">
              Cari Peluang Kolaborasi
            </h3>
            <p className="mt-2 max-w-xs text-sm text-paper/70">
              Jelajahi studi kasus, riset, dan magang dari perusahaan
              terverifikasi.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 font-mono text-sm text-bridge-gold transition group-hover:gap-3">
              Mulai jelajah <span aria-hidden>→</span>
            </span>
          </Link>

          <Link
            href="/status"
            className="group rounded-2xl bg-[#FAF7EE] p-7 shadow-[0_4px_6px_-1px_rgba(27,39,64,0.1),0_12px_28px_-6px_rgba(27,39,64,0.15)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_8px_12px_-2px_rgba(27,39,64,0.14),0_20px_40px_-8px_rgba(27,39,64,0.22)]"
          >
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
        </div>

        {/* PENGAJUAN TERBARU */}
        {pengajuan.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">
                Pengajuan Terbaru
              </h2>
              <Link
                href="/status"
                className="font-mono text-xs text-steel underline underline-offset-4 transition hover:text-ink"
              >
                Lihat semua
              </Link>
            </div>
            <div className="mt-5 flex flex-col gap-3">
              {pengajuan
                .slice(-3)
                .reverse()
                .map((p, i) => (
                  <div
                    key={i}
                    className="group flex items-center gap-4 rounded-2xl bg-[#FAF7EE] p-5 shadow-[0_2px_4px_-1px_rgba(27,39,64,0.08),0_8px_20px_-6px_rgba(27,39,64,0.12)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_8px_-1px_rgba(27,39,64,0.1),0_14px_28px_-6px_rgba(27,39,64,0.18)]"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-xs font-medium text-paper">
                      {initials(p.perusahaan)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-ink">
                        {p.judul}
                      </p>
                      <p className="text-sm text-steel">{p.perusahaan}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wide ${
                        statusStyle[p.status] || "bg-steel/10 text-steel"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}