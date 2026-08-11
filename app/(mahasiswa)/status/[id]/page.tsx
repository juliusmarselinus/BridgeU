"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type StatusDetail = {
  id: string; // uuid pendaftaran_kolaborasi
  kolaborasi_id: string;
  judul: string;
  perusahaan: string;
  tipe: string;
  deskripsi: string;
  batasWaktu: string;
  status: "Menunggu" | "Diproses" | "Diterima" | "Evaluasi" | "Revisi" | "Ditolak" | "Selesai";
  tanggalDaftar: string;
  catatanPerusahaan?: string;
  urlPortofolioDokumen?: string;
  urlHasilKolaborasi?: string;
  catatanHasilKolaborasi?: string;
  tanggalPengumpulan?: string;
};

function IconCheck({ className = "w-4 h-4 text-emerald-600" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconClock({ className = "w-4 h-4 text-amber-600" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconUpload({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

export default function StatusDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<StatusDetail | null>(null);

  // Form Pengumpulan Hasil Pengerjaan
  const [urlHasil, setUrlHasil] = useState("");
  const [catatanHasil, setCatatanHasil] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [riwayatList, setRiwayatList] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      try {
        if (id) {
          // Attempt 1: Fetch dari Supabase database berdasarkan id pendaftaran_kolaborasi
          const { data: row } = await supabase
            .from("pendaftaran_kolaborasi")
            .select(`
              id,
              kolaborasi_id,
              status,
              tanggal_daftar,
              catatan_perusahaan,
              url_portofolio_dokumen,
              kolaborasi:kolaborasi_id (
                judul,
                tipe,
                deskripsi,
                batas_waktu,
                perusahaan:perusahaan_id ( nama_perusahaan )
              ),
              riwayat_pengumpulan_kolaborasi (
                id,
                versi,
                url_hasil,
                catatan_mahasiswa,
                evaluasi_perusahaan,
                status_evaluasi,
                created_at
              )
            `)
            .eq("id", id as string)
            .maybeSingle();

          if (row) {
            const dbRiwayat = (row.riwayat_pengumpulan_kolaborasi || []).sort(
              (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            const latestSubmission = dbRiwayat[0] || null;

            const mapped: StatusDetail = {
              id: row.id,
              kolaborasi_id: row.kolaborasi_id,
              judul: (row.kolaborasi as any)?.judul ?? "Detail Kolaborasi",
              perusahaan: (row.kolaborasi as any)?.perusahaan?.nama_perusahaan ?? "Mitra Perusahaan",
              tipe: (row.kolaborasi as any)?.tipe ?? "Akademik",
              deskripsi: (row.kolaborasi as any)?.deskripsi ?? "",
              batasWaktu: (row.kolaborasi as any)?.batas_waktu
                ? new Date((row.kolaborasi as any).batas_waktu).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric",
                  })
                : "-",
              status: row.status ?? "Menunggu",
              tanggalDaftar: row.tanggal_daftar
                ? new Date(row.tanggal_daftar).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric",
                  })
                : "-",
              catatanPerusahaan: latestSubmission?.evaluasi_perusahaan || row.catatan_perusahaan,
              urlPortofolioDokumen: row.url_portofolio_dokumen,
              urlHasilKolaborasi: latestSubmission?.url_hasil,
              catatanHasilKolaborasi: latestSubmission?.catatan_mahasiswa,
              tanggalPengumpulan: latestSubmission?.created_at
                ? new Date(latestSubmission.created_at).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                  })
                : undefined,
            };

            setDetail(mapped);
            if (latestSubmission?.url_hasil) setUrlHasil(latestSubmission.url_hasil);
            if (latestSubmission?.catatan_mahasiswa) setCatatanHasil(latestSubmission.catatan_mahasiswa);
            setRiwayatList(dbRiwayat);

            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Gagal load status detail dari Supabase:", err);
      }

      // Fallback: localStorage
      const stored = localStorage.getItem("bridgeu_pengajuan");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const found = parsed.find((p: any, idx: number) => p.id === id || `local-${idx}` === id);
          if (found) {
            setDetail({
              id: found.id || (id as string),
              kolaborasi_id: found.id || "",
              judul: found.judul || "Pengajuan Kolaborasi",
              perusahaan: found.perusahaan || "Mitra",
              tipe: "Akademik",
              deskripsi: "Detail pendaftaran proyek kolaborasi.",
              batasWaktu: "-",
              status: found.status || "Menunggu",
              tanggalDaftar: found.tanggal || new Date().toLocaleDateString("id-ID"),
              catatanPerusahaan: found.catatan_perusahaan,
              urlPortofolioDokumen: found.portofolio,
              urlHasilKolaborasi: found.url_hasil_kolaborasi,
              catatanHasilKolaborasi: found.catatan_hasil_kolaborasi,
            });
            if (found.riwayat) setRiwayatList(found.riwayat);
          }
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    }

    fetchDetail();
  }, [id]);

  const handleSubmitHasil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlHasil.trim()) return;

    setSubmitting(true);
    const nowIso = new Date().toISOString();

    try {
      if (detail?.id) {
        // 1. Insert ke tabel riwayat_pengumpulan_kolaborasi
        const nextVersi = riwayatList.length + 1;
        const { data: insertedRiwayat, error: riwayatErr } = await supabase
          .from("riwayat_pengumpulan_kolaborasi")
          .insert({
            pendaftaran_id: detail.id,
            versi: nextVersi,
            url_hasil: urlHasil,
            catatan_mahasiswa: catatanHasil,
            status_evaluasi: "Menunggu Evaluasi",
            created_at: nowIso,
          })
          .select()
          .single();

        if (riwayatErr) {
          console.error("Gagal insert riwayat_pengumpulan_kolaborasi:", riwayatErr.message);
        } else if (insertedRiwayat) {
          setRiwayatList((prev) => [insertedRiwayat, ...prev]);
        }

        // 2. Update status utama pendaftaran kolaborasi ke Evaluasi
        const { error: updateErr } = await supabase
          .from("pendaftaran_kolaborasi")
          .update({
            status: "Evaluasi",
            updated_at: nowIso,
          })
          .eq("id", detail.id);

        if (updateErr) {
          console.error("Gagal mengupdate status pendaftaran:", updateErr.message);
        }
      }
    } catch (err) {
      console.error("Error submitting project results:", err);
    }

    // Backup ke localStorage
    const stored = localStorage.getItem("bridgeu_pengajuan");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const updatedLocal = parsed.map((p: any, idx: number) => {
          if (p.id === id || `local-${idx}` === id) {
            const currentRiwayat = p.riwayat || [];
            const newHistoryItem = {
              versi: currentRiwayat.length + 1,
              url_hasil: urlHasil,
              catatan_mahasiswa: catatanHasil,
              created_at: nowIso,
            };
            return {
              ...p,
              url_hasil_kolaborasi: urlHasil,
              catatan_hasil_kolaborasi: catatanHasil,
              status: "Evaluasi",
              riwayat: [newHistoryItem, ...currentRiwayat],
            };
          }
          return p;
        });
        localStorage.setItem("bridgeu_pengajuan", JSON.stringify(updatedLocal));
      } catch (e) { console.error(e); }
    }

    setDetail((prev) =>
      prev
        ? {
            ...prev,
            urlHasilKolaborasi: urlHasil,
            catatanHasilKolaborasi: catatanHasil,
            tanggalPengumpulan: new Date().toLocaleDateString("id-ID", {
              day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
            }),
            status: "Evaluasi",
          }
        : null
    );

    setSubmitting(false);
    setSubmitSuccess(true);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-paper flex items-center justify-center pt-24 pb-16">
        <div className="rounded-3xl border border-steel/15 bg-white p-8 text-center shadow-md">
          <div className="h-6 w-48 bg-steel/10 rounded-lg animate-pulse mx-auto mb-3" />
          <div className="h-3 w-32 bg-steel/10 rounded animate-pulse mx-auto" />
        </div>
      </main>
    );
  }

  if (!detail) {
    return (
      <main className="min-h-screen bg-paper pt-24 pb-16 px-4">
        <div className="mx-auto max-w-md rounded-3xl border border-steel/20 bg-white p-8 text-center shadow-lg space-y-4">
          <h3 className="font-display text-xl font-bold text-ink">Pengajuan Tidak Ditemukan</h3>
          <p className="text-xs text-steel">Data pengajuan kolaborasi ini tidak ditemukan atau telah dihapus.</p>
          <Link
            href="/status"
            className="inline-block rounded-2xl bg-ink px-6 py-3 font-mono text-xs font-bold text-paper hover:bg-steel transition shadow-md"
          >
            ← Kembali ke Status Pengajuan
          </Link>
        </div>
      </main>
    );
  }

  // Tentukan langkah-langkah timeline pengerjaan proyek secara eksplisit
  const isSubmitted = Boolean(detail.tanggalDaftar);
  const isAccepted = detail.status === "Diterima" || detail.status === "Diproses" || detail.status === "Evaluasi" || detail.status === "Revisi" || detail.status === "Selesai";
  const isCompleted = detail.status === "Selesai";
  const isRejected = detail.status === "Ditolak";
  const isPending = detail.status === "Menunggu";

  const timelineSteps = [
    {
      title: "1. Pendaftaran Berhasil Terdaftar",
      date: detail.tanggalDaftar,
      desc: `Formulir permohonan berhasil terdaftar pada ${detail.tanggalDaftar}.`,
      active: isSubmitted,
      done: true,
    },
    {
      title: "2. Verifikasi & Seleksi Mitra Perusahaan",
      date: isAccepted || isRejected ? detail.tanggalDaftar : "Dalam Proses",
      desc: isRejected
        ? "Mitra perusahaan belum dapat menerima permohonan kolaborasi saat ini."
        : isAccepted
        ? `Permohonan telah DISETUJUI oleh ${detail.perusahaan}. Kamu dapat mulai mengerjakan proyek!`
        : "Mitra perusahaan sedang mempelajari kesesuaian data diri dan motivasi kamu.",
      active: isSubmitted,
      done: isAccepted,
      error: isRejected,
    },
    {
      title: "3. Pelaksanaan Pengerjaan & Iterasi Pengumpulan Karya",
      date: detail.tanggalPengumpulan || "Menunggu Pengumpulan",
      desc: detail.status === "Evaluasi"
        ? "Hasil pengerjaan kamu sedang DITINJAU & DIEVALUASI oleh mitra perusahaan."
        : detail.status === "Revisi"
        ? "Mitra perusahaan memberikan masukan/kritik. Silakan lakukan perbaikan & kumpulkan revisi karya!"
        : isCompleted
        ? "Hasil pengerjaan karya telah diperiksa dan disetujui akhir oleh mitra perusahaan."
        : isAccepted
        ? detail.urlHasilKolaborasi
          ? "Kamu telah mengirimkan karya. Kamu tetap bisa mengunggah revisi baru sesuai kritik/evaluasi mitra."
          : "Tahap pengerjaan proyek aktif. Unggah link hasil karya kamu pada formulir di bawah."
        : "Area pengerjaan & pengumpulan karya akan terbuka setelah permohonan disetujui mitra.",
      active: isAccepted,
      done: isCompleted || Boolean(detail.urlHasilKolaborasi),
      error: detail.status === "Revisi",
    },
    {
      title: "4. Evaluasi Akhir & Penyelesaian Proyek",
      date: isCompleted ? detail.tanggalPengumpulan || "Selesai" : "Tahap Akhir",
      desc: isCompleted
        ? "Selamat! Kolaborasi telah sukses dilaksanakan dan poin reputasi telah diperbarui."
        : "Penilaian akhir oleh mitra perusahaan setelah karya disetujui.",
      active: isCompleted,
      done: isCompleted,
    },
  ];

  return (
    <main className="min-h-screen bg-paper pt-24 pb-32 text-ink font-sans">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-6">
        {/* Tombol Kembali */}
        <button
          onClick={() => router.push("/status")}
          className="inline-flex items-center gap-2 font-mono text-xs text-steel hover:text-bridge-gold transition font-bold"
        >
          ← Kembali ke Seluruh Status Pengajuan
        </button>

        {/* HEADER PROYEK DETAIL */}
        <div className="rounded-3xl border border-steel/15 bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-steel/10 pb-4">
            <div>
              <span className="font-mono text-xs font-bold text-bridge-gold uppercase tracking-wider block">
                {detail.perusahaan}
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-ink mt-0.5">
                {detail.judul}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-steel">Status:</span>
              <span className={`rounded-full px-4 py-1 font-mono text-xs font-bold uppercase tracking-wider ${
                detail.status === "Evaluasi" ? "bg-purple-100 text-purple-800 border border-purple-300"
                : detail.status === "Revisi" ? "bg-orange-100 text-orange-800 border border-orange-300"
                : isCompleted ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : isAccepted ? "bg-blue-100 text-blue-800 border border-blue-300"
                : isRejected ? "bg-rose-100 text-rose-800 border border-rose-300"
                : "bg-amber-100 text-amber-800 border border-amber-300"
              }`}>
                {detail.status === "Evaluasi" ? "Sedang Dievaluasi" : detail.status === "Revisi" ? "Perlu Revisi" : detail.status}
              </span>
            </div>
          </div>

          {/* DESKRIPSI & INFORMASI RINGKAS */}
          {detail.deskripsi && (
            <div className="text-xs text-steel leading-relaxed bg-paper/60 p-4 rounded-2xl border border-steel/10">
              <span className="font-bold text-ink uppercase text-[10px] block mb-1">Deskripsi Proyek:</span>
              <p>{detail.deskripsi}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs pt-1">
            <div>
              <span className="text-steel/70 text-[10px] uppercase block font-semibold">Tipe Proyek:</span>
              <strong className="text-ink">{detail.tipe}</strong>
            </div>
            <div>
              <span className="text-steel/70 text-[10px] uppercase block font-semibold">Tanggal Mendaftar:</span>
              <strong className="text-ink">{detail.tanggalDaftar}</strong>
            </div>
            <div>
              <span className="text-steel/70 text-[10px] uppercase block font-semibold">Portofolio Pendaftaran:</span>
              {detail.urlPortofolioDokumen ? (
                <a href={detail.urlPortofolioDokumen} target="_blank" rel="noreferrer" className="text-bridge-gold underline font-semibold truncate block">
                  Lihat Tautan Portofolio →
                </a>
              ) : (
                <span className="text-steel">—</span>
              )}
            </div>
          </div>
        </div>

        {/* TIMELINE RINCI PENGERJAAN PROYEK */}
        <div className="rounded-3xl border border-steel/15 bg-white p-6 sm:p-8 shadow-md space-y-6">
          <div className="border-b border-steel/10 pb-4">
            <h2 className="font-display text-lg font-bold text-ink">
              Timeline Progress &amp; Tahapan Kolaborasi
            </h2>
            <p className="text-xs text-steel">
              Rincian perjalanan status permohonan dan progres pengerjaan karya kolaborasi.
            </p>
          </div>

          <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-steel/20">
            {timelineSteps.map((step, idx) => {
              return (
                <div key={idx} className="relative flex items-start gap-4">
                  {/* Step Indicator */}
                  <span
                    className={`absolute -left-6 flex h-5 w-5 items-center justify-center rounded-full border-2 text-[10px] font-bold ${
                      step.error
                        ? "bg-rose-100 border-rose-500 text-rose-700"
                        : step.done
                        ? "bg-emerald-100 border-emerald-500 text-emerald-700"
                        : step.active
                        ? "bg-amber-100 border-amber-500 text-amber-800"
                        : "bg-paper border-steel/30 text-steel/50"
                    }`}
                  >
                    {step.error ? "✕" : step.done ? "✓" : idx + 1}
                  </span>

                  <div className="space-y-1 w-full">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-display text-sm font-bold ${step.error ? "text-rose-600" : step.done ? "text-emerald-800" : step.active ? "text-ink" : "text-steel/60"}`}>
                        {step.title}
                      </h3>
                      <span className="font-mono text-[10px] text-steel/60">{step.date}</span>
                    </div>
                    <p className="text-xs text-steel leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* REVIU / CATATAN EVALUASI PERUSAHAAN (JIKA ADA REVISI / KRITIK) */}
        {detail.catatanPerusahaan && (
          <div className="rounded-3xl border border-amber-300 bg-amber-50/60 p-6 space-y-2">
            <span className="font-mono text-[10px] uppercase font-bold text-amber-800 tracking-wider">
              Evaluasi &amp; Catatan Perusahaan
            </span>
            <p className="text-xs text-amber-950 font-medium leading-relaxed">
              &ldquo;{detail.catatanPerusahaan}&rdquo;
            </p>
          </div>
        )}

        {/* SECTION FORM PENGUMPULAN HASIL KARYA (HANYA DITAMPILKAN JIKA DITERIMA / DIPROSES / SELESAI) */}
        {!isPending && !isRejected ? (
          isCompleted ? (
            <div className="rounded-3xl border border-emerald-300 bg-emerald-50/70 p-6 sm:p-8 space-y-3 shadow-xs text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 border border-emerald-300">
                <IconCheck className="h-6 w-6 text-emerald-700" />
              </div>
              <h2 className="font-display text-xl font-bold text-emerald-950">
                Proyek Kolaborasi Telah Selesai &amp; Disetujui
              </h2>
              <p className="text-xs text-emerald-900 max-w-lg mx-auto leading-relaxed">
                Mitra perusahaan telah menyetujui hasil akhir pengerjaan karya kamu. Pengumpulan tugas telah ditutup dan poin reputasi kamu telah ditambahkan.
              </p>
              {detail.catatanPerusahaan && (
                <div className="mt-4 pt-3 border-t border-emerald-200 text-left bg-white/80 p-4 rounded-2xl border font-mono text-xs">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase block mb-1">Catatan Evaluasi Akhir Perusahaan:</span>
                  <p className="font-sans text-xs text-ink italic">&ldquo;{detail.catatanPerusahaan}&rdquo;</p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-bridge-gold/40 bg-white p-6 sm:p-8 shadow-lg space-y-6">
              <div className="border-b border-steel/10 pb-4 space-y-1">
                <span className="font-mono text-[10px] uppercase font-bold text-bridge-gold bg-bridge-gold/15 px-3 py-1 rounded-full border border-bridge-gold/30">
                  Pengumpulan &amp; Iterasi Karya
                </span>
                <h2 className="font-display text-xl font-bold text-ink mt-2">
                  {detail.urlHasilKolaborasi ? "Kumpulkan Revisi / Perbarui Hasil Karya" : "Unggah Hasil Pengerjaan Kolaborasi"}
                </h2>
                <p className="text-xs text-steel">
                  Kamu dapat mengunggah link hasil karya (GitHub, Drive, Figma) dan memperbaruinya berkali-kali sesuai masukan/kritik perusahaan.
                </p>
              </div>

              {submitSuccess && (
                <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-900 flex items-center gap-3">
                  <IconCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Hasil karya / revisi pengerjaan kolaborasi kamu berhasil dikirim ke mitra perusahaan!</span>
                </div>
              )}

              <form onSubmit={handleSubmitHasil} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                    URL Link Hasil Kolaborasi (GitHub / Google Drive / Figma) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={urlHasil}
                    onChange={(e) => setUrlHasil(e.target.value)}
                    placeholder="https://github.com/username/project-hasil atau https://drive.google.com/..."
                    className="w-full rounded-2xl border border-steel/20 bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-ink transition font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                    Catatan Revisi / Penjelasan Pengumpulan
                  </label>
                  <textarea
                    rows={4}
                    value={catatanHasil}
                    onChange={(e) => setCatatanHasil(e.target.value)}
                    placeholder="Tuliskan catatan perbaikan atau penjelasan karya baru yang kamu serahkan..."
                    className="w-full rounded-2xl border border-steel/20 bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-ink transition font-medium"
                  />
                </div>

                {detail.urlHasilKolaborasi && (
                  <div className="rounded-2xl border border-steel/15 bg-steel/5 p-4 text-xs space-y-1">
                    <span className="font-mono text-[10px] uppercase font-bold text-steel">Pengumpulan Terakhir Terdaftar:</span>
                    <a href={detail.urlHasilKolaborasi} target="_blank" rel="noreferrer" className="block text-bridge-gold font-bold underline truncate">
                      {detail.urlHasilKolaborasi}
                    </a>
                    {detail.tanggalPengumpulan && (
                      <p className="text-[10px] text-steel">Dikirim pada: {detail.tanggalPengumpulan}</p>
                    )}
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting || !urlHasil.trim()}
                    className="rounded-2xl bg-bridge-gold px-8 py-3 font-mono text-xs font-bold text-ink hover:bg-bridge-gold/90 transition shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <IconUpload className="w-4 h-4 text-ink" />
                    {submitting ? "Mengirim..." : detail.urlHasilKolaborasi ? "Kirim Revisi Karya Baru →" : "Serahkan Hasil Kolaborasi →"}
                  </button>
                </div>
              </form>
            </div>
          )
        ) : isPending ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50/50 p-6 text-center space-y-2">
            <span className="font-mono text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              Status Pendaftaran: Menunggu Review
            </span>
            <p className="text-xs text-steel max-w-lg mx-auto">
              Area pengumpulan karya akan terbuka secara otomatis setelah pendaftaran kamu disetujui oleh pihak perusahaan.
            </p>
          </div>
        ) : null}

        {/* SECTION DAFTAR RIWAYAT PENGUMPULAN KARYA (LOG ITERASI BERKALI-KALI) */}
        {riwayatList.length > 0 && (
          <div className="rounded-3xl border border-steel/15 bg-white p-6 sm:p-8 shadow-md space-y-6">
            <div className="border-b border-steel/10 pb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-ink">
                  Riwayat Iterasi Pengumpulan Karya ({riwayatList.length})
                </h2>
                <p className="text-xs text-steel">
                  Seluruh versi tautan hasil karya dan catatan evaluasi/kritik dari perusahaan mitra.
                </p>
              </div>
              <span className="font-mono text-[10px] uppercase font-bold text-ink bg-steel/10 px-3 py-1 rounded-full">
                Audit Log
              </span>
            </div>

            <div className="space-y-4">
              {riwayatList.map((item, idx) => {
                const itemDate = item.created_at
                  ? new Date(item.created_at).toLocaleDateString("id-ID", {
                      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                    })
                  : "-";

                return (
                  <div
                    key={item.id || idx}
                    className="rounded-2xl border border-steel/15 bg-steel/5 p-5 space-y-3 font-mono text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-steel/10 pb-2">
                      <span className="font-bold text-ink text-sm">
                        Versi #{item.versi || riwayatList.length - idx}
                      </span>
                      <span className="text-[11px] text-steel">{itemDate}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-steel/70 block">Tautan Karya:</span>
                      <a
                        href={item.url_hasil}
                        target="_blank"
                        rel="noreferrer"
                        className="text-bridge-gold font-bold underline truncate block text-xs"
                      >
                        {item.url_hasil}
                      </a>
                    </div>

                    {item.catatan_mahasiswa && (
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-steel/70 block">Catatan Mahasiswa:</span>
                        <p className="text-ink font-sans text-xs italic bg-white p-3 rounded-xl border border-steel/10">
                          &ldquo;{item.catatan_mahasiswa}&rdquo;
                        </p>
                      </div>
                    )}

                    {item.evaluasi_perusahaan && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] uppercase font-bold text-amber-800 block">Kritik &amp; Evaluasi Perusahaan:</span>
                        <p className="text-amber-950 font-sans text-xs bg-amber-100/60 p-3 rounded-xl border border-amber-300">
                          &ldquo;{item.evaluasi_perusahaan}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
