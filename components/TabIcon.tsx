// TabIcon.tsx
import React from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";

// Define the props for the TabIcon component
interface TabIconProps {
  source: ImageSourcePropType;
  focused: boolean;
  label: string;
}

const TabIcon: React.FC<TabIconProps> = ({ source, focused, label }) => (
  <View className="items-center space-y-1 -mt-2">
    {/* Icon Container */}
    <View className={`items-center justify-center ${focused ? "bg-white rounded-full w-16 h-7" : ""}`}>
      <Image source={source} tintColor={focused ? "#2181FF" : "white"} resizeMode="contain" className="w-6 h-5" />
    </View>
    {/* Label */}
    <Text className={`text-xs ${focused ? "text-[#2181FF]" : "text-white"}`}>{label}</Text>
  </View>
);

export default TabIcon;
