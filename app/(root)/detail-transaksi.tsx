import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Image, Alert, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { icons } from "@/constants";

const PaymentStatus = () => {
  const [showAlert, setShowAlert] = useState(false);
  const transactionData = {
    metodePembayaran: "QRIS",
    status: "Gagal", // Ubah ke "Gagal" untuk pengujian status gagal
    waktu: "10:30 AM",
    tanggal: "5 Januari 2025",
    idTransaksi: "a6e4a073171d4479811d68",
    pelanggan: {
      id: "12345678901",
      nama: "Sumarno",
      alamat: "Ampekale - Kec. Bantoa",
      golongan: "Rumah Tangga A3",
    },
    rincian: {
      pemakaian: "23m³",
      tagihan: "Rp. 50.000,-",
      dnMeter: "Rp. 5.000,-",
      denda: "Rp. 5.000,-",
      biayaAdmin: "Rp. 2.500,-",
      total: "Rp. 62.500,-",
    },
  };

  // Animation values for alert
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const showAnimatedAlert = () => {
    setShowAlert(true);
    // Reset animation values
    slideAnim.setValue(-100);
    opacity.setValue(0);

    // Start animations
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto hide after 3 seconds
    setTimeout(() => {
      hideAnimatedAlert();
    }, 3000);
  };

  const hideAnimatedAlert = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowAlert(false);
    });
  };

  const copyClipboard = async () => {
    try {
      await Clipboard.setStringAsync("12345678901");
      showAnimatedAlert();
    } catch (error) {
      Alert.alert("Error", "Gagal menyalin ID PDAM.");
    }
  };

  const isSuccess = transactionData.status === "Berhasil";

  return (
    <View className="flex-1 bg-white">
      {/* Animated Alert */}
      {showAlert && (
        <Animated.View
          style={{
            position: "absolute",
            top: 30,
            left: 0,
            right: 0,
            zIndex: 999,
            transform: [{ translateY: slideAnim }],
            opacity: opacity,
          }}>
          <View
            style={{
              backgroundColor: "#E8F5E9",
              padding: 16,
              margin: 16,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#43A047", marginBottom: 2 }}>Berhasil</Text>
              <Text style={{ fontSize: 14, color: "#43A047" }}>ID PDAM telah disalin ke clipboard</Text>
            </View>
            <TouchableOpacity onPress={hideAnimatedAlert}>
              <Image source={icons.close} style={{ width: 14, height: 14, tintColor: "#43A047" }} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
      {/* Header */}
      <LinearGradient
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        colors={["#004EBA", "#2181FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="h-[30%] rounded-b-lg shadow-xl relative">
        <View className="flex-row justify-between items-center mt-8 p-5">
          <View className="flex-row items-center space-x-2">
            <TouchableOpacity onPress={() => router.back()}>
              <Image source={icons.close} className="w-4 h-4" tintColor="white" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-medium">Tutup</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={icons.question} className="w-5 h-5" tintColor="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content Card */}
      <View
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        className="absolute top-24 left-4 right-4 bg-white rounded-lg  p-4 pb-[130]">
        {/* Icon and Title */}
        <View className="items-center mb-4">
          <View
            className={`w-14 h-14 rounded-full flex items-center justify-center border ${
              isSuccess ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500"
            }`}>
            <Image source={isSuccess ? icons.checkmark : icons.close} className="w-6 h-6" tintColor={isSuccess ? "#00C853" : "#FF0000"} />
          </View>
          <Text className="text-xl font-bold mt-2">{isSuccess ? "Pembelian Berhasil" : "Pembelian Gagal"}</Text>
        </View>

        {/* Detail Pembelian */}
        <View className="border-b border-dashed border-gray-300 pb-2 mb-2">
          <Text className="text-sm font-semibold mb-1">Detail Pembelian</Text>
          {[
            { label: "Metode Pembayaran", value: transactionData.metodePembayaran },
            { label: "Status", value: transactionData.status },
            { label: "Waktu", value: transactionData.waktu },
            { label: "Tanggal", value: transactionData.tanggal },
            { label: "ID Transaksi", value: transactionData.idTransaksi },
          ].map((item, index) => (
            <View key={index} className="flex-row justify-between mb-1 items-center">
              <Text className="text-gray-500 text-xs">{item.label}</Text>
              {item.label === "Status" ? (
                <Text className={`text-xs font-bold ${item.value === "Gagal" ? "text-red-500" : "text-green-500"}`}>{item.value}</Text>
              ) : item.label === "ID Transaksi" ? (
                <TouchableOpacity className="flex-row items-center" onPress={copyClipboard}>
                  <Text className="text-gray-800 text-xs font-bold mr-1">{item.value}</Text>
                  <Image source={icons.copy} className="w-3 h-3" />
                </TouchableOpacity>
              ) : (
                <Text className="text-gray-800 text-xs font-bold">{item.value}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Detail Pelanggan */}
        <View className="border-b border-dashed border-gray-300 pb-2 mb-2">
          <Text className="text-sm font-semibold mb-1">Detail Pelanggan</Text>
          {Object.entries(transactionData.pelanggan).map(([label, value], index) => (
            <View key={index} className="flex-row justify-between mb-1">
              <Text className="text-gray-500 text-xs">{label.replace(/_/g, " ")}</Text>
              <Text className="text-gray-800 text-xs font-bold">{value}</Text>
            </View>
          ))}
        </View>

        {/* Detail Tagihan */}
        <View className="border-b border-dashed border-gray-300 pb-2 mb-2">
          <Text className="text-sm font-semibold mb-1">Detail Tagihan</Text>
          {Object.entries(transactionData.rincian).map(([label, value], index) => (
            <View key={index} className="flex-row justify-between mb-1">
              <Text className="text-gray-500 text-xs">{label.replace(/_/g, " ")}</Text>
              <Text className="text-gray-800 text-xs font-bold">{value}</Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View className="flex-row justify-between mb-4">
          <Text className="text-xl font-bold">Total</Text>
          <Text className="text-xl font-bold">{transactionData.rincian.total}</Text>
        </View>
        {/* Buttons */}
        <View className="flex-col space-y-2 mt-3">
          <TouchableOpacity onPress={() => router.replace("/(root)/detail-transaksi")}>
            <LinearGradient colors={["#F93B3BFF", "#9F0000FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="rounded-lg py-2">
              <Text className="text-white text-base font-semibold text-center">Laporkan Masalah</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace("/(root)/detail-transaksi")}>
            <LinearGradient colors={["#2181FF", "#004EBA"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="rounded-lg py-2">
              <Text className="text-white text-base font-semibold text-center">Bagi Bukti Pembelian</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PaymentStatus;
