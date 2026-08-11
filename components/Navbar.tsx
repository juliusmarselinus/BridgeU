"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchBar } from "./SearchBar";
import { supabase } from "@/lib/supabase";

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

type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const NOTIF_STORAGE_KEY = "bridgeu_notifications";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}



const defaultNotifications: AppNotification[] = [
  {
    id: "1",
    type: "success",
    title: "Pengajuan Diterima",
    message: "Pengajuan kolaborasi kamu ke PT Teknologi Nusantara telah diterima.",
    time: "10 menit lalu",
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "Peluang Baru",
    message: "Ada peluang kolaborasi baru dari CV Karya Digital yang cocok dengan profil kamu.",
    time: "2 jam lalu",
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "Reminder Deadline",
    message: "Deadline pengajuan ke Startup Inovasi Muda tinggal 2 hari lagi.",
    time: "1 hari lalu",
    read: true,
  },
];

const NOTIF_TYPES: NotificationType[] = ["success", "info", "warning"];

function sanitizeNotification(raw: unknown, fallbackId: string): AppNotification {
  const n = (raw ?? {}) as Partial<AppNotification>;
  return {
    id: typeof n.id === "string" && n.id ? n.id : fallbackId,
    type: NOTIF_TYPES.includes(n.type as NotificationType)
      ? (n.type as NotificationType)
      : "info",
    title: typeof n.title === "string" && n.title ? n.title : "Notifikasi",
    message: typeof n.message === "string" ? n.message : "",
    time: typeof n.time === "string" ? n.time : "",
    read: Boolean(n.read),
  };
}

function readStoredNotifications(): AppNotification[] {
  const stored = localStorage.getItem(NOTIF_STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(defaultNotifications));
    return defaultNotifications;
  }

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) throw new Error("invalid shape");

    const cleaned = parsed.map((item, i) => sanitizeNotification(item, `n-${i}`));
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(cleaned));
    return cleaned;
  } catch {
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(defaultNotifications));
    return defaultNotifications;
  }
}

function writeStoredNotifications(notifications: AppNotification[]) {
  localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notifications));
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
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}) {
  const unreadCount = notifications.filter((n) => !n.read).length;

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
          notifications.map((n, i) => (
            <button
              key={n.id}
              onClick={() => onMarkAsRead(n.id)}
              className={`flex w-full items-start gap-3 px-5 py-4 text-left transition ${
                i !== notifications.length - 1 ? "border-b border-border" : ""
              } ${n.read ? "hover:bg-surface" : "bg-primary/[0.05] hover:bg-primary/[0.08]"}`}
            >
              <NotifIcon type={n.type} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`truncate font-display text-[13px] font-semibold ${
                      n.read ? "text-steel" : "text-ink"
                    }`}
                  >
                    {n.title}
                  </span>
                  {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                </div>
                {n.message && (
                  <p
                    className={`mt-1 font-mono text-[11px] leading-relaxed ${
                      n.read ? "text-steel/50" : "text-steel"
                    }`}
                  >
                    {n.message}
                  </p>
                )}
                {n.time && (
                  <span className="mt-1.5 block font-mono text-[10px] text-steel/40">{n.time}</span>
                )}
              </div>
            </button>
          ))
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

function NotificationBell() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotifications(readStoredNotifications());

    const handleStorage = (e: StorageEvent) => {
      if (e.key === NOTIF_STORAGE_KEY) {
        setNotifications(readStoredNotifications());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAsRead(id: string) {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      writeStoredNotifications(updated);
      return updated;
    });
  }

  function markAllAsRead() {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      writeStoredNotifications(updated);
      return updated;
    });
  }

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
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
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
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/40 bg-white/80 px-6 py-3.5 shadow-[0_4px_24px_-6px_rgba(23,59,108,0.18)] backdrop-blur-xl">
        {/* Logo */}
        <Link href="/" className="font-display text-lg font-semibold tracking-tight text-ink">
          Bridge<span className="text-primary">U</span>
        </Link>

        {/* Center nav links with dot separators */}
        <div className="hidden items-center gap-5 font-mono text-[13px] text-steel md:flex">
          {navLinks.map((link, i) => {
            const active = pathname === link.href;
            return (
              <div key={link.href} className="flex items-center gap-5">
                <Link
                  href={link.href}
                  className={`transition ${
                    active ? "text-ink" : "text-steel hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
                {i < navLinks.length - 1 && (
                  <span className="text-border">&middot;</span>
                )}
              </div>
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