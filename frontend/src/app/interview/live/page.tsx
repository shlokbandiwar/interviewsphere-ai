"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Send, Mic, MicOff, Phone, Volume2, VolumeX,
  Brain, Clock, BarChart3, ChevronRight, Sparkles,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useInterviewStore } from "@/stores/interview-store";
import { INTERVIEW_DOMAINS } from "@/lib/constants";

// Mock messages for demo
const MOCK_MESSAGES = [
  {
    id: "1", role: "interviewer" as const, content: "Welcome! I'm your AI interviewer today. Let's begin with your chosen domain. Are you ready?",
    timestamp: new Date().toISOString(),
  },
  {
    id: "2", role: "interviewer" as const,
    content: "Great! Let's start. Can you explain the concept of closures in JavaScript and give a practical example of when you would use one?",
    timestamp: new Date().toISOString(),
    metadata: { isFollowUp: false, difficulty: "intermediate" as const, topic: "Closures", domain: "frontend", source: "dataset" as const },
  },
];

export default function LiveInterviewPage() {
  const router = useRouter();
  const { config } = useInterviewStore();
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [voiceOn, setVoiceOn] = useState(config.voiceEnabled);
  const [soundOn, setSoundOn] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [questionNum, setQuestionNum] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const domainLabel = INTERVIEW_DOMAINS.find(d => d.value === config.domain)?.label || config.domain;

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: crypto.randomUUID(), role: "candidate" as const, content: input, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      setQuestionNum((n) => n + 1);
      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(),
        role: "interviewer" as const,
        content: "That's a solid explanation! You covered the basics well. As a follow-up — how would closures interact with asynchronous operations like setTimeout in a loop? What common pitfall might arise?",
        timestamp: new Date().toISOString(),
        metadata: { isFollowUp: true, difficulty: "intermediate" as const, topic: "Closures", domain: "frontend", source: "ai_generated" as const },
      }]);
    }, 2000 + Math.random() * 1500);
  };

  const endInterview = () => {
    router.push("/feedback/demo");
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border glass-strong">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold">{domainLabel} Interview</p>
            <p className="text-xs text-muted-foreground capitalize">{config.difficulty} • {config.mode} mode</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono text-muted-foreground">{formatTime(elapsed)}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Q{questionNum}/{config.questionCount}</span>
          </div>
          <button onClick={endInterview}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors">
            <Phone className="h-4 w-4 rotate-[135deg]" /> End
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === "candidate" ? "flex-row-reverse" : ""}`}>
                  {/* Avatar */}
                  <div className={`h-8 w-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                    msg.role === "interviewer" ? "gradient-primary text-white" : "bg-electric/20 text-electric"
                  }`}>
                    {msg.role === "interviewer" ? <Brain className="h-4 w-4" /> : "Y"}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    msg.role === "interviewer"
                      ? "glass"
                      : "gradient-primary text-white"
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    {msg.metadata && (
                      <div className={`flex items-center gap-2 mt-2 text-[10px] ${
                        msg.role === "interviewer" ? "text-muted-foreground" : "text-white/60"
                      }`}>
                        {msg.metadata.isFollowUp && <span className="px-1.5 py-0.5 rounded bg-purple/20 text-purple-light">Follow-up</span>}
                        <span>{msg.metadata.topic}</span>
                        <span>•</span>
                        <span className="capitalize">{msg.metadata.source.replace("_", " ")}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <div className="glass rounded-2xl px-4 py-3 flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} className="h-2 w-2 rounded-full bg-indigo-light"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 md:px-6 py-4 border-t border-border glass-strong">
            <div className="flex items-end gap-3">
              {/* Voice toggle */}
              <button onClick={() => setVoiceOn(!voiceOn)}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all ${
                  voiceOn ? "gradient-primary text-white animate-mic-pulse" : "glass text-muted-foreground hover:text-foreground"
                }`}>
                {voiceOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </button>

              {/* Text input */}
              <div className="flex-1 relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Type your answer..."
                  className="min-h-[44px] max-h-32 rounded-xl bg-muted/50 border-border resize-none pr-12"
                  rows={1}
                />
                <button onClick={handleSend} disabled={!input.trim()}
                  className="absolute right-2 bottom-2 h-8 w-8 rounded-lg gradient-primary flex items-center justify-center text-white disabled:opacity-30 transition-opacity">
                  <Send className="h-4 w-4" />
                </button>
              </div>

              {/* Sound toggle */}
              <button onClick={() => setSoundOn(!soundOn)}
                className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl glass text-muted-foreground hover:text-foreground transition-colors">
                {soundOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Intelligence Panel (desktop only) */}
        <div className="hidden xl:flex w-80 flex-col border-l border-border glass p-4 space-y-4 overflow-y-auto">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-light" /> Interview Intelligence
          </h3>

          <div className="glass rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2">Topics Covered</p>
            <div className="flex flex-wrap gap-1.5">
              {["Closures", "Scope", "Event Loop"].map((t) => (
                <span key={t} className="px-2 py-1 text-[10px] rounded-lg bg-indigo/10 text-indigo-light font-medium">{t}</span>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2">Performance Trend</p>
            <div className="flex items-end gap-1 h-16">
              {[65, 72, 68, 85, 78, 82, 87].map((v, i) => (
                <motion.div key={i} className="flex-1 rounded-t-sm gradient-primary"
                  initial={{ height: 0 }} animate={{ height: `${v}%` }}
                  transition={{ duration: 0.5, delay: i * 0.1 }} />
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2">Tips</p>
            <ul className="space-y-2 text-xs text-foreground/80">
              <li className="flex gap-2"><ChevronRight className="h-3 w-3 shrink-0 mt-0.5 text-success" />Provide concrete code examples</li>
              <li className="flex gap-2"><ChevronRight className="h-3 w-3 shrink-0 mt-0.5 text-success" />Mention time/space complexity</li>
              <li className="flex gap-2"><ChevronRight className="h-3 w-3 shrink-0 mt-0.5 text-warning" />Structure answers with intro → detail → summary</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
