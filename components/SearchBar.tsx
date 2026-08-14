"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getFrameDefinition, getStoredAvatarFrame } from "@/lib/avatar-frames";
import { FloatingAvatarOverlay } from "@/components/profile/FloatingAvatarOverlay";

type SearchItem = {
  id: string;
  name: string;
  type: "mahasiswa" | "company";
  roleOrCategory: string;
  fotoUrl: string | null;
  equippedFrameCode?: string;
  href: string;
};

const MIN_QUERY_LENGTH = 1;
const DEBOUNCE_MS = 300;

const GROUP_META: Record<SearchItem["type"], { label: string; badge: string }> = {
  mahasiswa: { label: "Mahasiswa", badge: "bg-sky/25 text-ocean" },
  company: { label: "Perusahaan", badge: "bg-primary/10 text-primary" },
};

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Fetch ke API tiap query berubah, pake debounce biar ga spam request
  useEffect(() => {
    const trimmed = query.trim();

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (trimmed.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    debounceRef.current = setTimeout(async () => {
      // Batalin request sebelumnya kalau masih jalan
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Search request failed");
        const data = await res.json();
        setResults(data.results ?? []);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Search error:", err);
          setResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

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
    setResults([]);
    setIsOpen(false);
  };

  const handleSelect = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  };

  // Group results by type so the dropdown reads as sections, not one flat list
  const grouped = useMemo(() => {
    const groups: { type: SearchItem["type"]; items: SearchItem[] }[] = [
      { type: "mahasiswa", items: [] },
      { type: "company", items: [] },
    ];
    for (const item of results) {
      const g = groups.find((g) => g.type === item.type);
      if (g) g.items.push(item);
    }
    return groups.filter((g) => g.items.length > 0);
  }, [results]);

  return (
    <div className="relative w-28 sm:w-48 md:w-64" ref={searchRef}>
      <div className="relative flex items-center">
        <svg
          className="absolute left-2.5 sm:left-3 h-3.5 sm:h-4 w-3.5 sm:w-4 text-steel/60 pointer-events-none"
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
          placeholder="Cari..."
          className="w-full rounded-full border border-border bg-surface/65 py-1.5 pl-7 sm:pl-9 pr-6 sm:pr-8 font-mono text-xs text-ink placeholder-steel/50 outline-none transition focus:border-primary/30 focus:bg-white truncate"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 sm:right-3 text-steel/60 hover:text-ink text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && query.trim().length >= MIN_QUERY_LENGTH && (
        <div
          className="fixed inset-x-3 top-20 z-50 max-w-md mx-auto sm:absolute sm:inset-auto sm:right-0 sm:top-11 sm:w-96 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
          style={{ width: "min(440px, calc(100vw - 1.5rem))" }}
        >
          {isLoading ? (
            <div className="px-4 py-8 text-center font-mono text-xs text-steel/60">
              Mencari...
            </div>
          ) : grouped.length > 0 ? (
            <div className="max-h-[26rem] overflow-y-auto py-2">
              {grouped.map((group, gi) => (
                <div key={group.type} className={gi > 0 ? "mt-2" : ""}>
                  <div className="sticky top-0 z-10 bg-card px-5 py-1.5">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-steel/50">
                      {GROUP_META[group.type].label}
                      <span className="ml-1.5 text-steel/30">{group.items.length}</span>
                    </span>
                  </div>

                  {group.items.map((item) => {
                    const frameCode =
                      item.type === "mahasiswa" && item.equippedFrameCode && item.equippedFrameCode !== "none"
                        ? item.equippedFrameCode
                        : "none";
                    const frameDef = getFrameDefinition(frameCode);

                    return (
                      <Link
                        key={`${item.type}-${item.id}`}
                        href={item.href}
                        onClick={handleSelect}
                        className="flex items-start gap-3.5 px-5 py-3.5 transition hover:bg-surface"
                      >
                        <div className="relative shrink-0 pt-1">
                          {item.type === "mahasiswa" && (
                            <FloatingAvatarOverlay type={frameDef.floatingOverlay} size="sm" />
                          )}
                          {item.type === "mahasiswa" && frameDef.glowClass && (
                            <div className={`absolute inset-0 rounded-full ${frameDef.glowClass}`} />
                          )}
                          <div
                            className={`relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface transition-all ${
                              item.type === "mahasiswa"
                                ? `${frameDef.containerClass} ${frameDef.motifBorder || ""}`
                                : ""
                            }`}
                          >
                            <div className="h-full w-full overflow-hidden rounded-full bg-surface">
                              {item.fotoUrl ? (
                                <Image
                                  src={item.fotoUrl}
                                  alt={item.name}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center font-display text-xs font-semibold text-steel/60">
                                  {item.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="min-w-0 flex-1 pt-0.5">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-display text-sm font-semibold text-ink leading-snug break-words">
                              {item.name}
                            </p>
                            <span
                              className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold whitespace-nowrap ${GROUP_META[item.type].badge}`}
                            >
                              {GROUP_META[item.type].label}
                            </span>
                          </div>
                          <p className="mt-0.5 font-mono text-[11px] text-steel leading-snug break-words">
                            {item.roleOrCategory}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center font-mono text-xs text-steel/60">
              Tidak ada hasil untuk &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}