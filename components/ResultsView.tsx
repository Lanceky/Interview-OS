import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
  getScoreColor,
  getScoreBg,
  getScoreLabel,
} from "../constants/theme";
import ScoreCard from "./ScoreCard";
import { InterviewResult } from "../constants/questions";

interface ResultsViewProps {
  result: InterviewResult;
  onPracticeAnother: () => void;
  onTryFollowUp?: () => void;
}

export default function ResultsView({
  result,
  onPracticeAnother,
  onTryFollowUp,
}: ResultsViewProps) {
  const avgColor = getScoreColor(result.averageScore);
  const avgBg = getScoreBg(result.averageScore);
  const avgLabel = getScoreLabel(result.averageScore);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Overall Score ─────────────────────────── */}
      <View style={[styles.overallCard, { backgroundColor: avgBg }, Shadows.md]}>
        <Text style={[styles.overallScore, { color: avgColor }]}>
          {result.averageScore.toFixed(1)} / 10
        </Text>
        <Text style={[styles.overallLabel, { color: avgColor }]}>
          {avgLabel}
        </Text>
      </View>

      {/* ── Score Breakdown ───────────────────────── */}
      <Text style={styles.sectionLabel}>SCORE BREAKDOWN</Text>

      <ScoreCard
        icon="📐"
        label="STRUCTURE"
        score={result.structureScore}
        description="Logical organization and problem breakdown"
      />
      <ScoreCard
        icon="💡"
        label="CLARITY"
        score={result.clarityScore}
        description="Writing quality and ease of understanding"
      />
      <ScoreCard
        icon="🔧"
        label="TECHNICAL"
        score={result.technicalScore}
        description="Technical accuracy and depth of knowledge"
      />

      {/* ── Strengths ─────────────────────────────── */}
      <View style={[styles.feedbackCard, styles.strengthsCard, Shadows.sm]}>
        <Text style={styles.feedbackTitle}>✅ WHAT YOU DID WELL</Text>
        {result.strengths.map((s, i) => (
          <View key={i} style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>{s}</Text>
          </View>
        ))}
      </View>

      {/* ── Improvements ──────────────────────────── */}
      <View style={[styles.feedbackCard, styles.improvementsCard, Shadows.sm]}>
        <Text style={styles.feedbackTitle}>📈 AREAS TO IMPROVE</Text>
        {result.improvements.map((imp, i) => (
          <View key={i} style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>{imp}</Text>
          </View>
        ))}
      </View>

      {/* ── Coach's Tip ───────────────────────────── */}
      <View style={[styles.tipCard, Shadows.sm]}>
        <Text style={styles.tipTitle}>🎯 COACH'S TIP</Text>
        <Text style={styles.tipBody}>{result.coachingTip}</Text>
      </View>

      {/* ── Follow-up Question ────────────────────── */}
      <View style={[styles.followUpCard, Shadows.sm]}>
        <Text style={styles.followUpTitle}>📌 FOLLOW-UP QUESTION</Text>
        <Text style={styles.followUpBody}>{result.followUpQuestion}</Text>
      </View>

      {/* ── Action Buttons ────────────────────────── */}
      <View style={styles.actions}>
        {onTryFollowUp && (
          <TouchableOpacity
            style={[styles.btn, styles.btnSecondary]}
            activeOpacity={0.85}
            onPress={onTryFollowUp}
          >
            <Text style={styles.btnSecondaryText}>Try the Follow-up</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          activeOpacity={0.85}
          onPress={onPracticeAnother}
        >
          <Text style={styles.btnPrimaryText}>Practice Another Question</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: 60,
  },

  /* ── Overall ───────────────────────── */
  overallCard: {
    alignItems: "center",
    paddingVertical: Spacing.xxl,
    borderRadius: Radius.xl,
    marginBottom: Spacing.xl,
  },
  overallScore: {
    fontSize: 48,
    fontWeight: "900",
  },
  overallLabel: {
    ...Typography.h3,
    marginTop: Spacing.xs,
  },

  /* ── Section ───────────────────────── */
  sectionLabel: {
    ...Typography.label,
    color: Colors.primary,
    marginBottom: Spacing.lg,
  },

  /* ── Feedback cards ────────────────── */
  feedbackCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
  },
  strengthsCard: {
    borderLeftColor: Colors.accent,
  },
  improvementsCard: {
    borderLeftColor: Colors.secondary,
  },
  feedbackTitle: {
    ...Typography.label,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: Spacing.sm,
  },
  bulletDot: {
    ...Typography.body,
    color: Colors.textMuted,
    marginRight: Spacing.sm,
    lineHeight: 22,
  },
  bulletText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    flex: 1,
  },

  /* ── Tip ────────────────────────────── */
  tipCard: {
    backgroundColor: "#FFFDE7",
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: "#FFD93D",
  },
  tipTitle: {
    ...Typography.label,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  tipBody: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  /* ── Follow-up ─────────────────────── */
  followUpCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  followUpTitle: {
    ...Typography.label,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  followUpBody: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontStyle: "italic",
  },

  /* ── Actions ───────────────────────── */
  actions: {
    gap: Spacing.md,
  },
  btn: {
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: "center",
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
  },
  btnPrimaryText: {
    ...Typography.h3,
    color: Colors.white,
  },
  btnSecondary: {
    backgroundColor: Colors.secondary,
  },
  btnSecondaryText: {
    ...Typography.h3,
    color: Colors.white,
  },
});
