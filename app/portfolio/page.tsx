"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { badgeList } from "@/lib/dummy-data";

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
  tujuan: string;
  tanggal: string;
};

export default function PortfolioPage() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [pengajuan, setPengajuan] = useState<Pengajuan[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("bridgeu_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      queueMicrotask(() => setUser(parsedUser));
    }

    const storedPengajuan = localStorage.getItem("bridgeu_pengajuan");
    if (storedPengajuan) {
      const parsedPengajuan = JSON.parse(storedPengajuan);
      queueMicrotask(() => setPengajuan(parsedPengajuan));
    }
  }, []);

  const total = pengajuan.length;
  const diterima = pengajuan.filter(
    (p) => p.status === "Diterima" || p.status === "Selesai"
  ).length;

  const earnedBadges = badgeList.filter((b) => b.check(total, diterima));
  const lockedBadges = badgeList.filter((b) => !b.check(total, diterima));

  const level = Math.floor(total / 2) + 1;
  const progressToNextLevel = (total % 2) / 2;

  const outcomes = pengajuan.filter(
    (p) => p.status === "Diterima" || p.status === "Selesai"
  );

  return (
    <main>
      <Navbar />

      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Portfolio & Pencapaian
        </h1>
        <p className="mt-2 text-sm text-steel">
          Rekam jejak kolaborasi akademik kamu, terbentuk otomatis dari
          aktivitas di BridgeU.
        </p>

        {/* PROFIL RINGKAS */}
        {user && (
          <div className="mt-8 rounded-xl border border-steel/15 p-6">
            <p className="font-display text-lg font-semibold text-ink">
              {user.nama}
            </p>
            <p className="text-sm text-steel">
              {user.universitas} — {user.prodi}
            </p>
          </div>
        )}

        {/* LEVEL */}
        <div className="mt-6 rounded-xl border border-steel/15 p-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wide text-steel">
              Level Mahasiswa
            </span>
            <span className="font-display text-lg font-semibold text-bridge-gold">
              Level {level}
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-steel/10">
            <div
              className="h-full rounded-full bg-bridge-gold transition-all"
              style={{ width: `${progressToNextLevel * 100}%` }}
            />
          </div>
          <p className="mt-2 font-mono text-xs text-steel">
            {total} kolaborasi diajukan — naik level setiap 2 pengajuan
          </p>
        </div>

        {/* BADGES */}
        <div className="mt-10">
          <h2 className="font-display text-lg font-semibold text-ink">
            Badge & Pencapaian
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {earnedBadges.map((b) => (
              <div
                key={b.id}
                className="rounded-xl border border-bridge-gold/40 bg-bridge-gold/5 p-5"
              >
                <span className="font-mono text-[10px] uppercase tracking-wide text-bridge-gold">
                  Terbuka
                </span>
                <h3 className="mt-1 font-display text-base font-semibold text-ink">
                  {b.nama}
                </h3>
                <p className="mt-1 text-sm text-steel">{b.deskripsi}</p>
              </div>
            ))}
            {lockedBadges.map((b) => (
              <div
                key={b.id}
                className="rounded-xl border border-steel/15 p-5 opacity-50"
              >
                <span className="font-mono text-[10px] uppercase tracking-wide text-steel">
                  Terkunci
                </span>
                <h3 className="mt-1 font-display text-base font-semibold text-ink">
                  {b.nama}
                </h3>
                <p className="mt-1 text-sm text-steel">{b.deskripsi}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ACHIEVEMENT RECORD */}
        <div className="mt-10">
          <h2 className="font-display text-lg font-semibold text-ink">
            Rekam Jejak Kolaborasi
          </h2>
          {outcomes.length === 0 ? (
            <div className="mt-4 rounded-xl border border-steel/15 p-8 text-center">
              <p className="text-sm text-steel">
                Belum ada kolaborasi yang diterima. Rekam jejak akan muncul
                otomatis setelah pengajuan kamu disetujui perusahaan.
              </p>
              <Link
                href="/kolaborasi"
                className="mt-4 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-steel"
              >
                Cari Peluang Kolaborasi
              </Link>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              {outcomes.map((o, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-steel/15 px-5 py-4"
                >
                  <p className="font-medium text-ink">{o.judul}</p>
                  <p className="text-sm text-steel">{o.perusahaan}</p>
                  <p className="mt-1 font-mono text-xs text-verified">
                    Status: {o.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}