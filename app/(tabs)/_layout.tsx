import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Radius } from "@/constants/theme";
import { AuthContext } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs, useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  const { isAuthenticated, checkForAuth } = useContext(AuthContext);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];

  useEffect(() => {
    const authCheck = async () => {
      if (!isAuthenticated) {
        const success = await checkForAuth();
        if (!success) router.replace("/(auth)/login");
      }
    };
    authCheck();
  }, []);

  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: C.tint,
        tabBarInactiveTintColor: C.textSecondary,

        tabBarStyle: {
          backgroundColor: C.surface,
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: colorScheme === "dark" ? 0.25 : 0.06,
          shadowRadius: 12,
          elevation: 12,
          height: isWeb ? 56 : Platform.OS === "ios" ? 82 : 62,
          paddingBottom: isWeb ? 6 : Platform.OS === "ios" ? 24 : 8,
          paddingTop: isWeb ? 6 : 8,
          paddingHorizontal: 0,
        },

        tabBarLabelStyle: {
          fontSize: isWeb ? 12 : 11,
          fontWeight: "600",
          letterSpacing: 0,
          flexShrink: 0,
        },

        tabBarItemStyle: {
          borderRadius: Radius.md,
          flex: 1,
          minWidth: 0,
          paddingHorizontal: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={focused ? 26 : 24} name="square.grid.2x2.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={focused ? 26 : 24} name="magnifyingglass" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={focused ? 26 : 24} name="person.circle" color={color} />
          ),
        }}
      />

      <Tabs.Screen name="todo/create"      options={{ href: null }} />
      <Tabs.Screen name="todo/[id]/edit"   options={{ href: null }} />
      <Tabs.Screen name="todo/[id]/view"   options={{ href: null }} />
      <Tabs.Screen name="list/create"      options={{ href: null }} />
      <Tabs.Screen name="list/[id]/edit"   options={{ href: null }} />
      <Tabs.Screen name="list/[id]/view"   options={{ href: null }} />
      <Tabs.Screen name="list/[id]/public" options={{ href: null }} />
    </Tabs>
  );
}