"use client";

import React from "react";
import { useDashboard } from "./hooks/useDashboard";
import { GradientBars } from "@/components/ui/gradient-bars-background";
import { DashboardHero } from "./components/DashboardHero";
import { DashboardStatsCards } from "./components/DashboardStats";
import { DashboardPengajuanList } from "./components/DashboardPengajuanList";
import { DashboardRecommendations } from "./components/DashboardRecommendations";
import { DashboardBadges } from "./components/DashboardBadges";
import { DashboardPortfolioTracker } from "./components/DashboardPortfolioTracker";

import { useEffect, useState, useMemo } from "react";
import { fetchMahasiswaStatusList } from "../status/services/statusService";
import { InteractiveCalendar, CalendarEvent } from "@/components/ui/InteractiveCalendar";
import { MahasiswaSkeletonPage } from "@/components/ui/MahasiswaLoading";

export default function DashboardPage() {
  const {
    authChecked,
    loading,
    user,
    pengajuan,
    recommendedProjects,
    userBadges,
    stats,
  } = useDashboard();

  const [statusList, setStatusList] = useState<any[]>([]);

  useEffect(() => {
    async function loadStatus() {
      const data = await fetchMahasiswaStatusList();
      setStatusList(data);
    }
    loadStatus();
  }, []);

  const mahasiswaEvents = useMemo<CalendarEvent[]>(() => {
    const list: CalendarEvent[] = [];

    statusList.forEach((item) => {
      // Batas Pelaksanaan hanya tampil jika status Diterima, Evaluasi, atau Selesai
      const isAcceptedOrActive =
        item.status === "Diterima" || item.status === "Evaluasi" || item.status === "Selesai";

      if (item.batasWaktu) {
        list.push({
          id: `deadline-${item.id}`,
          date: item.batasWaktu,
          title: `Start Kolaborasi: ${item.judul}`,
          type: "deadline",
          typeLabel: "Start Kolaborasi",
          subtitle: `Mitra: ${item.perusahaan}`,
          link: item.id ? `/status/${item.id}` : `/status`,
        });
      }

      if (item.tanggalSelesai && isAcceptedOrActive) {
        list.push({
          id: `completion-${item.id}`,
          date: item.tanggalSelesai,
          title: `Batas Pelaksanaan: ${item.judul}`,
          type: "completion",
          typeLabel: "Batas Pelaksanaan",
          subtitle: `Mitra: ${item.perusahaan}`,
          link: item.id ? `/status/${item.id}` : `/status`,
        });
      }

      if (item.interview?.scheduled_at) {
        const dt = new Date(item.interview.scheduled_at);
        list.push({
          id: `interview-${item.id}`,
          date: dt.toISOString().split("T")[0],
          title: `Wawancara: ${item.perusahaan}`,
          type: "interview",
          typeLabel: "Wawancara",
          subtitle: `Proyek: ${item.judul} (${dt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB)`,
          link: item.id ? `/status/${item.id}` : `/status`,
        });
      }
    });

    return list;
  }, [statusList]);

  if (loading || (!authChecked && loading)) {
    return <MahasiswaSkeletonPage />;
  }

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-secondary/15 via-clouds to-clouds pb-24 font-sans text-ink">
      {/* Soft ambient bars — very subtle, just to break up the flat background */}
      <GradientBars
        numBars={20}
        gradientFrom="rgb(176, 208, 218)"
        gradientTo="transparent"
        animationDuration={7}
        className="opacity-70"
      />

      {/* 1. HERO SECTION */}
      <div className="relative z-10">
        <DashboardHero loading={loading} user={user} stats={stats} />
      </div>

      {/* 2. OVERLAPPING / STACKED CARDS CONTENT */}
      <div className="relative mx-auto max-w-6xl px-6 -mt-16 z-30 space-y-10">
        {/* STATS CARDS */}
        <DashboardStatsCards stats={stats} loading={loading} />

        {/* MAIN LAYOUT GRID (LEFT 2/3, RIGHT 1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            <DashboardPengajuanList pengajuan={pengajuan} loading={loading} />
            <DashboardRecommendations recommendedProjects={recommendedProjects} loading={loading} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            <InteractiveCalendar events={mahasiswaEvents} title="Kalender Agenda Saya" />
            <DashboardBadges userBadges={userBadges} />
            <DashboardPortfolioTracker />
          </div>
        </div>
      </div>
    </main>
  );
}