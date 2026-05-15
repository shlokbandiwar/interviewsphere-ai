"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageSquare, Clock, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const HISTORY = [
  { id: "demo", domain: "Frontend", type: "Technical", score: 91, duration: "38 min", date: "May 15, 2026", difficulty: "Intermediate", color: "#3B82F6" },
  { id: "s1", domain: "System Design", type: "Mixed", score: 87, duration: "52 min", date: "May 14, 2026", difficulty: "Advanced", color: "#8B5CF6" },
  { id: "s2", domain: "Backend", type: "Technical", score: 85, duration: "41 min", date: "May 12, 2026", difficulty: "Advanced", color: "#10B981" },
  { id: "s3", domain: "Behavioral", type: "Behavioral", score: 78, duration: "28 min", date: "May 10, 2026", difficulty: "Intermediate", color: "#06B6D4" },
  { id: "s4", domain: "Frontend", type: "Coding", score: 72, duration: "55 min", date: "May 8, 2026", difficulty: "Intermediate", color: "#3B82F6" },
  { id: "s5", domain: "DevOps", type: "Technical", score: 68, duration: "35 min", date: "May 5, 2026", difficulty: "Beginner", color: "#EF4444" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function HistoryPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">History</h1>
          <p className="text-muted-foreground mt-1">All your past interview sessions.</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass glass-hover text-sm font-medium text-muted-foreground hover:text-foreground">
          <Filter className="h-4 w-4" /> Filter
        </button>
      </motion.div>

      <motion.div variants={item}>
        <Card className="glass border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">{HISTORY.length} Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {HISTORY.map((session) => (
              <Link
                key={session.id}
                href={`/feedback/${session.id}`}
                className="flex items-center gap-4 p-4 rounded-xl glass-hover transition-all"
              >
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${session.color}15` }}
                >
                  <MessageSquare className="h-5 w-5" style={{ color: session.color }} />
                </div>
                <div className="flex-1 min-w-0 grid sm:grid-cols-3 gap-2">
                  <div>
                    <p className="text-sm font-medium">{session.domain}</p>
                    <p className="text-xs text-muted-foreground">{session.type}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {session.duration} • {session.date}
                  </div>
                  <div className="flex items-center gap-2 sm:justify-end">
                    <Badge variant="outline" className="text-[10px]">{session.difficulty}</Badge>
                    <span className={`text-lg font-bold ${session.score >= 80 ? "text-success" : session.score >= 60 ? "text-warning" : "text-destructive"}`}>
                      {session.score}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
