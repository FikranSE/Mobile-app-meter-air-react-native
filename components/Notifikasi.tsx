import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { icons, images } from "@/constants";

const RiwayatTransaksi = () => {
  const router = useRouter();

  // State untuk menyimpan daftar transaksi dan input pencarian
  const [searchQuery, setSearchQuery] = useState("");

  const transactions = [
    {
      id: "004231123",
      title: "Pembayaran PDAM",
      date: "Jumat, 22 Nov 2024",
      amount: "Rp.236.500",
      status: 1, // 1 = Transaksi Berhasil
    },
    {
      id: "004231124",
      title: "Token Air",
      date: "Jumat, 22 Nov 2024",
      amount: "Rp.52.000",
      status: 0, // 0 = Transaksi Gagal
    },
  ];

  // Filter transaksi berdasarkan input pencarian
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.id.includes(searchQuery) || // Cari berdasarkan ID
      transaction.amount.includes(searchQuery) // Cari berdasarkan jumlah
  );

  return (
    <View className="p-4 bg-gray-100 h-full">
      {/* Header */}
      <View className="flex-row justify-between items-center my-5">
        <TouchableOpacity onPress={() => router.back()}>
          <View className="bg-white p-2 rounded-lg border border-gray-200">
            <Image
              source={icons.arrowDown}
              className="w-6 h-6 origin-top rotate-90"
              tintColor="#000"
            />
          </View>
        </TouchableOpacity>
        <Text className="font-bold text-lg">Notifikasi</Text>
        <View className="w-6" />
      </View>

      {/* Search and Filter */}
      <View className="flex-row items-center justify-between py-4">
        {/* TextInput Pencarian */}
        <TextInput
          placeholder="Cari ID atau Jumlah"
          value={searchQuery}
          onChangeText={setSearchQuery} // Update state saat input berubah
          className="flex-1 border border-gray-300 rounded-lg p-3 bg-white"
        />

        {/* Tombol Filter */}
        <TouchableOpacity className="ml-3 p-3 bg-white rounded-lg border border-gray-300">
          <Image
            source={icons.filter}
            className="w-6 h-6"
            resizeMode="contain"
            tintColor="#a1a1aa"
          />
        </TouchableOpacity>
      </View>

      {/* Transaction List */}
      <ScrollView>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction, index) => (
            <TouchableOpacity
              key={index}
              className="mb-3 flex flex-row items-center p-4 bg-white rounded-lg shadow-sm"
            >
              {/* Icon */}
              <View className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <Image
                  source={
                    transaction.status === 1
                      ? images.check2 // Icon for successful transaction
                      : images.close2 // Icon for failed transaction
                  }
                  className="w-6 h-6"
                />
              </View>

              {/* Transaction Details */}
              <View className="flex-1 ml-3">
                <View className="flex-col items-start">
                  {/* Status */}
                  <Text
                    className={`text-base font-semibold ${
                      transaction.status === 1
                        ? "text-teal-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.status === 1
                      ? "Transaksi Berhasil"
                      : "Transaksi Gagal"}
                  </Text>
                  {/* Title */}
                  <Text className="text-gray-600 text-s">
                    {transaction.title}
                  </Text>
                </View>
              </View>

              {/* Date and Amount */}
              <View className="flex-col items-end">
                {/* Amount */}
                <Text
                  className={`font-semibold text-base ${
                    transaction.status === 1 ? "text-green-700" : "text-red-600"
                  }`}
                >
                  {transaction.amount}
                </Text>

                {/* Date */}
                <Text className="text-sm text-gray-500">
                  {transaction.date}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text className="text-gray-500 text-center mt-10">
            Tidak ada transaksi ditemukan.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default RiwayatTransaksi;
