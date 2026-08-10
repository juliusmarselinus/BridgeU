"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { dummyPelamarList, dummyKolaborasi, Kolaborasi } from "@/lib/dummy-data";

interface PelamarFlexible {
  id: string;
  kolaborasiId?: string;
  status: "Menunggu" | "Diterima" | "Ditolak" | string;
  nama?: string;
  name?: string;
  universitas?: string;
  university?: string;
  jurusan?: string;
  major?: string;
  ipk?: string | number;
  gpa?: string | number;
  catatan?: string;
  notes?: string;
  motivasi?: string;
}

interface KolaborasiWithMeta extends Omit<Kolaborasi, "statusPublikasi" | "kuota"> {
  kuota?: number;
  statusPublikasi?: string;
}

function PelamarContent() {
  const [kolaborasiList, setKolaborasiList] = useState<KolaborasiWithMeta[]>([]);
  const [pelamarList, setPelamarList] = useState<PelamarFlexible[]>([]);

  // State Modal Detail Proyek + Pelamar
  const [activeProyek, setActiveProyek] = useState<KolaborasiWithMeta | null>(null);

  // State Modal Detail Profil Pelamar Individu
  const [selectedPelamar, setSelectedPelamar] = useState<PelamarFlexible | null>(null);

  useEffect(() => {
    // 1. Load Data Proyek Kolaborasi
    const storedKolaborasi = localStorage.getItem("bridgeu_company_kolaborasi");
    if (storedKolaborasi) {
      try {
        setKolaborasiList(JSON.parse(storedKolaborasi));
      } catch (e) {
        console.error("Gagal parse kolaborasi", e);
      }
    } else {
      setKolaborasiList(dummyKolaborasi as KolaborasiWithMeta[]);
    }

    // 2. Load Data Pelamar
    const storedPelamar = localStorage.getItem("bridgeu_pelamar_list");
    if (storedPelamar) {
      try {
        setPelamarList(JSON.parse(storedPelamar));
      } catch (e) {
        console.error("Gagal parse pelamar", e);
      }
    } else {
      setPelamarList(dummyPelamarList as PelamarFlexible[]);
    }
  }, []);

  // Handler Update Status (Diterima / Ditolak)
  const handleUpdateStatus = (id: string, newStatus: "Menunggu" | "Diterima" | "Ditolak") => {
    const updated = pelamarList.map((p) => (p.id === id ? { ...p, status: newStatus } : p));
    setPelamarList(updated);
    localStorage.setItem("bridgeu_pelamar_list", JSON.stringify(updated));

    if (selectedPelamar && selectedPelamar.id === id) {
      setSelectedPelamar({ ...selectedPelamar, status: newStatus });
    }
  };

  // Helper Fallback Data Pelamar
  const getNama = (p: PelamarFlexible) => p.nama || p.name || "Pelamar Tanpa Nama";
  const getKampus = (p: PelamarFlexible) => p.universitas || p.university || "Universitas Tidak Diketahui";
  const getJurusan = (p: PelamarFlexible) => p.jurusan || p.major || "Informatika";
  const getIPK = (p: PelamarFlexible) => p.ipk || p.gpa || "3.85";
  const getCatatan = (p: PelamarFlexible) =>
    p.catatan || p.notes || p.motivasi || "Sangat tertarik berkontribusi dalam riset dan proyek ini.";

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-steel/15 pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-steel">
            <Link href="/perusahaan/dashboard" className="hover:text-ink">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-ink font-medium">Kelola Pelamar</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink">
            Proyek Kolaborasi
          </h1>
          <p className="mt-1 font-mono text-xs text-steel">
            Pilih proyek untuk melihat detail informasi serta mengelola daftar pelamar mahasiswanya.
          </p>
        </div>

        <Link
          href="/perusahaan/dashboard"
          className="self-start md:self-auto rounded-full border border-steel/20 bg-white px-5 py-2.5 font-mono text-xs font-medium text-ink hover:bg-steel/5 transition"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>

      {/* Quick Stats Summary */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-steel/15 bg-white p-4">
          <span className="font-mono text-[11px] text-steel block">Total Proyek</span>
          <strong className="font-display text-2xl font-bold text-ink">{kolaborasiList.length}</strong>
        </div>
        <div className="rounded-2xl border border-steel/15 bg-white p-4">
          <span className="font-mono text-[11px] text-steel block">Total Pelamar</span>
          <strong className="font-display text-2xl font-bold text-ink">{pelamarList.length}</strong>
        </div>
        <div className="rounded-2xl border border-steel/15 bg-white p-4 col-span-2 sm:col-span-1">
          <span className="font-mono text-[11px] text-steel block">Perlu Di-review</span>
          <strong className="font-display text-2xl font-bold text-amber-600">
            {pelamarList.filter((p) => p.status === "Menunggu").length}
          </strong>
        </div>
      </div>

      {/* Grid Cards Proyek */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {kolaborasiList.map((proyek) => {
          const pelamarProyek = pelamarList.filter(
            (p) => p.kolaborasiId === proyek.id || proyek.id === "1"
          );

          return (
            <div
              key={proyek.id}
              className="rounded-3xl border border-steel/20 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-steel/10 px-3 py-0.5 font-mono text-[11px] font-medium text-steel">
                      {proyek.kategori}
                    </span>
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-blue-700 border border-blue-200">
                      {proyek.tipe}
                    </span>
                  </div>

                  <span className="font-mono text-xs text-steel">
                    Pelamar: <strong className="text-ink font-bold">{pelamarProyek.length}</strong>
                  </span>
                </div>

                <h2 className="font-display text-xl font-bold text-ink line-clamp-2">
                  {proyek.judul}
                </h2>

                <p className="mt-2 font-sans text-xs text-ink/70 line-clamp-3 leading-relaxed">
                  {proyek.deskripsi || "Tidak ada deskripsi rinci untuk proyek kolaborasi ini."}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-steel/10 flex items-center justify-between">
                <span className="font-mono text-[11px] text-steel">
                  Status: <span className="text-emerald-700 font-medium">{proyek.statusPublikasi || "Terbit"}</span>
                </span>

                <button
                  onClick={() => setActiveProyek(proyek)}
                  className="rounded-full bg-bridge-gold px-5 py-2 font-mono text-xs font-bold text-ink shadow-sm hover:brightness-105 transition"
                >
                  Detail & Pelamar →
                </button>
              </div>
            </div>
          );
        })}

        {/* Card CTA: Tambah Proyek Baru */}
        <Link
          href="/perusahaan/dashboard"
          className="group rounded-3xl border-2 border-dashed border-steel/25 bg-white/40 p-8 hover:bg-white hover:border-bridge-gold transition flex flex-col items-center justify-center text-center min-h-[220px]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bridge-gold/20 font-display font-bold text-ink text-xl group-hover:scale-110 transition-transform">
            +
          </div>
          <h3 className="mt-3 font-display font-bold text-ink text-base">Buat Kolaborasi Baru</h3>
          <p className="mt-1 font-mono text-xs text-steel">
            Buka peluang proyek riset / magang baru untuk mahasiswa.
          </p>
        </Link>
      </div>

      {/* MODAL 1: Detail Proyek & Daftar Pelamar */}
      {activeProyek && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl bg-white p-6 sm:p-8 shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-steel/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-steel/10 px-3 py-0.5 font-mono text-[10px] text-steel">
                    {activeProyek.kategori}
                  </span>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-mono text-[10px] text-blue-700 font-semibold">
                    {activeProyek.tipe}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-2xl font-bold text-ink">
                  {activeProyek.judul}
                </h3>
              </div>
              <button
                onClick={() => setActiveProyek(null)}
                className="rounded-full bg-steel/10 p-2 text-steel hover:bg-steel/20"
              >
                ✕
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="mt-6 space-y-6 overflow-y-auto pr-2">
              {/* Info Detail Kolaborasi */}
              <div className="rounded-2xl bg-steel/5 p-4 space-y-3">
                <h4 className="font-mono text-xs font-bold text-steel uppercase tracking-wider">
                  Informasi Kolaborasi
                </h4>
                <p className="font-sans text-xs text-ink leading-relaxed">
                  {activeProyek.deskripsi || "Tidak ada deskripsi rinci."}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs border-t border-steel/10">
                  <div>
                    <span className="text-steel block text-[10px]">Kuota Diterima:</span>
                    <strong className="text-ink">{activeProyek.kuota || 3} Mahasiswa</strong>
                  </div>
                  <div>
                    <span className="text-steel block text-[10px]">Status Terbit:</span>
                    <strong className="text-emerald-700">{activeProyek.statusPublikasi || "Terbit"}</strong>
                  </div>
                  <div>
                    <span className="text-steel block text-[10px]">Dibuat Oleh:</span>
                    <strong className="text-ink">Nexora Digital</strong>
                  </div>
                </div>
              </div>

              {/* Daftar Pelamar Proyek Ini */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-display font-bold text-ink text-base">
                    Daftar Pelamar Mahasiswa
                  </h4>
                  <span className="font-mono text-xs text-steel">
                    Total:{" "}
                    <strong>
                      {
                        pelamarList.filter(
                          (p) => p.kolaborasiId === activeProyek.id || activeProyek.id === "1"
                        ).length
                      }
                    </strong>
                  </span>
                </div>

                <div className="space-y-3">
                  {pelamarList.filter(
                    (p) => p.kolaborasiId === activeProyek.id || activeProyek.id === "1"
                  ).length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-steel/20 p-8 text-center font-mono text-xs text-steel">
                      Belum ada mahasiswa yang melamar pada proyek ini.
                    </div>
                  ) : (
                    pelamarList
                      .filter((p) => p.kolaborasiId === activeProyek.id || activeProyek.id === "1")
                      .map((pelamar) => {
                        const nama = getNama(pelamar);
                        const kampus = getKampus(pelamar);
                        const jurusan = getJurusan(pelamar);
                        const ipk = getIPK(pelamar);

                        return (
                          <div
                            key={pelamar.id}
                            className="rounded-2xl border border-steel/15 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-steel/30 transition"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bridge-gold/30 font-display font-bold text-ink text-sm">
                                {nama.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="font-display font-bold text-ink text-sm">{nama}</h5>
                                  <span
                                    className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold ${
                                      pelamar.status === "Diterima"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : pelamar.status === "Ditolak"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {pelamar.status}
                                  </span>
                                </div>
                                <p className="font-mono text-[11px] text-steel">
                                  {jurusan} • {kampus} (IPK: {ipk})
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 justify-end">
                              <button
                                onClick={() => setSelectedPelamar(pelamar)}
                                className="rounded-full bg-steel/10 px-3 py-1.5 font-mono text-xs font-medium text-ink hover:bg-steel/20 transition"
                              >
                                Detail Profil
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(pelamar.id, "Diterima")}
                                className="rounded-full bg-emerald-600 px-3 py-1.5 font-mono text-xs font-semibold text-white hover:bg-emerald-700 transition"
                              >
                                Terima
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(pelamar.id, "Ditolak")}
                                className="rounded-full bg-red-500/10 px-3 py-1.5 font-mono text-xs font-medium text-red-600 hover:bg-red-500/20 transition"
                              >
                                Tolak
                              </button>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 border-t border-steel/10 pt-4 flex justify-end">
              <button
                onClick={() => setActiveProyek(null)}
                className="rounded-full border border-steel/20 bg-white px-5 py-2 font-mono text-xs font-medium text-ink hover:bg-steel/5"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Detail Profil Pelamar Individu */}
      {selectedPelamar && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-steel/10 pb-4">
              <h3 className="font-display text-lg font-bold text-ink">Profil Pelamar</h3>
              <button
                onClick={() => setSelectedPelamar(null)}
                className="rounded-full bg-steel/10 p-2 text-steel hover:bg-steel/20"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4 font-mono text-xs">
              <div>
                <span className="text-steel">Nama Lengkap:</span>
                <p className="font-sans text-sm font-bold text-ink">{getNama(selectedPelamar)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-steel">Universitas:</span>
                  <p className="font-sans text-xs text-ink">{getKampus(selectedPelamar)}</p>
                </div>
                <div>
                  <span className="text-steel">Jurusan:</span>
                  <p className="font-sans text-xs text-ink">{getJurusan(selectedPelamar)}</p>
                </div>
              </div>
              <div>
                <span className="text-steel">Pesan & Motivasi:</span>
                <p className="mt-1 rounded-xl bg-steel/5 p-3 font-sans text-xs text-ink leading-relaxed">
                  {getCatatan(selectedPelamar)}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 pt-4 border-t border-steel/10">
              <button
                onClick={() => {
                  handleUpdateStatus(selectedPelamar.id, "Ditolak");
                  setSelectedPelamar(null);
                }}
                className="rounded-full bg-red-50 px-4 py-2 font-mono text-xs text-red-600 hover:bg-red-100"
              >
                Tolak
              </button>
              <button
                onClick={() => {
                  handleUpdateStatus(selectedPelamar.id, "Diterima");
                  setSelectedPelamar(null);
                }}
                className="rounded-full bg-emerald-600 px-4 py-2 font-mono text-xs text-white hover:bg-emerald-700 font-semibold"
              >
                Terima Pelamar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function PelamarPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-mono text-xs">Loading...</div>}>
      <PelamarContent />
    </Suspense>
  );
}