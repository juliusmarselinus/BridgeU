import { supabase } from "@/lib/supabase";
import { PelamarDetail, ProyekPelamarSummary, StatusLamaran } from "../types/pelamar";

export const pelamarService = {
  // 1. Fetch seluruh proyek milik perusahaan beserta pendaftaran & data mahasiswa
  async fetchProyekDanPelamar(perusahaanId: string): Promise<ProyekPelamarSummary[]> {
    const { data, error } = await supabase
      .from("kolaborasi")
      .select(`
        id,
        judul,
        tipe,
        deskripsi,
        status_moderasi,
        slot,
        kategori_minat:kategori_id ( nama_kategori ),
        pendaftaran_kolaborasi (
          id,
          kolaborasi_id,
          mahasiswa_id,
          tanggal_daftar,
          status,
          catatan_perusahaan,
          mahasiswa_profiles (
            nama_lengkap,
            semester,
            ringkasan_self,
            foto_url,
            reputation_score,
            universitas ( nama_universitas ),
            program_studi ( nama_prodi )
          )
        )
      `)
      .eq("perusahaan_id", perusahaanId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal mengambil data proyek & pelamar:", error.message);
      return [];
    }

    return (data || []).map((proyek: any) => {
      const pelamarList: PelamarDetail[] = (proyek.pendaftaran_kolaborasi || []).map((p: any) => {
        const mProfile = p.mahasiswa_profiles;
        return {
          id: p.id,
          kolaborasi_id: p.kolaborasi_id,
          mahasiswa_id: p.mahasiswa_id,
          nama_lengkap: mProfile?.nama_lengkap || "Mahasiswa",
          universitas: mProfile?.universitas?.nama_universitas || "Universitas Tidak Diketahui",
          program_studi: mProfile?.program_studi?.nama_prodi || "Program Studi Tidak Diketahui",
          semester: mProfile?.semester || "-",
          ringkasan_self: mProfile?.ringkasan_self || "Tidak ada deskripsi profil.",
          foto_url: mProfile?.foto_url,
          reputation_score: mProfile?.reputation_score || 0,
          tanggal_daftar: p.tanggal_daftar,
          status: p.status,
          catatan_perusahaan: p.catatan_perusahaan,
        };
      });

      return {
        id: proyek.id,
        judul: proyek.judul,
        tipe: proyek.tipe,
        nama_kategori: proyek.kategori_minat?.nama_kategori || "Umum",
        deskripsi: proyek.deskripsi,
        status_moderasi: proyek.status_moderasi,
        slot: proyek.slot || 0,
        pelamar_list: pelamarList,
      };
    });
  },

  // 2. Update status pendaftaran mahasiswa
  async updateStatusPelamar(
    pendaftaranId: string,
    status: StatusLamaran,
    catatan?: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from("pendaftaran_kolaborasi")
      .update({
        status,
        catatan_perusahaan: catatan || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", pendaftaranId);

    if (error) {
      console.error("Gagal memperbarui status pelamar:", error.message);
      return false;
    }

    return true;
  },
};