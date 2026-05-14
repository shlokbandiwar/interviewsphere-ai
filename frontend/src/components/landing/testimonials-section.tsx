"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Priya Sharma", role: "Software Engineer @ Google",
    content: "InterviewSphere AI completely transformed my prep. The adaptive questioning felt incredibly realistic. I cleared 4 out of 5 FAANG interviews.",
    avatar: "PS", color: "#4F46E5",
  },
  {
    name: "Alex Chen", role: "Senior SDE @ Amazon",
    content: "The system design questions were spot-on. The AI followed up with exactly the right clarifying questions. The coding mode with live evaluation was a game-changer.",
    avatar: "AC", color: "#3B82F6",
  },
  {
    name: "Maria Rodriguez", role: "Product Manager @ Meta",
    content: "I loved the behavioral interview mode. It understood the STAR format and gave specific, actionable feedback. My confidence skyrocketed.",
    avatar: "MR", color: "#8B5CF6",
  },
  {
    name: "Rahul Patel", role: "DevOps Engineer @ Netflix",
    content: "The RAG-based question bank is insane. It pulled company-specific patterns that matched exactly what I faced in my Netflix loop. 10/10 recommend.",
    avatar: "RP", color: "#10B981",
  },
  {
    name: "Sarah Kim", role: "Data Scientist @ Stripe",
    content: "Voice mode + the analytics dashboard made me feel like I had a personal interview coach. The 9-dimension scoring helped me pinpoint exactly where to improve.",
    avatar: "SK", color: "#EC4899",
  },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [cur, setCur] = useState(0);
  const [auto, setAuto] = useState(true);
  const next = useCallback(() => setCur((c) => (c + 1) % TESTIMONIALS.length), []);
  const prev = useCallback(() => setCur((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length), []);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [auto, next]);

  return (
    <section id="testimonials" ref={ref} className="relative py-28 px-6">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple/5 rounded-full blur-[120px]" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-purple/20 text-xs font-medium text-purple-light mb-6">Testimonials</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">Loved by <span className="gradient-text">Thousands</span></h2>
          <p className="text-lg text-muted-foreground">See how professionals landed their dream jobs.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}
          onMouseEnter={() => setAuto(false)} onMouseLeave={() => setAuto(true)}>
          <div className="glass rounded-2xl p-8 md:p-12 glow-sm">
            <Quote className="h-8 w-8 text-indigo/30 mb-6" />
            <div className="min-h-[100px]">
              <motion.p key={cur} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="text-lg md:text-xl leading-relaxed text-foreground/90 mb-8">
                &ldquo;{TESTIMONIALS[cur].content}&rdquo;
              </motion.p>
            </div>
            <motion.div key={`a-${cur}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: TESTIMONIALS[cur].color }}>{TESTIMONIALS[cur].avatar}</div>
              <div>
                <p className="font-semibold">{TESTIMONIALS[cur].name}</p>
                <p className="text-sm text-muted-foreground">{TESTIMONIALS[cur].role}</p>
              </div>
            </motion.div>
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setCur(i)} className={`h-2 rounded-full transition-all duration-300 ${i === cur ? "w-8 gradient-primary" : "w-2 bg-muted-foreground/30"}`} />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={prev} className="flex h-10 w-10 items-center justify-center rounded-xl glass glass-hover"><ChevronLeft className="h-4 w-4" /></button>
              <button onClick={next} className="flex h-10 w-10 items-center justify-center rounded-xl glass glass-hover"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
