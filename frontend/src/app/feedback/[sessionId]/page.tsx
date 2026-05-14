"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, Trophy, TrendingUp, Target, CheckCircle, AlertCircle,
  BarChart3, Clock, MessageSquare, Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const DIMENSIONS = [
  { name: "Technical Accuracy", score: 85, weight: 30, color: "#4F46E5" },
  { name: "Problem Solving", score: 78, weight: 20, color: "#3B82F6" },
  { name: "Communication", score: 92, weight: 15, color: "#8B5CF6" },
  { name: "Depth", score: 70, weight: 15, color: "#10B981" },
  { name: "Confidence", score: 88, weight: 10, color: "#F59E0B" },
  { name: "Structure", score: 82, weight: 10, color: "#EC4899" },
];

const STRENGTHS = [
  "Clear communication of complex concepts",
  "Good use of practical examples",
  "Strong fundamental understanding",
];

const IMPROVEMENTS = [
  "Dive deeper into edge cases and error handling",
  "Discuss time/space complexity more consistently",
  "Provide more structured responses using frameworks",
];

const ROADMAP = [
  { area: "Advanced Closures & Scope", priority: "high", suggestion: "Practice closures in async contexts" },
  { area: "System Design Patterns", priority: "medium", suggestion: "Study observer, strategy, and factory patterns" },
  { area: "Performance Optimization", priority: "low", suggestion: "Learn about memoization and lazy evaluation" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function FeedbackPage() {
  const overallScore = 83;

  return (
    <div className="min-h-screen gradient-hero">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-indigo/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-8">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
          {/* Header */}
          <motion.div variants={item} className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              className="inline-flex h-20 w-20 items-center justify-center rounded-3xl gradient-primary shadow-xl shadow-indigo/30 mb-6"
            >
              <Trophy className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Interview Complete! 🎉</h1>
            <p className="text-muted-foreground text-lg">Here&apos;s your detailed performance analysis.</p>
          </motion.div>

          {/* Overall Score */}
          <motion.div variants={item}>
            <Card className="glass border-border overflow-hidden">
              <div className="gradient-primary p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }}
                  className="inline-flex flex-col items-center">
                  <div className="text-7xl font-extrabold text-white mb-2">{overallScore}</div>
                  <div className="text-white/70 text-sm font-medium">Overall Score</div>
                </motion.div>
                <div className="flex items-center justify-center gap-6 mt-6 text-white/80 text-sm">
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 12 min</span>
                  <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /> 8 questions</span>
                  <span className="flex items-center gap-1"><TrendingUp className="h-4 w-4" /> +5 from last</span>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-warning" />
                  <span>You earned <strong className="gradient-text">+100 XP</strong> and maintained your <strong className="text-warning">7-day streak!</strong></span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Dimensions */}
          <motion.div variants={item}>
            <Card className="glass border-border">
              <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-indigo-light" /> 9-Dimension Analysis</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                {DIMENSIONS.map((dim, i) => (
                  <div key={dim.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{dim.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{dim.weight}% weight</span>
                        <span className={`text-sm font-bold ${dim.score >= 80 ? "text-success" : dim.score >= 60 ? "text-warning" : "text-destructive"}`}>{dim.score}</span>
                      </div>
                    </div>
                    <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${dim.score}%` }}
                        transition={{ duration: 1, delay: 0.8 + i * 0.1, ease: "easeOut" }}
                        className="h-full rounded-full" style={{ background: dim.color }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <motion.div variants={item}>
              <Card className="glass border-border h-full">
                <CardHeader><CardTitle className="flex items-center gap-2 text-success"><CheckCircle className="h-5 w-5" /> Strengths</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {STRENGTHS.map((s, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-success/5">
                      <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                      <p className="text-sm">{s}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Improvements */}
            <motion.div variants={item}>
              <Card className="glass border-border h-full">
                <CardHeader><CardTitle className="flex items-center gap-2 text-warning"><AlertCircle className="h-5 w-5" /> Areas to Improve</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {IMPROVEMENTS.map((s, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-warning/5">
                      <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                      <p className="text-sm">{s}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Roadmap */}
          <motion.div variants={item}>
            <Card className="glass border-border">
              <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-indigo-light" /> Preparation Roadmap</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {ROADMAP.map((r, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl glass-hover">
                    <div className={`h-2 w-2 rounded-full ${r.priority === "high" ? "bg-destructive" : r.priority === "medium" ? "bg-warning" : "bg-success"}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{r.area}</p>
                      <p className="text-xs text-muted-foreground">{r.suggestion}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium capitalize ${
                      r.priority === "high" ? "bg-destructive/10 text-destructive" : r.priority === "medium" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                    }`}>{r.priority}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div variants={item} className="flex flex-wrap justify-center gap-4 py-8">
            <Link href="/interview/setup"
              className="group flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-primary text-white font-semibold shadow-lg shadow-indigo/25 hover:scale-[1.02] transition-all">
              Practice Again <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/dashboard"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl glass glass-hover font-semibold transition-all">
              Go to Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
