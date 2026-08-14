import { useState, useEffect } from "react";
import { AutoAchievement, TrackerSummary, MahasiswaProfileInfo } from "../types/tracker";
import { fetchStudentPortfolioTrackerData } from "../services/trackerService";

export function usePortfolioTracker() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<MahasiswaProfileInfo | null>(null);
  const [achievements, setAchievements] = useState<AutoAchievement[]>([]);
  const [summary, setSummary] = useState<TrackerSummary | null>(null);
  const [filterType, setFilterType] = useState<"Semua" | "Magang" | "Akademik">("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchStudentPortfolioTrackerData();
      setProfile(data.profile);
      setAchievements(data.achievements);
      setSummary(data.summary);
      setLoading(false);
    }
    loadData();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, searchQuery]);

  const filteredAchievements = achievements.filter((item) => {
    const matchesFilter = filterType === "Semua" || item.tipe === filterType;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.judulKolaborasi.toLowerCase().includes(q) ||
      item.perusahaan.toLowerCase().includes(q) ||
      item.skillsAcquired.some((s) => s.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredAchievements.length / itemsPerPage) || 1;
  const paginatedAchievements = filteredAchievements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    loading,
    profile,
    achievements: paginatedAchievements,
    totalCount: filteredAchievements.length,
    summary,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
  };
}
