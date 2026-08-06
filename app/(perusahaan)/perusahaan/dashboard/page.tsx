"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { dummyKolaborasi, dummyPelamarList, Kolaborasi, Pelamar } from "@/lib/dummy-data";

type StoredCompany = {
  nama: string;
  industri: string;
  email: string;
};

export default function CompanyDashboardPage() {
  const [company, setCompany] = useState<StoredCompany | null>(null);
  const [kolaborasiList, setKolaborasiList] = useState<Kolaborasi[]>([]);
  const [pelamarList, setPelamarList] = useState<Pelamar[]>([]);

  useEffect(() => {
    // Hydrate Company
    const storedCompany = localStorage.getItem("bridgeu_company");
    if (storedCompany) {
      const parsed = JSON.parse(storedCompany);
      queueMicrotask(() => setCompany(parsed));
    } else {
      queueMicrotask(() =>
        setCompany({
          nama: "Nexora Digital",
          industri: "Teknologi & Produk Digital",
          email: "perusahaan@nexora.com",
        })
      );
    }

    // Hydrate Published Collaborations
    const storedKolaborasi = localStorage.getItem("bridgeu_company_kolaborasi");
    if (storedKolaborasi) {
      const parsed = JSON.parse(storedKolaborasi);
      queueMicrotask(() => setKolaborasiList(parsed));
    } else {
      // Default to company's dummy items
      const nexoraItems = dummyKolaborasi.filter(
        (k) => k.perusahaan.toLowerCase().includes("nexora") || k.id === "1"
      );
      queueMicrotask(() => setKolaborasiList(nexoraItems));
    }

    // Hydrate Applicants
    const storedPelamar = localStorage.getItem("bridgeu_pelamar_list");
    if (storedPelamar) {
      const parsed = JSON.parse(storedPelamar);
      queueMicrotask(() => setPelamarList(parsed));
    } else {
      queueMicrotask(() => setPelamarList(dummyPelamarList));
    }
  }, []);

  const companyName = company?.nama || "Nexora Digital";
  const myKolaborasi = kolaborasiList.length > 0 ? kolaborasiList : dummyKolaborasi.filter((k) => k.perusahaan === companyName || k.id === "1");
  const totalPelamar = pelamarList.length;
  const MenungguReview = pelamarList.filter((p) => p.status === "Menunggu").length;
  const Diterima = pelamarList.filter((p) => p.status === "Diterima").length;

  const handleDeleteKolaborasi = (id: string) => {
    const updated = myKolaborasi.filter((k) => k.id !== id);
    setKolaborasiList(updated);
    localStorage.setItem("bridgeu_company_kolaborasi", JSON.stringify(updated));
  };

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-ink p-8 sm:p-10 text-paper shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-bridge-gold/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-bridge-gold/20 px-3 py-1 font-mono text-xs font-semibold text-bridge-gold border border-bridge-gold/30">
                Portal Perusahaan Mitra
              </span>
              <span className="font-mono text-xs text-paper/60">
                {company?.industri || "Teknologi & Produk Digital"}
              </span>
            </div>

            <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Selamat Datang, <span className="text-bridge-gold">{companyName}</span>
            </h1>
            <p className="mt-2 text-paper/70 max-w-xl text-sm leading-relaxed">
              Buka peluang kolaborasi riset akademik dan magang untuk terhubung dengan mahasiswa berbakat dari berbagai universitas di Indonesia.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/perusahaan/buat-kolaborasi"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-bridge-gold px-6 py-3.5 font-medium text-ink transition hover:bg-bridge-gold/90 shadow-lg shadow-bridge-gold/20 text-sm font-semibold"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              + Buka Peluang Baru
            </Link>
            <Link
              href="/perusahaan/pelamar"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 font-mono text-xs font-medium text-paper transition hover:bg-white/10"
            >
              Kelola Pelamar ({MenungguReview})
            </Link>
          </div>
        </div>

        {/* Ringkasan Statistik */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 pt-8">
          <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
            <p className="font-mono text-xs text-paper/60 uppercase tracking-wider">Total Peluang</p>
            <p className="mt-1 font-display text-3xl font-bold text-paper">{myKolaborasi.length}</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
            <p className="font-mono text-xs text-paper/60 uppercase tracking-wider">Total Pelamar</p>
            <p className="mt-1 font-display text-3xl font-bold text-bridge-gold">{totalPelamar}</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
            <p className="font-mono text-xs text-paper/60 uppercase tracking-wider">Menunggu Review</p>
            <p className="mt-1 font-display text-3xl font-bold text-yellow-400">{MenungguReview}</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
            <p className="font-mono text-xs text-paper/60 uppercase tracking-wider">Diterima</p>
            <p className="mt-1 font-display text-3xl font-bold text-emerald-400">{Diterima}</p>
          </div>
        </div>
      </div>

      {/* Section Peluang Kolaborasi Aktif */}
      <section className="mt-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">
              Peluang Kolaborasi Aktif
            </h2>
            <p className="font-mono text-xs text-steel mt-0.5">
              Daftar proyek dan posisi magang yang telah Anda publikasikan
            </p>
          </div>

          <Link
            href="/perusahaan/buat-kolaborasi"
            className="font-mono text-xs text-bridge-gold font-medium hover:underline"
          >
            + Tambah Baru
          </Link>
        </div>

        {myKolaborasi.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-steel/30 bg-white/40 p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-bridge-gold/20 text-bridge-gold">
              💼
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-ink">Belum Ada Peluang Dipublikasikan</h3>
            <p className="mt-1 text-sm text-steel">Mulai buat proyek kolaborasi akademik atau magang pertama Anda.</p>
            <Link
              href="/perusahaan/buat-kolaborasi"
              className="mt-6 inline-block rounded-full bg-ink px-6 py-2.5 font-mono text-xs font-medium text-paper transition hover:bg-steel"
            >
              Buat Kolaborasi Baru
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {myKolaborasi.map((item) => {
              const pelamarCount = pelamarList.filter((p) => p.kolaborasiId === item.id || item.id === "1").length;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-steel/15 bg-white/60 p-6 shadow-sm transition hover:shadow-md hover:border-bridge-gold/40 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-steel/10 px-3 py-1 font-mono text-[11px] font-medium text-steel">
                        {item.kategori}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 font-mono text-[11px] font-semibold ${
                          item.tipe === "Akademik"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {item.tipe}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-lg font-bold text-ink leading-snug">
                      {item.judul}
                    </h3>
                    <p className="mt-2 text-xs text-steel line-clamp-2 leading-relaxed">
                      {item.deskripsi}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-steel/10 flex items-center justify-between font-mono text-xs text-steel">
                    <div className="flex items-center gap-3">
                      <span>📍 {item.lokasi}</span>
                      <span>📅 s.d {item.batasWaktu}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href="/perusahaan/pelamar"
                        className="rounded-full bg-ink/10 px-3 py-1.5 font-medium text-ink hover:bg-ink hover:text-paper transition"
                      >
                        Pelamar ({pelamarCount})
                      </Link>
                      <button
                        onClick={() => handleDeleteKolaborasi(item.id)}
                        className="rounded-full bg-red-50 p-1.5 text-red-500 hover:bg-red-100 transition"
                        title="Hapus Kolaborasi"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
