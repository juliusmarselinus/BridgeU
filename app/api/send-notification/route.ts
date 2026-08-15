// app/api/send-notification/route.ts
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const {
    recipientUserId,
    namaMahasiswa,
    emailMahasiswa,
    namaKolaborasi,
    namaPerusahaan,
    status, // "Diterima" | "Ditolak"
    catatan, // opsional, alasan penolakan
  } = await req.json();

  const isDiterima = status === "Diterima";

  const judulNotif = isDiterima
    ? `Selamat! Pengajuan Diterima oleh ${namaPerusahaan || "Perusahaan"}`
    : `Pengajuan Kamu untuk "${namaKolaborasi || "Proyek"}" Belum Berhasil`;

  const pesanNotif = isDiterima
    ? `Pengajuan kolaborasi kamu untuk '${namaKolaborasi || "Proyek"}' telah diterima oleh ${namaPerusahaan || "mitra perusahaan"}.`
    : `Pengajuan kolaborasi kamu untuk '${namaKolaborasi || "Proyek"}' belum berhasil di tahap ini.${catatan ? ` Catatan: ${catatan}` : ""}`;

  // 1. Simpan Web Notification ke tabel Supabase `notifikasi`
  if (recipientUserId) {
    await supabase
      .from("notifikasi")
      .insert({
        recipient_user_id: recipientUserId,
        judul: judulNotif,
        pesan: pesanNotif,
        is_read: false,
        created_at: new Date().toISOString(),
      });
  }

  // 2. Send email via Resend (jika email tersedia)
  if (emailMahasiswa) {
    try {
      const emailSubject = isDiterima
        ? `Selamat! Pengajuan kamu diterima oleh ${namaPerusahaan}`
        : `Update Pengajuan Kolaborasi: ${namaKolaborasi}`;

      const emailHtml = isDiterima
        ? `
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
        `
        : `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #0f172a;">Halo ${namaMahasiswa},</h2>
            <p style="color: #334155; line-height: 1.6;">
              Terima kasih telah mengajukan diri untuk kolaborasi
              <b>${namaKolaborasi}</b> di <b>${namaPerusahaan}</b>.
            </p>
            <p style="color: #334155; line-height: 1.6;">
              Setelah dipertimbangkan, pengajuan kamu belum berhasil di tahap ini.
              ${catatan ? `<br/><br/><i>Catatan dari perusahaan: "${catatan}"</i>` : ""}
            </p>
            <p style="color: #334155; line-height: 1.6;">
              Jangan berkecil hati — masih banyak peluang kolaborasi lain yang menunggumu di BridgeU!
            </p>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
              Email ini dikirim otomatis oleh platform BridgeU.
            </p>
          </div>
        `;

      await resend.emails.send({
        from: "BridgeU <onboarding@resend.dev>",
        to: emailMahasiswa,
        subject: emailSubject,
        html: emailHtml,
      });
    } catch (error) {
      // Ignore
    }
  }

  return NextResponse.json({ success: true });
}