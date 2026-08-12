import { supabase } from "@/lib/supabase";

export const notifikasiService = {
  async kirim(recipientUserId: string, judul: string, pesan: string): Promise<boolean> {
    const { error } = await supabase
      .from("notifikasi")
      .insert({ recipient_user_id: recipientUserId, judul, pesan });
    if (error) console.error("[notifikasi] gagal:", error.message);
    return !error;
  },

  async kirimKePelamarAktif(kolaborasiId: string, judul: string, pesan: string) {
    const { data, error } = await supabase
      .from("pendaftaran_kolaborasi")
      .select("mahasiswa_id")
      .eq("kolaborasi_id", kolaborasiId)
      .neq("status", "Ditolak");

    if (error || !data) return false;
    await Promise.all(data.map((p) => this.kirim(p.mahasiswa_id, judul, pesan)));
    return true;
  },
};