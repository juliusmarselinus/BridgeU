import { supabase } from "@/lib/supabase";
import { ManagedUser, UserStatus } from "../types";

export const penggunaService = {
  async fetchUserList(): Promise<ManagedUser[]> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select(`
          id,
          email,
          role,
          status,
          created_at,
          mahasiswa_profiles:mahasiswa_profiles!user_id (
            nama_lengkap,
            universitas:universitas_id ( nama_universitas ),
            program_studi:prodi_id ( nama_prodi, jenjang )
          ),
          perusahaan_profiles:perusahaan_profiles!user_id (
            nama_perusahaan,
            sektor_perusahaan:sektor_id ( nama_sektor ),
            kota:kota_id ( nama_kota )
          )
        `)
        .neq("role", "admin")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching admin users list:", error.message);
        return [];
      }

      return (data || []).map((item: any) => {
        let nama = "Pengguna Tanpa Nama";
        let detail = "Detail tidak tersedia";

        if (item.role === "mahasiswa" && item.mahasiswa_profiles) {
          const profile = item.mahasiswa_profiles;
          nama = profile.nama_lengkap || nama;
          const univ = profile.universitas?.nama_universitas || "Universitas Lain";
          const prodi = profile.program_studi?.nama_prodi || "Umum";
          const jenjang = profile.program_studi?.jenjang || "S1";
          detail = `${univ} - ${jenjang} ${prodi}`;
        } else if (item.role === "perusahaan" && item.perusahaan_profiles) {
          const profile = item.perusahaan_profiles;
          nama = profile.nama_perusahaan || nama;
          const sektor = profile.sektor_perusahaan?.nama_sektor || "Umum";
          const kota = profile.kota?.nama_kota || "Remote/Luar Kota";
          detail = `Sektor: ${sektor} • Kota: ${kota}`;
        }

        const dateStr = item.created_at
          ? new Date(item.created_at).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "Baru";

        // Map database status ('ditangguhkan' / 'suspended') to UI status ('Suspended' / 'Aktif')
        const uiStatus: UserStatus =
          item.status?.toLowerCase() === "ditangguhkan" || item.status?.toLowerCase() === "suspended"
            ? "Suspended"
            : "Aktif";

        return {
          id: item.id,
          nama,
          email: item.email || "-",
          role: item.role === "perusahaan" ? "Perusahaan" : "Mahasiswa",
          status: uiStatus,
          detail,
          tanggalGabung: dateStr,
        };
      });
    } catch (err) {
      console.error("Failed to fetch user list:", err);
      return [];
    }
  },

  async toggleUserStatus(id: string, currentUiStatus: UserStatus): Promise<boolean> {
    if (currentUiStatus === "Aktif") {
      return suspendUser(id);
    } else {
      return reactivateUser(id);
    }
  }
};

export async function suspendUser(targetUserId: string) {
  const { data, error } = await supabase
    .from("users")
    .update({ 
      status: "ditangguhkan",
      updated_at: new Date().toISOString()
    })
    .eq("id", targetUserId);

  if (error) {
    console.error("Gagal menangguhkan pengguna:", error.message);
    return false;
  }

  return true;
}

export async function reactivateUser(targetUserId: string) {
  const { data, error } = await supabase
    .from("users")
    .update({ 
      status: "aktif",
      updated_at: new Date().toISOString()
    })
    .eq("id", targetUserId);

  if (error) {
    console.error("Gagal mengaktifkan kembali pengguna:", error.message);
    return false;
  }

  return true;
}

