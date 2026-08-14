import { supabase } from "@/lib/supabase";

export interface ChatMessage {
  id: string;
  kolaborasi_id: string;
  mahasiswa_id: string;
  pengirim_id: string;
  tipe_pengirim: "perusahaan" | "mahasiswa";
  pesan: string;
  created_at: string;
  is_read?: boolean;
}

export interface InboxThread {
  kolaborasi_id: string;
  kolaborasi_judul: string;
  mahasiswa_id: string;
  nama_mahasiswa: string;
  foto_mahasiswa: string | null;
  last_message: string;
  last_message_at: string;
  last_sender: "perusahaan" | "mahasiswa";
  unread_count: number;
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
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      console.error("[chat] gagal kirim:", error.message);
      return null;
    }

    // Kirim notifikasi ke lawan bicara (best-effort, gak menggagalkan pengiriman chat kalau error)
    try {
      if (tipePengirim === "mahasiswa") {
        const { data: kol } = await supabase
          .from("kolaborasi")
          .select("perusahaan_id, judul")
          .eq("id", kolaborasiId)
          .maybeSingle();

        if (kol?.perusahaan_id) {
          await supabase.from("notifikasi").insert({
            recipient_user_id: kol.perusahaan_id,
            judul: "Pesan Baru dari Mahasiswa",
            pesan: `Terkait proyek "${kol.judul}": "${pesan.slice(0, 80)}${pesan.length > 80 ? "..." : ""}"`,
            is_read: false,
          });
        }
      } else {
        await supabase.from("notifikasi").insert({
          recipient_user_id: mahasiswaId,
          judul: "Pesan Baru dari Perusahaan",
          pesan: `"${pesan.slice(0, 80)}${pesan.length > 80 ? "..." : ""}"`,
          is_read: false,
        });
      }
    } catch (notifErr) {
      console.error("[chat] gagal kirim notifikasi:", notifErr);
    }

    return data as ChatMessage;
  },

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

  // Subscribe ke SEMUA pesan masuk untuk 1 kolaborasi (semua mahasiswa),
  // dipakai buat update badge unread di semua kartu pelamar, bukan cuma yang lagi dibuka
  subscribeAllForKolaborasi(kolaborasiId: string, onPesanBaru: (pesan: ChatMessage) => void) {
    return supabase
      .channel(`chat-all-${kolaborasiId}`)
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

  // Subscribe realtime ke SEMUA pesan masuk dari mahasiswa, lintas kolaborasi milik 1 perusahaan.
  // Dipakai di halaman list kolaborasi buat update badge unread tiap card tanpa polling.
  // kolaborasiIds dipakai buat filter client-side karena Supabase realtime filter gak support "in".
  subscribeAllUnreadForPerusahaan(
    kolaborasiIds: string[],
    onPesanBaruDariMahasiswa: (pesan: ChatMessage) => void
  ) {
    const idsSet = new Set(kolaborasiIds);
    return supabase
      .channel(`chat-unread-perusahaan-${kolaborasiIds.join("-").slice(0, 40)}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_kolaborasi",
        },
        (payload) => {
          const pesan = payload.new as ChatMessage;
          if (pesan.tipe_pengirim === "mahasiswa" && idsSet.has(pesan.kolaborasi_id)) {
            onPesanBaruDariMahasiswa(pesan);
          }
        }
      )
      .subscribe();
  },

  // Hitung unread PER KOLABORASI untuk semua proyek milik 1 perusahaan (dipakai di daftar card)
  async fetchUnreadCountsPerKolaborasi(perusahaanId: string): Promise<Record<string, number>> {
    const { data: kolaborasiRows } = await supabase
      .from("kolaborasi")
      .select("id")
      .eq("perusahaan_id", perusahaanId);

    if (!kolaborasiRows || kolaborasiRows.length === 0) return {};

    const ids = kolaborasiRows.map((k: any) => k.id);

    const { data, error } = await supabase
      .from("chat_kolaborasi")
      .select("kolaborasi_id")
      .in("kolaborasi_id", ids)
      .eq("tipe_pengirim", "mahasiswa")
      .eq("is_read", false);

    if (error) {
      console.error("[chat] gagal hitung unread per kolaborasi:", error.message);
      return {};
    }

    const counts: Record<string, number> = {};
    (data || []).forEach((row: any) => {
      counts[row.kolaborasi_id] = (counts[row.kolaborasi_id] || 0) + 1;
    });
    return counts;
  },

  // Hitung unread per mahasiswa untuk 1 kolaborasi (dipakai di halaman detail/workspace)
  async fetchUnreadCounts(kolaborasiId: string, viewerTipe: "perusahaan" | "mahasiswa"): Promise<Record<string, number>> {
    const lawanTipe = viewerTipe === "perusahaan" ? "mahasiswa" : "perusahaan";

    const { data, error } = await supabase
      .from("chat_kolaborasi")
      .select("mahasiswa_id")
      .eq("kolaborasi_id", kolaborasiId)
      .eq("tipe_pengirim", lawanTipe)
      .eq("is_read", false);

    if (error) {
      console.error("[chat] gagal hitung unread:", error.message);
      return {};
    }

    const counts: Record<string, number> = {};
    (data || []).forEach((row: any) => {
      counts[row.mahasiswa_id] = (counts[row.mahasiswa_id] || 0) + 1;
    });
    return counts;
  },

  async markAsRead(kolaborasiId: string, mahasiswaId: string, viewerTipe: "perusahaan" | "mahasiswa") {
    const lawanTipe = viewerTipe === "perusahaan" ? "mahasiswa" : "perusahaan";

    const { data, error } = await supabase
      .from("chat_kolaborasi")
      .update({ is_read: true })
      .eq("kolaborasi_id", kolaborasiId)
      .eq("mahasiswa_id", mahasiswaId)
      .eq("tipe_pengirim", lawanTipe)
      .eq("is_read", false)
      .select("id");

    if (error) {
      console.error("[chat] gagal mark as read:", error.message);
    } else {
      console.log(`[chat] markAsRead: ${data?.length ?? 0} baris ke-update jadi read`);
    }
  },

  // Ambil semua thread percakapan milik 1 perusahaan, buat halaman Inbox terpusat
  async fetchInboxList(perusahaanId: string): Promise<InboxThread[]> {
    const { data: kolaborasiRows } = await supabase
      .from("kolaborasi")
      .select("id, judul")
      .eq("perusahaan_id", perusahaanId);

    if (!kolaborasiRows || kolaborasiRows.length === 0) return [];

    const kolaborasiMap: Record<string, string> = {};
    kolaborasiRows.forEach((k: any) => (kolaborasiMap[k.id] = k.judul));
    const ids = kolaborasiRows.map((k: any) => k.id);

    const { data: messages, error } = await supabase
      .from("chat_kolaborasi")
      .select(`
        id, kolaborasi_id, mahasiswa_id, pengirim_id, tipe_pengirim, pesan, created_at, is_read,
        mahasiswa_profiles ( nama_lengkap, foto_url )
      `)
      .in("kolaborasi_id", ids)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[chat] gagal ambil inbox:", error.message);
      return [];
    }

    const threads: Record<string, InboxThread> = {};

    (messages || []).forEach((msg: any) => {
      const key = `${msg.kolaborasi_id}__${msg.mahasiswa_id}`;
      if (!threads[key]) {
        threads[key] = {
          kolaborasi_id: msg.kolaborasi_id,
          kolaborasi_judul: kolaborasiMap[msg.kolaborasi_id] || "Kolaborasi",
          mahasiswa_id: msg.mahasiswa_id,
          nama_mahasiswa: msg.mahasiswa_profiles?.nama_lengkap || "Mahasiswa",
          foto_mahasiswa: msg.mahasiswa_profiles?.foto_url || null,
          last_message: msg.pesan,
          last_message_at: msg.created_at,
          last_sender: msg.tipe_pengirim,
          unread_count: 0,
        };
      }
      if (msg.tipe_pengirim === "mahasiswa" && !msg.is_read) {
        threads[key].unread_count += 1;
      }
    });

    return Object.values(threads).sort(
      (a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
    );
  },
};