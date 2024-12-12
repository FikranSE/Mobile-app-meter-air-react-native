import { useUser } from "@clerk/clerk-expo";

import { router } from "expo-router";
import React from "react";
import { Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WaterBanner from "@/components/WaterBanner";
import NewsSection from "@/components/NewsSection";
import RiwayatTransaksi from "@/components/RiwayatTransaksi";
import { icons, images } from "@/constants";

const Home = () => {
  const { user } = useUser();
  

  return (
    <SafeAreaView className="bg-slate-100">
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex flex-row items-center justify-between my-5 px-5">
          <Image
            source={images.logo}
            className="w-11 h-11 rounded-full"
            alt="Logo"
            resizeMode="contain"
          />
          <Text className="text-xl font-JakartaExtraBold">
            Hai Khaidir {user?.firstName}
          </Text>
          <TouchableOpacity
            className="justify-center items-center w-10 h-10 rounded-lg border border-gray-200 bg-white"
          >
            <Image source={icons.bell} className="w-6 h-6" />
          </TouchableOpacity>
        </View>

        <View className="px-5">
          <WaterBanner />
        </View>

        <View className="flex flex-row space-x-2 mt-4 px-5">
          {/* Button Pascabayar */}
          <TouchableOpacity
            className="border border-sky-200 flex flex-row items-start justify-start py-3 px-2 bg-sky-100 rounded-xl flex-1"
            onPress={() => {
              router.replace("/(root)/tagihan-page");
            }}
          >
            <Image
              source={icons.drops}
              className="w-10 h-10 mr-2"
              tintColor="#0ea5e9"
            />
            <View className="flex flex-col">
              <Text className="text-sky-500 font-semibold text-base">
                Tagihan PDAM
              </Text>
              <Text className="text-gray-500 font-base text-sm">
                Pascabayar
              </Text>
            </View>
          </TouchableOpacity>

          {/* Button Prabayar */}
          <TouchableOpacity
            className="border border-sky-200 flex flex-row items-start justify-start py-3 px-2 bg-sky-100 rounded-xl flex-1"
            onPress={() => {
              router.replace("/(root)/beli-token");
            }}
          >
            <Image
              source={icons.teardrop}
              className="w-10 h-10 mr-2"
              tintColor="#0ea5e9"
            />
            <View className="flex flex-col">
              <Text className="text-sky-500 font-semibold text-base">
                Token Air
              </Text>
              <Text className="text-gray-500 font-base text-sm">Prabayar</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="px-5">

          {/* Transaction List Items */}
         <RiwayatTransaksi/>
        </View>

        {/* News Section */}
        <View className="px-5">
          <NewsSection />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
