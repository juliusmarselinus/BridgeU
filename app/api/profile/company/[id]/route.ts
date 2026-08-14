import { NextRequest, NextResponse } from "next/server";
import { supabase, getAuthedClient } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID perusahaan tidak valid" }, { status: 400 });
    }

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const db = token ? getAuthedClient(token) : supabase;

    // Cari profil perusahaan berdasarkan user_id (UUID)
    const { data: profile, error } = await db
      .from("perusahaan_profiles")
      .select(
        `user_id, nama_perusahaan, nib, logo_url, deskripsi_perusahaan,
         ukuran_perusahaan, tahun_berdiri, situs_web, alamat_lengkap, status_verifikasi,
         sektor:sektor_id ( nama_sektor ),
         kota:kota_id ( nama_kota ),
         user:user_id ( email )`
      )
      .eq("user_id", id)
      .maybeSingle();

    if (error) {
      console.error("Supabase error:", error);
    }

    if (!profile) {
      return NextResponse.json({ error: "Profil perusahaan tidak ditemukan" }, { status: 404 });
    }

    const companyId = profile.user_id;

    // Fetch kolaborasi milik perusahaan ini (menggunakan status_moderasi sesuai schema)
    const { data: dbKolaborasi } = await db
      .from("kolaborasi")
      .select("id, judul, deskripsi, status_moderasi, created_at")
      .eq("perusahaan_id", companyId)
      .order("created_at", { ascending: false })
      .limit(20);

    const kolaborasiList = (dbKolaborasi || []).map((item: any) => ({
      id: item.id,
      judul: item.judul ?? "Proyek Kolaborasi",
      deskripsi: item.deskripsi ?? "",
      status: item.status_moderasi ?? "Berlangsung",
      tanggal: item.created_at
        ? new Date(item.created_at).toLocaleDateString("id-ID")
        : "-",
    }));

    return NextResponse.json({
      id: profile.user_id,
      nama_perusahaan: profile.nama_perusahaan || "Perusahaan Terdaftar",
      email: (profile.user as any)?.email || "",
      logo_url: profile.logo_url || "",
      nama_sektor: (profile.sektor as any)?.nama_sektor ?? null,
      nama_kota: (profile.kota as any)?.nama_kota ?? null,
      nib: profile.nib || "-",
      ukuran_perusahaan: profile.ukuran_perusahaan || null,
      status_verifikasi: profile.status_verifikasi || "Terverifikasi",
      tahun_berdiri: profile.tahun_berdiri || null,
      situs_web: profile.situs_web || "",
      alamat_lengkap: profile.alamat_lengkap || "",
      deskripsi_perusahaan: profile.deskripsi_perusahaan || "",
      kolaborasi: kolaborasiList,
    });
  } catch (err: any) {
    console.error("Error in GET /api/perusahaan/profile/[id]:", err);
    return NextResponse.json({ error: err.message || "Gagal memuat profil perusahaan" }, { status: 500 });
  }
}