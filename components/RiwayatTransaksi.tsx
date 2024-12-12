import React from "react";
import { useRouter } from "expo-router";

import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { icons, images } from "@/constants";

const RiwayatTransaksi = () => {
  const router = useRouter();
  // Data transaksi (contoh)
  const transactions = [
    { id: "004231123", date: "Jumat, 22 Nov 2024", amount: "Rp.34.500" },
    { id: "004231124", date: "Sabtu, 23 Nov 2024", amount: "Rp.45.000" },
    { id: "004231125", date: "Minggu, 24 Nov 2024", amount: "Rp.50.000" },
    { id: "004231126", date: "Senin, 25 Nov 2024", amount: "Rp.60.000" },
    { id: "004231127", date: "Selasa, 26 Nov 2024", amount: "Rp.70.000" },
    { id: "004231128", date: "Rabu, 27 Nov 2024", amount: "Rp.80.000" },
  ];

  return (
    <View>
      <View className="flex-row justify-between items-center mt-5 mb-4">
        <Text className="text-lg font-bold">Riwayat Transaksi</Text>
        <TouchableOpacity
          onPress={() => {
            router.push("/(root)/(tabs)/aktivitas");
          }}
        >
          <Text className="text-gray-500">Lihat semua</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={
          transactions.length > 3 ? { maxHeight: 275 } : {}
        }
      >
        {transactions.length > 3 ? (
          transactions.map((transaction, index) => (
            <TouchableOpacity
              key={index}
              className="mb-3 flex flex-row justify-between items-center p-4 py-3 bg-white shadow-lg rounded-xl"
            >
              <View className="flex justify-center items-center w-14 h-14 rounded-lg bg-sky-100">
                <Image
                  source={icons.drops}
                  className="w-10 h-10"
                  tintColor="#0ea5e9"
                />
              </View>

              <View className="flex-1 mx-2 flex-col justify-start">
                <Text className="font-semibold text-base text-gray-800">
                  Tagihan PDAM
                </Text>
                <Text className="text-sm text-gray-500">
                  ID {transaction.id}
                </Text>
              </View>

              <View className="flex flex-col justify-start items-end">
                <Text className="text-xs text-gray-400">
                  {transaction.date}
                </Text>
                <Text className="font-semibold text-black text-base">
                  {transaction.amount}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="flex items-center justify-center p-4">
            <Image
              source={images.noResult}
              className="w-40 h-40"
              resizeMode="contain"
            />
            <Text className="text-gray-500 mt-4 text-center">
              Tidak ada riwayat tersedia saat ini
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default RiwayatTransaksi;
