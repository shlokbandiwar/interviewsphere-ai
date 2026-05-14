import type { InterviewDomain, InterviewDifficulty, InterviewType, InterviewMode } from "@/types";

export const APP_NAME = "InterviewSphere AI";
export const APP_DESCRIPTION = "AI-powered mock interview platform with adaptive questioning, voice support, and real-time feedback.";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// ===== INTERVIEW DOMAINS =====
export const INTERVIEW_DOMAINS: { value: InterviewDomain; label: string; icon: string; color: string }[] = [
  { value: "frontend", label: "Frontend", icon: "Monitor", color: "#3B82F6" },
  { value: "backend", label: "Backend", icon: "Server", color: "#10B981" },
  { value: "fullstack", label: "Full Stack", icon: "Layers", color: "#8B5CF6" },
  { value: "data-science", label: "Data Science", icon: "BarChart3", color: "#F59E0B" },
  { value: "devops", label: "DevOps", icon: "Cloud", color: "#EF4444" },
  { value: "system-design", label: "System Design", icon: "GitBranch", color: "#EC4899" },
  { value: "behavioral", label: "Behavioral", icon: "Users", color: "#06B6D4" },
  { value: "hr", label: "HR", icon: "Briefcase", color: "#84CC16" },
  { value: "product", label: "Product", icon: "Lightbulb", color: "#F97316" },
  { value: "custom", label: "Custom", icon: "Settings", color: "#6B7280" },
];

// ===== DIFFICULTY LEVELS =====
export const DIFFICULTY_LEVELS: { value: InterviewDifficulty; label: string; color: string }[] = [
  { value: "beginner", label: "Beginner", color: "#10B981" },
  { value: "intermediate", label: "Intermediate", color: "#F59E0B" },
  { value: "advanced", label: "Advanced", color: "#EF4444" },
];

// ===== INTERVIEW TYPES =====
export const INTERVIEW_TYPES: { value: InterviewType; label: string; description: string }[] = [
  { value: "technical", label: "Technical", description: "Deep dive into technical concepts and problem-solving" },
  { value: "behavioral", label: "Behavioral", description: "STAR method questions about past experiences" },
  { value: "system-design", label: "System Design", description: "Architect scalable systems and discuss tradeoffs" },
  { value: "coding", label: "Coding", description: "Live coding challenges with real-time evaluation" },
  { value: "mixed", label: "Mixed", description: "Combination of technical and behavioral questions" },
];

// ===== INTERVIEW MODES =====
export const INTERVIEW_MODES: { value: InterviewMode; label: string; description: string; icon: string }[] = [
  { value: "standard", label: "Standard", description: "Balanced interview pace", icon: "Play" },
  { value: "practice", label: "Practice", description: "Relaxed mode with hints", icon: "BookOpen" },
  { value: "stress", label: "Stress", description: "Fast-paced, challenging follow-ups", icon: "Zap" },
  { value: "timed", label: "Timed", description: "Strict time limits per question", icon: "Timer" },
];

// ===== EVALUATION DIMENSIONS =====
export const EVALUATION_DIMENSIONS = [
  { key: "technicalAccuracy", label: "Technical Accuracy", weight: 0.30, color: "#4F46E5" },
  { key: "problemSolving", label: "Problem Solving", weight: 0.20, color: "#3B82F6" },
  { key: "communication", label: "Communication", weight: 0.15, color: "#8B5CF6" },
  { key: "depth", label: "Depth of Knowledge", weight: 0.15, color: "#10B981" },
  { key: "confidence", label: "Confidence", weight: 0.10, color: "#F59E0B" },
  { key: "structure", label: "Structure", weight: 0.10, color: "#EC4899" },
  { key: "creativity", label: "Creativity", weight: 0.0, color: "#06B6D4" },
  { key: "edgeCases", label: "Edge Cases", weight: 0.0, color: "#F97316" },
  { key: "codeQuality", label: "Code Quality", weight: 0.0, color: "#84CC16" },
] as const;

// ===== XP / LEVELS =====
export const XP_PER_INTERVIEW = 100;
export const XP_PER_QUESTION = 10;
export const XP_STREAK_BONUS = 50;
export const LEVEL_THRESHOLDS = [0, 200, 500, 1000, 2000, 3500, 5500, 8000, 12000, 18000, 25000];
export const LEVEL_NAMES = [
  "Novice", "Apprentice", "Explorer", "Practitioner", "Specialist",
  "Expert", "Master", "Grandmaster", "Legend", "Titan", "Immortal",
];

// ===== CODING LANGUAGES =====
export const CODING_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
];

// ===== TOP COMPANIES =====
export const TOP_COMPANIES = [
  "Google", "Meta", "Amazon", "Apple", "Microsoft", "Netflix",
  "Uber", "Airbnb", "Twitter/X", "Stripe", "LinkedIn", "Spotify",
  "Adobe", "Salesforce", "Oracle", "IBM", "Nvidia", "Tesla",
  "Goldman Sachs", "JPMorgan", "Morgan Stanley",
];

// ===== NAV LINKS =====
export const DASHBOARD_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/dashboard/interviews", label: "Interviews", icon: "MessageSquare" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "BarChart3" },
  { href: "/dashboard/history", label: "History", icon: "Clock" },
  { href: "/dashboard/achievements", label: "Achievements", icon: "Trophy" },
  { href: "/dashboard/resume", label: "Resume", icon: "FileText" },
  { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
];

export const LANDING_NAV = [
  { href: "#features", label: "Features" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#faq", label: "FAQ" },
];
