import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { format, differenceInMinutes } from "date-fns";
import { sleepAPI } from "../services/api";
import { Colors, Typography, Spacing, BorderRadius } from "../theme";

export default function SleepDetailScreen({ route, navigation }: any) {
  const { sessionId } = route.params;
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    sleepAPI
      .getOne(sessionId)
      .then(({ data }) => setSession(data.data.session));
  }, []);

  const handleDelete = () => {
    Alert.alert("Delete session?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await sleepAPI.delete(sessionId);
          navigation.goBack();
        },
      },
    ]);
  };

  if (!session)
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );

  const scoreColor =
    (session.qualityScore ?? 0) >= 75
      ? Colors.success
      : (session.qualityScore ?? 0) >= 55
        ? Colors.warning
        : Colors.error;

  return (
    <ScrollView style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Score hero */}
      <View style={styles.hero}>
        <Text style={styles.heroDate}>
          {format(new Date(session.bedtime), "EEEE, MMMM d")}
        </Text>
        {session.qualityScore != null && (
          <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
            <Text style={[styles.scoreNum, { color: scoreColor }]}>
              {session.qualityScore}
            </Text>
            <Text style={styles.scoreSubtitle}>Quality Score</Text>
          </View>
        )}
      </View>

      {/* Stats */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sleep Times</Text>
        <View style={styles.statGrid}>
          {[
            {
              label: "Bedtime",
              value: format(new Date(session.bedtime), "HH:mm"),
            },
            {
              label: "Wake Time",
              value: format(new Date(session.wakeTime), "HH:mm"),
            },
            {
              label: "Duration",
              value: `${((session.totalDurationMinutes || 0) / 60).toFixed(1)}h`,
            },
            { label: "Wake-ups", value: `${session.interruptions ?? 0}x` },
          ].map(({ label, value }) => (
            <View key={label} style={styles.statBox}>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Mood & notes */}
      {(session.mood || session.notes) && (
        <View style={styles.card}>
          {session.mood && (
            <>
              <Text style={styles.cardTitle}>How you felt</Text>
              <Text style={styles.moodText}>{session.mood}</Text>
            </>
          )}
          {session.notes && (
            <>
              <Text style={[styles.cardTitle, { marginTop: Spacing.lg }]}>
                Notes
              </Text>
              <Text style={styles.notesText}>{session.notes}</Text>
            </>
          )}
        </View>
      )}

      {/* Tags */}
      {session.tags?.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tags</Text>
          <View style={styles.tagRow}>
            {session.tags.map((tag: string) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Delete */}
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteText}>Delete Session</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loading: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { color: Colors.textSecondary },
  backBtn: {
    paddingTop: 60,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  backText: { color: Colors.primary, fontSize: Typography.size.md },
  hero: {
    alignItems: "center",
    padding: Spacing.xl,
    paddingBottom: Spacing["2xl"],
  },
  heroDate: {
    fontSize: Typography.size.lg,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreNum: {
    fontSize: Typography.size["4xl"],
    fontFamily: Typography.fontDisplay,
  },
  scoreSubtitle: { fontSize: Typography.size.xs, color: Colors.textMuted },
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
  statGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.md },
  statBox: {
    flex: 1,
    minWidth: 100,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
  },
  statValue: {
    fontSize: Typography.size.xl,
    color: Colors.text,
    fontFamily: Typography.fontDisplay,
  },
  statLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  moodText: {
    fontSize: Typography.size.xl,
    color: Colors.text,
    textTransform: "capitalize",
  },
  notesText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.md,
    lineHeight: 24,
  },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  tag: {
    backgroundColor: Colors.primary + "33",
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  tagText: { color: Colors.primary, fontSize: Typography.size.sm },
  deleteBtn: {
    margin: Spacing.xl,
    backgroundColor: Colors.error + "22",
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.error + "55",
  },
  deleteText: {
    color: Colors.error,
    fontSize: Typography.size.md,
    fontFamily: Typography.fontSemiBold,
  },
});
