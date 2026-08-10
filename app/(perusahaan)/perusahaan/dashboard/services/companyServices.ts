import { supabase } from "@/lib/supabase";
import {
  StoredCompany,
  KolaborasiWithMeta,
  Pelamar,
  KolaborasiFormData,
  KategoriMinatOption,
} from "../types/company";

export const companyService = {
  // Fetch Profil Perusahaan Mitra
  async fetchCompanyProfile(): Promise<StoredCompany | null> {
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
      deskripsi_perusahaan: data.deskripsi_perusahaan,
      status_verifikasi: data.status_verifikasi,
      sektor_id: data.sektor_id,
      kota_id: data.kota_id,
      nama_sektor: data.sektor_perusahaan?.nama_sektor,
      nama_kota: data.kota?.nama_kota,
      logo_url: data.logo_url,
      situs_web: data.situs_web,
    };
  },

  // Fetch Daftar Kategori Minat (Dropdown Modal Form)
  async fetchKategoriMinat(): Promise<KategoriMinatOption[]> {
    const { data, error } = await supabase
      .from("kategori_minat")
      .select("id, nama_kategori")
      .order("nama_kategori", { ascending: true });

    if (error) {
      console.error("Gagal mengambil daftar kategori minat:", error.message);
      return [];
    }

    return data || [];
  },

  // Fetch Daftar Proyek Kolaborasi Perusahaan
  async fetchKolaborasiList(perusahaanId: string): Promise<KolaborasiWithMeta[]> {
    const { data, error } = await supabase
      .from("kolaborasi")
      .select(`
        *,
        kategori_minat ( nama_kategori ),
        perusahaan_profiles ( nama_perusahaan ),
        pendaftaran_kolaborasi ( id )
      `)
      .eq("perusahaan_id", perusahaanId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal mengambil data kolaborasi:", error.message);
      return [];
    }

    return (data || []).map((item) => ({
      id: item.id,
      perusahaan_id: item.perusahaan_id,
      judul: item.judul,
      tipe: item.tipe,
      kategori_id: item.kategori_id,
      nama_kategori: item.kategori_minat?.nama_kategori || "Umum",
      deskripsi: item.deskripsi,
      lokasi: item.lokasi,
      batas_waktu: item.batas_waktu,
      status_moderasi: item.status_moderasi,
      tingkat_kesulitan: item.tingkat_kesulitan,
      gaji_stipend: item.gaji_stipend,
      perusahaan_nama: item.perusahaan_profiles?.nama_perusahaan,
      pelamar_count: item.pendaftaran_kolaborasi?.length || 0,
    }));
  },

  // Fetch Daftar Pelamar Proyek
  async fetchPelamarList(perusahaanId: string): Promise<Pelamar[]> {
    const { data, error } = await supabase
      .from("pendaftaran_kolaborasi")
      .select(`
        *,
        mahasiswa_profiles ( nama_lengkap ),
        kolaborasi!inner ( perusahaan_id )
      `)
      .eq("kolaborasi.perusahaan_id", perusahaanId);

    if (error) {
      console.error("Gagal mengambil daftar pelamar:", error.message);
      return [];
    }

    return (data || []).map((item) => ({
      id: item.id,
      kolaborasi_id: item.kolaborasi_id,
      mahasiswa_id: item.mahasiswa_id,
      nama_mahasiswa: item.mahasiswa_profiles?.nama_lengkap || "Mahasiswa",
      tanggal_daftar: item.tanggal_daftar,
      status: item.status,
      catatan_perusahaan: item.catatan_perusahaan,
    }));
  },

  // Tambah Proyek Kolaborasi Baru
  async createKolaborasi(
    formData: KolaborasiFormData,
    perusahaanId: string
  ): Promise<KolaborasiWithMeta | null> {
    const payload = {
      perusahaan_id: perusahaanId,
      judul: formData.judul,
      tipe: formData.tipe,
      kategori_id: formData.kategori_id,
      deskripsi: formData.deskripsi,
      lokasi: formData.lokasi,
      batas_waktu: formData.batas_waktu,
      tingkat_kesulitan: formData.tingkat_kesulitan,
      gaji_stipend: formData.gaji_stipend || null,
      status_moderasi: "Menunggu",
    };

    const { data, error } = await supabase
      .from("kolaborasi")
      .insert([payload])
      .select(`
        *,
        kategori_minat ( nama_kategori )
      `)
      .single();

    if (error) {
      console.error("Gagal membuat kolaborasi baru:", error.message);
      return null;
    }

    return {
      id: data.id,
      perusahaan_id: data.perusahaan_id,
      judul: data.judul,
      tipe: data.tipe,
      kategori_id: data.kategori_id,
      nama_kategori: data.kategori_minat?.nama_kategori,
      deskripsi: data.deskripsi,
      lokasi: data.lokasi,
      batas_waktu: data.batas_waktu,
      status_moderasi: data.status_moderasi,
      tingkat_kesulitan: data.tingkat_kesulitan,
      gaji_stipend: data.gaji_stipend,
      pelamar_count: 0,
    };
  },

  // Hapus Proyek Kolaborasi
  async deleteKolaborasi(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("kolaborasi")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Gagal menghapus kolaborasi:", error.message);
      return false;
    }

    return true;
  },
};