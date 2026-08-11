"use client";

import Link from "next/link";
import { useAdminKolaborasi } from "./hooks/useAdminKolaborasi";

export default function AdminModerasiKolaborasiPage() {
  const {
    kolaborasiList,
    filteredList,
    isLoading,
    filterStatus,
    setFilterStatus,
    search,
    setSearch,
    handleUpdateStatus,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
  } = useAdminKolaborasi();

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
                : kolaborasiList.filter((item) => item.status_moderasi === st).length;

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
      {isLoading ? (
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-steel/15 bg-white/70 p-6 shadow-sm animate-pulse space-y-3"
            >
              <div className="flex gap-2">
                <div className="h-5 w-24 bg-steel/20 rounded-full"></div>
                <div className="h-5 w-16 bg-steel/20 rounded-full"></div>
                <div className="h-5 w-16 bg-steel/20 rounded-full"></div>
              </div>
              <div className="h-6 w-1/3 bg-steel/20 rounded"></div>
              <div className="h-4 w-2/3 bg-steel/20 rounded"></div>
              <div className="h-3 w-1/4 bg-steel/20 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredList.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-steel/30 bg-white/40 p-12 text-center">
          <p className="text-sm text-steel">Tidak ada proyek kolaborasi ditemukan.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {filteredList.map((item) => {
            const status = item.status_moderasi;
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-steel/15 bg-white/70 p-6 shadow-sm transition hover:shadow-md hover:border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-bridge-gold bg-bridge-gold/10 px-2.5 py-0.5 rounded-full border border-bridge-gold/20">
                      {item.perusahaan_nama}
                    </span>
                    <span className="rounded-full bg-steel/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-steel">
                      {item.nama_kategori}
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
                        ? "Disetujui (Aktif)"
                        : status === "Menunggu"
                        ? "Menunggu Moderasi"
                        : "Ditolak / Take Down"}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-lg font-bold text-ink leading-snug">
                    {item.judul}
                  </h3>
                  <p className="mt-1 text-xs text-steel line-clamp-2 leading-relaxed">
                    {item.deskripsi}
                  </p>

                  <div className="mt-3 flex items-center gap-4 font-mono text-[11px] text-steel">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-steel" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {item.nama_kota}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-steel" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Batas: {item.batas_waktu}
                    </span>
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

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between border-t border-steel/10 pt-6">
          <p className="text-xs text-steel font-mono">
            Menampilkan {filteredList.length} dari {totalCount} proyek
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-full border border-steel/20 bg-white px-3.5 py-1.5 font-mono text-xs font-medium text-steel transition hover:border-ink hover:text-ink disabled:opacity-40 disabled:hover:border-steel/20 disabled:hover:text-steel"
            >
              ← Prev
            </button>
            <span className="font-mono text-xs text-ink font-semibold">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full border border-steel/20 bg-white px-3.5 py-1.5 font-mono text-xs font-medium text-steel transition hover:border-ink hover:text-ink disabled:opacity-40 disabled:hover:border-steel/20 disabled:hover:text-steel"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
