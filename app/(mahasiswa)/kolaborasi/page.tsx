"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Kolaborasi } from "@/lib/dummy-data";
import { ApplyModal } from "@/components/ApplyModal";

type StoredUser = {
  nama: string;
  universitas: string;
  prodi: string;
};

function initials(name: string) {
  if (!name) return "PT";
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

/** Map raw Supabase kolaborasi row → Kolaborasi type used by the UI */
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
          day: "numeric", month: "long", year: "numeric",
        })
      : "-",
    statusModerasi: row.status_moderasi === "Disetujui" ? "Disetujui"
      : row.status_moderasi === "Ditolak" ? "Ditolak" : "Menunggu",
    tags: row.kolaborasi_skills
      ? row.kolaborasi_skills.map((ks: any) => ks.skills?.nama_skill).filter(Boolean)
      : [],
    matchScore: 85,
    tingkatKesulitan:
      row.tingkat_kesulitan === "Pemula" ? "Pemula"
      : row.tingkat_kesulitan === "Lanjutan" ? "Lanjutan"
      : "Menengah",
    rekomendasiProdi: row.kolaborasi_target_prodi
      ? row.kolaborasi_target_prodi.map((kp: any) => kp.program_studi?.nama_prodi).filter(Boolean)
      : [],
    gajiStipend: row.gaji_stipend ?? undefined,
    kuota: row.kuota ?? 0,
    kuotaTerisi: row.kuota_terisi ?? 0,
    statusPublikasi: "Terbit",
  };
}

async function fetchKolaborasiFromSupabase(): Promise<Kolaborasi[]> {
  const { data, error } = await supabase
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
    .eq("status_moderasi", "Disetujui")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal memuat kolaborasi dari Supabase:", error.message);
    return [];
  }

  return (data ?? []).map(mapDbRow);
}

