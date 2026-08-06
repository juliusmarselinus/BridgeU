"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { dummyPelamarList, Pelamar } from "@/lib/dummy-data";

export default function KelolaPelamarPage() {
  const [pelamarList, setPelamarList] = useState<Pelamar[]>([]);
  const [filterStatus, setFilterStatus] = useState<"Semua" | "Menunggu" | "Diterima" | "Ditolak">("Semua");
  const [selectedPelamar, setSelectedPelamar] = useState<Pelamar | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("bridgeu_pelamar_list");
    if (stored) {
      const parsed = JSON.parse(stored);
      queueMicrotask(() => setPelamarList(parsed));
    } else {
      queueMicrotask(() => setPelamarList(dummyPelamarList));
    }
  }, []);

  const handleUpdateStatus = (id: string, newStatus: "Diterima" | "Ditolak") => {
    const updated = pelamarList.map((p) => (p.id === id ? { ...p, status: newStatus } : p));
    setPelamarList(updated);
    localStorage.setItem("bridgeu_pelamar_list", JSON.stringify(updated));

    // Sync with Student's localStorage ('bridgeu_pengajuan')
    const studentPengajuan = localStorage.getItem("bridgeu_pengajuan");
    if (studentPengajuan) {
      const parsedPengajuan = JSON.parse(studentPengajuan);
      const targetPelamar = pelamarList.find((p) => p.id === id);
      if (targetPelamar) {
        const updatedStudentPengajuan = parsedPengajuan.map((sp: { id: string; status: string }) =>
          sp.id === targetPelamar.kolaborasiId ? { ...sp, status: newStatus } : sp
        );
        localStorage.setItem("bridgeu_pengajuan", JSON.stringify(updatedStudentPengajuan));
      }
    }

    if (selectedPelamar?.id === id) {
      setSelectedPelamar((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const filteredList = pelamarList.filter((p) => {
    if (filterStatus === "Semua") return true;
    return p.status === filterStatus;
  });

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/perusahaan/dashboard"
            className="font-mono text-xs text-steel hover:text-ink transition inline-flex items-center gap-1.5"
          >
            ← Kembali ke Dashboard
          </Link>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink">
            Kelola Berkas Pelamar Mahasiswa
          </h1>
          <p className="mt-0.5 text-sm text-steel">
            Tinjau latar belakang dan tujuan pengajuan kolaborasi dari mahasiswa.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs">
        {(["Semua", "Menunggu", "Diterima", "Ditolak"] as const).map((st) => {
          const count = st === "Semua" ? pelamarList.length : pelamarList.filter((p) => p.status === st).length;
          return (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`rounded-full px-4 py-2 font-medium transition ${
                filterStatus === st
                  ? "bg-ink text-paper border border-ink shadow-sm"
                  : "bg-white/60 text-steel border border-steel/20 hover:border-ink hover:text-ink"
              }`}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid Pelamar */}
      {filteredList.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-steel/30 bg-white/40 p-12 text-center">
          <p className="text-sm text-steel">Tidak ada pelamar dengan status &quot;{filterStatus}&quot;.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredList.map((pelamar) => (
            <div
              key={pelamar.id}
              className="rounded-2xl border border-steel/15 bg-white/70 p-6 shadow-sm transition hover:shadow-md hover:border-bridge-gold/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-steel/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bridge-gold/20 font-mono font-bold text-ink">
                      {pelamar.namaMahasiswa
                        .split(" ")
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-ink leading-tight">
                        {pelamar.namaMahasiswa}
                      </h3>
                      <p className="font-mono text-xs text-steel">
                        {pelamar.universitas} • {pelamar.prodi}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 font-mono text-[11px] font-semibold ${
                      pelamar.status === "Menunggu"
                        ? "bg-yellow-100 text-yellow-800"
                        : pelamar.status === "Diterima"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {pelamar.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div>
                    <span className="font-mono font-semibold text-steel uppercase text-[10px]">Posisi / Proyek:</span>
                    <p className="font-semibold text-ink">{pelamar.kolaborasiJudul}</p>
                  </div>

                  <div>
                    <span className="font-mono font-semibold text-steel uppercase text-[10px]">Tujuan & Motivasi:</span>
                    <p className="text-steel bg-white/60 p-3 rounded-xl border border-steel/10 italic">
                      &quot;{pelamar.tujuan}&quot;
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-steel/10 flex items-center justify-between">
                <span className="font-mono text-[11px] text-steel">
                  📅 {pelamar.tanggal}
                </span>

                <div className="flex items-center gap-2">
                  {pelamar.status === "Menunggu" && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(pelamar.id, "Ditolak")}
                        className="rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 font-mono text-xs font-medium text-red-600 hover:bg-red-100 transition"
                      >
                        Tolak
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(pelamar.id, "Diterima")}
                        className="rounded-full bg-emerald-600 px-4 py-1.5 font-mono text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-sm"
                      >
                        Terima Pelamar
                      </button>
                    </>
                  )}

                  {pelamar.status === "Diterima" && (
                    <span className="font-mono text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      ✓ Telah Disetujui
                    </span>
                  )}

                  {pelamar.status === "Ditolak" && (
                    <span className="font-mono text-xs text-red-600 font-medium">
                      ✕ Berkas Ditolak
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
