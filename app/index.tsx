import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
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
} from "../constants/theme";

const DOMAINS = [
  {
    key: "tech" as const,
    label: "Tech",
    icon: "code-slash" as const,
    topics: "System design, debugging, technical projects, architectural decisions",
  },
  {
    key: "finance" as const,
    label: "Finance",
    icon: "bar-chart" as const,
    topics: "Financial analysis, risk assessment, portfolios, market interpretation",
  },
  {
    key: "law" as const,
    label: "Law",
    icon: "scale" as const,
    topics: "Legal research, case analysis, contract review, argumentation",
  },
];

export default function Index() {
  const router = useRouter();

  const handleSelectDomain = (domain: string) => {
    router.push(`/interview/${domain}` as any);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.emoji}>🎤</Text>
        <Text style={styles.title}>InterviewOS</Text>
        <Text style={styles.subtitle}>
          AI-powered interview coaching{"\n"}Practice. Get scored. Improve.
        </Text>
      </View>

      {/* Domain Selection */}
      <Text style={styles.sectionLabel}>CHOOSE YOUR DOMAIN</Text>

      {DOMAINS.map((domain) => {
        const theme = DomainColors[domain.key];
        return (
          <TouchableOpacity
            key={domain.key}
            style={[styles.card, { backgroundColor: theme.bg }, Shadows.md]}
            activeOpacity={0.85}
            onPress={() => handleSelectDomain(domain.key)}
          >
            <View style={[styles.iconCircle, { backgroundColor: theme.color }]}>
              <Ionicons name={domain.icon} size={26} color={Colors.white} />
            </View>
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: theme.color }]}>
                {domain.label}
              </Text>
              <Text style={styles.cardTopics}>{domain.topics}</Text>
            </View>
            <View style={[styles.arrowCircle, { backgroundColor: theme.color + "18" }]}>
              <Ionicons name="chevron-forward" size={20} color={theme.color} />
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Footer tagline */}
      <View style={styles.footer}>
        <View style={styles.footerBadge}>
          <Text style={styles.footerBadgeText}>⚡ 3–5 min sessions</Text>
        </View>
        <Text style={styles.footerText}>
          Unlimited practice. Real-time AI feedback.
        </Text>
        <Text style={styles.footerSubtext}>
          Democratizing interview coaching for everyone.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.xl,
    paddingTop: 64,
    paddingBottom: 40,
  },
  header: {
    marginBottom: Spacing.xxl,
    alignItems: "center",
  },
  emoji: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.hero,
    color: Colors.primary,
    textAlign: "center",
  },
  subtitle: {
    ...Typography.body,
    textAlign: "center",
    marginTop: Spacing.sm,
    color: Colors.textSecondary,
  },
  sectionLabel: {
    ...Typography.label,
    color: Colors.primary,
    marginBottom: Spacing.lg,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg + 2,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md + 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: Radius.round,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md + 2,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    ...Typography.h3,
    marginBottom: 2,
  },
  cardTopics: {
    ...Typography.caption,
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.round,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: Spacing.sm,
  },
  footer: {
    marginTop: Spacing.xxl,
    alignItems: "center",
  },
  footerBadge: {
    backgroundColor: Colors.primary + "14",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.round,
    marginBottom: Spacing.md,
  },
  footerBadgeText: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: "600",
  },
  footerText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: "600",
    marginBottom: 4,
  },
  footerSubtext: {
    ...Typography.caption,
    fontStyle: "italic",
  },
});
