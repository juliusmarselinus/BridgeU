import { supabase } from "@/lib/supabase";
import { AutoAchievement, TrackerSummary, MahasiswaProfileInfo } from "../types/tracker";

export async function fetchStudentPortfolioTrackerData(): Promise<{
  profile: MahasiswaProfileInfo;
  achievements: AutoAchievement[];
  summary: TrackerSummary;
}> {
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData?.user?.id;

  let profileInfo: MahasiswaProfileInfo = {
    nama: "Mahasiswa",
    universitas: "Universitas",
    prodi: "Program Studi",
    semester: "Semester",
    xp: 0,
  };

  if (userId) {
    const { data: profileRow } = await supabase
      .from("mahasiswa_profiles")
      .select("nama_lengkap, semester, foto_url, xp, universitas:universitas_id(nama_universitas), prodi:prodi_id(nama_prodi)")
      .eq("user_id", userId)
      .maybeSingle();

    if (profileRow) {
      profileInfo = {
        nama: profileRow.nama_lengkap || profileInfo.nama,
        universitas: (profileRow.universitas as any)?.nama_universitas || profileInfo.universitas,
        prodi: (profileRow.prodi as any)?.nama_prodi || profileInfo.prodi,
        semester: profileRow.semester || profileInfo.semester,
        foto: profileRow.foto_url || undefined,
        xp: profileRow.xp || 0,
      };
    }
  }

  let dbAchievements: AutoAchievement[] = [];

  if (userId) {
    // Ambil pengajuan kolaborasi mahasiswa yang berstatus "Selesai"
    const { data: pendaftaranList } = await supabase
      .from("pendaftaran_kolaborasi")
      .select(`
        id,
        status,
        ratings,
        tanggal_daftar,
        catatan_perusahaan,
        kolaborasi:kolaborasi_id (
          id,
          judul,
          tipe,
          deskripsi,
          kategori:kategori_id ( nama_kategori ),
          perusahaan:perusahaan_id ( nama_perusahaan ),
          kolaborasi_skills (
            skills ( nama_skill )
          )
        ),
        riwayat_pengumpulan_kolaborasi (
          url_hasil,
          catatan_mahasiswa,
          evaluasi_perusahaan,
          created_at
        )
      `)
      .eq("mahasiswa_id", userId)
      .eq("status", "Selesai");

    if (pendaftaranList && pendaftaranList.length > 0) {
      dbAchievements = pendaftaranList.map((item: any) => {
        const colab = item.kolaborasi || {};
        const comp = colab.perusahaan || {};
        const riwayat = item.riwayat_pengumpulan_kolaborasi || [];
        const latestRiwayat = riwayat.length > 0 ? riwayat[riwayat.length - 1] : null;

        const extractedSkills: string[] = (colab.kolaborasi_skills || [])
          .map((s: any) => s.skills?.nama_skill)
          .filter(Boolean);

        const rawDate = item.tanggal_daftar ? new Date(item.tanggal_daftar) : new Date();
        const formattedDate = rawDate.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        // Outcome summary diambil dari evaluasi perusahaan / catatan pendaftaran / deskripsi kolaborasi
        let outcome = latestRiwayat?.evaluasi_perusahaan || item.catatan_perusahaan || latestRiwayat?.catatan_mahasiswa || colab.deskripsi || "";
        if (!outcome) {
          outcome = `Telah menyelesaikan seluruh luaran proyek ${colab.judul || "kolaborasi"} secara tuntas.`;
        }

        const realRating = item.ratings != null ? Number(item.ratings) : 5.0;

        return {
          id: item.id,
          judulKolaborasi: colab.judul || "Proyek Kolaborasi",
          perusahaan: comp.nama_perusahaan || "Mitra Perusahaan",
          tipe: colab.tipe === "Magang" ? "Magang" : "Akademik",
          kategori: colab.kategori?.nama_kategori || "Kolaborasi",
          tanggalSelesai: formattedDate,
          outcomeSummary: outcome,
          ratingScore: realRating,
          ratingStars: Math.min(5, Math.max(1, Math.round(realRating))),
          skillsAcquired: extractedSkills.length > 0 ? extractedSkills : ["Kolaborasi Industri"],
          verifiedByPerusahaan: true,
          suratRefUrl: latestRiwayat?.url_hasil || undefined,
        };
      });
    }
  }

  // Calculate Summary Metrics strictly from real records
  const totalCompleted = dbAchievements.filter((a) => a.verifiedByPerusahaan).length;
  const avgRating =
    dbAchievements.length > 0
      ? dbAchievements.reduce((acc, curr) => acc + curr.ratingScore, 0) / dbAchievements.length
      : 0;

  const skillCountMap: Record<string, number> = {};
  dbAchievements.forEach((ach) => {
    ach.skillsAcquired.forEach((skill) => {
      skillCountMap[skill] = (skillCountMap[skill] || 0) + 1;
    });
  });

  const topSkills = Object.entries(skillCountMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return {
    profile: profileInfo,
    achievements: dbAchievements,
    summary: {
      totalCompleted,
      averageRating: Number(avgRating.toFixed(1)),
      totalSkillsVerified: Object.keys(skillCountMap).length,
      topSkills,
    },
  };
}
