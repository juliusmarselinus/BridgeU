import { KategoriMinatOption, KotaOption } from "../../../dashboard/types/company";

export interface ProdiOption {
  id: number;
  nama_prodi: string;
  jenjang: string;
}

export interface SkillOption {
  id: number;
  nama_skill: string;
}

export interface BaruFormData {
  judul: string;
  tipe: "Akademik" | "Magang";
  selectedKategoriIds: number[];
  lokasi_id: number;
  tipe_lokasi: "Onsite" | "Hybrid" | "Remote";
  tingkat_kesulitan: "Pemula" | "Menengah" | "Lanjut";
  slot: number;
  batas_waktu: string;
  tanggal_selesai: string;
  gaji_stipend: string;
  deskripsi: string;
  selectedProdiIds: number[];
  selectedSkillIds: number[];
}
