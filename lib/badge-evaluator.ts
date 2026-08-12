/**
 * Evaluator Otomatis Kelayakan Unlock Badge Mahasiswa (BridgeU System)
 * Menguji kriteria kondisi untuk masing-masing kode badge sesuai skema `badges.sql` & `dbs.sql`
 */

export type StudentContextForBadges = {
  isProfileComplete?: boolean;
  totalPengajuan?: number;
  totalDiterima?: number;
  totalSelesai?: number;
  streakCount?: number;
  responseRate?: number;
  xp?: number;
  uniquePerusahaanCount?: number;
  categoriesCompleted?: string[];
  hasHighDifficultyCompleted?: boolean;
  hasInternshipCompleted?: boolean;
};

/**
 * Memeriksa apakah suatu badge layak dibuka (unlocked) berdasarkan context profil mahasiswa
 */
export function checkBadgeUnlockCondition(kodeBadge: string, ctx: StudentContextForBadges): boolean {
  const totalApply = ctx.totalPengajuan ?? 0;
  const totalAccept = ctx.totalDiterima ?? 0;
  const totalFinish = ctx.totalSelesai ?? 0;
  const streak = ctx.streakCount ?? 0;
  const xp = ctx.xp ?? 0;
  const respRate = ctx.responseRate ?? 0;
  const uniqueCompanies = ctx.uniquePerusahaanCount ?? 0;
  const categories = ctx.categoriesCompleted || [];

  switch (kodeBadge) {
    // A. PENGALAMAN & AKTIVITAS PERTAMA
    case "FIRST_PROFILE":
      return Boolean(ctx.isProfileComplete);
    case "FIRST_APPLY":
      return totalApply >= 1;
    case "FIRST_ACCEPT":
      return totalAccept >= 1;
    case "FIRST_FINISH":
      return totalFinish >= 1;
    case "FIRST_REVIEW":
      return totalFinish >= 1; // Mendapatkan evaluasi/ulasan pertama

    // B. PRODUKTIVITAS & KONSISTENSI
    case "PROJ_3":
      return totalFinish >= 3;
    case "PROJ_5":
      return totalFinish >= 5;
    case "PROJ_10":
      return totalFinish >= 10;
    case "STREAK_7":
      return streak >= 7;
    case "STREAK_30":
      return streak >= 30;

    // C. KATEGORI SPESIALISASI AKADEMIK & INDUSTRI
    case "CAT_COMMUNICATION":
      return categories.some((c) => /komunikasi|media|public relations|branding/i.test(c));
    case "CAT_BUSINESS":
      return categories.some((c) => /bisnis|pasar|manajemen/i.test(c));
    case "CAT_CREATIVE":
      return categories.some((c) => /kreatif|desain|video|merek/i.test(c));
    case "CAT_RESEARCH":
      return categories.some((c) => /riset|penelitian|akademik|survei/i.test(c));
    case "CAT_LEGAL":
      return categories.some((c) => /hukum|legal|kontrak/i.test(c));
    case "CAT_FINANCE":
      return categories.some((c) => /keuangan|audit|anggaran|finance/i.test(c));
    case "CAT_HR":
      return categories.some((c) => /sdm|hr|pelatihan|budaya/i.test(c));
    case "CAT_ESG":
      return categories.some((c) => /lingkungan|esg|sampah|keberlanjutan/i.test(c));
    case "CAT_EDUCATION":
      return categories.some((c) => /pendidikan|edukasi|pengajaran/i.test(c));
    case "CAT_SOCIAL":
      return categories.some((c) => /sosial|masyarakat|pengabdian/i.test(c));

    // D. KUALITAS PEKERJAAN & EVALUASI PERUSAHAAN
    case "PERFECT_SCORE":
      return totalFinish >= 1;
    case "FAST_DELIVERY":
      return totalFinish >= 1;
    case "ZERO_REVISION":
      return totalFinish >= 1;
    case "INNOVATION_HERO":
      return totalFinish >= 1;
    case "DETAILED_ANALYST":
      return totalFinish >= 1;

    // E. EXCELLENCE & SOFT SKILLS
    case "FAST_RESPONDER":
      return respRate >= 90;
    case "PROBLEM_SOLVER":
      return Boolean(ctx.hasHighDifficultyCompleted) || totalFinish >= 2;
    case "ADAPTIVE_TALENT":
      return categories.length >= 3;
    case "CRITICAL_THINKER":
      return totalFinish >= 1;
    case "PRESENTATION_PRO":
      return totalFinish >= 1;

    // F. TINGKAT INTERNSHIP & MAGANG
    case "INTERN_STARTER":
      return Boolean(ctx.hasInternshipCompleted) || totalFinish >= 1;
    case "INTERN_PRO":
      return Boolean(ctx.hasInternshipCompleted) || totalFinish >= 2;
    case "HIGH_STIPEND":
      return totalAccept >= 1;
    case "WORK_READY":
      return totalFinish >= 2;
    case "REHIRED_TALENT":
      return uniqueCompanies >= 1 && totalFinish >= 2;

    // G. GAMIFIKASI REPUTASI & XP LEVEL
    case "XP_1000":
      return xp >= 1000;
    case "XP_5000":
      return xp >= 5000;
    case "XP_10000":
      return xp >= 10000;
    case "NETWORK_BUILDER":
      return uniqueCompanies >= 3 || totalApply >= 3;
    case "COMMUNITY_HERO":
      return totalFinish >= 5;

    // H. SPESIALISASI PENULISAN & PUBLIKASI
    case "CASE_STUDY_MASTER":
      return totalFinish >= 3;
    case "REPORT_EXPERT":
      return totalFinish >= 1;
    case "POLICY_MAKER":
      return totalFinish >= 1;
    case "MARKET_RESEARCHER":
      return totalFinish >= 1;
    case "ESG_CONTRIBUTOR":
      return totalFinish >= 1;

    // I. SPESIALISASI DESAIN & KONTEN
    case "BRAND_BUILDER":
      return totalFinish >= 1;
    case "CAMPAIGN_HERO":
      return totalFinish >= 1;
    case "CONTENT_CREATOR":
      return totalFinish >= 1;
    case "INCLUSIVE_DESIGNER":
      return totalFinish >= 1;
    case "EDUTAINMENT_PRO":
      return totalFinish >= 1;

    default:
      return false;
  }
}
