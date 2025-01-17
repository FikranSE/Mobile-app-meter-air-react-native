// _layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import TabIcon from "@/components/TabIcon"; // Adjust the import path as needed
import { icons } from "@/constants";

export default function Layout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        // Disable default tab labels
        tabBarShowLabel: false,
        // Style the tab bar
        tabBarStyle: {
          height: 65,
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderTopWidth: 0,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
        },
        // Set a gradient background for the tab bar
        tabBarBackground: () => (
          <LinearGradient
            colors={["#004EBA", "#2181FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          />
        ),
      }}>
      {/* Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Halaman Utama",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon source={icons.home} focused={focused} label="Halaman Utama" />,
        }}
      />

      {/* Aktivitas Tab */}
      <Tabs.Screen
        name="aktivitas"
        options={{
          title: "Riwayat",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon source={icons.list} focused={focused} label="Riwayat" />,
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Pengaturan",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon source={icons.setting} focused={focused} label="Pengaturan" />,
        }}
      />
    </Tabs>
  );
}
