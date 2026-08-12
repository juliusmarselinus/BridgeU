// app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase, getAuthedClient } from "@/lib/supabase";
import { checkBadgeUnlockCondition, type StudentContextForBadges } from "@/lib/badge-evaluator";
import { calculateUpdatedStreak } from "@/lib/streak-tracker";

async function getAuthUser(token: string) {
  // Verifikasi token pakai client biasa (cukup buat cek siapa yang login)
  const { data: { user }, error } = await supabase.auth.getUser(token);
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

  const db = getAuthedClient(token); // semua query pakai token user, biar RLS lolos

  const { data: userRow, error: userError } = await db
    .from("users")
    .select("id, email, role, status, username")
    .eq("id", authUser.id)
    .single();

  if (userError || !userRow) {
    return NextResponse.json({ error: "User tidak ditemukan", detail: userError?.message }, { status: 404 });
  }

  if (userRow.role === "mahasiswa") {
    const { data: profile, error: profileError } = await db
      .from("mahasiswa_profiles")
      .select(
        `nama_lengkap, semester, preferensi_tipe, preferensi_lokasi, ringkasan_self, foto_url, xp, points, streak_count, last_active_at, reputation_score, response_rate,
         universitas:universitas_id ( nama_universitas ),
         prodi:prodi_id ( nama_prodi )`
      )
      .eq("user_id", authUser.id)
      .single();

    if (profileError || !profile) {
      const fallbackName = authUser.user_metadata?.nama_lengkap || authUser.email?.split("@")[0] || "Mahasiswa";
      return NextResponse.json({
        id: userRow.id,
        email: userRow.email,
        role: userRow.role,
        username: userRow.username,
        nama: fallbackName,
        universitas: null,
        prodi: null,
        semester: null,
        preferensiTipe: "Semua",
        preferensiLokasi: "Remote",
        ringkasanSelf: "",
        fotoUrl: null,
        xp: 0,
        streakCount: 0,
        reputationScore: 0,
        responseRate: 0.0,
        minatKategori: [],
        skills: [],
        isProfileComplete: false,
      });
    }

    // Auto-update streak keaktifan mahasiswa
    const streakResult = calculateUpdatedStreak(
      (profile as any).streak_count ?? 0,
      (profile as any).last_active_at ?? null
    );

    let streakCount = (profile as any).streak_count ?? 0;
    let lastActiveAt = (profile as any).last_active_at ?? null;

    if (streakResult.updated) {
      streakCount = streakResult.newStreak;
      lastActiveAt = streakResult.newLastActiveAt;

      await db
        .from("mahasiswa_profiles")
        .update({
          streak_count: streakCount,
          last_active_at: lastActiveAt,
        })
        .eq("user_id", authUser.id);
    }

    const { data: minatRows } = await db
      .from("mahasiswa_minat")
      .select("kategori_minat ( nama_kategori )")
      .eq("mahasiswa_id", authUser.id);

    const { data: skillRows } = await db
      .from("mahasiswa_skills")
      .select("skills ( nama_skill )")
      .eq("mahasiswa_id", authUser.id);

    const isComplete = Boolean(profile.nama_lengkap && profile.universitas && profile.prodi);

    let dbPendaftaran: any[] | null = null;

    console.log("🔍 [DEBUG /api/me] Fetching pendaftaran for authUser.id:", authUser.id);

    const { data: authedPendaftaran, error: authedErr } = await db
      .from("pendaftaran_kolaborasi")
      .select("id, status, tanggal_daftar, kolaborasi:kolaborasi_id(judul, perusahaan:perusahaan_id(nama_perusahaan))")
      .eq("mahasiswa_id", authUser.id);

    console.log("🔍 [DEBUG /api/me] authedPendaftaran count:", authedPendaftaran?.length ?? 0, "Err:", authedErr?.message);

    dbPendaftaran = authedPendaftaran;

    // Fallback pakai client supabase publik jika authedClient RLS 0 result
    if (!dbPendaftaran || dbPendaftaran.length === 0) {
      const { data: publicPendaftaran, error: pubErr } = await supabase
        .from("pendaftaran_kolaborasi")
        .select("id, status, tanggal_daftar, kolaborasi:kolaborasi_id(judul, perusahaan:perusahaan_id(nama_perusahaan))")
        .eq("mahasiswa_id", authUser.id);

      console.log("🔍 [DEBUG /api/me] publicPendaftaran count:", publicPendaftaran?.length ?? 0, "Err:", pubErr?.message);
      dbPendaftaran = publicPendaftaran;
    }

    const pengajuanList = (dbPendaftaran || []).map((item: any) => ({
      id: item.id,
      judul: item.kolaborasi?.judul ?? "Pengajuan Kolaborasi",
      perusahaan: item.kolaborasi?.perusahaan?.nama_perusahaan ?? "Mitra Perusahaan",
      status: item.status ?? "Menunggu",
      tujuan: item.kolaborasi?.perusahaan?.nama_perusahaan ?? "Mitra Perusahaan",
      tanggal: item.tanggal_daftar
        ? new Date(item.tanggal_daftar).toLocaleDateString("id-ID")
        : "-",
    }));

    console.log("🔍 [DEBUG /api/me] Final pengajuanList count:", pengajuanList.length);

    console.log("🔍 [DEBUG /api/me] Final pengajuanList count:", pengajuanList.length);

    const { data: allBadges, error: badgeErr } = await supabase
      .from("badges")
      .select("id, kode_badge, nama_badge, deskripsi, icon_url, kategori, xp_bonus");

    console.log("🔍 [DEBUG /api/me] allBadges count:", allBadges?.length ?? 0, "Err:", badgeErr?.message);

    let { data: userBadgesData, error: userBadgeErr } = await db
      .from("mahasiswa_badges")
      .select("badge_id, earned_at")
      .eq("mahasiswa_id", authUser.id);

    if (!userBadgesData || userBadgesData.length === 0) {
      const { data: pubUserBadges } = await supabase
        .from("mahasiswa_badges")
        .select("badge_id, earned_at")
        .eq("mahasiswa_id", authUser.id);

      if (pubUserBadges && pubUserBadges.length > 0) {
        userBadgesData = pubUserBadges;
      }
    }

    console.log("🔍 [DEBUG /api/me] userBadgesData count:", userBadgesData?.length ?? 0, "Err:", userBadgeErr?.message);

    const unlockedBadgeIds = new Set((userBadgesData || []).map((b: any) => b.badge_id));

    const totalApply = pengajuanList.length;
    const totalAccept = pengajuanList.filter((p: any) => p.status === "Diterima" || p.status === "Selesai").length;
    const totalFinish = pengajuanList.filter((p: any) => p.status === "Selesai").length;
    const studentXp = (profile as any).xp ?? 0;
    const responseRate = (profile as any).response_rate ?? 0;

    const uniquePerusahaan = new Set(pengajuanList.map((p: any) => p.perusahaan)).size;

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

    const formattedBadges = (allBadges || []).map((b: any) => {
      const dbUnlocked = unlockedBadgeIds.has(b.id);
      const evalUnlocked = checkBadgeUnlockCondition(b.kode_badge, studentCtx);
      const isUnlocked = dbUnlocked || evalUnlocked;

      // Jika baru saja qualified tapi belum ada di DB mahasiswa_badges, masukkan ke daftar insert & tambah XP
      if (evalUnlocked && !dbUnlocked) {
        newBadgesToInsert.push({
          mahasiswa_id: authUser.id,
          badge_id: b.id,
        });
        extraXpGained += b.xp_bonus || 0;
      }

      return {
        id: b.id,
        kodeBadge: b.kode_badge,
        namaBadge: b.nama_badge,
        deskripsi: b.deskripsi,
        iconUrl: b.icon_url,
        kategori: b.kategori,
        xpBonus: b.xp_bonus,
        isUnlocked,
        unlockedAt: (userBadgesData || []).find((ub: any) => ub.badge_id === b.id)?.earned_at ?? (isUnlocked ? new Date().toISOString() : null),
      };
    });

    // Total XP = Base XP + Sum of all unlocked badges bonus XP
    const totalBadgeXp = formattedBadges
      .filter((b) => b.isUnlocked)
      .reduce((sum, b) => sum + (b.xpBonus || 0), 0);

    const calculatedTotalXp = Math.max(studentXp, totalBadgeXp);
    let currentXp = calculatedTotalXp;
    let currentPts = (profile as any).points ?? currentXp;
    if (currentXp > studentXp) {
      currentPts = (profile as any).points ? (profile as any).points + (currentXp - studentXp) : currentXp;
    }

    // Simpan ke database mahasiswa_badges dan update XP profil
    if (newBadgesToInsert.length > 0 || currentXp !== studentXp) {
      console.log("⚡ [DEBUG /api/me] Auto-inserting new badges to Supabase:", newBadgesToInsert.length, "badges, Total Calculated XP:", currentXp, "Pts:", currentPts);
      
      if (newBadgesToInsert.length > 0) {
        const { error: insertErr } = await db
          .from("mahasiswa_badges")
          .upsert(newBadgesToInsert, { onConflict: "mahasiswa_id,badge_id" });

        if (insertErr) {
          console.error("❌ [DEBUG /api/me] Failed to insert mahasiswa_badges:", insertErr.message);
        } else {
          console.log("✅ [DEBUG /api/me] Successfully inserted badges into mahasiswa_badges!");
        }
      }

      const { error: xpUpdateErr } = await db
        .from("mahasiswa_profiles")
        .update({ xp: currentXp, points: currentPts })
        .eq("user_id", authUser.id);

      if (xpUpdateErr) {
        // Fallback update tanpa points jika kolom points belum dibuat di beberapa env
        await db
          .from("mahasiswa_profiles")
          .update({ xp: currentXp })
          .eq("user_id", authUser.id);
        console.error("❌ [DEBUG /api/me] Failed to update profile XP & Points:", xpUpdateErr.message);
      } else {
        console.log("✅ [DEBUG /api/me] Successfully updated profile XP & Points!");
      }
    }

    console.log("🔍 [DEBUG /api/me] Final formattedBadges count:", formattedBadges.length, "Total XP:", currentXp);

    return NextResponse.json({
      id: userRow.id,
      email: userRow.email,
      role: userRow.role,
      username: userRow.username,
      nama: profile.nama_lengkap,
      universitas: (profile.universitas as any)?.nama_universitas ?? null,
      prodi: (profile.prodi as any)?.nama_prodi ?? null,
      semester: profile.semester,
      preferensiTipe: profile.preferensi_tipe,
      preferensiLokasi: profile.preferensi_lokasi,
      ringkasanSelf: profile.ringkasan_self,
      fotoUrl: profile.foto_url,
      xp: currentXp,
      pts: currentPts,
      streakCount: streakCount,
      lastActiveAt: lastActiveAt,
      reputationScore: (profile as any).reputation_score ?? 0,
      responseRate: (profile as any).response_rate ?? 0.0,
      minatKategori: (minatRows ?? []).map((r: any) => r.kategori_minat?.nama_kategori).filter(Boolean),
      skills: (skillRows ?? []).map((r: any) => r.skills?.nama_skill).filter(Boolean),
      pengajuan: pengajuanList,
      badges: formattedBadges,
      isProfileComplete: isComplete,
    });
  }

  if (userRow.role === "perusahaan") {
    const { data: profile, error: profileError } = await db
      .from("perusahaan_profiles")
      .select("nama_perusahaan, industri, nib, lokasi, deskripsi_perusahaan, status_verifikasi")
      .eq("user_id", authUser.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Profil perusahaan belum lengkap", detail: profileError?.message },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: userRow.id,
      email: userRow.email,
      role: userRow.role,
      username: userRow.username,
      nama: profile.nama_perusahaan,
      industri: profile.industri,
      nib: profile.nib,
      lokasi: profile.lokasi,
      deskripsi: profile.deskripsi_perusahaan,
      statusVerifikasi: profile.status_verifikasi,
    });
  }

  // admin
  return NextResponse.json({
    id: userRow.id,
    email: userRow.email,
    role: userRow.role,
    username: userRow.username,
    nama: userRow.username ?? "Admin",
  });
}

