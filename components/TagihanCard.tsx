import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { styled } from "nativewind";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";
import {icons, images} from "@/constants";



const TagihanCard = () => {
  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-slate-100">
        {/* Header */}
          <View className="absolute top-16 left-5 flex flex-row items-center">
            <TouchableOpacity
              onPress={() => {
                router.replace("/(tabs)/home");
              }}
            >
              <View className="w-10 h-10 rounded-xl border border-gray-300 items-center justify-center">
                {/* Tambahkan ikon kembali */}
                <Image
                  source={icons.backArrow} // Pastikan path ikon benar
                  resizeMode="contain"
                  className="w-6 h-6"
                  tintColor="#000000"
                />
              </View>
            </TouchableOpacity>
            <Text className="text-black text-xl font-JakartaSemiBold ml-5">
              Tagihan PDAM
            </Text>
          </View>

        {/* Konten Utama */}
        <View className="p-5">

        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default TagihanCard;
