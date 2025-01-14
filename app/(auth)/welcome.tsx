import { router } from "expo-router";
import { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import { LinearGradient } from "expo-linear-gradient";

import CustomButton from "@/components/CustomButton";
import { onboarding } from "@/constants";

const Welcome = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === onboarding.length - 1;

  return (
    <View className="flex-1 bg-white">
      <LinearGradient colors={["#2181FF", "#004EBA"]} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} className="h-[30%] rounded-b-lg">
        <SafeAreaView>
          <View className="w-full flex justify-end items-end p-5">
            <TouchableOpacity
              onPress={() => {
                router.replace("/(auth)/sign-up");
              }}>
              <Text className="text-white text-base font-semibold">Lewati</Text>
            </TouchableOpacity>
          </View>
          <View className="px-4 pb-4">
            <Text className="text-white text-3xl font-bold text-center">Selamat Datang di{"\n"}Mata Air</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View className="flex-1 px-5 -mt-[65px] mb-[20px]">
        <View
          className="bg-white rounded-xl px-5 pt-6 pb-8 flex-1"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 5, height: 5 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 10,
          }}>
          <Swiper
            ref={swiperRef}
            loop={false}
            dot={<View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full" />}
            activeDot={<View className="w-[32px] h-[4px] mx-1 bg-[#0286FF] rounded-full" />}
            onIndexChanged={(index) => setActiveIndex(index)}
            paginationStyle={{ bottom: 0 }}>
            {onboarding.map((item) => (
              <View key={item.id} className="flex items-center justify-start p-5">
                <Image source={item.image} className="w-full h-[250px]" resizeMode="contain" />
                <View className="flex flex-row items-center justify-center w-full mt-6">
                  <Text className="text-black text-xl font-bold mx-10 text-center">{item.title}</Text>
                </View>
                <Text className="text-sm text-center text-[#858585] mx-10 mt-3">{item.description}</Text>
              </View>
            ))}
          </Swiper>

          <TouchableOpacity
            onPress={() => (isLastSlide ? router.replace("/(auth)/sign-up") : swiperRef.current?.scrollBy(1))}
            className="rounded-xl overflow-hidden mt-4">
            <LinearGradient colors={["#2181FF", "#004EBA"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="py-2">
              <Text className="text-white text-lg font-semibold text-center">{isLastSlide ? "Mulai Sekarang" : "Selanjutnya"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Welcome;
