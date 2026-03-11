import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppDispatch, useAppSelector } from "../store";
import { logout } from "../store/slices/authSlice";
import { Colors, Typography, Spacing, BorderRadius } from "../theme";

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => dispatch(logout()),
      },
    ]);
  };

  const settings = [
    {
      icon: "🎯",
      label: "Sleep Goal",
      value: `${user?.sleepGoal?.targetHours ?? 8}h per night`,
    },
    {
      icon: "🌙",
      label: "Target Bedtime",
      value: user?.sleepGoal?.bedtime ?? "22:00",
    },
    {
      icon: "⏰",
      label: "Target Wake Time",
      value: user?.sleepGoal?.wakeTime ?? "06:00",
    },
    { icon: "🌍", label: "Timezone", value: user?.timezone ?? "UTC" },
    { icon: "🔔", label: "Notifications", value: "Enabled" },
  ];

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["#1a1040", Colors.background]}
        style={styles.header}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sleep Settings</Text>
          {settings.map(({ icon, label, value }) => (
            <View key={label} style={styles.settingRow}>
              <Text style={styles.settingIcon}>{icon}</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>{label}</Text>
                <Text style={styles.settingValue}>{value}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 60, paddingBottom: 40, alignItems: "center" },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  avatarText: {
    fontSize: Typography.size["3xl"],
    color: Colors.white,
    fontFamily: Typography.fontDisplay,
  },
  name: {
    fontSize: Typography.size["2xl"],
    color: Colors.text,
    fontFamily: Typography.fontDisplay,
  },
  email: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  body: { padding: Spacing.lg, paddingBottom: Spacing["3xl"] },
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
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingIcon: { fontSize: 20, width: 32 },
  settingInfo: { flex: 1, marginLeft: Spacing.md },
  settingLabel: { fontSize: Typography.size.sm, color: Colors.textSecondary },
  settingValue: {
    fontSize: Typography.size.md,
    color: Colors.text,
    fontFamily: Typography.fontMedium,
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: Colors.error + "22",
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.error + "55",
  },
  logoutText: {
    color: Colors.error,
    fontSize: Typography.size.lg,
    fontFamily: Typography.fontSemiBold,
  },
});
