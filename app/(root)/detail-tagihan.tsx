import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import Checkbox from "expo-checkbox";
import { icons } from "@/constants";

const DetailTagihan = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [expandedMethod, setExpandedMethod] = useState(null);

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-white">
        {/* Header */}
        <LinearGradient
          colors={["#004EBA", "#2181FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          className="h-[30%] rounded-b-lg shadow-xl relative">
          <View className="flex-row justify-start items-center mt-8 p-5">
            <View className="flex-row items-center space-x-2">
              <TouchableOpacity onPress={() => router.back()}>
                <Image source={icons.backArrow} className="w-5 h-5" tintColor="white" />
              </TouchableOpacity>
              <Text className="text-white text-lg font-medium">Kembali</Text>
            </View>
          </View>
          <Text className="text-white text-xl font-bold text-center mt-5">Detail Tagihan</Text>
        </LinearGradient>

        {/* Detail Card (Statis) */}
        <View
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            maxHeight: "100%",
          }}
          className="absolute top-24 left-4 right-4 bg-white rounded-lg p-5 pb-[120]">
          {/* Scrollable Content */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="pb-6">
              {/* Customer Details Section */}
              <View>
                <Text className="text-sm font-bold mb-1">Detail Pelanggan</Text>
                <View className="border-t border-dashed border-gray-300 pt-2">
                  {[
                    { label: "ID Pelanggan", value: "12345678901" },
                    { label: "Nama Pelanggan", value: "Sumarno" },
                    { label: "Alamat", value: "Ampekale - Kec. Bantoa" },
                    { label: "Golongan", value: "Rumah Tangga A3" },
                  ].map((item, index) => (
                    <View key={index} className="flex-row justify-between py-1">
                      <Text className="text-black text-xs">{item.label}</Text>
                      <Text className="text-black font-medium text-xs">{item.value}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Payment Details Section */}
              <View className="mt-4">
                <Text className="text-sm font-bold mb-1">Detail Pembayaran</Text>
                <View className="border-t border-dashed border-gray-300 pt-2">
                  {[
                    { label: "Pemakaian", value: "23m³" },
                    { label: "Tagihan", value: "Rp. 50.000,-" },
                    { label: "DN Meter", value: "Rp. 5.000,-" },
                    { label: "Denda", value: "Rp. 5.000,-" },
                    { label: "Biaya Admin", value: "Rp. 2.500,-" },
                  ].map((item, index) => (
                    <View key={index} className="flex-row justify-between py-1">
                      <Text className="text-black text-xs">{item.label}</Text>
                      <Text className="text-black font-medium text-xs">{item.value}</Text>
                    </View>
                  ))}
                </View>

                {/* Payment Method Section */}
                <View className="mt-2 border rounded-lg">
                  <Text className="text-xs p-2 font-semibold">Metode Pembayaran</Text>
                  {[
                    { icon: icons.pay, label: "QRIS", selected: true },
                    { icon: icons.pay, label: "Virtual Account BCA", selected: false },
                    {
                      icon: icons.pay,
                      label: "Tambah Metode Pembayaran",
                      selected: false,
                    },
                  ].map((method, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setExpandedMethod(expandedMethod === index ? null : index)}
                      className="border-t border-gray-300">
                      <View className="flex-row items-center justify-between p-3">
                        <View className="flex-row items-center">
                          <Image source={method.icon} className="w-3 h-3 mr-2" />
                          <Text className="text-xs">{method.label}</Text>
                        </View>
                        <Text className="text-xs">{expandedMethod === index ? "−" : "+"}</Text>
                      </View>
                      {expandedMethod === index && (
                        <View className="p-3 bg-gray-50">
                          <Text className="text-xs">Detail dan instruksi pembayaran akan ditampilkan di sini</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Checkbox Agreement */}
                <View className="flex-row items-center justify-between my-4">
                  <Text className="text-xs flex-1 mr-2">Saya telah membaca dengan seksama</Text>
                  <Checkbox value={isChecked} onValueChange={setIsChecked} color={isChecked ? "#2181FF" : undefined} />
                </View>

                {/* Total */}
                <View className="flex-row justify-between mt-3 py-2 border-t border-b border-dashed border-gray-300">
                  <Text className="text-xl font-bold">Total</Text>
                  <Text className="text-xl font-bold">Rp. 62.500,-</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        {/* Buttons */}
        <View className="absolute bottom-0 left-0 right-0 z-20 bg-transparent mx-10 mb-6">
          <TouchableOpacity onPress={() => router.replace("/(root)/detail-transaksi")} disabled={!isChecked} style={{ opacity: isChecked ? 1 : 0.5 }}>
            <LinearGradient colors={["#2181FF", "#004EBA"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="rounded-lg py-3">
              <Text className="text-white text-base font-semibold text-center">Bayar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default DetailTagihan;
