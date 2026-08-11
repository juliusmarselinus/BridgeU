export type ModerasiStatus = "Menunggu" | "Disetujui" | "Ditolak";
export type KolaborasiTipe = "Akademik" | "Magang";

export interface AdminKolaborasiItem {
  id: string;
  perusahaan_id: string;
  perusahaan_nama: string;
  judul: string;
  tipe: KolaborasiTipe;
  nama_kategori: string;
  deskripsi: string;
  nama_kota: string;
  batas_waktu: string;
  status_moderasi: ModerasiStatus;
  tingkat_kesulitan?: string;
  gaji_stipend?: string;
  slot?: number;
}
