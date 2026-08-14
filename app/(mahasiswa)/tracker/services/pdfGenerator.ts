import { AutoAchievement, TrackerSummary, MahasiswaProfileInfo } from "../types/tracker";

export function generatePortfolioPDF(
  profile: MahasiswaProfileInfo | null,
  achievements: AutoAchievement[],
  summary: TrackerSummary | null
) {
  const nama = profile?.nama || "Mahasiswa";
  const univ = profile?.universitas || "Universitas";
  const prodi = profile?.prodi || "Program Studi";
  const sem = profile?.semester || "-";
  const totalCompleted = summary?.totalCompleted || achievements.length;
  const avgRating = summary?.averageRating || 5.0;

  const achievementsHtml = achievements.length === 0
    ? `<div style="text-align: center; padding: 40px; color: #64748b; font-style: italic;">Belum ada riwayat proyek kolaborasi yang tercatat.</div>`
    : achievements.map((ach) => `
      <div style="margin-bottom: 20px; padding: 18px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #ffffff; page-break-inside: avoid;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <div>
            <span style="font-size: 10px; font-weight: bold; text-transform: uppercase; padding: 3px 8px; border-radius: 6px; background-color: ${ach.tipe === 'Magang' ? '#f3e8ff' : '#e0f2fe'}; color: ${ach.tipe === 'Magang' ? '#6b21a8' : '#0369a1'}; margin-right: 8px;">
              ${ach.tipe}
            </span>
            <span style="font-size: 11px; color: #64748b; font-family: monospace;">${ach.kategori}</span>
            <h3 style="margin: 8px 0 4px 0; font-size: 15px; font-weight: bold; color: #0f172a;">${ach.judulKolaborasi}</h3>
            <p style="margin: 0; font-size: 12px; font-weight: 600; color: #475569;">Mitra Perusahaan: ${ach.perusahaan}</p>
          </div>
          <div style="font-size: 13px; font-weight: bold; color: #b45309; background-color: #fef3c7; border: 1px solid #fde68a; padding: 4px 10px; border-radius: 8px;">
            ★ ${ach.ratingScore} / 5.0
          </div>
        </div>

        <div style="margin-top: 10px; padding: 12px; background-color: #f8fafc; border-radius: 8px; font-size: 12px; color: #334155; line-height: 1.6;">
          <strong style="display: block; font-size: 10px; text-transform: uppercase; color: #64748b; margin-bottom: 4px;">Hasil & Dampak Luaran (Outcome):</strong>
          ${ach.outcomeSummary}
        </div>

        <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; border-top: 1px solid #f1f5f9; padding-top: 8px;">
          <div>
            <strong style="color: #64748b; margin-right: 6px;">Keahlian Terverifikasi:</strong>
            ${ach.skillsAcquired.map(s => `<span style="background: #f1f5f9; color: #0f172a; padding: 2px 8px; border-radius: 6px; font-weight: 600; margin-right: 4px; font-size: 10px;">${s}</span>`).join('')}
          </div>
          <div style="color: #64748b; font-family: monospace;">
            Selesai: ${ach.tanggalSelesai}
          </div>
        </div>
      </div>
    `).join("");

  const topSkillsHtml = (summary?.topSkills || []).map(sk => `
    <span style="display: inline-block; background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; font-weight: 700; font-size: 11px; padding: 4px 10px; border-radius: 20px; margin-right: 6px; margin-bottom: 6px;">
      ${sk.name} (${sk.count} Proyek)
    </span>
  `).join("");

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Portofolio_Kolaborasi_${nama.replace(/[^a-zA-Z0-9]/g, "_")}</title>
      <style>
        @page { size: A4; margin: 15mm; }
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #0f172a; margin: 0; padding: 20px; background: #ffffff; }
        .header { border-bottom: 2px solid #0f172a; padding-bottom: 14px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
        .title { font-size: 22px; font-weight: 900; color: #0f172a; margin: 0; }
        .subtitle { font-size: 11px; color: #64748b; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
        .profile-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        .section-title { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0f172a; margin-bottom: 12px; border-left: 4px solid #0284c7; padding-left: 8px; }
        .watermark { text-align: center; margin-top: 24px; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 class="title">PORTOFOLIO HASIL KOLABORASI</h1>
          <div class="subtitle">Official Student Achievement Record • BridgeU Platform</div>
        </div>
        <div style="text-align: right; font-size: 11px; color: #64748b;">
          Dicetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div class="profile-box">
        <div>
          <h2 style="margin: 0 0 4px 0; font-size: 16px; font-weight: bold; color: #0f172a;">${nama}</h2>
          <p style="margin: 0; font-size: 12px; color: #475569;">${prodi} • ${univ}</p>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">${sem}</p>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: bold;">Proyek Selesai</div>
          <div style="font-size: 20px; font-weight: 900; color: #0284c7;">${totalCompleted} Proyek</div>
          <div style="font-size: 11px; color: #166534; font-weight: bold; margin-top: 2px;">★ Rating Rata-Rata: ${avgRating} / 5.0</div>
        </div>
      </div>

      ${topSkillsHtml ? `
        <div style="margin-bottom: 20px;">
          <div class="section-title">Ringkasan Keahlian Terverifikasi</div>
          <div>${topSkillsHtml}</div>
        </div>
      ` : ''}

      <div>
        <div class="section-title">Daftar Rekam Jejak Luaran Proyek</div>
        ${achievementsHtml}
      </div>

      <div class="watermark">
        Dokumen portofolio ini digenerate secara otomatis oleh platform BridgeU berbasis verifikasi resmi mitra perusahaan.
      </div>
    </body>
    </html>
  `);
  doc.close();

  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 300);
}
