"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Brain,
  Mic,
  Code2,
  BarChart3,
  ShieldCheck,
  Gamepad2,
} from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "Adaptive AI Interviewer",
    description:
      "Questions adapt in real-time based on your performance. Follow-ups dig deeper into your knowledge like a real interviewer would.",
    color: "#4F46E5",
    gradient: "from-indigo-500/20 to-indigo-600/5",
  },
  {
    icon: Mic,
    title: "Voice Interaction",
    description:
      "Speak your answers naturally. Our speech recognition captures your responses while text-to-speech delivers questions aloud.",
    color: "#3B82F6",
    gradient: "from-blue-500/20 to-blue-600/5",
  },
  {
    icon: Code2,
    title: "Live Coding Mode",
    description:
      "Solve coding challenges in a full-featured Monaco editor with multi-language support, test cases, and AI-powered code review.",
    color: "#8B5CF6",
    gradient: "from-violet-500/20 to-violet-600/5",
  },
  {
    icon: BarChart3,
    title: "9-Dimension Analytics",
    description:
      "Get scored across technical accuracy, problem solving, communication, depth, confidence, structure, and more with detailed feedback.",
    color: "#10B981",
    gradient: "from-emerald-500/20 to-emerald-600/5",
  },
  {
    icon: ShieldCheck,
    title: "RAG Question Bank",
    description:
      "Questions sourced from curated datasets and 200+ company patterns. AI generation only when the database can't match your needs.",
    color: "#F59E0B",
    gradient: "from-amber-500/20 to-amber-600/5",
  },
  {
    icon: Gamepad2,
    title: "Gamified Progress",
    description:
      "Earn XP, maintain streaks, unlock achievements, and climb levels. Stay motivated with a professional gamification system.",
    color: "#EC4899",
    gradient: "from-pink-500/20 to-pink-600/5",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[number];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className="relative h-full rounded-2xl glass glass-hover p-6 transition-all duration-500 hover:glow-sm overflow-hidden">
        {/* Background gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
        />

        {/* Gradient border on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 gradient-border" />

        {/* Content */}
        <div className="relative z-10">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl mb-5 transition-transform duration-300 group-hover:scale-110"
            style={{ background: `${feature.color}20` }}
          >
            <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
          </div>
          <h3 className="text-lg font-semibold mb-2 group-hover:gradient-text transition-all">
            {feature.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative py-28 px-6">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo/5 rounded-full blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-indigo/20 text-xs font-medium text-indigo-light mb-6">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Ace Your Interview</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete interview preparation ecosystem powered by advanced AI,
            designed to make you interview-ready for any company.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
