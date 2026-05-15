"use client";

import { motion } from "framer-motion";
import { Trophy, Flame, Zap, Star, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LEVEL_NAMES } from "@/lib/constants";

const BADGES = [
  { id: "1", name: "First Interview", description: "Complete your first mock interview", tier: "bronze", earned: true, icon: "🎯" },
  { id: "2", name: "Week Warrior", description: "Maintain a 7-day practice streak", tier: "silver", earned: true, icon: "🔥" },
  { id: "3", name: "High Scorer", description: "Score 90+ on any interview", tier: "gold", earned: true, icon: "⭐" },
  { id: "4", name: "System Architect", description: "Score 85+ on system design", tier: "gold", earned: false, icon: "🏗️" },
  { id: "5", name: "Code Master", description: "Complete 5 coding interviews", tier: "platinum", earned: false, icon: "💻" },
  { id: "6", name: "Interview Legend", description: "Complete 50 interviews", tier: "platinum", earned: false, icon: "👑" },
];

const TIER_COLORS: Record<string, string> = {
  bronze: "#CD7F32",
  silver: "#94A3B8",
  gold: "#F59E0B",
  platinum: "#8B5CF6",
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function AchievementsPage() {
  const earnedCount = BADGES.filter((b) => b.earned).length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item}>
        <h1 className="text-2xl md:text-3xl font-bold">Achievements</h1>
        <p className="text-muted-foreground mt-1">Earn badges and level up your interview skills.</p>
      </motion.div>

      <motion.div variants={item}>
        <Card className="glass border-border overflow-hidden">
          <div className="gradient-primary p-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <Trophy className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-white">Level 5 — {LEVEL_NAMES[4]}</p>
                <p className="text-sm text-white/70">1,250 / 2,000 XP • {earnedCount}/{BADGES.length} badges</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-2xl font-bold text-white flex items-center gap-1 justify-end">
                  <Flame className="h-6 w-6 text-warning" /> 7
                </p>
                <p className="text-xs text-white/70">day streak</p>
              </div>
            </div>
            <Progress value={62.5} className="h-2 bg-white/20 mt-4" />
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BADGES.map((badge) => (
          <Card
            key={badge.id}
            className={`glass border-border transition-all ${badge.earned ? "glass-hover" : "opacity-60"}`}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{badge.earned ? badge.icon : "🔒"}</span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium capitalize"
                  style={{ background: `${TIER_COLORS[badge.tier]}20`, color: TIER_COLORS[badge.tier] }}
                >
                  {badge.tier}
                </span>
              </div>
              <p className="font-semibold mb-1 flex items-center gap-2">
                {badge.name}
                {badge.earned && <Star className="h-3.5 w-3.5 text-warning fill-warning" />}
                {!badge.earned && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
              </p>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={item}>
        <Card className="glass border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4 text-indigo-light" /> XP Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Interviews completed", xp: "+2,400 XP", count: "24" },
              { label: "Questions answered", xp: "+800 XP", count: "80" },
              { label: "Streak bonuses", xp: "+350 XP", count: "7 days" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between p-3 rounded-xl glass-hover">
                <span className="text-sm">{row.label}</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-indigo-light">{row.xp}</span>
                  <span className="text-xs text-muted-foreground ml-2">({row.count})</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
