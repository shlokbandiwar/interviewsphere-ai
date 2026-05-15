"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Send, Mic, MicOff, Phone, Volume2, VolumeX,
  Brain, Clock, BarChart3, ChevronRight, Sparkles, MessageSquare, Code2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useInterview } from "@/hooks/use-interview";
import { useVoice } from "@/hooks/use-voice";
import { useInterviewStore } from "@/stores/interview-store";
import { CodingPanel } from "@/components/interview/coding-panel";
import { INTERVIEW_DOMAINS } from "@/lib/constants";
import type { InterviewMessage } from "@/types";

type MobileView = "chat" | "code";

export default function LiveInterviewPage() {
  const router = useRouter();
  const { config, session, isTyping, isSubmitting, sendAnswer, endInterview } = useInterview();
  const setIsListening = useInterviewStore((s) => s.setIsListening);
  const setIsSpeaking = useInterviewStore((s) => s.setIsSpeaking);

  const [input, setInput] = useState("");
  const [voiceOn, setVoiceOn] = useState(config.voiceEnabled);
  const [soundOn, setSoundOn] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [isEnding, setIsEnding] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastSpokenIdRef = useRef<string | null>(null);

  const handleVoiceResult = useCallback((text: string) => {
    setInput((prev) => (prev.trim() ? `${prev.trim()} ${text}` : text));
  }, []);

  const voice = useVoice({ onResult: handleVoiceResult });

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
    setIsListening(voice.isListening);
    setIsSpeaking(voice.isSpeaking);
  }, [voice.isListening, voice.isSpeaking, setIsListening, setIsSpeaking]);

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

  useEffect(() => {
    if (!soundOn || !voiceOn || isTyping) return;
    const lastInterviewer = [...messages].reverse().find((m) => m.role === "interviewer");
    if (!lastInterviewer || lastInterviewer.id === lastSpokenIdRef.current) return;
    lastSpokenIdRef.current = lastInterviewer.id;
    voice.speak(lastInterviewer.content);
  }, [messages, soundOn, voiceOn, isTyping, voice]);

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
  const showCoding = config.codingEnabled;

  const handleSend = async () => {
    if (!input.trim() || isSubmitting || isTyping) return;
    const content = input.trim();
    setInput("");
    voice.cancelSpeech();
    await sendAnswer(content);
  };

  const handleMicClick = () => {
    if (!voiceOn) {
      setVoiceOn(true);
      return;
    }
    if (!voice.isSupported) return;
    if (voice.isListening) {
      voice.stopListening();
    } else {
      voice.startListening();
    }
  };

  const handleSoundToggle = () => {
    if (soundOn) voice.cancelSpeech();
    setSoundOn(!soundOn);
  };

  const handleEndInterview = async () => {
    if (isEnding || !session) return;
    voice.cancelSpeech();
    voice.stopListening();
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

  const chatPanel = (
    <div className="flex-1 flex flex-col min-w-0">
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
        <div className="flex items-end gap-3">
          <button
            type="button"
            onClick={handleMicClick}
            disabled={!voice.isSupported && voiceOn}
            title={
              !voice.isSupported
                ? "Speech recognition not supported in this browser"
                : voice.isListening
                  ? "Stop listening"
                  : "Start voice input"
            }
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all ${
              voiceOn && voice.isListening
                ? "gradient-primary text-white animate-mic-pulse"
                : voiceOn
                  ? "gradient-primary text-white"
                  : "glass text-muted-foreground hover:text-foreground"
            } disabled:opacity-40`}
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
              placeholder={voice.isListening ? "Listening..." : "Type your answer..."}
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
            onClick={handleSoundToggle}
            className={`hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
              soundOn ? "glass text-foreground" : "glass text-muted-foreground"
            }`}
          >
            {soundOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
        </div>
        {voice.isListening && voice.transcript && (
          <p className="text-xs text-muted-foreground mt-2 px-1 truncate">
            Heard: {voice.transcript}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border glass-strong">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold">{domainLabel} Interview</p>
            <p className="text-xs text-muted-foreground capitalize">
              {config.difficulty} • {config.mode} mode
              {voice.isSpeaking && " • Speaking"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showCoding && (
            <div className="flex lg:hidden rounded-xl glass p-0.5">
              <button
                type="button"
                onClick={() => setMobileView("chat")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium ${
                  mobileView === "chat" ? "gradient-primary text-white" : "text-muted-foreground"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" /> Chat
              </button>
              <button
                type="button"
                onClick={() => setMobileView("code")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium ${
                  mobileView === "code" ? "gradient-primary text-white" : "text-muted-foreground"
                }`}
              >
                <Code2 className="h-3.5 w-3.5" /> Code
              </button>
            </div>
          )}
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
        {showCoding ? (
          <>
            <div
              className={`flex flex-col min-w-0 ${
                mobileView === "code" ? "hidden lg:flex lg:flex-1" : "flex flex-1"
              } ${mobileView === "chat" ? "flex flex-1" : "hidden lg:flex lg:flex-1"}`}
            >
              {chatPanel}
            </div>
            <div
              className={`border-l border-border min-w-0 ${
                mobileView === "chat" ? "hidden lg:flex lg:w-[48%] xl:w-[52%]" : "flex flex-1 lg:flex-none lg:w-[48%] xl:w-[52%]"
              }`}
            >
              <CodingPanel className="h-full w-full" />
            </div>
          </>
        ) : (
          <>
            {chatPanel}
            <div className="hidden xl:flex w-80 flex-col border-l border-border glass p-4 space-y-4 overflow-y-auto">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-light" /> Interview Intelligence
              </h3>

              <div className="glass rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-2">Topics Covered</p>
                <div className="flex flex-wrap gap-1.5">
                  {(topicsCovered.length > 0 ? topicsCovered : [config.domain]).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 text-[10px] rounded-lg bg-indigo/10 text-indigo-light font-medium capitalize"
                    >
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
          </>
        )}
      </div>
    </div>
  );
}
