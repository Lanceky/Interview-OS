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

interface TechDomainHomeProps {
  onBack: () => void;
  onLearningPath: () => void;
  onRandomPractice: () => void;
}

export default function TechDomainHome({
  onBack,
  onLearningPath,
  onRandomPractice,
}: TechDomainHomeProps) {
  const theme = DomainColors.tech;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Back */}
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Ionicons name="arrow-back" size={22} color={theme.color} />
        <Text style={[styles.backText, { color: theme.color }]}>Home</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.emoji}>💻</Text>
        <Text style={[styles.title, { color: theme.color }]}>
          Tech Interview
        </Text>
        <Text style={styles.subtitle}>
          Master technical interviews from fundamentals to advanced system design.
        </Text>
      </View>

      {/* Learning Path Card */}
      <TouchableOpacity
        style={[styles.modeCard, { backgroundColor: theme.bg }, Shadows.md]}
        activeOpacity={0.85}
        onPress={onLearningPath}
      >
        <View style={styles.modeCardHeader}>
          <View
            style={[styles.modeIcon, { backgroundColor: theme.color }]}
          >
            <Ionicons name="map" size={26} color={Colors.white} />
          </View>
          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>RECOMMENDED</Text>
          </View>
        </View>

        <Text style={[styles.modeTitle, { color: theme.color }]}>
          📚 Learning Path
        </Text>
        <Text style={styles.modeDescription}>
          Structured 4-level journey from fundamentals to advanced system design.
          Unlock levels as you progress. Earn badges.
        </Text>

        <View style={styles.modeFeatures}>
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>📖</Text>
            <Text style={styles.featureText}>
              20 curated questions across 4 levels
            </Text>
          </View>
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>🔓</Text>
            <Text style={styles.featureText}>
              Unlock harder levels by scoring well
            </Text>
          </View>
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>🏆</Text>
            <Text style={styles.featureText}>
              Earn badges and track your progress
            </Text>
          </View>
        </View>

        <View style={[styles.modeBtn, { backgroundColor: theme.color }]}>
          <Text style={styles.modeBtnText}>Start Learning Path</Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.white} />
        </View>
      </TouchableOpacity>

      {/* Random Practice Card */}
      <TouchableOpacity
        style={[styles.modeCard, { backgroundColor: Colors.surface }, Shadows.md]}
        activeOpacity={0.85}
        onPress={onRandomPractice}
      >
        <View style={styles.modeCardHeader}>
          <View
            style={[styles.modeIcon, { backgroundColor: Colors.secondary }]}
          >
            <Ionicons name="shuffle" size={26} color={Colors.white} />
          </View>
        </View>

        <Text style={[styles.modeTitle, { color: Colors.secondary }]}>
          🎲 Random Practice
        </Text>
        <Text style={styles.modeDescription}>
          Jump straight into random tech interview questions. No structure, no
          unlocking — just practice.
        </Text>

        <View style={[styles.modeBtn, { backgroundColor: Colors.secondary }]}>
          <Text style={styles.modeBtnText}>Start Random Practice</Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.white} />
        </View>
      </TouchableOpacity>
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
  header: {
    alignItems: "center",
    marginBottom: Spacing.xxl,
  },
  emoji: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.h1,
    textAlign: "center",
  },
  subtitle: {
    ...Typography.body,
    textAlign: "center",
    marginTop: Spacing.sm,
    color: Colors.textSecondary,
  },
  modeCard: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  modeCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  modeIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.round,
    justifyContent: "center",
    alignItems: "center",
  },
  modeBadge: {
    marginLeft: Spacing.md,
    backgroundColor: Colors.accent + "20",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.round,
  },
  modeBadgeText: {
    ...Typography.label,
    color: Colors.accent,
    fontSize: 10,
    fontWeight: "800",
  },
  modeTitle: {
    ...Typography.h2,
    marginBottom: Spacing.sm,
  },
  modeDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  modeFeatures: {
    marginBottom: Spacing.lg,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  featureIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  featureText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  modeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md + 2,
    borderRadius: Radius.lg,
    gap: Spacing.sm,
  },
  modeBtnText: {
    ...Typography.h3,
    color: Colors.white,
  },
});
