"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Send, Mic, MicOff, Phone, Volume2, VolumeX,
  Brain, Clock, BarChart3, ChevronRight, Sparkles,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useInterview } from "@/hooks/use-interview";
import { useInterviewStore } from "@/stores/interview-store";
import { INTERVIEW_DOMAINS } from "@/lib/constants";
import type { InterviewMessage } from "@/types";

export default function LiveInterviewPage() {
  const router = useRouter();
  const { config, session, isTyping, isSubmitting, sendAnswer, endInterview } = useInterview();
  const [input, setInput] = useState("");
  const [voiceOn, setVoiceOn] = useState(config.voiceEnabled);
  const [soundOn, setSoundOn] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [isEnding, setIsEnding] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHydrated(useInterviewStore.persist.hasHydrated());
    const unsub = useInterviewStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!session) {
      router.replace("/interview/setup");
    }
  }, [hydrated, session, router]);

  useEffect(() => {
    setVoiceOn(config.voiceEnabled);
  }, [config.voiceEnabled]);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const messages = session?.messages.filter(
    (m) => m.role === "interviewer" || m.role === "candidate"
  ) ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const domainLabel = INTERVIEW_DOMAINS.find((d) => d.value === config.domain)?.label || config.domain;
  const questionNum = Math.min(
    (session?.currentQuestionIndex ?? 0) + 1,
    session?.totalQuestions ?? config.questionCount
  );

  const handleSend = async () => {
    if (!input.trim() || isSubmitting || isTyping) return;
    const content = input.trim();
    setInput("");
    await sendAnswer(content);
  };

  const handleEndInterview = async () => {
    if (isEnding || !session) return;
    setIsEnding(true);
    const result = await endInterview();
    if (result) {
      router.push(`/feedback/${session.id}`);
    } else {
      setIsEnding(false);
    }
  };

  if (!hydrated || !session) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-2 border-indigo/30 border-t-indigo rounded-full animate-spin" />
      </div>
    );
  }

  const topicsCovered = session.memoryContext.topicsCovered;
  const performanceTrend = session.memoryContext.performanceTrend;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
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
            <span className="text-muted-foreground">Q{questionNum}/{session.totalQuestions}</span>
          </div>
          <button
            onClick={handleEndInterview}
            disabled={isEnding}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors disabled:opacity-50"
          >
            <Phone className="h-4 w-4 rotate-[135deg]" /> {isEnding ? "Ending..." : "End"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg: InterviewMessage) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === "candidate" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`h-8 w-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                      msg.role === "interviewer" ? "gradient-primary text-white" : "bg-electric/20 text-electric"
                    }`}
                  >
                    {msg.role === "interviewer" ? <Brain className="h-4 w-4" /> : "Y"}
                  </div>

                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      msg.role === "interviewer" ? "glass" : "gradient-primary text-white"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    {msg.metadata && (
                      <div
                        className={`flex items-center gap-2 mt-2 text-[10px] ${
                          msg.role === "interviewer" ? "text-muted-foreground" : "text-white/60"
                        }`}
                      >
                        {msg.metadata.isFollowUp && (
                          <span className="px-1.5 py-0.5 rounded bg-purple/20 text-purple-light">Follow-up</span>
                        )}
                        <span>{msg.metadata.topic}</span>
                        <span>•</span>
                        <span className="capitalize">{msg.metadata.source.replace("_", " ")}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <div className="glass rounded-2xl px-4 py-3 flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="h-2 w-2 rounded-full bg-indigo-light"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 md:px-6 py-4 border-t border-border glass-strong">
            <motion.div className="flex items-end gap-3">
              <button
                type="button"
                onClick={() => setVoiceOn(!voiceOn)}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all ${
                  voiceOn ? "gradient-primary text-white animate-mic-pulse" : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {voiceOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </button>

              <div className="flex-1 relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void handleSend();
                    }
                  }}
                  placeholder="Type your answer..."
                  disabled={isSubmitting || isTyping}
                  className="min-h-[44px] max-h-32 rounded-xl bg-muted/50 border-border resize-none pr-12"
                  rows={1}
                />
                <button
                  type="button"
                  onClick={() => void handleSend()}
                  disabled={!input.trim() || isSubmitting || isTyping}
                  className="absolute right-2 bottom-2 h-8 w-8 rounded-lg gradient-primary flex items-center justify-center text-white disabled:opacity-30 transition-opacity"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSoundOn(!soundOn)}
                className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl glass text-muted-foreground hover:text-foreground transition-colors"
              >
                {soundOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </button>
            </motion.div>
          </div>
        </div>

        <div className="hidden xl:flex w-80 flex-col border-l border-border glass p-4 space-y-4 overflow-y-auto">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-light" /> Interview Intelligence
          </h3>

          <div className="glass rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2">Topics Covered</p>
            <div className="flex flex-wrap gap-1.5">
              {(topicsCovered.length > 0 ? topicsCovered : [config.domain]).map((t) => (
                <span key={t} className="px-2 py-1 text-[10px] rounded-lg bg-indigo/10 text-indigo-light font-medium capitalize">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2">Performance Trend</p>
            <div className="flex items-end gap-1 h-16">
              {(performanceTrend.length > 0 ? performanceTrend : [65, 72, 68]).map((v, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t-sm gradient-primary"
                  initial={{ height: 0 }}
                  animate={{ height: `${v}%` }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2">Tips</p>
            <ul className="space-y-2 text-xs text-foreground/80">
              <li className="flex gap-2">
                <ChevronRight className="h-3 w-3 shrink-0 mt-0.5 text-success" />
                Provide concrete code examples
              </li>
              <li className="flex gap-2">
                <ChevronRight className="h-3 w-3 shrink-0 mt-0.5 text-success" />
                Mention time/space complexity
              </li>
              <li className="flex gap-2">
                <ChevronRight className="h-3 w-3 shrink-0 mt-0.5 text-warning" />
                Structure answers with intro → detail → summary
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
