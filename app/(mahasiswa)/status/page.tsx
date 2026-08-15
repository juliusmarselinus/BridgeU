"use client";

import { useMemo } from "react";
import Link from "next/link";
import { MahasiswaSkeletonPage } from "@/components/ui/MahasiswaLoading";
import { useStatusList } from "./hooks/useStatusList";
import { statusMeta, TABS, PAGE_SIZE, initials } from "./types/status";
import { StageTracker, StatusCardSkeleton, AddOpportunityCard } from "./components/StatusComponents";

export default function StatusPage() {
  const {
    list,
    loading,
    tab,
    setTab,
    query,
    setQuery,
    visibleCount,
    setVisibleCount,
  } = useStatusList();

  const counts = useMemo(() => {
    const c: Record<string, number> = { semua: list.length, aksi: 0, berjalan: 0, selesai: 0 };
    for (const item of list) c[statusMeta[item.status].group]++;
    return c;
  }, [list]);

  const filtered = useMemo(() => {
    return list.filter((item) => {
      const matchesTab = tab === "semua" || statusMeta[item.status].group === tab;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q || item.judul.toLowerCase().includes(q) || item.perusahaan.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });
  }, [list, tab, query]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  if (loading) {
    return <MahasiswaSkeletonPage />;
  }

  return (
    <main className="min-h-screen text-ink font-sans bg-paper">
      <div
        className="relative overflow-hidden pt-24 pb-20"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 88%, 0 100%)" }}
      >
        <div
          className="absolute inset-0 -z-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(120deg, #0b1830 0%, #142a4d 38%, #1b3566 58%, #2c4770 74%, #4C5F7E 100%)",
          }}
        />
        <div className="absolute top-1/4 right-0 h-80 w-80 rounded-full bg-sky-300/20 blur-[110px] -z-10 pointer-events-none" />
        <div className="absolute -bottom-10 right-1/3 h-56 w-56 rounded-full bg-bridge-gold/20 blur-[100px] -z-10 pointer-events-none" />
        <div className="absolute -top-16 left-1/4 h-48 w-48 rounded-full bg-emerald-300/10 blur-[90px] -z-10 pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 space-y-3">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold tracking-wider text-white bg-white/10 px-3 py-1 rounded-full border border-white/25">
            <span className="h-1.5 w-1.5 rounded-full bg-bridge-gold" />
            Pelacak Status Proyek
          </span>
          <h1
            className="font-display text-3xl sm:text-4xl font-black text-white"
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.35)" }}
          >
            Status Pengajuan &amp; Timeline Pengerjaan
          </h1>
          <p className="text-xs sm:text-sm text-white/85 max-w-xl" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.3)" }}>
            Pantau perkembangan permohonan dan lakukan pengumpulan hasil kerja kolaborasi kamu di sini.
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 -mt-10 pb-24 space-y-6">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-white border border-steel/15 shadow-md p-2">
          <div className="relative z-10 flex items-center gap-1 w-fit">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-[11px] font-bold transition ${
                  tab === t.key ? "bg-ink text-paper" : "text-steel hover:bg-steel/[0.06]"
                }`}
              >
                {t.label}
                <span className={`ml-1.5 ${tab === t.key ? "text-paper/60" : "text-steel/50"}`}>
                  {counts[t.key]}
                </span>
              </button>
            ))}
          </div>

          <div className="relative z-10 sm:w-64">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-steel"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari perusahaan atau judul..."
              className="w-full rounded-xl border border-steel/25 bg-white pl-9 pr-4 py-2 text-xs font-mono text-ink placeholder:text-steel/70 focus:outline-none focus:ring-2 focus:ring-bridge-gold/50 focus:border-bridge-gold/50"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <StatusCardSkeleton key={i} />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="rounded-[32px_32px_32px_6px] border border-steel/15 bg-white p-12 text-center space-y-4 max-w-xl mx-auto">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-steel/10 text-steel mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-bold text-ink">Belum Ada Pengajuan Kolaborasi</h3>
            <p className="text-xs text-steel max-w-md mx-auto">
              Kamu belum mengajukan permohonan ke proyek manapun. Jelajahi katalog peluang kolaborasi.
            </p>
            <Link
              href="/kolaborasi"
              className="inline-block rounded-full bg-ink px-6 py-2.5 font-mono text-xs font-bold text-paper hover:bg-steel transition"
            >
              Cari Peluang Kolaborasi →
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[32px_32px_32px_6px] border border-steel/15 bg-white p-12 text-center space-y-2 max-w-xl mx-auto">
            <h3 className="font-display text-lg font-bold text-ink">Tidak Ada Hasil</h3>
            <p className="text-xs text-steel max-w-md mx-auto">
              Coba ubah kata kunci pencarian atau pilih tab status lain.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visible.map((item) => {
                const meta = statusMeta[item.status];
                return (
                  <div
                    key={item.id}
                    className={`group flex flex-col rounded-[28px_28px_28px_4px] border bg-white p-5 shadow-sm hover:shadow-md transition ${
                      meta.rejected
                        ? "border-rose-200 ring-1 ring-rose-100"
                        : meta.needsAction
                        ? "border-orange-200 ring-1 ring-orange-100"
                        : "border-steel/12"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center font-mono text-[11px] font-bold shrink-0 ${
                            meta.rejected ? "bg-rose-100 text-rose-700" : "bg-ink/90 text-paper"
                          }`}
                        >
                          {initials(item.perusahaan)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-mono text-[10px] uppercase text-steel/70 truncate">
                            {item.perusahaan}
                          </p>
                          <p className="font-mono text-[9px] uppercase text-steel/45">{item.tipe}</p>
                        </div>
                      </div>
                      <span className={`shrink-0 font-mono text-[10px] font-bold px-2.5 py-1 rounded-full ${meta.chipBg} ${meta.tone}`}>
                        {meta.label}
                      </span>
                    </div>

                    <h3 className="font-display text-base font-bold text-ink mt-3 leading-snug line-clamp-2">
                      {item.judul}
                    </h3>

                    <div className="mt-4">
                      <StageTracker stage={meta.stage} rejected={meta.rejected} />
                    </div>

                    <div className="mt-4 space-y-1.5 text-[11px] font-mono flex-1">
                      <div className="flex justify-between text-steel/70">
                        <span>Tanggal daftar</span>
                        <span className="text-ink font-semibold">{item.tanggal_daftar}</span>
                      </div>

                      {item.tipe === "Magang" && item.gajiStipend && (
                        <div className="flex justify-between text-steel/70">
                          <span>Insentif / Stipend</span>
                          <span className="text-emerald-700 font-bold">{item.gajiStipend}</span>
                        </div>
                      )}

                      {item.tipe === "Magang" && (item.urlBuktiBayar || item.statusPembayaran) && (
                        <div className="mt-2 rounded-2xl bg-sky/10 border border-sky/20 px-3 py-2 flex items-center justify-between">
                          <span className="text-[9px] font-mono uppercase text-ocean font-bold">
                            Bukti Bayar / Insentif
                          </span>
                          <span className="text-[10px] font-bold text-ocean">
                            {item.statusPembayaran || "Tersedia"}
                          </span>
                        </div>
                      )}

                      {item.status === "Selesai" && (
                        <div className="mt-3 rounded-2xl bg-emerald-50 border border-emerald-100 px-3 py-2 flex items-center justify-between">
                          <span className="text-[9px] font-mono uppercase text-emerald-800 font-bold">
                            Penilaian Mitra
                          </span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  (item.ratings || 0) >= star ? "text-amber-400 fill-amber-400" : "text-emerald-200 fill-emerald-100"
                                }`}
                                viewBox="0 0 24 24"
                              >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            ))}
                            <span className="text-[10px] font-bold text-emerald-900 ml-0.5">
                              {item.ratings != null ? `${item.ratings}.0` : "-"}
                            </span>
                          </div>
                        </div>
                      )}

                      {meta.rejected && item.status !== "Dibatalkan" && (
                        <div className="mt-3 rounded-2xl bg-rose-50 border border-rose-100 px-3 py-2.5">
                          <p className="text-[9px] font-mono uppercase text-rose-500 font-bold mb-0.5">
                            Alasan dari perusahaan
                          </p>
                          <p className="text-[11px] text-rose-800 italic leading-snug">
                            {item.catatan_perusahaan || "Perusahaan tidak menyertakan catatan spesifik."}
                          </p>
                        </div>
                      )}

                      {item.status === "Dibatalkan" && (
                        <div className="mt-3 rounded-2xl bg-rose-50 border border-rose-100 px-3 py-2.5">
                          <p className="text-[9px] font-mono uppercase text-rose-500 font-bold mb-0.5">
                            Proyek Dibatalkan Perusahaan
                          </p>
                          <p className="text-[11px] text-rose-800 leading-snug whitespace-pre-line">
                            {item.catatan_pembatalan || "Perusahaan tidak menyertakan detail."}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-steel/10">
                      {meta.rejected ? (
                        <Link
                          href="/kolaborasi"
                          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-4 py-2.5 font-mono text-[11px] font-bold text-white hover:bg-rose-700 transition"
                        >
                          Cari Peluang Lain →
                        </Link>
                      ) : (
                        <Link
                          href={`/status/${item.id}`}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 font-mono text-[11px] font-bold text-paper hover:bg-steel transition"
                        >
                          Buka Detail Timeline →
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}

              {!hasMore && <AddOpportunityCard />}
            </div>

            {hasMore && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="rounded-full border border-steel/25 bg-white px-6 py-2.5 font-mono text-xs font-bold text-ink hover:bg-steel/[0.05] transition shadow-sm"
                >
                  Muat Lebih Banyak ({filtered.length - visibleCount} lagi)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}