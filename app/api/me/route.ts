// app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase, getAuthedClient } from "@/lib/supabase";

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
        `nama_lengkap, semester, preferensi_tipe, preferensi_lokasi, ringkasan_self, foto_url, xp, streak_count, last_active_at, reputation_score, response_rate,
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

    const { data: minatRows } = await db
      .from("mahasiswa_minat")
      .select("kategori_minat ( nama_kategori )")
      .eq("mahasiswa_id", authUser.id);

    const { data: skillRows } = await db
      .from("mahasiswa_skills")
      .select("skills ( nama_skill )")
      .eq("mahasiswa_id", authUser.id);

    const isComplete = Boolean(profile.nama_lengkap && profile.universitas && profile.prodi);

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
      xp: (profile as any).xp ?? 0,
      streakCount: (profile as any).streak_count ?? 0,
      lastActiveAt: (profile as any).last_active_at ?? null,
      reputationScore: (profile as any).reputation_score ?? 0,
      responseRate: (profile as any).response_rate ?? 0.0,
      minatKategori: (minatRows ?? []).map((r: any) => r.kategori_minat?.nama_kategori).filter(Boolean),
      skills: (skillRows ?? []).map((r: any) => r.skills?.nama_skill).filter(Boolean),
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