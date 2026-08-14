import { supabase } from "@/lib/supabase";
import { Kolaborasi } from "@/lib/types";
import { mapDbRow } from "../types/kolaborasi";

export async function fetchKolaborasiFromSupabase(): Promise<Kolaborasi[]> {
  const { data, error } = await supabase
    .from("kolaborasi")
    .select(`
      id, judul, tipe, deskripsi, lokasi_id, batas_waktu, status_moderasi,
      tingkat_kesulitan, gaji_stipend, perusahaan_id, slot,
      perusahaan:perusahaan_id ( nama_perusahaan ),
      kategori:kategori_id ( nama_kategori ),
      kota:lokasi_id ( nama_kota ),
      kolaborasi_skills ( skill_id, skills ( nama_skill ) ),
      kolaborasi_kategori_minat ( kategori_id ),
      kolaborasi_target_prodi ( prodi_id, program_studi:prodi_id ( nama_prodi ) )
    `)
    .eq("status_moderasi", "Disetujui")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal memuat kolaborasi dari Supabase:", error.message);
    return [];
  }

  return (data || []).map(mapDbRow);
}
