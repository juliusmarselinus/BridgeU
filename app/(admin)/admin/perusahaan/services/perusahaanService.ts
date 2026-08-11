import { supabase } from "@/lib/supabase";
import { RegisteredCompany, VerifikasiStatus } from "../types";

export const perusahaanService = {
  async fetchCompanyList(): Promise<RegisteredCompany[]> {
    try {
      const { data, error } = await supabase
        .from("perusahaan_profiles")
        .select(`
          user_id,
          nama_perusahaan,
          nib,
          status_verifikasi,
          created_at,
          sektor_perusahaan:sektor_id ( nama_sektor ),
          kota:kota_id ( nama_kota ),
          users:users!user_id ( email )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching admin companies list:", error.message);
        return [];
      }

      return (data || []).map((item: any) => {
        const dateStr = item.created_at
          ? new Date(item.created_at).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "Baru";

        return {
          id: item.user_id,
          nama: item.nama_perusahaan || "Perusahaan Tanpa Nama",
          industri: item.sektor_perusahaan?.nama_sektor || "Umum",
          lokasi: item.kota?.nama_kota || "Remote",
          statusVerifikasi: item.status_verifikasi as VerifikasiStatus,
          nib: item.nib || "-",
          email: item.users?.email || "-",
          tanggalDaftar: dateStr,
        };
      });
    } catch (err) {
      console.error("Failed to fetch company list:", err);
      return [];
    }
  },

  async updateVerificationStatus(id: string, status: VerifikasiStatus): Promise<boolean> {
    try {
      const payload: any = {
        status_verifikasi: status,
      };

      if (status === "Terverifikasi") {
        payload.tanggal_verifikasi = new Date().toISOString();
      } else {
        payload.tanggal_verifikasi = null;
      }

      const { error } = await supabase
        .from("perusahaan_profiles")
        .update(payload)
        .eq("user_id", id);

      if (error) {
        console.error(`Error updating verification status for company ${id}:`, error.message);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Failed to update verification status:", err);
      return false;
    }
  }
};
