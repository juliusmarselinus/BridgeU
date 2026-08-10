import { supabase } from "@/lib/supabase";
import { FormDataState } from "../types";

export const UNIVERSITAS_FALLBACK = [
  "Universitas Multimedia Nusantara (UMN)",
  "Universitas Indonesia (UI)",
  "Institut Teknologi Bandung (ITB)",
  "Universitas Gadjah Mada (UGM)",
  "Institut Teknologi Sepuluh Nopember (ITS)",
  "Universitas Bina Nusantara (BINUS)",
  "Universitas Telkom (Tel-U)",
  "Universitas Padjadjaran (UNPAD)",
  "Universitas Diponegoro (UNDIP)",
  "Universitas Airlangga (UNAIR)",
];

export const PRODI_FALLBACK = [
  "Manajemen",
  "Akuntansi",
  "Bisnis Digital",
  "Ekonomi Pembangunan",
  "Pemasaran",
  "Desain Komunikasi Visual",
  "Ilmu Komunikasi",
  "Hubungan Masyarakat",
  "Desain Produk",
  "Broadcasting",
  "Sistem Informasi",
  "Teknik Informatika",
  "Data Science",
  "Cyber Security",
  "Ilmu Komputer",
  "Teknik Industri",
  "Arsitektur",
  "Teknik Sipil",
  "Teknik Elektro",
  "Hukum",
  "Psikologi",
  "Hubungan Internasional",
  "Sastra Inggris",
  "Kesehatan Masyarakat",
  "Farmasi",
  "Bioteknologi",
  "Informatika / Teknik Informatika",
];

export const SEMESTER_OPTIONS = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8+",
];

export const SKILL_OPTIONS = [
  "React / Next.js",
  "TypeScript",
  "UI/UX Design (Figma)",
  "Python & Machine Learning",
  "PostgreSQL & SQL",
  "Node.js & Express",
  "TailwindCSS",
  "Flutter & Dart",
  "Docker & Kubernetes",
  "Git & GitHub Workflow",
  "HTML5 & CSS3",
  "REST API & GraphQL",
  "Data Analysis & Tableau",
];

export const MINAT_OPTIONS = [
  "UI/UX & System Design",
  "Data Science & Analytics",
  "Web & Mobile Development",
  "Cyber Security & Infrastructure",
  "Digital Marketing & Growth",
  "Product Management",
];

export interface ProdiItem {
  id: number;
  nama_prodi: string;
  fakultas_id?: number | null;
}

export async function fetchDbLookups(): Promise<{
  prodi: string[];
  univ: string[];
  prodiList: ProdiItem[];
}> {
  try {
    const { data: prodiData } = await supabase
      .from("program_studi")
      .select("id, nama_prodi, fakultas_id")
      .order("nama_prodi", { ascending: true });

    const { data: univData } = await supabase
      .from("universitas")
      .select("nama_universitas")
      .order("nama_universitas", { ascending: true });

    const fullProdiList = prodiData && prodiData.length > 0 ? prodiData : [];
    const prodiNames = fullProdiList.length > 0 ? fullProdiList.map((p) => p.nama_prodi) : PRODI_FALLBACK;
    const univNames = univData && univData.length > 0 ? univData.map((u) => u.nama_universitas) : UNIVERSITAS_FALLBACK;

    return {
      prodi: prodiNames,
      univ: univNames,
      prodiList: fullProdiList,
    };
  } catch (err) {
    console.error("Gagal mengambil data referensi dari Supabase DB:", err);
    return { prodi: PRODI_FALLBACK, univ: UNIVERSITAS_FALLBACK, prodiList: [] };
  }
}

/* Text Similarity Algorithm (Percentage Overlap / Substring / Word Match) */
export function calculateTextSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  if (!s1 || !s2) return 0;
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;

  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  let matches = 0;
  for (const w1 of words1) {
    if (w1.length > 2 && words2.some((w2) => w2.includes(w1) || w1.includes(w2))) {
      matches++;
    }
  }
  return matches / Math.max(words1.length, words2.length);
}

export function findBestMatchingProdi(
  customInput: string,
  prodiList: ProdiItem[]
): (ProdiItem & { score: number }) | null {
  if (!customInput || prodiList.length === 0) return null;
  let bestMatch = null;
  let highestScore = 0;

  for (const item of prodiList) {
    const score = calculateTextSimilarity(customInput, item.nama_prodi);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = { ...item, score };
    }
  }

  if (highestScore >= 0.15) {
    return bestMatch;
  }
  return null;
}

