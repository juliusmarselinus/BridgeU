"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { dummyRegisteredCompanies, RegisteredCompany } from "@/lib/dummy-data";

export default function AdminVerifikasiPerusahaanPage() {
  const [companyList, setCompanyList] = useState<RegisteredCompany[]>([]);
  const [filterStatus, setFilterStatus] = useState<
    "Semua" | "Menunggu Verifikasi" | "Terverifikasi" | "Ditolak"
  >("Semua");

  useEffect(() => {
    const stored = localStorage.getItem("bridgeu_registered_companies");
    if (stored) {
      const parsed = JSON.parse(stored);
      queueMicrotask(() => setCompanyList(parsed));
    } else {
      queueMicrotask(() => setCompanyList(dummyRegisteredCompanies));
    }
  }, []);

  const handleUpdateVerifikasi = (
    id: string,
    newStatus: "Terverifikasi" | "Ditolak"
  ) => {
    const updated = companyList.map((comp) =>
      comp.id === id ? { ...comp, statusVerifikasi: newStatus } : comp
    );
    setCompanyList(updated);
    localStorage.setItem("bridgeu_registered_companies", JSON.stringify(updated));
  };

  const filteredList = companyList.filter((comp) => {
    if (filterStatus === "Semua") return true;
    return comp.statusVerifikasi === filterStatus;
  });

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-8">
      <div className="mb-6">
        <Link
          href="/admin/dashboard"
          className="font-mono text-xs text-steel hover:text-ink transition inline-flex items-center gap-1.5"
        >
          ← Kembali ke Dashboard Admin
        </Link>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">
          Verifikasi Identitas Perusahaan
        </h1>
        <p className="mt-0.5 text-sm text-steel">
          Tinjau keabsahan berkas legalitas dan Nomor Induk Berusaha (NIB) milik perusahaan mitra.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs">
        {(["Semua", "Menunggu Verifikasi", "Terverifikasi", "Ditolak"] as const).map(
          (st) => {
            const count =
              st === "Semua"
                ? companyList.length
                : companyList.filter((c) => c.statusVerifikasi === st).length;

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
          }
        )}
      </div>

      {/* Grid Perusahaan */}
      {filteredList.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-steel/30 bg-white/40 p-12 text-center">
          <p className="text-sm text-steel">
            Tidak ada perusahaan dengan status &quot;{filterStatus}&quot;.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredList.map((comp) => (
            <div
              key={comp.id}
              className="rounded-2xl border border-steel/15 bg-white/70 p-6 shadow-sm transition hover:shadow-md hover:border-emerald-500/30 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-steel/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 font-mono font-bold text-ink">
                      🏢
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-ink leading-tight flex items-center gap-1.5">
                        {comp.nama}
                        {comp.statusVerifikasi === "Terverifikasi" && (
                          <span className="text-emerald-600 font-bold" title="Terverifikasi">
                            ✓
                          </span>
                        )}
                      </h3>
                      <p className="font-mono text-xs text-steel">
                        {comp.industri} • {comp.lokasi}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 font-mono text-[11px] font-semibold ${
                      comp.statusVerifikasi === "Terverifikasi"
                        ? "bg-emerald-100 text-emerald-800"
                        : comp.statusVerifikasi === "Menunggu Verifikasi"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {comp.statusVerifikasi}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center bg-white/50 p-2.5 rounded-xl border border-steel/10">
                    <span className="font-mono font-semibold text-steel uppercase text-[10px]">
                      Nomor Legalitas (NIB):
                    </span>
                    <span className="font-mono font-bold text-ink">{comp.nib}</span>
                  </div>

                  <div className="flex justify-between items-center text-steel font-mono text-[11px] pt-1">
                    <span>Email Resmi:</span>
                    <span className="text-ink font-medium">{comp.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-steel/10 flex items-center justify-between">
                <span className="font-mono text-[11px] text-steel">
                  📅 Terdaftar: {comp.tanggalDaftar}
                </span>

                <div className="flex items-center gap-2">
                  {comp.statusVerifikasi === "Menunggu Verifikasi" && (
                    <>
                      <button
                        onClick={() => handleUpdateVerifikasi(comp.id, "Ditolak")}
                        className="rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 font-mono text-xs font-medium text-red-600 hover:bg-red-100 transition"
                      >
                        Tolak
                      </button>
                      <button
                        onClick={() => handleUpdateVerifikasi(comp.id, "Terverifikasi")}
                        className="rounded-full bg-emerald-600 px-4 py-1.5 font-mono text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-sm"
                      >
                        ✓ Verifikasi Perusahaan
                      </button>
                    </>
                  )}

                  {comp.statusVerifikasi === "Terverifikasi" && (
                    <span className="font-mono text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      ✓ Terverifikasi Resmi
                    </span>
                  )}

                  {comp.statusVerifikasi === "Ditolak" && (
                    <span className="font-mono text-xs text-red-600 font-medium">
                      ✕ Verifikasi Ditolak
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
