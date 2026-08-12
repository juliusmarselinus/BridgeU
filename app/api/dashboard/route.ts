import { NextRequest, NextResponse } from "next/server";
import { supabase, getAuthedClient } from "@/lib/supabase";
import type { DashboardApiResponse, RecommendedProject, UserBadge } from "@/app/(mahasiswa)/dashboard/types/dashboard";
import { getGamificationMetrics } from "@/lib/gamification";
import { checkBadgeUnlockCondition, type StudentContextForBadges } from "@/lib/badge-evaluator";
import { calculateUpdatedStreak } from "@/lib/streak-tracker";

async function getAuthUser(token: string) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }

  const authUser = await getAuthUser(token);
  if (!authUser) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }

  const db = getAuthedClient(token);

  try {
    // 1. Fetch user & profile info from DB
    const { data: userRow } = await db
      .from("users")
      .select("id, email, role, username")
      .eq("id", authUser.id)
      .maybeSingle();

    let userData = null;
    let studentXp = 150;
    let streakCount = 5;
    let reputationScore = 98;
    let responseRate = 98.50;

    if (userRow && userRow.role === "mahasiswa") {
      const { data: profile } = await db
        .from("mahasiswa_profiles")
        .select(
          `nama_lengkap, foto_url, xp, streak_count, last_active_at, reputation_score, response_rate,
           universitas:universitas_id ( nama_universitas ),
           prodi:prodi_id ( nama_prodi )`
        )
        .eq("user_id", authUser.id)
        .maybeSingle();

      const { data: minatRows } = await db
        .from("mahasiswa_minat")
        .select("kategori_minat ( nama_kategori )")
        .eq("mahasiswa_id", authUser.id);

      const { data: skillRows } = await db
        .from("mahasiswa_skills")
        .select("skills ( nama_skill )")
        .eq("mahasiswa_id", authUser.id);

      if (profile) {
        // Auto-update streak keaktifan mahasiswa
        const streakResult = calculateUpdatedStreak(
          (profile as any).streak_count ?? 0,
          (profile as any).last_active_at ?? null
        );

        streakCount = (profile as any).streak_count ?? 0;
        if (streakResult.updated) {
          streakCount = streakResult.newStreak;
          await db
            .from("mahasiswa_profiles")
            .update({
              streak_count: streakCount,
              last_active_at: streakResult.newLastActiveAt,
            })
            .eq("user_id", authUser.id);
        }

        studentXp = (profile as any).xp ?? 0;
        reputationScore = (profile as any).reputation_score ?? 0;
        responseRate = (profile as any).response_rate ?? 0.0;

        userData = {
          id: authUser.id,
          nama: profile.nama_lengkap,
          universitas: (profile.universitas as any)?.nama_universitas ?? null,
          prodi: (profile.prodi as any)?.nama_prodi ?? null,
          fotoUrl: profile.foto_url,
          xp: studentXp,
          streakCount,
          reputationScore,
          responseRate,
          skills: (skillRows ?? []).map((r: any) => r.skills?.nama_skill).filter(Boolean),
          minatKategori: (minatRows ?? []).map((r: any) => r.kategori_minat?.nama_kategori).filter(Boolean),
          isProfileComplete: Boolean(profile.nama_lengkap && profile.universitas && profile.prodi),
        };
      } else {
        const fallbackName = authUser.user_metadata?.nama_lengkap || authUser.email?.split("@")[0] || "Mahasiswa";
        userData = {
          id: authUser.id,
          nama: fallbackName,
          universitas: null,
          prodi: null,
          fotoUrl: null,
          xp: 0,
          streakCount: 0,
          reputationScore: 0,
          responseRate: 0.0,
          skills: [],
          minatKategori: [],
          isProfileComplete: false,
        };
      }
    }

    // 2. Fetch real user applications from pendaftaran_kolaborasi
    let pengajuanList: any[] = [];
    const { data: dbPendaftaran } = await db
      .from("pendaftaran_kolaborasi")
      .select("id, kolaborasi_id, status, tanggal_daftar, kolaborasi:kolaborasi_id(judul, perusahaan:perusahaan_id(nama_perusahaan))")
      .eq("mahasiswa_id", authUser.id);

    if (dbPendaftaran && dbPendaftaran.length > 0) {
      pengajuanList = dbPendaftaran.map((item: any) => ({
        id: item.id,
        judul: item.kolaborasi?.judul ?? "Pengajuan Kolaborasi",
        perusahaan: item.kolaborasi?.perusahaan?.nama_perusahaan ?? "Mitra Perusahaan",
        status: item.status ?? "Menunggu",
        tanggal: item.tanggal_daftar ?? new Date().toISOString(),
      }));
    }

    // 2b. Evaluate badges & auto-sync XP if new badges earned
    const { data: allBadges } = await supabase
      .from("badges")
      .select("id, kode_badge, xp_bonus");

    const { data: userBadgesData } = await db
      .from("mahasiswa_badges")
      .select("badge_id")
      .eq("mahasiswa_id", authUser.id);

    const unlockedBadgeIds = new Set((userBadgesData || []).map((b: any) => b.badge_id));
    const totalApply = pengajuanList.length;
    const totalAccept = pengajuanList.filter((p: any) => p.status === "Diterima" || p.status === "Selesai").length;
    const totalFinish = pengajuanList.filter((p: any) => p.status === "Selesai").length;
    const uniquePerusahaan = new Set(pengajuanList.map((p: any) => p.perusahaan)).size;
    const isComplete = Boolean(userData?.universitas && userData?.prodi);

    const studentCtx: StudentContextForBadges = {
      isProfileComplete: isComplete,
      totalPengajuan: totalApply,
      totalDiterima: totalAccept,
      totalSelesai: totalFinish,
      streakCount: streakCount,
      responseRate: responseRate,
      xp: studentXp,
      uniquePerusahaanCount: uniquePerusahaan,
    };

    const newBadgesToInsert: { mahasiswa_id: string; badge_id: number }[] = [];
    let extraXpGained = 0;

    (allBadges || []).forEach((b: any) => {
      const dbUnlocked = unlockedBadgeIds.has(b.id);
      const evalUnlocked = checkBadgeUnlockCondition(b.kode_badge, studentCtx);

      if (evalUnlocked && !dbUnlocked) {
        newBadgesToInsert.push({
          mahasiswa_id: authUser.id,
          badge_id: b.id,
        });
        extraXpGained += b.xp_bonus || 0;
      }
    });

    if (newBadgesToInsert.length > 0) {
      await db.from("mahasiswa_badges").upsert(newBadgesToInsert, { onConflict: "mahasiswa_id,badge_id" });
      studentXp += extraXpGained;
      await db.from("mahasiswa_profiles").update({ xp: studentXp }).eq("user_id", authUser.id);
      if (userData) userData.xp = studentXp;
    }

    // 3. Fetch real recommendations — exclude kolaborasi yang sudah didaftar user
    let recommendedProjects: RecommendedProject[] = [];

    // Kumpulkan kolaborasi_id yang sudah pernah didaftar
    const registeredKolaborasiIds: string[] = (dbPendaftaran ?? [])
      .map((p: any) => p.kolaborasi_id)
      .filter(Boolean);

    let recommendQuery = db
      .from("kolaborasi")
      .select(`
        id, judul, tipe, tingkat_kesulitan,
        perusahaan:perusahaan_id(nama_perusahaan),
        kategori:kategori_id(nama_kategori),
        kolaborasi_target_prodi(program_studi:prodi_id(nama_prodi))
      `)
      .eq("status_moderasi", "Disetujui")
      .order("created_at", { ascending: false })
      .limit(8); // ambil lebih banyak agar setelah filter masih tersisa 4

    // Filter out kolaborasi yang sudah didaftar (jika ada)
    if (registeredKolaborasiIds.length > 0) {
      recommendQuery = recommendQuery.not(
        "id",
        "in",
        `(${registeredKolaborasiIds.join(",")})`
      );
    }

    const { data: dbKolaborasi } = await recommendQuery;

    const userProdi = userData?.prodi || "Sistem Informasi";

    if (dbKolaborasi && dbKolaborasi.length > 0) {
      recommendedProjects = dbKolaborasi
        .map((k: any) => {
          const matchesProdi = (k.kolaborasi_target_prodi as any[])?.some((tp: any) =>
            tp.program_studi?.nama_prodi?.toLowerCase().includes(userProdi.toLowerCase())
          );
          const baseScore = 85;
          const calculatedScore = matchesProdi ? Math.min(baseScore + 5, 99) : baseScore - 10;

          return {
            id: k.id,
            judul: k.judul,
            perusahaan: k.perusahaan?.nama_perusahaan ?? "Mitra Perusahaan",
            kategori: k.kategori?.nama_kategori ?? "Kolaborasi",
            matchScore: calculatedScore,
            tipe: k.tipe ?? "Studi Kasus Akademik",
          };
        })
        .slice(0, 4); // cap di 4 rekomendasi
    }

    // Badges calculated dynamically from user metrics
    const userBadges: UserBadge[] = [
      { iconType: "rocket", title: "Pionir Kolaborasi", desc: `${pengajuanList.length} Pengajuan dikirim` },
      { iconType: "academic", title: "Akademisi Aktif", desc: `${streakCount} Hari streak keaktifan` },
      { iconType: "trophy", title: "Reputasi Tinggi", desc: `Skor reputasi ${reputationScore}/100` },
    ];

    const total = pengajuanList.length;
    const menunggu = pengajuanList.filter((p) => p.status === "Menunggu").length;
    const diterima = pengajuanList.filter((p) => p.status === "Diterima").length;

    // Gamification metrics using formula: Target XP Level n = 100 * n^2
    const gMetrics = getGamificationMetrics(studentXp);

    const payload: DashboardApiResponse = {
      user: userData,
      pengajuan: pengajuanList,
      recommendedProjects,
      userBadges,
      stats: {
        total,
        menunggu,
        diterima,
        level: gMetrics.level,
        progressPercent: gMetrics.progressPercent,
        sisaMenujuLevel: gMetrics.sisaMenujuLevel,
        xp: studentXp,
        streakCount,
        reputationScore,
        responseRate,
      },
    };

    return NextResponse.json(payload);
  } catch (err: any) {
    console.error("Error in GET /api/dashboard:", err);
    return NextResponse.json({ error: err.message || "Gagal mengambil data dashboard" }, { status: 500 });
  }
}
