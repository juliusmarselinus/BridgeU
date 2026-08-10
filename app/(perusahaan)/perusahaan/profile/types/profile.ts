export interface PerusahaanProfileDB {
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
  alamat_lengkap?: string;
  situs_web?: string;
  ukuran_perusahaan?: string;
  tahun_berdiri?: number;
  email?: string;
}

export interface ProfileFormData {
  nama_perusahaan: string;
  nib: string;
  deskripsi_perusahaan: string;
  sektor_id: number;
  kota_id: number;
  situs_web: string;
  alamat_lengkap: string;
  ukuran_perusahaan: string;
  tahun_berdiri: number;
}

export interface OptionItem {
  id: number;
  label: string;
}