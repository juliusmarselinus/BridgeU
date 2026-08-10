"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModalPickerProps } from "../types";

function IconAcademic({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function IconSearch({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function IconX({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function IconCheck({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ModalPicker({
  isOpen,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
  allowLainnya = true,
}: ModalPickerProps) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isOpen) setSearch("");
  }, [isOpen]);

  const displayOptions = useMemo(() => {
    const cleanList = options.filter(
      (o) => o && typeof o === "string" && o.trim() !== "" && o !== "Lainnya" && !o.startsWith("--")
    );
    if (allowLainnya) {
      return ["Lainnya", ...cleanList];
    }
    return cleanList;
  }, [options, allowLainnya]);

  const filtered = useMemo(() => {
    return displayOptions.filter((o) => o.toLowerCase().includes(search.toLowerCase()));
  }, [displayOptions, search]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg rounded-3xl border border-white/20 bg-[#173B6C] p-6 shadow-2xl space-y-4 text-[#DCE9F5] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-white/15 pb-4">
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <IconAcademic className="w-5 h-5 text-[#A9CBEA]" />
              {title}
            </h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white transition"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>

          {/* Search Filter */}
          <div className="relative">
            <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pilihan..."
              className="w-full rounded-xl border border-white/20 bg-white/10 pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/50 focus:border-[#A9CBEA] focus:outline-none"
            />
          </div>

          {/* Options List */}
          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
            {filtered.length === 0 ? (
              <p className="py-6 text-center text-xs text-white/50 font-mono">Pilihan tidak ditemukan</p>
            ) : (
              filtered.map((item) => {
                const isSelected = selectedValue === item;
                const isLainnya = item === "Lainnya";

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      onSelect(item);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-left text-xs transition border ${
                      isSelected
                        ? "bg-[#A9CBEA] text-[#162660] font-bold shadow-md border-[#A9CBEA]"
                        : isLainnya
                        ? "bg-white/15 text-white font-bold border-white/30 hover:bg-white/25"
                        : "bg-white/5 text-white hover:bg-white/15 border-white/10"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {isLainnya && (
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A9CBEA] bg-white/10 px-1.5 py-0.5 rounded">
                          OPSI KUSTOM
                        </span>
                      )}
                      {item}
                    </span>
                    {isSelected && <IconCheck className="w-4 h-4 text-[#162660]" />}
                  </button>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
