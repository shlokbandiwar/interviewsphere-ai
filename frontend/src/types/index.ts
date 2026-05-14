// ===== USER =====
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: "email" | "google";
  onboardingComplete: boolean;
  createdAt: string;
  profile: UserProfile;
  gamification: UserGamification;
}

export interface UserProfile {
  targetRole: string;
  experienceLevel: "fresher" | "junior" | "mid" | "senior" | "lead";
  targetCompanies: string[];
  weakAreas: string[];
  preferredDomains: string[];
  weeklyGoal: number; // interviews per week
}

export interface UserGamification {
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  badges: Badge[];
  totalInterviews: number;
  totalQuestions: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
}

// ===== INTERVIEW =====
export type InterviewDomain =
  | "frontend"
  | "backend"
  | "fullstack"
  | "data-science"
  | "devops"
  | "system-design"
  | "behavioral"
  | "hr"
  | "product"
  | "custom";

export type InterviewDifficulty = "beginner" | "intermediate" | "advanced";

export type InterviewType =
  | "technical"
  | "behavioral"
  | "system-design"
  | "coding"
  | "mixed";

export type InterviewMode = "standard" | "stress" | "practice" | "timed";

export interface InterviewConfig {
  domain: InterviewDomain;
  difficulty: InterviewDifficulty;
  type: InterviewType;
  mode: InterviewMode;
  company?: string;
  questionCount: number;
  timeLimit?: number; // minutes
  resumeId?: string;
  voiceEnabled: boolean;
  codingEnabled: boolean;
}

export interface InterviewSession {
  id: string;
  userId: string;
  config: InterviewConfig;
  status: "setup" | "active" | "paused" | "completed" | "abandoned";
  startedAt: string;
  completedAt?: string;
  messages: InterviewMessage[];
  currentQuestionIndex: number;
  totalQuestions: number;
  memoryContext: MemoryContext;
}

export interface InterviewMessage {
  id: string;
  role: "interviewer" | "candidate" | "system";
  content: string;
  timestamp: string;
  questionId?: string;
  metadata?: {
    isFollowUp: boolean;
    difficulty: InterviewDifficulty;
    topic: string;
    domain: string;
    source: "dataset" | "mongodb" | "ai_generated";
  };
}

export interface MemoryContext {
  topicsCovered: string[];
  questionsAsked: string[];
  performanceTrend: number[]; // scores per question
  weakAreas: string[];
  strongAreas: string[];
  conversationHistory: { role: string; content: string }[];
}

// ===== QUESTION =====
export interface Question {
  id: string;
  domain: string;
  topic: string;
  difficulty: InterviewDifficulty;
  company?: string;
  question: string;
  followup?: string;
  tags: string[];
  source: "dataset" | "admin" | "ai_generated";
  embeddingHash?: string;
  createdAt: string;
  usageCount: number;
  successRate: number;
}

// ===== EVALUATION =====
export interface EvaluationResult {
  sessionId: string;
  overallScore: number; // 0-100
  dimensions: EvaluationDimensions;
  feedback: string;
  strengths: string[];
  improvements: string[];
  roadmap: RoadmapItem[];
}

export interface EvaluationDimensions {
  technicalAccuracy: DimensionScore;
  problemSolving: DimensionScore;
  communication: DimensionScore;
  depth: DimensionScore;
  confidence: DimensionScore;
  structure: DimensionScore;
  creativity: DimensionScore;
  edgeCases: DimensionScore;
  codeQuality: DimensionScore;
}

export interface DimensionScore {
  score: number; // 0-100
  weight: number; // 0-1
  feedback: string;
}

export interface RoadmapItem {
  area: string;
  priority: "high" | "medium" | "low";
  suggestion: string;
  resources?: string[];
}

// ===== ANALYTICS =====
export interface PerformanceData {
  date: string;
  score: number;
  domain: string;
  difficulty: string;
}

export interface SkillRadarData {
  skill: string;
  score: number;
  maxScore: number;
}

export interface TopicMastery {
  topic: string;
  mastery: number; // 0-100
  questionsAttempted: number;
  lastPracticed: string;
}

// ===== FEATURE FLAGS =====
export interface FeatureFlags {
  enableWebcam: boolean;
  enableVoice: boolean;
  enableCodingMode: boolean;
  enableStressMode: boolean;
  enableStreaks: boolean;
  enableAdminUpload: boolean;
  [key: string]: boolean;
}

// ===== RESUME =====
export interface Resume {
  id: string;
  userId: string;
  filename: string;
  url: string;
  extractedData: ResumeData;
  uploadedAt: string;
}

export interface ResumeData {
  name: string;
  email: string;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  highlights: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  year: string;
}

export interface ProjectItem {
  name: string;
  description: string;
  technologies: string[];
}

// ===== API =====
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ===== CODING =====
export interface CodingProblem {
  id: string;
  title: string;
  description: string;
  language: string;
  starterCode: string;
  testCases: TestCase[];
  difficulty: InterviewDifficulty;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface CodeSubmission {
  code: string;
  language: string;
  results: TestCaseResult[];
}

export interface TestCaseResult {
  testCaseId: string;
  passed: boolean;
  actualOutput: string;
  executionTime: number;
  error?: string;
}
