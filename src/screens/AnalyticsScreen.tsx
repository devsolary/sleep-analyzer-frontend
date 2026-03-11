import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppDispatch, useAppSelector } from "../store";
import {
  fetchTrends,
  fetchSummary,
  fetchInsights,
} from "../store/slices/sleepSlice";
import { Colors, Typography, Spacing, BorderRadius } from "../theme";

const { width } = Dimensions.get("window");
const PERIODS = ["week", "month", "year"] as const;

const StageBar = ({ stage, pct, color }: any) => (
  <View style={styles.stageRow}>
    <Text style={styles.stageLabel}>{stage}</Text>
    <View style={styles.barTrack}>
      <View
        style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]}
      />
    </View>
    <Text style={styles.stagePct}>{pct}%</Text>
  </View>
);

export default function AnalyticsScreen() {
  const dispatch = useAppDispatch();
  const { summary, trends, insights } = useAppSelector((s) => s.sleep);
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("week");

  useEffect(() => {
    dispatch(fetchSummary(period));
    dispatch(
      fetchTrends(period === "week" ? 7 : period === "month" ? 30 : 365),
    );
    dispatch(fetchInsights());
  }, [period]);

  // Simple bar chart using View widths
  const maxDuration = trends.length
    ? Math.max(...trends.map((t: any) => t.durationHours || 0))
    : 1;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={["#1a1040", Colors.background]}
        style={styles.header}
      >
        <Text style={styles.title}>Analytics</Text>
        <View style={styles.periodRow}>
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodBtn, period === p && styles.periodBtnActive]}
              onPress={() => setPeriod(p)}
            >
              <Text
                style={[
                  styles.periodText,
                  period === p && { color: Colors.primary },
                ]}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.body}>
        {/* Summary stats */}
        {summary && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Summary</Text>
            <View style={styles.statsGrid}>
              {[
                {
                  label: "Avg Duration",
                  value: `${summary.avgDurationHours}h`,
                  color: Colors.primary,
                },
                {
                  label: "Avg Quality",
                  value: `${summary.avgQualityScore}`,
                  color: Colors.secondary,
                },
                {
                  label: "Consistency",
                  value: `${summary.consistencyScore}%`,
                  color: Colors.success,
                },
                {
                  label: "Total Sleep",
                  value: `${summary.totalSleepHours}h`,
                  color: Colors.accent,
                },
              ].map((s) => (
                <View key={s.label} style={styles.statItem}>
                  <Text style={[styles.statValue, { color: s.color }]}>
                    {s.value}
                  </Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Sleep duration chart */}
        {trends.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sleep Duration</Text>
            <View style={styles.barChart}>
              {trends.slice(-14).map((t: any, i: number) => {
                const barH =
                  maxDuration > 0
                    ? Math.round((t.durationHours / maxDuration) * 80)
                    : 0;
                const isGood = t.durationHours >= 7 && t.durationHours <= 9;
                return (
                  <View key={i} style={styles.barWrapper}>
                    <Text style={styles.barValue}>{t.durationHours}h</Text>
                    <View style={styles.barContainer}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: Math.max(4, barH),
                            backgroundColor: isGood
                              ? Colors.primary
                              : Colors.warning,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.barDate}>{t.date?.slice(5)}</Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.chartLegend}>
              <View
                style={[styles.legendDot, { backgroundColor: Colors.primary }]}
              />
              <Text style={styles.legendText}>7-9h (ideal)</Text>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: Colors.warning, marginLeft: Spacing.lg },
                ]}
              />
              <Text style={styles.legendText}>outside range</Text>
            </View>
          </View>
        )}

        {/* Sleep stages */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sleep Stages (avg)</Text>
          {[
            { stage: "Deep", pct: 20, color: Colors.stage.deep },
            { stage: "REM", pct: 22, color: Colors.stage.rem },
            { stage: "Light", pct: 50, color: Colors.stage.light },
            { stage: "Awake", pct: 8, color: Colors.stage.awake },
          ].map((s) => (
            <StageBar key={s.stage} {...s} />
          ))}
        </View>

        {/* Insights */}
        {insights?.length > 0 && (
          <View style={[styles.card, { marginBottom: Spacing["3xl"] }]}>
            <Text style={styles.cardTitle}>Insights</Text>
            {insights.map((insight: any, i: number) => (
              <View
                key={i}
                style={[
                  styles.insightChip,
                  {
                    borderLeftColor:
                      insight.type === "warning"
                        ? Colors.warning
                        : insight.type === "success"
                          ? Colors.success
                          : Colors.info,
                  },
                ]}
              >
                <Text style={styles.insightText}>{insight.message}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 60, paddingBottom: 32, paddingHorizontal: Spacing.xl },
  title: {
    fontSize: Typography.size["3xl"],
    color: Colors.text,
    fontFamily: Typography.fontDisplay,
  },
  periodRow: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.lg },
  periodBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  periodBtnActive: { borderColor: Colors.primary },
  periodText: { color: Colors.textSecondary, fontSize: Typography.size.sm },
  body: { padding: Spacing.lg },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: Typography.size.md,
    color: Colors.textSecondary,
    fontFamily: Typography.fontMedium,
    marginBottom: Spacing.lg,
  },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.md },
  statItem: {
    flex: 1,
    minWidth: 100,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
  },
  statValue: {
    fontSize: Typography.size.xl,
    fontFamily: Typography.fontDisplay,
  },
  statLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  barChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    height: 120,
  },
  barWrapper: { flex: 1, alignItems: "center" },
  barContainer: { width: "100%", height: 80, justifyContent: "flex-end" },
  bar: { width: "100%", borderRadius: 3 },
  barValue: { fontSize: 8, color: Colors.textMuted, marginBottom: 2 },
  barDate: { fontSize: 8, color: Colors.textMuted, marginTop: 4 },
  chartLegend: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.md,
  },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 4 },
  legendText: { fontSize: Typography.size.xs, color: Colors.textMuted },
  stageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  stageLabel: {
    width: 45,
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 4,
    marginHorizontal: Spacing.sm,
  },
  barFill: { height: 8, borderRadius: 4 },
  stagePct: {
    width: 36,
    textAlign: "right",
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
  },
  insightChip: {
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
