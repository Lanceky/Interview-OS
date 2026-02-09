/**
 * InterviewOS — Tech Learning Path
 * Structured levels with unlock logic, badges, and progress tracking.
 */

// ─── Types ───────────────────────────────────────────────────────

export interface LearningQuestion {
  id: string;
  levelId: number;
  question: string;
  topic: string;
  expectedFocusAreas: string[];
}

export interface LearningLevel {
  id: number;
  name: string;
  difficulty: 1 | 2 | 3;
  description: string;
  unlockRequirement: string;
  questions: LearningQuestion[];
}

export interface QuestionScore {
  questionId: string;
  structureScore: number;
  clarityScore: number;
  technicalScore: number;
  averageScore: number;
}

export interface LevelProgress {
  levelId: number;
  completedQuestions: string[]; // question IDs
  scores: QuestionScore[];
  avgScore: number;
  status: "locked" | "in_progress" | "completed";
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  levelId: number | null; // null = special badge
  requiredAvgScore: number;
}

export interface LearningPathState {
  levels: LevelProgress[];
  earnedBadges: string[]; // badge IDs
  totalQuestionsCompleted: number;
  totalQuestions: number;
  streakCount: number; // consecutive answers >= 6.0
}

// ─── Difficulty Stars ────────────────────────────────────────────

export function getDifficultyStars(d: 1 | 2 | 3): string {
  return "⭐".repeat(d);
}

export function getDifficultyLabel(d: 1 | 2 | 3): string {
  if (d === 1) return "Easy";
  if (d === 2) return "Medium";
  return "Hard";
}

// ─── Learning Levels ─────────────────────────────────────────────

export const TECH_LEARNING_LEVELS: LearningLevel[] = [
  {
    id: 1,
    name: "Fundamentals",
    difficulty: 1,
    description:
      "Build a strong foundation with core CS concepts and terminology.",
    unlockRequirement: "None — starting level",
    questions: [
      {
        id: "l1q1",
        levelId: 1,
        question: "Explain what a database is and why we need it.",
        topic: "Databases",
        expectedFocusAreas: ["Clarity", "Basic understanding"],
      },
      {
        id: "l1q2",
        levelId: 1,
        question:
          "What's the difference between an array and a linked list?",
        topic: "Data Structures",
        expectedFocusAreas: ["Technical accuracy", "Comparison"],
      },
      {
        id: "l1q3",
        levelId: 1,
        question: "Explain what an API is in simple terms.",
        topic: "APIs",
        expectedFocusAreas: ["Clarity", "Simplification"],
      },
      {
        id: "l1q4",
        levelId: 1,
        question: "What is a REST API? Give an example.",
        topic: "REST APIs",
        expectedFocusAreas: ["Technical accuracy", "Examples"],
      },
      {
        id: "l1q5",
        levelId: 1,
        question:
          "Tell me about your experience with version control (Git).",
        topic: "Version Control",
        expectedFocusAreas: ["Practical knowledge", "Workflow"],
      },
    ],
  },
  {
    id: 2,
    name: "Core DS & Algorithms",
    difficulty: 2,
    description:
      "Dive into data structures, algorithms, and problem-solving techniques.",
    unlockRequirement: "Complete Level 1",
    questions: [
      {
        id: "l2q1",
        levelId: 2,
        question:
          "Explain your approach to debugging a production issue.",
        topic: "Debugging",
        expectedFocusAreas: ["Problem breakdown", "Methodology"],
      },
      {
        id: "l2q2",
        levelId: 2,
        question:
          "What's the difference between SQL and NoSQL? When would you use each?",
        topic: "Databases",
        expectedFocusAreas: ["Technical accuracy", "Trade-offs"],
      },
      {
        id: "l2q3",
        levelId: 2,
        question:
          "Describe a sorting algorithm you know and how it works.",
        topic: "Algorithms",
        expectedFocusAreas: ["Technical accuracy", "Step-by-step"],
      },
      {
        id: "l2q4",
        levelId: 2,
        question: "What is recursion? Explain with an example.",
        topic: "Recursion",
        expectedFocusAreas: ["Clarity", "Examples"],
      },
      {
        id: "l2q5",
        levelId: 2,
        question:
          "What's the difference between a stack and a queue?",
        topic: "Data Structures",
        expectedFocusAreas: ["Comparison", "Use cases"],
      },
    ],
  },
  {
    id: 3,
    name: "System Design Fundamentals",
    difficulty: 2,
    description:
      "Learn to think about architecture, scalability, and design patterns.",
    unlockRequirement: "Complete Level 2 with avg score 6.0+",
    questions: [
      {
        id: "l3q1",
        levelId: 3,
        question:
          "How would you design a simple todo app? Walk through your approach.",
        topic: "App Design",
        expectedFocusAreas: ["Architecture", "Component thinking"],
      },
      {
        id: "l3q2",
        levelId: 3,
        question: "Explain what caching is and why it's important.",
        topic: "Caching",
        expectedFocusAreas: ["Technical accuracy", "Use cases"],
      },
      {
        id: "l3q3",
        levelId: 3,
        question:
          "What's the difference between horizontal and vertical scaling?",
        topic: "Scalability",
        expectedFocusAreas: ["Comparison", "Trade-offs"],
      },
      {
        id: "l3q4",
        levelId: 3,
        question:
          "Tell me about a time you optimized code for performance.",
        topic: "Optimization",
        expectedFocusAreas: ["Real experience", "Metrics"],
      },
      {
        id: "l3q5",
        levelId: 3,
        question:
          "Explain what load balancing is and why we need it.",
        topic: "Infrastructure",
        expectedFocusAreas: ["Technical accuracy", "Scalability"],
      },
    ],
  },
  {
    id: 4,
    name: "Advanced System Design",
    difficulty: 3,
    description:
      "Tackle real-world system design challenges at massive scale.",
    unlockRequirement: "Complete Level 3 with avg score 6.0+",
    questions: [
      {
        id: "l4q1",
        levelId: 4,
        question:
          "Walk me through how you'd design a URL shortener like Bitly.",
        topic: "System Design",
        expectedFocusAreas: ["End-to-end design", "Scalability"],
      },
      {
        id: "l4q2",
        levelId: 4,
        question:
          "Design a real-time notification system that scales to millions of users.",
        topic: "Real-time Systems",
        expectedFocusAreas: ["Pub/sub", "Scalability", "Trade-offs"],
      },
      {
        id: "l4q3",
        levelId: 4,
        question: "How would you design Twitter's feed?",
        topic: "Feed Systems",
        expectedFocusAreas: ["Fan-out", "Ranking", "Caching"],
      },
      {
        id: "l4q4",
        levelId: 4,
        question: "Design a distributed cache system.",
        topic: "Distributed Systems",
        expectedFocusAreas: ["Consistency", "Partitioning", "Eviction"],
      },
      {
        id: "l4q5",
        levelId: 4,
        question:
          "Explain how you'd architect a video streaming service like YouTube.",
        topic: "Large-Scale Architecture",
        expectedFocusAreas: ["CDN", "Transcoding", "Storage"],
      },
    ],
  },
];

