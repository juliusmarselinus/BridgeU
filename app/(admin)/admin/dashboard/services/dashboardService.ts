import { supabase } from "@/lib/supabase";
import { DashboardStats } from "../types";

export const dashboardService = {
  async fetchDashboardStats(): Promise<DashboardStats> {
    try {
      const [
        { count: totalUsersCount, error: userError },
        { count: totalKolaborasiCount, error: kolaborasiError },
        { count: pendingCount, error: pendingError },
        { count: verifiedCount, error: verifiedError }
      ] = await Promise.all([
        supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .in("role", ["mahasiswa", "perusahaan"]),
        supabase
          .from("kolaborasi")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("perusahaan_profiles")
          .select("*", { count: "exact", head: true })
          .eq("status_verifikasi", "Menunggu Verifikasi"),
        supabase
          .from("perusahaan_profiles")
          .select("*", { count: "exact", head: true })
          .eq("status_verifikasi", "Terverifikasi")
      ]);

      if (userError) console.error("Error fetching total users:", userError.message);
      if (kolaborasiError) console.error("Error fetching total kolaborasi:", kolaborasiError.message);
      if (pendingError) console.error("Error fetching pending companies:", pendingError.message);
      if (verifiedError) console.error("Error fetching verified companies:", verifiedError.message);

      return {
        totalUsers: totalUsersCount || 0,
        totalKolaborasi: totalKolaborasiCount || 0,
        pendingCompanies: pendingCount || 0,
        verifiedCompanies: verifiedCount || 0,
      };
    } catch (error) {
      console.error("Failed to fetch dashboard statistics:", error);
      return {
        totalUsers: 0,
        totalKolaborasi: 0,
        pendingCompanies: 0,
        verifiedCompanies: 0,
      };
    }
  }
};
