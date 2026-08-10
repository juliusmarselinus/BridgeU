import { supabase } from "@/lib/supabase";
import { PerusahaanProfileDB, ProfileFormData, OptionItem } from "../types/profile";

export const profileService = {
  // Fetch profil perusahaan milik user yang sedang login
  async fetchCompanyProfile(): Promise<PerusahaanProfileDB | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("perusahaan_profiles")
      .select(`
        *,
        sektor_perusahaan ( nama_sektor ),
        kota ( nama_kota )
      `)
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      console.error("Gagal mengambil profil perusahaan:", error?.message);
      return null;
    }

    return {
      user_id: data.user_id,
      nama_perusahaan: data.nama_perusahaan,
      nib: data.nib,
      deskripsi_perusahaan: data.deskripsi_perusahaan || "",
      status_verifikasi: data.status_verifikasi,
      sektor_id: data.sektor_id,
      kota_id: data.kota_id,
      nama_sektor: data.sektor_perusahaan?.nama_sektor || "Sektor Umum",
      nama_kota: data.kota?.nama_kota || "Kota Tidak Diketahui",
      logo_url: data.logo_url,
      alamat_lengkap: data.alamat_lengkap || "",
      situs_web: data.situs_web || "",
      ukuran_perusahaan: data.ukuran_perusahaan || "1-10",
      tahun_berdiri: data.tahun_berdiri || new Date().getFullYear(),
      email: user.email,
    };
  },

  // Update profil perusahaan di database
  async updateCompanyProfile(
    userId: string,
    formData: ProfileFormData
  ): Promise<boolean> {
    const { error } = await supabase
      .from("perusahaan_profiles")
      .update({
        nama_perusahaan: formData.nama_perusahaan,
        nib: formData.nib,
        deskripsi_perusahaan: formData.deskripsi_perusahaan,
        sektor_id: formData.sektor_id,
        kota_id: formData.kota_id,
        situs_web: formData.situs_web || null,
        alamat_lengkap: formData.alamat_lengkap || null,
        ukuran_perusahaan: formData.ukuran_perusahaan,
        tahun_berdiri: formData.tahun_berdiri || null,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) {
      console.error("Gagal memperbarui profil perusahaan:", error.message);
      return false;
    }

    return true;
  },

  // Fetch data dropdown opsi sektor perusahaan
  async fetchSektorOptions(): Promise<OptionItem[]> {
    const { data, error } = await supabase
      .from("sektor_perusahaan")
      .select("id, nama_sektor")
      .order("nama_sektor", { ascending: true });

    if (error) return [];
    return (data || []).map((item) => ({ id: item.id, label: item.nama_sektor }));
  },

  // Fetch data dropdown opsi kota
  async fetchKotaOptions(): Promise<OptionItem[]> {
    const { data, error } = await supabase
      .from("kota")
      .select("id, nama_kota")
      .order("nama_kota", { ascending: true });

    if (error) return [];
    return (data || []).map((item) => ({ id: item.id, label: item.nama_kota }));
  },
};