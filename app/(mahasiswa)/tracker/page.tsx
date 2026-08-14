"use client";

import React from "react";
import { MahasiswaSkeletonPage } from "@/components/ui/MahasiswaLoading";
import { usePortfolioTracker } from "./hooks/usePortfolioTracker";
import {
  TrackerHeader,
  AchievementCard,
  SkillsOverviewCard,
} from "./components/TrackerComponents";

import { generatePortfolioPDF } from "./services/pdfGenerator";

export default function StudentPortfolioTrackerPage() {
  const {
    loading,
    profile,
    achievements,
    totalCount,
    summary,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
  } = usePortfolioTracker();

  if (loading) {
    return <MahasiswaSkeletonPage />;
  }

  const handleGeneratePDF = () => {
    generatePortfolioPDF(profile, achievements, summary);
  };

  return (
    <main className="min-h-screen bg-paper font-sans text-ink pb-24">
      {/* Header Banner */}
      <TrackerHeader profile={profile} summary={summary} onGeneratePDF={handleGeneratePDF} />

      {/* Main Content Body */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 -mt-8 relative z-20 space-y-8">
        {/* Controls Bar: Search & Category Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white border border-steel/15 p-3 shadow-md">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(["Semua", "Magang", "Akademik"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`rounded-2xl px-4 py-2 font-mono text-xs font-bold transition-all ${
                  filterType === t
                    ? "bg-ink text-paper shadow-sm"
                    : "text-steel hover:bg-surface hover:text-ink"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative sm:w-72">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-steel"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari proyek, perusahaan, skill..."
              className="w-full rounded-2xl border border-steel/20 bg-surface pl-10 pr-4 py-2 text-xs font-mono text-ink placeholder:text-steel/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        {/* Layout Grid (Left: Timeline Achievements, Right: Verified Skills Overview) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Auto-generated Achievement Cards */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-ink">
                Daftar Luaran &amp; Rating Proyek ({totalCount})
              </h2>
            </div>

            {achievements.length === 0 ? (
              <div className="rounded-3xl border border-steel/15 bg-white p-12 text-center space-y-3">
                <p className="font-display text-lg font-bold text-ink">Belum Ada Catatan Portfolio</p>
                <p className="text-xs text-steel max-w-sm mx-auto">
                  Selesaikan proyek kolaborasi atau sesuaikan kata kunci pencarian kamu.
                </p>
              </div>
            ) : (
              <>
                {achievements.map((ach) => (
                  <AchievementCard key={ach.id} achievement={ach} />
                ))}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 font-mono text-xs text-steel border-t border-steel/10">
                    <span>
                      Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)}-
                      {Math.min(currentPage * itemsPerPage, totalCount)} dari {totalCount} proyek
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="rounded-xl border border-steel/20 bg-white px-3.5 py-1.5 font-bold text-ink transition hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                      >
                        ← Prev
                      </button>
                      <span className="font-bold text-ink">
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="rounded-xl border border-steel/20 bg-white px-3.5 py-1.5 font-bold text-ink transition hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Column: Skills Overview */}
          <div className="space-y-6">
            {summary && <SkillsOverviewCard summary={summary} />}
          </div>
        </div>
      </div>
    </main>
  );
}
