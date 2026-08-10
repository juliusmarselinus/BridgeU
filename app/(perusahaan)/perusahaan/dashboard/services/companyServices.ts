import { supabase } from "@/lib/supabase";
import {
  StoredCompany,
  KolaborasiWithMeta,
  KolaborasiFormData,
  KategoriMinatOption,
  KotaOption,
} from "../types/company";

export const companyService = {
  // 1. Fetch Profile Perusahaan
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

  // 2. Fetch Opsi Kategori Minat
  async fetchKategoriMinat(): Promise<KategoriMinatOption[]> {
    const { data, error } = await supabase
      .from("kategori_minat")
      .select("id, nama_kategori")
      .order("nama_kategori", { ascending: true });

    if (error) {
      console.error("Gagal mengambil data kategori:", error.message);
      return [];
    }

    return data || [];
  },

  // 3. Fetch Opsi Kota
  async fetchKotaList(): Promise<KotaOption[]> {
    const { data, error } = await supabase
      .from("kota")
      .select("id, nama_kota")
      .order("nama_kota", { ascending: true });

    if (error) {
      console.error("Gagal mengambil data kota:", error.message);
      return [];
    }

    return data || [];
  },

  // 4. Fetch Daftar Kolaborasi milik Perusahaan
  async fetchKolaborasiList(perusahaanId: string): Promise<KolaborasiWithMeta[]> {
    const { data, error } = await supabase
      .from("kolaborasi")
      .select(`
        *,
        kategori_minat ( nama_kategori ),
        kota ( nama_kota ),
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
      lokasi_id: item.lokasi_id,
      nama_kota: item.kota?.nama_kota || "Tidak Diketahui",
      batas_waktu: item.batas_waktu,
      status_moderasi: item.status_moderasi,
      tingkat_kesulitan: item.tingkat_kesulitan,
      gaji_stipend: item.gaji_stipend,
      slot: item.slot,
      perusahaan_nama: item.perusahaan_profiles?.nama_perusahaan,
      pelamar_count: item.pendaftaran_kolaborasi?.length || 0,
    }));
  },

  // 5. Buat Proyek Kolaborasi Baru
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
      lokasi_id: formData.lokasi_id,
      batas_waktu: formData.batas_waktu,
      tingkat_kesulitan: formData.tingkat_kesulitan,
      gaji_stipend: formData.gaji_stipend || null,
      slot: formData.slot,
      status_moderasi: "Menunggu",
    };

    const { data, error } = await supabase
      .from("kolaborasi")
      .insert([payload])
      .select(`
        *,
        kategori_minat ( nama_kategori ),
        kota ( nama_kota )
      `)
      .single();

    if (error) {
      console.error("Gagal membuat kolaborasi:", error.message);
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
      lokasi_id: data.lokasi_id,
      nama_kota: data.kota?.nama_kota,
      batas_waktu: data.batas_waktu,
      status_moderasi: data.status_moderasi,
      tingkat_kesulitan: data.tingkat_kesulitan,
      gaji_stipend: data.gaji_stipend,
      slot: data.slot,
      pelamar_count: 0,
    };
  },

  // 6. Hapus Proyek Kolaborasi
  async deleteKolaborasi(id: string): Promise<boolean> {
    const { error } = await supabase.from("kolaborasi").delete().eq("id", id);

    if (error) {
      console.error("Gagal menghapus kolaborasi:", error.message);
      return false;
    }

    return true;
  },
};

// Tambahkan pada services/companyService.ts

export interface CreateFullKolaborasiPayload {
  judul: string;
  tipe: "Akademik" | "Magang";
  kategori_id: number;
  deskripsi: string;
  lokasi_id: number;
  batas_waktu: string;
  tingkat_kesulitan: "Pemula" | "Menengah" | "Lanjut";
  gaji_stipend?: string;
  slot: number;
  target_prodi_ids: number[];
  skill_ids: number[];
}

// Tambahkan metode ini ke objek companyService:
export const companyServiceExtended = {
  // Fetch Opsi Program Studi
  async fetchProdiList() {
    const { data, error } = await supabase
      .from("program_studi")
      .select("id, nama_prodi, jenjang")
      .order("nama_prodi", { ascending: true });

    if (error) {
      console.error("Gagal mengambil data prodi:", error.message);
      return [];
    }
    return data || [];
  },

  // Fetch Opsi Skills
  async fetchSkillsList() {
    const { data, error } = await supabase
      .from("skills")
      .select("id, nama_skill")
      .order("nama_skill", { ascending: true });

    if (error) {
      console.error("Gagal mengambil data skills:", error.message);
      return [];
    }
    return data || [];
  },

  // Insert Proyek Kolaborasi Lengkap dengan Target Prodi & Skills
  async createFullKolaborasi(payload: CreateFullKolaborasiPayload, perusahaanId: string) {
    // 1. Insert ke tabel kolaborasi
    const { data: newProyek, error: proyekError } = await supabase
      .from("kolaborasi")
      .insert([
        {
          perusahaan_id: perusahaanId,
          judul: payload.judul,
          tipe: payload.tipe,
          kategori_id: payload.kategori_id,
          deskripsi: payload.deskripsi,
          lokasi_id: payload.lokasi_id,
          batas_waktu: payload.batas_waktu,
          tingkat_kesulitan: payload.tingkat_kesulitan,
          gaji_stipend: payload.gaji_stipend || null,
          slot: payload.slot,
          status_moderasi: "Menunggu",
        },
      ])
      .select()
      .single();

    if (proyekError || !newProyek) {
      console.error("Gagal membuat proyek kolaborasi:", proyekError?.message);
      return false;
    }

    const kolaborasiId = newProyek.id;

    // 2. Insert relasi target prodi (kolaborasi_target_prodi)
    if (payload.target_prodi_ids.length > 0) {
      const prodiInserts = payload.target_prodi_ids.map((prodiId) => ({
        kolaborasi_id: kolaborasiId,
        prodi_id: prodiId,
      }));
      const { error: prodiError } = await supabase
        .from("kolaborasi_target_prodi")
        .insert(prodiInserts);

      if (prodiError) {
        console.error("Gagal memasukkan target prodi:", prodiError.message);
      }
    }

    // 3. Insert relasi skills (kolaborasi_skills)
    if (payload.skill_ids.length > 0) {
      const skillInserts = payload.skill_ids.map((skillId) => ({
        kolaborasi_id: kolaborasiId,
        skill_id: skillId,
      }));
      const { error: skillError } = await supabase
        .from("kolaborasi_skills")
        .insert(skillInserts);

      if (skillError) {
        console.error("Gagal memasukkan skills:", skillError.message);
      }
    }

    return true;
  },
};