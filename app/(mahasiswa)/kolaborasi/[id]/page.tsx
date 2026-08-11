"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Kolaborasi } from "@/lib/dummy-data";
import { ApplyModal } from "@/components/ApplyModal";
import { supabase } from "@/lib/supabase";
import { fetchMahasiswaMatchProfile, calculateMatchScore } from "@/lib/matching";

type StoredUser = {
  nama: string;
  universitas: string;
  prodi: string;
};

export default function DetailKolaborasiPage() {
  const { id } = useParams();
  const router = useRouter();

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<Kolaborasi | null>(null);

  const [showLowMatchConfirmModal, setShowLowMatchConfirmModal] = useState(false);

  useEffect(() => {
    async function loadUser() {
      // 1. Cek local storage dulu
      const stored = localStorage.getItem("bridgeu_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }

      // 2. Direct Supabase Session Check
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (token) {
        try {
          const res = await fetch("/api/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const me = await res.json();
            if (me && me.nama) {
              setUser({
                nama: me.nama,
                universitas: me.universitas || "-",
                prodi: me.prodi || "Mahasiswa",
              });
              return;
            }
          }
        } catch (e) {
          console.error("Gagal fetch /api/me:", e);
        }
      }

      // 3. Fallback Supabase getUser
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        setUser({
          nama: authData.user.user_metadata?.nama || authData.user.email?.split("@")[0] || "Mahasiswa",
          universitas: "-",
          prodi: "Mahasiswa",
        });
      }
    }
    loadUser();
  }, []);

  useEffect(() => {
    if (!id) return;
    async function loadDataAndMatch() {
      setLoading(true);
      const matchProfile = await fetchMahasiswaMatchProfile();

      const { data: row, error } = await supabase
        .from("kolaborasi")
        .select(`
          id, judul, tipe, deskripsi, lokasi_id, batas_waktu, status_moderasi,
          tingkat_kesulitan, gaji_stipend, perusahaan_id, kategori_id,
          perusahaan:perusahaan_id ( nama_perusahaan ),
          kategori:kategori_id ( nama_kategori ),
          kota:lokasi_id ( nama_kota ),
          kolaborasi_skills ( skill_id, skills ( nama_skill ) ),
          kolaborasi_target_prodi ( prodi_id, program_studi:prodi_id ( nama_prodi ) )
        `)
        .eq("id", id as string)
        .maybeSingle();

      if (error) {
        console.error("Gagal memuat detail kolaborasi:", error.message);
      } else if (row) {
        const skillIds = (row.kolaborasi_skills as any[])?.map((ks: any) => ks.skill_id).filter((v: any) => v != null) ?? [];
        const prodiIds = (row.kolaborasi_target_prodi as any[])?.map((kp: any) => kp.prodi_id).filter((v: any) => v != null) ?? [];
        const kategoriMinatIds = row.kategori_id ? [row.kategori_id] : [];

        const matchResult = calculateMatchScore(
          { skillIds, kategoriMinatIds, prodiIds },
          matchProfile
        );

        setData({
          id: row.id,
          perusahaan: (row.perusahaan as any)?.nama_perusahaan ?? "Mitra Perusahaan",
          perusahaanId: row.perusahaan_id,
          judul: row.judul,
          tipe: row.tipe === "Magang" ? "Magang" : "Akademik",
          kategori: (row.kategori as any)?.nama_kategori ?? "Kolaborasi",
          deskripsi: row.deskripsi,
          lokasi: (row.kota as any)?.nama_kota ?? "-",
          batasWaktu: row.batas_waktu
            ? new Date(row.batas_waktu).toLocaleDateString("id-ID", {
                day: "numeric", month: "long", year: "numeric",
              })
            : "-",
          statusModerasi: row.status_moderasi === "Disetujui" ? "Disetujui"
            : row.status_moderasi === "Ditolak" ? "Ditolak" : "Menunggu",
          tags: (row.kolaborasi_skills as any[])
            ?.map((ks: any) => ks.skills?.nama_skill)
            .filter(Boolean) ?? [],
          matchScore: matchResult.scorePercent,
          tingkatKesulitan:
            row.tingkat_kesulitan === "Pemula" ? "Pemula"
            : row.tingkat_kesulitan === "Lanjutan" ? "Lanjutan"
            : "Menengah",
          rekomendasiProdi: (row.kolaborasi_target_prodi as any[])
            ?.map((kp: any) => kp.program_studi?.nama_prodi)
            .filter(Boolean) ?? [],
          gajiStipend: row.gaji_stipend ?? undefined,
          kuota: (row as any).kuota ?? 0,
          kuotaTerisi: (row as any).kuota_terisi ?? 0,
          statusPublikasi: "Terbit",
        });
      }
      setLoading(false);
    }

    loadDataAndMatch();
  }, [id]);

  const handleApplyClick = () => {
    if (data && (data.matchScore ?? 0) < 50) {
      setShowLowMatchConfirmModal(true);
    } else {
      router.push(`/kolaborasi/${id}/daftar`);
    }
  };



  if (loading) {
    return (
      <main className="min-h-screen bg-paper flex flex-col justify-center items-center px-6 text-center">
        <div className="rounded-2xl border border-steel/20 bg-white p-8 max-w-md shadow-xl">
          <div className="h-6 w-48 bg-steel/10 rounded-lg animate-pulse mx-auto mb-3" />
          <div className="h-3 w-32 bg-steel/10 rounded animate-pulse mx-auto" />
        </div>
      </main>
    );
  }

  if (!data) {

    return (
      <main className="min-h-screen bg-paper flex flex-col justify-center items-center px-6 text-center">
        <div className="rounded-2xl border border-steel/20 bg-white p-8 max-w-md shadow-xl">
          <p className="text-lg font-bold text-ink">Peluang tidak ditemukan</p>
          <p className="text-xs text-steel mt-2">
            Peluang kolaborasi yang kamu cari mungkin telah dihapus atau tidak tersedia.
          </p>
          <Link
            href="/kolaborasi"
            className="mt-6 inline-block rounded-xl bg-ink px-5 py-2.5 font-mono text-xs font-bold text-paper hover:bg-steel transition"
          >
            ← Kembali ke Daftar Kolaborasi
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper pt-24 pb-32 text-ink font-sans">
      {/* CONTAINER UTAMA */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-6">
        {/* Navigasi Kembali */}
        <button
          onClick={() => router.push("/kolaborasi")}
          className="inline-flex items-center gap-2 font-mono text-xs text-steel hover:text-bridge-gold transition mb-6 font-bold"
        >
          ← Kembali ke daftar peluang
        </button>

        {/* HEADER BAR */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-steel/15 bg-white p-6 sm:p-8 shadow-sm mb-8 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-bridge-gold font-bold bg-bridge-gold/10 border border-bridge-gold/30 px-3 py-1 rounded-full">
              {data.perusahaan}
            </span>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 font-mono text-xs font-bold text-emerald-700">
                {data.matchScore}% Match
              </span>
              <span
                className={`rounded-full border px-3.5 py-1 font-mono text-[10px] uppercase tracking-wider font-extrabold ${
                  data.tipe === "Akademik"
                    ? "bg-steel/10 text-steel border-steel/30"
                    : "bg-bridge-gold text-ink border-bridge-gold"
                }`}
              >
                {data.tipe}
              </span>
            </div>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-black text-ink leading-tight">
            {data.judul}
          </h1>
        </motion.div>

        {/* LAYOUT 2 KOLOM (KIRI: KONTEN LENGKAP, KANAN: SIDEBAR AKSI & METADATA) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* KOLOM KIRI (MAIN CONTENT) */}
          <div className="lg:col-span-2 space-y-6">
            {/* CARD 1: Deskripsi & Tantangan Utama */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-3xl border border-steel/15 bg-white p-6 sm:p-8 shadow-sm space-y-4"
            >
              <div className="flex items-center gap-3 border-b border-steel/10 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-bridge-gold/15 text-ink">
                  <svg className="w-5 h-5 text-bridge-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-ink">Deskripsi & Tantangan Proyek</h2>
                  <p className="text-xs text-steel">Rincian tugas dan ruang lingkup pekerjaan</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-steel font-medium whitespace-pre-line">
                {data.deskripsi}
              </p>
            </motion.div>

            {/* CARD 2: Manfaat & Hasil Akademik */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-3xl border border-steel/15 bg-ink p-6 sm:p-8 text-paper shadow-md space-y-5"
            >
              <div className="flex items-center gap-3 border-b border-white/15 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-bridge-gold text-ink font-bold">
                  <svg className="w-5 h-5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-paper">Manfaat Akademik & Portofolio</h2>
                  <p className="text-xs text-paper/70">Benefit resmi yang kamu dapatkan setelah menyelesaikan kolaborasi</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1">
                  <span className="text-bridge-gold text-sm font-bold block">1. Sertifikat Resmi</span>
                  <p className="text-paper/80 font-sans text-xs">Diakui mitra perusahaan terverifikasi.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1">
                  <span className="text-bridge-gold text-sm font-bold block">2. Auto Portfolio</span>
                  <p className="text-paper/80 font-sans text-xs">Masuk ke Portfolio Tracker kamu.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1">
                  <span className="text-bridge-gold text-sm font-bold block">3. Rekomendasi Magang</span>
                  <p className="text-paper/80 font-sans text-xs">Peluang rekrutmen magang langsung.</p>
                </div>
              </div>
            </motion.div>

            {/* CARD 3: Skill & Kategori Dibutuhkan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="rounded-3xl border border-steel/15 bg-white p-6 sm:p-8 shadow-sm space-y-4"
            >
              <h3 className="font-display text-base font-bold text-ink">Skill & Kualifikasi Dibutuhkan</h3>
              <div className="flex flex-wrap gap-2">
                {(data.tags || []).map((t, idx) => (
                  <span key={idx} className="rounded-full bg-steel/10 px-3.5 py-1.5 font-mono text-xs font-semibold text-ink border border-steel/20">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* KOLOM KANAN (STICKY SIDEBAR AKSI & INFORMASI INSTAN) */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* SIDEBAR AKSI PENGAJUAN */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-3xl border-2 border-bridge-gold/40 bg-white p-6 shadow-lg space-y-5"
            >
              <div>
                <h3 className="font-display text-lg font-bold text-ink">Status Pengajuan</h3>
                <p className="text-xs text-steel mt-0.5">Kirimkan permohonan kolaborasi kamu sekarang</p>
              </div>

              {submitted ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center space-y-3">
                  <span className="font-mono text-xs font-bold text-emerald-800 block">✓ Pengajuan Berhasil Terkirim</span>
                  <p className="text-xs text-steel">Status: <strong className="text-ink">Menunggu Peninjauan Perusahaan</strong></p>
                  <Link
                    href="/status"
                    className="mt-2 block w-full rounded-xl bg-ink py-2.5 font-mono text-xs font-bold text-paper hover:bg-steel transition shadow-xs text-center"
                  >
                    Pantau Status Pengajuan →
                  </Link>
                </div>
              ) : user ? (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-paper p-4 border border-steel/10 text-xs text-steel space-y-1">
                    <p>Pemohon: <strong className="text-ink">{user.nama}</strong></p>
                    <p>Prodi: <strong className="text-ink">{user.prodi || "Mahasiswa"}</strong></p>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyClick}
                    className="w-full rounded-2xl bg-bridge-gold py-3.5 px-4 font-mono text-xs font-extrabold text-ink hover:bg-bridge-gold/90 transition shadow-md hover:scale-[1.02] active:scale-95 text-center"
                  >
                    Ajukan Kolaborasi Sekarang →
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl bg-bridge-gold/10 p-5 text-center space-y-3 border border-bridge-gold/30">
                  <p className="text-xs font-bold text-ink">Belum Masuk Akun</p>
                  <p className="text-[11px] text-steel">Silakan masuk untuk mengajukan kolaborasi ini.</p>
                  <Link
                    href="/?auth=login"
                    className="block w-full rounded-xl bg-ink py-2.5 font-mono text-xs font-bold text-paper hover:bg-steel transition shadow-xs text-center"
                  >
                    Masuk Ke Akun
                  </Link>
                </div>
              )}
            </motion.div>

            {/* SIDEBAR METADATA PROYEK */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="rounded-3xl border border-steel/15 bg-white p-6 shadow-sm space-y-4"
            >
              <h4 className="font-display text-sm font-bold text-ink border-b border-steel/10 pb-3">Informasi Proyek</h4>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-steel">Kategori:</span>
                  <span className="font-bold text-ink">{data.kategori}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-steel">Lokasi:</span>
                  <span className="font-bold text-ink">{data.lokasi}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-steel">Batas Waktu:</span>
                  <span className="font-bold text-ink">{data.batasWaktu}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-steel">Tingkat Kesulitan:</span>
                  <span className="font-bold text-ink">{data.tingkatKesulitan}</span>
                </div>
                {data.gajiStipend && (
                  <div className="flex justify-between items-center">
                    <span className="text-steel">Stipend:</span>
                    <span className="font-bold text-emerald-700">{data.gajiStipend}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* MODAL KONFIRMASI SKOR KECOCOKAN 0% */}
      {showLowMatchConfirmModal && data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-paper p-6 sm:p-8 shadow-2xl border border-steel/20 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-ink">Kecocokan Profil Dibawah 50%</h3>
                <p className="font-mono text-xs text-steel">Skor Match: <span className="font-bold text-amber-600">{data.matchScore}%</span></p>
              </div>
            </div>

            <p className="text-xs text-steel leading-relaxed">
              Tingkat kecocokan profil kamu dengan persyaratan proyek ini berada di bawah 50% (atau 0%). Apakah Anda yakin tetap ingin melanjutkan pengajuan kolaborasi ini?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-steel/15">
              <button
                type="button"
                onClick={() => setShowLowMatchConfirmModal(false)}
                className="rounded-xl border border-steel/20 bg-white px-4 py-2 text-xs font-semibold text-steel hover:border-ink hover:text-ink transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLowMatchConfirmModal(false);
                  router.push(`/kolaborasi/${id}/daftar`);
                }}
                className="rounded-xl bg-bridge-gold px-5 py-2 text-xs font-bold text-ink hover:bg-bridge-gold/90 transition shadow-md"
              >
                Yakin & Lanjutkan →
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}