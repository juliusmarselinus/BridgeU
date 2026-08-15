"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

const companyNavLinks = [
  { href: "/perusahaan/dashboard", label: "Dashboard Perusahaan" },
  { href: "/perusahaan/kolaborasi", label: "Kelola Kolaborasi" },
];

type CompanyProfileNav = {
  nama_perusahaan: string;
  logo_url?: string | null;
};

function companyInitials(name: string) {
  if (!name) return "CP";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function CompanyNavbar() {
  const pathname = usePathname();
  const [company, setCompany] = useState<CompanyProfileNav | null>(null);
  const [statusVerifikasi, setStatusVerifikasi] = useState<string>("Menunggu Verifikasi");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadCompanyProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
          .from("perusahaan_profiles")
          .select("nama_perusahaan, logo_url, status_verifikasi")
          .eq("user_id", user.id)
          .single();

        if (!error && data && isMounted) {
          setCompany({
            nama_perusahaan: data.nama_perusahaan,
            logo_url: data.logo_url,
          });
          setStatusVerifikasi(data.status_verifikasi);
        }
      } catch (err) {
        console.error("Gagal mengambil profil navbar dari Supabase:", err);
      }
    }

    loadCompanyProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const companyName = company?.nama_perusahaan || "Nexora Digital";
  const isProfileActive = pathname === "/perusahaan/profile";

  return (
    <div className="fixed inset-x-0 top-4 z-40 px-4 sm:px-6">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/15 bg-[#12284B]/75 backdrop-blur-2xl backdrop-saturate-150 px-5 py-3 shadow-[0_8px_32px_-6px_rgba(18,40,75,0.45),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
        {/* Brand Logo -> Ke Dashboard Perusahaan */}
        <Link
          href="/perusahaan/dashboard"
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-paper hover:opacity-90 transition"
        >
          <span>
            Bridge<span className="text-[#97B8D8]">U</span>
          </span>
          <span className="hidden sm:inline-block rounded-full bg-[#97B8D8]/20 px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-wide text-[#C3DAEC] uppercase border border-[#97B8D8]/30">
            Mitra Perusahaan
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden gap-1 font-mono text-xs md:flex items-center">
          {companyNavLinks.map((link) => {
            const isColab = link.href === "/perusahaan/kolaborasi";
            const isLocked = isColab && statusVerifikasi !== "Terverifikasi";
            const active = pathname === link.href;

            if (isLocked) {
              return (
                <div
                  key={link.href}
                  title="Fitur terkunci. Harap tunggu verifikasi akun perusahaan oleh administrator."
                  className="relative rounded-full px-4 py-2 font-mono text-xs text-paper/30 cursor-not-allowed border border-dashed border-white/10 select-none bg-white/5 flex items-center gap-1.5"
                >
                  <svg className="h-3 w-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  {link.label}
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-4 py-2 transition ${
                  active
                    ? "bg-[#97B8D8]/20 text-[#C3DAEC] font-medium border border-[#97B8D8]/30"
                    : "text-paper/60 hover:bg-white/5 hover:text-paper"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Section: Profile Chip + Mobile Hamburger Button */}
        <div className="flex items-center gap-2">
          {/* Profile Chip -> Ke Halaman Profile */}
          <Link
            href="/perusahaan/profile"
            className={`flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-3.5 border transition ${
              isProfileActive
                ? "bg-[#97B8D8]/20 border-[#97B8D8]/40 text-[#C3DAEC]"
                : "bg-white/10 border-white/10 text-paper hover:bg-white/20"
            }`}
          >
            <div className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#97B8D8] font-mono text-[11px] font-bold text-[#12284B]">
              {company?.logo_url ? (
                <Image
                  src={company.logo_url}
                  alt={companyName}
                  fill
                  className="object-cover"
                />
              ) : (
                companyInitials(companyName)
              )}
            </div>
            <span className="hidden font-mono text-xs sm:inline font-medium max-w-[140px] truncate">
              {companyName}
            </span>
          </Link>

          {/* Hamburger Button (hanya muncul di Mobile / md:hidden) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden items-center justify-center p-2 rounded-full text-paper/80 hover:text-paper hover:bg-white/10 transition"
            aria-label="Toggle Mobile Navigation"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-6xl rounded-2xl border border-white/15 bg-[#12284B]/95 backdrop-blur-2xl p-4 shadow-xl space-y-2 text-paper animate-in fade-in duration-200">
          {companyNavLinks.map((link) => {
            const isColab = link.href === "/perusahaan/kolaborasi";
            const isLocked = isColab && statusVerifikasi !== "Terverifikasi";
            const active = pathname === link.href;

            if (isLocked) {
              return (
                <div
                  key={link.href}
                  className="rounded-xl px-4 py-3 font-mono text-xs text-paper/30 bg-white/5 border border-dashed border-white/10 flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <span className="flex items-center gap-1 text-[10px] text-red-400">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Terkunci
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-xl px-4 py-3 font-mono text-xs transition ${
                  active
                    ? "bg-[#97B8D8]/20 text-[#C3DAEC] font-bold border border-[#97B8D8]/30"
                    : "hover:bg-white/10 text-paper/80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/perusahaan/profile"
            onClick={() => setMobileMenuOpen(false)}
            className={`block rounded-xl px-4 py-3 font-mono text-xs transition ${
              isProfileActive
                ? "bg-[#97B8D8]/20 text-[#C3DAEC] font-bold border border-[#97B8D8]/30"
                : "hover:bg-white/10 text-paper/80"
            }`}
          >
            Profil Perusahaan ({companyName})
          </Link>
        </div>
      )}
    </div>
  );
}