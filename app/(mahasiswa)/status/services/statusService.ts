import { supabase } from "@/lib/supabase";
import { notifyPengajuanDiterima, notifyPengajuanDitolak } from "@/lib/notifications";
import { StatusItem, StatusKey } from "../types/status";

export async function fetchMahasiswaStatusList(): Promise<StatusItem[]> {
  const { data: authData } = await supabase.auth.getUser();
  const currentUserId = authData?.user?.id;

  if (!currentUserId) return [];

  const { data: dbData } = await supabase
    .from("pendaftaran_kolaborasi")
    .select(`
      id,
      kolaborasi_id,
      status,
      ratings,
      tanggal_daftar,
      catatan_perusahaan,
      url_bukti_bayar,
      status_pembayaran,
      kolaborasi:kolaborasi_id (
        judul,
        tipe,
        gaji_stipend,
        perusahaan:perusahaan_id ( nama_perusahaan )
      ),
      riwayat_pengumpulan_kolaborasi (
        url_hasil,
        created_at
      )
    `)
    .eq("mahasiswa_id", currentUserId)
    .order("tanggal_daftar", { ascending: false });

  if (!dbData || dbData.length === 0) return [];

  const kolaborasiDibatalkanIds = dbData
    .filter((item: any) => item.status === "Dibatalkan")
    .map((item: any) => item.kolaborasi_id);

  let catatanPembatalanMap: Record<string, string> = {};
  if (kolaborasiDibatalkanIds.length > 0) {
    const { data: permintaanRows } = await supabase
      .from("permintaan_hapus_kolaborasi")
      .select("kolaborasi_id, catatan_perusahaan")
      .in("kolaborasi_id", kolaborasiDibatalkanIds)
      .eq("status", "Selesai");

    (permintaanRows || []).forEach((row: any) => {
      catatanPembatalanMap[row.kolaborasi_id] = row.catatan_perusahaan;
    });
  }

  const mapped: StatusItem[] = dbData.map((item: any) => {
    const riwayatList = item.riwayat_pengumpulan_kolaborasi || [];
    const latestSubmission =
      riwayatList.length > 0
        ? riwayatList.sort(
            (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0]
        : null;
    const rawDate = item.tanggal_daftar ? new Date(item.tanggal_daftar) : null;
    const formattedDate = rawDate
      ? rawDate.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "-";

    const colab = item.kolaborasi || {};
    const comp = colab.perusahaan || {};

    let statusKey: StatusKey = "Menunggu";
    if (
      item.status === "Diproses" ||
      item.status === "Diterima" ||
      item.status === "Evaluasi" ||
      item.status === "Revisi" ||
      item.status === "Ditolak" ||
      item.status === "Selesai" ||
      item.status === "Dibatalkan"
    ) {
      statusKey = item.status;
    }

    return {
      id: item.id,
      kolaborasi_id: item.kolaborasi_id,
      judul: colab.judul || "Proyek Kolaborasi",
      perusahaan: comp.nama_perusahaan || "Mitra Perusahaan",
      tipe: colab.tipe || "Akademik",
      status: statusKey,
      tanggal_daftar: formattedDate,
      tanggal_raw: rawDate ? rawDate.getTime() : 0,
      catatan_perusahaan: item.catatan_perusahaan || undefined,
      catatan_pembatalan: catatanPembatalanMap[item.kolaborasi_id] || undefined,
      url_hasil_kolaborasi: latestSubmission?.url_hasil || undefined,
      ratings: item.ratings != null ? Number(item.ratings) : null,
      gajiStipend: colab.gaji_stipend || undefined,
      urlBuktiBayar: item.url_bukti_bayar || undefined,
      statusPembayaran: item.status_pembayaran || undefined,
    };
  });

  return mapped;
}
