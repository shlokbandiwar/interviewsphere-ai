"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MessageSquare, Play, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { INTERVIEW_DOMAINS } from "@/lib/constants";

const UPCOMING = [
  { domain: "Frontend", type: "Technical", duration: "45 min", difficulty: "Intermediate", color: "#3B82F6" },
  { domain: "System Design", type: "Mixed", duration: "60 min", difficulty: "Advanced", color: "#8B5CF6" },
];

const RECENT = [
  { id: "s1", domain: "Backend", score: 85, date: "May 14, 2026", status: "Completed", color: "#10B981" },
  { id: "s2", domain: "Behavioral", score: 78, date: "May 12, 2026", status: "Completed", color: "#06B6D4" },
  { id: "s3", domain: "Frontend", score: 91, date: "May 10, 2026", status: "Completed", color: "#3B82F6" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function InterviewsPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Interviews</h1>
          <p className="text-muted-foreground mt-1">Start a new session or review recent practice.</p>
        </div>
        <Link
          href="/interview/setup"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold shadow-lg shadow-indigo/25 hover:shadow-indigo/40 hover:scale-[1.02] transition-all"
        >
          New Interview <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>

      <motion.div variants={item} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {INTERVIEW_DOMAINS.filter((d) => d.value !== "custom").slice(0, 6).map((domain) => (
          <Link key={domain.value} href="/interview/setup">
            <Card className="glass glass-hover border-border h-full cursor-pointer transition-all hover:scale-[1.01]">
              <CardContent className="p-5">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${domain.color}15` }}
                >
                  <MessageSquare className="h-5 w-5" style={{ color: domain.color }} />
                </div>
                <p className="font-semibold mb-1">{domain.label}</p>
                <p className="text-xs text-muted-foreground">Practice {domain.label.toLowerCase()} interviews</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card className="glass border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Suggested Next</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {UPCOMING.map((session) => (
                <motion.div key={session.domain} className="flex items-center gap-4 p-3 rounded-xl glass-hover">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: `${session.color}15` }}>
                    <Play className="h-5 w-5" style={{ color: session.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{session.domain}</p>
                    <p className="text-xs text-muted-foreground">{session.type} • {session.duration}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{session.difficulty}</Badge>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="glass border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Recent Sessions</CardTitle>
                <Link href="/dashboard/history" className="text-xs text-indigo-light hover:text-indigo">View all</Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {RECENT.map((session) => (
                <Link key={session.id} href={`/feedback/${session.id}`} className="flex items-center gap-4 p-3 rounded-xl glass-hover transition-all">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: `${session.color}15` }}>
                    <Clock className="h-5 w-5" style={{ color: session.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{session.domain}</p>
                    <p className="text-xs text-muted-foreground">{session.date}</p>
                  </div>
                  <motion.div className="text-right">
                    <p className="text-lg font-bold text-success">{session.score}</p>
                    <p className="text-[10px] text-muted-foreground">{session.status}</p>
                  </motion.div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
