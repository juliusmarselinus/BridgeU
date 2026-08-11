import { supabase } from "@/lib/supabase";
import { AdminKolaborasiItem, ModerasiStatus } from "../types";

export const kolaborasiService = {
  async fetchKolaborasiList(): Promise<AdminKolaborasiItem[]> {
    try {
      const { data, error } = await supabase
        .from("kolaborasi")
        .select(`
          id,
          perusahaan_id,
          judul,
          tipe,
          deskripsi,
          batas_waktu,
          status_moderasi,
          tingkat_kesulitan,
          gaji_stipend,
          slot,
          perusahaan_profiles ( nama_perusahaan ),
          kategori_minat:kategori_id ( nama_kategori ),
          kota ( nama_kota )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching admin kolaborasi list:", error.message);
        return [];
      }

      return (data || []).map((item: any) => ({
        id: item.id,
        perusahaan_id: item.perusahaan_id,
        perusahaan_nama: item.perusahaan_profiles?.nama_perusahaan || "Perusahaan Anonim",
        judul: item.judul,
        tipe: item.tipe,
        nama_kategori: item.kategori_minat?.nama_kategori || "Umum",
        deskripsi: item.deskripsi,
        nama_kota: item.kota?.nama_kota || "Remote/Luar Kota",
        batas_waktu: item.batas_waktu,
        status_moderasi: item.status_moderasi,
        tingkat_kesulitan: item.tingkat_kesulitan,
        gaji_stipend: item.gaji_stipend,
        slot: item.slot,
      }));
    } catch (err) {
      console.error("Failed to fetch collaboration list:", err);
      return [];
    }
  },

  async updateModerasiStatus(id: string, status: ModerasiStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("kolaborasi")
        .update({ status_moderasi: status })
        .eq("id", id);

      if (error) {
        console.error(`Error updating moderation status to ${status}:`, error.message);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Failed to update moderation status:", err);
      return false;
    }
  }
};