// ─── Badges ──────────────────────────────────────────────────────

export const TECH_BADGES: Badge[] = [
  // Level badges
  {
    id: "fundamentals_master",
    name: "Fundamentals Master",
    emoji: "🌱",
    description: "Complete Level 1 with avg score 8.0+",
    levelId: 1,
    requiredAvgScore: 8.0,
  },
  {
    id: "clear_communicator",
    name: "Clear Communicator",
    emoji: "💡",
    description: "Complete Level 1 with clarity score 8.0+",
    levelId: 1,
    requiredAvgScore: 8.0,
  },
  {
    id: "algorithm_solver",
    name: "Algorithm Solver",
    emoji: "🎯",
    description: "Complete Level 2 with avg score 7.5+",
    levelId: 2,
    requiredAvgScore: 7.5,
  },
  {
    id: "technical_thinker",
    name: "Technical Thinker",
    emoji: "⚙️",
    description: "Complete Level 2 with technical score 8.0+",
    levelId: 2,
    requiredAvgScore: 8.0,
  },
  {
    id: "system_architect",
    name: "System Architect",
    emoji: "🏗️",
    description: "Complete Level 3 with avg score 7.0+",
    levelId: 3,
    requiredAvgScore: 7.0,
  },
  {
    id: "scalability_expert",
    name: "Scalability Expert",
    emoji: "📈",
    description: "Complete Level 3 with technical score 8.0+",
    levelId: 3,
    requiredAvgScore: 8.0,
  },
  {
    id: "design_expert",
    name: "Design Expert",
    emoji: "🚀",
    description: "Complete Level 4 with avg score 7.5+",
    levelId: 4,
    requiredAvgScore: 7.5,
  },
  {
    id: "senior_mindset",
    name: "Senior Engineer Mindset",
    emoji: "💎",
    description: "Complete Level 4 with all scores 7.0+",
    levelId: 4,
    requiredAvgScore: 7.0,
  },
  // Special badges
  {
    id: "streak_master",
    name: "Streak Master",
    emoji: "🔥",
    description: "3+ questions in a row without dropping below 6.0",
    levelId: null,
    requiredAvgScore: 6.0,
  },
];

// ─── Default State ───────────────────────────────────────────────

export function createDefaultLearningState(): LearningPathState {
  return {
    levels: TECH_LEARNING_LEVELS.map((level, i) => ({
      levelId: level.id,
      completedQuestions: [],
      scores: [],
      avgScore: 0,
      status: i === 0 ? "in_progress" : "locked",
    })),
    earnedBadges: [],
    totalQuestionsCompleted: 0,
    totalQuestions: TECH_LEARNING_LEVELS.reduce(
      (sum, l) => sum + l.questions.length,
      0
    ),
    streakCount: 0,
  };
}

// ─── Progress Helpers ────────────────────────────────────────────

export function calculateLevelAvg(scores: QuestionScore[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((s, q) => s + q.averageScore, 0);
  return Math.round((sum / scores.length) * 10) / 10;
}

export function shouldUnlockNext(
  levelProgress: LevelProgress,
  level: LearningLevel
): boolean {
  const allDone =
    levelProgress.completedQuestions.length === level.questions.length;
  // Level 1 only needs completion; Levels 2+ need avg 6.0+
  if (level.id === 1) return allDone;
  return allDone && levelProgress.avgScore >= 6.0;
}

export function getNextQuestionId(
  level: LearningLevel,
  completed: string[]
): string | null {
  const next = level.questions.find((q) => !completed.includes(q.id));
  return next?.id ?? null;
}

export function checkBadges(
  state: LearningPathState
): string[] {
  const newBadges: string[] = [];

  for (const badge of TECH_BADGES) {
    if (state.earnedBadges.includes(badge.id)) continue;

    // Streak badge
    if (badge.id === "streak_master") {
      if (state.streakCount >= 3) newBadges.push(badge.id);
      continue;
    }

    // Level badges
    if (badge.levelId !== null) {
      const lp = state.levels.find((l) => l.levelId === badge.levelId);
      if (lp && lp.status === "completed" && lp.avgScore >= badge.requiredAvgScore) {
        newBadges.push(badge.id);
      }
    }
  }

  return newBadges;
}
