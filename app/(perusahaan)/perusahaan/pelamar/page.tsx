"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { usePelamar } from "./hooks/usePelamar";
import { ProyekDetailModal } from "./components/ProyekDetailModal";
import { PelamarProfilModal } from "./components/PelamarProfilModal";

function PelamarContent() {
  const searchParams = useSearchParams();
  const initialKolaborasiId = searchParams.get("kolaborasiId");

  const {
    proyekList,
    activeProyek,
    setActiveProyek,
    selectedPelamar,
    setSelectedPelamar,
    isLoading,
    totalProyek,
    totalPelamar,
    perluReview,
    handleUpdateStatus,
  } = usePelamar(initialKolaborasiId);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-xs text-steel">
        Memuat data pelamar...
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-steel/15 pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-steel">
            <Link href="/perusahaan/dashboard" className="hover:text-ink transition">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-ink font-medium">Kelola Pelamar</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink">
            Kelola Pelamar Proyek
          </h1>
          <p className="mt-1 font-mono text-xs text-steel">
            Pilih proyek untuk melihat detail informasi serta mengelola daftar pelamar mahasiswa
          </p>
        </div>

        <Link
          href="/perusahaan/dashboard"
          className="self-start md:self-auto rounded-full border border-steel/20 bg-white px-5 py-2.5 font-mono text-xs font-medium text-ink hover:bg-steel/5 transition shadow-sm"
        >
          Kembali ke Dashboard
        </Link>
      </div>

      {/* Quick Stats Summary */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-steel/15 bg-white p-4">
          <span className="font-mono text-[11px] text-steel block">Total Proyek</span>
          <strong className="font-display text-2xl font-bold text-ink">{totalProyek}</strong>
        </div>
        <div className="rounded-2xl border border-steel/15 bg-white p-4">
          <span className="font-mono text-[11px] text-steel block">Total Pelamar</span>
          <strong className="font-display text-2xl font-bold text-ink">{totalPelamar}</strong>
        </div>
        <div className="rounded-2xl border border-steel/15 bg-white p-4 col-span-2 sm:col-span-1">
          <span className="font-mono text-[11px] text-steel block">Perlu Di-review</span>
          <strong className="font-display text-2xl font-bold text-amber-600">{perluReview}</strong>
        </div>
      </div>

      {/* Grid Cards Proyek */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {proyekList.map((proyek) => (
          <div
            key={proyek.id}
            className="rounded-3xl border border-steel/20 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-steel/10 px-3 py-0.5 font-mono text-[11px] font-medium text-steel">
                    {proyek.nama_kategori}
                  </span>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-blue-700 border border-blue-200">
                    {proyek.tipe}
                  </span>
                </div>

                <span className="font-mono text-xs text-steel">
                  Pelamar:{" "}
                  <strong className="text-ink font-bold">{proyek.pelamar_list.length}</strong>
                </span>
              </div>

              <h2 className="font-display text-xl font-bold text-ink line-clamp-2">
                {proyek.judul}
              </h2>

              <p className="mt-2 font-sans text-xs text-ink/70 line-clamp-3 leading-relaxed">
                {proyek.deskripsi}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-steel/10 flex items-center justify-between">
              <span className="font-mono text-[11px] text-steel">
                Moderasi:{" "}
                <span className="text-emerald-700 font-medium">{proyek.status_moderasi}</span>
              </span>

              <button
                onClick={() => setActiveProyek(proyek)}
                className="inline-flex items-center gap-1.5 rounded-full bg-bridge-gold px-5 py-2 font-mono text-xs font-bold text-ink shadow-sm hover:brightness-105 transition"
              >
                Detail & Pelamar
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {/* Card CTA: Tambah Proyek Baru */}
        <Link
          href="/perusahaan/kolaborasi"
          className="group rounded-3xl border-2 border-dashed border-steel/25 bg-white/40 p-8 hover:bg-white hover:border-bridge-gold transition flex flex-col items-center justify-center text-center min-h-[220px]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bridge-gold/20 font-display font-bold text-ink text-xl group-hover:scale-110 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <h3 className="mt-3 font-display font-bold text-ink text-base">Buat Kolaborasi Baru</h3>
          <p className="mt-1 font-mono text-xs text-steel">
            Buka peluang proyek riset / magang baru untuk mahasiswa
          </p>
        </Link>
      </div>

      {/* Modal Detail Proyek & Daftar Pelamar */}
      <ProyekDetailModal
        proyek={activeProyek}
        onClose={() => setActiveProyek(null)}
        onSelectPelamar={setSelectedPelamar}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Modal Detail Profil Pelamar */}
      <PelamarProfilModal
        pelamar={selectedPelamar}
        onClose={() => setSelectedPelamar(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </main>
  );
}

export default function PelamarPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-mono text-xs">Memuat data pelamar...</div>}>
      <PelamarContent />
    </Suspense>
  );
}