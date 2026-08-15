// app/api/reference/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/reference
// Balikin data referensi asli dari database:
// universitas, program_studi, skills, kategori_minat.
// Dipakai EditProfileModal biar pilihan skill/minat/universitas/prodi
// nggak lagi hardcoded dari dummy-data.
// GET /api/reference
// Balikin data referensi asli dari database:
// universitas, program_studi, skills, kategori_minat, banks.
export async function GET() {
  const [univRes, prodiRes, skillsRes, kategoriRes, banksRes] = await Promise.all([
    supabase.from("universitas").select("id, nama_universitas").order("nama_universitas"),
    supabase.from("program_studi").select("id, nama_prodi").order("nama_prodi"),
    supabase.from("skills").select("id, nama_skill").order("nama_skill"),
    supabase.from("kategori_minat").select("id, nama_kategori").order("nama_kategori"),
    supabase.from("banks").select("id, bank_code, bank_name, short_name, bank_type").eq("is_active", true).order("bank_name"),
  ]);

  const anyError =
    univRes.error || prodiRes.error || skillsRes.error || kategoriRes.error || banksRes.error;

  if (anyError) {
    console.error("Reference fetch error:", anyError);
    return NextResponse.json(
      { error: "Gagal memuat data referensi" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    universitas: (univRes.data ?? []).map((u) => u.nama_universitas),
    prodi: (prodiRes.data ?? []).map((p) => p.nama_prodi),
    skills: (skillsRes.data ?? []).map((s) => s.nama_skill),
    kategoriMinat: (kategoriRes.data ?? []).map((k) => k.nama_kategori),
    banks: (banksRes.data ?? []).map((b) => ({
      id: b.id,
      bankCode: b.bank_code,
      bankName: b.bank_name,
      shortName: b.short_name,
      bankType: b.bank_type,
    })),
  });
}