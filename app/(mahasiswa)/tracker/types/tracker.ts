export type AutoAchievement = {
  id: string;
  judulKolaborasi: string;
  perusahaan: string;
  tipe: "Akademik" | "Magang";
  kategori: string;
  tanggalSelesai: string;
  outcomeSummary: string;
  ratingScore: number; // e.g. 4.9 out of 5
  ratingStars: number;
  skillsAcquired: string[];
  verifiedByPerusahaan: boolean;
  suratRefUrl?: string;
};

export type TrackerSummary = {
  totalCompleted: number;
  averageRating: number;
  totalSkillsVerified: number;
  topSkills: { name: string; count: number }[];
};

export type MahasiswaProfileInfo = {
  nama: string;
  universitas: string;
  prodi: string;
  semester: string;
  foto?: string;
  xp: number;
};
