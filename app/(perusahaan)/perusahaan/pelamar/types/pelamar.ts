import { KolaborasiTipe, ModerasiStatus } from "../../dashboard/types/company";

export type StatusLamaran = "Menunggu" | "Diproses" | "Diterima" | "Evaluasi" | "Revisi" | "Minta Revisi" | "Ditolak" | "Selesai";

export interface PelamarDetail {
  id: string; // uuid pendaftaran_kolaborasi
  kolaborasi_id: string;
  mahasiswa_id: string;
  nama_lengkap: string;
  universitas: string;
  program_studi: string;
  semester: string;
  ringkasan_self?: string;
  foto_url?: string;
  reputation_score: number;
  tanggal_daftar: string;
  status: StatusLamaran;
  catatan_perusahaan?: string;
  url_portofolio_dokumen?: string;
  url_hasil_kolaborasi?: string;
  catatan_hasil_kolaborasi?: string;
  riwayat_pengumpulan?: any[];
  ratings?: number | null;
  tujuan_mengajukan?: string | null;
  ketersediaan?: string | null;
  tanggal_mulai_diinginkan?: string | null;
  url_bukti_bayar?: string | null;
  status_pembayaran?: string | null;
}

export interface ProyekPelamarSummary {
  id: string; // uuid kolaborasi
  judul: string;
  tipe: KolaborasiTipe;
  nama_kategori: string;
  deskripsi: string;
  status_moderasi: ModerasiStatus;
  slot?: number;
  pelamar_list: PelamarDetail[];
}