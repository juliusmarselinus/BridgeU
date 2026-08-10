"use client";

import React from "react";
import { motion } from "framer-motion";
import type { UserBadge } from "../types/dashboard";
import { IconRocket, IconAcademic, IconLightning, IconTrophy, IconAward } from "./DashboardIcons";

interface DashboardBadgesProps {
  userBadges: UserBadge[];
}

function getBadgeIcon(iconType: string) {
  switch (iconType) {
    case "rocket":
      return <IconRocket className="w-5 h-5 text-bridge-gold" />;
    case "academic":
      return <IconAcademic className="w-5 h-5 text-bridge-gold" />;
    case "lightning":
      return <IconLightning className="w-5 h-5 text-bridge-gold" />;
    case "trophy":
      return <IconTrophy className="w-5 h-5 text-bridge-gold" />;
    default:
      return <IconAward className="w-5 h-5 text-bridge-gold" />;
  }
}

export function DashboardBadges({ userBadges }: DashboardBadgesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
      className="rounded-2xl border-2 border-steel/15 bg-white p-6 shadow-lg space-y-4"
    >
      <div className="flex items-center justify-between border-b border-steel/15 pb-3">
        <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
          <IconAward className="w-5 h-5 text-bridge-gold" />
          Pencapaian kamu
        </h3>
        <span className="font-mono text-xs font-bold text-bridge-gold bg-bridge-gold/15 px-2.5 py-1 rounded-md border border-bridge-gold/30">
          {userBadges.length} Badge Unlocked
        </span>
      </div>

      <div className="space-y-3">
        {userBadges.map((b, i) => (
          <motion.div
            key={i}
            whileHover={{ x: 4 }}
            className="flex items-center gap-3.5 p-3.5 rounded-xl border border-steel/15 bg-slate-50 hover:bg-white transition hover:shadow-sm"
          >
            <span className="p-2.5 rounded-xl bg-ink text-bridge-gold border border-steel/20 shrink-0 shadow-xs flex items-center justify-center">
              {getBadgeIcon(b.iconType)}
            </span>
            <div>
              <h5 className="text-xs font-bold text-ink">{b.title}</h5>
              <p className="text-[11px] font-medium text-steel">{b.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
