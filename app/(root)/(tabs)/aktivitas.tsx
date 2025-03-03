import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { icons } from "@/constants";
import { api } from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";

const TransactionHistory = () => {
  const [selectedFilter, setSelectedFilter] = useState("Semua");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState(null);

  // Fungsi untuk format rupiah
  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Fetch customer data and transaction history
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil kredensial dan token dari AsyncStorage
        const username = await AsyncStorage.getItem("username");
        const password = await AsyncStorage.getItem("password");
        const dataToken = await AsyncStorage.getItem("userToken");
        const consId = process.env.EXPO_PUBLIC_WH8_CONS_ID?.replace(/[",]/g, "") || "admin-wh8";
        const accessToken = await AsyncStorage.getItem("access_token");

        if (!username || !password || !dataToken || !accessToken) {
          console.log("Missing credentials:", { username, password, dataToken, accessToken });
          // Jika kredensial belum lengkap, simpan username dan password secara sementara
          await AsyncStorage.setItem("username", username || "");
          await AsyncStorage.setItem("password", password || "");
          return;
        }

        // Fetch customer data
        const customerResponse = await api.post(
          "/getDataConstumer",
          {
            username,
            password,
            data_token: dataToken,
            cons_id: consId,
            access_token: accessToken,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (customerResponse.data.metadata.code === 200) {
          setCustomerData(customerResponse.data.response.data);
        } else {
          console.log("Customer data fetch error:", customerResponse.data.metadata.message);
        }

        // Construct requestBody dynamically using the fetched customer data
        const { meter_number, id_constumer } = customerResponse.data.response.data;

        const requestBody = {
          username,
          password,
          data_token: dataToken,
          cons_id: consId,
          access_token: accessToken,
          meter_number,
          id_constumer,
        };

        // Fetch transaction history
        const response = await api.post("https://pdampolman.airmurah.id/api/histotyTrans", requestBody, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.data.metadata.code === 200) {
          setTransactions(response.data.response.data);
        } else {
          console.log("API Error:", response.data.metadata.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data berdasarkan status
  const filteredTransactions =
    selectedFilter === "Semua"
      ? transactions
      : transactions.filter((t) => (selectedFilter === "Sukses" ? t.status === "Transaksi Selesai" : t.status !== "Transaksi Selesai"));

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  // Format tanggal ke format yang lebih rapi
  const formatDate = (dateStr, timeStr) => {
    try {
      const [day, month, year] = dateStr.split("-");
      const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      return `${day} ${months[parseInt(month) - 1]} ${year} • ${timeStr}`;
    } catch (error) {
      return `${dateStr} • ${timeStr}`;
    }
  };

  return (
    <View className="flex-1 bg-gray-50 pb-20">
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={["#004EBA", "#2181FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="pt-14 pb-6 px-5 rounded-b-3xl">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold flex-1">Riwayat Transaksi</Text>
          <TouchableOpacity className="bg-white/20 p-2 rounded-full">
            <Feather name="help-circle" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Filter Tabs */}
      <View className="mx-5 mt-6 mb-4">
        <View className="flex-row bg-gray-100 p-1 rounded-full">
          {["Semua", "Sukses", "Gagal"].map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              className={`flex-1 py-2.5 px-4 rounded-full ${selectedFilter === filter ? "bg-white shadow" : ""}`}
              style={
                selectedFilter === filter
                  ? {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 2,
                    }
                  : {}
              }>
              <Text className={`text-center font-medium ${selectedFilter === filter ? "text-blue-600" : "text-gray-500"}`}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <View className="flex-1 justify-center items-center p-5">
          <Feather name="inbox" size={64} color="#CBD5E1" />
          <Text className="mt-4 text-gray-500 text-lg font-medium">Tidak ada transaksi</Text>
          <Text className="text-gray-400 text-center mt-2">Transaksi yang {selectedFilter.toLowerCase()} akan muncul di sini</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          {filteredTransactions.map((transaction, index) => {
            const isSuccess = transaction.status === "Transaksi Selesai";

            return (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
                style={{
                  shadowColor: "#D6D6D6FF",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3.84,
                  elevation: 2,
                }}
                activeOpacity={0.7}>
                {/* Bagian Atas - Judul dan Harga */}
                <View className="flex-row items-start mb-4">
                  <View className={`w-10 h-10 rounded-full ${isSuccess ? "bg-green-100" : "bg-red-100"} justify-center items-center mr-3`}>
                    <Feather name={isSuccess ? "check" : "x"} size={20} color={isSuccess ? "#10B981" : "#EF4444"} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-800 text-lg font-semibold">Token Air</Text>
                  </View>
                  <Text className="text-lg font-bold text-green-600 ml-2">{formatRupiah(Number(transaction.purchase))}</Text>
                </View>

                {/* Bagian Tengah - Informasi Token */}
                <View className="bg-gray-50 px-4 py-3 rounded-xl mb-4">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-gray-500 font-medium">Token</Text>
                    <Text className="text-gray-800 font-bold">{transaction.token_number}</Text>
                  </View>
                </View>

                {/* Bagian Tengah - Informasi Tanggal */}
                <View className="bg-gray-50 px-4 py-3 rounded-xl mb-4">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-gray-500 font-medium">Tanggal</Text>
                    <Text className="text-gray-800">{formatDate(transaction.date_trans, transaction.time)}</Text>
                  </View>
                </View>

                {/* Bagian Bawah - Status dan Aksi */}
                <View className="flex-row justify-between items-center pt-2">
                  <View className={`px-3 py-1 rounded-full ${isSuccess ? "bg-green-50" : "bg-red-50"}`}>
                    <Text className={`text-sm ${isSuccess ? "text-green-700" : "text-red-700"}`}>
                      {isSuccess ? "Transaksi Selesai" : "Transaksi Gagal"}
                    </Text>
                  </View>
                  <TouchableOpacity className={`rounded-full px-4 py-2 ${isSuccess ? "bg-blue-600" : "bg-red-600"}`}>
                    <Text className="text-white font-medium text-sm">{isSuccess ? "Beli Lagi" : "Laporkan"}</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

export default TransactionHistory;
