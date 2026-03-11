import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppDispatch, useAppSelector } from "../store";
import { logSleepSession } from "../store/slices/sleepSlice";
import { Colors, Typography, Spacing, BorderRadius } from "../theme";

const MOODS = ["terrible", "poor", "fair", "good", "excellent"] as const;
const MOOD_EMOJIS: Record<string, string> = {
  terrible: "😫",
  poor: "😔",
  fair: "😐",
  good: "😊",
  excellent: "🌟",
};

const TimeInput = ({ label, value, onChange }: any) => (
  <View style={styles.timeBlock}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.timeInput}
      value={value}
      onChangeText={onChange}
      placeholder="HH:MM"
      placeholderTextColor={Colors.textMuted}
      keyboardType="numbers-and-punctuation"
    />
  </View>
);

export default function SleepLogScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((s) => s.sleep);

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const [bedDate] = useState(yesterday.toISOString().slice(0, 10));
  const [wakeDate] = useState(today.toISOString().slice(0, 10));
  const [bedTime, setBedTime] = useState("22:00");
  const [wakeTime, setWakeTime] = useState("06:00");
  const [mood, setMood] = useState<(typeof MOODS)[number] | null>(null);
  const [notes, setNotes] = useState("");
  const [interruptions, setInterruptions] = useState("0");

  const handleSubmit = async () => {
    if (!bedTime || !wakeTime) {
      Alert.alert("Missing info", "Please enter bedtime and wake time");
      return;
    }

    const bedtime = new Date(`${bedDate}T${bedTime}:00`);
    const waketime = new Date(`${wakeDate}T${wakeTime}:00`);

    if (waketime <= bedtime) {
      Alert.alert("Invalid times", "Wake time must be after bedtime");
      return;
    }

    const payload = {
      bedtime: bedtime.toISOString(),
      wakeTime: waketime.toISOString(),
      mood,
      notes,
      interruptions: parseInt(interruptions, 10) || 0,
      dataSource: "manual",
    };

    const result = await dispatch(logSleepSession(payload));
    if (logSleepSession.fulfilled.match(result)) {
      Alert.alert("✅ Logged!", "Your sleep session was saved.", [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ]);
    } else {
      Alert.alert("Error", "Failed to save sleep session");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={["#1a1040", Colors.background]}
        style={styles.header}
      >
        <Text style={styles.title}>Log Sleep</Text>
        <Text style={styles.subtitle}>Record your last sleep session</Text>
      </LinearGradient>

      <View style={styles.form}>
        {/* Times */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🌙 Sleep Times</Text>
          <View style={styles.timeRow}>
            <TimeInput label="Bedtime" value={bedTime} onChange={setBedTime} />
            <TimeInput
              label="Wake Time"
              value={wakeTime}
              onChange={setWakeTime}
            />
          </View>
        </View>

        {/* Mood */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>😴 How did you feel?</Text>
          <View style={styles.moodRow}>
            {MOODS.map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.moodBtn, mood === m && styles.moodBtnActive]}
                onPress={() => setMood(m)}
              >
                <Text style={styles.moodEmoji}>{MOOD_EMOJIS[m]}</Text>
                <Text
                  style={[
                    styles.moodLabel,
                    mood === m && { color: Colors.primary },
                  ]}
                >
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Interruptions */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>⚡ Wake-ups</Text>
          <View style={styles.counterRow}>
            {["0", "1", "2", "3", "4", "5+"].map((n) => (
              <TouchableOpacity
                key={n}
                style={[
                  styles.counterBtn,
                  interruptions === n && styles.counterBtnActive,
                ]}
                onPress={() => setInterruptions(n)}
              >
                <Text
                  style={[
                    styles.counterText,
                    interruptions === n && { color: Colors.primary },
                  ]}
                >
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📝 Notes (optional)</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Anything notable about your sleep..."
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.submitText}>Save Sleep Session</Text>
          )}
        </TouchableOpacity>
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
  subtitle: {
    fontSize: Typography.size.md,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  form: { padding: Spacing.lg, paddingBottom: Spacing["4xl"] },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: Typography.size.md,
    color: Colors.text,
    fontFamily: Typography.fontSemiBold,
    marginBottom: Spacing.lg,
  },
  timeRow: { flexDirection: "row", gap: Spacing.lg },
  timeBlock: { flex: 1 },
  inputLabel: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  timeInput: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    fontSize: Typography.size.xl,
    color: Colors.text,
    fontFamily: Typography.fontDisplay,
    textAlign: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  moodRow: { flexDirection: "row", gap: Spacing.sm, flexWrap: "wrap" },
  moodBtn: {
    flex: 1,
    minWidth: 55,
    alignItems: "center",
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  moodBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryDark + "33",
  },
  moodEmoji: { fontSize: 22 },
  moodLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    marginTop: 4,
    textTransform: "capitalize",
  },
  counterRow: { flexDirection: "row", gap: Spacing.sm },
  counterBtn: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  counterBtnActive: { borderColor: Colors.primary },
  counterText: {
    fontSize: Typography.size.md,
    color: Colors.textSecondary,
    fontFamily: Typography.fontSemiBold,
  },
  notesInput: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    color: Colors.text,
    fontSize: Typography.size.md,
    minHeight: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: "center",
    marginTop: Spacing.md,
  },
  submitText: {
    color: Colors.white,
    fontSize: Typography.size.lg,
    fontFamily: Typography.fontSemiBold,
  },
});
