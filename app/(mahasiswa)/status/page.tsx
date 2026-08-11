"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type StatusItem = {
  id: string; // pendaftaran_kolaborasi id
  kolaborasi_id: string;
  judul: string;
  perusahaan: string;
  tipe: string;
  status: "Menunggu" | "Diproses" | "Diterima" | "Evaluasi" | "Revisi" | "Ditolak" | "Selesai";
  tanggal_daftar: string;
  catatan_perusahaan?: string;
  url_hasil_kolaborasi?: string;
};

const statusBadgeStyle: Record<string, { bg: string; text: string; label: string }> = {
  Menunggu: { bg: "bg-amber-100 border-amber-300", text: "text-amber-800", label: "Menunggu Review" },
  Diproses: { bg: "bg-blue-100 border-blue-300", text: "text-blue-800", label: "Sedang Berjalan" },
  Diterima: { bg: "bg-emerald-100 border-emerald-300", text: "text-emerald-800", label: "Pendaftaran Diterima" },
  Evaluasi: { bg: "bg-purple-100 border-purple-300", text: "text-purple-800", label: "Sedang Dievaluasi" },
  Revisi: { bg: "bg-orange-100 border-orange-300", text: "text-orange-800", label: "Perlu Revisi" },
  Ditolak: { bg: "bg-rose-100 border-rose-300", text: "text-rose-800", label: "Ditolak" },
  Selesai: { bg: "bg-emerald-100 border-emerald-300", text: "text-emerald-800", label: "Kolaborasi Selesai" },
};

function StatusSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border border-steel/15 bg-white p-6 animate-pulse space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-3 w-28 bg-steel/10 rounded" />
              <div className="h-5 w-64 bg-steel/10 rounded" />
            </div>
            <div className="h-6 w-24 bg-steel/10 rounded-full" />
          </div>
          <div className="h-4 w-full bg-steel/10 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function StatusPage() {
  const [list, setList] = useState<StatusItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStatusList() {
      setLoading(true);
      try {
        const { data: authData } = await supabase.auth.getUser();
        const currentUserId = authData?.user?.id;

        if (currentUserId) {
          // Select data real dari database Supabase dengan riwayat_pengumpulan_kolaborasi
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
              // Ambil url_hasil dari entri riwayat pengumpulan terbaru jika ada
              const riwayatList = item.riwayat_pengumpulan_kolaborasi || [];
              const latestSubmission = riwayatList.length > 0
                ? riwayatList.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
                : null;

              return {
                id: item.id,
                kolaborasi_id: item.kolaborasi_id,
                judul: item.kolaborasi?.judul ?? "Proyek Kolaborasi",
                perusahaan: item.kolaborasi?.perusahaan?.nama_perusahaan ?? "Mitra Perusahaan",
                tipe: item.kolaborasi?.tipe ?? "Akademik",
                status: item.status ?? "Menunggu",
                tanggal_daftar: item.tanggal_daftar
                  ? new Date(item.tanggal_daftar).toLocaleDateString("id-ID", {
                      day: "numeric", month: "short", year: "numeric"
                    })
                  : "-",
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

      // Fallback ke localStorage jika belum terautentikasi atau data DB kosong
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
            status: p.status || "Menunggu",
            tanggal_daftar: p.tanggal || new Date().toLocaleDateString("id-ID"),
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

  return (
    <main className="min-h-screen bg-paper pt-24 pb-20 text-ink font-sans">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-6">
        {/* Header Page */}
        <div className="border-b border-steel/15 pb-6 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase font-bold text-bridge-gold bg-bridge-gold/15 px-3 py-1 rounded-full border border-bridge-gold/30">
              Pelacak Status Proyek
            </span>
          </div>
          <h1 className="font-display text-3xl font-black text-ink">
            Status Pengajuan & Timeline Pengerjaan
          </h1>
          <p className="text-xs text-steel">
            Pantau perkembangan permohonan, timeline tahapan, dan lakukan pengumpulan hasil kerja karya kolaborasi kamu di sini.
          </p>
        </div>

        {/* Loading State Skeleton */}
        {loading ? (
          <StatusSkeleton />
        ) : list.length === 0 ? (
          <div className="rounded-3xl border border-steel/15 bg-white p-12 text-center shadow-sm space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-steel/10 text-steel mx-auto">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-bold text-ink">Belum Ada Pengajuan Kolaborasi</h3>
            <p className="text-xs text-steel max-w-md mx-auto">
              Kamu belum mengajukan permohonan ke proyek manapun. Jelajahi berbagai peluang kolaborasi menarik di katalog.
            </p>
            <Link
              href="/kolaborasi"
              className="inline-block rounded-2xl bg-ink px-6 py-3 font-mono text-xs font-bold text-paper hover:bg-steel transition shadow-md"
            >
              Cari Peluang Kolaborasi →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((item) => {
              const badge = statusBadgeStyle[item.status] || statusBadgeStyle.Menunggu;
              return (
                <div
                  key={item.id}
                  className="rounded-3xl border border-steel/15 bg-white p-6 sm:p-7 shadow-sm hover:shadow-md transition space-y-5"
                >
                  {/* Top Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-steel/10 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-steel">{item.perusahaan}</span>
                        <span className="text-steel/30">•</span>
                        <span className="font-mono text-[10px] uppercase font-semibold text-steel/70">{item.tipe}</span>
                      </div>
                      <h3 className="font-display text-xl font-bold text-ink">
                        {item.judul}
                      </h3>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 self-start sm:self-center px-4 py-1.5 rounded-full font-mono text-xs font-bold border ${badge.bg} ${badge.text}`}>
                      <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
                      {badge.label}
                    </span>
                  </div>

                  {/* Catatan / Quick Meta */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-steel/70 text-[10px] uppercase block">Tanggal Mendaftar:</span>
                      <strong className="text-ink font-semibold">{item.tanggal_daftar}</strong>
                    </div>
                    <div>
                      <span className="text-steel/70 text-[10px] uppercase block">Pengumpulan Hasil:</span>
                      <strong className={item.url_hasil_kolaborasi ? "text-emerald-700 font-semibold" : "text-amber-700 font-semibold"}>
                        {item.url_hasil_kolaborasi ? "Sudah Diunggah" : "Belum Dikirim"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-steel/70 text-[10px] uppercase block">Catatan Perusahaan:</span>
                      <span className="text-steel italic truncate block">{item.catatan_perusahaan || "Tidak ada catatan."}</span>
                    </div>
                  </div>

                  {/* Actions to Detail Page */}
                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-steel/10">
                    <Link
                      href={`/status/${item.id}`}
                      className="inline-flex items-center gap-2 rounded-2xl bg-ink px-5 py-2.5 font-mono text-xs font-bold text-paper hover:bg-steel transition shadow-xs"
                    >
                      Buka Detail Timeline &amp; Pengumpulan →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}