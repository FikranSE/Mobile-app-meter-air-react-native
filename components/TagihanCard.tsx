import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";
import { icons } from "@/constants"; // Pastikan icons memiliki semua ikon yang dibutuhkan
import WaveBackground from "@/components/WaveBackground";
import NewsSection from "@/components/NewsSection";
import RiwayatTransaksi from "@/components/RiwayatTransaksi";

const TagihanCard = () => {
  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-slate-100">
        {/* Bungkus konten dengan ScrollView */}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Header */}
          <View className="absolute top-16 left-5 flex flex-row items-center">
            <TouchableOpacity
              onPress={() => {
                router.replace("/(tabs)/home");
              }}
            >
              <View className="w-10 h-10 rounded-xl border border-gray-300 items-center justify-center">
                <Image
                  source={icons.arrowDown} // Pastikan path ikon benar
                  resizeMode="contain"
                  className="w-6 h-6 origin-top rotate-90"
                  tintColor="#000000"
                />
              </View>
            </TouchableOpacity>
            <Text className="text-black text-xl font-JakartaSemiBold ml-5">
              Tagihan PDAM
            </Text>
          </View>

          {/* Peringatan */}
          <View className="mt-32 mx-5 px-5 py-3 bg-rose-100 border-l-4 border-red-500 flex-row items-center rounded-lg">
            <View className="p-1 bg-white w-8 h-8 mr-3 rounded-lg">
              <Image
                source={icons.warning} // Ikon peringatan
                resizeMode="contain"
                className="w-full h-full"
              />
            </View>
            <Text className="text-gray-600 font-base text-s flex-1">
              Harap lakukan pembayaran sebelum tanggal 20 November 2024
            </Text>
          </View>

          {/* Informasi Tagihan */}
          <View className="overflow-hidden flex flex-col justify-center items-center m-5 p-5 bg-sky-100 rounded-lg shadow-lg">
            <WaveBackground />
            <Text className="text-gray-500 text-s">
              Pemakaian Bulan November 2024
            </Text>
            <Text className="text-sky-600 font-semibold text-lg">
              Khaidir - ID 2836432718
            </Text>
            <View className="flex-row items-center mt-1">
              <Image
                source={icons.drops} // Pastikan path ikon benar
                resizeMode="contain"
                className="w-9 h-9"
                tintColor="#38bdf8"
              />
              <Text className="text-sky-600 font-semibold text-2xl ml-2">
                19 m³
              </Text>
            </View>
            <Text className="text-sky-800 text-2xl font-bold mt-1">
              Rp. 34.500
            </Text>
            {/* Tombol Bayar */}
            <View className="px-5 w-full mt-4">
              <TouchableOpacity
                className="bg-sky-400 rounded-full py-2 items-center shadow-md"
                onPress={() => {
                  router.push('/(root)/bayar-tagihan');
                }}
              >
                <Text className="text-white font-bold text-lg">
                  Bayar Sekarang
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Riwayat Transaksi */}
          <View className="px-5">
            <RiwayatTransaksi />
          </View>

          {/* News Section */}
          <View className="px-5 mb-5">
            <NewsSection />
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

export default TagihanCard;
