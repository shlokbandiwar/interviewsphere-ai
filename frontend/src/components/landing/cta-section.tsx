"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-28 px-6 overflow-hidden">
      {/* Ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple/8 rounded-full blur-[100px]" />

      <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="relative z-10 mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-indigo/20 text-xs font-medium text-indigo-light mb-8">
          <Sparkles className="h-3.5 w-3.5" /> Start Your Journey
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
          Ready to <span className="gradient-text">Ace Your Next Interview?</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
          Join thousands of engineers who transformed their interview skills with AI-powered practice.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="group flex items-center gap-2 px-8 py-4 rounded-xl gradient-primary text-white font-semibold shadow-lg shadow-indigo/25 hover:shadow-indigo/40 hover:scale-[1.02] transition-all text-lg">
            Start Free — No Card Required
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <p className="text-xs text-muted-foreground mt-6">Free forever plan • No credit card • Cancel anytime</p>
      </motion.div>
    </section>
  );
}
