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
