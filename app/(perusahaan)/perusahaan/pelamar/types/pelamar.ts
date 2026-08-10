import { KolaborasiTipe, ModerasiStatus } from "../../dashboard/types/company";

export type StatusLamaran = "Menunggu" | "Diterima" | "Ditolak" | "Selesai";

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