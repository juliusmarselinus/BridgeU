"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const companyNavLinks = [
  { href: "/perusahaan/dashboard", label: "Dashboard Perusahaan" },
  { href: "/perusahaan/buat-kolaborasi", label: "+ Buka Peluang" },
  { href: "/perusahaan/pelamar", label: "Kelola Pelamar" },
];

type StoredCompany = {
  nama: string;
  industri: string;
  email: string;
};

function companyInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function CompanyNavbar() {
  const pathname = usePathname();
  const [company, setCompany] = useState<StoredCompany | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("bridgeu_company");
    if (stored) {
      const parsed = JSON.parse(stored);
      queueMicrotask(() => setCompany(parsed));
    } else {
      queueMicrotask(() =>
        setCompany({
          nama: "Nexora Digital",
          industri: "Teknologi & Produk Digital",
          email: "perusahaan@nexora.com",
        })
      );
    }
  }, []);

  return (
    <div className="sticky top-4 z-40 px-4 sm:px-6">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-bridge-gold/30 bg-ink px-5 py-3 shadow-[0_8px_24px_-6px_rgba(27,39,64,0.45)]">
        <Link
          href="/perusahaan/dashboard"
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-paper"
        >
          <span>Bridge<span className="text-bridge-gold">U</span></span>
          <span className="rounded-full bg-bridge-gold/20 px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-wide text-bridge-gold uppercase">
            Mitra Perusahaan
          </span>
        </Link>

        <div className="hidden gap-1 font-mono text-xs sm:flex">
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

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2.5 rounded-full bg-white/10 py-1.5 pl-1.5 pr-3.5 border border-white/10">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-bridge-gold font-mono text-[11px] font-bold text-ink">
              {company ? companyInitials(company.nama) : "ND"}
            </div>
            <span className="hidden font-mono text-xs text-paper sm:inline font-medium">
              {company ? company.nama : "Nexora Digital"}
            </span>
          </div>
        </div>
      </nav>
    </div>
  );
}
