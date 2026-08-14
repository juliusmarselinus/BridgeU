import { jsPDF } from "jspdf";
import { AutoAchievement, TrackerSummary, MahasiswaProfileInfo } from "../types/tracker";

export function generatePortfolioPDF(
  profile: MahasiswaProfileInfo | null,
  achievements: AutoAchievement[],
  summary: TrackerSummary | null
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const nama = profile?.nama || "Mahasiswa";
  const univ = profile?.universitas || "Universitas";
  const prodi = profile?.prodi || "Program Studi";
  const sem = profile?.semester || "-";
  const totalCompleted = summary?.totalCompleted || achievements.length;
  const avgRating = summary?.averageRating || 5.0;

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 15;

  // Header Banner with BridgeU Gradient theme
  doc.setFillColor(11, 24, 48); // #0b1830 (BridgeU primary ink)
  doc.roundedRect(15, y, pageWidth - 30, 26, 4, 4, "F");

  // White Background Container for Logo Visibility
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(19, y + 3, 24, 20, 3, 3, "F");

  // Load & Add logo.png with correct aspect ratio (1333:1000 => 20mm width x 15mm height inside 24x20 box)
  try {
    const img = new Image();
    img.src = "/logo.png";
    doc.addImage(img, "PNG", 21, y + 5.5, 20, 15);
  } catch (e) {
    // fallback if image fail
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("PORTOFOLIO HASIL KOLABORASI", 48, y + 11);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(186, 230, 253);
  doc.text("Official Student Achievement Record • BridgeU Platform", 48, y + 18);

  const tglStr = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.setTextColor(203, 213, 225);
  doc.text(tglStr, pageWidth - 22, y + 15, { align: "right" });

  y += 32;

  // Profile & Summary Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, y, pageWidth - 30, 26, 3, 3, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(nama, 22, y + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`${prodi} • ${univ} (${sem})`, 22, y + 17);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(2, 132, 199);
  doc.text(`Proyek Selesai: ${totalCompleted}`, pageWidth - 22, y + 10, { align: "right" });

  doc.setTextColor(22, 101, 52);
  doc.text(`Rating Rata-Rata: ${avgRating} / 5.0`, pageWidth - 22, y + 17, { align: "right" });

  y += 34;

  // Top Verified Skills Section
  if (summary && summary.topSkills.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("RINGKASAN KEAHLEAN TERVERIFIKASI", 15, y);

    y += 5;
    let xSkill = 15;
    summary.topSkills.forEach((sk) => {
      const label = `${sk.name} (${sk.count})`;
      const w = doc.getTextWidth(label) + 6;

      if (xSkill + w > pageWidth - 15) {
        xSkill = 15;
        y += 7;
      }

      doc.setFillColor(224, 242, 254);
      doc.setDrawColor(186, 230, 253);
      doc.roundedRect(xSkill, y - 4, w, 6, 1.5, 1.5, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(3, 105, 161);
      doc.text(label, xSkill + 3, y);

      xSkill += w + 3;
    });

    y += 12;
  }

  // Projects Section Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("DAFTAR REKAM JEJAK LUARAN PROYEK", 15, y);
  y += 6;

  if (achievements.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("Belum ada riwayat proyek kolaborasi yang berstatus selesai.", 15, y + 5);
  } else {
    achievements.forEach((ach) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const outcomeLines = doc.splitTextToSize(`Outcome: ${ach.outcomeSummary}`, pageWidth - 48);
      const outcomeBoxHeight = Math.max(10, outcomeLines.length * 4 + 4);
      const cardHeight = 17 + outcomeBoxHeight + 10;

      // Check for new page space
      if (y + cardHeight > 275) {
        doc.addPage();
        y = 20;
      }

      const cardStartY = y;

      // Card Header Line
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      const title = ach.judulKolaborasi.length > 50 ? ach.judulKolaborasi.slice(0, 47) + "..." : ach.judulKolaborasi;
      doc.text(title, 20, y + 7);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(180, 83, 9);
      doc.text(`Rating: ${ach.ratingScore} / 5.0`, pageWidth - 20, y + 7, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(`Tipe: ${ach.tipe} • Mitra: ${ach.perusahaan} • Selesai: ${ach.tanggalSelesai}`, 20, y + 13);

      // Outcome box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(241, 245, 249);
      doc.roundedRect(20, y + 17, pageWidth - 40, outcomeBoxHeight, 2, 2, "FD");

      doc.setTextColor(51, 65, 85);
      doc.text(outcomeLines, 23, y + 21);

      // Skills line
      const skillsStr = `Skills: ${ach.skillsAcquired.join(", ")}`;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      const truncatedSkills = doc.splitTextToSize(skillsStr, pageWidth - 40);
      doc.text(truncatedSkills[0], 20, y + 17 + outcomeBoxHeight + 6);

      // Card outer border
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(15, cardStartY, pageWidth - 30, cardHeight, 3, 3, "D");

      y += cardHeight + 6;
    });
  }

  // Footer Watermark on bottom
  const footerY = doc.internal.pageSize.getHeight() - 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Dokumen portofolio ini digenerate secara otomatis oleh platform BridgeU berbasis verifikasi resmi mitra perusahaan.",
    pageWidth / 2,
    footerY,
    { align: "center" }
  );

  // Directly trigger browser PDF file download
  const sanitizedNama = nama.replace(/[^a-zA-Z0-9]/g, "_");
  doc.save(`Portofolio_Kolaborasi_${sanitizedNama}.pdf`);
}
