import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";
import { icons } from "@/constants"; // Pastikan path icons benar
import { createInvoice } from "@/lib/xenditService";
const DetailTagihan = () => {
  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-slate-100">
        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Header */}
          {/* Header */}
          <View className="flex-row justify-between items-center m-5 mt-10">
            <TouchableOpacity onPress={() => router.back()}>
              <View className="bg-white p-2 rounded-lg border border-gray-200">
                <Image
                  source={icons.arrowDown}
                  className="w-6 h-6 origin-top rotate-90"
                  tintColor="#000"
                />
              </View>
            </TouchableOpacity>
            <Text className="font-bold text-lg">Detail Tagihan</Text>
            <View className="w-6" />
          </View>

          {/* Main Content */}
          <View className="px-5">
            {/* Section: Jumlah Air */}
            <View className="flex flex-row justify-between items-center bg-white py-4 px-4 rounded-lg shadow-sm">
              <View className="flex flex-row items-center">
                <Image
                  source={icons.drops} // Ikon air
                  resizeMode="contain"
                  className="w-8 h-8"
                  tintColor="#469ADBFF"
                />
                <Text className="text-sky-600 text-xl font-semibold ml-2">
                  19 m³
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-gray-400 font-base">Wilayah</Text>
                <Text className="text-gray-600 font-medium">Tangerang</Text>
              </View>
            </View>

            {/* Section: Pelanggan */}
            <View className="mt-5 bg-white rounded-lg shadow-sm">
              <Text className="text-gray-700 font-bold px-4 py-2">
                Pelanggan
              </Text>
              <View className="border-t border-gray-200">
                {[
                  { label: "ID Pelanggan", value: "2836432718" },
                  { label: "Nama Pelanggan", value: "Khaidir Ali Rahman" },
                  { label: "Alamat", value: "Curug - Tangerang" },
                ].map((item, index) => (
                  <View
                    key={index}
                    className="flex flex-row justify-between px-4 py-2 border-b border-gray-200"
                  >
                    <Text className="text-gray-500">{item.label}</Text>
                    <Text className="text-gray-900 font-medium">
                      {item.value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Section: Tagihan */}
            <View className="mt-5 bg-white rounded-lg shadow-sm">
              <Text className="text-gray-700 font-bold px-4 py-2">Tagihan</Text>
              <View className="border-t border-gray-200">
                {[
                  { label: "Periode", value: "November 2024" },
                  { label: "Golongan", value: "Rumah Tangga A3" },
                  { label: "Pemakaian", value: "19 m³" },
                  { label: "DN Meter", value: "Rp. 5000" },
                  { label: "Denda", value: "Rp. 0" },
                  { label: "Tagihan", value: "Rp. 234.000" },
                  { label: "Biaya Admin", value: "Rp. 2.500" },
                  { label: "Total", value: "Rp. 236.500", bold: true },
                ].map((item, index) => (
                  <View
                    key={index}
                    className="flex flex-row justify-between px-4 py-2 border-b border-gray-200"
                  >
                    <Text
                      className={`${
                        item.bold
                          ? "font-semibold text-black text-xl"
                          : "text-gray-500"
                      }`}
                    >
                      {item.label}
                    </Text>
                    <Text
                      className={`${
                        item.bold
                          ? "font-semibold text-green-700 text-xl"
                          : "font-medium text-gray-900"
                      }`}
                    >
                      {item.value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Button Pilih Metode Pembayaran */}
            <TouchableOpacity
              onPress={() => {
                alert("Metode Pembayaran Dipilih");
              }}
              className="absolute bottom-[-110] left-0 right-0 bg-sky-500 rounded-full py-2 m-5 items-center shadow-lg"
            >
              <Text className="text-white text-lg font-semibold">
                Pilih Metode Pembayaran
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

export default DetailTagihan;
