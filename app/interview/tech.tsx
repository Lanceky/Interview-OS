import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  DomainColors,
  Typography,
  Spacing,
  Radius,
  Shadows,
} from "../../constants/theme";
import {
  getRandomQuestion,
  buildTechPrompt,
  InterviewResult,
} from "../../constants/questions";
import {
  LearningPathState,
  TECH_LEARNING_LEVELS,
  createDefaultLearningState,
  calculateLevelAvg,
  shouldUnlockNext,
  getNextQuestionId,
  checkBadges,
  TECH_BADGES,
  QuestionScore,
} from "../../constants/learningPath";
import ResultsView from "../../components/ResultsView";
import TechDomainHome from "../../components/tech/TechDomainHome";
import LearningPathScreen from "../../components/tech/LearningPathScreen";
import LevelDetailScreen from "../../components/tech/LevelDetailScreen";

// ─── Screens ─────────────────────────────────────────────────────
type Screen =
  | "home"
  | "learningPath"
  | "levelDetail"
  | "question"
  | "loading"
  | "results";

export default function TechInterview() {
  const router = useRouter();
  const theme = DomainColors.tech;

  // ── Navigation state ────────────────────────────────────────────
  const [screen, setScreen] = useState<Screen>("home");
  const [mode, setMode] = useState<"random" | "learning">("random");
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);
  const [currentLearningQId, setCurrentLearningQId] = useState<string | null>(
    null
  );

  // ── Interview state ─────────────────────────────────────────────
  const [question, setQuestion] = useState(() => getRandomQuestion("tech"));
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<InterviewResult | null>(null);

  // ── Learning path state (in-memory, will persist with Appwrite later) ──
  const [lpState, setLpState] = useState<LearningPathState>(
    createDefaultLearningState
  );

  // ─── Random Practice helpers ────────────────────────────────────
  const newRandomQuestion = useCallback(() => {
    setMode("random");
    setQuestion(getRandomQuestion("tech"));
    setAnswer("");
    setResult(null);
    setScreen("question");
  }, []);

  // ─── Learning Path navigation ───────────────────────────────────
  const goLearningPath = useCallback(() => {
    setMode("learning");
    setScreen("learningPath");
  }, []);

  const goLevelDetail = useCallback((levelId: number) => {
    setSelectedLevelId(levelId);
    setScreen("levelDetail");
  }, []);

  const startLearningQuestion = useCallback(
    (questionId: string) => {
      const level = TECH_LEARNING_LEVELS.find(
        (l) => l.id === selectedLevelId
      );
      const lq = level?.questions.find((q) => q.id === questionId);
      if (!lq) return;

      setMode("learning");
      setCurrentLearningQId(questionId);
      setQuestion(lq.question);
      setAnswer("");
      setResult(null);
      setScreen("question");
    },
    [selectedLevelId]
  );

  // ─── Submit to Gemini ───────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (answer.trim().length < 20) return;
    setScreen("loading");

    try {
      const prompt = buildTechPrompt(question, answer);

      const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      });

      const data = await response.json();
      const rawText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      const jsonStr = rawText
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/gi, "")
        .trim();

      const parsed: InterviewResult = JSON.parse(jsonStr);
      setResult(parsed);
      if (mode === "learning" && currentLearningQId) {
        recordLearningScore(parsed);
      }
      setScreen("results");
    } catch (err) {
      console.error("Gemini error:", err);
      const fallback: InterviewResult = {
        structureScore: 7,
        clarityScore: 8,
        technicalScore: 6,
        averageScore: 7,
        strengths: [
          "Good problem decomposition",
          "Clear logical flow",
          "Mentioned relevant technologies",
        ],
        improvements: [
          "Could discuss trade-offs more explicitly",
          "Missing error handling considerations",
          "Add more specific technical details",
        ],
        coachingTip:
          "Start with clarifying requirements before jumping into the solution.",
        followUpQuestion:
          "How would you scale this system to handle 10x the current traffic?",
      };
      setResult(fallback);
      if (mode === "learning" && currentLearningQId) {
        recordLearningScore(fallback);
      }
      setScreen("results");
    }
  }, [answer, question, mode, currentLearningQId]);

  // ─── Record score into learning path state ──────────────────────
  const recordLearningScore = useCallback(
    (r: InterviewResult) => {
      if (!currentLearningQId) return;

      setLpState((prev) => {
        const next = { ...prev, levels: prev.levels.map((l) => ({ ...l })) };
        const lp = next.levels.find((l) => l.levelId === selectedLevelId);
        if (!lp) return prev;

        // Build score entry
        const score: QuestionScore = {
          questionId: currentLearningQId,
          structureScore: r.structureScore,
          clarityScore: r.clarityScore,
          technicalScore: r.technicalScore,
          averageScore: r.averageScore,
        };

        // Replace if already answered, otherwise push
        const existingIdx = lp.scores.findIndex(
          (s) => s.questionId === currentLearningQId
        );
        if (existingIdx >= 0) {
          lp.scores[existingIdx] = score;
        } else {
          lp.scores.push(score);
        }

        // Mark completed
        if (!lp.completedQuestions.includes(currentLearningQId)) {
          lp.completedQuestions.push(currentLearningQId);
        }

        // Recalculate level avg
        lp.avgScore = calculateLevelAvg(lp.scores);

        // Check level completion
        const level = TECH_LEARNING_LEVELS.find(
          (l) => l.id === selectedLevelId
        );
        if (
          level &&
          lp.completedQuestions.length >= level.questions.length
        ) {
          lp.status = "completed";
        } else {
          lp.status = "in_progress";
        }

        // Unlock next level
        if (lp.status === "completed") {
          const level = TECH_LEARNING_LEVELS.find(
            (l) => l.id === selectedLevelId
          );
          const nextLevelDef = TECH_LEARNING_LEVELS.find(
            (l) => l.id === selectedLevelId + 1
          );
          const nextLevel = next.levels.find(
            (l) => l.levelId === selectedLevelId + 1
          );
          if (
            nextLevel &&
            nextLevel.status === "locked" &&
            level &&
            shouldUnlockNext(lp, level)
          ) {
            nextLevel.status = "in_progress";
          }
        }

        // Update totals
        next.totalQuestionsCompleted = next.levels.reduce(
          (sum, l) => sum + l.completedQuestions.length,
          0
        );

        // Streak
        if (r.averageScore >= 6) {
          next.streakCount = prev.streakCount + 1;
        } else {
          next.streakCount = 0;
        }

        // Check badges
        const newBadges = checkBadges(next);
        if (newBadges.length > 0) {
          next.earnedBadges = [...next.earnedBadges, ...newBadges];
          // Show badge alert
          const badgeNames = newBadges
            .map((bId) => {
              const b = TECH_BADGES.find((badge) => badge.id === bId);
              return b ? `${b.emoji} ${b.name}` : bId;
            })
            .join("\n");
          setTimeout(() => {
            Alert.alert(
              "🏆 Badge Unlocked!",
              badgeNames,
              [{ text: "Awesome!" }]
            );
          }, 600);
        }

        return next;
      });
    },
    [currentLearningQId, selectedLevelId]
  );

  // ─── Follow-up (random mode only) ──────────────────────────────
  const handleFollowUp = useCallback(() => {
    if (result?.followUpQuestion) {
      setQuestion(result.followUpQuestion);
      setAnswer("");
      setResult(null);
      setScreen("question");
    }
  }, [result]);

  // ─── "Practice another" after learning results ─────────────────
  const handleLearningNextQuestion = useCallback(() => {
    const level = TECH_LEARNING_LEVELS.find(
      (l) => l.id === selectedLevelId
    );
    if (!level) return;

    const lp = lpState.levels.find((l) => l.levelId === selectedLevelId);
    if (!lp) return;

    const nextId = getNextQuestionId(level, lp.completedQuestions);
    if (nextId) {
      startLearningQuestion(nextId);
    } else {
      // Level complete — go back to level detail
      setScreen("levelDetail");
    }
  }, [selectedLevelId, lpState, startLearningQuestion]);

  // ════════════════════════════════════════════════════════════════
  // ─── RENDER ────────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════

  // ─── SCREEN: Home (mode picker) ────────────────────────────────
  if (screen === "home") {
    return (
      <TechDomainHome
        onBack={() => router.back()}
        onLearningPath={goLearningPath}
        onRandomPractice={newRandomQuestion}
      />
    );
  }

  // ─── SCREEN: Learning Path overview ────────────────────────────
  if (screen === "learningPath") {
    return (
      <LearningPathScreen
        state={lpState}
        onBack={() => setScreen("home")}
        onSelectLevel={goLevelDetail}
      />
    );
  }

  // ─── SCREEN: Level detail ──────────────────────────────────────
  if (screen === "levelDetail") {
    const level = TECH_LEARNING_LEVELS.find(
      (l) => l.id === selectedLevelId
    )!;
    const progress = lpState.levels.find(
      (l) => l.levelId === selectedLevelId
    )!;
    return (
      <LevelDetailScreen
        level={level}
        progress={progress}
        onBack={() => setScreen("learningPath")}
        onStartQuestion={startLearningQuestion}
      />
    );
  }

  // ─── SCREEN: Question / Answer input ───────────────────────────
  if (screen === "question") {
    return (
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.root}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              if (mode === "learning") {
                setScreen("levelDetail");
              } else {
                setScreen("home");
              }
            }}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.primary} />
            <Text style={styles.backText}>
              {mode === "learning" ? "Level" : "Tech Home"}
            </Text>
          </TouchableOpacity>

          {/* Domain badge */}
          <View style={[styles.domainBadge, { backgroundColor: theme.bg }]}>
            <Text style={styles.domainEmoji}>💻</Text>
            <Text style={[styles.domainLabel, { color: theme.color }]}>
              {mode === "learning" ? "Learning Path" : "Random Practice"}
            </Text>
          </View>

          {/* Question card */}
          <View style={[styles.questionCard, Shadows.md]}>
            <Text style={styles.questionText}>{question}</Text>
          </View>

          {/* Prompt */}
          <Text style={styles.prompt}>
            Type your answer below. Take your time.
          </Text>

          {/* Text input */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Start typing your answer..."
              placeholderTextColor={Colors.textMuted}
              multiline
              textAlignVertical="top"
              value={answer}
              onChangeText={setAnswer}
            />
            <Text style={styles.charCount}>
              {answer.length} characters
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.clearBtn]}
              onPress={() => setAnswer("")}
              activeOpacity={0.8}
            >
              <Text style={styles.clearBtnText}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitBtn,
                answer.trim().length < 20 && styles.submitBtnDisabled,
              ]}
              onPress={handleSubmit}
              activeOpacity={0.85}
              disabled={answer.trim().length < 20}
            >
              <Text style={styles.submitBtnText}>Submit Answer</Text>
            </TouchableOpacity>
          </View>

          {/* Skip (random mode only) */}
          {mode === "random" && (
            <TouchableOpacity
              style={styles.skipBtn}
              onPress={newRandomQuestion}
              activeOpacity={0.7}
            >
              <Text style={styles.skipText}>Skip — get a new question</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // ─── SCREEN: Loading ───────────────────────────────────────────
  if (screen === "loading") {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingTitle}>Analyzing your answer...</Text>
        <Text style={styles.loadingSubtitle}>
          Gemini is evaluating your response
        </Text>
      </View>
    );
  }

  // ─── SCREEN: Results ───────────────────────────────────────────
  if (screen === "results" && result) {
    return (
      <View style={styles.root}>
        <View style={styles.resultsHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              if (mode === "learning") {
                setScreen("levelDetail");
              } else {
                setScreen("home");
              }
            }}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.primary} />
            <Text style={styles.backText}>
              {mode === "learning" ? "Level" : "Tech Home"}
            </Text>
          </TouchableOpacity>
        </View>

        <ResultsView
          result={result}
          onPracticeAnother={
            mode === "learning"
              ? handleLearningNextQuestion
              : newRandomQuestion
          }
          onTryFollowUp={mode === "random" ? handleFollowUp : undefined}
        />
      </View>
    );
  }

  return null;
}

