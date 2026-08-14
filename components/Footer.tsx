"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

function IconGithub({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function IconLinkedin({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function IconTwitter({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function IconMail({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="w-full border-t border-bridge-gold/20 bg-ink text-paper transition-colors duration-300">
      {/* Upper Main Footer Grid */}
      <div className="mx-auto max-w-6xl px-6 pt-12 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Brand, Short Description & Social Media */}
          <div className="space-y-4 max-w-md">
            <Link href="/" className="inline-flex items-center gap-2 font-display text-2xl font-black tracking-tight text-paper">
              <Image src="/logo.png" alt="BridgeU" width={32} height={32} className="h-8 w-8 object-contain" />
              Bridge<span className="text-bridge-gold">U</span>
            </Link>
            <p className="text-xs font-medium leading-relaxed text-paper/70">
              Platform ekosistem penghubung mahasiswa dan perusahaan mitra untuk mempercepat kolaborasi akademik, riset industri, magang, dan ekspansi portofolio profesional.
            </p>
            {/* Social Media Links Aligned Under Description */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="rounded-lg border border-white/10 bg-white/5 p-2 text-paper/70 hover:border-bridge-gold/40 hover:bg-white/10 hover:text-bridge-gold transition"
              >
                <IconGithub />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="rounded-lg border border-white/10 bg-white/5 p-2 text-paper/70 hover:border-bridge-gold/40 hover:bg-white/10 hover:text-bridge-gold transition"
              >
                <IconLinkedin />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="rounded-lg border border-white/10 bg-white/5 p-2 text-paper/70 hover:border-bridge-gold/40 hover:bg-white/10 hover:text-bridge-gold transition"
              >
                <IconTwitter />
              </a>
              <a
                href="mailto:contact@bridgeu.id"
                aria-label="Email Contact"
                className="rounded-lg border border-white/10 bg-white/5 p-2 text-paper/70 hover:border-bridge-gold/40 hover:bg-white/10 hover:text-bridge-gold transition"
              >
                <IconMail />
              </a>
            </div>
          </div>

          {/* Column: Navigasi Utama (List dari Navbar) */}
          <div className="space-y-3 sm:pl-8">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-bridge-gold">
              Navigasi Utama
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-paper/70">
              <li>
                <Link href="/" className="transition hover:text-paper hover:underline underline-offset-4">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="transition hover:text-paper hover:underline underline-offset-4">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/kolaborasi" className="transition hover:text-paper hover:underline underline-offset-4">
                  Peluang Kolaborasi
                </Link>
              </li>
              <li>
                <Link href="/status" className="transition hover:text-paper hover:underline underline-offset-4">
                  Status Pengajuan
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright */}
      <div className="border-t border-white/10 bg-black/20 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-center sm:text-left">
          <p className="w-full font-mono text-[11px] text-paper/60">
            &copy; {new Date().getFullYear()} <span className="text-paper font-bold">BridgeU</span>. Bridging Technology &amp; Students&apos; Needs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
