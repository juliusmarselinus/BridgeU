"use client";

import { useState } from "react";

export type PickerOption = {
  label: string;
  value: string;
  group?: string;
  icon?: string;
};

export function ModalPicker({
  isOpen,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: PickerOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
}) {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()) ||
      (opt.group && opt.group.toLowerCase().includes(search.toLowerCase()))
  );

  // Group options if groups exist
  const groupedOptions = filteredOptions.reduce((acc, opt) => {
    const groupName = opt.group || "Lainnya";
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(opt);
    return acc;
  }, {} as Record<string, PickerOption[]>);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col w-full max-w-lg max-h-[85vh] rounded-3xl bg-paper p-6 sm:p-8 shadow-2xl border border-steel/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-steel/15 pb-4">
          <div>
            <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
            <p className="font-mono text-xs text-steel mt-0.5">
              Cari atau pilih dari {options.length} opsi tersedia
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-steel/10 text-steel hover:bg-ink hover:text-paper transition"
            aria-label="Tutup Modal"
          >
            ✕
          </button>
        </div>

        {/* Input Search Real-time */}
        <div className="mt-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Cari nama..."
            className="w-full rounded-2xl border border-steel/25 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-bridge-gold focus:ring-2 focus:ring-bridge-gold/20"
            autoFocus
          />
        </div>

        {/* List Items Scrollable */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1 space-y-4">
          {Object.keys(groupedOptions).length === 0 ? (
            <div className="py-8 text-center font-mono text-xs text-steel">
              Tidak ada hasil cocok dengan &quot;{search}&quot;.
            </div>
          ) : (
            Object.entries(groupedOptions).map(([groupName, groupItems]) => (
              <div key={groupName} className="space-y-1">
                {groupName !== "Lainnya" && (
                  <div className="sticky top-0 bg-paper py-1 font-mono text-[11px] font-bold text-bridge-gold uppercase tracking-wider">
                    {groupName}
                  </div>
                )}
                {groupItems.map((opt) => {
                  const isSelected = selectedValue === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        onSelect(opt.value);
                        onClose();
                      }}
                      className={`w-full text-left rounded-xl px-4 py-3 font-mono text-xs transition flex items-center justify-between ${
                        isSelected
                          ? "bg-ink text-paper font-semibold shadow-sm"
                          : "bg-white/60 text-ink border border-steel/10 hover:border-ink hover:bg-white"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {opt.icon && <span>{opt.icon}</span>}
                        {opt.label}
                      </span>
                      {isSelected && <span className="text-bridge-gold font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
