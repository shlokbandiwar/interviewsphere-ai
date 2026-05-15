"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowRight, ArrowLeft, Sparkles, Settings, Mic, Code2, Upload,
} from "lucide-react";
import { INTERVIEW_DOMAINS, DIFFICULTY_LEVELS, INTERVIEW_TYPES, INTERVIEW_MODES } from "@/lib/constants";
import { useInterviewStore } from "@/stores/interview-store";
import { useInterview } from "@/hooks/use-interview";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

const SETUP_STEPS = [
  { title: "Choose Domain", subtitle: "What area do you want to practice?", icon: Settings },
  { title: "Set Difficulty", subtitle: "How challenging should it be?", icon: Sparkles },
  { title: "Interview Type", subtitle: "What kind of interview?", icon: Settings },
  { title: "Interview Mode", subtitle: "How intense do you want it?", icon: Sparkles },
  { title: "Options", subtitle: "Voice, coding, and more", icon: Mic },
  { title: "Ready!", subtitle: "Review your setup", icon: Sparkles },
];

export default function InterviewSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const {
    config, setDomain, setDifficulty, setType, setMode, setCompany,
    setQuestionCount, setVoiceEnabled, setCodingEnabled,
  } = useInterviewStore();
  const { startInterview, isStarting } = useInterview();
  const [startError, setStartError] = useState("");

  const handleStartInterview = async () => {
    setStartError("");
    const session = await startInterview();
    if (session) {
      router.push("/interview/live");
    } else {
      setStartError("Could not start interview. Please try again.");
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-indigo/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-purple/5 rounded-full blur-[120px]" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <span className="text-sm text-muted-foreground">Step {step + 1} of {SETUP_STEPS.length}</span>
      </div>

      {/* Progress */}
      <div className="relative z-10 px-6 mb-8">
        <div className="mx-auto max-w-2xl">
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div className="h-full rounded-full gradient-primary" animate={{ width: `${((step + 1) / SETUP_STEPS.length) * 100}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 pb-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>

              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{SETUP_STEPS[step].title}</h2>
                <p className="text-muted-foreground">{SETUP_STEPS[step].subtitle}</p>
              </div>

              <div className="glass rounded-2xl p-6 md:p-8">
                {/* Step 0: Domain */}
                {step === 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {INTERVIEW_DOMAINS.map((d) => (
                      <button key={d.value} onClick={() => setDomain(d.value)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl text-sm font-medium transition-all ${
                          config.domain === d.value ? "gradient-primary text-white shadow-lg" : "glass glass-hover text-muted-foreground"
                        }`}>
                        <div className="h-3 w-3 rounded-full" style={{ background: d.color }} />
                        {d.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 1: Difficulty */}
                {step === 1 && (
                  <div className="space-y-3">
                    {DIFFICULTY_LEVELS.map((d) => (
                      <button key={d.value} onClick={() => setDifficulty(d.value)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                          config.difficulty === d.value ? "gradient-primary text-white shadow-lg" : "glass glass-hover"
                        }`}>
                        <div className="h-4 w-4 rounded-full" style={{ background: d.color }} />
                        <div className="text-left flex-1">
                          <p className="font-medium">{d.label}</p>
                          <p className={`text-xs ${config.difficulty === d.value ? "text-white/70" : "text-muted-foreground"}`}>
                            {d.value === "beginner" ? "Fundamental concepts and basics" :
                             d.value === "intermediate" ? "Real-world scenarios and depth" :
                             "Expert-level challenges and edge cases"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 2: Type */}
                {step === 2 && (
                  <div className="space-y-3">
                    {INTERVIEW_TYPES.map((t) => (
                      <button key={t.value} onClick={() => setType(t.value)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                          config.type === t.value ? "gradient-primary text-white shadow-lg" : "glass glass-hover"
                        }`}>
                        <div className="text-left flex-1">
                          <p className="font-medium">{t.label}</p>
                          <p className={`text-xs ${config.type === t.value ? "text-white/70" : "text-muted-foreground"}`}>{t.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 3: Mode */}
                {step === 3 && (
                  <div className="space-y-3">
                    {INTERVIEW_MODES.map((m) => (
                      <button key={m.value} onClick={() => setMode(m.value)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                          config.mode === m.value ? "gradient-primary text-white shadow-lg" : "glass glass-hover"
                        }`}>
                        <div className="text-left flex-1">
                          <p className="font-medium">{m.label}</p>
                          <p className={`text-xs ${config.mode === m.value ? "text-white/70" : "text-muted-foreground"}`}>{m.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 4: Options */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Target Company (optional)</label>
                      <Input placeholder="e.g. Google, Meta, Amazon" value={config.company || ""}
                        onChange={(e) => setCompany(e.target.value)} className="h-11 rounded-xl bg-muted/50 border-border" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Number of Questions: {config.questionCount}</label>
                      <Slider
                        value={[config.questionCount]}
                        onValueChange={(value) => {
                          const next = Array.isArray(value) ? value[0] : value;
                          if (typeof next === "number") setQuestionCount(next);
                        }}
                        min={5}
                        max={25}
                        step={1}
                        className="mt-3"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl glass">
                      <div className="flex items-center gap-3">
                        <Mic className="h-5 w-5 text-indigo-light" />
                        <div><p className="text-sm font-medium">Voice Mode</p><p className="text-xs text-muted-foreground">Speak your answers</p></div>
                      </div>
                      <Switch checked={config.voiceEnabled} onCheckedChange={setVoiceEnabled} />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl glass">
                      <div className="flex items-center gap-3">
                        <Code2 className="h-5 w-5 text-purple-light" />
                        <div><p className="text-sm font-medium">Coding Mode</p><p className="text-xs text-muted-foreground">Include coding challenges</p></div>
                      </div>
                      <Switch checked={config.codingEnabled} onCheckedChange={setCodingEnabled} />
                    </div>
                  </div>
                )}

                {/* Step 5: Review */}
                {step === 5 && (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">🎯</div>
                      <h3 className="text-lg font-bold">Ready to go!</h3>
                    </div>
                    {[
                      ["Domain", INTERVIEW_DOMAINS.find(d => d.value === config.domain)?.label || config.domain],
                      ["Difficulty", config.difficulty],
                      ["Type", config.type],
                      ["Mode", config.mode],
                      ["Questions", String(config.questionCount)],
                      ["Company", config.company || "Any"],
                      ["Voice", config.voiceEnabled ? "On" : "Off"],
                      ["Coding", config.codingEnabled ? "On" : "Off"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between py-2 border-b border-border last:border-0">
                        <span className="text-sm text-muted-foreground">{label}</span>
                        <span className="text-sm font-medium capitalize">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav */}
          <div className="flex items-center justify-between mt-6">
            <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {step < 5 ? (
              <button onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold shadow-lg shadow-indigo/25 hover:scale-[1.02] transition-all">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <>
                {startError && (
                  <p className="text-sm text-destructive text-center mb-3">{startError}</p>
                )}
                <button onClick={handleStartInterview} disabled={isStarting}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl gradient-primary text-white font-semibold shadow-lg shadow-indigo/25 hover:shadow-indigo/40 hover:scale-[1.02] transition-all text-base disabled:opacity-50">
                  {isStarting ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Start Interview <ArrowRight className="h-5 w-5" /></>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
