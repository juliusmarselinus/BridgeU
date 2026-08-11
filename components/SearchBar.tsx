"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { dummyPublicUsers, dummyRegisteredCompanies } from "@/lib/dummy-data";

type SearchItem = {
  id: string;
  name: string;
  type: "mahasiswa" | "company";
  roleOrCategory: string;
  href: string;
};

const MIN_QUERY_LENGTH = 1;

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Gabungin dummy mahasiswa & company jadi satu dataset pencarian
  const dataset: SearchItem[] = useMemo(() => {
    const mahasiswaItems: SearchItem[] = Object.values(dummyPublicUsers).map((user) => ({
      id: user.id,
      name: user.nama,
      type: "mahasiswa",
      roleOrCategory: user.prodi || "Mahasiswa",
      href: `/profile/${user.id}`,
    }));

    const companyItems: SearchItem[] = dummyRegisteredCompanies.map((comp) => ({
      id: comp.id,
      name: comp.nama,
      type: "company",
      roleOrCategory: comp.industri,
      href: `/profile/company/${comp.id}`,
    }));

    return [...mahasiswaItems, ...companyItems];
  }, []);

  // Nama diprioritaskan; role/prodi cuma jadi fallback kalau ga ada yang match nama
  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length < MIN_QUERY_LENGTH) return [];

    const matchesWord = (text: string) =>
      text.toLowerCase().split(" ").some((word) => word.startsWith(trimmed));

    const nameMatches = dataset.filter((item) => matchesWord(item.name));

    const roleMatches = dataset.filter(
      (item) => !nameMatches.includes(item) && matchesWord(item.roleOrCategory)
    );

    return [...nameMatches, ...roleMatches];
  }, [query, dataset]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
  };

  const handleSelect = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className="relative w-48 sm:w-64" ref={searchRef}>
      <div className="relative flex items-center">
        <svg
          className="absolute left-3 h-4 w-4 text-steel/60 pointer-events-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Cari orang, perusahaan, profesi..."
          className="w-full rounded-full border border-border bg-surface/65 py-1.5 pl-9 pr-8 font-mono text-xs text-ink placeholder-steel/50 outline-none transition focus:border-primary/30 focus:bg-white"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 text-steel/60 hover:text-ink text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && query.trim().length >= MIN_QUERY_LENGTH && (
        <div className="absolute left-0 right-0 top-11 z-50 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          {results.length > 0 ? (
            <div className="max-h-64 overflow-y-auto py-1">
              {results.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={handleSelect}
                  className="flex items-center justify-between px-4 py-2.5 transition hover:bg-surface"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-xs font-medium text-ink">
                      {item.name}
                    </p>
                    <p className="font-mono text-[10px] text-steel">
                      {item.roleOrCategory}
                    </p>
                  </div>
                  <span
                    className={`ml-2 shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold ${
                      item.type === "company"
                        ? "bg-primary/10 text-primary"
                        : "bg-sky/25 text-ocean"
                    }`}
                  >
                    {item.type === "company" ? "Perusahaan" : "Mahasiswa"}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center font-mono text-xs text-steel/60">
              Tidak ada hasil untuk "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}