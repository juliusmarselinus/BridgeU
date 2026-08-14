import { Kolaborasi } from "@/lib/types";

export type StoredUser = {
  nama: string;
  universitas: string;
  prodi: string;
  semester?: string;
};

export type FilterType = "semua" | "Magang" | "Akademik";
export type FilterSort = "terbaru" | "match_desc" | "match_asc";

export function initials(name: string) {
  if (!name) return "PT";
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

/** Map raw Supabase row -> Kolaborasi (termasuk raw id buat matching) */
export function mapDbRow(row: any): Kolaborasi {
  return {
    id: row.id,
    perusahaan: row.perusahaan?.nama_perusahaan ?? "Mitra Perusahaan",
    perusahaanId: row.perusahaan_id,
    judul: row.judul,
    tipe: row.tipe === "Magang" ? "Magang" : "Akademik",
    kategori: row.kategori?.nama_kategori ?? "Kolaborasi",
    deskripsi: row.deskripsi,
    lokasi: row.kota?.nama_kota ?? "-",
    batasWaktu: row.batas_waktu
      ? new Date(row.batas_waktu).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "-",
    statusModerasi:
      row.status_moderasi === "Disetujui"
        ? "Disetujui"
        : row.status_moderasi === "Ditolak"
        ? "Ditolak"
        : "Menunggu",
    tags: row.kolaborasi_skills
      ? row.kolaborasi_skills.map((ks: any) => ks.skills?.nama_skill).filter(Boolean)
      : [],
    tingkatKesulitan:
      row.tingkat_kesulitan === "Pemula"
        ? "Pemula"
        : row.tingkat_kesulitan === "Lanjutan"
        ? "Lanjutan"
        : "Menengah",
    rekomendasiProdi: row.kolaborasi_target_prodi
      ? row.kolaborasi_target_prodi.map((kp: any) => kp.program_studi?.nama_prodi).filter(Boolean)
      : [],
    gajiStipend: row.gaji_stipend ?? undefined,
    slot: row.slot ?? null,

    skillIds: row.kolaborasi_skills
      ? row.kolaborasi_skills.map((ks: any) => ks.skill_id).filter((v: any) => v != null)
      : [],
    kategoriMinatIds: row.kolaborasi_kategori_minat
      ? row.kolaborasi_kategori_minat.map((km: any) => km.kategori_id).filter((v: any) => v != null)
      : [],
    prodiIds: row.kolaborasi_target_prodi
      ? row.kolaborasi_target_prodi.map((kp: any) => kp.prodi_id).filter((v: any) => v != null)
      : [],
  };
}
