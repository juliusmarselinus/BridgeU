import { supabase } from "@/lib/supabase";

export interface ChatMessage {
  id: string;
  kolaborasi_id: string;
  mahasiswa_id: string;
  pengirim_id: string;
  tipe_pengirim: "perusahaan" | "mahasiswa";
  pesan: string;
  created_at: string;
}

export const chatService = {
  async fetchPesan(kolaborasiId: string, mahasiswaId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from("chat_kolaborasi")
      .select("*")
      .eq("kolaborasi_id", kolaborasiId)
      .eq("mahasiswa_id", mahasiswaId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[chat] gagal ambil pesan:", error.message);
      return [];
    }
    return (data as ChatMessage[]) ?? [];
  },

  async kirim(
    kolaborasiId: string,
    mahasiswaId: string,
    pengirimId: string,
    tipePengirim: "perusahaan" | "mahasiswa",
    pesan: string
  ): Promise<ChatMessage | null> {
    const { data, error } = await supabase
      .from("chat_kolaborasi")
      .insert({
        kolaborasi_id: kolaborasiId,
        mahasiswa_id: mahasiswaId,
        pengirim_id: pengirimId,
        tipe_pengirim: tipePengirim,
        pesan,
      })
      .select()
      .single();

    if (error) {
      console.error("[chat] gagal kirim:", error.message);
      return null;
    }
    return data as ChatMessage;
  },

  // Realtime: pesan baru masuk langsung nongol tanpa refresh
  subscribe(kolaborasiId: string, mahasiswaId: string, onPesanBaru: (pesan: ChatMessage) => void) {
    return supabase
      .channel(`chat-${kolaborasiId}-${mahasiswaId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_kolaborasi",
          filter: `kolaborasi_id=eq.${kolaborasiId}`,
        },
        (payload) => onPesanBaru(payload.new as ChatMessage)
      )
      .subscribe();
  },

  unsubscribe(channel: any) {
    if (channel) supabase.removeChannel(channel);
  },
};