"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const adminNavLinks = [
  { href: "/admin/dashboard", label: "Dashboard Admin" },
  { href: "/admin/kolaborasi", label: "Moderasi Kolaborasi" },
  { href: "/admin/perusahaan", label: "Verifikasi Perusahaan" },
  { href: "/admin/pengguna", label: "Manajemen Pengguna" },
];

type StoredAdmin = {
  nama: string;
  email: string;
};

export function AdminNavbar() {
  const pathname = usePathname();
  const [admin, setAdmin] = useState<StoredAdmin | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("bridgeu_admin");
    if (stored) {
      const parsed = JSON.parse(stored);
      queueMicrotask(() => setAdmin(parsed));
    } else {
      queueMicrotask(() =>
        setAdmin({
          nama: "Administrator BridgeU",
          email: "admin@bridgeu.id",
        })
      );
    }
  }, []);

  return (
    <div className="sticky top-4 z-40 px-4 sm:px-6">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-emerald-500/30 bg-ink px-5 py-3 shadow-[0_8px_24px_-6px_rgba(27,39,64,0.45)]">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-paper"
        >
          <span>Bridge<span className="text-bridge-gold">U</span></span>
          <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-emerald-400 uppercase border border-emerald-500/30">
            Control Center
          </span>
        </Link>

        <div className="hidden gap-1 font-mono text-xs md:flex">
          {adminNavLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-4 py-2 transition ${
                  active
                    ? "bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30"
                    : "text-paper/60 hover:bg-white/5 hover:text-paper"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-2 pr-3.5 border border-white/10">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 font-mono text-[10px] font-bold text-ink">
              AD
            </div>
            <span className="hidden font-mono text-xs text-paper sm:inline font-medium">
              {admin ? admin.nama : "Admin BridgeU"}
            </span>
          </div>
        </div>
      </nav>
    </div>
  );
}
