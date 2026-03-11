import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppDispatch, useAppSelector } from "../store";
import {
  fetchLatestSession,
  fetchInsights,
  fetchSummary,
} from "../store/slices/sleepSlice";
import { Colors, Typography, Spacing, BorderRadius } from "../theme";
import { format } from "date-fns";

const { width } = Dimensions.get("window");

const ScoreRing = ({ score }: { score: number }) => {
  const color =
    score >= 85
      ? Colors.success
      : score >= 65
        ? Colors.primary
        : score >= 45
          ? Colors.warning
          : Colors.error;

  return (
    <View style={[styles.scoreRing, { borderColor: color }]}>
      <Text style={[styles.scoreNumber, { color }]}>{score}</Text>
      <Text style={styles.scoreLabel}>Score</Text>
    </View>
  );
};

export default function HomeScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { latest, insights, summary } = useAppSelector((s) => s.sleep);
  const { user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchLatestSession());
    dispatch(fetchInsights());
    dispatch(fetchSummary("week"));
  }, []);

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12
      ? "Good morning"
      : greetingHour < 17
        ? "Good afternoon"
        : "Good evening";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={["#1a1040", Colors.background]}
        style={styles.header}
      >
        <Text style={styles.greeting}>{greeting},</Text>
        <Text style={styles.userName}>{user?.name?.split(" ")[0]} 👋</Text>
        <Text style={styles.date}>{format(new Date(), "EEEE, MMM d")}</Text>
      </LinearGradient>

      {/* Last night */}
      {latest ? (
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate("SleepDetail", { sessionId: latest._id })
          }
          activeOpacity={0.85}
        >
          <Text style={styles.cardTitle}>Last Night</Text>
          <View style={styles.lastNightRow}>
            <View style={styles.lastNightStats}>
              <Text style={styles.statBig}>
                {((latest.totalDurationMinutes || 0) / 60).toFixed(1)}h
              </Text>
              <Text style={styles.statSub}>Duration</Text>
              <View style={styles.divider} />
              <Text style={styles.statBig}>{latest.interruptions ?? 0}x</Text>
              <Text style={styles.statSub}>Woke up</Text>
            </View>
            {latest.qualityScore != null && (
              <ScoreRing score={latest.qualityScore} />
            )}
          </View>
          {latest.mood && (
            <Text style={styles.moodTag}>Feeling: {latest.mood}</Text>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>No data yet</Text>
          <Text style={styles.emptyText}>Log your first sleep session ✨</Text>
        </View>
      )}

      {/* Weekly summary */}
      {summary && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>This Week</Text>
          <View style={styles.summaryGrid}>
            {[
              { label: "Avg Sleep", value: `${summary.avgDurationHours}h` },
              { label: "Avg Quality", value: `${summary.avgQualityScore}` },
              { label: "Consistency", value: `${summary.consistencyScore}%` },
              { label: "Sessions", value: `${summary.sessions}` },
            ].map((item) => (
              <View key={item.label} style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{item.value}</Text>
                <Text style={styles.summaryLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <View style={[styles.card, { marginBottom: Spacing["3xl"] }]}>
          <Text style={styles.cardTitle}>Insights</Text>
          {insights.map((insight, i) => (
            <View
              key={i}
              style={[
                styles.insightRow,
                {
                  borderLeftColor:
                    Colors[
                      insight.type === "warning"
                        ? "warning"
                        : insight.type === "success"
                          ? "success"
                          : "info"
                    ],
                },
              ]}
            >
              <Text style={styles.insightText}>{insight.message}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 60, paddingBottom: 32, paddingHorizontal: Spacing.xl },
  greeting: {
    fontSize: Typography.size.lg,
    color: Colors.textSecondary,
    fontFamily: Typography.fontBody,
  },
  userName: {
    fontSize: Typography.size["3xl"],
    color: Colors.text,
    fontFamily: Typography.fontDisplay,
    marginTop: 4,
  },
  date: { fontSize: Typography.size.sm, color: Colors.textMuted, marginTop: 6 },
  card: {
    margin: Spacing.lg,
    marginBottom: 0,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: Typography.size.md,
    color: Colors.textSecondary,
    fontFamily: Typography.fontMedium,
    marginBottom: Spacing.lg,
  },
  lastNightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastNightStats: { flex: 1 },
  statBig: {
    fontSize: Typography.size["3xl"],
    color: Colors.text,
    fontFamily: Typography.fontDisplay,
  },
  statSub: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
    width: 40,
  },
  moodTag: {
    marginTop: Spacing.md,
    color: Colors.textSecondary,
    fontSize: Typography.size.sm,
  },
  emptyText: { color: Colors.textMuted, fontSize: Typography.size.md },
  scoreRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreNumber: {
    fontSize: Typography.size["2xl"],
    fontFamily: Typography.fontDisplay,
  },
  scoreLabel: { fontSize: Typography.size.xs, color: Colors.textMuted },
  summaryGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.md },
  summaryItem: {
    width: (width - Spacing.xl * 2 - Spacing.md * 3) / 2 - Spacing.xl * 2,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    flex: 1,
    minWidth: 100,
  },
  summaryValue: {
    fontSize: Typography.size.xl,
    color: Colors.primary,
    fontFamily: Typography.fontDisplay,
  },
  summaryLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  insightRow: {
    borderLeftWidth: 3,
    paddingLeft: Spacing.md,
    marginBottom: Spacing.md,
  },
  insightText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.sm,
    lineHeight: 20,
  },
});
