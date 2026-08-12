import { supabase } from "@/lib/supabase";
import { notifikasiService } from "./notifikasiService";
import { companyService } from "../../../dashboard/services/companyServices";

export const deleteRequestService = {
  async ajukan(kolaborasiId: string, catatan?: string) {
    const { data: req, error } = await supabase
      .from("permintaan_hapus_kolaborasi")
      .insert({ kolaborasi_id: kolaborasiId, catatan_perusahaan: catatan })
      .select("id")
      .single();
    if (error || !req) return false;

    const { data: pelamar } = await supabase
      .from("pendaftaran_kolaborasi")
      .select("id, mahasiswa_id")
      .eq("kolaborasi_id", kolaborasiId)
      .neq("status", "Ditolak");
    if (!pelamar?.length) return false;

    await supabase.from("persetujuan_hapus").insert(
      pelamar.map((p) => ({ permintaan_id: req.id, pendaftaran_id: p.id }))
    );

    await Promise.all(pelamar.map((p) =>
      notifikasiService.kirim(
        p.mahasiswa_id,
        "Permintaan Penghapusan Proyek",
        "Perusahaan mengajukan penghapusan proyek. Buka detail proyek untuk menyetujui/menolak beserta kesepakatan kompensasi."
      )
    ));
    return true;
  },

  async setujui(persetujuanId: string, kesepakatanKompensasi?: string) {
    const { data, error } = await supabase
      .from("persetujuan_hapus")
      .update({
        status: "Disetujui",
        kesepakatan_kompensasi: kesepakatanKompensasi,
        responded_at: new Date().toISOString(),
      })
      .eq("id", persetujuanId)
      .select("permintaan_id")
      .single();
    if (error || !data) return false;
    return this.cekSemuaSetuju(data.permintaan_id);
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

      if (req) await companyService.deleteKolaborasi(req.kolaborasi_id); // reuse cleanup yang udah ada
      return true;
    }
    return false;
  },
};