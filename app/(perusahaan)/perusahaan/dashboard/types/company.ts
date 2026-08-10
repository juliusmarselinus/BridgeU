export type ModerasiStatus = "Menunggu" | "Disetujui" | "Ditolak";
export type KolaborasiTipe = "Akademik" | "Magang";
export type TingkatKesulitan = "Pemula" | "Menengah" | "Lanjut";

export interface KategoriMinatOption {
  id: number;
  nama_kategori: string;
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
  lokasi: string;
  batas_waktu: string;
  status_moderasi: ModerasiStatus;
  tingkat_kesulitan?: TingkatKesulitan;
  gaji_stipend?: string;
  perusahaan_nama?: string;
  pelamar_count?: number;
}

export interface Pelamar {
  id: string;
  kolaborasi_id: string;
  mahasiswa_id: string;
  nama_mahasiswa?: string;
  tanggal_daftar: string;
  status: "Menunggu" | "Diterima" | "Ditolak" | "Selesai";
  catatan_perusahaan?: string;
}

export interface KolaborasiFormData {
  judul: string;
  tipe: KolaborasiTipe;
  kategori_id: number;
  deskripsi: string;
  lokasi: string;
  batas_waktu: string;
  tingkat_kesulitan: TingkatKesulitan;
  gaji_stipend?: string;
}