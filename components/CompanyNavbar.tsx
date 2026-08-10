"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

const companyNavLinks = [
  { href: "/perusahaan/dashboard", label: "Dashboard Perusahaan" },
  { href: "/perusahaan/kolaborasi", label: "Kelola Kolaborasi" },
  { href: "/perusahaan/pelamar", label: "Kelola Pelamar" },
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
          .select("nama_perusahaan, logo_url")
          .eq("user_id", user.id)
          .single();

        if (!error && data && isMounted) {
          setCompany({
            nama_perusahaan: data.nama_perusahaan,
            logo_url: data.logo_url,
          });
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
    <div className="sticky top-4 z-40 px-4 sm:px-6">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-bridge-gold/30 bg-ink px-5 py-3 shadow-[0_8px_24px_-6px_rgba(27,39,64,0.45)]">
        {/* Brand Logo -> Ke Dashboard Perusahaan */}
        <Link
          href="/perusahaan/dashboard"
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-paper hover:opacity-90 transition"
        >
          <span>
            Bridge<span className="text-bridge-gold">U</span>
          </span>
          <span className="rounded-full bg-bridge-gold/20 px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-wide text-bridge-gold uppercase border border-bridge-gold/30">
            Mitra Perusahaan
          </span>
        </Link>

        {/* Navigation Links (Termasuk Kelola Kolaborasi) */}
        <div className="hidden gap-1 font-mono text-xs md:flex">
          {companyNavLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-4 py-2 transition ${
                  active
                    ? "bg-bridge-gold/20 text-bridge-gold font-medium border border-bridge-gold/30"
                    : "text-paper/60 hover:bg-white/5 hover:text-paper"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Profile Chip -> Ke Halaman Profile */}
        <div className="flex items-center gap-2">
          <Link
            href="/perusahaan/profile"
            className={`flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-3.5 border transition ${
              isProfileActive
                ? "bg-bridge-gold/20 border-bridge-gold/50 text-bridge-gold"
                : "bg-white/10 border-white/10 text-paper hover:bg-white/20"
            }`}
          >
            <div className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-bridge-gold font-mono text-[11px] font-bold text-ink">
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
        </div>
      </nav>
    </div>
  );
}