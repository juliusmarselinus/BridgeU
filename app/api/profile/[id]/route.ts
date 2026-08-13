import { NextRequest, NextResponse } from "next/server";
import { supabase, getAuthedClient } from "@/lib/supabase";
import { getGamificationMetrics } from "@/lib/gamification";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID profil tidak valid" }, { status: 400 });
    }

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const db = token ? getAuthedClient(token) : supabase;

    // 1. Coba cari di mahasiswa_profiles berdasarkan user_id (UUID)
    let { data: profile, error } = await db
      .from("mahasiswa_profiles")
      .select(
        `user_id, nama_lengkap, semester, preferensi_tipe, preferensi_lokasi, ringkasan_self, foto_url, xp, points, streak_count, last_active_at, reputation_score, response_rate, equipped_frame_code,
         universitas:universitas_id ( nama_universitas ),
         prodi:prodi_id ( nama_prodi )`
      )
      .eq("user_id", id)
      .maybeSingle();

    // 2. Fallback: jika tidak ditemukan lewat user_id, coba cari lewat nama atau username
    if (!profile) {
      const { data: fallbackProfiles } = await db
        .from("mahasiswa_profiles")
        .select(
          `user_id, nama_lengkap, semester, preferensi_tipe, preferensi_lokasi, ringkasan_self, foto_url, xp, points, streak_count, last_active_at, reputation_score, response_rate, equipped_frame_code,
           universitas:universitas_id ( nama_universitas ),
           prodi:prodi_id ( nama_prodi )`
        )
        .ilike("nama_lengkap", `%${id}%`)
        .limit(1);

      if (fallbackProfiles && fallbackProfiles.length > 0) {
        profile = fallbackProfiles[0];
      }
    }

    // 3. Fallback publik jika belum ketemu di db
    if (!profile) {
      const { data: pubProfile } = await supabase
        .from("mahasiswa_profiles")
        .select(
          `user_id, nama_lengkap, semester, preferensi_tipe, preferensi_lokasi, ringkasan_self, foto_url, xp, points, streak_count, last_active_at, reputation_score, response_rate, equipped_frame_code,
           universitas:universitas_id ( nama_universitas ),
           prodi:prodi_id ( nama_prodi )`
        )
        .eq("user_id", id)
        .maybeSingle();

      if (pubProfile) {
        profile = pubProfile;
      }
    }

    if (!profile) {
      return NextResponse.json({ error: "Profil tidak ditemukan" }, { status: 404 });
    }

    const userId = profile.user_id;

    // Fetch skills dengan fallback 2-tier (PostgREST relation + direct skill table query)
    let skills: string[] = [];
    const { data: skillRows } = await db
      .from("mahasiswa_skills")
      .select("skill_id, skills:skill_id ( nama_skill )")
      .eq("mahasiswa_id", userId);

    if (skillRows && skillRows.length > 0) {
      skills = skillRows
        .map((r: any) => r.skills?.nama_skill || r.nama_skill)
        .filter(Boolean);

      if (skills.length === 0) {
        const skillIds = skillRows.map((r: any) => r.skill_id).filter(Boolean);
        if (skillIds.length > 0) {
          const { data: sData } = await db.from("skills").select("nama_skill").in("id", skillIds);
          if (sData) skills = sData.map((s: any) => s.nama_skill).filter(Boolean);
        }
      }
    }

    // Fetch minat dengan fallback 2-tier
    let minatKategori: string[] = [];
    const { data: minatRows } = await db
      .from("mahasiswa_minat")
      .select("kategori_id, kategori_minat:kategori_id ( nama_kategori )")
      .eq("mahasiswa_id", userId);

    if (minatRows && minatRows.length > 0) {
      minatKategori = minatRows
        .map((r: any) => r.kategori_minat?.nama_kategori || r.nama_kategori)
        .filter(Boolean);

      if (minatKategori.length === 0) {
        const katIds = minatRows.map((r: any) => r.kategori_id).filter(Boolean);
        if (katIds.length > 0) {
          const { data: kData } = await db.from("kategori_minat").select("nama_kategori").in("id", katIds);
          if (kData) minatKategori = kData.map((k: any) => k.nama_kategori).filter(Boolean);
        }
      }
    }

    // Fetch badges
    const { data: allBadges } = await db
      .from("badges")
      .select("id, kode_badge, nama_badge, deskripsi, icon_url, kategori, xp_bonus");

    const { data: userBadges } = await db
      .from("mahasiswa_badges")
      .select("badge_id, earned_at")
      .eq("mahasiswa_id", userId);

    const unlockedBadgeIds = new Set((userBadges || []).map((b: any) => b.badge_id));

    const formattedBadges = (allBadges || []).map((b: any) => ({
      id: b.id,
      kodeBadge: b.kode_badge,
      namaBadge: b.nama_badge,
      deskripsi: b.deskripsi,
      iconUrl: b.icon_url,
      kategori: b.kategori,
      xpBonus: b.xp_bonus,
      isUnlocked: unlockedBadgeIds.has(b.id),
      unlockedAt: (userBadges || []).find((ub: any) => ub.badge_id === b.id)?.earned_at ?? null,
    }));

    // Fetch pengajuan
    const { data: dbPendaftaran } = await db
      .from("pendaftaran_kolaborasi")
      .select("id, status, tanggal_daftar, kolaborasi:kolaborasi_id(judul, perusahaan:perusahaan_id(nama_perusahaan))")
      .eq("mahasiswa_id", userId);

    const pengajuanList = (dbPendaftaran || []).map((item: any) => ({
      id: item.id,
      judul: item.kolaborasi?.judul ?? "Pengajuan Kolaborasi",
      perusahaan: item.kolaborasi?.perusahaan?.nama_perusahaan ?? "Mitra Perusahaan",
      status: item.status ?? "Menunggu",
      tanggal: item.tanggal_daftar
        ? new Date(item.tanggal_daftar).toLocaleDateString("id-ID")
        : "-",
    }));

    const studentXp = profile.xp ?? 0;
    const studentPts = profile.points ?? studentXp;
    const gMetrics = getGamificationMetrics(studentXp, studentPts);

    return NextResponse.json({
      id: profile.user_id,
      nama: profile.nama_lengkap || "Mahasiswa",
      universitas: (profile.universitas as any)?.nama_universitas ?? null,
      prodi: (profile.prodi as any)?.nama_prodi ?? null,
      semester: profile.semester ? profile.semester.toString() : null,
      preferensiTipe: profile.preferensi_tipe,
      preferensiLokasi: profile.preferensi_lokasi,
      ringkasan: profile.ringkasan_self || "",
      foto: profile.foto_url,
      equippedFrameCode: (profile as any).equipped_frame_code ?? "none",
      xp: studentXp,
      pts: studentPts,
      level: gMetrics.level,
      tier: gMetrics.tier,
      tierTitle: gMetrics.tierTitle,
      streakCount: profile.streak_count ?? 0,
      reputationScore: profile.reputation_score ?? 0,
      responseRate: profile.response_rate ?? 0.0,
      minatKategori,
      skills,
      pengajuan: pengajuanList,
      badges: formattedBadges,
    });
  } catch (err: any) {
    console.error("Error in GET /api/profile/[id]:", err);
    return NextResponse.json({ error: err.message || "Gagal memuat profil" }, { status: 500 });
  }
}
