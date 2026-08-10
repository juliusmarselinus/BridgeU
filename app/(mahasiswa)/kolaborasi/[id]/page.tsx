"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Kolaborasi } from "@/lib/dummy-data";
import { ApplyModal } from "@/components/ApplyModal";
import { supabase } from "@/lib/supabase";

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

  useEffect(() => {
    const stored = localStorage.getItem("bridgeu_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("kolaborasi")
      .select(`
        id, judul, tipe, deskripsi, lokasi_id, batas_waktu, status_moderasi,
        tingkat_kesulitan, gaji_stipend, perusahaan_id,
        perusahaan:perusahaan_id ( nama_perusahaan ),
        kategori:kategori_id ( nama_kategori ),
        kota:lokasi_id ( nama_kota ),
        kolaborasi_skills ( skills ( nama_skill ) ),
        kolaborasi_target_prodi ( program_studi:prodi_id ( nama_prodi ) )
      `)
      .eq("id", id as string)
      .maybeSingle()
      .then(({ data: row, error }) => {
        if (error) {
          console.error("Gagal memuat detail kolaborasi:", error.message);
        } else if (row) {
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
            matchScore: 85,
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
      });
  }, [id]);



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

      {/* TOP HEADER CONTAINER */}
      <div className="mx-auto max-w-4xl px-6 pt-10 pb-6">
        <button
          onClick={() => router.push("/kolaborasi")}
          className="inline-flex items-center gap-2 font-mono text-xs text-steel hover:text-bridge-gold transition mb-6 font-bold"
        >
          ← Kembali ke daftar peluang
        </button>

        {/* TITLE & META HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-bridge-gold font-bold bg-bridge-gold/10 border border-bridge-gold/30 px-3 py-1 rounded-full">
              🏢 {data.perusahaan}
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

          <h1 className="font-display text-3xl sm:text-5xl font-black text-ink leading-tight">
            {data.judul}
          </h1>

          <div className="flex flex-wrap gap-4 font-mono text-xs text-steel pt-2 border-t border-steel/10">
            <span className="flex items-center gap-1.5">
              📁 <strong className="text-ink">Kategori:</strong> {data.kategori}
            </span>
            <span className="flex items-center gap-1.5">
              📍 <strong className="text-ink">Lokasi:</strong> {data.lokasi}
            </span>
            <span className="flex items-center gap-1.5">
              ⏰ <strong className="text-ink">Batas Pendaftaran:</strong> {data.batasWaktu}
            </span>
          </div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SCROLL-DRIVEN STACKING / TIMPAH TINDIH CARDS SECTION           */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-4xl px-6 pt-6 space-y-6">

        {/* STACKED CARD 1: Ringkasan Proyek & Deskripsi */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="sticky top-24 z-10 rounded-3xl border-2 border-steel/20 bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl"
        >
          <div className="flex items-center gap-3 border-b border-steel/10 pb-4 mb-4">
            <span className="p-2.5 rounded-2xl bg-bridge-gold/15 text-ink font-bold text-sm">📌</span>
            <div>
              <h2 className="font-display text-xl font-bold text-ink">Deskripsi & Tantangan Utama</h2>
              <p className="text-xs text-steel">Gambaran umum proyek kolaborasi dari perusahaan</p>
            </div>
          </div>
          <p className="text-base leading-relaxed text-steel font-medium">
            {data.deskripsi}
          </p>
        </motion.div>

        {/* STACKED CARD 2: Manfaat & Hasil Akademik (Menimpah Card 1 saat scroll) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="sticky top-28 z-20 rounded-3xl border-2 border-bridge-gold/40 bg-ink p-8 text-paper shadow-2xl transition-all duration-300 hover:border-bridge-gold"
        >
          <div className="flex items-center gap-3 border-b border-white/15 pb-4 mb-4">
            <span className="p-2.5 rounded-2xl bg-bridge-gold text-ink font-bold text-sm">🎓</span>
            <div>
              <h2 className="font-display text-xl font-bold text-paper">Manfaat Akademik & Portofolio</h2>
              <p className="text-xs text-paper/70">Yang akan didapatkan mahasiswa dari kolaborasi ini</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1">
              <span className="text-bridge-gold text-base font-bold">1. Sertifikat Resmi</span>
              <p className="text-paper/80 font-sans text-xs">Pengakuan dari mitra perusahaan terverifikasi.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1">
              <span className="text-bridge-gold text-base font-bold">2. Auto Portfolio</span>
              <p className="text-paper/80 font-sans text-xs">Masuk ke Student Portfolio Tracker otomatis.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1">
              <span className="text-bridge-gold text-base font-bold">3. Rekomendasi Magang</span>
              <p className="text-paper/80 font-sans text-xs">Peluang direkrut magang secara langsung.</p>
            </div>
          </div>
        </motion.div>

        {/* STACKED CARD 3: Form / Tombol Pengajuan (Menimpah Card 2 saat scroll) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="sticky top-32 z-30 rounded-3xl border-2 border-steel/20 bg-white p-8 shadow-2xl transition-all duration-300"
        >
          <div className="text-center space-y-4">
            {submitted ? (
              <div className="rounded-2xl border-2 border-verified/40 bg-verified/10 p-8 text-center space-y-3">
                <span className="text-4xl">🎉</span>
                <h3 className="font-display text-2xl font-bold text-ink">Pengajuan Berhasil Terkirim!</h3>
                <p className="text-xs font-mono text-steel max-w-sm mx-auto">
                  Status pengajuan kamu: <span className="font-bold text-bridge-gold">Menunggu Peninjauan Perusahaan</span>
                </p>
                <div className="pt-4">
                  <Link
                    href="/status"
                    className="inline-block rounded-xl bg-ink px-6 py-3 font-mono text-xs font-bold text-paper hover:bg-steel transition shadow-md"
                  >
                    Pantau Status Pengajuan →
                  </Link>
                </div>
              </div>
            ) : user ? (
              <div className="space-y-4 py-2">
                <span className="inline-block p-3 rounded-full bg-bridge-gold/20 text-ink text-2xl">🚀</span>
                <h3 className="font-display text-2xl font-bold text-ink">Tertarik dengan Peluang Ini?</h3>
                <p className="text-sm text-steel max-w-md mx-auto">
                  Ajukan permohonan kolaborasi akademik ini secara langsung sebagai{" "}
                  <strong className="text-ink">{user.nama}</strong> ({user.prodi || "Mahasiswa"}).
                </p>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 rounded-xl bg-bridge-gold px-8 py-3.5 font-mono text-sm font-extrabold text-ink hover:bg-bridge-gold/90 transition shadow-xl hover:scale-105 active:scale-95"
                >
                  Ajukan Kolaborasi Sekarang →
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-bridge-gold/40 bg-bridge-gold/15 p-6 text-center space-y-3">
                <p className="text-sm font-bold text-ink">
                  Kamu Belum Masuk Akun
                </p>
                <p className="text-xs text-steel">
                  Silakan masuk terlebih dahulu untuk mengajukan kolaborasi ini.
                </p>
                <Link
                  href="/?auth=login"
                  className="inline-block rounded-xl bg-ink px-6 py-2.5 font-mono text-xs font-bold text-paper hover:bg-steel transition shadow-md"
                >
                  Masuk Ke Akun
                </Link>
              </div>
            )}
          </div>
        </motion.div>

      </div>

      {/* MODAL APPLY */}
      {isModalOpen && user && (
        <ApplyModal
          data={data}
          user={user}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            setSubmitted(true);
          }}
        />
      )}
    </main>
  );
}