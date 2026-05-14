"use client";

import { motion, useMotionValue, useTransform, useSpring, useInView } from "framer-motion";
import { ArrowRight, Play, Zap, Brain, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function FloatingCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`animate-float-slow ${className}`}
    >
      {children}
    </motion.div>
  );
}

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-indigo-light/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const rotateX = useTransform(springY, [-300, 300], [5, -5]);
  const rotateY = useTransform(springX, [-300, 300], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero"
    >
      <ParticleField />

      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo/8 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple/8 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-indigo/20 mb-8"
            >
              <Zap className="h-3.5 w-3.5 text-indigo-light" />
              <span className="text-xs font-medium text-indigo-light">
                Powered by Advanced AI
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
            >
              Master Every{" "}
              <span className="gradient-text">Interview</span>
              <br />
              with AI That{" "}
              <span className="gradient-text">Adapts</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed"
            >
              Practice with an AI interviewer that thinks like a human. Adaptive
              questions, real-time feedback, voice interaction, and coding
              challenges — all in one platform.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link
                href="/signup"
                className="group flex items-center gap-2 px-7 py-3.5 rounded-xl gradient-primary text-white font-semibold shadow-lg shadow-indigo/25 hover:shadow-indigo/40 hover:scale-[1.02] transition-all duration-300"
              >
                Start Free Interview
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl glass glass-hover font-semibold text-foreground transition-all duration-300 hover:scale-[1.02]"
              >
                <Play className="h-4 w-4 text-indigo-light" />
                Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex gap-8 md:gap-12"
            >
              {[
                { value: 50000, suffix: "+", label: "Interviews Taken" },
                { value: 95, suffix: "%", label: "Success Rate" },
                { value: 200, suffix: "+", label: "Companies" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl md:text-3xl font-bold gradient-text">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Floating UI Cards */}
          <div className="hidden lg:block relative h-[500px]">
            <motion.div
              style={{ rotateX, rotateY, transformPerspective: 1200 }}
              className="relative w-full h-full"
            >
              {/* Main Interview Card */}
              <FloatingCard
                className="absolute top-8 left-4 w-80"
                delay={0.4}
              >
                <div className="glass rounded-2xl p-5 glow-indigo">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">AI Interviewer</p>
                      <p className="text-xs text-muted-foreground">System Design • Advanced</p>
                    </div>
                    <div className="ml-auto flex h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
                  </div>
                  <div className="space-y-3">
                    <div className="glass rounded-xl p-3">
                      <p className="text-sm text-muted-foreground">
                        &ldquo;Design a real-time notification system that supports 10M concurrent users...&rdquo;
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo animate-pulse" />
                      AI is listening...
                    </div>
                  </div>
                </div>
              </FloatingCard>

              {/* Score Card */}
              <FloatingCard
                className="absolute top-32 right-0 w-52"
                delay={0.6}
              >
                <div className="glass rounded-2xl p-4 glow-purple">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-xs font-medium text-success">+12% this week</span>
                  </div>
                  <div className="text-3xl font-bold gradient-text mb-1">87</div>
                  <p className="text-xs text-muted-foreground">Performance Score</p>
                  <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "87%" }}
                      transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
                      className="h-full rounded-full gradient-primary"
                    />
                  </div>
                </div>
              </FloatingCard>

              {/* Streak Card */}
              <FloatingCard
                className="absolute bottom-16 left-8 w-56"
                delay={0.8}
              >
                <div className="glass rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🔥</span>
                    <span className="text-sm font-semibold">7 Day Streak!</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <div
                        key={day}
                        className="h-6 w-6 rounded-md gradient-primary flex items-center justify-center text-[10px] font-bold text-white"
                      >
                        ✓
                      </div>
                    ))}
                  </div>
                </div>
              </FloatingCard>

              {/* Live Users */}
              <FloatingCard
                className="absolute bottom-4 right-8 w-48"
                delay={1.0}
              >
                <div className="glass rounded-2xl p-3 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["bg-indigo", "bg-purple", "bg-electric", "bg-success"].map((bg, i) => (
                      <div
                        key={i}
                        className={`h-7 w-7 rounded-full ${bg} border-2 border-background flex items-center justify-center text-[10px] font-bold text-white`}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-medium">
                      <Users className="h-3 w-3 inline mr-1" />
                      2.4k online
                    </p>
                  </div>
                </div>
              </FloatingCard>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
