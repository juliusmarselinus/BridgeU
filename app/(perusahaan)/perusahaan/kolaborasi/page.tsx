"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCompanyDashboard } from "../dashboard/hooks/useCompanyDashboard";
import { KolaborasiHeader } from "./components/KolaborasiHeader";
import { KolaborasiItemCard } from "./components/KolaborasiItemCard";
import { KolaborasiEmptyState } from "./components/KolaborasiEmptyState";
import { chatService } from "./baru/services/chatService";

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

  const [unreadByKolaborasi, setUnreadByKolaborasi] = useState<Record<string, number>>({});

  // Initial fetch sekali pas mount / company berubah
  useEffect(() => {
    if (!company?.user_id) return;

    let isMounted = true;

    async function loadUnread() {
      const counts = await chatService.fetchUnreadCountsPerKolaborasi(company!.user_id);
      if (isMounted) setUnreadByKolaborasi(counts);
    }

    loadUnread();

    // Refresh ulang count asli pas tab/halaman ini kebuka lagi
    // (misal user abis buka detail kolaborasi, baca chat, terus balik ke list ini)
    function handleVisibility() {
      if (document.visibilityState === "visible") {
        loadUnread();
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", loadUnread);

    return () => {
      isMounted = false;
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", loadUnread);
    };
  }, [company?.user_id]);

  // Realtime subscription, gantiin polling. Pas ada pesan baru masuk, refetch count asli
  // (bukan increment manual) biar selalu sinkron sama status is_read di database.
  useEffect(() => {
    if (!company?.user_id || kolaborasiList.length === 0) return;

    const ids = kolaborasiList.map((k) => k.id);

    const channel = chatService.subscribeAllUnreadForPerusahaan(ids, async () => {
      const counts = await chatService.fetchUnreadCountsPerKolaborasi(company!.user_id);
      setUnreadByKolaborasi(counts);
    });

    return () => {
      chatService.unsubscribe(channel);
    };
  }, [company?.user_id, kolaborasiList]);

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

  const counts = {
    menunggu: kolaborasiList.filter((k) => k.status_moderasi === "Menunggu").length,
    disetujui: kolaborasiList.filter((k) => k.status_moderasi === "Disetujui").length,
    ditolak: kolaborasiList.filter((k) => k.status_moderasi === "Ditolak").length,
  };

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-16">
      <KolaborasiHeader
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
        onOpenModal={handleOpenCreatePage}
        onExportCSV={handleExportCSV}
        totalCount={kolaborasiList.length}
        counts={counts}
      />

      {filteredKolaborasi.length === 0 ? (
        <KolaborasiEmptyState
          selectedTab={selectedTab}
          onOpenModal={handleOpenCreatePage}
        />
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredKolaborasi.map((item, index) => (
            <div
              key={item.id}
              className="animate-card-in"
              style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
            >
              <KolaborasiItemCard
                item={item}
                onDelete={handleDeleteKolaborasi}
                unreadCount={unreadByKolaborasi[item.id] || 0}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}