export type ModerasiStatus = "Menunggu" | "Disetujui" | "Ditolak";
export type KolaborasiTipe = "Akademik" | "Magang";
export type TingkatKesulitan = "Pemula" | "Menengah" | "Lanjut";

export interface KategoriMinatOption {
  id: number;
  nama_kategori: string;
}

export interface KotaOption {
  id: number;
  nama_kota: string;
}

export interface StoredCompany {
  user_id: string;
  nama_perusahaan: string;
  nib: string;
  deskripsi_perusahaan?: string;
  status_verifikasi: string;
  sektor_id: number;
  kota_id: number;
  nama_sektor?: string;
  nama_kota?: string;
  logo_url?: string;
  situs_web?: string;
}

export interface KolaborasiWithMeta {
  id: string;
  perusahaan_id: string;
  judul: string;
  tipe: KolaborasiTipe;
  kategori_id: number;
  nama_kategori?: string;
  deskripsi: string;
  lokasi_id: number;
  nama_kota?: string;
  batas_waktu: string;
  tanggal_selesai?: string;
  status_moderasi: ModerasiStatus;
  tingkat_kesulitan?: TingkatKesulitan;
  gaji_stipend?: string;
  slot?: number;
  perusahaan_nama?: string;
  pelamar_count?: number;
  status_aktif?: string;
}

export interface KolaborasiFormData {
  judul: string;
  tipe: KolaborasiTipe;
  kategori_id: number;
  deskripsi: string;
  lokasi_id: number;
  batas_waktu: string;
  tanggal_selesai?: string;
  tingkat_kesulitan: TingkatKesulitan;
  gaji_stipend?: string;
  slot: number;
  status_aktif?: string;
}