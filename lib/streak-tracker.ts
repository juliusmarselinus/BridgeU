/**
 * Helper Logika Perhitungan & Update Streak Keaktifan Mahasiswa (BridgeU System)
 */

export function calculateUpdatedStreak(
  currentStreak: number,
  lastActiveAt: string | null
): { newStreak: number; newLastActiveAt: string; updated: boolean } {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  if (!lastActiveAt) {
    return {
      newStreak: 1,
      newLastActiveAt: now.toISOString(),
      updated: true,
    };
  }

  const lastDate = new Date(lastActiveAt);
  const lastDateStr = lastDate.toISOString().split("T")[0];

  // Hitung selisih hari
  const diffTime = Math.abs(now.getTime() - lastDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (todayStr === lastDateStr) {
    // Sudah aktif hari ini, streak tetap sama
    return {
      newStreak: currentStreak <= 0 ? 1 : currentStreak,
      newLastActiveAt: lastActiveAt,
      updated: currentStreak <= 0,
    };
  }

  // Jika aktif kemarin (selisih 1 hari atau tanggal kemarin), tambah 1 streak
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (lastDateStr === yesterdayStr || diffDays <= 1) {
    return {
      newStreak: currentStreak + 1,
      newLastActiveAt: now.toISOString(),
      updated: true,
    };
  }

  // Jika bolos lebih dari 1 hari, reset streak ke 1 hari (hari ini aktif)
  return {
    newStreak: 1,
    newLastActiveAt: now.toISOString(),
    updated: true,
  };
}
