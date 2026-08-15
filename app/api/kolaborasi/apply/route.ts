import { NextRequest, NextResponse } from "next/server";
import { supabase, getAuthedClient } from "@/lib/supabase";

/**
 * In-Memory Mutex Queue per Kolaborasi ID
 * Memastikan request pendaftaran yang datang bersamaan diproses secara antrean (sequential)
 */
class TaskQueue {
  private queues: Map<string, Array<() => Promise<void>>> = new Map();
  private processing: Map<string, boolean> = new Map();

  async enqueue<T>(key: string, task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const wrappedTask = async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (err) {
          reject(err);
        }
      };

      if (!this.queues.has(key)) {
        this.queues.set(key, []);
      }
      this.queues.get(key)!.push(wrappedTask);

      this.processQueue(key);
    });
  }

  private async processQueue(key: string) {
    if (this.processing.get(key)) return;

    const queue = this.queues.get(key);
    if (!queue || queue.length === 0) return;

    this.processing.set(key, true);
    const task = queue.shift();

    if (task) {
      try {
        await task();
      } catch (e) {
        console.error(`Error processing queue for ${key}:`, e);
      }
    }

    this.processing.set(key, false);
    if (queue.length > 0) {
      this.processQueue(key);
    } else {
      this.queues.delete(key);
      this.processing.delete(key);
    }
  }
}

const applyQueue = new TaskQueue();

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized. Silakan login terlebih dahulu." }, { status: 401 });
    }

    // Verifikasi Auth User pakai token
    const db = getAuthedClient(token);
    const { data: authData, error: authError } = await db.auth.getUser(token);
    if (authError || !authData?.user) {
      return NextResponse.json({ error: "Unauthorized. Silakan login terlebih dahulu." }, { status: 401 });
    }

    const userId = authData.user.id;
    const body = await req.json();
    const { kolaborasiId, portofolio, tujuanMengajukan, ketersediaan, tanggalMulaiDiinginkan } = body;

    if (!kolaborasiId) {
      return NextResponse.json({ error: "kolaborasiId wajib diisi." }, { status: 400 });
    }

    // Masukkan proses ke Queue berdasarkan kolaborasiId
    const result = await applyQueue.enqueue(kolaborasiId, async () => {
      // 1. Cek apakah user sudah pernah mendaftar
      const { data: existingApp } = await db
        .from("pendaftaran_kolaborasi")
        .select("id")
        .eq("kolaborasi_id", kolaborasiId)
        .eq("mahasiswa_id", userId)
        .maybeSingle();

      if (existingApp) {
        return { error: "Anda sudah pernah mendaftar pada kolaborasi ini.", status: 400 };
      }

      // 2. Fetch kolaborasi & slot
      const { data: kolab, error: fetchErr } = await db
        .from("kolaborasi")
        .select("id, slot, current_slot, tipe")
        .eq("id", kolaborasiId)
        .single();

      if (fetchErr || !kolab) {
        return { error: "Kolaborasi tidak ditemukan.", status: 404 };
      }

      // Slot awal yang dibuka = kolab.slot
      // Sisa slot saat ini = kolab.current_slot (jika null, default ke kolab.slot)
      const currentAvailable = kolab.current_slot !== null && kolab.current_slot !== undefined ? Number(kolab.current_slot) : (kolab.slot ?? 0);

      // 3. Validasi Slot tersisa jika slot tidak null
      if (kolab.slot !== null && currentAvailable <= 0) {
        return { error: "Maaf, slot kuota untuk kolaborasi ini telah habis.", status: 400 };
      }

      // 4. Update current_slot (slot awal 'slot' TETAP, 'current_slot' BERKURANG 1)
      let newCurrentSlot = currentAvailable;
      if (kolab.slot !== null) {
        newCurrentSlot = Math.max(0, currentAvailable - 1);
        
        // Coba panggil RPC decrement_kolaborasi_slot jika ada di Supabase
        const { error: rpcErr } = await supabase.rpc("decrement_kolaborasi_slot", { p_kolaborasi_id: kolaborasiId });

        if (rpcErr) {
          // Fallback ke direct update menggunakan supabase client
          const { error: pubUpdateErr } = await supabase
            .from("kolaborasi")
            .update({ current_slot: newCurrentSlot, updated_at: new Date().toISOString() })
            .eq("id", kolaborasiId);

          if (pubUpdateErr) {
            console.error("❌ Gagal update current_slot:", pubUpdateErr.message);
            // Tetap berlanjut jika RLS menolak update, tapi catat error
          }
        }
      }

      // 5. Insert pendaftaran_kolaborasi (termasuk tujuan_mengajukan, ketersediaan, & tanggal_mulai_diinginkan)
      const insertPayload = {
        kolaborasi_id: kolaborasiId,
        mahasiswa_id: userId,
        status: "Menunggu",
        url_portofolio_dokumen: portofolio || null,
        tujuan_mengajukan: tujuanMengajukan || null,
        ketersediaan: ketersediaan || null,
        tanggal_mulai_diinginkan: tanggalMulaiDiinginkan || null,
        updated_at: new Date().toISOString(),
      };

      let inserted = null;
      let { data: insData, error: insertErr } = await db
        .from("pendaftaran_kolaborasi")
        .insert(insertPayload)
        .select()
        .maybeSingle();

      if (insertErr) {
        // Fallback pakai service role / admin client jika RLS blocking
        const { data: pubData, error: pubErr } = await supabase
          .from("pendaftaran_kolaborasi")
          .insert(insertPayload)
          .select()
          .maybeSingle();

        if (pubErr) {
          // Rollback current_slot jika insert pendaftaran gagal di kedua client
          if (kolab.slot !== null) {
            await supabase
              .from("kolaborasi")
              .update({ current_slot: currentAvailable })
              .eq("id", kolaborasiId);
          }
          return { error: `Gagal mendaftar kolaborasi: ${pubErr.message}`, status: 500 };
        }
        inserted = pubData;
      } else {
        inserted = insData;
      }

      return { success: true, data: inserted, slotTersisa: newCurrentSlot };
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Error in /api/kolaborasi/apply:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
