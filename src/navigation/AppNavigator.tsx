import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';
import { useAppSelector } from '../store';
import { Colors } from '../theme';

import HomeScreen        from '../screens/HomeScreen';
import SleepLogScreen    from '../screens/SleepLogScreen';
import AnalyticsScreen   from '../screens/AnalyticsScreen';
import HistoryScreen     from '../screens/HistoryScreen';
import ProfileScreen     from '../screens/ProfileScreen';
import LoginScreen       from '../screens/auth/LoginScreen';
import RegisterScreen    from '../screens/auth/RegisterScreen';
import SleepDetailScreen from '../screens/SleepDetailScreen';

export type RootStackParamList = {
  Main:        undefined;
  SleepDetail: { sessionId: string };
};

export type AuthStackParamList = {
  Login:    undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home:      undefined;
  Log:       undefined;
  Analytics: undefined;
  History:   undefined;
  Profile:   undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab       = createBottomTabNavigator<MainTabParamList>();

const TabIcon = ({ label, focused }: { label: string; focused: boolean }) => (
  <Text style={{ fontSize: 20 }}>
    {{ Home: '🌙', Log: '➕', Analytics: '📊', History: '📋', Profile: '👤' }[label]}
  </Text>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textMuted,
      tabBarLabelStyle: { fontSize: 10, marginBottom: 4 },
      tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
    })}
  >
    <Tab.Screen name="Home"      component={HomeScreen} />
    <Tab.Screen name="Log"       component={SleepLogScreen} />
    <Tab.Screen name="Analytics" component={AnalyticsScreen} />
    <Tab.Screen name="History"   component={HistoryScreen} />
    <Tab.Screen name="Profile"   component={ProfileScreen} />
  </Tab.Navigator>
);

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login"    component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

export const AppNavigator = () => {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Main"        component={MainTabs} />
          <RootStack.Screen name="SleepDetail" component={SleepDetailScreen} />
        </RootStack.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 60,
    paddingTop: 4,
  },
});