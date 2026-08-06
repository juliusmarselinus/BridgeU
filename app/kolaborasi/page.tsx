"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { dummyKolaborasi } from "@/lib/dummy-data";
import { Navbar } from "@/components/Navbar";

export default function KolaborasiPage() {
  const [search, setSearch] = useState("");
  const [tipeFilter, setTipeFilter] = useState<"Semua" | "Akademik" | "Magang">(
    "Semua"
  );

  const filtered = useMemo(() => {
    return dummyKolaborasi.filter((k) => {
      const matchSearch =
        k.judul.toLowerCase().includes(search.toLowerCase()) ||
        k.perusahaan.toLowerCase().includes(search.toLowerCase()) ||
        k.kategori.toLowerCase().includes(search.toLowerCase());
      const matchTipe = tipeFilter === "Semua" || k.tipe === tipeFilter;
      return matchSearch && matchTipe;
    });
  }, [search, tipeFilter]);

  return (
    <main>
      {/* NAVBAR */}
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Peluang Kolaborasi
        </h1>
        <p className="mt-2 text-sm text-steel">
          Jelajahi studi kasus, riset, dan magang dari perusahaan terverifikasi.
        </p>

        {/* SEARCH & FILTER */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul, perusahaan, atau kategori..."
            className="w-full rounded-lg border border-steel/25 px-4 py-3 text-sm outline-none transition focus:border-ink sm:max-w-sm"
          />
          <div className="flex gap-2 font-mono text-xs">
            {(["Semua", "Akademik", "Magang"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTipeFilter(t)}
                className={`rounded-full px-4 py-2 transition ${
                  tipeFilter === t
                    ? "bg-ink text-paper"
                    : "border border-steel/25 text-steel hover:border-ink"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* LIST */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {filtered.map((k) => (
            <div
              key={k.id}
              className="rounded-xl border border-steel/15 p-6 transition hover:border-ink"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-steel">{k.perusahaan}</span>
                <span
                  className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wide ${
                    k.tipe === "Akademik"
                      ? "bg-steel/10 text-steel"
                      : "bg-bridge-gold/15 text-bridge-gold"
                  }`}
                >
                  {k.tipe}
                </span>
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                {k.judul}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-steel">
                {k.deskripsi}
              </p>
              <div className="mt-4 flex items-center justify-between font-mono text-xs text-steel">
                <span>{k.lokasi}</span>
                <span>Batas: {k.batasWaktu}</span>
              </div>
              <Link
                href={`/kolaborasi/${k.id}`}
                className="mt-4 block w-full rounded-lg bg-ink py-2.5 text-center text-sm font-medium text-paper transition hover:bg-steel"
              >
                Lihat Detail & Ajukan
              </Link>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="col-span-2 py-10 text-center text-sm text-steel">
              Tidak ada kolaborasi yang cocok dengan pencarian kamu.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}