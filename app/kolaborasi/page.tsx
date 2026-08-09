"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { dummyKolaborasi, Kolaborasi } from "@/lib/dummy-data";
import { Navbar } from "@/components/Navbar";
import { ApplyModal } from "@/components/ApplyModal";

type StoredUser = {
  nama: string;
  universitas: string;
  prodi: string;
};

export default function KolaborasiPage() {
  const [kolaborasiList, setKolaborasiList] = useState<Kolaborasi[]>([]);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [search, setSearch] = useState("");
  const [tipeFilter, setTipeFilter] = useState<"Semua" | "Akademik" | "Magang">("Semua");
  const [kategoriFilter, setKategoriFilter] = useState<string>("Semua");

  // State modal pengajuan — item yang lagi diajukan (null = modal tertutup)
  const [applyTarget, setApplyTarget] = useState<Kolaborasi | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    // Hydrate user
    const storedUser = localStorage.getItem("bridgeu_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      queueMicrotask(() => setUser(parsedUser));
    } else {
      queueMicrotask(() =>
        setUser({
          nama: "John Doe",
          universitas: "Universitas Multimedia Nusantara",
          prodi: "Sistem Informasi",
        })
      );
    }

    // Hydrate Kolaborasi List
    const storedKolaborasi = localStorage.getItem("bridgeu_kolaborasi_list");
    if (storedKolaborasi) {
      const parsedKolaborasi: Kolaborasi[] = JSON.parse(storedKolaborasi);
      const activeList = parsedKolaborasi.filter((item) => item.statusModerasi !== "Ditolak");
      queueMicrotask(() => setKolaborasiList(activeList));
    } else {
      queueMicrotask(() => setKolaborasiList(dummyKolaborasi));
    }
  }, []);

  const displayList = kolaborasiList.length > 0 ? kolaborasiList : dummyKolaborasi;

  // Smart Recommendations (Top 3 highest match items for user's prodi)
  const smartRecommendations = useMemo(() => {
    const userProdi = user?.prodi || "Sistem Informasi";
    return [...displayList]
      .map((item) => {
        const matchesProdi = item.rekomendasiProdi?.some((p) =>
          p.toLowerCase().includes(userProdi.toLowerCase())
        );
        const baseScore = item.matchScore || 85;
        const calculatedScore = matchesProdi ? Math.min(baseScore + 5, 99) : baseScore - 10;
        return { ...item, calculatedScore };
      })
      .sort((a, b) => b.calculatedScore - a.calculatedScore)
      .slice(0, 3);
  }, [displayList, user]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(displayList.map((k) => k.kategori));
    return ["Semua", ...Array.from(set)];
  }, [displayList]);

  // Filtered List
  const filtered = useMemo(() => {
    return displayList.filter((k) => {
      const matchSearch =
        k.judul.toLowerCase().includes(search.toLowerCase()) ||
        k.perusahaan.toLowerCase().includes(search.toLowerCase()) ||
        k.kategori.toLowerCase().includes(search.toLowerCase()) ||
        (k.tags && k.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())));

      const matchTipe = tipeFilter === "Semua" || k.tipe === tipeFilter;
      const matchKategori = kategoriFilter === "Semua" || k.kategori === kategoriFilter;

      return matchSearch && matchTipe && matchKategori;
    });
  }, [displayList, search, tipeFilter, kategoriFilter]);

  const handleApplySuccess = () => {
    setApplyTarget(null);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  return (
    <main className="min-h-screen bg-paper pb-20">
      {/* NAVBAR */}
      <Navbar />

      {/* TOAST SUKSES */}
      {successToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[70] rounded-xl bg-ink px-5 py-3 text-xs font-semibold text-paper shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          Pengajuan berhasil dikirim!
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-8">
        {/* Header Hero */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-bridge-gold/20 px-3.5 py-1 text-xs font-semibold text-ink border border-bridge-gold/30">
              <span>✨ Smart Recommendation Engine Active</span>
            </div>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink">
              Peluang Kolaborasi & Magang
            </h1>
            <p className="mt-2 text-sm text-steel max-w-2xl leading-relaxed">
              Jelajahi proyek riset studi kasus akademik dan kesempatan magang dari perusahaan mitra terverifikasi, direkomendasikan secara pintar sesuai dengan profil latar belakang kamu.
            </p>
          </div>
        </div>

        {/* SECTION SMART RECOMMENDATION AI */}
        <section className="mt-4 rounded-3xl bg-ink p-6 sm:p-8 text-paper shadow-xl border border-bridge-gold/30 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 h-56 w-56 rounded-full bg-bridge-gold/15 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs text-bridge-gold font-semibold uppercase tracking-wider">
                <span className="flex h-2 w-2 rounded-full bg-bridge-gold animate-ping" />
                Rekomendasi Pintar AI Khusus {user ? user.nama.split(" ")[0] : "Kamu"}
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-[11px] text-paper/70">
                Latar Belakang: {user?.prodi || "Sistem Informasi"}
              </span>
            </div>

            <p className="mt-1 font-display text-xl font-bold text-paper">
              Peluang Paling Cocok dengan Spesialisasi &amp; Program Studi Anda
            </p>

            {/* Smart Cards */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {smartRecommendations.map((item) => (
                <div
                  key={`smart-${item.id}`}
                  className="group rounded-2xl bg-white/10 p-5 border border-white/15 hover:border-bridge-gold transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-bridge-gold px-2.5 py-0.5 font-mono text-[10px] font-bold text-ink shadow-sm">
                        ⚡ {item.calculatedScore}% Match
                      </span>
                      <span className="font-mono text-[11px] text-paper/70">
                        {item.tipe}
                      </span>
                    </div>

                    <h3 className="mt-3 font-display text-base font-bold text-paper leading-snug group-hover:text-bridge-gold transition">
                      {item.judul}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-bridge-gold/90">
                      {item.perusahaan}
                    </p>

                    {item.tags && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-[10px] text-paper/80"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-paper/60 truncate">
                      📍 {item.lokasi}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link
                        href={`/kolaborasi/${item.id}`}
                        className="rounded-full border border-white/20 px-3 py-1.5 font-mono text-[11px] font-semibold text-paper/90 hover:bg-white/10 transition"
                      >
                        Detail
                      </Link>
                      <button
                        type="button"
                        onClick={() => setApplyTarget(item)}
                        className="rounded-full bg-bridge-gold px-4 py-1.5 font-mono text-xs font-bold text-ink hover:bg-white transition"
                      >
                        Ajukan →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEARCH & CATEGORY FILTERS */}
        <section className="mt-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-steel/15 pb-6">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul, perusahaan, skill (misal: Next.js, Figma, SQL)..."
                className="w-full rounded-2xl border border-steel/25 bg-white/70 px-4 py-3 text-sm text-ink outline-none transition focus:border-ink shadow-sm"
              />
            </div>

            {/* Tipe Filter Buttons */}
            <div className="flex items-center gap-2 font-mono text-xs">
              {(["Semua", "Akademik", "Magang"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTipeFilter(t)}
                  className={`rounded-full px-4 py-2 font-medium transition ${
                    tipeFilter === t
                      ? "bg-ink text-paper shadow-sm"
                      : "bg-white/60 border border-steel/25 text-steel hover:border-ink hover:text-ink"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Kategori Pills */}
          <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
            {categories.map((kat) => (
              <button
                key={kat}
                onClick={() => setKategoriFilter(kat)}
                className={`rounded-full px-3.5 py-1.5 transition ${
                  kategoriFilter === kat
                    ? "bg-bridge-gold text-ink font-bold shadow-sm"
                    : "bg-white/40 text-steel border border-steel/20 hover:border-steel hover:text-ink"
                }`}
              >
                {kat}
              </button>
            ))}
          </div>
        </section>

        {/* GRID DAFTAR KOLABORASI */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((k) => (
            <div
              key={k.id}
              className="rounded-3xl border border-steel/15 bg-white/70 p-6 shadow-sm transition hover:shadow-md hover:border-bridge-gold/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-ink bg-steel/10 px-3 py-1 rounded-full">
                      {k.perusahaan}
                    </span>
                    {k.matchScore && (
                      <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        ⚡ {k.matchScore}% Match
                      </span>
                    )}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 font-mono text-[11px] font-semibold ${
                      k.tipe === "Akademik"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-bridge-gold/20 text-ink border border-bridge-gold/30"
                    }`}
                  >
                    {k.tipe}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-xl font-bold text-ink leading-snug">
                  {k.judul}
                </h3>
                <p className="mt-2 text-xs text-steel line-clamp-3 leading-relaxed">
                  {k.deskripsi}
                </p>

                {k.tags && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {k.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-steel/10 px-2.5 py-1 font-mono text-[11px] text-steel font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-steel/10">
                <div className="flex items-center justify-between font-mono text-xs text-steel mb-4">
                  <div className="flex items-center gap-3">
                    <span>📍 {k.lokasi}</span>
                    <span>📅 Batas: {k.batasWaktu}</span>
                  </div>
                  {k.gajiStipend && (
                    <span className="font-semibold text-emerald-700">{k.gajiStipend}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/kolaborasi/${k.id}`}
                    className="flex-1 rounded-2xl border border-steel/25 py-3 text-center font-mono text-xs font-semibold text-ink transition hover:bg-steel/5"
                  >
                    Lihat Detail
                  </Link>
                  <button
                    type="button"
                    onClick={() => setApplyTarget(k)}
                    className="flex-1 rounded-2xl bg-ink py-3 text-center font-mono text-xs font-semibold text-paper transition hover:bg-steel shadow-md"
                  >
                    Ajukan →
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-2 py-16 text-center rounded-3xl border border-dashed border-steel/30 bg-white/40">
              <p className="font-display text-lg font-semibold text-ink">
                Tidak ada kolaborasi yang cocok
              </p>
              <p className="mt-1 text-sm text-steel">
                Coba ubah kata kunci pencarian atau sesuaikan filter kategori Anda.
              </p>
            </div>
          )}
        </div>
      </div>

      {applyTarget && user && (
        <ApplyModal
          data={applyTarget}
          user={user}
          onClose={() => setApplyTarget(null)}
          onSuccess={handleApplySuccess}
        />
      )}
    </main>
  );
}