import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { icons } from "@/constants";

const TransactionHistory = () => {
  const [selectedFilter, setSelectedFilter] = useState("Semua");

  const transactions = [
    {
      type: "Token Air",
      customer: "Sumarno",
      date: "7 Januari 2025",
      amount: "Rp. 50.000,-",
      status: "Sukses",
    },
    {
      type: "Tagihan Air",
      customer: "Sumarno",
      date: "5 Januari 2025",
      amount: "Rp. 62.500,-",
      status: "Gagal",
    },
    {
      type: "Token Air",
      customer: "Sumarno",
      date: "1 Januari 2025",
      amount: "Rp. 25.000,-",
      status: "Sukses",
    },
    {
      type: "Token Air",
      customer: "Sumarno",
      date: "29 Desember 2024",
      amount: "Rp. 50.000,-",
      status: "Sukses",
    },
    {
      type: "Token Air",
      customer: "Sumarno",
      date: "20 Desember 2024",
      amount: "Rp. 75.000,-",
      status: "Gagal",
    },
  ];

  const filteredTransactions =
    selectedFilter === "Semua"
      ? transactions
      : transactions.filter((t) => (selectedFilter === "Sukses" ? t.status === "Sukses" : t.status === "Gagal"));

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <LinearGradient
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 2.84,
          elevation: 5,
        }}
        colors={["#004EBA", "#2181FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 h-[15%]  pb-5 px-4 rounded-b-xl justify-end">
        <View className="flex-row justify-between items-center ">
          <Text className="text-white text-xl font-bold">Riwayat Transaksi</Text>
          <TouchableOpacity>
            <Image source={icons.question} className="w-5 h-5" tintColor="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Filter Tabs */}
      <View className="flex-row space-x-3 px-4 mt-4 mb-2">
        {["Sukses", "Gagal", "Semua"].map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded-full border ${selectedFilter === filter ? "bg-blue-500 border-blue-500" : "bg-white border-gray-300"}`}>
            <Text className={`${selectedFilter === filter ? "text-white" : "text-gray-600"} font-medium`}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transaction List */}
      <ScrollView className="flex-1 px-4">
        {filteredTransactions.map((transaction, index) => (
          <View key={index} className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-sm">
            <View className="flex-row justify-between items-start">
              <View className="flex-row items-center space-x-3">
                {transaction.status === "Sukses" ? (
                  <View className="w-8">
                    <Image source={icons.checkmark} className="w-6 h-6" tintColor="#22C55E" />
                  </View>
                ) : (
                  <View className="w-8">
                    <Image source={icons.error} className="w-6 h-6" tintColor="#EF4444" />
                  </View>
                )}
                <View>
                  <Text className="text-lg font-semibold">{transaction.type}</Text>
                  <Text className="text-gray-600">{transaction.customer}</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-gray-600 mb-1">{transaction.date}</Text>
                <Text className="text-lg font-bold">{transaction.amount}</Text>
                <TouchableOpacity className={`rounded-lg w-24 py-2 mt-2 ${transaction.status === "Sukses" ? "bg-green-700" : "bg-red-700"}`}>
                  <Text className="text-white text-center font-base text-sm">{transaction.status === "Sukses" ? "Beli Lagi" : "Laporkan"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default TransactionHistory;
