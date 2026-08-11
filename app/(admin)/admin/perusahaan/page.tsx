"use client";

import Link from "next/link";
import { useAdminPerusahaan } from "./hooks/useAdminPerusahaan";

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
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-8">
      <div className="mb-6">
        <Link
          href="/admin/dashboard"
          className="font-mono text-xs text-steel hover:text-ink transition inline-flex items-center gap-1.5"
        >
          ← Kembali ke Dashboard Admin
        </Link>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">
          Verifikasi Identitas Perusahaan
        </h1>
        <p className="mt-0.5 text-sm text-steel">
          Tinjau keabsahan berkas legalitas dan Nomor Induk Berusaha (NIB) milik perusahaan mitra.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs">
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
                className={`rounded-full px-4 py-2 font-medium transition ${
                  filterStatus === st
                    ? "bg-ink text-paper border border-ink shadow-sm"
                    : "bg-white/60 text-steel border border-steel/20 hover:border-ink hover:text-ink"
                }`}
              >
                {st} ({count})
              </button>
            );
          }
        )}
      </div>

      {/* Grid Perusahaan */}
      {isLoading ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-steel/15 bg-white/70 p-6 shadow-sm animate-pulse space-y-4"
            >
              <div className="flex justify-between items-center pb-4 border-b border-steel/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-steel/20 rounded-full"></div>
                  <div className="space-y-1.5">
                    <div className="h-4 w-32 bg-steel/20 rounded"></div>
                    <div className="h-3 w-24 bg-steel/20 rounded"></div>
                  </div>
                </div>
                <div className="h-6 w-20 bg-steel/20 rounded-full"></div>
              </div>
              <div className="h-10 w-full bg-steel/20 rounded-xl"></div>
              <div className="h-3 w-1/3 bg-steel/20 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredList.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-steel/30 bg-white/40 p-12 text-center">
          <p className="text-sm text-steel">
            Tidak ada perusahaan dengan status &quot;{filterStatus}&quot;.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredList.map((comp) => (
            <div
              key={comp.id}
              className="rounded-2xl border border-steel/15 bg-white/70 p-6 shadow-sm transition hover:shadow-md hover:border-emerald-500/30 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-steel/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-ink">
                      <svg className="w-5 h-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0H9m4 0h2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-ink leading-tight flex items-center gap-1.5">
                        {comp.nama}
                        {comp.statusVerifikasi === "Terverifikasi" && (
                          <span className="text-emerald-600 font-bold" title="Terverifikasi">
                            ✓
                          </span>
                        )}
                      </h3>
                      <p className="font-mono text-xs text-steel">
                        {comp.industri} • {comp.lokasi}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 font-mono text-[11px] font-semibold ${
                      comp.statusVerifikasi === "Terverifikasi"
                        ? "bg-emerald-100 text-emerald-800"
                        : comp.statusVerifikasi === "Menunggu Verifikasi"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {comp.statusVerifikasi}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center bg-white/50 p-2.5 rounded-xl border border-steel/10">
                    <span className="font-mono font-semibold text-steel uppercase text-[10px]">
                      Nomor Legalitas (NIB):
                    </span>
                    <span className="font-mono font-bold text-ink">{comp.nib}</span>
                  </div>

                  <div className="flex justify-between items-center text-steel font-mono text-[11px] pt-1">
                    <span>Email Resmi:</span>
                    <span className="text-ink font-medium">{comp.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-steel/10 flex items-center justify-between">
                <span className="font-mono text-[11px] text-steel flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Terdaftar: {comp.tanggalDaftar}
                </span>

                <div className="flex items-center gap-2">
                  {comp.statusVerifikasi === "Menunggu Verifikasi" && (
                    <>
                      <button
                        onClick={() => handleUpdateVerifikasi(comp.id, "Ditolak")}
                        className="rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 font-mono text-xs font-medium text-red-600 hover:bg-red-100 transition"
                      >
                        Tolak
                      </button>
                      <button
                        onClick={() => handleUpdateVerifikasi(comp.id, "Terverifikasi")}
                        className="rounded-full bg-emerald-600 px-4 py-1.5 font-mono text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-sm"
                      >
                        ✓ Verifikasi Perusahaan
                      </button>
                    </>
                  )}

                  {comp.statusVerifikasi === "Terverifikasi" && (
                    <span className="font-mono text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      ✓ Terverifikasi Resmi
                    </span>
                  )}

                  {comp.statusVerifikasi === "Ditolak" && (
                    <span className="font-mono text-xs text-red-600 font-medium">
                      ✕ Verifikasi Ditolak
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between border-t border-steel/10 pt-6">
          <p className="text-xs text-steel font-mono">
            Menampilkan {filteredList.length} dari {totalCount} perusahaan
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
