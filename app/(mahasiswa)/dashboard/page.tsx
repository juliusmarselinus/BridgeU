"use client";

import React from "react";
import { useDashboard } from "./hooks/useDashboard";
import { DashboardHero } from "./components/DashboardHero";
import { DashboardStatsCards } from "./components/DashboardStats";
import { DashboardPengajuanList } from "./components/DashboardPengajuanList";
import { DashboardRecommendations } from "./components/DashboardRecommendations";
import { DashboardBadges } from "./components/DashboardBadges";
import { DashboardPortfolioTracker } from "./components/DashboardPortfolioTracker";

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

  if (!authChecked && !loading) return null;

  return (
    <main className="min-h-screen bg-paper pb-24 font-sans text-ink">
      {/* 1. HERO SECTION */}
      <DashboardHero loading={loading} user={user} stats={stats} />

      {/* 2. OVERLAPPING / STACKED CARDS CONTENT */}
      <div className="relative mx-auto max-w-6xl px-6 -mt-16 z-30 space-y-10">
        {/* STATS CARDS */}
        <DashboardStatsCards stats={stats} />

        {/* MAIN LAYOUT GRID (LEFT 2/3, RIGHT 1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            <DashboardPengajuanList pengajuan={pengajuan} />
            <DashboardRecommendations recommendedProjects={recommendedProjects} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            <DashboardBadges userBadges={userBadges} />
            <DashboardPortfolioTracker />
          </div>
        </div>
      </div>
    </main>
  );
}