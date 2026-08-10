"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FormDataState } from "../types";

function IconCheck({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
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

function IconPlus({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

interface Step3Props {
  formData: FormDataState;
  skillOptions: string[];
  toggleSkill: (skill: string) => void;
  addCustomSkill: (customSkill: string) => void;
}

export function Step3Skills({ formData, skillOptions, toggleSkill, addCustomSkill }: Step3Props) {
  const [skillSearch, setSkillSearch] = useState("");
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Top 10 Recommendations when not searching
  const displayedSkills = useMemo(() => {
    if (skillSearch.trim()) {
      return skillOptions.filter((s) => s.toLowerCase().includes(skillSearch.toLowerCase()));
    }
    return skillOptions.slice(0, 10);
  }, [skillOptions, skillSearch]);

  const handleAddSkill = () => {
    if (customSkillInput.trim()) {
      addCustomSkill(customSkillInput);
      setCustomSkillInput("");
      setShowCustomInput(false);
    }
  };

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="space-y-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#173B6C]">Langkah 3: Pilih Keahlian (Skills)</h2>
          <p className="text-xs text-[#173B6C]/80 mt-1">
            Pilih minimal <strong className="text-[#173B6C] font-bold">3 keahlian</strong>. Menampilkan Top 10 Rekomendasi berdasarkan program studi kamu.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[#173B6C]/10 border border-[#173B6C]/30 px-3 py-1 font-mono text-xs font-bold text-[#173B6C]">
          {formData.selectedSkills.length} Terpilih (Min 3)
        </span>
      </div>

      {/* Clean Full Search Bar Only */}
      <div className="relative">
        <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#173B6C]/40" />
        <input
          type="text"
          value={skillSearch}
          onChange={(e) => setSkillSearch(e.target.value)}
          placeholder="Cari keahlian kamu..."
          className="w-full rounded-xl border border-[#173B6C]/20 bg-white/70 pl-10 pr-4 py-3 text-xs text-[#173B6C] placeholder-[#173B6C]/40 focus:border-[#2475C5] focus:bg-white focus:outline-none shadow-sm"
        />
      </div>

      {/* Top 10 Skills Grid */}
      <div className="flex flex-wrap gap-2.5 pt-2 max-h-64 overflow-y-auto pr-1">
        {displayedSkills.map((skill) => {
          const isSelected = formData.selectedSkills.includes(skill);
          return (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold transition flex items-center gap-2 border ${
                isSelected
                  ? "bg-[#173B6C] text-white border-[#173B6C] shadow-md"
                  : "bg-white/60 text-[#173B6C] border-white/40 hover:bg-white/90"
              }`}
            >
              {isSelected && <IconCheck className="w-3.5 h-3.5 text-white" />}
              <span>{skill}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Skill Input at the Bottom */}
      <div className="border-t border-[#173B6C]/15 pt-4">
        {!showCustomInput ? (
          <button
            type="button"
            onClick={() => setShowCustomInput(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2475C5] hover:text-[#173B6C] transition"
          >
            <IconPlus className="w-4 h-4" />
            Skill kamu tidak ada dalam daftar? Tambah Keahlian Kustom
          </button>
        ) : (
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
              placeholder="Ketik nama skill kustom..."
              className="flex-1 rounded-xl border border-[#173B6C]/20 bg-white px-4 py-2.5 text-xs text-[#173B6C] placeholder-[#173B6C]/40 focus:border-[#2475C5] focus:outline-none shadow-sm"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="rounded-xl bg-[#173B6C] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#2475C5] transition shadow-sm"
            >
              + Tambah
            </button>
            <button
              type="button"
              onClick={() => setShowCustomInput(false)}
              className="rounded-xl border border-[#173B6C]/20 px-3 py-2.5 text-xs font-bold text-[#173B6C]/60 hover:text-[#173B6C]"
            >
              Batal
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
