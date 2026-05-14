"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  { q: "How does the AI interviewer work?", a: "Our AI uses advanced language models combined with a curated question bank (RAG architecture). It adapts questions based on your responses, difficulty level, and target role — behaving like a real human interviewer with contextual follow-ups." },
  { q: "Is it free to use?", a: "Yes! You can start with free interviews. Our free tier includes unlimited practice mode interviews, basic analytics, and access to the community question bank. Premium features like stress mode, coding challenges, and detailed analytics are available with a subscription." },
  { q: "What types of interviews does it support?", a: "Technical (frontend, backend, fullstack, DevOps, data science), behavioral (STAR method), system design, live coding challenges, and HR rounds. You can also configure custom domains." },
  { q: "How accurate is the evaluation?", a: "We evaluate across 9 dimensions including technical accuracy, problem solving, communication, and depth. Our scoring model is calibrated against real interview outcomes from thousands of users." },
  { q: "Can I upload my resume?", a: "Yes! Upload your resume and the AI will tailor questions based on your experience, skills, and projects. It creates a personalized interview experience that mirrors what a recruiter would ask about your background." },
  { q: "Does it support voice interaction?", a: "Absolutely. Toggle voice mode to speak your answers naturally and hear questions read aloud. We use the Web Speech API for browser-native voice recognition and text-to-speech." },
];

function FAQItem({ faq, index }: { faq: typeof FAQS[number]; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.08 }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-start justify-between gap-4 py-5 text-left group">
        <span className={`text-base font-medium transition-colors ${open ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"}`}>{faq.q}</span>
        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-all ${open ? "gradient-primary text-white rotate-0" : "bg-muted text-muted-foreground"}`}>
          {open ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </div>
      </button>
      <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
        <p className="pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
      </motion.div>
      <div className="border-b border-border" />
    </motion.div>
  );
}

export function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="faq" className="relative py-28 px-6">
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-indigo/5 rounded-full blur-[100px]" />
      <div className="relative z-10 mx-auto max-w-3xl">
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-indigo/20 text-xs font-medium text-indigo-light mb-6">FAQ</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">Frequently Asked <span className="gradient-text">Questions</span></h2>
        </motion.div>
        <div className="glass rounded-2xl p-6 md:p-8">
          {FAQS.map((faq, i) => <FAQItem key={i} faq={faq} index={i} />)}
        </div>
      </div>
    </section>
  );
}
