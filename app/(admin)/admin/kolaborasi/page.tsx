"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { dummyKolaborasi, Kolaborasi } from "@/lib/dummy-data";

export default function AdminModerasiKolaborasiPage() {
  const [kolaborasiList, setKolaborasiList] = useState<Kolaborasi[]>([]);
  const [filterStatus, setFilterStatus] = useState<"Semua" | "Disetujui" | "Menunggu" | "Ditolak">("Semua");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("bridgeu_kolaborasi_list");
    if (stored) {
      const parsed: Kolaborasi[] = JSON.parse(stored);
      // Ensure all items have default statusModerasi = Disetujui if not specified
      const formatted = parsed.map((item) => ({
        ...item,
        statusModerasi: item.statusModerasi || "Disetujui",
      }));
      queueMicrotask(() => setKolaborasiList(formatted));
    } else {
      const formatted = dummyKolaborasi.map((item) => ({
        ...item,
        statusModerasi: "Disetujui" as const,
      }));
      queueMicrotask(() => setKolaborasiList(formatted));
    }
  }, []);

  const handleUpdateStatus = (id: string, newStatus: "Disetujui" | "Ditolak") => {
    const updated = kolaborasiList.map((item) =>
      item.id === id ? { ...item, statusModerasi: newStatus } : item
    );
    setKolaborasiList(updated);
    localStorage.setItem("bridgeu_kolaborasi_list", JSON.stringify(updated));
  };

  const filteredList = kolaborasiList.filter((item) => {
    const matchesSearch =
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      item.perusahaan.toLowerCase().includes(search.toLowerCase()) ||
      item.kategori.toLowerCase().includes(search.toLowerCase());

    const status = item.statusModerasi || "Disetujui";
    if (filterStatus === "Semua") return matchesSearch;
    return matchesSearch && status === filterStatus;
  });

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/dashboard"
            className="font-mono text-xs text-steel hover:text-ink transition inline-flex items-center gap-1.5"
          >
            ← Kembali ke Dashboard Admin
          </Link>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink">
            Moderasi Peluang Kolaborasi
          </h1>
          <p className="mt-0.5 text-sm text-steel">
            Pantau dan verifikasi setiap proyek yang dipublikasikan oleh perusahaan agar sesuai dengan ketentuan platform.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          {(["Semua", "Disetujui", "Menunggu", "Ditolak"] as const).map((st) => {
            const count =
              st === "Semua"
                ? kolaborasiList.length
                : kolaborasiList.filter((item) => (item.statusModerasi || "Disetujui") === st).length;

            return (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`rounded-full px-4 py-2 font-medium transition ${
                  filterStatus === st
                    ? "bg-ink text-paper border border-ink shadow-sm"
                    : "bg-white/60 text-steel border border-steel/20 hover:border-ink hover:text-ink"
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari judul proyek atau perusahaan..."
          className="rounded-full border border-steel/25 bg-white px-4 py-2 text-xs outline-none transition focus:border-emerald-500 w-full sm:w-64"
        />
      </div>

      {/* Grid List Kolaborasi */}
      {filteredList.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-steel/30 bg-white/40 p-12 text-center">
          <p className="text-sm text-steel">Tidak ada proyek kolaborasi ditemukan.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {filteredList.map((item) => {
            const status = item.statusModerasi || "Disetujui";
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-steel/15 bg-white/70 p-6 shadow-sm transition hover:shadow-md hover:border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-bridge-gold bg-bridge-gold/10 px-2.5 py-0.5 rounded-full border border-bridge-gold/20">
                      {item.perusahaan}
                    </span>
                    <span className="rounded-full bg-steel/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-steel">
                      {item.kategori}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold ${
                        item.tipe === "Akademik"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {item.tipe}
                    </span>

                    <span
                      className={`ml-auto font-mono text-xs px-3 py-1 rounded-full font-semibold ${
                        status === "Disetujui"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : status === "Menunggu"
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                          : "bg-red-100 text-red-700 border border-red-300"
                      }`}
                    >
                      {status === "Disetujui"
                        ? "✓ Disetujui (Aktif)"
                        : status === "Menunggu"
                        ? "⏳ Menunggu Moderasi"
                        : "🚫 Ditolak / Take Down"}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-lg font-bold text-ink leading-snug">
                    {item.judul}
                  </h3>
                  <p className="mt-1 text-xs text-steel line-clamp-2 leading-relaxed">
                    {item.deskripsi}
                  </p>

                  <div className="mt-3 flex items-center gap-4 font-mono text-[11px] text-steel">
                    <span>📍 {item.lokasi}</span>
                    <span>📅 Batas: {item.batasWaktu}</span>
                  </div>
                </div>

                {/* Tombol Aksi Admin */}
                <div className="flex md:flex-col items-center gap-2 justify-end border-t md:border-t-0 md:border-l border-steel/10 pt-4 md:pt-0 md:pl-6">
                  {status !== "Disetujui" && (
                    <button
                      onClick={() => handleUpdateStatus(item.id, "Disetujui")}
                      className="w-full md:w-36 rounded-full bg-emerald-600 px-4 py-2 font-mono text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-sm"
                    >
                      ✓ Setujui (Approve)
                    </button>
                  )}

                  {status !== "Ditolak" && (
                    <button
                      onClick={() => handleUpdateStatus(item.id, "Ditolak")}
                      className="w-full md:w-36 rounded-full border border-red-200 bg-red-50 px-4 py-2 font-mono text-xs font-medium text-red-600 hover:bg-red-100 transition"
                    >
                      ✕ Take Down
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
