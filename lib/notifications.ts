import { supabase } from "@/lib/supabase";

export type CreateNotificationParams = {
  recipientUserId: string;
  judul: string;
  pesan: string;
};

/**
 * Creates a notification in the Supabase `notifikasi` table
 * adhering to dbs.sql schema:
 * - recipient_user_id (uuid)
 * - judul (varchar)
 * - pesan (text)
 * - is_read (boolean, default false)
 * - created_at (timestamp)
 */
export async function createDatabaseNotification({
  recipientUserId,
  judul,
  pesan,
}: CreateNotificationParams) {
  if (!recipientUserId || !judul) return null;

  try {
    const { data, error } = await supabase
      .from("notifikasi")
      .insert({
        recipient_user_id: recipientUserId,
        judul,
        pesan,
        is_read: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("❌ [createDatabaseNotification] Supabase Error:", error.message);
      return null;
    }

    return data;
  } catch (err: any) {
    console.error("❌ [createDatabaseNotification] Unexpected error:", err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Typed helper functions — satu tempat untuk semua event notifikasi mahasiswa
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Notifikasi: Pengajuan kolaborasi berhasil dikirim
 */
export async function notifyPengajuanBerhasil(
  userId: string,
  judulKolaborasi: string,
  namaPerusahaan: string
) {
  return createDatabaseNotification({
    recipientUserId: userId,
    judul: "Pengajuan Kolaborasi Berhasil",
    pesan: `Pengajuan kamu untuk proyek '${judulKolaborasi}' di ${namaPerusahaan} telah berhasil dikirim. Tunggu konfirmasi dari perusahaan.`,
  });
}

/**
 * Notifikasi: Pengajuan kolaborasi diterima oleh perusahaan
 */
export async function notifyPengajuanDiterima(
  userId: string,
  judulKolaborasi: string,
  namaPerusahaan: string
) {
  return createDatabaseNotification({
    recipientUserId: userId,
    judul: "Pengajuan Diterima",
    pesan: `Selamat! Pengajuan kamu untuk proyek '${judulKolaborasi}' di ${namaPerusahaan} telah diterima. Cek halaman Status untuk detail selanjutnya.`,
  });
}

/**
 * Notifikasi: Pengajuan kolaborasi ditolak oleh perusahaan
 */
export async function notifyPengajuanDitolak(
  userId: string,
  judulKolaborasi: string,
  namaPerusahaan: string,
  catatan?: string
) {
  const pesanCatatan = catatan
    ? ` Catatan dari perusahaan: "${catatan}"`
    : "";
  return createDatabaseNotification({
    recipientUserId: userId,
    judul: "Pengajuan Tidak Lolos",
    pesan: `Pengajuan kamu untuk proyek '${judulKolaborasi}' di ${namaPerusahaan} tidak berhasil lolos seleksi.${pesanCatatan} Jangan menyerah, cari peluang lain di halaman Kolaborasi.`,
  });
}

/**
 * Notifikasi: Badge baru berhasil dibuka / di-unlock
 */
export async function notifyBadgeUnlocked(
  userId: string,
  namaBadge: string,
  xpBonus: number
) {
  return createDatabaseNotification({
    recipientUserId: userId,
    judul: "Badge Terbuka!",
    pesan: `Kamu berhasil membuka badge '${namaBadge}' dan mendapatkan +${xpBonus} XP. Terus tingkatkan kontribusimu!`,
  });
}

/**
 * Notifikasi: Mahasiswa naik level
 */
export async function notifyLevelUp(
  userId: string,
  newLevel: number,
  tierTitle: string
) {
  return createDatabaseNotification({
    recipientUserId: userId,
    judul: `Selamat, Kamu Naik ke Level ${newLevel}!`,
    pesan: `Luar biasa! Kamu telah mencapai Level ${newLevel} (${tierTitle}). Terus aktif berkolaborasi untuk naik ke level berikutnya.`,
  });
}
