// lib/hooks/useRealtimeNotifications.ts
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface NotifikasiItem {
  id: number;
  recipient_user_id: string;
  judul: string;
  pesan: string;
  is_read: boolean;
  created_at: string;
}

export function useRealtimeNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<NotifikasiItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    if (!userId) return;

    // 1. Fetch notifikasi awal dari database
    async function fetchInitialNotifications() {
      const { data, error } = await supabase
        .from("notifikasi")
        .select("*")
        .eq("recipient_user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error && data) {
        setNotifications(data as NotifikasiItem[]);
        setUnreadCount(data.filter((n) => !n.is_read).length);
      }
    }

    fetchInitialNotifications();

    // 2. Subscribe ke perubahan realtime — INSERT saja (notif baru)
    const channel = supabase
      .channel(`user-notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifikasi",
          filter: `recipient_user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotif = payload.new as NotifikasiItem;
          // Tambahkan notifikasi baru ke paling atas list
          setNotifications((prev) => [newNotif, ...prev.slice(0, 19)]);
          setUnreadCount((prev) => prev + 1);
          console.log("🔔 [Realtime] Notifikasi Baru:", newNotif.judul);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifikasi",
          filter: `recipient_user_id=eq.${userId}`,
        },
        (payload) => {
          const updated = payload.new as NotifikasiItem;
          setNotifications((prev) =>
            prev.map((n) => (n.id === updated.id ? updated : n))
          );
          // Sinkronkan ulang unreadCount dari state terkini
          setUnreadCount((prev) => {
            const wasUnread = payload.old && !(payload.old as NotifikasiItem).is_read;
            const nowRead = updated.is_read;
            if (wasUnread && nowRead) return Math.max(0, prev - 1);
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  /**
   * Tandai satu notifikasi sebagai dibaca, atau tandai semua jika `notifId` tidak diberikan.
   */
  const markAsRead = async (notifId?: number) => {
    if (notifId !== undefined) {
      await supabase
        .from("notifikasi")
        .update({ is_read: true })
        .eq("id", notifId);

      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } else {
      // Tandai semua sebagai dibaca
      if (!userId) return;
      await supabase
        .from("notifikasi")
        .update({ is_read: true })
        .eq("recipient_user_id", userId)
        .eq("is_read", false);

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    }
  };

  return { notifications, unreadCount, markAsRead };
}
