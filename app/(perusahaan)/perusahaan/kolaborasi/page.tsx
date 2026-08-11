"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCompanyDashboard } from "../dashboard/hooks/useCompanyDashboard";
import { KolaborasiHeader } from "./components/KolaborasiHeader";
import { KolaborasiItemCard } from "./components/KolaborasiItemCard";
import { KolaborasiEmptyState } from "./components/KolaborasiEmptyState";

export default function KolaborasiPage() {
  const router = useRouter();
  const {
    company,
    kolaborasiList,
    filteredKolaborasi,
    selectedTab,
    setSelectedTab,
    isLoading,
    handleDeleteKolaborasi,
    handleExportCSV,
  } = useCompanyDashboard();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-xs text-steel">
        Memuat data kolaborasi...
      </div>
    );
  }

  if (company && company.status_verifikasi !== "Terverifikasi") {
    return (
      <main className="mx-auto max-w-2xl px-4 pt-16 pb-16 text-center font-sans">
        <div className="rounded-2xl border border-dashed border-red-300 bg-red-50/50 p-8 shadow-sm">
          <svg className="mx-auto h-12 w-12 text-red-500/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <h2 className="mt-4 font-display text-lg font-bold text-ink">
            Akses Terkunci
          </h2>
          <p className="mt-2 font-mono text-xs text-steel max-w-md mx-auto leading-relaxed">
            Akun perusahaan Anda belum diverifikasi oleh administrator. Untuk mengelola kolaborasi, melihat pelamar, atau mengubah pengaturan, akun Anda harus berada dalam status <span className="text-emerald-700 font-bold">Terverifikasi</span> (Status saat ini: <strong className="text-red-700">{company.status_verifikasi}</strong>). Harap tunggu proses verifikasi oleh administrator.
          </p>
          <div className="mt-6">
            <Link
              href="/perusahaan/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-6 py-2.5 font-mono text-xs font-bold text-paper hover:bg-steel transition shadow-sm"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleOpenCreatePage = () => {
    router.push("/perusahaan/kolaborasi/baru");
  };

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 pb-16">
      <KolaborasiHeader
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
        onOpenModal={handleOpenCreatePage}
        onExportCSV={handleExportCSV}
        totalCount={kolaborasiList.length}
      />

      {filteredKolaborasi.length === 0 ? (
        <KolaborasiEmptyState
          selectedTab={selectedTab}
          onOpenModal={handleOpenCreatePage}
        />
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredKolaborasi.map((item) => (
            <KolaborasiItemCard
              key={item.id}
              item={item}
              onDelete={handleDeleteKolaborasi}
            />
          ))}
        </div>
      )}
    </main>
  );
}