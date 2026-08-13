import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 1) {
    return NextResponse.json({ results: [] });
  }

  const like = `%${q}%`;

  // Query mahasiswa & perusahaan secara paralel
  const [mahasiswaRes, perusahaanRes] = await Promise.all([
    supabase
      .from("mahasiswa_profiles")
      .select(
        `
        user_id,
        nama_lengkap,
        foto_url,
        equipped_frame_code,
        program_studi:prodi_id ( nama_prodi )
      `
      )
      .ilike("nama_lengkap", like)
      .limit(8),

    supabase
      .from("perusahaan_profiles")
      .select(
        `
        user_id,
        nama_perusahaan,
        logo_url,
        sektor_perusahaan:sektor_id ( nama_sektor )
      `
      )
      .ilike("nama_perusahaan", like)
      .limit(8),
  ]);

  if (mahasiswaRes.error) {
    console.error("Search mahasiswa error:", mahasiswaRes.error);
  }
  if (perusahaanRes.error) {
    console.error("Search perusahaan error:", perusahaanRes.error);
  }

  const mahasiswaResults = (mahasiswaRes.data ?? []).map((m: any) => ({
    id: m.user_id,
    name: m.nama_lengkap,
    type: "mahasiswa" as const,
    roleOrCategory: m.program_studi?.nama_prodi ?? "Mahasiswa",
    fotoUrl: m.foto_url ?? null,
    equippedFrameCode: m.equipped_frame_code ?? "none",
    href: `/profile/${m.user_id}`,
  }));

  const perusahaanResults = (perusahaanRes.data ?? []).map((p: any) => ({
    id: p.user_id,
    name: p.nama_perusahaan,
    type: "company" as const,
    roleOrCategory: p.sektor_perusahaan?.nama_sektor ?? "Perusahaan",
    fotoUrl: p.logo_url ?? null,
    href: `/profile/company/${p.user_id}`,
  }));

  // Nama diprioritaskan di depan, gabung dua-duanya
  const results = [...mahasiswaResults, ...perusahaanResults];

  return NextResponse.json({ results });
}