/* Fetch Dynamic Skills & Minat based on prodi_id & fakultas_id relevance */
export async function fetchSkillsAndMinatByProdi(
  targetProdiNameOrId?: string | number | null,
  prodiList: ProdiItem[] = []
): Promise<{ skills: string[]; minat: string[] }> {
  try {
    let resolvedProdi: ProdiItem | null = null;

    if (typeof targetProdiNameOrId === "number") {
      resolvedProdi = prodiList.find((p) => p.id === targetProdiNameOrId) || null;
    } else if (typeof targetProdiNameOrId === "string" && targetProdiNameOrId.trim()) {
      const direct = prodiList.find(
        (p) => p.nama_prodi.toLowerCase() === targetProdiNameOrId.toLowerCase()
      );
      if (direct) {
        resolvedProdi = direct;
      } else {
        const match = findBestMatchingProdi(targetProdiNameOrId, prodiList);
        if (match) {
          resolvedProdi = match;
        }
      }
    }

    const { data: skillsData } = await supabase
      .from("skills")
      .select("nama_skill, prodi_id")
      .order("nama_skill", { ascending: true });

    const { data: minatData } = await supabase
      .from("kategori_minat")
      .select("nama_kategori, prodi_id")
      .order("nama_kategori", { ascending: true });

    const baseSkills = skillsData && skillsData.length > 0 ? skillsData.map((s) => s.nama_skill) : SKILL_OPTIONS;
    const baseMinat = minatData && minatData.length > 0 ? minatData.map((m) => m.nama_kategori) : MINAT_OPTIONS;

    if (!resolvedProdi || !skillsData || !minatData) {
      return { skills: Array.from(new Set(baseSkills)), minat: Array.from(new Set(baseMinat)) };
    }

    const targetProdiId = resolvedProdi.id;
    const targetFakultasId = resolvedProdi.fakultas_id;

    // Find all prodi IDs belonging to the same faculty
    const sameFacultyProdiIds = targetFakultasId
      ? prodiList.filter((p) => p.fakultas_id === targetFakultasId).map((p) => p.id)
      : [targetProdiId];

    // Tier 1: Direct prodi skills
    const tier1Skills = skillsData.filter((s) => s.prodi_id === targetProdiId).map((s) => s.nama_skill).sort((a,b)=>a.localeCompare(b));
    // Tier 2: Same faculty skills
    const tier2Skills = skillsData
      .filter((s) => s.prodi_id && sameFacultyProdiIds.includes(s.prodi_id) && s.prodi_id !== targetProdiId)
      .map((s) => s.nama_skill).sort((a,b)=>a.localeCompare(b));

    // Tier 1: Direct prodi minat
    const tier1Minat = minatData.filter((m) => m.prodi_id === targetProdiId).map((m) => m.nama_kategori).sort((a,b)=>a.localeCompare(b));
    // Tier 2: Same faculty minat
    const tier2Minat = minatData
      .filter((m) => m.prodi_id && sameFacultyProdiIds.includes(m.prodi_id) && m.prodi_id !== targetProdiId)
      .map((m) => m.nama_kategori).sort((a,b)=>a.localeCompare(b));

    const combinedSkills = Array.from(
      new Set([...tier1Skills, ...tier2Skills, ...baseSkills])
    ).slice(0, 10);
    const combinedMinat = Array.from(
      new Set([...tier1Minat, ...tier2Minat, ...baseMinat])
    ).slice(0, 10);

    return {
      skills: combinedSkills.length > 0 ? combinedSkills : SKILL_OPTIONS,
      minat: combinedMinat.length > 0 ? combinedMinat : MINAT_OPTIONS,
    };
  } catch (err) {
    console.error("Gagal memuat skill & minat dinamis dari Supabase DB:", err);
    return { skills: SKILL_OPTIONS, minat: MINAT_OPTIONS };
  }
}

/* ─── Sektor & Kota lookup for company registration ─── */
export interface SektorItem {
  id: number;
  nama_sektor: string;
}

export interface KotaItem {
  id: number;
  nama_kota: string;
  provinsi?: string | null;
}

