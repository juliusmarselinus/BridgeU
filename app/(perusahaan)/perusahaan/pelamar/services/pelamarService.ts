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
          url_portofolio_dokumen,
          mahasiswa_profiles (
            nama_lengkap,
            semester,
            ringkasan_self,
            foto_url,
            reputation_score,
            universitas ( nama_universitas ),
            program_studi ( nama_prodi )
          ),
          riwayat_pengumpulan_kolaborasi (
            id,
            versi,
            url_hasil,
            catatan_mahasiswa,
            evaluasi_perusahaan,
            status_evaluasi,
            created_at
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
        const riwayat = (p.riwayat_pengumpulan_kolaborasi || []).sort(
          (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        const latestSubmission = riwayat[0] || null;

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
          catatan_perusahaan: latestSubmission?.evaluasi_perusahaan || p.catatan_perusahaan,
          url_portofolio_dokumen: p.url_portofolio_dokumen,
          url_hasil_kolaborasi: latestSubmission?.url_hasil,
          catatan_hasil_kolaborasi: latestSubmission?.catatan_mahasiswa,
          riwayat_pengumpulan: riwayat,
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

  // 2. Update status pendaftaran mahasiswa dan simpan evaluasi perusahaan ke riwayat terbaru
  async updateStatusPelamar(
    pendaftaranId: string,
    status: StatusLamaran,
    catatan?: string
  ): Promise<boolean> {
    const nowIso = new Date().toISOString();

    const { error } = await supabase
      .from("pendaftaran_kolaborasi")
      .update({
        status,
        catatan_perusahaan: catatan || null,
        updated_at: nowIso,
      })
      .eq("id", pendaftaranId);

    if (error) {
      console.error("Gagal memperbarui status pelamar:", error.message);
      return false;
    }

    if (catatan) {
      // Ambil entri riwayat pengumpulan terbaru untuk pendaftaran_id ini
      const { data: latestRiwayat } = await supabase
        .from("riwayat_pengumpulan_kolaborasi")
        .select("id")
        .eq("pendaftaran_id", pendaftaranId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestRiwayat) {
        await supabase
          .from("riwayat_pengumpulan_kolaborasi")
          .update({
            evaluasi_perusahaan: catatan,
            status_evaluasi: status,
          })
          .eq("id", latestRiwayat.id);
      }
    }

    return true;
  },
};