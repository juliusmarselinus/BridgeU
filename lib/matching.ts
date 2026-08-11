import { supabase } from "@/lib/supabase";

/**
 * ============================================================
 * KONFIGURASI SCORING — gampang di-tweak dari sini
 * ============================================================
 */
export const MATCH_WEIGHTS = {
  skill: 0.5,
  minat: 0.3,
  prodi: 0.2,
};

/** Skor di bawah ini dianggap "kurang mirip", gak dimasukin ke rekomendasi */
export const MIN_MATCH_THRESHOLD = 0.4;

/** Kalau kolaborasi punya target prodi tertentu, dan prodi mahasiswa gak termasuk,
 *  anggap ini hard-filter (exclude), bukan cuma pengurang skor. */
export const PRODI_IS_HARD_FILTER = true;

/**
 * ============================================================
 * TYPES
 * ============================================================
 */
export type MahasiswaMatchProfile = {
  userId: string;
  prodiId: number | null;
  skillIds: number[];
  kategoriMinatIds: number[];
};

export type KolaborasiMatchInput = {
  skillIds: number[];
  kategoriMinatIds: number[];
  prodiIds: number[]; // dari kolaborasi_target_prodi, kosong = terbuka utk semua prodi
};

export type MatchResult = {
  score: number; // 0..1
  scorePercent: number; // 0..100, dibulatkan, buat ditampilin di UI
  prodiCocok: boolean;
  lolosThreshold: boolean;
};

/**
 * ============================================================
 * FETCH: profil mahasiswa yang lagi login (skills, minat, prodi)
 * Diambil langsung dari Supabase Auth session, BUKAN dari localStorage,
 * biar selalu sinkron dengan database.
 * ============================================================
 */
export async function fetchMahasiswaMatchProfile(): Promise<MahasiswaMatchProfile | null> {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    console.error("User belum login / gagal ambil session:", authError?.message);
    return null;
  }
  const userId = authData.user.id;

  const [{ data: profile, error: profileError }, { data: skillsRows }, { data: minatRows }] =
    await Promise.all([
      supabase
        .from("mahasiswa_profiles")
        .select("prodi_id")
        .eq("user_id", userId)
        .single(),
      supabase.from("mahasiswa_skills").select("skill_id").eq("mahasiswa_id", userId),
      supabase.from("mahasiswa_minat").select("kategori_id").eq("mahasiswa_id", userId),
    ]);

  if (profileError) {
    console.error("Gagal memuat mahasiswa_profiles:", profileError.message);
    return null;
  }

  return {
    userId,
    prodiId: profile?.prodi_id ?? null,
    skillIds: (skillsRows ?? []).map((r) => r.skill_id),
    kategoriMinatIds: (minatRows ?? []).map((r) => r.kategori_id),
  };
}

/**
 * ============================================================
 * SCORING — inti logic rekomendasi
 *
 * score = (skillScore * 0.5) + (minatScore * 0.3) + (prodiScore * 0.2)
 *
 * - skillScore = (skill kolaborasi yang dimiliki mahasiswa) / (total skill dibutuhkan)
 * - minatScore = (kategori minat yang overlap) / (total kategori minat kolaborasi)
 * - prodiScore = 1 kalau prodi mahasiswa termasuk target, 0 kalau tidak
 *                (kalau kolaborasi gak set target prodi sama sekali, dianggap terbuka -> prodiScore = 1)
 * ============================================================
 */
export function calculateMatchScore(
  kolab: KolaborasiMatchInput,
  profile: MahasiswaMatchProfile | null
): MatchResult {
  if (!profile) {
    return { score: 0, scorePercent: 0, prodiCocok: false, lolosThreshold: false };
  }

  // --- Skill ---
  const totalSkillDibutuhkan = kolab.skillIds.length;
  const skillCocok = kolab.skillIds.filter((id) => profile.skillIds.includes(id)).length;
  const skillScore = totalSkillDibutuhkan > 0 ? skillCocok / totalSkillDibutuhkan : 0;

  // --- Minat ---
  const totalMinatKolab = kolab.kategoriMinatIds.length;
  const minatCocok = kolab.kategoriMinatIds.filter((id) =>
    profile.kategoriMinatIds.includes(id)
  ).length;
  const minatScore = totalMinatKolab > 0 ? minatCocok / totalMinatKolab : 0;

  // --- Prodi ---
  const punyaTargetProdi = kolab.prodiIds.length > 0;
  const prodiCocok = !punyaTargetProdi || (profile.prodiId != null && kolab.prodiIds.includes(profile.prodiId));
  const prodiScore = prodiCocok ? 1 : 0;

  const rawScore =
    skillScore * MATCH_WEIGHTS.skill +
    minatScore * MATCH_WEIGHTS.minat +
    prodiScore * MATCH_WEIGHTS.prodi;

  const hardFilterBlocked = PRODI_IS_HARD_FILTER && punyaTargetProdi && !prodiCocok;
  const lolosThreshold = !hardFilterBlocked && rawScore >= MIN_MATCH_THRESHOLD;

  return {
    score: rawScore,
    scorePercent: Math.round(rawScore * 100),
    prodiCocok,
    lolosThreshold,
  };
}

/**
 * Helper: kasih skor + filter ke satu array kolaborasi sekaligus,
 * lalu urutkan dari yang paling mirip, opsional ambil top N saja.
 */
export function rankKolaborasiByMatch<T extends KolaborasiMatchInput>(
  items: T[],
  profile: MahasiswaMatchProfile | null,
  options?: { topN?: number; onlyPassingThreshold?: boolean }
): (T & { match: MatchResult })[] {
  const withScore = items.map((item) => ({
    ...item,
    match: calculateMatchScore(item, profile),
  }));

  const filtered =
    options?.onlyPassingThreshold === false
      ? withScore
      : withScore.filter((i) => i.match.lolosThreshold);

  const sorted = filtered.sort((a, b) => b.match.score - a.match.score);

  return options?.topN ? sorted.slice(0, options.topN) : sorted;
}