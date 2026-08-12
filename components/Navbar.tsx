"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SearchBar } from "./SearchBar";
import { supabase } from "@/lib/supabase";
import { useRealtimeNotifications } from "@/lib/hooks/useRealtimeNotifications";
import type { NotifikasiItem } from "@/lib/hooks/useRealtimeNotifications";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/kolaborasi", label: "Peluang Kolaborasi" },
  { href: "/status", label: "Status Pengajuan" },
];

type StoredUser = {
  nama: string;
  universitas: string;
  prodi: string;
  foto?: string;
};

type NotificationType = "success" | "info" | "warning";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

type NotifIconConfig = {
  bg: string;
  fg: string;
  path: ReactNode;
};

const NOTIF_ICON_CONFIG: { [key in NotificationType]: NotifIconConfig } = {
  success: {
    bg: "bg-emerald-500/10",
    fg: "text-emerald-600",
    path: <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />,
  },
  info: {
    bg: "bg-primary/10",
    fg: "text-primary",
    path: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8h.01M11 12h1v4h1" strokeLinecap="round" />
      </>
    ),
  },
  warning: {
    bg: "bg-orange-500/10",
    fg: "text-orange-500",
    path: (
      <>
        <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L14.71 3.86a2 2 0 0 0-3.42 0Z" />
      </>
    ),
  },
};

function NotifIcon({ type }: { type: NotificationType }) {
  const cfg = NOTIF_ICON_CONFIG[type] ?? NOTIF_ICON_CONFIG.info;
  return (
    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${cfg.bg} ${cfg.fg}`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {cfg.path}
      </svg>
    </div>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function NotificationPanel({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}: {
  notifications: NotifikasiItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}) {
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="absolute right-0 top-13 w-96 overflow-hidden rounded-3xl border border-border bg-card shadow-[0_20px_50px_-12px_rgba(23,59,108,0.25)]">
      {/* header */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-semibold text-ink">Notifikasi</span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
              {unreadCount} baru
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="font-mono text-[11px] text-steel transition hover:text-primary"
          >
            Tandai semua dibaca
          </button>
        )}
      </div>

      {/* list */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-steel/50">
              <BellIcon />
            </div>
            <p className="font-mono text-xs text-steel/60">Belum ada notifikasi</p>
          </div>
        ) : (
          notifications.map((n, i) => {
            const type = deriveNotifType(n.judul);
            const isRead = n.is_read;
            return (
              <button
                key={n.id}
                onClick={() => onMarkAsRead(String(n.id))}
                className={`flex w-full items-start gap-3 px-5 py-4 text-left transition ${
                  i !== notifications.length - 1 ? "border-b border-border" : ""
                } ${isRead ? "hover:bg-surface" : "bg-primary/[0.05] hover:bg-primary/[0.08]"}`}
              >
                <NotifIcon type={type} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`truncate font-display text-[13px] font-semibold ${
                        isRead ? "text-steel" : "text-ink"
                      }`}
                    >
                      {n.judul}
                    </span>
                    {!isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </div>
                  {n.pesan && (
                    <p
                      className={`mt-1 font-mono text-[11px] leading-relaxed ${
                        isRead ? "text-steel/50" : "text-steel"
                      }`}
                    >
                      {n.pesan}
                    </p>
                  )}
                  <span className="mt-1.5 block font-mono text-[10px] text-steel/40">
                    {formatNotifTime(n.created_at)}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* footer */}
      {notifications.length > 0 && (
        <div className="border-t border-border bg-surface px-5 py-2.5 text-center">
          <span className="font-mono text-[11px] text-steel">
            Menampilkan {notifications.length} notifikasi terakhir
          </span>
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Notification type derivation — single source of truth for icon+color
// ───────────────────────────────────────────────────────────────────────────
function deriveNotifType(judul: string): NotificationType {
  const j = judul.toLowerCase();
  if (
    j.includes("diterima") ||
    j.includes("berhasil") ||
    j.includes("badge") ||
    j.includes("level") ||
    j.includes("selamat")
  )
    return "success";
  if (j.includes("ditolak") || j.includes("tidak lolos") || j.includes("gagal"))
    return "warning";
  return "info";
}

function formatNotifTime(createdAt: string): string {
  if (!createdAt) return "Baru";
  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} mnt lalu`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} jam lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

// ───────────────────────────────────────────────────────────────────────────
// NotificationBell — powered by realtime Supabase subscription
// ───────────────────────────────────────────────────────────────────────────
function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const ref = useRef<HTMLDivElement>(null);

  // Resolve userId dari sesi Supabase satu kali
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? undefined);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const { notifications, unreadCount, markAsRead } = useRealtimeNotifications(userId);

  // Tutup panel saat klik di luar
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = (id: string) => {
    markAsRead(parseInt(id, 10));
  };

  const handleMarkAllAsRead = () => {
    markAsRead();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        aria-label="Notifikasi"
        onClick={() => setOpen((p) => !p)}
        className={`relative flex h-9 w-9 items-center justify-center rounded-full transition ${
          open ? "bg-primary/10 text-primary" : "text-steel hover:bg-surface hover:text-ink"
        }`}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full border-2 border-card bg-primary px-1 font-mono text-[10px] font-bold leading-none text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationPanel
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      )}
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<StoredUser | null>(null);

  const loadUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setUser(null);
      return;
    }

    const currentUserId = localStorage.getItem("bridgeu_user_id");
    if (currentUserId && currentUserId !== session.user.id) {
      localStorage.removeItem("bridgeu_user");
      localStorage.removeItem("bridgeu_pengajuan");
    }
    localStorage.setItem("bridgeu_user_id", session.user.id);

    const res = await fetch("/api/me", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (!res.ok) {
      setUser(null);
      return;
    }

    const data = await res.json();
    setUser({
      nama: data.nama || "Mahasiswa",
      universitas: data.universitas || "",
      prodi: data.prodi || "",
      foto: data.fotoUrl,
    });
  };

  useEffect(() => {
    loadUser();

    // dipanggil manual dari halaman lain (mis. setelah edit profil) via window.dispatchEvent
    const handleLocalUpdate = () => {
      loadUser();
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    window.addEventListener("bridgeu_user_updated", handleLocalUpdate);

    return () => {
      window.removeEventListener("bridgeu_user_updated", handleLocalUpdate);
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-4 z-40 px-4 sm:px-6">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between rounded-full border border-white/40 bg-white/80 px-6 py-3.5 shadow-[0_4px_24px_-6px_rgba(23,59,108,0.18)] backdrop-blur-xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-ink">
          <Image src="/logo.png" alt="BridgeU" width={24} height={24} className="h-6 w-6 object-contain" />
          Bridge<span className="text-primary">U</span>
        </Link>

        {/* Center nav links — active page gets a filled pill, not just color change */}
        <div className="hidden items-center gap-1 font-mono text-[13px] md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition ${
                  active
                    ? "bg-ink text-paper"
                    : "text-steel hover:bg-steel/[0.06] hover:text-ink"
                }`}
              >
                {active && <span className="h-1.5 w-1.5 rounded-full bg-bridge-gold" />}
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <SearchBar />

          <NotificationBell />

          <Link
            href="/profile"
            className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary transition hover:bg-primary/20"
            aria-label="Profil"
          >
            {user?.foto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.foto} alt="Foto profil" className="h-full w-full object-cover" />
            ) : user ? (
              <span className="font-mono text-[11px] font-medium text-primary">
                {initials(user.nama)}
              </span>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            )}
          </Link>
        </div>
      </nav>
    </div>
  );
}