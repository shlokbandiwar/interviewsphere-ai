"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Play, CheckCircle, XCircle, Loader2, Code2 } from "lucide-react";
import {
  CODING_LANGUAGES,
  getPlaceholderProblem,
  getStarterCode,
  runPlaceholderTests,
  type CodingLanguageId,
} from "@/lib/coding-placeholder";
import type { TestCaseResult } from "@/types";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      Loading editor...
    </div>
  ),
});

interface CodingPanelProps {
  className?: string;
}

export function CodingPanel({ className }: CodingPanelProps) {
  const [language, setLanguage] = useState<CodingLanguageId>("javascript");
  const [code, setCode] = useState(() => getStarterCode("javascript"));
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestCaseResult[] | null>(null);
  const [activeCaseId, setActiveCaseId] = useState("tc1");

  const problem = getPlaceholderProblem(language);
  const visibleCases = problem.testCases.filter((tc) => !tc.isHidden);
  const activeCase =
    problem.testCases.find((tc) => tc.id === activeCaseId) ?? problem.testCases[0];

  useEffect(() => {
    setCode(getStarterCode(language));
    setResults(null);
    setActiveCaseId("tc1");
  }, [language]);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setResults(null);
    const runResults = await runPlaceholderTests(problem.testCases);
    setResults(runResults);
    setIsRunning(false);
  }, [problem.testCases]);

  const passedCount = results?.filter((r) => r.passed).length ?? 0;
  const activeResult = results?.find((r) => r.testCaseId === activeCase.id);

  return (
    <div className={`flex flex-col h-full glass border-border ${className ?? ""}`}>
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Code2 className="h-4 w-4 text-purple-light shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{problem.title}</p>
            <p className="text-[10px] text-muted-foreground truncate">{problem.description}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void handleRun()}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-white text-sm font-semibold shadow-lg shadow-indigo/25 hover:scale-[1.02] transition-all disabled:opacity-50 shrink-0"
        >
          {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Run
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 px-4 py-2 border-b border-border shrink-0">
        {CODING_LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            type="button"
            onClick={() => setLanguage(lang.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              language === lang.id
                ? "gradient-primary text-white shadow-md"
                : "glass glass-hover text-muted-foreground"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-[200px] border-b border-border">
        <MonacoEditor
          height="100%"
          language={CODING_LANGUAGES.find((l) => l.id === language)?.monacoId ?? "javascript"}
          value={code}
          onChange={(value) => setCode(value ?? "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "var(--font-geist-mono), monospace",
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            lineNumbers: "on",
            roundedSelection: true,
          }}
        />
      </div>

      <div className="shrink-0 flex flex-col max-h-[40%] min-h-[180px]">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
          <p className="text-xs font-semibold text-muted-foreground">Test Cases</p>
          {results && (
            <span className="text-[10px] font-medium text-muted-foreground">
              {passedCount}/{results.length} passed
            </span>
          )}
        </div>

        <div className="flex gap-1 px-4 py-2 border-b border-border overflow-x-auto">
          {visibleCases.map((tc) => {
            const result = results?.find((r) => r.testCaseId === tc.id);
            return (
              <button
                key={tc.id}
                type="button"
                onClick={() => setActiveCaseId(tc.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all ${
                  activeCaseId === tc.id
                    ? "bg-sidebar-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {result &&
                  (result.passed ? (
                    <CheckCircle className="h-3 w-3 text-success" />
                  ) : (
                    <XCircle className="h-3 w-3 text-destructive" />
                  ))}
                Case {tc.id.replace("tc", "")}
              </button>
            );
          })}
          <span className="px-2 py-1 text-[10px] text-muted-foreground">+1 hidden</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          <div>
            <p className="text-muted-foreground mb-1">Input</p>
            <pre className="p-2 rounded-lg bg-muted/50 font-mono text-foreground/90 whitespace-pre-wrap">
              {activeCase.input}
            </pre>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Expected Output</p>
            <pre className="p-2 rounded-lg bg-muted/50 font-mono text-success whitespace-pre-wrap">
              {activeCase.expectedOutput}
            </pre>
          </div>
          {results && activeResult && (
            <div>
              <p className="text-muted-foreground mb-1">Your Output</p>
              <pre
                className={`p-2 rounded-lg font-mono whitespace-pre-wrap ${
                  activeResult.passed
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {activeResult.error ?? activeResult.actualOutput}
                {!activeResult.error && (
                  <span className="block mt-1 text-[10px] opacity-70">
                    {activeResult.executionTime}ms
                  </span>
                )}
              </pre>
            </div>
          )}
          {isRunning && (
            <p className="text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" /> Running tests (placeholder)...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
