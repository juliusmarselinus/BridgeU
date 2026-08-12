"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminPerusahaan } from "./hooks/useAdminPerusahaan";
import { GradientBars } from "@/components/ui/gradient-bars-background";

export default function AdminVerifikasiPerusahaanPage() {
  const {
    companyList,
    filteredList,
    isLoading,
    filterStatus,
    setFilterStatus,
    handleUpdateVerifikasi,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
  } = useAdminPerusahaan();

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
              Verifikasi Identitas Perusahaan
            </h1>
            <p className="mt-1.5 text-sm font-medium text-paper/90 max-w-2xl leading-relaxed">
              Tinjau keabsahan berkas legalitas dan Nomor Induk Berusaha (NIB) milik perusahaan mitra untuk memberikan verifikasi resmi.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 mx-auto max-w-6xl px-6 -mt-8 space-y-6">
        {/* Filter Tabs */}
        <div className="rounded-3xl border border-white/60 bg-white/80 p-4 sm:p-5 shadow-lg backdrop-blur-xl flex flex-wrap gap-2 font-mono text-xs">
          {(["Semua", "Menunggu Verifikasi", "Terverifikasi", "Ditolak"] as const).map(
            (st) => {
              const count =
                st === "Semua"
                  ? companyList.length
                  : companyList.filter((c) => c.statusVerifikasi === st).length;

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
            }
          )}
        </div>

        {/* Grid Perusahaan (2x4 mobile, 4x2 desktop) */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="h-52 rounded-3xl border border-white/60 bg-white/80 p-4 shadow-lg backdrop-blur-xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-steel/30 bg-white/60 p-12 text-center shadow-sm">
            <p className="text-xs font-mono text-steel">
              Tidak ada perusahaan dengan status &quot;{filterStatus}&quot;.
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredList.map((comp) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  key={comp.id}
                  className="rounded-3xl border border-white/60 bg-white/80 p-4 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex flex-col gap-1.5 border-b border-border/40 pb-2.5">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 font-bold border border-emerald-500/30">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0H9m4 0h2" />
                          </svg>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold shrink-0 ${
                            comp.statusVerifikasi === "Terverifikasi"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : comp.statusVerifikasi === "Menunggu Verifikasi"
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-rose-100 text-rose-700 border border-rose-300"
                          }`}
                        >
                          {comp.statusVerifikasi === "Menunggu Verifikasi" ? "Menunggu" : comp.statusVerifikasi}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-display text-xs font-bold text-ink leading-snug truncate flex items-center gap-1">
                          <span className="truncate">{comp.nama}</span>
                          {comp.statusVerifikasi === "Terverifikasi" && (
                            <span className="text-emerald-600 font-bold shrink-0 text-[11px]" title="Terverifikasi">
                              ✓
                            </span>
                          )}
                        </h3>
                        <p className="font-mono text-[10px] text-steel truncate mt-0.5">
                          {comp.industri}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2.5 space-y-1.5">
                      <div className="bg-steel/[0.06] p-2 rounded-2xl border border-steel/10">
                        <span className="block font-mono font-semibold text-steel uppercase text-[8px]">
                          NIB Legalitas:
                        </span>
                        <span className="block font-mono font-bold text-ink text-[10px] truncate">{comp.nib}</span>
                      </div>

                      <div className="flex flex-col text-steel font-mono text-[9px] px-1 gap-0.5">
                        <span className="truncate">Kota: <strong className="text-ink font-medium">{comp.lokasi}</strong></span>
                        <span className="truncate">Email: <strong className="text-ink font-medium">{comp.email}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-border/40 flex flex-col gap-1.5">
                    <span className="font-mono text-[9px] text-steel flex items-center gap-1">
                      <svg className="w-2.5 h-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Tgl: {comp.tanggalDaftar}
                    </span>

                    <div className="flex items-center gap-1 w-full">
                      {comp.statusVerifikasi === "Menunggu Verifikasi" && (
                        <>
                          <button
                            onClick={() => handleUpdateVerifikasi(comp.id, "Ditolak")}
                            className="flex-1 rounded-full border border-rose-200 bg-rose-50 py-1 font-mono text-[10px] font-semibold text-rose-700 hover:bg-rose-100 transition active:scale-95 text-center cursor-pointer"
                          >
                            Tolak
                          </button>
                          <button
                            onClick={() => handleUpdateVerifikasi(comp.id, "Terverifikasi")}
                            className="flex-1 rounded-full bg-emerald-600 py-1 font-mono text-[10px] font-semibold text-white hover:bg-emerald-700 transition active:scale-95 shadow-sm text-center cursor-pointer"
                          >
                            ✓ Verifikasi
                          </button>
                        </>
                      )}

                      {comp.statusVerifikasi === "Terverifikasi" && (
                        <span className="w-full text-center font-mono text-[10px] text-emerald-700 font-semibold py-0.5">
                          ✓ Terverifikasi Resmi
                        </span>
                      )}

                      {comp.statusVerifikasi === "Ditolak" && (
                        <span className="w-full text-center font-mono text-[10px] text-rose-600 font-medium py-0.5">
                          ✕ Verifikasi Ditolak
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border/40 pt-6">
            <p className="text-xs text-steel font-mono">
              Menampilkan {filteredList.length} dari {totalCount} perusahaan
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

