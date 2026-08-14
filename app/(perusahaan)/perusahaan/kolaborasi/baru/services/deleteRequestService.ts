import { supabase } from "@/lib/supabase";
import { companyService } from "../../../dashboard/services/companyServices";

function formatRupiah(val: string) {
  const angka = val.replace(/[^0-9]/g, "");
  if (!angka) return "Rp 0";
  return `Rp ${Number(angka).toLocaleString("id-ID")}`;
}

export const deleteRequestService = {
  async ajukan(kolaborasiId: string, alasan: string, kompensasi: string, perusahaanId: string) {
    const { data: kol, error: kolErr } = await supabase
      .from("kolaborasi")
      .select("judul, gaji_stipend")
      .eq("id", kolaborasiId)
      .single();
    if (kolErr || !kol) {
      console.error("[hapus] gagal ambil kolaborasi:", kolErr?.message);
      return { success: false, langsungTerhapus: false };
    }

    const { data: pelamar, error: pelamarErr } = await supabase
      .from("pendaftaran_kolaborasi")
      .select("id, mahasiswa_id")
      .eq("kolaborasi_id", kolaborasiId)
      .eq("status", "Diterima");

    if (pelamarErr) {
      console.error("[hapus] gagal ambil pelamar diterima:", pelamarErr.message);
      return { success: false, langsungTerhapus: false };
    }

    if (!pelamar?.length) {
      const deleted = await companyService.deleteKolaborasi(kolaborasiId);
      if (!deleted) console.error("[hapus] deleteKolaborasi gagal (belum ada yang diterima)");
      return { success: deleted, langsungTerhapus: true };
    }

    const { data: req, error } = await supabase
      .from("permintaan_hapus_kolaborasi")
      .insert({
        kolaborasi_id: kolaborasiId,
        catatan_perusahaan: `Alasan: ${alasan} | Kompensasi: ${formatRupiah(kompensasi)}`,
      })
      .select("id")
      .single();
    if (error || !req) {
      console.error("[hapus] gagal insert permintaan_hapus_kolaborasi:", error?.message);
      return { success: false, langsungTerhapus: false };
    }

    const { data: persetujuanRows, error: persetujuanErr } = await supabase
      .from("persetujuan_hapus")
      .insert(pelamar.map((p) => ({ permintaan_id: req.id, pendaftaran_id: p.id })))
      .select("id, pendaftaran_id");

    if (persetujuanErr || !persetujuanRows) {
      console.error("[hapus] gagal insert persetujuan_hapus:", persetujuanErr?.message);
      return { success: false, langsungTerhapus: false };
    }

    const teksPesan = [
      "Perusahaan mengajukan pembatalan proyek berikut:",
      "",
      `Proyek: ${kol.judul}`,
      `Gaji/Stipend: ${kol.gaji_stipend ? formatRupiah(kol.gaji_stipend) : "Sesuai kesepakatan"}`,
      `Kompensasi Ditawarkan: ${formatRupiah(kompensasi)}`,
      `Alasan: ${alasan || "-"}`,
      "",
      "Apakah kamu menyetujui pembatalan proyek ini?",
    ].join("\n");

    await Promise.all(
      pelamar.map((p) => {
        const persetujuan = persetujuanRows.find((pr) => pr.pendaftaran_id === p.id);
        const marker = `__HAPUS_PROYEK__${JSON.stringify({
          persetujuan_id: persetujuan?.id,
          permintaan_id: req.id,
        })}__`;

        return supabase.from("chat_kolaborasi").insert({
          kolaborasi_id: kolaborasiId,
          mahasiswa_id: p.mahasiswa_id,
          pengirim_id: perusahaanId,
          tipe_pengirim: "perusahaan",
          pesan: `${marker}${teksPesan}`,
          is_read: false,
        });
      })
    );

    return { success: true, langsungTerhapus: false };
  },

  async setujui(persetujuanId: string) {
  const { data, error } = await supabase.rpc("setujui_hapus_kolaborasi", {
    p_persetujuan_id: persetujuanId,
  });
  if (error) {
    console.error("[hapus] gagal setujui:", error.message);
    return false;
  }
  return data === true;
},

  async tolak(persetujuanId: string) {
    const { error } = await supabase
      .from("persetujuan_hapus")
      .update({ status: "Ditolak", responded_at: new Date().toISOString() })
      .eq("id", persetujuanId);
    return !error;
  },

  async cekSemuaSetuju(permintaanId: string) {
    const { data: belum } = await supabase
      .from("persetujuan_hapus")
      .select("status")
      .eq("permintaan_id", permintaanId)
      .neq("status", "Disetujui");

    if (belum && belum.length === 0) {
      const { data: req } = await supabase
        .from("permintaan_hapus_kolaborasi")
        .update({ status: "Selesai", resolved_at: new Date().toISOString() })
        .eq("id", permintaanId)
        .select("kolaborasi_id")
        .single();

      if (req) {
        const deleted = await companyService.deleteKolaborasi(req.kolaborasi_id);
        return deleted;
      }
      return false;
    }
    return false;
  },
};