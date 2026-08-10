"use client";

import React from "react";
import { motion } from "framer-motion";
import { StepItem } from "../types";

function IconCheck({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

interface StepIndicatorProps {
  currentStep: number;
  stepsList: StepItem[];
}

export function StepIndicator({ currentStep, stepsList }: StepIndicatorProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between">
        {stepsList.map((step) => {
          const IconComponent = step.icon;
          const isActive = currentStep === step.num;
          const isPassed = currentStep > step.num;

          return (
            <div key={step.num} className="flex flex-col items-center gap-2 relative z-10">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? "border-[#173B6C] bg-[#173B6C] text-white shadow-lg scale-110"
                    : isPassed
                    ? "border-[#173B6C] bg-white/40 text-[#173B6C]"
                    : "border-white/40 bg-white/10 text-[#173B6C]/50"
                }`}
              >
                {isPassed ? <IconCheck className="w-5 h-5" /> : <IconComponent className="w-4 h-4" />}
              </div>
              <span
                className={`hidden sm:inline font-mono text-[11px] font-bold ${
                  isActive ? "text-[#173B6C]" : isPassed ? "text-[#173B6C]/80" : "text-[#173B6C]/50"
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar Line */}
      <div className="relative mt-3 h-2 w-full overflow-hidden rounded-full bg-white/35">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#2475C5] to-[#173B6C]"
          initial={{ width: "20%" }}
          animate={{ width: `${(currentStep / 5) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
}
