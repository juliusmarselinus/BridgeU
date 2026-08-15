"use client";

import React from "react";
import { motion } from "framer-motion";
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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

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
      // Jangan tampilkan agenda kalender untuk kolaborasi yang sudah batal/ditolak
      const isInactive = item.status === "Dibatalkan" || item.status === "Ditolak";

      // Batas Pelaksanaan hanya tampil jika status Diterima, Evaluasi, atau Selesai
      const isAcceptedOrActive =
        item.status === "Diterima" || item.status === "Evaluasi" || item.status === "Selesai";

      if (item.batasWaktu && !isInactive) {
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

      if (item.tanggalSelesai && isAcceptedOrActive && !isInactive) {
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

      if (item.interview?.scheduled_at && !isInactive) {
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
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <DashboardHero loading={loading} user={user} stats={stats} />
      </motion.div>

      {/* 2. OVERLAPPING / STACKED CARDS CONTENT */}
      <motion.div
        className="relative mx-auto max-w-6xl px-6 -mt-16 z-30 space-y-10"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* STATS CARDS */}
        <motion.div variants={fadeUp} transition={{ duration: 0.45, ease: "easeOut" }}>
          <DashboardStatsCards stats={stats} loading={loading} />
        </motion.div>

        {/* MAIN LAYOUT GRID (LEFT 2/3, RIGHT 1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.45, ease: "easeOut" }}>
              <DashboardPengajuanList pengajuan={pengajuan} loading={loading} />
            </motion.div>
            <motion.div variants={fadeUp} transition={{ duration: 0.45, ease: "easeOut" }}>
              <DashboardRecommendations recommendedProjects={recommendedProjects} loading={loading} />
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN */}
          <motion.div className="space-y-6" variants={staggerContainer}>
            <motion.div variants={fadeUp} transition={{ duration: 0.45, ease: "easeOut" }}>
              <InteractiveCalendar events={mahasiswaEvents} title="Kalender Agenda Saya" />
            </motion.div>
            <motion.div variants={fadeUp} transition={{ duration: 0.45, ease: "easeOut" }}>
              <DashboardBadges userBadges={userBadges} />
            </motion.div>
            <motion.div variants={fadeUp} transition={{ duration: 0.45, ease: "easeOut" }}>
              <DashboardPortfolioTracker />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}