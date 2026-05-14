"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Sparkles, Target, AlertTriangle, Building2, Rocket, ArrowRight, ArrowLeft, Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { INTERVIEW_DOMAINS, DIFFICULTY_LEVELS, TOP_COMPANIES } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

const STEPS = [
  { title: "Your Goal", subtitle: "What are you preparing for?", icon: Target },
  { title: "Experience", subtitle: "Your current level", icon: Rocket },
  { title: "Weak Areas", subtitle: "Where do you need help?", icon: AlertTriangle },
  { title: "Target Companies", subtitle: "Where do you want to work?", icon: Building2 },
  { title: "Ready!", subtitle: "Your roadmap is set", icon: Sparkles },
];

const WEAK_AREAS = [
  "Data Structures", "Algorithms", "System Design", "Behavioral Questions",
  "Communication", "Time Management", "Problem Solving", "Code Quality",
  "Database Design", "API Design", "Cloud Architecture", "Testing",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    targetRole: "",
    experienceLevel: "junior" as string,
    domains: [] as string[],
    weakAreas: [] as string[],
    targetCompanies: [] as string[],
    weeklyGoal: 3,
  });

  const toggleItem = (arr: string[], item: string): string[] =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

  const canContinue = () => {
    if (step === 0) return data.targetRole.length > 0 && data.domains.length > 0;
    if (step === 1) return true;
    if (step === 2) return data.weakAreas.length > 0;
    if (step === 3) return true;
    return true;
  };

  const finish = () => {
    trackEvent("onboarding_completed", data);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col gradient-hero">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-indigo/6 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple/6 rounded-full blur-[120px]" />
      </div>

      {/* Progress */}
      <div className="relative z-10 mx-auto w-full max-w-2xl px-6 pt-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                i < step ? "gradient-primary text-white" : i === step ? "gradient-primary text-white scale-110" : "glass text-muted-foreground"
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`hidden sm:block w-12 md:w-20 h-0.5 rounded-full transition-colors ${i < step ? "gradient-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-center mb-8">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-lg mb-4">
                  {(() => { const Icon = STEPS[step].icon; return <Icon className="h-6 w-6 text-white" />; })()}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{STEPS[step].title}</h2>
                <p className="text-muted-foreground">{STEPS[step].subtitle}</p>
              </div>

              <div className="glass rounded-2xl p-6 md:p-8">
                {/* Step 0: Goal + Domains */}
                {step === 0 && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Target Role</label>
                      <Input placeholder="e.g. Senior Frontend Engineer" value={data.targetRole}
                        onChange={(e) => setData({ ...data, targetRole: e.target.value })}
                        className="h-11 rounded-xl bg-muted/50 border-border" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-3 block">Interview Domains</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {INTERVIEW_DOMAINS.filter(d => d.value !== "custom").map((d) => (
                          <button key={d.value} onClick={() => setData({ ...data, domains: toggleItem(data.domains, d.value) })}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              data.domains.includes(d.value) ? "gradient-primary text-white shadow-md" : "glass glass-hover text-muted-foreground"
                            }`}>
                            <div className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Experience */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-3 block">Experience Level</label>
                      <div className="space-y-2">
                        {[
                          { value: "fresher", label: "Fresher", desc: "0-1 years" },
                          { value: "junior", label: "Junior", desc: "1-3 years" },
                          { value: "mid", label: "Mid-Level", desc: "3-5 years" },
                          { value: "senior", label: "Senior", desc: "5-8 years" },
                          { value: "lead", label: "Lead / Staff", desc: "8+ years" },
                        ].map((level) => (
                          <button key={level.value} onClick={() => setData({ ...data, experienceLevel: level.value })}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
                              data.experienceLevel === level.value ? "gradient-primary text-white shadow-md" : "glass glass-hover"
                            }`}>
                            <span className="font-medium">{level.label}</span>
                            <span className={data.experienceLevel === level.value ? "text-white/70" : "text-muted-foreground"}>{level.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Weekly Interview Goal</label>
                      <div className="flex items-center gap-4">
                        {[1, 3, 5, 7].map((g) => (
                          <button key={g} onClick={() => setData({ ...data, weeklyGoal: g })}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              data.weeklyGoal === g ? "gradient-primary text-white" : "glass glass-hover text-muted-foreground"
                            }`}>{g}/wk</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Weak Areas */}
                {step === 2 && (
                  <div>
                    <label className="text-sm font-medium mb-3 block">Select your weak areas <span className="text-muted-foreground">(pick at least 1)</span></label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {WEAK_AREAS.map((area) => (
                        <button key={area} onClick={() => setData({ ...data, weakAreas: toggleItem(data.weakAreas, area) })}
                          className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            data.weakAreas.includes(area) ? "gradient-primary text-white shadow-md" : "glass glass-hover text-muted-foreground"
                          }`}>{area}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Companies */}
                {step === 3 && (
                  <div>
                    <label className="text-sm font-medium mb-3 block">Target Companies <span className="text-muted-foreground">(optional)</span></label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {TOP_COMPANIES.slice(0, 15).map((company) => (
                        <button key={company} onClick={() => setData({ ...data, targetCompanies: toggleItem(data.targetCompanies, company) })}
                          className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            data.targetCompanies.includes(company) ? "gradient-primary text-white shadow-md" : "glass glass-hover text-muted-foreground"
                          }`}>{company}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Summary */}
                {step === 4 && (
                  <div className="text-center py-4">
                    <div className="text-5xl mb-4">🚀</div>
                    <h3 className="text-xl font-bold mb-2">You&apos;re all set!</h3>
                    <p className="text-muted-foreground mb-6">Your personalized interview roadmap is ready.</p>
                    <div className="glass rounded-xl p-4 text-left space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Role:</span><span className="font-medium">{data.targetRole}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Level:</span><span className="font-medium capitalize">{data.experienceLevel}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Focus:</span><span className="font-medium">{data.weakAreas.length} areas</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Goal:</span><span className="font-medium">{data.weeklyGoal} interviews/week</span></div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {step < 4 ? (
              <button onClick={() => setStep(step + 1)} disabled={!canContinue()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold shadow-lg shadow-indigo/25 hover:scale-[1.02] transition-all disabled:opacity-50">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={finish}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold shadow-lg shadow-indigo/25 hover:scale-[1.02] transition-all">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
