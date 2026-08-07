"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/kolaborasi", label: "Peluang Kolaborasi" },
  { href: "/status", label: "Status Pengajuan" },
  { href: "/portfolio", label: "Portfolio" },
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

function readStoredUser(): StoredUser | null {
  const stored = localStorage.getItem("bridgeu_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

// dummy notif — nanti tinggal diganti fetch dari Supabase
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

// bikin satu notif "bersih" dari data apapun (termasuk data lama/rusak) biar gak pernah undefined
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
    bg: "bg-verified/15",
    fg: "text-verified",
    path: <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />,
  },
  info: {
    bg: "bg-bridge-gold/15",
    fg: "text-bridge-gold",
    path: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8h.01M11 12h1v4h1" strokeLinecap="round" />
      </>
    ),
  },
  warning: {
    bg: "bg-orange-500/15",
    fg: "text-orange-400",
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
    <div className="absolute right-0 top-13 w-96 overflow-hidden rounded-3xl border border-bridge-gold/20 bg-ink shadow-[0_20px_50px_-12px_rgba(0,0,0,0.55)]">
      {/* header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-semibold text-paper">Notifikasi</span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-bridge-gold/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-bridge-gold">
              {unreadCount} baru
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="font-mono text-[11px] text-steel transition hover:text-bridge-gold"
          >
            Tandai semua dibaca
          </button>
        )}
      </div>

      {/* list */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-paper/30">
              <BellIcon />
            </div>
            <p className="font-mono text-xs text-paper/40">Belum ada notifikasi</p>
          </div>
        ) : (
          notifications.map((n, i) => (
            <button
              key={n.id}
              onClick={() => onMarkAsRead(n.id)}
              className={`flex w-full items-start gap-3 px-5 py-4 text-left transition ${
                i !== notifications.length - 1 ? "border-b border-white/5" : ""
              } ${n.read ? "hover:bg-white/[0.04]" : "bg-bridge-gold/[0.06] hover:bg-bridge-gold/[0.1]"}`}
            >
              <NotifIcon type={n.type} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`truncate font-display text-[13px] font-semibold ${
                      n.read ? "text-paper/70" : "text-paper"
                    }`}
                  >
                    {n.title}
                  </span>
                  {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-bridge-gold" />}
                </div>
                {n.message && (
                  <p
                    className={`mt-1 font-mono text-[11px] leading-relaxed ${
                      n.read ? "text-paper/40" : "text-paper/65"
                    }`}
                  >
                    {n.message}
                  </p>
                )}
                {n.time && (
                  <span className="mt-1.5 block font-mono text-[10px] text-paper/35">{n.time}</span>
                )}
              </div>
            </button>
          ))
        )}
      </div>

      {/* footer */}
      {notifications.length > 0 && (
        <div className="border-t border-white/10 bg-white/[0.03] px-5 py-2.5 text-center">
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
          open ? "bg-white/15 text-paper" : "text-paper/60 hover:bg-white/10 hover:text-paper"
        }`}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full border-2 border-ink bg-bridge-gold px-1 font-mono text-[10px] font-bold leading-none text-ink">
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

  useEffect(() => {
    const parsed = readStoredUser();
    if (parsed) {
      queueMicrotask(() => setUser(parsed));
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "bridgeu_user") {
        setUser(readStoredUser());
      }
    };

    const handleLocalUpdate = () => {
      setUser(readStoredUser());
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("bridgeu_user_updated", handleLocalUpdate);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("bridgeu_user_updated", handleLocalUpdate);
    };
  }, []);

  return (
    <div className="sticky top-4 z-40 px-4 sm:px-6">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-bridge-gold/20 bg-ink px-5 py-3 shadow-[0_8px_24px_-6px_rgba(27,39,64,0.35)]">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight text-paper">
          Bridge<span className="text-bridge-gold">U</span>
        </Link>

        <div className="hidden gap-1 font-mono text-xs sm:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-4 py-2 transition ${
                  active
                    ? "bg-white/10 text-paper"
                    : "text-paper/50 hover:bg-white/5 hover:text-paper/80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell />

          <Link
            href="/profile"
            className="flex items-center gap-2.5 rounded-full bg-white/10 py-1.5 pl-1.5 pr-3.5 transition hover:bg-white/20"
          >
            <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-bridge-gold font-mono text-[11px] font-medium text-ink">
              {user?.foto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.foto} alt="Foto profil" className="h-full w-full object-cover" />
              ) : user ? (
                initials(user.nama)
              ) : (
                "?"
              )}
            </div>
            <span className="hidden font-mono text-xs text-paper sm:inline">
              {user ? user.nama.split(" ")[0] : "Tamu"}
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}