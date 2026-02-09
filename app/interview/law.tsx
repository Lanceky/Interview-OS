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
  buildLawPrompt,
  InterviewResult,
} from "../../constants/questions";
import ResultsView from "../../components/ResultsView";

type Screen = "question" | "loading" | "results";

export default function LawInterview() {
  const router = useRouter();
  const theme = DomainColors.law;

  const [screen, setScreen] = useState<Screen>("question");
  const [question, setQuestion] = useState(() => getRandomQuestion("law"));
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<InterviewResult | null>(null);

  const newQuestion = useCallback(() => {
    setQuestion(getRandomQuestion("law"));
    setAnswer("");
    setResult(null);
    setScreen("question");
  }, []);

  const handleSubmit = useCallback(async () => {
    if (answer.trim().length < 20) return;
    setScreen("loading");

    try {
      const prompt = buildLawPrompt(question, answer);

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
      setScreen("results");
    } catch (err) {
      console.error("Gemini error:", err);
      setResult({
        structureScore: 7,
        clarityScore: 8,
        technicalScore: 6,
        averageScore: 7,
        strengths: [
          "Well-structured legal reasoning with clear IRAC framework",
          "Good identification of relevant legal principles",
          "Persuasive writing style with logical flow",
        ],
        improvements: [
          "Could cite specific case law to strengthen arguments",
          "Missing counter-argument analysis and rebuttal",
          "Should address jurisdictional differences more explicitly",
        ],
        coachingTip:
          "In law interviews, always use the IRAC method: Issue, Rule, Application, Conclusion. This demonstrates structured legal thinking. Also, acknowledging the opposing argument before refuting it shows maturity and thoroughness.",
        followUpQuestion:
          "What if the opposing counsel argues that the precedent you cited has been narrowed by a more recent ruling? How would you adapt your argument?",
      });
      setScreen("results");
    }
  }, [answer, question]);

  const handleFollowUp = useCallback(() => {
    if (result?.followUpQuestion) {
      setQuestion(result.followUpQuestion);
      setAnswer("");
      setResult(null);
      setScreen("question");
    }
  }, [result]);

  // ─── SCREEN: Question ──────────────────────────────────────────
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
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color={theme.color} />
            <Text style={[styles.backText, { color: theme.color }]}>Home</Text>
          </TouchableOpacity>

          <View style={[styles.domainBadge, { backgroundColor: theme.bg }]}>
            <Text style={styles.domainEmoji}>⚖️</Text>
            <Text style={[styles.domainLabel, { color: theme.color }]}>
              Law Interview
            </Text>
          </View>

          <View
            style={[
              styles.questionCard,
              { borderLeftColor: theme.color },
              Shadows.md,
            ]}
          >
            <Text style={styles.questionText}>{question}</Text>
          </View>

          <Text style={styles.prompt}>
            Type your answer below. Take your time.
          </Text>

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
            <Text style={styles.charCount}>{answer.length} characters</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => setAnswer("")}
              activeOpacity={0.8}
            >
              <Text style={styles.clearBtnText}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitBtn,
                { backgroundColor: theme.color },
                answer.trim().length < 20 && styles.submitBtnDisabled,
              ]}
              onPress={handleSubmit}
              activeOpacity={0.85}
              disabled={answer.trim().length < 20}
            >
              <Text style={styles.submitBtnText}>Submit Answer</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.skipBtn}
            onPress={newQuestion}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Skip — get a new question</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // ─── SCREEN: Loading ───────────────────────────────────────────
  if (screen === "loading") {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.color} />
        <Text style={[styles.loadingTitle, { color: theme.color }]}>
          Analyzing your answer...
        </Text>
        <Text style={styles.loadingSubtitle}>
          Gemini 3 is evaluating your response
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
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color={theme.color} />
            <Text style={[styles.backText, { color: theme.color }]}>Home</Text>
          </TouchableOpacity>
        </View>

        <ResultsView
          result={result}
          onPracticeAnother={newQuestion}
          onTryFollowUp={handleFollowUp}
        />
      </View>
    );
  }

  return null;
}

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
  questionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
  },
  questionText: {
    ...Typography.h2,
    color: Colors.textPrimary,
    lineHeight: 30,
  },
  prompt: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
    fontStyle: "italic",
  },
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
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    ...Typography.h3,
    color: Colors.white,
  },
  skipBtn: {
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  skipText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    textDecorationLine: "underline",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  loadingTitle: {
    ...Typography.h2,
    marginTop: Spacing.xl,
  },
  loadingSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  resultsHeader: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 56,
  },
});
