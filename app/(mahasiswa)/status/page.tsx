// app/status/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type StatusKey = "Menunggu" | "Diproses" | "Diterima" | "Evaluasi" | "Revisi" | "Ditolak" | "Selesai";

type StatusItem = {
  id: string;
  kolaborasi_id: string;
  judul: string;
  perusahaan: string;
  tipe: string;
  status: StatusKey;
  tanggal_daftar: string;
  tanggal_raw: number;
  catatan_perusahaan?: string;
  url_hasil_kolaborasi?: string;
};

// ---------------------------------------------------------------------------
// Status meta — single source of truth for stage position (stage tracker),
// tone color, grouping (for tabs), and whether it demands action.
// ---------------------------------------------------------------------------
const STAGES = ["Diajukan", "Diproses", "Dievaluasi", "Selesai"] as const;

const statusMeta: Record<
  StatusKey,
  {
    label: string;
    stage: number;
    tone: string;
    chipBg: string;
    needsAction: boolean;
    rejected: boolean;
    group: "berjalan" | "aksi" | "selesai";
  }
> = {
  Menunggu: { label: "Menunggu Review", stage: 0, tone: "text-amber-700", chipBg: "bg-amber-50", needsAction: false, rejected: false, group: "berjalan" },
  Diproses: { label: "Sedang Berjalan", stage: 1, tone: "text-blue-700", chipBg: "bg-blue-50", needsAction: false, rejected: false, group: "berjalan" },
  Diterima: { label: "Pendaftaran Diterima", stage: 1, tone: "text-blue-700", chipBg: "bg-blue-50", needsAction: false, rejected: false, group: "berjalan" },
  Evaluasi: { label: "Sedang Dievaluasi", stage: 2, tone: "text-purple-700", chipBg: "bg-purple-50", needsAction: false, rejected: false, group: "berjalan" },
  Revisi: { label: "Perlu Revisi", stage: 2, tone: "text-orange-700", chipBg: "bg-orange-50", needsAction: true, rejected: false, group: "aksi" },
  Ditolak: { label: "Tidak Lolos", stage: 2, tone: "text-rose-700", chipBg: "bg-rose-50", needsAction: true, rejected: true, group: "aksi" },
  Selesai: { label: "Kolaborasi Selesai", stage: 3, tone: "text-emerald-700", chipBg: "bg-emerald-50", needsAction: false, rejected: false, group: "selesai" },
};

