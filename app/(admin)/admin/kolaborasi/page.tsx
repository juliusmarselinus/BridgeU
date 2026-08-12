"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminKolaborasi } from "./hooks/useAdminKolaborasi";
import { GradientBars } from "@/components/ui/gradient-bars-background";

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
    <main className="relative overflow-hidden bg-gradient-to-b from-secondary/15 via-clouds to-clouds pb-12 font-sans text-ink">
      <GradientBars
        numBars={20}
        gradientFrom="rgb(176, 208, 218)"
        gradientTo="transparent"
        animationDuration={7}
        className="opacity-70"
      />

      {/* Hero Header */}
      <div className="relative z-10 w-full bg-clouds">
        <div
          className="relative w-full pt-28 pb-16 overflow-hidden rounded-b-[2.5rem] shadow-[0_20px_50px_-20px_rgba(18,40,75,0.45)]"
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

          <div className="relative z-10 mx-auto max-w-6xl px-6">
            <Link
              href="/admin/dashboard"
              className="font-mono text-xs font-semibold text-sky hover:text-white transition inline-flex items-center gap-1.5 mb-3 group"
            >
              <span className="transition-transform group-hover:-translate-x-1">←</span> Kembali ke Dashboard Admin
            </Link>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
              Moderasi Peluang Kolaborasi
            </h1>
            <p className="mt-1.5 text-sm font-medium text-paper/90 max-w-2xl leading-relaxed">
              Pantau dan verifikasi setiap proyek yang dipublikasikan oleh perusahaan agar sesuai dengan ketentuan dan standar platform BridgeU.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 mx-auto max-w-6xl px-6 -mt-8 space-y-6">
        {/* Filter Tabs & Search Bar Card */}
        <div className="rounded-3xl border border-white/60 bg-white/80 p-4 sm:p-5 shadow-lg backdrop-blur-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
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
                  className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${
                    filterStatus === st
                      ? "bg-ink text-paper shadow-md scale-105"
                      : "bg-steel/[0.08] text-steel hover:bg-steel/15 hover:text-ink"
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
            className="rounded-full border border-border bg-white px-4 py-2 text-xs text-ink placeholder:text-steel/50 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 w-full sm:w-72 shadow-inner"
          />
        </div>

        {/* Grid List Kolaborasi (2x4 mobile, 4x2 desktop) */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="h-56 rounded-3xl border border-white/60 bg-white/80 p-4 shadow-lg backdrop-blur-xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-steel/30 bg-white/60 p-12 text-center shadow-sm">
            <p className="text-xs font-mono text-steel">Tidak ada proyek kolaborasi ditemukan.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredList.map((item) => {
                const status = item.status_moderasi;
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    key={item.id}
                    className="rounded-3xl border border-white/60 bg-white/80 p-4 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-col gap-1.5 border-b border-border/40 pb-2.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 truncate max-w-[100px]">
                            {item.perusahaan_nama}
                          </span>
                          <span
                            className={`font-mono text-[8px] px-1.5 py-0.5 rounded-full font-semibold shrink-0 ${
                              status === "Disetujui"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : status === "Menunggu"
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : "bg-rose-100 text-rose-700 border border-rose-300"
                            }`}
                          >
                            {status === "Disetujui" ? "Aktif" : status}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 font-mono text-[9px]">
                          <span className="rounded-full bg-steel/10 px-1.5 py-0.5 font-medium text-steel text-[8px] truncate">
                            {item.nama_kategori}
                          </span>
                          <span
                            className={`rounded-full px-1.5 py-0.5 font-semibold text-[8px] ${
                              item.tipe === "Akademik"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {item.tipe}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-display text-xs font-bold text-ink leading-snug line-clamp-2">
                        {item.judul}
                      </h3>
                      <p className="text-[10px] text-steel line-clamp-2 leading-relaxed">
                        {item.deskripsi}
                      </p>

                      <div className="flex flex-col gap-0.5 font-mono text-[9px] text-steel pt-1">
                        <span className="flex items-center gap-1 truncate">
                          <svg className="w-2.5 h-2.5 text-steel shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <span className="truncate">{item.nama_kota}</span>
                        </span>
                        <span className="flex items-center gap-1 truncate">
                          <svg className="w-2.5 h-2.5 text-steel shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="truncate">Batas: {item.batas_waktu}</span>
                        </span>
                      </div>
                    </div>

                    {/* Tombol Aksi Admin */}
                    <div className="flex items-center gap-1 justify-end border-t border-border/40 pt-2.5 mt-2.5">
                      {status !== "Disetujui" && (
                        <button
                          onClick={() => handleUpdateStatus(item.id, "Disetujui")}
                          className="flex-1 rounded-full bg-emerald-600 py-1 font-mono text-[10px] font-semibold text-white hover:bg-emerald-700 transition active:scale-95 shadow-sm text-center cursor-pointer"
                        >
                          ✓ Setujui
                        </button>
                      )}

                      {status !== "Ditolak" && (
                        <button
                          onClick={() => handleUpdateStatus(item.id, "Ditolak")}
                          className="flex-1 rounded-full border border-rose-200 bg-rose-50 py-1 font-mono text-[10px] font-medium text-rose-700 hover:bg-rose-100 transition active:scale-95 text-center cursor-pointer"
                        >
                          ✕ Down
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border/40 pt-6">
            <p className="text-xs text-steel font-mono">
              Menampilkan {filteredList.length} dari {totalCount} proyek
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-full border border-border bg-white/80 px-4 py-1.5 font-mono text-xs font-semibold text-ink transition hover:bg-white disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="font-mono text-xs text-ink font-semibold">
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-full border border-border bg-white/80 px-4 py-1.5 font-mono text-xs font-semibold text-ink transition hover:bg-white disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

