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

export function useDashboard() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [pengajuan, setPengajuan] = useState<Pengajuan[]>([]);
  const [recommendedProjects, setRecommendedProjects] = useState<RecommendedProject[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [apiStats, setApiStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setUser(null);
        setPengajuan([]);
        router.replace("/?auth=login");
        return;
      }

      const storedUserId = localStorage.getItem("bridgeu_user_id");
      if (storedUserId && storedUserId !== session.user.id) {
        localStorage.removeItem("bridgeu_user");
        localStorage.removeItem("bridgeu_pengajuan");
      }
      localStorage.setItem("bridgeu_user_id", session.user.id);

      setAuthChecked(true);

      const dashboardRes = await fetchDashboardDataFromApi(session.access_token);
      if (dashboardRes && dashboardRes.user) {
        setUser(dashboardRes.user);
        setPengajuan(dashboardRes.pengajuan ?? []);
        setRecommendedProjects(dashboardRes.recommendedProjects ?? []);
        setUserBadges(dashboardRes.userBadges ?? []);
        if (dashboardRes.stats) {
          setApiStats(dashboardRes.stats);
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
  const xp = user?.xp ?? apiStats?.xp ?? 150;
  const level = Math.floor(xp / 100) + 1;
  const progressPercent = Math.min(xp % 100, 100);
  const sisaMenujuLevel = 100 - (xp % 100);
  const streakCount = user?.streakCount ?? apiStats?.streakCount ?? 5;
  const reputationScore = user?.reputationScore ?? apiStats?.reputationScore ?? 98;
  const responseRate = user?.responseRate ?? apiStats?.responseRate ?? 98.5;

  const stats: DashboardStats = {
    total,
    menunggu,
    diterima,
    level,
    progressPercent,
    sisaMenujuLevel,
    xp,
    streakCount,
    reputationScore,
    responseRate,
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
