import type {
  InterviewConfig,
  InterviewSession,
  InterviewMessage,
  EvaluationResult,
  InterviewDomain,
} from "@/types";

const PLACEHOLDER_QUESTIONS: Partial<Record<InterviewDomain, string[]>> = {
  frontend: [
    "Can you explain closures in JavaScript and give a practical example?",
    "How does the event loop work in the browser?",
    "What strategies do you use to optimize React rendering performance?",
  ],
  backend: [
    "How would you design a REST API for a high-traffic service?",
    "Explain database indexing and when it helps or hurts performance.",
    "How do you handle authentication and authorization in microservices?",
  ],
  "system-design": [
    "Design a URL shortener that handles 10k requests per second.",
    "How would you scale a real-time notification system?",
    "Walk through tradeoffs between SQL and NoSQL for an analytics platform.",
  ],
  behavioral: [
    "Tell me about a time you disagreed with a teammate. How did you resolve it?",
    "Describe a project where you had to meet a tight deadline.",
    "Give an example of when you received critical feedback and what you did next.",
  ],
};

const DEFAULT_QUESTIONS = [
  "Walk me through a challenging technical problem you solved recently.",
  "How do you approach learning a new technology under time pressure?",
  "What tradeoffs would you consider when designing for scale?",
];

function pickQuestion(config: InterviewConfig, index: number): string {
  const pool = PLACEHOLDER_QUESTIONS[config.domain] ?? DEFAULT_QUESTIONS;
  return pool[index % pool.length];
}

function emptyMemoryContext(): InterviewSession["memoryContext"] {
  return {
    topicsCovered: [],
    questionsAsked: [],
    performanceTrend: [],
    weakAreas: [],
    strongAreas: [],
    conversationHistory: [],
  };
}

export function createPlaceholderSession(config: InterviewConfig): InterviewSession {
  const welcome: InterviewMessage = {
    id: crypto.randomUUID(),
    role: "interviewer",
    content: `Welcome! I'm your AI interviewer today. We'll run a ${config.difficulty} ${config.type} session in ${config.mode} mode. Ready when you are.`,
    timestamp: new Date().toISOString(),
  };

  const firstQuestion: InterviewMessage = {
    id: crypto.randomUUID(),
    role: "interviewer",
    content: pickQuestion(config, 0),
    timestamp: new Date().toISOString(),
    metadata: {
      isFollowUp: false,
      difficulty: config.difficulty,
      topic: config.domain,
      domain: config.domain,
      source: "dataset",
    },
  };

  return {
    id: crypto.randomUUID(),
    userId: "local-user",
    config,
    status: "active",
    startedAt: new Date().toISOString(),
    messages: [welcome, firstQuestion],
    currentQuestionIndex: 0,
    totalQuestions: config.questionCount,
    memoryContext: emptyMemoryContext(),
  };
}

export function createPlaceholderAnswer(
  session: InterviewSession,
  _candidateContent: string
): { message: InterviewMessage; session: InterviewSession } {
  const nextIndex = session.currentQuestionIndex + 1;
  const isFollowUp = nextIndex % 2 === 0;
  const topic = session.config.domain;

  const message: InterviewMessage = {
    id: crypto.randomUUID(),
    role: "interviewer",
    content: isFollowUp
      ? "Thanks for that answer. Can you go deeper on edge cases and how you would validate your approach in production?"
      : pickQuestion(session.config, nextIndex),
    timestamp: new Date().toISOString(),
    metadata: {
      isFollowUp,
      difficulty: session.config.difficulty,
      topic,
      domain: session.config.domain,
      source: "ai_generated",
    },
  };

  const topicsCovered = message.metadata?.topic
    ? [...new Set([...session.memoryContext.topicsCovered, message.metadata.topic])]
    : session.memoryContext.topicsCovered;

  const trendScore = 65 + Math.floor(Math.random() * 25);
  const updatedSession: InterviewSession = {
    ...session,
    currentQuestionIndex: nextIndex,
    messages: [...session.messages, message],
    memoryContext: {
      ...session.memoryContext,
      topicsCovered,
      performanceTrend: [...session.memoryContext.performanceTrend, trendScore],
      conversationHistory: [
        ...session.memoryContext.conversationHistory,
        { role: message.role, content: message.content },
      ],
    },
  };

  return { message, session: updatedSession };
}

export function createPlaceholderEvaluation(session: InterviewSession): EvaluationResult {
  const trend = session.memoryContext.performanceTrend;
  const avgTrend = trend.length
    ? Math.round(trend.reduce((a, b) => a + b, 0) / trend.length)
    : 78;

  const dim = (score: number, weight: number, feedback: string) => ({
    score,
    weight,
    feedback,
  });

  return {
    sessionId: session.id,
    overallScore: Math.min(95, avgTrend + 5),
    dimensions: {
      technicalAccuracy: dim(avgTrend, 0.3, "Solid technical foundation with room to deepen edge-case coverage."),
      problemSolving: dim(avgTrend - 4, 0.2, "Structured approach; could articulate tradeoffs more explicitly."),
      communication: dim(avgTrend + 6, 0.15, "Clear and concise explanations with good examples."),
      depth: dim(avgTrend - 8, 0.15, "Good breadth; push further on implementation details."),
      confidence: dim(avgTrend + 2, 0.1, "Confident delivery with occasional hesitation on follow-ups."),
      structure: dim(avgTrend, 0.1, "Answers were organized; use frameworks like STAR more consistently."),
      creativity: dim(avgTrend - 10, 0, ""),
      edgeCases: dim(avgTrend - 12, 0, ""),
      codeQuality: dim(avgTrend - 6, 0, ""),
    },
    feedback: "Strong session overall. Keep practicing follow-up depth and structured responses.",
    strengths: [
      "Clear communication of complex concepts",
      "Good use of practical examples",
      "Strong fundamental understanding",
    ],
    improvements: [
      "Dive deeper into edge cases and error handling",
      "Discuss time/space complexity more consistently",
      "Provide more structured responses using frameworks",
    ],
    roadmap: [
      { area: `Advanced ${session.config.domain}`, priority: "high", suggestion: "Practice harder follow-up questions" },
      { area: "System Design Patterns", priority: "medium", suggestion: "Study scalability and reliability tradeoffs" },
      { area: "Communication", priority: "low", suggestion: "Use intro → detail → summary for each answer" },
    ],
  };
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
