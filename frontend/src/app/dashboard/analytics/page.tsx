"use client";

import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, BarChart3 } from "lucide-react";
import { EVALUATION_DIMENSIONS } from "@/lib/constants";

const SCORE_TREND = [
  { date: "Apr 21", score: 72 },
  { date: "Apr 28", score: 75 },
  { date: "May 5", score: 78 },
  { date: "May 12", score: 80 },
  { date: "May 15", score: 82 },
];

const DOMAIN_SCORES = [
  { domain: "Frontend", score: 91 },
  { domain: "Backend", score: 85 },
  { domain: "System Design", score: 62 },
  { domain: "Behavioral", score: 78 },
  { domain: "DSA", score: 70 },
];

const SKILL_RADAR = EVALUATION_DIMENSIONS.filter((d) => d.weight > 0).map((d) => ({
  skill: d.label.split(" ")[0],
  score: Math.round(60 + d.weight * 100),
}));

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const chartTooltipStyle = {
  contentStyle: {
    background: "rgba(17, 17, 24, 0.95)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    fontSize: "12px",
  },
  labelStyle: { color: "#94A3B8" },
};

export default function AnalyticsPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item}>
        <h1 className="text-2xl md:text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your performance trends and skill development.</p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Avg Score", value: "82", icon: TrendingUp, color: "#10B981" },
          { label: "Interviews", value: "24", icon: BarChart3, color: "#4F46E5" },
          { label: "Improvement", value: "+14%", icon: TrendingUp, color: "#3B82F6" },
          { label: "Focus Areas", value: "3", icon: Target, color: "#F59E0B" },
        ].map((stat) => (
          <Card key={stat.label} className="glass border-border">
            <CardContent className="p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl mb-3" style={{ background: `${stat.color}15` }}>
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={item}>
        <Card className="glass border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SCORE_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="date" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 100]} tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip {...chartTooltipStyle} />
                  <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={2} dot={{ fill: "#818CF8", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid lg:grid-cols-2 gap-6">
        <Card className="glass border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Scores by Domain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DOMAIN_SCORES} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="domain" tick={{ fill: "#94A3B8", fontSize: 11 }} width={90} axisLine={false} tickLine={false} />
                  <Tooltip {...chartTooltipStyle} />
                  <Bar dataKey="score" fill="#4F46E5" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Skill Radar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={SKILL_RADAR}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "#94A3B8", fontSize: 10 }} />
                  <Radar dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.25} />
                  <Tooltip {...chartTooltipStyle} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
