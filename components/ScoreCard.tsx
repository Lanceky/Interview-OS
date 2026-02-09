import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
  getScoreColor,
} from "../constants/theme";

interface ScoreCardProps {
  icon: string;
  label: string;
  score: number;
  description: string;
}

export default function ScoreCard({
  icon,
  label,
  score,
  description,
}: ScoreCardProps) {
  const color = getScoreColor(score);
  const percent = (score / 10) * 100;

  return (
    <View style={[styles.card, Shadows.sm]}>
      {/* Header row */}
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.score, { color }]}>{score}/10</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.trackOuter}>
        <View
          style={[
            styles.trackFill,
            { width: `${percent}%`, backgroundColor: color },
          ]}
        />
      </View>

      {/* Description */}
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm + 2,
  },
  icon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  label: {
    ...Typography.label,
    color: Colors.textPrimary,
    flex: 1,
  },
  score: {
    fontSize: 18,
    fontWeight: "800",
  },
  trackOuter: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderLight,
    marginBottom: Spacing.sm + 2,
    overflow: "hidden",
  },
  trackFill: {
    height: 8,
    borderRadius: 4,
  },
  description: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
