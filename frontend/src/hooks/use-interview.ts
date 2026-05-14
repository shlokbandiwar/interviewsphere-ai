"use client";

import { useCallback, useState } from "react";
import { useInterviewStore } from "@/stores/interview-store";
import { apiClient } from "@/lib/api-client";
import { trackEvent } from "@/lib/analytics";
import type { InterviewSession, InterviewMessage, EvaluationResult } from "@/types";

export function useInterview() {
  const store = useInterviewStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const startInterview = useCallback(async () => {
    const res = await apiClient.post<InterviewSession>("/interview/start", store.config);
    if (res.success && res.data) {
      store.setSession(res.data);
      trackEvent("interview_started", {
        domain: store.config.domain,
        difficulty: store.config.difficulty,
        type: store.config.type,
        mode: store.config.mode,
      });
      return res.data;
    }
    return null;
  }, [store]);

  const sendAnswer = useCallback(
    async (content: string) => {
      if (!store.session || isSubmitting) return null;
      setIsSubmitting(true);

      // Add user message immediately
      const userMessage: InterviewMessage = {
        id: crypto.randomUUID(),
        role: "candidate",
        content,
        timestamp: new Date().toISOString(),
      };
      store.addMessage(userMessage);
      store.setIsTyping(true);

      trackEvent("question_answered", {
        sessionId: store.session.id,
        questionIndex: store.session.currentQuestionIndex,
      });

      const res = await apiClient.post<{
        message: InterviewMessage;
        session: InterviewSession;
      }>(`/interview/${store.session.id}/answer`, { content });

      store.setIsTyping(false);
      setIsSubmitting(false);

      if (res.success && res.data) {
        store.addMessage(res.data.message);
        store.setSession(res.data.session);
        return res.data.message;
      }
      return null;
    },
    [store, isSubmitting]
  );

  const endInterview = useCallback(async () => {
    if (!store.session) return null;

    const res = await apiClient.post<EvaluationResult>(
      `/interview/${store.session.id}/end`
    );

    if (res.success && res.data) {
      trackEvent("interview_completed", {
        sessionId: store.session.id,
        score: res.data.overallScore,
      });
      setEvaluation(res.data);
      return res.data;
    }
    return null;
  }, [store]);

  const abandonInterview = useCallback(async () => {
    if (!store.session) return;
    await apiClient.post(`/interview/${store.session.id}/abandon`);
    trackEvent("interview_abandoned", { sessionId: store.session.id });
    store.clearSession();
  }, [store]);

  return {
    config: store.config,
    session: store.session,
    isTyping: store.isTyping,
    isSubmitting,
    evaluation,
    startInterview,
    sendAnswer,
    endInterview,
    abandonInterview,
  };
}
