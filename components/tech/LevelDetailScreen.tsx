import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
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
  LearningLevel,
  LevelProgress,
  getDifficultyStars,
  getDifficultyLabel,
  getNextQuestionId,
} from "../../constants/learningPath";

interface LevelDetailScreenProps {
  level: LearningLevel;
  progress: LevelProgress;
  onBack: () => void;
  onStartQuestion: (questionId: string) => void;
}

export default function LevelDetailScreen({
  level,
  progress,
  onBack,
  onStartQuestion,
}: LevelDetailScreenProps) {
  const theme = DomainColors.tech;
  const isCompleted = progress.status === "completed";
  const nextQId = getNextQuestionId(level, progress.completedQuestions);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Back */}
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Ionicons name="arrow-back" size={22} color={theme.color} />
        <Text style={[styles.backText, { color: theme.color }]}>
          Learning Path
        </Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={[styles.headerCard, Shadows.md]}>
        <Text style={styles.levelLabel}>LEVEL {level.id}</Text>
        <Text style={[styles.levelName, { color: theme.color }]}>
          {level.name}
        </Text>
        <Text style={styles.difficulty}>
          {getDifficultyStars(level.difficulty)}{" "}
          {getDifficultyLabel(level.difficulty)}
        </Text>
        <Text style={styles.description}>{level.description}</Text>

        {/* Progress bar */}
        <View style={styles.progRow}>
          <Text style={styles.progLabel}>
            {progress.completedQuestions.length}/{level.questions.length}{" "}
            completed
          </Text>
          <Text style={[styles.avgScore, { color: theme.color }]}>
            {progress.scores.length > 0
              ? `Avg: ${progress.avgScore.toFixed(1)}/10`
              : "Not started"}
          </Text>
        </View>
        <View style={styles.progTrack}>
          <View
            style={[
              styles.progFill,
              {
                width: `${(progress.completedQuestions.length / level.questions.length) * 100}%`,
                backgroundColor: isCompleted ? Colors.accent : theme.color,
              },
            ]}
          />
        </View>
      </View>

      {/* Questions list */}
      <Text style={styles.sectionLabel}>QUESTIONS</Text>

      {level.questions.map((q, idx) => {
        const isDone = progress.completedQuestions.includes(q.id);
        const score = progress.scores.find((s) => s.questionId === q.id);
        const isNext = q.id === nextQId;

        return (
          <TouchableOpacity
            key={q.id}
            style={[
              styles.questionCard,
              Shadows.sm,
              isDone && styles.questionDone,
              isNext && { borderColor: theme.color, borderWidth: 2 },
            ]}
            activeOpacity={0.85}
            onPress={() => onStartQuestion(q.id)}
          >
            <View style={styles.qHeader}>
              <View
                style={[
                  styles.qNumber,
                  {
                    backgroundColor: isDone
                      ? Colors.accent
                      : isNext
                      ? theme.color
                      : Colors.borderLight,
                  },
                ]}
              >
                {isDone ? (
                  <Ionicons name="checkmark" size={16} color={Colors.white} />
                ) : (
                  <Text
                    style={[
                      styles.qNumText,
                      { color: isNext ? Colors.white : Colors.textMuted },
                    ]}
                  >
                    {idx + 1}
                  </Text>
                )}
              </View>

              <View style={styles.qInfo}>
                <Text style={styles.qTopic}>{q.topic}</Text>
                <Text style={styles.qText} numberOfLines={2}>
                  {q.question}
                </Text>
              </View>
            </View>

            {/* Expected focus areas hint */}
            {q.expectedFocusAreas.length > 0 && !isDone && (
              <View style={styles.hintRow}>
                <Ionicons
                  name="bulb-outline"
                  size={14}
                  color={Colors.secondary}
                />
                <Text style={styles.hintText}>
                  Focus: {q.expectedFocusAreas.slice(0, 2).join(", ")}
                </Text>
              </View>
            )}

            {/* Score if completed */}
            {isDone && score && (
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>Score:</Text>
                <Text
                  style={[
                    styles.scoreVal,
                    {
                      color:
                        score.averageScore >= 8
                          ? Colors.accent
                          : score.averageScore >= 6
                          ? Colors.secondary
                          : Colors.scoreLow,
                    },
                  ]}
                >
                  {score.averageScore.toFixed(1)}/10
                </Text>
                {score.averageScore < 7 && (
                  <Text style={styles.retryHint}>← Tap to retry</Text>
                )}
              </View>
            )}

            {/* Next indicator */}
            {isNext && !isDone && (
              <View
                style={[styles.nextBadge, { backgroundColor: theme.color }]}
              >
                <Text style={styles.nextBadgeText}>UP NEXT</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}

      {/* Bottom CTA */}
      {nextQId ? (
        <TouchableOpacity
          style={[styles.ctaBtn, { backgroundColor: theme.color }]}
          activeOpacity={0.85}
          onPress={() => onStartQuestion(nextQId)}
        >
          <Text style={styles.ctaBtnText}>
            {progress.completedQuestions.length > 0
              ? "Continue Next Question"
              : "Start Level"}
          </Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.white} />
        </TouchableOpacity>
      ) : isCompleted ? (
        <View style={[styles.completedBanner, Shadows.sm]}>
          <Text style={styles.completedEmoji}>🎉</Text>
          <Text style={styles.completedText}>
            Level Complete! Avg Score: {progress.avgScore.toFixed(1)}/10
          </Text>
          <TouchableOpacity
            style={[styles.retryLevelBtn, { borderColor: theme.color }]}
            onPress={() =>
              onStartQuestion(level.questions[0].id)
            }
          >
            <Ionicons name="refresh" size={16} color={theme.color} />
            <Text style={[styles.retryLevelText, { color: theme.color }]}>
              Redo Level
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.xl,
    paddingTop: 56,
    paddingBottom: 40,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  backText: {
    ...Typography.bodySmall,
    fontWeight: "600",
    marginLeft: Spacing.xs,
  },

  /* Header card */
  headerCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  levelLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  levelName: {
    ...Typography.h1,
    marginBottom: Spacing.xs,
  },
  difficulty: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  progRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  progLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  avgScore: {
    ...Typography.caption,
    fontWeight: "700",
  },
  progTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderLight,
    overflow: "hidden",
  },
  progFill: {
    height: 8,
    borderRadius: 4,
  },

  /* Section */
  sectionLabel: {
    ...Typography.label,
    color: Colors.primary,
    marginBottom: Spacing.lg,
  },

  /* Question cards */
  questionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  questionDone: {
    borderColor: Colors.accent + "40",
    backgroundColor: Colors.accent + "06",
  },
  qHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  qNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
    marginTop: 2,
  },
  qNumText: {
    ...Typography.bodySmall,
    fontWeight: "800",
  },
  qInfo: {
    flex: 1,
  },
  qTopic: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  qText: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    fontWeight: "600",
    lineHeight: 20,
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
    marginLeft: 44,
    gap: Spacing.xs,
  },
  hintText: {
    ...Typography.caption,
    color: Colors.secondary,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
    marginLeft: 44,
    gap: Spacing.sm,
  },
  scoreLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  scoreVal: {
    ...Typography.bodySmall,
    fontWeight: "800",
  },
  retryHint: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontStyle: "italic",
  },
  nextBadge: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.round,
  },
  nextBadgeText: {
    ...Typography.label,
    color: Colors.white,
    fontSize: 9,
    fontWeight: "800",
  },

  /* Bottom CTA */
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  ctaBtnText: {
    ...Typography.h3,
    color: Colors.white,
    fontSize: 17,
  },

  /* Completed banner */
  completedBanner: {
    backgroundColor: Colors.accent + "12",
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: "center",
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.accent + "30",
  },
  completedEmoji: {
    fontSize: 36,
    marginBottom: Spacing.sm,
  },
  completedText: {
    ...Typography.h3,
    color: Colors.accent,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  retryLevelBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.round,
    borderWidth: 2,
    gap: Spacing.sm,
  },
  retryLevelText: {
    ...Typography.bodySmall,
    fontWeight: "700",
  },
});
