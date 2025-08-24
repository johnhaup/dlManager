import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import React from "react";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColors } from "@/styles/useThemeColors";

export default function TabLayout() {
  const [backgroundColor, activeIcon, inactiveIcon] = useThemeColors([
    "screenBackground",
    "active",
    "inactive",
  ]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeIcon,
        tabBarInactiveTintColor: inactiveIcon,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: backgroundColor,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="web"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="web" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
