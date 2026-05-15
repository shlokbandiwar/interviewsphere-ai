import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  InterviewConfig,
  InterviewSession,
  InterviewMessage,
  InterviewDomain,
  InterviewDifficulty,
  InterviewType,
  InterviewMode,
  EvaluationResult,
} from "@/types";

interface InterviewState {
  config: InterviewConfig;
  setupStep: number;
  session: InterviewSession | null;
  evaluation: EvaluationResult | null;
  isTyping: boolean;
  isListening: boolean;
  isSpeaking: boolean;

  setDomain: (domain: InterviewDomain) => void;
  setDifficulty: (difficulty: InterviewDifficulty) => void;
  setType: (type: InterviewType) => void;
  setMode: (mode: InterviewMode) => void;
  setCompany: (company: string) => void;
  setQuestionCount: (count: number) => void;
  setTimeLimit: (limit: number | undefined) => void;
  setResumeId: (resumeId: string | undefined) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  setCodingEnabled: (enabled: boolean) => void;
  setSetupStep: (step: number) => void;
  resetConfig: () => void;

  setSession: (session: InterviewSession | null) => void;
  addMessage: (message: InterviewMessage) => void;
  setEvaluation: (evaluation: EvaluationResult | null) => void;
  setIsTyping: (isTyping: boolean) => void;
  setIsListening: (isListening: boolean) => void;
  setIsSpeaking: (isSpeaking: boolean) => void;
  clearSession: () => void;
}

const defaultConfig: InterviewConfig = {
  domain: "frontend",
  difficulty: "intermediate",
  type: "technical",
  mode: "standard",
  questionCount: 10,
  voiceEnabled: false,
  codingEnabled: false,
};

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set) => ({
      config: { ...defaultConfig },
      setupStep: 0,
      session: null,
      evaluation: null,
      isTyping: false,
      isListening: false,
      isSpeaking: false,

      setDomain: (domain) => set((s) => ({ config: { ...s.config, domain } })),
      setDifficulty: (difficulty) => set((s) => ({ config: { ...s.config, difficulty } })),
      setType: (type) => set((s) => ({ config: { ...s.config, type } })),
      setMode: (mode) => set((s) => ({ config: { ...s.config, mode } })),
      setCompany: (company) => set((s) => ({ config: { ...s.config, company } })),
      setQuestionCount: (questionCount) => set((s) => ({ config: { ...s.config, questionCount } })),
      setTimeLimit: (timeLimit) => set((s) => ({ config: { ...s.config, timeLimit } })),
      setResumeId: (resumeId) => set((s) => ({ config: { ...s.config, resumeId } })),
      setVoiceEnabled: (voiceEnabled) => set((s) => ({ config: { ...s.config, voiceEnabled } })),
      setCodingEnabled: (codingEnabled) => set((s) => ({ config: { ...s.config, codingEnabled } })),
      setSetupStep: (setupStep) => set({ setupStep }),
      resetConfig: () => set({ config: { ...defaultConfig }, setupStep: 0 }),

      setSession: (session) => set({ session }),
      addMessage: (message) =>
        set((s) => ({
          session: s.session
            ? { ...s.session, messages: [...s.session.messages, message] }
            : null,
        })),
      setEvaluation: (evaluation) => set({ evaluation }),
      setIsTyping: (isTyping) => set({ isTyping }),
      setIsListening: (isListening) => set({ isListening }),
      setIsSpeaking: (isSpeaking) => set({ isSpeaking }),
      clearSession: () =>
        set({
          session: null,
          evaluation: null,
          isTyping: false,
          isListening: false,
          isSpeaking: false,
        }),
    }),
    {
      name: "interviewsphere-interview",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        config: state.config,
        session: state.session,
        evaluation: state.evaluation,
      }),
    }
  )
);
