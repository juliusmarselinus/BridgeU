"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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
  const router = useRouter();
  const [admin, setAdmin] = useState<StoredAdmin | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("bridgeu_admin");
    localStorage.removeItem("bridgeu_user");
    localStorage.removeItem("bridgeu_user_id");
    await supabase.auth.signOut();
    router.push("/masuk");
  };

  return (
    <div className="fixed inset-x-0 top-4 z-40 px-4 sm:px-6">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between rounded-full border border-white/40 bg-white/80 px-6 py-3.5 shadow-[0_4px_24px_-6px_rgba(23,59,108,0.18)] backdrop-blur-xl">
        {/* Logo */}
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-ink"
        >
          <Image src="/logo.png" alt="BridgeU" width={24} height={24} className="h-6 w-6 object-contain" />
          Bridge<span className="text-primary">U</span>
          <span className="ml-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
            Admin
          </span>
        </Link>

        {/* Center Nav Items (Desktop) */}
        <div className="hidden items-center gap-1 font-mono text-[13px] md:flex">
          {adminNavLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition ${
                  active
                    ? "bg-ink text-paper font-medium shadow-sm"
                    : "text-steel hover:bg-steel/[0.08] hover:text-ink font-medium"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side Profile & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Desktop User Profile Dropdown */}
          <div className="relative hidden md:block" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="flex items-center gap-2 rounded-full bg-ink/5 py-1 pl-1.5 pr-3.5 border border-steel/15 hover:bg-ink/10 transition cursor-pointer"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 font-mono text-[11px] font-bold text-white shadow-sm">
                AD
              </div>
              <span className="font-mono text-xs font-semibold text-ink">
                {admin ? admin.nama : "Admin BridgeU"}
              </span>
              <svg className={`w-3.5 h-3.5 text-steel transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-2xl border border-border/60 bg-white p-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-border/40 mb-1">
                  <p className="font-display text-xs font-bold text-ink truncate">{admin?.nama || "Admin BridgeU"}</p>
                  <p className="font-mono text-[10px] text-steel truncate">{admin?.email || "admin@bridgeu.id"}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 font-mono text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Keluar (Logout)
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen((p) => !p)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/5 text-ink md:hidden"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mt-2 mx-auto max-w-[1400px] overflow-hidden rounded-3xl border border-white/40 bg-white/95 p-5 shadow-2xl backdrop-blur-xl md:hidden animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3 pb-4 border-b border-border/40 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 font-mono text-xs font-bold text-white shadow-sm">
              AD
            </div>
            <div>
              <p className="font-display text-sm font-bold text-ink">{admin?.nama || "Admin BridgeU"}</p>
              <p className="font-mono text-xs text-steel">{admin?.email || "admin@bridgeu.id"}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1 font-mono text-xs">
            {adminNavLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 transition ${
                    active
                      ? "bg-ink text-paper font-semibold"
                      : "text-steel hover:bg-steel/[0.06] hover:text-ink"
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-border/40">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 py-3 font-mono text-xs font-bold text-rose-600 hover:bg-rose-100 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Keluar (Logout)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