export default function KolaborasiPage() {
  const [kolaborasiList, setKolaborasiList] = useState<Kolaborasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [search, setSearch] = useState("");
  const [tipeFilter, setTipeFilter] = useState<"Semua" | "Akademik" | "Magang">("Semua");
  const [kategoriFilter, setKategoriFilter] = useState<string>("Semua");
  const [applyTarget, setApplyTarget] = useState<Kolaborasi | null>(null);
  const [successToast, setSuccessToast] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (carouselRef.current) {
        setContainerW(carouselRef.current.offsetWidth);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    // Load user profile from localStorage / API
    const storedUser = localStorage.getItem("bridgeu_user");
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch (e) { console.error(e); }
    }

    // Fetch kolaborasi from Supabase
    fetchKolaborasiFromSupabase().then((rows) => {
      setKolaborasiList(rows);
      setLoading(false);
    });
  }, []);

  const kolaborasiWithScores = useMemo(() => {
    const userProdi = user?.prodi || "Sistem Informasi";
    return kolaborasiList.map((item) => {
      const matchesProdi = item.rekomendasiProdi?.some((p) =>
        p.toLowerCase().includes(userProdi.toLowerCase())
      );
      const baseScore = 85;
      const matchScore = matchesProdi ? Math.min(baseScore + 5, 99) : baseScore - 10;
      return { ...item, matchScore };
    });
  }, [kolaborasiList, user]);

  const smartRecommendations = useMemo(() => {
    return [...kolaborasiWithScores]
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 4);
  }, [kolaborasiWithScores]);

  const totalRecs = smartRecommendations.length;

  useEffect(() => {
    if (isPaused || totalRecs === 0) return;
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % totalRecs);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, totalRecs]);

  const categories = useMemo(() => {
    const set = new Set(kolaborasiWithScores.map((k) => k.kategori));
    return ["Semua", ...Array.from(set)];
  }, [kolaborasiWithScores]);

  const filtered = useMemo(() => {
    return kolaborasiWithScores.filter((k) => {
      const matchSearch =
        k.judul.toLowerCase().includes(search.toLowerCase()) ||
        k.perusahaan.toLowerCase().includes(search.toLowerCase()) ||
        k.kategori.toLowerCase().includes(search.toLowerCase()) ||
        (k.tags && k.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())));
      const matchTipe = tipeFilter === "Semua" || k.tipe === tipeFilter;
      const matchKategori = kategoriFilter === "Semua" || k.kategori === kategoriFilter;
      return matchSearch && matchTipe && matchKategori;
    });
  }, [kolaborasiWithScores, search, tipeFilter, kategoriFilter]);

  const handleApplySuccess = () => {
    setApplyTarget(null);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  const nextCarousel = () => setCarouselIndex((prev) => (prev + 1) % totalRecs);
  const prevCarousel = () => setCarouselIndex((prev) => (prev - 1 + totalRecs) % totalRecs);

  const GAP = 16;
  const centerW = containerW > 0 ? Math.floor(containerW * 0.50) - GAP : 400;
  const sideW   = containerW > 0 ? Math.floor(containerW * 0.25) - GAP : 180;
  const slotW = sideW;
  const trackOffset = containerW > 0
    ? (containerW - centerW) / 2 - carouselIndex * (slotW + GAP)
    : 0;

  return (
    <main className="min-h-screen bg-paper pb-24 font-sans text-ink">
      <div className="w-full bg-paper">
        <div className="relative w-full bg-gradient-to-b from-ink via-ink/90 to-paper pt-10 pb-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-4 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-bridge-gold/20 px-3.5 py-1 text-xs font-mono font-bold text-bridge-gold border border-bridge-gold/40 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-bridge-gold animate-ping" />
              SMART RECOMMENDATION ENGINE ACTIVE
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
              Peluang Kolaborasi &amp; Magang
            </h1>
            <p className="text-sm text-paper/80 max-w-2xl leading-relaxed">
              Jelajahi studi kasus akademik &amp; posisi magang dari perusahaan mitra terverifikasi, direkomendasikan secara pintar sesuai dengan profil latar belakang kamu.
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-20 left-1/2 z-[70] rounded-2xl bg-ink border-2 border-bridge-gold px-6 py-3 text-xs font-mono font-bold text-bridge-gold shadow-2xl flex items-center gap-2"
          >
            Pengajuan kolaborasi berhasil dikirim!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8 -mt-2 relative z-20">

        {/* ═══════ CAROUSEL ═══════ */}
        <section
          className="rounded-3xl bg-ink p-5 sm:p-7 text-paper shadow-2xl border-2 border-bridge-gold/40 relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-bridge-gold/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -top-12 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-5 relative z-20">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-bridge-gold/20 text-bridge-gold text-xs font-bold">AI</span>
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-bridge-gold font-bold uppercase tracking-wider">
                  <span>AI Smart Match Showcase</span>
                  {isPaused && (
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-paper/70 font-normal">Paused</span>
                  )}
                </div>
                <h2 className="font-display text-base sm:text-xl font-extrabold text-paper mt-0.5">
                  Rekomendasi Utama Spesialisasi {user?.prodi || "Sistem Informasi"}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-bridge-gold font-bold bg-white/10 px-3 py-1 rounded-full border border-white/10">
                <span>0{carouselIndex + 1}</span>
                <span className="text-paper/40">/</span>
                <span className="text-paper/60">0{totalRecs}</span>
              </div>
              <button onClick={prevCarousel} className="h-9 w-9 rounded-full border border-white/20 bg-white/10 hover:bg-bridge-gold hover:text-ink text-paper font-mono font-bold text-xs flex items-center justify-center transition hover:scale-105 active:scale-95">←</button>
              <button onClick={nextCarousel} className="h-9 w-9 rounded-full border border-white/20 bg-white/10 hover:bg-bridge-gold hover:text-ink text-paper font-mono font-bold text-xs flex items-center justify-center transition hover:scale-105 active:scale-95">→</button>
            </div>
          </div>

          {/* Viewport + Track */}
          <div ref={carouselRef} className="relative overflow-hidden" style={{ minHeight: 240 }}>
            {loading ? (
              <div className="flex items-center justify-center h-48 text-paper/50 font-mono text-sm">
                Memuat rekomendasi...
              </div>
            ) : totalRecs === 0 ? (
              <div className="flex items-center justify-center h-48 text-paper/50 font-mono text-sm">
                Belum ada kolaborasi yang tersedia saat ini.
              </div>
            ) : (
              containerW > 0 && (
                <motion.div
                  className="flex items-center"
                  animate={{ x: trackOffset }}
                  transition={{ type: "spring", stiffness: 300, damping: 35, mass: 0.8 }}
                  style={{ gap: GAP, willChange: "transform" }}
                >
                  {smartRecommendations.map((rec, i) => {
                    const isActive = i === carouselIndex;
                    const isPrev   = i === (carouselIndex - 1 + totalRecs) % totalRecs;
                    const isNext   = i === (carouselIndex + 1) % totalRecs;
                    const isVisible = isActive || isPrev || isNext;

                    return (
                      <motion.div
                        key={rec.id}
                        onClick={() => {
                          if (isPrev) prevCarousel();
                          else if (isNext) nextCarousel();
                        }}
                        animate={{
                          width: isActive ? centerW : sideW,
                          opacity: isActive ? 1 : isVisible ? 0.55 : 0.2,
                          scale: isActive ? 1 : 0.93,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 35, mass: 0.8 }}
                        className={`flex-shrink-0 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden
                          ${isActive
                            ? "border-2 border-bridge-gold/80 bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl shadow-[0_0_35px_rgba(201,168,76,0.3)] cursor-default"
                            : "border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                          }`}
                        style={{ minHeight: isActive ? 220 : 180 }}
                      >
                        {isActive && (
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-bridge-gold to-transparent" />
                        )}

                        {isActive ? (
                          <>
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <span className="rounded-full bg-bridge-gold px-3.5 py-1 font-mono text-xs font-black text-ink shadow-md flex items-center gap-1">
                                  {rec.matchScore}% Match
                                </span>
                                <div className="flex items-center gap-2">
                                  {rec.rekomendasiProdi && rec.rekomendasiProdi.length > 0 && (
                                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-0.5 rounded-full font-mono text-[10px] font-bold">
                                      Sesuai Prodi
                                    </span>
                                  )}
                                  <span className="bg-white/10 text-paper/80 border border-white/10 px-3 py-0.5 rounded-full font-mono text-[10px] font-bold">
                                    {rec.tipe}
                                  </span>
                                </div>
                              </div>
                              <h3 className="font-display text-xl sm:text-2xl font-black text-paper leading-tight drop-shadow-sm">
                                {rec.judul}
                              </h3>
                              <p className="mt-1 font-mono text-xs font-bold text-bridge-gold flex items-center gap-1.5">
                                {rec.perusahaan}
                              </p>
                              <p className="mt-3 text-xs text-paper/85 line-clamp-2 leading-relaxed font-medium">
                                {rec.deskripsi}
                              </p>
                              {rec.tags && rec.tags.length > 0 && (
                                <div className="mt-3.5 flex flex-wrap gap-1.5">
                                  {rec.tags.slice(0, 4).map((tag) => (
                                    <span key={tag} className="rounded-md bg-white/10 px-2.5 py-0.5 font-mono text-[10px] text-paper/90 border border-white/10">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="mt-5 pt-3.5 border-t border-white/15 flex items-center justify-between gap-3">
                              <span className="font-mono text-xs text-paper/70 truncate">
                                {rec.lokasi} &bull; Batas: {rec.batasWaktu}
                              </span>
                              <div className="flex items-center gap-2 shrink-0">
                                <Link
                                  href={`/kolaborasi/${rec.id}`}
                                  className="rounded-xl border border-white/30 px-3.5 py-1.5 font-mono text-xs font-bold text-paper hover:bg-white/10 transition"
                                >
                                  Detail
                                </Link>
                                <Link
                                  href={`/kolaborasi/${rec.id}`}
                                  className="rounded-xl bg-bridge-gold px-5 py-1.5 font-mono text-xs font-extrabold text-ink hover:bg-white transition shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center text-center"
                                >
                                  Ajukan
                                </Link>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col gap-2 h-full justify-between">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-[10px] font-mono text-paper/60">
                                <span>{isPrev ? "Sebelumnya" : "Selanjutnya"}</span>
                                <span className="text-bridge-gold/80 font-bold">{rec.matchScore}%</span>
                              </div>
                              <h4 className="font-display text-sm font-bold text-paper line-clamp-3 leading-snug">
                                {rec.judul}
                              </h4>
                              <p className="text-[11px] font-mono text-bridge-gold/80 truncate">
                                {rec.perusahaan}
                              </p>
                            </div>
                            <p className="text-[10px] text-paper/50 line-clamp-3 leading-relaxed">
                              {rec.deskripsi}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              )
            )}
          </div>
        </section>

        {/* ═══════ CATALOG LIST ═══════ */}
        <section className="space-y-6 pt-2">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b-2 border-steel/15 pb-6">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul, perusahaan, skill (Next.js, Figma, Python)..."
                className="w-full rounded-2xl border-2 border-steel/20 bg-white/80 backdrop-blur-md px-4 py-3 text-sm text-ink outline-none transition focus:border-ink shadow-sm font-medium"
              />
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              {(["Semua", "Akademik", "Magang"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTipeFilter(t)}
                  className={`rounded-xl px-4 py-2 font-bold transition duration-200 shadow-sm ${
                    tipeFilter === t
                      ? "bg-ink text-paper shadow-md border-2 border-ink"
                      : "bg-white/80 backdrop-blur-md border-2 border-steel/20 text-steel hover:border-ink hover:text-ink"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2 font-mono text-xs">
              {categories.map((kat) => (
                <button
                  key={kat}
                  onClick={() => setKategoriFilter(kat)}
                  className={`rounded-xl px-3.5 py-1.5 font-semibold transition duration-200 ${
                    kategoriFilter === kat
                      ? "bg-bridge-gold text-ink font-extrabold shadow-md border-2 border-bridge-gold"
                      : "bg-white/70 backdrop-blur-md text-steel border border-steel/20 hover:border-steel hover:text-ink"
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>
            <span className="font-mono text-xs text-steel font-bold shrink-0">
              Menampilkan {filtered.length} Peluang
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-3xl border-2 border-steel/15 bg-white/60 p-5 h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              layout
              key={`${tipeFilter}-${kategoriFilter}-${search}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((k, index) => (
                  <motion.div
                    layout
                    key={k.id}
                    initial={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    viewport={{ once: false, margin: "-20px" }}
                    transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="relative overflow-hidden rounded-3xl border-2 border-steel/15 bg-white/90 backdrop-blur-xl p-5 shadow-lg transition-all duration-300 hover:border-bridge-gold hover:shadow-[0_12px_36px_-8px_rgba(201,168,76,0.3)] flex flex-col justify-between group"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-bridge-gold to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-bridge-gold font-mono text-xs font-bold border border-bridge-gold/30 shrink-0">
                            {initials(k.perusahaan)}
                          </div>
                          <div className="min-w-0">
                            <span className="font-mono text-xs font-bold text-ink truncate block max-w-[110px]">{k.perusahaan}</span>
                            {k.matchScore && <div className="text-[10px] font-mono font-bold text-emerald-700">{k.matchScore}% Match</div>}
                          </div>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-extrabold shrink-0 ${k.tipe === "Akademik" ? "bg-slate-100 text-slate-800 border border-slate-300" : "bg-bridge-gold text-ink font-black"}`}>
                          {k.tipe}
                        </span>
                      </div>
                      <h3 className="mt-3.5 font-display text-lg font-bold text-ink leading-snug group-hover:text-bridge-gold transition-colors duration-200 line-clamp-2">
                        {k.judul}
                      </h3>
                      <p className="mt-2 text-xs font-medium text-steel line-clamp-3 leading-relaxed">{k.deskripsi}</p>
                      {k.tags && k.tags.length > 0 && (
                        <div className="mt-3.5 flex flex-wrap gap-1.5">
                          {k.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="rounded-md bg-slate-100/80 border border-slate-200 px-2 py-0.5 font-mono text-[10px] text-steel font-bold">#{tag}</span>
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
                        <Link href={`/kolaborasi/${k.id}`} className="flex-1 rounded-xl border-2 border-steel/20 py-2 text-center font-mono text-xs font-bold text-ink transition hover:bg-slate-50">
                          Detail
                        </Link>
                        <Link href={`/kolaborasi/${k.id}`} className="flex-1 rounded-xl bg-ink py-2 text-center font-mono text-xs font-bold text-paper transition hover:bg-steel shadow-md flex items-center justify-center">
                          Ajukan
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filtered.length === 0 && !loading && (
                <div className="col-span-3 py-16 text-center rounded-3xl border-2 border-dashed border-steel/25 bg-white/60">
                  <p className="font-display text-lg font-bold text-ink">Tidak ada kolaborasi yang cocok</p>
                  <p className="mt-1 text-xs text-steel font-medium">Coba ubah kata kunci pencarian atau sesuaikan filter kategori kamu.</p>
                </div>
              )}
            </motion.div>
          )}
        </section>
      </div>

      {applyTarget && user && (
        <ApplyModal data={applyTarget} user={user} onClose={() => setApplyTarget(null)} onSuccess={handleApplySuccess} />
      )}
    </main>
  );
}