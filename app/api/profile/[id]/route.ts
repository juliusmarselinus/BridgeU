import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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

    // 1. Coba cari di mahasiswa_profiles berdasarkan user_id (UUID)
    let { data: profile, error } = await supabase
      .from("mahasiswa_profiles")
      .select(
        `user_id, nama_lengkap, semester, preferensi_tipe, preferensi_lokasi, ringkasan_self, foto_url, xp, points, streak_count, last_active_at, reputation_score, response_rate,
         universitas:universitas_id ( nama_universitas ),
         prodi:prodi_id ( nama_prodi )`
      )
      .eq("user_id", id)
      .maybeSingle();

    // 2. Fallback: jika tidak ditemukan lewat user_id, coba cari lewat nama atau username
    if (!profile) {
      const { data: fallbackProfiles } = await supabase
        .from("mahasiswa_profiles")
        .select(
          `user_id, nama_lengkap, semester, preferensi_tipe, preferensi_lokasi, ringkasan_self, foto_url, xp, points, streak_count, last_active_at, reputation_score, response_rate,
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
          `user_id, nama_lengkap, semester, preferensi_tipe, preferensi_lokasi, ringkasan_self, foto_url, xp, points, streak_count, last_active_at, reputation_score, response_rate,
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

    // Fetch skills
    const { data: skillRows } = await supabase
      .from("mahasiswa_skills")
      .select("skills ( nama_skill )")
      .eq("mahasiswa_id", userId);

    // Fetch minat
    const { data: minatRows } = await supabase
      .from("mahasiswa_minat")
      .select("kategori_minat ( nama_kategori )")
      .eq("mahasiswa_id", userId);

    // Fetch badges
    const { data: allBadges } = await supabase
      .from("badges")
      .select("id, kode_badge, nama_badge, deskripsi, icon_url, kategori, xp_bonus");

    const { data: userBadges } = await supabase
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
    const { data: dbPendaftaran } = await supabase
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
      xp: studentXp,
      pts: studentPts,
      level: gMetrics.level,
      tier: gMetrics.tier,
      tierTitle: gMetrics.tierTitle,
      streakCount: profile.streak_count ?? 0,
      reputationScore: profile.reputation_score ?? 0,
      responseRate: profile.response_rate ?? 0.0,
      minatKategori: (minatRows ?? []).map((r: any) => r.kategori_minat?.nama_kategori).filter(Boolean),
      skills: (skillRows ?? []).map((r: any) => r.skills?.nama_skill).filter(Boolean),
      pengajuan: pengajuanList,
      badges: formattedBadges,
    });
  } catch (err: any) {
    console.error("Error in GET /api/profile/[id]:", err);
    return NextResponse.json({ error: err.message || "Gagal memuat profil" }, { status: 500 });
  }
}
