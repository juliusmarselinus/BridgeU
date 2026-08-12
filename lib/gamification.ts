/**
 * Gamification & Tier Utility Helper (BridgeU System)
 * 
 * Formula Level: Target XP Level n = 100 * n^2
 * XP (Experience Points): Indikator reputasi permanen untuk Level & Tier
 * Pts (Points): Mata uang virtual (rasio 1:1 dari perolehan XP) untuk Reward Store
 */

export type TierName = "Novice" | "Rising" | "Pro" | "Master" | "Legend";

export type TierInfo = {
  tier: TierName;
  title: string;
  badgeColor: string;
  borderColor: string;
  textColor: string;
};

/**
 * Menghitung level saat ini berdasarkan total XP
 * Formula: Level n dicapai ketika totalXP >= 100 * n^2
 */
export function calculateLevelFromXp(xp: number): number {
  if (xp <= 0) return 1;
  const level = Math.floor(Math.sqrt(xp / 100));
  return Math.max(1, level);
}

/**
 * Menghitung XP yang dibutuhkan untuk mencapai level tertentu
 * Target XP Level n = 100 * n^2
 */
export function getXpThresholdForLevel(level: number): number {
  return 100 * Math.pow(level, 2);
}

/**
 * Menghitung detail progres level (current level, progress %, sisa XP ke level berikutnya, pts)
 */
export function getGamificationMetrics(totalXp: number, pointsBalance?: number) {
  const currentLevel = calculateLevelFromXp(totalXp);
  const currentLevelXp = getXpThresholdForLevel(currentLevel);
  const nextLevelXp = getXpThresholdForLevel(currentLevel + 1);

  const xpInCurrentLevel = Math.max(0, totalXp - currentLevelXp);
  const xpSpanForNextLevel = nextLevelXp - currentLevelXp;
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpSpanForNextLevel) * 100));
  const sisaMenujuLevel = Math.max(0, nextLevelXp - totalXp);

  const pts = pointsBalance !== undefined ? pointsBalance : totalXp;
  const tierInfo = getTierFromLevel(currentLevel);

  return {
    level: currentLevel,
    totalXp,
    pts,
    currentLevelXp,
    nextLevelXp,
    xpInCurrentLevel,
    xpSpanForNextLevel,
    progressPercent,
    sisaMenujuLevel,
    tier: tierInfo.tier,
    tierTitle: tierInfo.title,
    tierInfo,
  };
}

/**
 * Menentukan Tier berdasarkan Level mahasiswa
 * - Novice (Lvl 1 - 4): 0 - 1.500 XP (Pendatang Baru)
 * - Rising (Lvl 5 - 8): 1.600 - 5.000 XP (Talenta Potensial)
 * - Pro (Lvl 9 - 12): 5.100 - 10.400 XP (Talenta Handal)
 * - Master (Lvl 13 - 16): 10.500 - 17.400 XP (Kontributor Utama)
 * - Legend (Lvl 17 - 20+): 17.500 - 25.000+ XP (Talenta Elit Siap Kerja)
 */
export function getTierFromLevel(level: number): TierInfo {
  if (level <= 4) {
    return {
      tier: "Novice",
      title: "Pendatang Baru",
      badgeColor: "bg-slate-100 text-slate-800",
      borderColor: "border-slate-300",
      textColor: "text-slate-700",
    };
  }
  if (level <= 8) {
    return {
      tier: "Rising",
      title: "Talenta Potensial",
      badgeColor: "bg-blue-100 text-blue-800",
      borderColor: "border-blue-300",
      textColor: "text-blue-700",
    };
  }
  if (level <= 12) {
    return {
      tier: "Pro",
      title: "Talenta Handal",
      badgeColor: "bg-purple-100 text-purple-800",
      borderColor: "border-purple-300",
      textColor: "text-purple-700",
    };
  }
  if (level <= 16) {
    return {
      tier: "Master",
      title: "Kontributor Utama",
      badgeColor: "bg-amber-100 text-amber-900",
      borderColor: "border-amber-400",
      textColor: "text-amber-800",
    };
  }
  return {
    tier: "Legend",
    title: "Talenta Elit Siap Kerja",
    badgeColor: "bg-emerald-100 text-emerald-900",
    borderColor: "border-emerald-400",
    textColor: "text-emerald-800",
  };
}

/**
 * Matriks Kalkulasi XP & Pts untuk Penyelesaian Proyek
 */
export function calculateProjectReward(tipe: string, tingkatKesulitan: string): { xp: number; pts: number } {
  const isMagang = tipe?.toLowerCase().includes("magang") || tipe?.toLowerCase().includes("internship");
  const diff = tingkatKesulitan?.toLowerCase() || "pemula";

  let baseAmount = 100;

  if (isMagang) {
    if (diff.includes("menengah")) baseAmount = 500;
    else if (diff.includes("lanjutan") || diff.includes("tinggi")) baseAmount = 800;
    else baseAmount = 300; // Pemula
  } else {
    // Akademik / Studi Kasus
    if (diff.includes("menengah")) baseAmount = 200;
    else if (diff.includes("lanjutan") || diff.includes("tinggi")) baseAmount = 350;
    else baseAmount = 100; // Pemula
  }

  return { xp: baseAmount, pts: baseAmount };
}
