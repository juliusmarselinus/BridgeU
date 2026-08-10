import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  fetchDashboardDataFromApi,
  fetchUserProfileFromApi,
  getStoredPengajuan,
} from "../services/dashboard.service";
import type {
  StoredUser,
  Pengajuan,
  RecommendedProject,
  UserBadge,
  DashboardStats,
} from "../types/dashboard";

const defaultRecommendations: RecommendedProject[] = [
  {
    id: "rec-1",
    judul: "Optimasi UI/UX & Redesign E-Commerce Mobile App",
    perusahaan: "PT Digital Innovate Indonesia",
    kategori: "UI/UX & System Design",
    matchScore: 95,
    tipe: "Studi Kasus Akademik",
  },
  {
    id: "rec-2",
    judul: "Analisis Sentimen Data Pelanggan Berbasis Machine Learning",
    perusahaan: "DataTech Nusantara",
    kategori: "Data Science & Analytics",
    matchScore: 88,
    tipe: "Riset Industri",
  },
];

const defaultBadges: UserBadge[] = [
  { iconType: "rocket", title: "Pionir Kolaborasi", desc: "Mengirim pengajuan pertama" },
  { iconType: "academic", title: "Akademisi Aktif", desc: "Terhubung dengan industri" },
  { iconType: "lightning", title: "Quick Learner", desc: "Profil terverifikasi 100%" },
];

export function useDashboard() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [pengajuan, setPengajuan] = useState<Pengajuan[]>([]);
  const [recommendedProjects, setRecommendedProjects] = useState<RecommendedProject[]>(defaultRecommendations);
  const [userBadges, setUserBadges] = useState<UserBadge[]>(defaultBadges);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/?auth=login");
        return;
      }

      setAuthChecked(true);

      const dashboardRes = await fetchDashboardDataFromApi(session.access_token);
      if (dashboardRes && dashboardRes.user) {
        setUser(dashboardRes.user);
        if (dashboardRes.pengajuan && dashboardRes.pengajuan.length > 0) {
          setPengajuan(dashboardRes.pengajuan);
        } else {
          setPengajuan(getStoredPengajuan());
        }
        if (dashboardRes.recommendedProjects) {
          setRecommendedProjects(dashboardRes.recommendedProjects);
        }
        if (dashboardRes.userBadges) {
          setUserBadges(dashboardRes.userBadges);
        }
      } else {
        const profile = await fetchUserProfileFromApi(session.access_token);
        if (profile) {
          setUser(profile);
        }
        setPengajuan(getStoredPengajuan());
      }

      setLoading(false);
    };

    init();
  }, [router]);

  const total = pengajuan.length;
  const menunggu = pengajuan.filter((p) => p.status === "Menunggu").length;
  const diterima = pengajuan.filter((p) => p.status === "Diterima").length;
  const level = Math.floor(total / 2) + 1;
  const progressPercent = Math.min(((total % 2) / 2) * 100, 100);
  const sisaMenujuLevel = total % 2 === 0 ? 2 : 1;

  const stats: DashboardStats = {
    total,
    menunggu,
    diterima,
    level,
    progressPercent,
    sisaMenujuLevel,
  };

  return {
    authChecked,
    loading,
    user,
    pengajuan,
    recommendedProjects,
    userBadges,
    stats,
  };
}
