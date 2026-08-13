"use client";

import { CSSProperties, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { GradientBars } from "@/components/ui/gradient-bars-background";
import { ApplyModal } from "@/components/ApplyModal";
import { DetailModal } from "@/components/DetailModal";
import { MahasiswaSkeletonPage } from "@/components/ui/MahasiswaLoading";
import { Kolaborasi } from "@/lib/types";
import {
  fetchMahasiswaMatchProfile,
  rankKolaborasiByMatch,
  MahasiswaMatchProfile,
} from "@/lib/matching";

type StoredUser = {
  nama: string;
  universitas: string;
  prodi: string;
  semester?: string;
};

function initials(name: string) {
  if (!name) return "PT";
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

/** Map raw Supabase row -> Kolaborasi (termasuk raw id buat matching) */
function mapDbRow(row: any): Kolaborasi {
  return {
    id: row.id,
    perusahaan: row.perusahaan?.nama_perusahaan ?? "Mitra Perusahaan",
    perusahaanId: row.perusahaan_id,
    judul: row.judul,
    tipe: row.tipe === "Magang" ? "Magang" : "Akademik",
    kategori: row.kategori?.nama_kategori ?? "Kolaborasi",
    deskripsi: row.deskripsi,
    lokasi: row.kota?.nama_kota ?? "-",
    batasWaktu: row.batas_waktu
      ? new Date(row.batas_waktu).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "-",
    statusModerasi:
      row.status_moderasi === "Disetujui"
        ? "Disetujui"
        : row.status_moderasi === "Ditolak"
        ? "Ditolak"
        : "Menunggu",
    tags: row.kolaborasi_skills
      ? row.kolaborasi_skills.map((ks: any) => ks.skills?.nama_skill).filter(Boolean)
      : [],
    tingkatKesulitan:
      row.tingkat_kesulitan === "Pemula"
        ? "Pemula"
        : row.tingkat_kesulitan === "Lanjutan"
        ? "Lanjutan"
        : "Menengah",
    rekomendasiProdi: row.kolaborasi_target_prodi
      ? row.kolaborasi_target_prodi.map((kp: any) => kp.program_studi?.nama_prodi).filter(Boolean)
      : [],
    gajiStipend: row.gaji_stipend ?? undefined,
    slot: row.slot ?? null,

    skillIds: row.kolaborasi_skills
      ? row.kolaborasi_skills.map((ks: any) => ks.skill_id).filter((v: any) => v != null)
      : [],
    kategoriMinatIds: row.kolaborasi_kategori_minat
      ? row.kolaborasi_kategori_minat.map((km: any) => km.kategori_id).filter((v: any) => v != null)
      : [],
    prodiIds: row.kolaborasi_target_prodi
      ? row.kolaborasi_target_prodi.map((kp: any) => kp.prodi_id).filter((v: any) => v != null)
      : [],
  };
}

/** Fetch semua kolaborasi yang sudah disetujui, lengkap dengan relasi skill/minat/prodi */
async function fetchKolaborasiFromSupabase(): Promise<Kolaborasi[]> {
  const { data, error } = await supabase
    .from("kolaborasi")
    .select(`
      id, judul, tipe, deskripsi, lokasi_id, batas_waktu, status_moderasi,
      tingkat_kesulitan, gaji_stipend, perusahaan_id, slot,
      perusahaan:perusahaan_id ( nama_perusahaan ),
      kategori:kategori_id ( nama_kategori ),
      kota:lokasi_id ( nama_kota ),
      kolaborasi_skills ( skill_id, skills ( nama_skill ) ),
      kolaborasi_kategori_minat ( kategori_id ),
      kolaborasi_target_prodi ( prodi_id, program_studi:prodi_id ( nama_prodi ) )
    `)
    .eq("status_moderasi", "Disetujui")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal memuat kolaborasi dari Supabase:", error.message);
    return [];
  }

  return (data ?? []).map(mapDbRow);
}

/** Fetch profil pemohon (nama, universitas, prodi, semester) langsung dari Supabase — bukan localStorage */
async function fetchApplicantProfile(): Promise<StoredUser | null> {
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id;
  if (!uid) return null;

  const { data: profile, error } = await supabase
    .from("mahasiswa_profiles")
    .select(`
      nama_lengkap,
      semester,
      universitas:universitas_id ( nama_universitas ),
      prodi:prodi_id ( nama_prodi )
    `)
    .eq("user_id", uid)
    .single();

  if (error || !profile) {
    console.error("Gagal memuat profil mahasiswa:", error?.message);
    return null;
  }

  return {
    nama: profile.nama_lengkap,
    universitas: (profile.universitas as any)?.nama_universitas ?? "-",
    prodi: (profile.prodi as any)?.nama_prodi ?? "-",
    semester: profile.semester ?? undefined,
  };
}

export default function KolaborasiPage() {
  const [kolaborasiList, setKolaborasiList] = useState<Kolaborasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [applicantProfile, setApplicantProfile] = useState<StoredUser | null>(null);
  const [mahasiswaProfile, setMahasiswaProfile] = useState<MahasiswaMatchProfile | null>(null);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [tipeFilter, setTipeFilter] = useState<"Semua" | "Akademik" | "Magang">("Semua");
  const [applyTarget, setApplyTarget] = useState<Kolaborasi | null>(null);
  const [detailTarget, setDetailTarget] = useState<Kolaborasi | null>(null);
  const [successToast, setSuccessToast] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 18;

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("COMPONENT CHECK:", { ApplyModal, DetailModal, AnimatePresence, motion });
  }, []);

  useEffect(() => {
    // Nama/universitas/prodi buat tampilan header ringan - boleh tetap dari localStorage
    const storedUser = localStorage.getItem("bridgeu_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }

    // Profil pemohon buat form Ajukan Kolaborasi — WAJIB dari Supabase (bukan localStorage)
    fetchApplicantProfile().then(setApplicantProfile);

    // Profil buat SCORING (skills, minat, prodi_id) WAJIB dari Supabase, by session login
    fetchMahasiswaMatchProfile().then(setMahasiswaProfile);

    // Kolaborasi yang sudah pernah didaftar — untuk disembunyikan dari katalog
    supabase.auth.getUser().then(({ data: authData }) => {
      const uid = authData?.user?.id;
      if (!uid) return;
      supabase
        .from("pendaftaran_kolaborasi")
        .select("kolaborasi_id")
        .eq("mahasiswa_id", uid)
        .then(({ data }) => {
          if (data && data.length > 0) {
            setRegisteredIds(new Set(data.map((r: any) => r.kolaborasi_id).filter(Boolean)));
          }
        });
    });

    fetchKolaborasiFromSupabase().then((rows) => {
      setKolaborasiList(rows);
      setLoading(false);
    });
  }, []);

  // Kolaborasi yang belum pernah didaftar user
  const unregisteredList = useMemo(
    () => kolaborasiList.filter((k) => !registeredIds.has(k.id)),
    [kolaborasiList, registeredIds]
  );

  // Semua kolaborasi + skor, TANPA filter threshold (dipakai buat katalog/search di bawah)
  const kolaborasiWithScores = useMemo(() => {
    return rankKolaborasiByMatch(unregisteredList, mahasiswaProfile, {
      onlyPassingThreshold: false,
    });
  }, [unregisteredList, mahasiswaProfile]);

  // Rekomendasi utama buat carousel: HANYA yang lolos threshold kemiripan, top 5
  const smartRecommendations = useMemo(() => {
    return rankKolaborasiByMatch(unregisteredList, mahasiswaProfile, {
      onlyPassingThreshold: true,
      topN: 5,
    });
  }, [unregisteredList, mahasiswaProfile]);

  const totalRecs = smartRecommendations.length;

  useEffect(() => {
    if (isPaused || totalRecs === 0) return;
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % totalRecs);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, totalRecs]);

  const filtered = useMemo(() => {
    return kolaborasiWithScores.filter((k) => {
      const matchSearch =
        k.judul.toLowerCase().includes(search.toLowerCase()) ||
        k.perusahaan.toLowerCase().includes(search.toLowerCase()) ||
        k.kategori.toLowerCase().includes(search.toLowerCase()) ||
        (k.tags && k.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())));
      const matchTipe = tipeFilter === "Semua" || k.tipe === tipeFilter;
      return matchSearch && matchTipe;
    });
  }, [kolaborasiWithScores, search, tipeFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleApplySuccess = () => {
    // Langsung sembunyikan dari katalog tanpa perlu reload
    if (applyTarget) {
      setRegisteredIds((prev) => new Set([...prev, applyTarget.id]));
    }
    setApplyTarget(null);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  // Reset ke halaman 1 saat filter/search berubah
  const handleSearchChange = (val: string) => { setSearch(val); setCurrentPage(1); };
  const handleTipeChange = (t: "Semua" | "Akademik" | "Magang") => { setTipeFilter(t); setCurrentPage(1); };

  // Carousel infinite: index asli 0..totalRecs-1
  const nextCarousel = () => setCarouselIndex((prev) => (prev + 1) % totalRecs);
  const prevCarousel = () => setCarouselIndex((prev) => (prev - 1 + totalRecs) % totalRecs);

  const GAP = 16;

  // Carousel absolute-positioned: active selalu center, prev di kiri, next di kanan
  if (loading) {
    return <MahasiswaSkeletonPage />;
  }

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-secondary/15 via-clouds to-clouds pb-24 font-sans text-ink">
      {/* Soft ambient bars — sama kayak dashboard, buat break flat background */}
      <GradientBars
        numBars={20}
        gradientFrom="rgb(141, 209, 255)"
        gradientTo="transparent"
        animationDuration={7}
        className="opacity-70"
      />

      <div
        className="relative w-full pt-28 pb-16 overflow-hidden rounded-b-[2.5rem] shadow-[0_20px_50px_-20px_rgba(18,40,75,0.45)]"
        style={{ background: "linear-gradient(160deg, #12284B 0%, #1B3A63 45%, #8CC1E9 100%)" }}
      >
          <div className="relative z-10 mx-auto max-w-[1400px] px-6 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky/20 px-3.5 py-1 text-xs font-mono font-bold text-sky border border-sky/40 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-sky animate-pulse" />
              SMART RECOMMENDATION ENGINE ACTIVE
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
              Peluang Kolaborasi &amp; Magang
            </h1>
            <p className="text-sm text-white/75 max-w-2xl leading-relaxed">
              Jelajahi studi kasus akademik &amp; posisi magang dari perusahaan mitra terverifikasi,
              direkomendasikan secara pintar sesuai dengan profil skill dan minat kamu.
            </p>
          </div>
      </div>

      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 z-[70] rounded-2xl bg-ocean border border-sky/30 px-6 py-3 text-xs font-mono font-bold text-sky shadow-2xl flex items-center gap-2"
          >
            Pengajuan kolaborasi berhasil dikirim!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mx-auto max-w-[1400px] px-6 -mt-10 z-20 space-y-10">
        {/* ═══════ CAROUSEL — hanya kolaborasi yang lolos threshold kemiripan ═══════ */}
        <section
          className="rounded-3xl bg-ocean p-5 sm:p-7 text-white shadow-2xl border border-sky/20 relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-sky/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -top-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-5 relative z-20">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-sky/20 text-sky text-xs font-bold">
                AI
              </span>
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-sky font-bold uppercase tracking-wider">
                  <span>AI Smart Match Showcase</span>
                  {isPaused && (
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/70 font-normal">
                      Paused
                    </span>
                  )}
                </div>
                <h2 className="font-display text-base sm:text-xl font-extrabold text-white mt-0.5">
                  Rekomendasi Utama {user?.prodi ? `untuk ${user.prodi}` : ""}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-sky font-bold bg-white/10 px-3 py-1 rounded-full border border-white/10">
                <span>{totalRecs > 0 ? `0${carouselIndex + 1}` : "00"}</span>
                <span className="text-white/40">/</span>
                <span className="text-white/60">0{totalRecs}</span>
              </div>
              <button
                onClick={prevCarousel}
                className="h-9 w-9 rounded-full border border-white/20 bg-white/10 hover:bg-sky hover:text-ocean text-white font-mono font-bold text-xs flex items-center justify-center transition hover:scale-105 active:scale-95"
              >
                ←
              </button>
              <button
                onClick={nextCarousel}
                className="h-9 w-9 rounded-full border border-white/20 bg-white/10 hover:bg-sky hover:text-ocean text-white font-mono font-bold text-xs flex items-center justify-center transition hover:scale-105 active:scale-95"
              >
                →
              </button>
            </div>
          </div>

          <div className="relative" style={{ height: 340 }}>
            {loading ? (
              <div className="flex items-center justify-center h-full text-white/50 font-mono text-sm">
                Memuat rekomendasi...
              </div>
            ) : !mahasiswaProfile ? (
              <div className="flex items-center justify-center h-full text-white/50 font-mono text-sm text-center px-6">
                Login sebagai mahasiswa untuk melihat rekomendasi yang dipersonalisasi.
              </div>
            ) : totalRecs === 0 ? (
              <div className="flex items-center justify-center h-full text-white/50 font-mono text-sm text-center px-6">
                Belum ada kolaborasi yang cukup cocok dengan skill/minat kamu saat ini. Lengkapi
                profil kamu supaya rekomendasi makin akurat.
              </div>
            ) : (
              <>
              {smartRecommendations.map((rec, i) => {
                  const isActive = i === carouselIndex;
                  const isPrev = i === (carouselIndex - 1 + totalRecs) % totalRecs;
                  const isNext = i === (carouselIndex + 1) % totalRecs;
                  const isVisible = isActive || isPrev || isNext;

                  // Outer div: CSS positioning (tidak konflik dengan Framer Motion transform)
                  // Active: kiri=25%, kanan=75% → persis di tengah
                  // Prev:   kanan=25% (right-anchor) → di kiri active
                  // Next:   kiri=75% → di kanan active
                  const posStyle: React.CSSProperties = {
                    position: "absolute",
                    top: 0,
                    height: "100%",
                    transition: "left 0.45s cubic-bezier(0.16,1,0.3,1), right 0.45s cubic-bezier(0.16,1,0.3,1), width 0.45s cubic-bezier(0.16,1,0.3,1)",
                    pointerEvents: isVisible ? "auto" : "none",
                    zIndex: isActive ? 10 : 5,
                    ...(isActive
                      ? { left: "25%", width: "50%" }
                      : isPrev
                      ? { right: "75%", width: "24%" }
                      : { left: "75%", width: "24%" }),
                  };

                  return (
                    <div key={`carousel-slot-${i}`} style={posStyle}>
                      <motion.div
                        onClick={() => {
                          if (isPrev) prevCarousel();
                          else if (isNext) nextCarousel();
                        }}
                        animate={{
                          opacity: isActive ? 1 : isVisible ? 0.55 : 0,
                          scale: isActive ? 1 : 0.93,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 35, mass: 0.8 }}
                        style={{ width: "100%", height: "100%" }}
                        className={`rounded-2xl p-5 flex flex-col justify-between overflow-hidden relative
                          ${
                            isActive
                              ? "border border-white/30 bg-gradient-to-br from-white/[0.22] via-white/[0.1] to-white/[0.04] backdrop-blur-2xl backdrop-saturate-150 shadow-[0_0_35px_rgba(140,193,233,0.3),inset_0_1px_0_0_rgba(255,255,255,0.35),inset_0_0_0_1px_rgba(255,255,255,0.06)] cursor-default"
                              : "border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10"
                          }`}
                      >
                        {isActive && (
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sky to-transparent" />
                        )}

                        {isActive ? (
                          <>
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <span className="rounded-full bg-sky px-3.5 py-1 font-mono text-xs font-black text-ocean shadow-md flex items-center gap-1">
                                  {rec.match.scorePercent}% Match
                                </span>
                                <div className="flex items-center gap-2">
                                  {rec.match.prodiCocok && (
                                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-0.5 rounded-full font-mono text-[10px] font-bold">
                                      Sesuai Prodi
                                    </span>
                                  )}
                                  <span className="bg-white/10 text-white/80 border border-white/10 px-3 py-0.5 rounded-full font-mono text-[10px] font-bold">
                                    {rec.tipe}
                                  </span>
                                </div>
                              </div>
                              <h3 className="font-display text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-sm">
                                {rec.judul}
                              </h3>
                              <p className="mt-1 font-mono text-xs font-bold text-sky flex items-center gap-1.5">
                                {rec.perusahaan}
                              </p>
                              <p className="mt-3 text-xs text-white/85 line-clamp-2 leading-relaxed font-medium">
                                {rec.deskripsi}
                              </p>
                              {rec.tags && rec.tags.length > 0 && (
                                <div className="mt-3.5 flex flex-wrap gap-1.5">
                                  {rec.tags.slice(0, 4).map((tag) => (
                                    <span
                                      key={tag}
                                      className="rounded-md bg-white/10 px-2.5 py-0.5 font-mono text-[10px] text-white/90 border border-white/10"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="mt-5 pt-3.5 border-t border-white/15 flex items-center justify-between gap-3">
                              <span className="font-mono text-xs text-white/70 truncate">
                                {rec.lokasi} &bull; Batas: {rec.batasWaktu}
                              </span>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setDetailTarget(rec)}
                                  className="rounded-xl border border-white/30 px-3.5 py-1.5 font-mono text-xs font-bold text-white hover:bg-white/10 transition"
                                >
                                  Detail
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setApplyTarget(rec)}
                                  className="rounded-xl bg-sky px-5 py-1.5 font-mono text-xs font-extrabold text-ocean hover:bg-white transition shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center text-center"
                                >
                                  Ajukan
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col gap-2 h-full justify-between">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-[10px] font-mono text-white/60">
                                <span>{isPrev ? "← Sebelumnya" : "Selanjutnya →"}</span>
                                <span className="text-sky/80 font-bold">
                                  {rec.match.scorePercent}%
                                </span>
                              </div>
                              <h4 className="font-display text-sm font-bold text-white line-clamp-3 leading-snug">
                                {rec.judul}
                              </h4>
                              <p className="text-[11px] font-mono text-sky/80 truncate">
                                {rec.perusahaan}
                              </p>
                            </div>
                            <p className="text-[10px] text-white/50 line-clamp-3 leading-relaxed">
                              {rec.deskripsi}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </section>

        {/* ═══════ CATALOG LIST — semua kolaborasi, tetap tampil skor, tanpa filter threshold ═══════ */}
        <section className="space-y-6 pt-2">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border pb-6">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Cari judul, perusahaan, skill (Next.js, Figma, Python)..."
                className="w-full rounded-full border border-border bg-card px-4 py-3 text-sm text-ink outline-none transition focus:border-primary/40 shadow-sm font-medium"
              />
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              {(["Semua", "Akademik", "Magang"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => handleTipeChange(t)}
                  className={`rounded-full px-4 py-2 font-bold transition duration-200 border ${
                    tipeFilter === t
                      ? "bg-primary text-white shadow-sm border-primary"
                      : "bg-card border-border text-steel hover:border-primary/40 hover:text-ink"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-surface p-5 h-64 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <motion.div
              layout
              key={`${tipeFilter}-${search}-${currentPage}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {paginatedItems.map((k, index) => (
                  <motion.div
                    layout
                    key={k.id}
                    initial={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    viewport={{ once: false, margin: "-20px" }}
                    transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md flex flex-col justify-between group"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-sky font-mono text-xs font-bold shrink-0">
                            {initials(k.perusahaan)}
                          </div>
                          <div className="min-w-0">
                            <span className="font-mono text-xs font-bold text-ink truncate block max-w-[110px]">
                              {k.perusahaan}
                            </span>
                            {mahasiswaProfile && (
                              <div className="text-[10px] font-mono font-bold text-emerald-700">
                                {k.match.scorePercent}% Match
                              </div>
                            )}
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-extrabold shrink-0 ${
                            k.tipe === "Akademik"
                              ? "bg-slate-100 text-slate-800 border border-slate-300"
                              : "bg-primary/10 text-primary border border-primary/20 font-black"
                          }`}
                        >
                          {k.tipe}
                        </span>
                      </div>
                      <h3 className="mt-3.5 font-display text-lg font-semibold text-ink leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2">
                        {k.judul}
                      </h3>
                      <p className="mt-2 text-xs font-medium text-steel line-clamp-3 leading-relaxed">
                        {k.deskripsi}
                      </p>
                      {k.tags && k.tags.length > 0 && (
                        <div className="mt-3.5 flex flex-wrap gap-1.5">
                          {k.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-slate-100/80 border border-slate-200 px-2 py-0.5 font-mono text-[10px] text-steel font-bold"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mt-5 pt-3.5 border-t border-steel/15">
                      <div className="flex items-center justify-between font-mono text-[11px] text-steel font-semibold mb-3.5">
                        <span className="truncate">{k.lokasi}</span>
                        <span className="shrink-0">Batas: {k.batasWaktu}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setDetailTarget(k)}
                          className="flex-1 rounded-full border border-border py-2 text-center font-mono text-xs font-bold text-ink transition hover:bg-surface"
                        >
                          Detail
                        </button>
                        <button
                          type="button"
                          onClick={() => setApplyTarget(k)}
                          className="flex-1 rounded-full bg-primary py-2 text-center font-mono text-xs font-bold text-white transition hover:brightness-110 shadow-sm flex items-center justify-center"
                        >
                          Ajukan
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {paginatedItems.length === 0 && !loading && (
                <div className="col-span-3 py-16 text-center rounded-2xl border-2 border-dashed border-border bg-surface">
                  <p className="font-display text-lg font-bold text-ink">
                    Tidak ada kolaborasi yang cocok
                  </p>
                  <p className="mt-1 text-xs text-steel font-medium">
                    Coba ubah kata kunci pencarian atau sesuaikan filter kategori kamu.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* ═══════ PAGINATION ═══════ */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4 pb-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-9 w-9 rounded-full border border-border bg-card font-mono text-sm font-bold text-ink transition hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 w-9 rounded-full border font-mono text-sm font-bold transition shadow-sm ${
                    page === currentPage
                      ? "border-primary bg-primary text-white shadow-md"
                      : "border-border bg-card text-ink hover:border-primary/40 hover:bg-surface"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-9 w-9 rounded-full border border-border bg-card font-mono text-sm font-bold text-ink transition hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
              >
                →
              </button>
            </div>
          )}
        </section>
      </div>

      {detailTarget && (
        <DetailModal
          data={detailTarget}
          onClose={() => setDetailTarget(null)}
          onAjukan={() => {
            setApplyTarget(detailTarget);
            setDetailTarget(null);
          }}
        />
      )}

      {applyTarget && applicantProfile && (
        <ApplyModal
          data={applyTarget as any}
          user={applicantProfile}
          onClose={() => setApplyTarget(null)}
          onSuccess={handleApplySuccess}
        />
      )}
    </main>
  );
}