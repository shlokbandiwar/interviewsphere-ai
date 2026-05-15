import type { CodingProblem, TestCase, TestCaseResult } from "@/types";

export type CodingLanguageId = "javascript" | "python" | "java" | "cpp";

export const CODING_LANGUAGES: { id: CodingLanguageId; label: string; monacoId: string }[] = [
  { id: "cpp", label: "C++", monacoId: "cpp" },
  { id: "java", label: "Java", monacoId: "java" },
  { id: "python", label: "Python", monacoId: "python" },
  { id: "javascript", label: "JavaScript", monacoId: "javascript" },
];

const STARTER_CODE: Record<CodingLanguageId, string> = {
  javascript: `/**\n * Two Sum — return indices of two numbers that add up to target.\n */\nfunction twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (map.has(need)) return [map.get(need), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}\n`,
  python: `def two_sum(nums: list[int], target: int) -> list[int]:\n    \"\"\"Return indices of two numbers that add up to target.\"\"\"\n    seen = {}\n    for i, n in enumerate(nums):\n        need = target - n\n        if need in seen:\n            return [seen[need], i]\n        seen[n] = i\n    return []\n`,
  java: `import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int need = target - nums[i];\n            if (map.containsKey(need)) {\n                return new int[] { map.get(need), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[] {};\n    }\n}\n`,
  cpp: `#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> idx;\n        for (int i = 0; i < (int)nums.size(); i++) {\n            int need = target - nums[i];\n            if (idx.count(need)) return { idx[need], i };\n            idx[nums[i]] = i;\n        }\n        return {};\n    }\n};\n`,
};

const MOCK_TEST_CASES: TestCase[] = [
  { id: "tc1", input: "nums = [2,7,11,15], target = 9", expectedOutput: "[0,1]", isHidden: false },
  { id: "tc2", input: "nums = [3,2,4], target = 6", expectedOutput: "[1,2]", isHidden: false },
  { id: "tc3", input: "nums = [3,3], target = 6", expectedOutput: "[0,1]", isHidden: true },
];

export function getStarterCode(language: CodingLanguageId): string {
  return STARTER_CODE[language];
}

export function getPlaceholderProblem(language: CodingLanguageId): CodingProblem {
  return {
    id: "two-sum",
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    language,
    starterCode: getStarterCode(language),
    testCases: MOCK_TEST_CASES,
    difficulty: "intermediate",
  };
}

export async function runPlaceholderTests(
  testCases: TestCase[]
): Promise<TestCaseResult[]> {
  await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));

  return testCases.map((tc, i) => ({
    testCaseId: tc.id,
    passed: i !== 2,
    actualOutput: i === 2 ? "[0,0]" : tc.expectedOutput,
    executionTime: 12 + i * 8,
    error: i === 2 ? "Wrong answer on hidden case" : undefined,
  }));
}
