// app/api/send-notification/route.ts
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { recipientUserId, namaMahasiswa, emailMahasiswa, namaKolaborasi, namaPerusahaan } = await req.json();

  // 1. Simpan Web Notification ke tabel Supabase `notifikasi`
  if (recipientUserId) {
    await supabase
      .from("notifikasi")
      .insert({
        recipient_user_id: recipientUserId,
        judul: `Selamat! Pengajuan Diterima oleh ${namaPerusahaan || "Perusahaan"}`,
        pesan: `Pengajuan kolaborasi kamu untuk '${namaKolaborasi || "Proyek"}' telah diterima oleh ${namaPerusahaan || "mitra perusahaan"}.`,
        is_read: false,
        created_at: new Date().toISOString(),
      });
  }

  // 2. Send email via Resend (jika API Key tersedia)
  if (emailMahasiswa) {
    try {
      await resend.emails.send({
        from: "BridgeU <onboarding@resend.dev>",
        to: emailMahasiswa,
        subject: `Selamat! Pengajuan kamu diterima oleh ${namaPerusahaan}`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #0f172a;">Halo ${namaMahasiswa},</h2>
            <p style="color: #334155; line-height: 1.6;">
              Kabar baik! Pengajuan kolaborasi kamu untuk
              <b>${namaKolaborasi}</b> telah <b style="color: #059669;">diterima</b>
              oleh <b>${namaPerusahaan}</b>.
            </p>
            <p style="color: #334155; line-height: 1.6;">
              Silakan buka dashboard BridgeU kamu untuk melihat detail selanjutnya.
            </p>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
              Email ini dikirim otomatis oleh platform BridgeU.
            </p>
          </div>
        `,
      });
    } catch (error) {
      // Ignore
    }
  }

  return NextResponse.json({ success: true });
}