const TABS = [
  { key: "semua", label: "Semua" },
  { key: "aksi", label: "Perlu Aksi" },
  { key: "berjalan", label: "Berjalan" },
  { key: "selesai", label: "Selesai" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const PAGE_SIZE = 5; // leaves room for the trailing "add" card to complete a row of 6 (3 cols)

// ---------------------------------------------------------------------------
// Signature element: a labeled stage tracker. Each dot is a real step the
// pengajuan goes through — filled = passed, ring = current, empty = ahead.
// A rejected item shows an X at the stage it exited from, instead of moving
// further along the line. Labels make the meaning legible without guessing.
// ---------------------------------------------------------------------------
// Each stage carries its own fixed color (not the overall status tone) so the
// tracker reads like a real progression — orange -> yellow -> blue -> green —
// regardless of which status label the card currently shows.
const STAGE_FILL = ["bg-orange-500", "bg-yellow-400", "bg-blue-500", "bg-emerald-500"];
const STAGE_RING = ["ring-orange-500", "ring-yellow-400", "ring-blue-500", "ring-emerald-500"];
const STAGE_TEXT = ["text-orange-600", "text-yellow-600", "text-blue-600", "text-emerald-600"];

function StageTracker({ stage, rejected }: { stage: number; rejected: boolean }) {
  return (
    <div className="w-full">
      <div className="flex items-center">
        {STAGES.map((_, i) => {
          const isLast = i === STAGES.length - 1;
          const isRejectedHere = rejected && i === stage;
          const isFinished = !rejected && stage === STAGES.length - 1 && i === STAGES.length - 1;
          const passed = rejected ? i < stage : i < stage;
          const current = !rejected && i === stage && !isFinished;

          let dot: React.ReactNode;
          if (isRejectedHere) {
            dot = (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-white text-[8px] font-bold shrink-0">
                ✕
              </span>
            );
          } else if (isFinished) {
            dot = (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white text-[8px] font-bold shrink-0">
                ✓
              </span>
            );
          } else if (passed) {
            dot = <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${STAGE_FILL[i]}`} />;
          } else if (current) {
            dot = (
              <span
                className={`h-2.5 w-2.5 rounded-full ring-2 ring-offset-1 shrink-0 bg-white ${STAGE_RING[i]}`}
              />
            );
          } else {
            dot = <span className="h-2.5 w-2.5 rounded-full bg-steel/20 shrink-0" />;
          }

          return (
            <div key={i} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
              {dot}
              {!isLast && (
                <div
                  className={`h-[2px] flex-1 rounded-full mx-1 ${
                    rejected && i === stage ? "bg-rose-200" : i < stage ? STAGE_FILL[i] : "bg-steel/15"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-1.5">
        {STAGES.map((label, i) => (
          <span
            key={label}
            className={`text-[8px] font-mono uppercase leading-none ${
              i === stage ? `${rejected && i === stage ? "text-rose-600" : STAGE_TEXT[i]} font-bold` : "text-steel/40"
            } ${i === 0 ? "" : i === STAGES.length - 1 ? "text-right" : "text-center"}`}
            style={{ width: i === 0 || i === STAGES.length - 1 ? "auto" : "0" }}
          >
            {i === 0 || i === STAGES.length - 1 || i === stage ? label : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function StatusCardSkeleton() {
  return (
    <div className="rounded-[28px_28px_28px_4px] border border-steel/10 bg-white p-5 animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-steel/10 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-2.5 w-24 bg-steel/10 rounded" />
          <div className="h-4 w-40 bg-steel/10 rounded" />
        </div>
      </div>
      <div className="h-3 w-full bg-steel/10 rounded" />
      <div className="h-8 w-full bg-steel/10 rounded-full" />
    </div>
  );
}

// Trailing card, always the last tile in the grid — same footprint as a
// status card so the grid never ends on a lopsided row.
function AddOpportunityCard() {
  return (
    <Link
      href="/kolaborasi"
      className="group flex flex-col items-center justify-center rounded-[28px_28px_28px_4px] border-2 border-dashed border-steel/30 bg-white p-5 min-h-[280px] text-center shadow-sm hover:shadow-md hover:border-[#375898] transition"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper group-hover:bg-[#375898] transition text-xl font-bold mb-3">
        +
      </span>
      <p className="font-display text-sm font-bold text-ink">Cari Peluang Baru</p>
      <p className="text-[11px] text-steel mt-1 max-w-[180px]">
        Jelajahi kolaborasi Akademik &amp; Magang lain yang cocok buat kamu.
      </p>
    </Link>
  );
}

export default function StatusPage() {
  const [list, setList] = useState<StatusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>("semua");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    async function loadStatusList() {
      setLoading(true);
      try {
        const { data: authData } = await supabase.auth.getUser();
        const currentUserId = authData?.user?.id;

        if (currentUserId) {
          const { data: dbData } = await supabase
            .from("pendaftaran_kolaborasi")
            .select(`
              id,
              kolaborasi_id,
              status,
              tanggal_daftar,
              catatan_perusahaan,
              kolaborasi:kolaborasi_id (
                judul,
                tipe,
                perusahaan:perusahaan_id ( nama_perusahaan )
              ),
              riwayat_pengumpulan_kolaborasi (
                url_hasil,
                created_at
              )
            `)
            .eq("mahasiswa_id", currentUserId)
            .order("tanggal_daftar", { ascending: false });

          if (dbData && dbData.length > 0) {
            const mapped: StatusItem[] = dbData.map((item: any) => {
              const riwayatList = item.riwayat_pengumpulan_kolaborasi || [];
              const latestSubmission =
                riwayatList.length > 0
                  ? riwayatList.sort(
                      (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    )[0]
                  : null;
              const rawDate = item.tanggal_daftar ? new Date(item.tanggal_daftar) : null;

              return {
                id: item.id,
                kolaborasi_id: item.kolaborasi_id,
                judul: item.kolaborasi?.judul ?? "Proyek Kolaborasi",
                perusahaan: item.kolaborasi?.perusahaan?.nama_perusahaan ?? "Mitra Perusahaan",
                tipe: item.kolaborasi?.tipe ?? "Akademik",
                status: (item.status ?? "Menunggu") as StatusKey,
                tanggal_daftar: rawDate
                  ? rawDate.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                  : "-",
                tanggal_raw: rawDate ? rawDate.getTime() : 0,
                catatan_perusahaan: item.catatan_perusahaan,
                url_hasil_kolaborasi: latestSubmission?.url_hasil || item.url_hasil_kolaborasi,
              };
            });
            setList(mapped);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Gagal mengambil status dari Supabase:", err);
      }

      const stored = localStorage.getItem("bridgeu_pengajuan");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const mappedLocal: StatusItem[] = parsed.map((p: any, idx: number) => ({
            id: p.id || `local-${idx}`,
            kolaborasi_id: p.id,
            judul: p.judul || "Proyek Kolaborasi",
            perusahaan: p.perusahaan || "Mitra",
            tipe: "Akademik",
            status: (p.status || "Menunggu") as StatusKey,
            tanggal_daftar: p.tanggal || new Date().toLocaleDateString("id-ID"),
            tanggal_raw: 0,
            catatan_perusahaan: p.catatan_perusahaan,
          }));
          setList(mappedLocal);
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    }

    loadStatusList();
  }, []);

  const counts = useMemo(() => {
    const c: Record<TabKey, number> = { semua: list.length, aksi: 0, berjalan: 0, selesai: 0 };
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

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [tab, query]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <main className="min-h-screen text-ink font-sans bg-paper">
      {/* Hero band — dark-to-light diagonal wash, but the text sits inside a
          fixed dark panel (not on the fading part of the gradient) so
          contrast never depends on where the blobs land. Bottom edge is cut
          on an angle instead of a straight rule — avoids the generic
          rectangle-hero look. */}
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

      {/* Content — plain, readable, no glow competing with text */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 -mt-10 pb-24 space-y-6">
        {/* Tabs + search */}
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

        {/* Grid */}
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
                    {/* Top: avatar + status chip */}
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

                    {/* Title */}
                    <h3 className="font-display text-base font-bold text-ink mt-3 leading-snug line-clamp-2">
                      {item.judul}
                    </h3>

                    {/* Stage tracker */}
                    <div className="mt-4">
                      <StageTracker stage={meta.stage} rejected={meta.rejected} />
                    </div>

                    {/* Meta rows */}
                    <div className="mt-4 space-y-1.5 text-[11px] font-mono flex-1">
                      <div className="flex justify-between text-steel/70">
                        <span>Tanggal daftar</span>
                        <span className="text-ink font-semibold">{item.tanggal_daftar}</span>
                      </div>
                      {!meta.rejected && (
                        <div className="flex justify-between text-steel/70">
                          <span>Pengumpulan hasil</span>
                          <span className={item.url_hasil_kolaborasi ? "text-emerald-700 font-semibold" : "text-amber-700 font-semibold"}>
                            {item.url_hasil_kolaborasi ? "Sudah diunggah" : "Belum dikirim"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Rejected — reason surfaced directly, not hidden */}
                    {meta.rejected && (
                      <div className="mt-3 rounded-2xl bg-rose-50 border border-rose-100 px-3 py-2.5">
                        <p className="text-[9px] font-mono uppercase text-rose-500 font-bold mb-0.5">
                          Alasan dari perusahaan
                        </p>
                        <p className="text-[11px] text-rose-800 italic leading-snug">
                          {item.catatan_perusahaan || "Perusahaan tidak menyertakan catatan spesifik."}
                        </p>
                      </div>
                    )}

                    {/* CTA */}
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