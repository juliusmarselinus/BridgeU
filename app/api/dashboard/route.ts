import { NextRequest, NextResponse } from "next/server";
import { supabase, getAuthedClient } from "@/lib/supabase";
import type { DashboardApiResponse, RecommendedProject, UserBadge } from "@/app/(mahasiswa)/dashboard/types/dashboard";

async function getAuthUser(token: string) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

const defaultRecommendations: RecommendedProject[] = [
  {
    id: "rec-1",
    judul: "Optimasi UI/UX & Redesign E-Commerce Mobile App",
    perusahaan: "PT Digital Innovate Indonesia",
    kategori: "UI/UX & System Design",
    matchScore: 95,
    tipe: "Studi Kasus Akademik",
  },
  {
    id: "rec-2",
    judul: "Analisis Sentimen Data Pelanggan Berbasis Machine Learning",
    perusahaan: "DataTech Nusantara",
    kategori: "Data Science & Analytics",
    matchScore: 88,
    tipe: "Riset Industri",
  },
];

const defaultBadges: UserBadge[] = [
  { iconType: "rocket", title: "Pionir Kolaborasi", desc: "Mengirim pengajuan pertama" },
  { iconType: "academic", title: "Akademisi Aktif", desc: "Terhubung dengan industri" },
  { iconType: "lightning", title: "Quick Learner", desc: "Profil terverifikasi 100%" },
];

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
    if (userRow && userRow.role === "mahasiswa") {
      const { data: profile } = await db
        .from("mahasiswa_profiles")
        .select(
          `nama_lengkap, foto_url,
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
        userData = {
          id: authUser.id,
          nama: profile.nama_lengkap,
          universitas: (profile.universitas as any)?.nama_universitas ?? "Universitas Multimedia Nusantara (UMN)",
          prodi: (profile.prodi as any)?.nama_prodi ?? "Sistem Informasi",
          fotoUrl: profile.foto_url,
          skills: (skillRows ?? []).map((r: any) => r.skills?.nama_skill).filter(Boolean),
          minatKategori: (minatRows ?? []).map((r: any) => r.kategori_minat?.nama_kategori).filter(Boolean),
        };
      }
    }

    // 2. Fetch pengajuan list from DB (fallback to empty if table not yet populated)
    let pengajuanList: any[] = [];
    const { data: dbPengajuan } = await db
      .from("pengajuan_kolaborasi")
      .select("id, status, created_at, lowongan:lowongan_id(judul, perusahaan:perusahaan_id(nama_perusahaan))")
      .eq("mahasiswa_id", authUser.id);

    if (dbPengajuan && dbPengajuan.length > 0) {
      pengajuanList = dbPengajuan.map((item: any) => ({
        id: item.id,
        judul: item.lowongan?.judul ?? "Pengajuan Kolaborasi",
        perusahaan: item.lowongan?.perusahaan?.nama_perusahaan ?? "Mitra Perusahaan",
        status: item.status ?? "Menunggu",
        tanggal: item.created_at ?? new Date().toISOString(),
      }));
    }

    const total = pengajuanList.length;
    const menunggu = pengajuanList.filter((p) => p.status === "Menunggu").length;
    const diterima = pengajuanList.filter((p) => p.status === "Diterima").length;
    const level = Math.floor(total / 2) + 1;
    const progressPercent = Math.min(((total % 2) / 2) * 100, 100);
    const sisaMenujuLevel = total % 2 === 0 ? 2 : 1;

    const payload: DashboardApiResponse = {
      user: userData,
      pengajuan: pengajuanList,
      recommendedProjects: defaultRecommendations,
      userBadges: defaultBadges,
      stats: {
        total,
        menunggu,
        diterima,
        level,
        progressPercent,
        sisaMenujuLevel,
      },
    };

    return NextResponse.json(payload);
  } catch (err: any) {
    console.error("Error in GET /api/dashboard:", err);
    return NextResponse.json({ error: err.message || "Gagal mengambil data dashboard" }, { status: 500 });
  }
}
