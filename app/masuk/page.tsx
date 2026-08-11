"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { GradientWave } from "@/components/ui/gradient-wave";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

const navItems = [
  { name: "Fitur", link: "/#fitur" },
  { name: "Cara Kerja", link: "/#cara-kerja" },
];

const SWITCH_TRANSITION = { duration: 0.65, ease: [0.65, 0, 0.35, 1] as [number, number, number, number] };

function IconAcademic({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function IconBuilding({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
    </svg>
  );
}

export default function MasukPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // false = slot form ada di kiri (Sign In), slot overlay warna di kanan
  // true  = slot form ada di kanan (Sign Up teaser), slot overlay warna di kiri
  const [isSignUp, setIsSignUp] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const redirectByRole = (userRole: string) => {
    if (userRole === "admin") router.push("/admin/dashboard");
    else if (userRole === "perusahaan") router.push("/perusahaan/dashboard");
    else router.push("/dashboard");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw new Error("Email atau kata sandi salah / belum terdaftar.");
      if (!authData.user) throw new Error("Gagal mendapatkan data akun.");

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      if (userError || !userData) {
        router.push("/dashboard");
        return;
      }
      redirectByRole(userData.role);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal masuk. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#DCE9F5] text-[#17356F] flex flex-col justify-between relative overflow-hidden">
      <GradientWave
        colors={["#DCE9F5", "#A9CBEA", "#4F91D5", "#2475C5", "#6FA7D9", "#D6E4EF"]}
        className="opacity-95"
        shadowPower={3}
        noiseSpeed={0.000008}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#EAF0F3]/20 via-transparent to-[#C7D9E8]/25" />

      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton as="button" variant="secondary" className="pointer-events-none opacity-60">
              Masuk
            </NavbarButton>
            <NavbarButton as={Link} href="/daftar" variant="primary">
              Daftar
            </NavbarButton>
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle isOpen={mobileMenuOpen} onClick={() => setMobileMenuOpen((p) => !p)} />
          </MobileNavHeader>
          <MobileNavMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
            {navItems.map((item) => (
              <a key={item.name} href={item.link} onClick={() => setMobileMenuOpen(false)} className="relative text-text-secondary">
                {item.name}
              </a>
            ))}
            <div className="flex w-full flex-col gap-3">
              <NavbarButton as={Link} href="/daftar" variant="primary" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                Daftar
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* ═══════ MAIN ═══════ */}
      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-6 pt-32 pb-16 flex flex-col justify-center">
        <div className="text-center mb-6 md:hidden">
          <span className="inline-flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-[#17356F]">
            <Image src="/logo.png" alt="BridgeU" width={26} height={26} className="h-6 w-6 object-contain" />
            Bridge<span className="text-primary">U</span>
          </span>
        </div>

        {/* ---- DESKTOP: neumorphic switch card, big, no dead space ---- */}
        <div
          className="hidden md:block relative w-full h-[620px] rounded-[40px] overflow-hidden"
          style={{
            background: "#EAF2FB",
            boxShadow: "20px 20px 46px rgba(23,59,108,0.16), -20px -20px 46px rgba(255,255,255,0.85)",
          }}
        >
          {/* ---- FORM SLOT: satu slot yang isinya swap + ikut geser ---- */}
          <motion.div
            animate={{ x: isSignUp ? "100%" : "0%" }}
            transition={SWITCH_TRANSITION}
            className="absolute inset-y-0 left-0 w-1/2 flex items-center justify-center p-12 z-20"
          >
            <AnimatePresence mode="wait">
              {!isSignUp ? (
                <motion.div
                  key="signin-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  className="w-full max-w-sm"
                >
                  <span className="flex items-center justify-center gap-2 text-center font-display text-lg font-bold tracking-tight text-[#17356F] mb-1">
                    <Image src="/logo.png" alt="BridgeU" width={22} height={22} className="h-[22px] w-[22px] object-contain" />
                    Bridge<span className="text-primary">U</span>
                  </span>
                  <h1 className="text-center font-display text-3xl font-bold text-[#17356F]">Masuk ke Akun</h1>

                  {errorMessage && (
                    <div className="mt-4 rounded-2xl bg-rose-100 border border-rose-300 p-3 text-rose-800 font-mono text-[11px] text-center">
                      ✕ {errorMessage}
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="mt-7 space-y-5">
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wide text-[#496783] font-medium">Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@domain.com"
                        className="mt-2 w-full rounded-2xl border-none bg-[#EAF2FB] px-4 py-3.5 text-sm text-[#17356F] outline-none transition"
                        style={{ boxShadow: "inset 4px 4px 10px rgba(23,59,108,0.12), inset -4px -4px 10px rgba(255,255,255,0.9)" }}
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wide text-[#496783] font-medium">Kata Sandi</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="mt-2 w-full rounded-2xl border-none bg-[#EAF2FB] px-4 py-3.5 text-sm text-[#17356F] outline-none transition"
                        style={{ boxShadow: "inset 4px 4px 10px rgba(23,59,108,0.12), inset -4px -4px 10px rgba(255,255,255,0.9)" }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-2xl bg-[#17356F] py-4 text-center font-mono text-sm font-semibold text-white transition hover:bg-[#2475C5] disabled:opacity-50"
                      style={{ boxShadow: "6px 6px 16px rgba(23,59,108,0.25)" }}
                    >
                      {loading ? "Memproses..." : "Masuk"}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="signup-teaser"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  className="w-full max-w-sm text-center"
                >
                  <h2 className="font-display text-3xl font-bold text-[#17356F]">Buat Akun</h2>
                  <p className="mt-3 text-sm text-[#496783] leading-relaxed">
                    Pendaftaran BridgeU cuma beberapa langkah singkat — pilih peran, lengkapi profil, langsung dapat rekomendasi kolaborasi.
                  </p>
                  <div className="mt-8 flex flex-col gap-4">
                    <Link
                      href="/daftar?role=mahasiswa"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#EAF2FB] px-5 py-3.5 font-mono text-xs font-semibold text-[#17356F] transition hover:-translate-y-0.5"
                      style={{ boxShadow: "6px 6px 14px rgba(23,59,108,0.15), -6px -6px 14px rgba(255,255,255,0.85)" }}
                    >
                      <IconAcademic className="w-4 h-4" />
                      Daftar sebagai Mahasiswa
                    </Link>
                    <Link
                      href="/daftar?role=perusahaan"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#EAF2FB] px-5 py-3.5 font-mono text-xs font-semibold text-[#17356F] transition hover:-translate-y-0.5"
                      style={{ boxShadow: "6px 6px 14px rgba(23,59,108,0.15), -6px -6px 14px rgba(255,255,255,0.85)" }}
                    >
                      <IconBuilding className="w-4 h-4" />
                      Daftar sebagai Perusahaan
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ---- OVERLAY SLOT: panel warna, geser berlawanan arah dari form slot ---- */}
          <motion.div
            animate={{ x: isSignUp ? "0%" : "100%" }}
            transition={SWITCH_TRANSITION}
            className="absolute inset-y-0 left-0 w-1/2 overflow-hidden z-30 rounded-[40px]"
          >
            <div className="relative h-full w-full bg-gradient-to-br from-[#12284B] to-[#216DC0] flex items-center justify-center p-12 text-center">
              {/* Neumorphic decorative circles — bukan blur blob, tapi embossed ring */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" style={{ boxShadow: "inset 8px 8px 24px rgba(0,0,0,0.15), inset -8px -8px 24px rgba(255,255,255,0.06)" }} />
              <div className="pointer-events-none absolute -left-20 -bottom-28 h-80 w-80 rounded-full border border-white/10" style={{ boxShadow: "inset 8px 8px 24px rgba(0,0,0,0.15), inset -8px -8px 24px rgba(255,255,255,0.06)" }} />

              <AnimatePresence mode="wait">
                {!isSignUp ? (
                  <motion.div
                    key="hello"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                    className="relative z-10"
                  >
                    <h3 className="font-display text-3xl font-extrabold text-white">Hello, Friend!</h3>
                    <p className="mt-3 text-sm text-white/75 max-w-[260px] mx-auto leading-relaxed">
                      Belum punya akun BridgeU? Daftar dan mulai kolaborasi dengan mitra industri.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSignUp(true)}
                      className="mt-8 rounded-2xl border border-white/40 px-8 py-3.5 font-mono text-xs font-bold text-white transition hover:bg-white/10 hover:-translate-y-0.5"
                    >
                      SIGN UP
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                    className="relative z-10"
                  >
                    <h3 className="font-display text-3xl font-extrabold text-white">Welcome Back!</h3>
                    <p className="mt-3 text-sm text-white/75 max-w-[260px] mx-auto leading-relaxed">
                      Udah punya akun? Masuk buat lanjut mantau pengajuan kolaborasi kamu.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSignUp(false)}
                      className="mt-8 rounded-2xl border border-white/40 px-8 py-3.5 font-mono text-xs font-bold text-white transition hover:bg-white/10 hover:-translate-y-0.5"
                    >
                      SIGN IN
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ---- MOBILE: fallback simpel, neumorphic tetap dipakai ---- */}
        <div className="md:hidden">
          <div className="text-center mb-6">
            <h1 className="font-display text-2xl font-bold text-[#17356F]">Masuk ke Akun</h1>
            <p className="mt-1 text-sm text-[#496783]">Selamat datang kembali di BridgeU.</p>
          </div>

          <div
            className="rounded-[32px] p-6"
            style={{ background: "#EAF2FB", boxShadow: "16px 16px 36px rgba(23,59,108,0.16), -16px -16px 36px rgba(255,255,255,0.85)" }}
          >
            {errorMessage && (
              <div className="mb-5 rounded-2xl bg-rose-100 border border-rose-300 p-3 text-rose-800 font-mono text-[11px] text-center">
                ✕ {errorMessage}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wide text-[#496783] font-medium">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@domain.com"
                  className="mt-2 w-full rounded-2xl border-none bg-[#EAF2FB] px-4 py-3.5 text-sm text-[#17356F] outline-none"
                  style={{ boxShadow: "inset 4px 4px 10px rgba(23,59,108,0.12), inset -4px -4px 10px rgba(255,255,255,0.9)" }}
                />
              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-wide text-[#496783] font-medium">Kata Sandi</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-2xl border-none bg-[#EAF2FB] px-4 py-3.5 text-sm text-[#17356F] outline-none"
                  style={{ boxShadow: "inset 4px 4px 10px rgba(23,59,108,0.12), inset -4px -4px 10px rgba(255,255,255,0.9)" }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#17356F] py-4 text-center font-mono text-sm font-semibold text-white transition hover:bg-[#2475C5] disabled:opacity-50"
                style={{ boxShadow: "6px 6px 16px rgba(23,59,108,0.25)" }}
              >
                {loading ? "Memproses..." : "Masuk"}
              </button>
            </form>
            <div className="mt-6 text-center border-t border-[#173B6C]/10 pt-5">
              <p className="text-sm text-[#496783]">
                Belum punya akun?{" "}
                <Link href="/daftar" className="font-semibold text-primary hover:underline">
                  Daftar di sini
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
