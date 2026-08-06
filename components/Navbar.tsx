"use client";

import { useEffect, useState } from "react";
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
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("bridgeu_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      queueMicrotask(() => setUser(parsed));
    }
  }, []);

  return (
    <div className="sticky top-4 z-40 px-4 sm:px-6">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-bridge-gold/20 bg-ink px-5 py-3 shadow-[0_8px_24px_-6px_rgba(27,39,64,0.35)]">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-paper"
        >
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
          {/* notifikasi */}
          <button
            aria-label="Notifikasi"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-paper/60 transition hover:bg-white/10 hover:text-paper"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-bridge-gold" />
          </button>

          {/* avatar inisial */}
          <div className="flex items-center gap-2.5 rounded-full bg-white/10 py-1.5 pl-1.5 pr-3.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-bridge-gold font-mono text-[11px] font-medium text-ink">
              {user ? initials(user.nama) : "?"}
            </div>
            <span className="hidden font-mono text-xs text-paper sm:inline">
              {user ? user.nama.split(" ")[0] : "Tamu"}
            </span>
          </div>
        </div>
      </nav>
    </div>
  );
}