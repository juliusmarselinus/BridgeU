import { useEffect, useState, useCallback } from "react";
import { DashboardStats } from "../types";
import { dashboardService } from "../services/dashboardService";

export function useAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalKolaborasi: 0,
    pendingCompanies: 0,
    verifiedCompanies: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    const data = await dashboardService.fetchDashboardStats();
    setStats(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    isLoading,
    refresh: loadStats,
  };
}