// Helper cari/insert data referensi (universitas, prodi, minat, skills)
async function getOrCreateRefId(db: ReturnType<typeof getAuthedClient>, table: string, column: string, value: string) {
  const { data: existing } = await db.from(table).select("id").eq(column, value).maybeSingle();
  if (existing) return existing.id;

  const { data: created, error } = await db
    .from(table)
    .insert([{ [column]: value }])
    .select("id")
    .single();

  if (error) throw new Error(`Gagal menyimpan referensi ${table}: ${error.message}`);
  return created.id;
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }

  const authUser = await getAuthUser(token);
  if (!authUser) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }

  const db = getAuthedClient(token);

  const { data: userRow } = await db.from("users").select("role").eq("id", authUser.id).single();

  if (!userRow || userRow.role !== "mahasiswa") {
    return NextResponse.json({ error: "Hanya mahasiswa yang bisa update profil ini" }, { status: 403 });
  }

  const body = await req.json();
  const {
    nama,
    universitas,
    prodi,
    semester,
    preferensiTipe,
    preferensiLokasi,
    ringkasan,
    fotoUrl,
    minatKategori,
    skills,
  } = body;

  try {
    const updatePayload: Record<string, any> = {};
    if (nama !== undefined) updatePayload.nama_lengkap = nama;
    if (semester !== undefined) updatePayload.semester = semester;
    if (preferensiTipe !== undefined) updatePayload.preferensi_tipe = preferensiTipe;
    if (preferensiLokasi !== undefined) updatePayload.preferensi_lokasi = preferensiLokasi;
    if (ringkasan !== undefined) updatePayload.ringkasan_self = ringkasan;
    if (fotoUrl !== undefined) updatePayload.foto_url = fotoUrl;

    if (universitas) {
      updatePayload.universitas_id = await getOrCreateRefId(db, "universitas", "nama_universitas", universitas);
    }
    if (prodi) {
      updatePayload.prodi_id = await getOrCreateRefId(db, "program_studi", "nama_prodi", prodi);
    }

    if (Object.keys(updatePayload).length > 0) {
      const { error: updateError, data: updatedRows } = await db
        .from("mahasiswa_profiles")
        .update(updatePayload)
        .eq("user_id", authUser.id)
        .select("user_id");

      if (updateError) throw new Error(`mahasiswa_profiles: ${updateError.message}`);
      if (!updatedRows || updatedRows.length === 0) {
        // Update "berhasil" tapi 0 baris kena — biasanya RLS block, bukan error eksplisit
        throw new Error(
          "Update tidak mengubah data apapun (kemungkinan diblokir RLS policy di tabel mahasiswa_profiles — cek policy UPDATE ... USING (auth.uid() = user_id))"
        );
      }
    }

    if (Array.isArray(minatKategori)) {
      await db.from("mahasiswa_minat").delete().eq("mahasiswa_id", authUser.id);
      for (const namaKategori of minatKategori) {
        const kategoriId = await getOrCreateRefId(db, "kategori_minat", "nama_kategori", namaKategori);
        await db.from("mahasiswa_minat").insert([{ mahasiswa_id: authUser.id, kategori_id: kategoriId }]);
      }
    }

    if (Array.isArray(skills)) {
      await db.from("mahasiswa_skills").delete().eq("mahasiswa_id", authUser.id);
      for (const namaSkill of skills) {
        const skillId = await getOrCreateRefId(db, "skills", "nama_skill", namaSkill);
        await db.from("mahasiswa_skills").insert([{ mahasiswa_id: authUser.id, skill_id: skillId }]);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("🔥 PUT /api/me GAGAL:", err);
    return NextResponse.json({ error: err.message || "Gagal menyimpan profil" }, { status: 500 });
  }
}