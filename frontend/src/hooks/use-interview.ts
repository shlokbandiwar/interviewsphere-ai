"use client";

import { useCallback, useState } from "react";
import { useInterviewStore } from "@/stores/interview-store";
import { apiClient } from "@/lib/api-client";
import { trackEvent } from "@/lib/analytics";
import {
  createPlaceholderSession,
  createPlaceholderAnswer,
  createPlaceholderEvaluation,
  delay,
} from "@/lib/interview-placeholder";
import type { InterviewSession, InterviewMessage, EvaluationResult } from "@/types";

export function useInterview() {
  const config = useInterviewStore((s) => s.config);
  const session = useInterviewStore((s) => s.session);
  const evaluation = useInterviewStore((s) => s.evaluation);
  const isTyping = useInterviewStore((s) => s.isTyping);
  const setSession = useInterviewStore((s) => s.setSession);
  const addMessage = useInterviewStore((s) => s.addMessage);
  const setEvaluation = useInterviewStore((s) => s.setEvaluation);
  const setIsTyping = useInterviewStore((s) => s.setIsTyping);
  const clearSession = useInterviewStore((s) => s.clearSession);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const startInterview = useCallback(async () => {
    setIsStarting(true);
    setEvaluation(null);

    const res = await apiClient.post<InterviewSession>("/interview/start", config);

    if (res.success && res.data) {
      setSession(res.data);
      trackEvent("interview_started", {
        domain: config.domain,
        difficulty: config.difficulty,
        type: config.type,
        mode: config.mode,
      });
      setIsStarting(false);
      return res.data;
    }

    const placeholderSession = createPlaceholderSession(config);
    setSession(placeholderSession);
    trackEvent("interview_started", {
      domain: config.domain,
      difficulty: config.difficulty,
      type: config.type,
      mode: config.mode,
    });
    setIsStarting(false);
    return placeholderSession;
  }, [config, setSession, setEvaluation]);

  const sendAnswer = useCallback(
    async (content: string) => {
      const currentSession = useInterviewStore.getState().session;
      if (!currentSession || isSubmitting) return null;

      setIsSubmitting(true);

      const userMessage: InterviewMessage = {
        id: crypto.randomUUID(),
        role: "candidate",
        content,
        timestamp: new Date().toISOString(),
      };
      addMessage(userMessage);
      setIsTyping(true);

      trackEvent("question_answered", {
        sessionId: currentSession.id,
        questionIndex: currentSession.currentQuestionIndex,
      });

      const res = await apiClient.post<{
        message: InterviewMessage;
        session: InterviewSession;
      }>(`/interview/${currentSession.id}/answer`, { content });

      if (res.success && res.data) {
        setSession(res.data.session);
        setIsTyping(false);
        setIsSubmitting(false);
        return res.data.message;
      }

      await delay(1200 + Math.random() * 800);
      const placeholder = createPlaceholderAnswer(
        useInterviewStore.getState().session!,
        content
      );
      setSession(placeholder.session);
      setIsTyping(false);
      setIsSubmitting(false);
      return placeholder.message;
    },
    [isSubmitting, addMessage, setSession, setIsTyping]
  );

  const endInterview = useCallback(async () => {
    const currentSession = useInterviewStore.getState().session;
    if (!currentSession) return null;

    setIsTyping(true);

    const res = await apiClient.post<EvaluationResult>(
      `/interview/${currentSession.id}/end`
    );

    if (res.success && res.data) {
      const completedSession: InterviewSession = {
        ...currentSession,
        status: "completed",
        completedAt: new Date().toISOString(),
      };
      setSession(completedSession);
      setEvaluation(res.data);
      setIsTyping(false);
      trackEvent("interview_completed", {
        sessionId: currentSession.id,
        score: res.data.overallScore,
      });
      return res.data;
    }

    const placeholderEval = createPlaceholderEvaluation(currentSession);
    const completedSession: InterviewSession = {
      ...currentSession,
      status: "completed",
      completedAt: new Date().toISOString(),
    };
    setSession(completedSession);
    setEvaluation(placeholderEval);
    setIsTyping(false);
    trackEvent("interview_completed", {
      sessionId: currentSession.id,
      score: placeholderEval.overallScore,
    });
    return placeholderEval;
  }, [setSession, setEvaluation, setIsTyping]);

  const abandonInterview = useCallback(async () => {
    const currentSession = useInterviewStore.getState().session;
    if (!currentSession) return;
    await apiClient.post(`/interview/${currentSession.id}/abandon`);
    trackEvent("interview_abandoned", { sessionId: currentSession.id });
    clearSession();
  }, [clearSession]);

  return {
    config,
    session,
    evaluation,
    isTyping,
    isSubmitting,
    isStarting,
    startInterview,
    sendAnswer,
    endInterview,
    abandonInterview,
  };
}