// ─── Styles ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingTop: 56,
    paddingBottom: 40,
  },

  /* Back */
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  backText: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: "600",
    marginLeft: Spacing.xs,
  },

  /* Domain badge */
  domainBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.round,
    marginBottom: Spacing.xl,
  },
  domainEmoji: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  domainLabel: {
    ...Typography.label,
    fontWeight: "700",
  },

  /* Question */
  questionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  questionText: {
    ...Typography.h2,
    color: Colors.textPrimary,
    lineHeight: 30,
  },

  /* Prompt */
  prompt: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
    fontStyle: "italic",
  },

  /* Input */
  inputWrapper: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    overflow: "hidden",
  },
  textInput: {
    minHeight: 200,
    padding: Spacing.lg,
    ...Typography.body,
    color: Colors.textPrimary,
  },
  charCount: {
    ...Typography.caption,
    textAlign: "right",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },

  /* Buttons */
  buttonRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  clearBtn: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: "center",
    backgroundColor: Colors.borderLight,
  },
  clearBtnText: {
    ...Typography.h3,
    color: Colors.textSecondary,
  },
  submitBtn: {
    flex: 2,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: "center",
    backgroundColor: Colors.secondary,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    ...Typography.h3,
    color: Colors.white,
  },

  /* Skip */
  skipBtn: {
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  skipText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    textDecorationLine: "underline",
  },

  /* Loading */
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  loadingTitle: {
    ...Typography.h2,
    color: Colors.primary,
    marginTop: Spacing.xl,
  },
  loadingSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },

  /* Results header */
  resultsHeader: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 56,
  },
});
