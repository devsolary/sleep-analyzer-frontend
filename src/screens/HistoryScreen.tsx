// HistoryScreen.tsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchSessions } from "../store/slices/sleepSlice";
import { Colors, Typography, Spacing, BorderRadius } from "../theme";

export const HistoryScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { sessions, isLoading } = useAppSelector((s) => s.sleep);

  useEffect(() => {
    dispatch(fetchSessions({}));
  }, []);

  const moodEmoji: Record<string, string> = {
    terrible: "😫",
    poor: "😔",
    fair: "😐",
    good: "😊",
    excellent: "🌟",
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a1040", Colors.background]}
        style={styles.header}
      >
        <Text style={styles.title}>Sleep History</Text>
        <Text style={styles.subtitle}>{sessions.length} sessions recorded</Text>
      </LinearGradient>

      <FlatList
        data={sessions}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: Spacing.lg }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.sessionCard}
            onPress={() =>
              navigation.navigate("SleepDetail", { sessionId: item._id })
            }
          >
            <View style={styles.sessionLeft}>
              <Text style={styles.sessionDate}>
                {format(new Date(item.bedtime), "EEE, MMM d")}
              </Text>
              <Text style={styles.sessionTime}>
                {format(new Date(item.bedtime), "HH:mm")} →{" "}
                {format(new Date(item.wakeTime), "HH:mm")}
              </Text>
              {item.mood && (
                <Text style={styles.sessionMood}>
                  {moodEmoji[item.mood]} {item.mood}
                </Text>
              )}
            </View>
            <View style={styles.sessionRight}>
              <Text style={styles.sessionDuration}>
                {((item.totalDurationMinutes || 0) / 60).toFixed(1)}h
              </Text>
              {item.qualityScore != null && (
                <View
                  style={[
                    styles.scoreChip,
                    {
                      backgroundColor:
                        item.qualityScore >= 75
                          ? Colors.success + "33"
                          : item.qualityScore >= 55
                            ? Colors.warning + "33"
                            : Colors.error + "33",
                    },
                  ]}
                >
                  <Text style={styles.scoreChipText}>{item.qualityScore}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 60, paddingBottom: 32, paddingHorizontal: Spacing.xl },
  title: {
    fontSize: Typography.size["3xl"],
    color: Colors.text,
    fontFamily: Typography.fontDisplay,
  },
  subtitle: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  sessionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sessionLeft: { flex: 1 },
  sessionDate: {
    fontSize: Typography.size.md,
    color: Colors.text,
    fontFamily: Typography.fontSemiBold,
  },
  sessionTime: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  sessionMood: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    marginTop: 4,
    textTransform: "capitalize",
  },
  sessionRight: { alignItems: "flex-end", gap: 6 },
  sessionDuration: {
    fontSize: Typography.size.xl,
    color: Colors.primary,
    fontFamily: Typography.fontDisplay,
  },
  scoreChip: {
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  scoreChipText: {
    fontSize: Typography.size.xs,
    color: Colors.text,
    fontFamily: Typography.fontSemiBold,
  },
});

export default HistoryScreen;
