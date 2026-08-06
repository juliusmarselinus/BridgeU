// app/api/send-notification/route.ts
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { namaMahasiswa, emailMahasiswa, namaKolaborasi, namaPerusahaan } = await req.json();

  if (!emailMahasiswa) {
    return NextResponse.json({ success: false, error: "emailMahasiswa wajib diisi" }, { status: 400 });
  }

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

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}