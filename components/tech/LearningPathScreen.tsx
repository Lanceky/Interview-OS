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
  LearningPathState,
  TECH_LEARNING_LEVELS,
  TECH_BADGES,
  getDifficultyStars,
  getDifficultyLabel,
} from "../../constants/learningPath";

interface LearningPathScreenProps {
  state: LearningPathState;
  onBack: () => void;
  onSelectLevel: (levelId: number) => void;
}

export default function LearningPathScreen({
  state,
  onBack,
  onSelectLevel,
}: LearningPathScreenProps) {
  const theme = DomainColors.tech;

  const overallProgress = state.totalQuestionsCompleted;
  const overallTotal = state.totalQuestions;
  const overallPercent = overallTotal > 0 ? (overallProgress / overallTotal) * 100 : 0;

  // Find current in-progress level
  const currentLevel = state.levels.find((l) => l.status === "in_progress");

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
          Tech Interview
        </Text>
      </TouchableOpacity>

      {/* Header */}
      <Text style={[styles.title, { color: theme.color }]}>
        📚 Learning Path
      </Text>

      {/* Overall progress card */}
      <View style={[styles.progressCard, Shadows.md]}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Overall Progress</Text>
          <Text style={[styles.progressCount, { color: theme.color }]}>
            {overallProgress}/{overallTotal}
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${overallPercent}%`,
                backgroundColor: theme.color,
              },
            ]}
          />
        </View>
        {currentLevel && (
          <Text style={styles.progressSub}>
            Level {currentLevel.levelId} — In Progress (
            {currentLevel.completedQuestions.length}/
            {TECH_LEARNING_LEVELS[currentLevel.levelId - 1].questions.length})
          </Text>
        )}
      </View>

      {/* Badges earned */}
      {state.earnedBadges.length > 0 && (
        <View style={styles.badgesRow}>
          <Text style={styles.badgesLabel}>BADGES EARNED</Text>
          <View style={styles.badgesList}>
            {state.earnedBadges.map((bId) => {
              const badge = TECH_BADGES.find((b) => b.id === bId);
              if (!badge) return null;
              return (
                <View key={bId} style={styles.badgeChip}>
                  <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Levels */}
      <Text style={styles.sectionLabel}>YOUR LEVELS</Text>

      {TECH_LEARNING_LEVELS.map((level) => {
        const lp = state.levels.find((l) => l.levelId === level.id)!;
        const isLocked = lp.status === "locked";
        const isCompleted = lp.status === "completed";
        const isInProgress = lp.status === "in_progress";
        const qDone = lp.completedQuestions.length;
        const qTotal = level.questions.length;

        let statusBg = Colors.border;
        let statusColor = Colors.textMuted;
        let statusIcon = "🔒";
        let statusText = "LOCKED";

        if (isCompleted) {
          statusBg = Colors.accent + "20";
          statusColor = Colors.accent;
          statusIcon = "✅";
          statusText = "COMPLETED";
        } else if (isInProgress) {
          statusBg = Colors.secondary + "20";
          statusColor = Colors.secondary;
          statusIcon = "🔄";
          statusText = `IN PROGRESS (${qDone}/${qTotal})`;
        }

        return (
          <TouchableOpacity
            key={level.id}
            style={[
              styles.levelCard,
              Shadows.sm,
              isLocked && styles.levelCardLocked,
            ]}
            activeOpacity={isLocked ? 1 : 0.85}
            onPress={() => !isLocked && onSelectLevel(level.id)}
          >
            {/* Status badge */}
            <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
              <Text style={styles.statusIcon}>{statusIcon}</Text>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {statusText}
              </Text>
            </View>

            {/* Level header */}
            <View style={styles.levelHeader}>
              <Text
                style={[
                  styles.levelName,
                  isLocked && { color: Colors.textMuted },
                ]}
              >
                Level {level.id}: {level.name}
              </Text>
              <Text style={styles.levelDifficulty}>
                {getDifficultyStars(level.difficulty)}{" "}
                {getDifficultyLabel(level.difficulty)}
              </Text>
            </View>

            {/* Description */}
            <Text style={styles.levelDesc}>{level.description}</Text>

            {/* Topics preview */}
            <View style={styles.topicsList}>
              {level.questions.slice(0, 3).map((q) => (
                <View key={q.id} style={styles.topicRow}>
                  <Text style={styles.topicBullet}>
                    {lp.completedQuestions.includes(q.id) ? "✅" : isLocked ? "🔒" : "⏹️"}
                  </Text>
                  <Text
                    style={[
                      styles.topicText,
                      isLocked && { color: Colors.textMuted },
                    ]}
                    numberOfLines={1}
                  >
                    {q.topic}: {q.question}
                  </Text>
                </View>
              ))}
              {level.questions.length > 3 && (
                <Text style={styles.moreText}>
                  +{level.questions.length - 3} more questions
                </Text>
              )}
            </View>

            {/* Average score (if started) */}
            {lp.scores.length > 0 && (
              <View style={styles.avgRow}>
                <Text style={styles.avgLabel}>Average Score:</Text>
                <Text
                  style={[
                    styles.avgValue,
                    {
                      color:
                        lp.avgScore >= 8
                          ? Colors.accent
                          : lp.avgScore >= 6
                          ? Colors.secondary
                          : Colors.scoreLow,
                    },
                  ]}
                >
                  {lp.avgScore.toFixed(1)}/10
                </Text>
              </View>
            )}

            {/* CTA */}
            {!isLocked && (
              <View
                style={[
                  styles.levelBtn,
                  {
                    backgroundColor: isCompleted
                      ? Colors.accent
                      : theme.color,
                  },
                ]}
              >
                <Text style={styles.levelBtnText}>
                  {isCompleted ? "Review Level" : "Continue"}
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={Colors.white}
                />
              </View>
            )}

            {isLocked && (
              <Text style={styles.lockMessage}>
                🔒 {level.unlockRequirement}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
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
  title: {
    ...Typography.h1,
    marginBottom: Spacing.xl,
  },

  /* Progress card */
  progressCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  progressTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  progressCount: {
    ...Typography.h3,
    fontWeight: "800",
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.borderLight,
    overflow: "hidden",
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: 10,
    borderRadius: 5,
  },
  progressSub: {
    ...Typography.caption,
    color: Colors.textMuted,
  },

  /* Badges */
  badgesRow: {
    marginBottom: Spacing.xl,
  },
  badgesLabel: {
    ...Typography.label,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  badgesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  badgeChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondaryLight + "30",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.round,
  },
  badgeEmoji: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  badgeName: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: "600",
  },

  /* Section */
  sectionLabel: {
    ...Typography.label,
    color: Colors.primary,
    marginBottom: Spacing.lg,
  },

  /* Level cards */
  levelCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  levelCardLocked: {
    opacity: 0.6,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.round,
    marginBottom: Spacing.md,
  },
  statusIcon: {
    fontSize: 14,
    marginRight: Spacing.xs,
  },
  statusText: {
    ...Typography.label,
    fontSize: 10,
    fontWeight: "800",
  },
  levelHeader: {
    marginBottom: Spacing.sm,
  },
  levelName: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  levelDifficulty: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  levelDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
  topicsList: {
    marginBottom: Spacing.md,
  },
  topicRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs + 2,
  },
  topicBullet: {
    fontSize: 13,
    marginRight: Spacing.sm,
  },
  topicText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    flex: 1,
  },
  moreText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontStyle: "italic",
    marginTop: Spacing.xs,
    marginLeft: Spacing.xl,
  },
  avgRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  avgLabel: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginRight: Spacing.sm,
  },
  avgValue: {
    ...Typography.h3,
    fontWeight: "800",
  },
  levelBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    gap: Spacing.sm,
  },
  levelBtnText: {
    ...Typography.h3,
    color: Colors.white,
    fontSize: 16,
  },
  lockMessage: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: Spacing.sm,
  },
});
