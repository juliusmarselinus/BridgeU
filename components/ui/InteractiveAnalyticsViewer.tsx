"use client";

import React, { useState, useMemo } from "react";

export type AnalyticsCategoryKey = "conversion" | "occupancy" | "demographics" | "performance";
export type ChartType = "bar" | "pie";

interface AnalyticsDataItem {
  label: string;
  value: number;
  color: string;
  formattedValue?: string;
}

interface InteractiveAnalyticsViewerProps {
  conversionData: AnalyticsDataItem[];
  occupancyData: AnalyticsDataItem[];
  demographicsData: AnalyticsDataItem[];
  performanceData: AnalyticsDataItem[];
}

export function InteractiveAnalyticsViewer({
  conversionData,
  occupancyData,
  demographicsData,
  performanceData,
}: InteractiveAnalyticsViewerProps) {
  const [selectedCategory, setSelectedCategory] = useState<AnalyticsCategoryKey>("conversion");
  const [chartType, setChartType] = useState<ChartType>("pie");
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [barPage, setBarPage] = useState<number>(1);
  const [hoveredSlice, setHoveredSlice] = useState<AnalyticsDataItem | null>(null);

  const categoryConfigs: Record<
    AnalyticsCategoryKey,
    { title: string; subtitle: string; badge: string; badgeColor: string; data: AnalyticsDataItem[] }
  > = {
    conversion: {
      title: "1. Funnel Konversi Pelamar",
      subtitle: "Distribusi pendaftar masuk, aktif, evaluasi, hingga proyek selesai",
      badge: "Conversion Funnel",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      data: conversionData,
    },
    occupancy: {
      title: "2. Keterisian Kuota Proyek",
      subtitle: "Perbandingan total kuota slot dibuka vs slot yang telah terisi",
      badge: "Slot Occupancy",
      badgeColor: "bg-sky/15 text-ocean border-sky/30",
      data: occupancyData,
    },
    demographics: {
      title: "3. Demografi Perguruan Tinggi",
      subtitle: "Sebaran universitas asal pelamar terbanyak pada seluruh proyek",
      badge: "Talent Demographics",
      badgeColor: "bg-indigo-50 text-indigo-800 border-indigo-200",
      data: demographicsData,
    },
    performance: {
      title: "4. Quality & Rating Index",
      subtitle: "Statistik rating proyek, kepuasan mitra, dan frekuensi revisi",
      badge: "Performance Index",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      data: performanceData,
    },
  };

  const activeConfig = categoryConfigs[selectedCategory];
  const maxValue = useMemo(() => {
    const vals = activeConfig.data.map((d) => d.value);
    return Math.max(...vals, 1);
  }, [activeConfig.data]);

  const totalValueSum = useMemo(() => {
    return activeConfig.data.reduce((acc, curr) => acc + curr.value, 0) || 1;
  }, [activeConfig.data]);

  const totalBarPages = useMemo(() => {
    return Math.ceil(activeConfig.data.length / itemsPerPage) || 1;
  }, [activeConfig.data.length, itemsPerPage]);

  const paginatedBarData = useMemo(() => {
    const start = (barPage - 1) * itemsPerPage;
    return activeConfig.data.slice(start, start + itemsPerPage);
  }, [activeConfig.data, barPage, itemsPerPage]);

  // Conic gradient string for SVG/CSS Pie Chart
  const pieGradientStops = useMemo(() => {
    let accumulated = 0;
    const stops = activeConfig.data.map((item) => {
      const percentage = (item.value / totalValueSum) * 100;
      const start = accumulated;
      accumulated += percentage;
      return `${item.color} ${start}% ${accumulated}%`;
    });
    return `conic-gradient(${stops.join(", ")})`;
  }, [activeConfig.data, totalValueSum]);

  // Reset page when category or limit changes
  const handleCategorySelect = (catKey: AnalyticsCategoryKey) => {
    setSelectedCategory(catKey);
    setBarPage(1);
    setHoveredSlice(null);
  };

  const handleLimitChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setBarPage(1);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 4 Interactive Category Cards Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.keys(categoryConfigs) as AnalyticsCategoryKey[]).map((catKey) => {
          const cfg = categoryConfigs[catKey];
          const isSelected = selectedCategory === catKey;

          return (
            <button
              key={catKey}
              type="button"
              onClick={() => handleCategorySelect(catKey)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-3 cursor-pointer ${
                isSelected
                  ? "bg-white border-ocean ring-2 ring-sky/30 shadow-md translate-y-[-2px]"
                  : "bg-white/80 border-steel/15 hover:bg-white hover:border-steel/30 shadow-sm"
              }`}
            >
              <div>
                <span className={`font-mono text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.badgeColor}`}>
                  {cfg.badge}
                </span>
                <h3 className="font-display text-sm font-bold text-ink mt-2">{cfg.title.split(". ")[1]}</h3>
                <p className="font-mono text-[10.5px] text-steel mt-0.5 line-clamp-2">{cfg.subtitle}</p>
              </div>

              <div className="pt-2 border-t border-steel/10 flex items-center justify-between font-mono text-xs">
                <span className="text-steel font-medium">Lihat Grafik</span>
                <span className={`font-bold ${isSelected ? "text-ocean" : "text-steel/50"}`}>
                  {isSelected ? "Aktif ✓" : "Pilih →"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Chart Viewer Box */}
      <div className="rounded-3xl bg-white p-6 shadow-[8px_8px_22px_rgba(151,184,216,0.3),-8px_-8px_22px_rgba(255,255,255,0.9)] border border-steel/15 space-y-6">
        {/* Header, Per-Page Option & Chart Type Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-steel/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-mono text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${activeConfig.badgeColor}`}>
                {activeConfig.badge}
              </span>
              <h3 className="font-display text-lg font-bold text-ink">{activeConfig.title}</h3>
            </div>
            <p className="font-mono text-xs text-steel mt-1">{activeConfig.subtitle}</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Opsi Tampil Per Page (5, 10, 20) */}
            <div className="flex items-center gap-1.5 bg-steel/5 px-3 py-1.5 rounded-xl border border-steel/15 font-mono text-xs text-steel">
              <span className="font-bold text-ink">Tampil:</span>
              {[5, 10, 20].map((limit) => (
                <button
                  key={limit}
                  type="button"
                  onClick={() => handleLimitChange(limit)}
                  className={`px-2 py-0.5 rounded-md font-bold transition ${
                    itemsPerPage === limit ? "bg-ocean text-white shadow-sm" : "hover:text-ink hover:bg-steel/10"
                  }`}
                >
                  {limit}
                </button>
              ))}
            </div>

            {/* Toggle Bar / Pie */}
            <div className="flex items-center bg-steel/8 p-1 rounded-xl border border-steel/15 font-mono text-xs">
              <button
                type="button"
                onClick={() => setChartType("pie")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                  chartType === "pie" ? "bg-white text-ink shadow-sm" : "text-steel hover:text-ink"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                Pie Chart
              </button>
              <button
                type="button"
                onClick={() => setChartType("bar")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                  chartType === "bar" ? "bg-white text-ink shadow-sm" : "text-steel hover:text-ink"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Bar Chart
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Chart Display Container */}
        {chartType === "bar" ? (
          /* BAR CHART VIEW WITH HOVER & PAGINATION */
          <div className="space-y-4 py-2">
            <div className="space-y-4">
              {paginatedBarData.map((item, idx) => {
                const barPercent = Math.round((item.value / maxValue) * 100);

                return (
                  <div
                    key={idx}
                    className="space-y-1.5 font-mono text-xs group p-2 rounded-xl transition hover:bg-steel/5"
                  >
                    <div className="flex items-center justify-between text-ink">
                      <span className="font-bold flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        {item.label}
                      </span>
                      <span className="font-bold group-hover:scale-105 transition" style={{ color: item.color }}>
                        {item.formattedValue || `${item.value}`}
                      </span>
                    </div>
                    <div className="relative h-4 w-full bg-steel/10 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full transition-all duration-500 group-hover:brightness-110 shadow-sm"
                        style={{
                          width: `${Math.max(barPercent, 4)}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls Bar Chart */}
            {totalBarPages > 1 && (
              <div className="flex items-center justify-between border-t border-steel/10 pt-3 font-mono text-xs text-steel">
                <span>
                  Halaman <strong className="text-ink">{barPage}</strong> dari <strong className="text-ink">{totalBarPages}</strong> ({activeConfig.data.length} Total Data)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={barPage === 1}
                    onClick={() => setBarPage((prev) => Math.max(1, prev - 1))}
                    className="rounded-xl border border-steel/20 bg-white px-3 py-1 font-bold text-ink hover:bg-steel/5 disabled:opacity-40 transition"
                  >
                    &larr; Prev
                  </button>
                  <button
                    type="button"
                    disabled={barPage === totalBarPages}
                    onClick={() => setBarPage((prev) => Math.min(totalBarPages, prev + 1))}
                    className="rounded-xl border border-steel/20 bg-white px-3 py-1 font-bold text-ink hover:bg-steel/5 disabled:opacity-40 transition"
                  >
                    Next &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* PIE CHART VIEW WITH HOVER VALUE & LEGEND */
          <div className="flex flex-col md:flex-row items-center justify-around gap-8 py-4">
            {/* Donut / Pie Render */}
            <div className="relative flex items-center justify-center shrink-0">
              <div
                className="w-48 h-48 sm:w-56 sm:h-56 rounded-full shadow-inner border border-steel/15 transition-all duration-500 flex items-center justify-center"
                style={{ background: pieGradientStops }}
              >
                {/* Center hole displaying Hover Value */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white shadow-md flex flex-col items-center justify-center font-mono text-center p-2 transition-all">
                  {hoveredSlice ? (
                    <>
                      <span className="text-[10px] text-steel truncate max-w-[90px]">{hoveredSlice.label}</span>
                      <span className="text-sm font-bold truncate max-w-[100px]" style={{ color: hoveredSlice.color }}>
                        {hoveredSlice.formattedValue || `${hoveredSlice.value}`}
                      </span>
                      <span className="text-[9px] text-steel">
                        ({Math.round((hoveredSlice.value / totalValueSum) * 100)}%)
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] text-steel">Total Combined</span>
                      <span className="text-base font-bold text-ink">{totalValueSum}</span>
                      <span className="text-[9px] text-steel/60">Arahkan kursor</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Pie Legend Breakdown with Interactive Hover */}
            <div className="space-y-2.5 font-mono text-xs flex-1 max-w-md">
              {activeConfig.data.slice(0, itemsPerPage).map((item, idx) => {
                const percent = Math.round((item.value / totalValueSum) * 100);
                const isHovered = hoveredSlice?.label === item.label;

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredSlice(item)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    className={`p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${
                      isHovered
                        ? "bg-white border-ocean ring-2 ring-sky/30 shadow-md translate-x-1"
                        : "bg-steel/5 border-steel/10 hover:bg-white hover:border-steel/20"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: item.color }} />
                      <span className="font-bold text-ink truncate">{item.label}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-ink block" style={{ color: isHovered ? item.color : undefined }}>
                        {item.formattedValue || `${item.value}`}
                      </span>
                      <span className="text-[10px] text-steel">({percent}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
