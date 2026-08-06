"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { dummyUser } from "@/lib/dummy-data";

type Tab = "masuk" | "daftar";
type Role = "mahasiswa" | "perusahaan";

export function AuthModal({
  isOpen,
  onClose,
  defaultTab = "masuk",
}: {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: Tab;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [role, setRole] = useState<Role>("mahasiswa");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (tab === "masuk") {
      if (email === dummyUser.email && password === dummyUser.password) {
        localStorage.setItem("bridgeu_user", JSON.stringify(dummyUser));
        onClose();
        router.push("/dashboard");
      } else {
        setError("Email atau kata sandi salah. Coba pakai akun dummy.");
      }
    } else {
      // daftar — dummy, langsung anggap sukses & login
      localStorage.setItem(
        "bridgeu_user",
        JSON.stringify({ ...dummyUser, email: email || dummyUser.email })
      );
      onClose();
      router.push("/dashboard");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-paper p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-steel transition hover:text-ink"
          aria-label="Tutup"
        >
          ✕
        </button>

        <span className="font-display text-lg font-semibold text-ink">
          Bridge<span className="text-bridge-gold">U</span>
        </span>

        <div className="mt-6 flex gap-1 rounded-full bg-steel/10 p-1">
          <button
            onClick={() => setTab("masuk")}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition ${
              tab === "masuk" ? "bg-ink text-paper" : "text-steel hover:text-ink"
            }`}
          >
            Masuk
          </button>
          <button
            onClick={() => setTab("daftar")}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition ${
              tab === "daftar" ? "bg-ink text-paper" : "text-steel hover:text-ink"
            }`}
          >
            Daftar
          </button>
        </div>

        {tab === "daftar" && (
          <div className="mt-5 flex gap-2 font-mono text-xs">
            <button
              onClick={() => setRole("mahasiswa")}
              className={`rounded-full px-4 py-2 transition ${
                role === "mahasiswa"
                  ? "bg-ink text-paper"
                  : "border border-steel/25 text-steel hover:border-ink"
              }`}
            >
              Mahasiswa
            </button>
            <button
              onClick={() => setRole("perusahaan")}
              className={`rounded-full px-4 py-2 transition ${
                role === "perusahaan"
                  ? "bg-ink text-paper"
                  : "border border-steel/25 text-steel hover:border-ink"
              }`}
            >
              Perusahaan
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {tab === "daftar" && (
            <div>
              <label className="font-mono text-xs uppercase tracking-wide text-steel">
                {role === "mahasiswa" ? "Nama Lengkap" : "Nama Perusahaan"}
              </label>
              <input
                type="text"
                placeholder={role === "mahasiswa" ? "Nama kamu" : "Nama perusahaan"}
                className="mt-1 w-full rounded-lg border border-steel/25 px-4 py-3 text-sm outline-none transition focus:border-ink"
              />
            </div>
          )}
          <div>
            <label className="font-mono text-xs uppercase tracking-wide text-steel">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mahasiswa@umn.ac.id"
              className="mt-1 w-full rounded-lg border border-steel/25 px-4 py-3 text-sm outline-none transition focus:border-ink"
            />
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-wide text-steel">
              Kata Sandi
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-steel/25 px-4 py-3 text-sm outline-none transition focus:border-ink"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {tab === "masuk" && (
            <p className="font-mono text-xs text-steel">
              Dummy: {dummyUser.email} / {dummyUser.password}
            </p>
          )}

          <button
            type="submit"
            className="mt-2 rounded-lg bg-ink py-3 text-sm font-medium text-paper transition hover:bg-steel"
          >
            {tab === "masuk" ? "Masuk" : "Buat Akun"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-steel">
          {tab === "masuk" ? (
            <>
              Belum punya akun?{" "}
              <button onClick={() => setTab("daftar")} className="text-bridge-gold underline">
                Daftar
              </button>
            </>
          ) : (
            <>
              Sudah punya akun?{" "}
              <button onClick={() => setTab("masuk")} className="text-bridge-gold underline">
                Masuk
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}