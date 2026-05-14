"use client";

import { motion } from "framer-motion";
import {
  MessageSquare, TrendingUp, Clock, Trophy,
  ArrowRight, Flame, Zap, Target,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const STATS = [
  { label: "Total Interviews", value: "24", change: "+3 this week", icon: MessageSquare, color: "#4F46E5", trend: "up" },
  { label: "Avg Score", value: "82", change: "+5 from last", icon: TrendingUp, color: "#10B981", trend: "up" },
  { label: "Practice Hours", value: "18.5", change: "2.3h this week", icon: Clock, color: "#3B82F6", trend: "up" },
  { label: "Current Streak", value: "7", change: "Best: 12 days", icon: Flame, color: "#F59E0B", trend: "up" },
];

const RECENT_INTERVIEWS = [
  { domain: "System Design", score: 87, date: "2h ago", difficulty: "Advanced", color: "#8B5CF6" },
  { domain: "Frontend", score: 91, date: "Yesterday", difficulty: "Intermediate", color: "#3B82F6" },
  { domain: "Behavioral", score: 78, date: "2 days ago", difficulty: "Intermediate", color: "#10B981" },
  { domain: "Backend", score: 85, date: "3 days ago", difficulty: "Advanced", color: "#4F46E5" },
];

const WEAK_AREAS = [
  { area: "System Design", mastery: 62, color: "#EF4444" },
  { area: "Dynamic Programming", mastery: 45, color: "#F59E0B" },
  { area: "Database Design", mastery: 58, color: "#F97316" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function DashboardPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back! 👋</h1>
          <p className="text-muted-foreground mt-1">Here&apos;s your interview preparation overview.</p>
        </div>
        <Link href="/interview/setup"
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold shadow-lg shadow-indigo/25 hover:shadow-indigo/40 hover:scale-[1.02] transition-all">
          Start Interview <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <Card key={stat.label} className="glass glass-hover border-border group cursor-default">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{ background: `${stat.color}15` }}>
                  <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                </div>
                <span className="text-xs font-medium text-success flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Interviews */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="glass border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Recent Interviews</CardTitle>
                <Link href="/dashboard/history" className="text-xs text-indigo-light hover:text-indigo">View all</Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {RECENT_INTERVIEWS.map((interview, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl glass-hover cursor-pointer transition-all group">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: `${interview.color}15` }}>
                    <MessageSquare className="h-5 w-5" style={{ color: interview.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{interview.domain}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{interview.difficulty}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{interview.date}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${interview.score >= 80 ? "text-success" : interview.score >= 60 ? "text-warning" : "text-destructive"}`}>
                      {interview.score}
                    </div>
                    <div className="text-[10px] text-muted-foreground">score</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column */}
        <motion.div variants={item} className="space-y-6">
          {/* Gamification Card */}
          <Card className="glass border-border overflow-hidden">
            <div className="gradient-primary p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Level 5 — Specialist</p>
                  <p className="text-xs text-white/70">1,250 / 2,000 XP</p>
                </div>
              </div>
              <Progress value={62.5} className="h-2 bg-white/20" />
            </div>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium">7 Day Streak 🔥</span>
                </div>
                <span className="text-xs text-muted-foreground">Best: 12</span>
              </div>
              <div className="flex gap-1">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                  <div key={i} className={`flex-1 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                    i < 7 ? "gradient-primary text-white" : "glass text-muted-foreground"
                  }`}>{day}</div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weak Areas */}
          <Card className="glass border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-warning" /> Focus Areas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {WEAK_AREAS.map((area) => (
                <div key={area.area}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm">{area.area}</span>
                    <span className="text-xs text-muted-foreground">{area.mastery}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${area.mastery}%` }}
                      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                      className="h-full rounded-full" style={{ background: area.color }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass border-border">
            <CardContent className="p-5 space-y-2">
              <Link href="/interview/setup" className="flex items-center gap-3 p-3 rounded-xl glass-hover transition-all group">
                <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Quick Interview</p>
                  <p className="text-[10px] text-muted-foreground">Start a random practice session</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
              </Link>
              <Link href="/dashboard/analytics" className="flex items-center gap-3 p-3 rounded-xl glass-hover transition-all group">
                <div className="h-9 w-9 rounded-xl bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">View Analytics</p>
                  <p className="text-[10px] text-muted-foreground">Deep dive into your performance</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