export async function fetchSektorOptions(): Promise<SektorItem[]> {
  try {
    const { data } = await supabase
      .from("sektor_perusahaan")
      .select("id, nama_sektor")
      .order("nama_sektor", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function fetchKotaOptions(): Promise<KotaItem[]> {
  try {
    const { data } = await supabase
      .from("kota")
      .select("id, nama_kota, provinsi")
      .order("nama_kota", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getOrCreateRefId(table: string, column: string, value: string): Promise<number> {
  const { data } = await supabase.from(table).select("id").eq(column, value).maybeSingle();
  if (data) return data.id;
  const { data: newRow, error } = await supabase.from(table).insert([{ [column]: value }]).select("id").single();
  if (error) throw new Error(`Gagal menyimpan referensi ${table}: ${error.message}`);
  return newRow.id;
}

export async function generateUsername(name: string): Promise<string> {
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 15) || "student";
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${clean}_${randomNum}`;
}

export async function processRegistration(formData: FormDataState): Promise<void> {
  // 1. Supabase Auth Sign Up (shared for both roles)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  });
  if (authError) throw authError;

  const userId = authData.user?.id;
  if (!userId) throw new Error("Gagal mendapatkan User ID dari sesi pendaftaran.");

  // 2. Insert into users table
  const username = await generateUsername(formData.nama);

  if (formData.role === "perusahaan") {
    /* ──────────────────────────────────────────
       PERUSAHAAN REGISTRATION FLOW
    ────────────────────────────────────────── */
    const { error: userError } = await supabase.from("users").insert([
      { id: userId, email: formData.email, role: "perusahaan", username },
    ]);
    if (userError) throw userError;

    // Resolve sektor_id and kota_id
    let sektorId = formData.sektorId;
    let kotaId = formData.kotaId;

    // Fallback: try to get/create by name if IDs are missing
    if (!sektorId && formData.industri) {
      sektorId = await getOrCreateRefId("sektor_perusahaan", "nama_sektor", formData.industri);
    }
    if (!kotaId && formData.lokasiPerusahaan) {
      kotaId = await getOrCreateRefId("kota", "nama_kota", formData.lokasiPerusahaan);
    }

    if (!sektorId) throw new Error("Sektor industri perusahaan tidak ditemukan.");
    if (!kotaId) throw new Error("Kota/lokasi perusahaan tidak ditemukan.");

    const tahunBerdiriNum = formData.tahunBerdiri
      ? parseInt(formData.tahunBerdiri, 10)
      : null;

    const { error: profileError } = await supabase.from("perusahaan_profiles").insert([
      {
        user_id: userId,
        nama_perusahaan: formData.nama,
        nib: formData.nib.trim(),
        deskripsi_perusahaan: formData.deskripsiPerusahaan || null,
        sektor_id: sektorId,
        kota_id: kotaId,
        logo_url: formData.logoUrl.trim() || null,
        alamat_lengkap: formData.alamatLengkap.trim() || null,
        situs_web: formData.situsWeb.trim() || null,
        ukuran_perusahaan: formData.ukuranPerusahaan || "1-10",
        tahun_berdiri: tahunBerdiriNum,
        status_verifikasi: "Menunggu Verifikasi",
      },
    ]);
    if (profileError) throw profileError;
  } else {
    /* ──────────────────────────────────────────
       MAHASISWA REGISTRATION FLOW
    ────────────────────────────────────────── */
    const finalUniv = formData.isCustomUniv ? formData.customUnivInput.trim() : formData.universitas;
    const finalProdi = formData.isCustomProdi ? formData.customProdiInput.trim() : formData.prodi;

    const { error: userError } = await supabase.from("users").insert([
      { id: userId, email: formData.email, role: "mahasiswa", username },
    ]);
    if (userError) throw userError;

    const univId = await getOrCreateRefId("universitas", "nama_universitas", finalUniv);
    const prodiId = await getOrCreateRefId("program_studi", "nama_prodi", finalProdi);

    const { error: profileError } = await supabase.from("mahasiswa_profiles").insert([
      {
        user_id: userId,
        nama_lengkap: formData.nama,
        universitas_id: univId,
        prodi_id: prodiId,
        semester: formData.semester,
        preferensi_tipe: formData.preferensiTipe,
        preferensi_lokasi: formData.preferensiLokasi,
        ringkasan_self: formData.ringkasanSelf || "Mahasiswa aktif",
        xp: 0,
        streak_count: 0,
        reputation_score: 0,
        response_rate: 0.0,
      },
    ]);
    if (profileError) throw profileError;

    for (const minatName of formData.selectedMinat) {
      const minatId = await getOrCreateRefId("kategori_minat", "nama_kategori", minatName);
      await supabase.from("mahasiswa_minat").insert([
        { mahasiswa_id: userId, kategori_id: minatId },
      ]);
    }

    for (const skillName of formData.selectedSkills) {
      const skillId = await getOrCreateRefId("skills", "nama_skill", skillName);
      await supabase.from("mahasiswa_skills").insert([
        { mahasiswa_id: userId, skill_id: skillId },
      ]);
    }
  }
}
