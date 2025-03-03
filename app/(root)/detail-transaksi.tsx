import React, { useState, useRef, useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity, Image, Alert, Animated, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { icons } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/lib/api";

const DetailTransaksi = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [tokenNumber, setTokenNumber] = useState("");
  const [customerData, setCustomerData] = useState(null);
  const [cubicData, setCubicData] = useState("");
  const [transactionData, setTransactionData] = useState({
    metodePembayaran: "",
    status: "",
    waktu: "",
    tanggal: "",
    idTransaksi: "",
    pelanggan: {
      id: "",
      nama: "",
      alamat: "",
      golongan: "",
      meter_number: "",
      meter_config: "",
    },
    rincian: {
      pemakaian: "",
      tagihan: "",
      cubic: "",
      denda: "",
      biayaAdmin: "",
      total: "",
    },
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get params from navigation
  const params = useLocalSearchParams();

  // Fetch customer data using axios
  const fetchCustomerData = async (customerId) => {
    try {
      const username = await AsyncStorage.getItem("username");
      const password = await AsyncStorage.getItem("password");
      const dataToken = await AsyncStorage.getItem("userToken");
      const consId = process.env.EXPO_PUBLIC_WH8_CONS_ID?.replace(/[",]/g, "") || "admin-wh8";
      const accessToken = await AsyncStorage.getItem("access_token");

      if (!username || !password || !dataToken || !accessToken) {
        console.log("Missing credentials:", { username, password, dataToken, accessToken });
        await AsyncStorage.setItem("username", username || "");
        await AsyncStorage.setItem("password", password || "");
        return;
      }

      const response = await api.post(
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

      if (response.data.metadata.code === 200) {
        console.log("Customer data fetched successfully:", response.data.response.data);
        setCustomerData(response.data.response.data);
        return response.data.response.data;
      } else {
        console.log("API returned error:", response.data.metadata);
        Alert.alert("Error", "Failed to fetch customer data: " + response.data.metadata.message);
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
      Alert.alert("Error", "Failed to fetch customer data. Please try again later.");
    }
    return null;
  };

  useEffect(() => {
    const loadData = async () => {
      if (isDataLoaded) return;

      try {
        setIsLoading(true);
        const storedTransactionData = await AsyncStorage.getItem("lastTokenTransaction");
        let parsedData = null;

        if (storedTransactionData) {
          parsedData = JSON.parse(storedTransactionData);
          console.log("Loaded stored transaction data:", parsedData);
        }

        // Extract token number from params or stored data
        const newTokenNumber = params.tokenNumber?.toString() || parsedData?.tokenNumber || "";

        // Extract cubic data, first try from params, then from dataCubic in stored transaction, finally from rincian.cubic
        const newCubicData = params.cubicData?.toString() || parsedData?.dataCubic || parsedData?.rincian?.cubic || "";

        const customerId = params.customerId?.toString() || parsedData?.pelanggan?.id || "";

        setTokenNumber(newTokenNumber);
        setCubicData(newCubicData);

        let newTransactionData = { ...transactionData };

        if (parsedData) {
          newTransactionData = {
            ...parsedData,
            pelanggan: {
              ...transactionData.pelanggan,
              ...parsedData.pelanggan,
            },
            rincian: {
              ...transactionData.rincian,
              ...parsedData.rincian,
              // Ensure the cubic data is set in the rincian object as well
              cubic: newCubicData,
            },
          };
        }

        if (customerId) {
          console.log("Fetching customer data for ID:", customerId);
          const customerData = await fetchCustomerData(customerId);
          if (customerData) {
            newTransactionData.pelanggan = {
              ...newTransactionData.pelanggan,
              id: customerData.id_constumer || customerId,
              nama: customerData.name || newTransactionData.pelanggan.nama || "-",
              alamat: customerData.address || newTransactionData.pelanggan.alamat || "-",
              meter_number: customerData.meter_number || newTransactionData.pelanggan.meter_number || "-",
              meter_config: customerData.meter_config || "-",
            };
          }
        } else {
          console.warn("No customer ID available to fetch data");
        }

        newTransactionData = calculateTotal(newTransactionData);

        setTransactionData(newTransactionData);
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error loading data:", error);
        Alert.alert("Error", `Gagal memuat data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [params]);

  const extractNumericValue = (currencyString) => {
    if (!currencyString) return 0;
    const numericString = currencyString.replace(/[^\d]/g, "");
    return numericString ? parseInt(numericString, 10) : 0;
  };

  const calculateTotal = (data) => {
    if (!data.rincian) return data;

    try {
      const tagihan = extractNumericValue(data.rincian.tagihan || "0");
      const cubic = extractNumericValue(data.rincian.cubic || "0");
      const denda = extractNumericValue(data.rincian.denda || "0");
      const biayaAdmin = extractNumericValue(data.rincian.biayaAdmin || "0");

      const totalValue = tagihan + cubic + denda + biayaAdmin;
      const formattedTotal = `Rp. ${totalValue.toLocaleString("id-ID")},-`;

      return {
        ...data,
        rincian: {
          ...data.rincian,
          total: formattedTotal,
        },
      };
    } catch (error) {
      console.error("Error calculating total:", error);
      return data;
    }
  };

  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const showAnimatedAlert = () => {
    setShowAlert(true);
    slideAnim.setValue(-100);
    opacity.setValue(0);

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

  const copyClipboard = async (text) => {
    if (!text || text === "-") {
      Alert.alert("Error", "Tidak ada data untuk disalin.");
      return;
    }

    try {
      await Clipboard.setStringAsync(text);
      showAnimatedAlert();
    } catch (error) {
      Alert.alert("Error", "Gagal menyalin teks.");
    }
  };

  const copyToken = async () => {
    await copyClipboard(tokenNumber);
  };

  const copyCubic = async () => {
    await copyClipboard(cubicData);
  };

  const hasTokenNumber = tokenNumber !== ""; // Check if tokenNumber exists

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
              <Text style={{ fontSize: 14, color: "#43A047" }}>Teks telah disalin ke clipboard</Text>
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
            <TouchableOpacity onPress={() => router.replace("/(root)/(tabs)/home")}>
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
          height: 700,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        className="absolute top-24 left-4 right-4 bg-white rounded-lg p-4">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#004EBA" />
            <Text className="mt-2 text-gray-600">Memuat data transaksi...</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
            {/* Icon and Title */}
            <View className="items-center mb-4">
              <View
                className={`w-14 h-14 rounded-full flex items-center justify-center border ${
                  hasTokenNumber ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500"
                }`}>
                <Image
                  source={hasTokenNumber ? icons.checkmark : icons.close}
                  className="w-6 h-6"
                  tintColor={hasTokenNumber ? "#00C853" : "#FF0000"}
                />
              </View>
              <Text className="text-xl font-bold mt-2">{hasTokenNumber ? "Pembelian Berhasil" : "Pembelian Gagal"}</Text>
            </View>

            {/* Token Section */}
            {hasTokenNumber ? (
              <View className="border-b border-dashed border-gray-300 pb-2 mb-2">
                <Text className="text-sm font-semibold mb-1">Token Anda</Text>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-800 text-base font-bold">{tokenNumber}</Text>
                  <TouchableOpacity className="flex-row items-center" onPress={copyToken}>
                    <Text className="text-blue-600 text-xs font-bold mr-1">Salin</Text>
                    <Image source={icons.copy} className="w-3 h-3" tintColor="#0369A1" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

            {/* Cubic Data Section */}
            {cubicData ? (
              <View className="border-b border-dashed border-gray-300 pb-2 mb-2">
                <Text className="text-sm font-semibold mb-1">Data Cubic</Text>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-800 text-base font-bold">{cubicData} m³</Text>
                </View>
              </View>
            ) : null}

            {/* Detail Pembelian */}
            <View className="border-b border-dashed border-gray-300 pb-2 mb-2">
              <Text className="text-sm font-semibold mb-1">Detail Pembelian</Text>
              {[
                { label: "Metode Pembayaran", value: transactionData.metodePembayaran || "-" },
                { label: "Status", value: transactionData.status || "-" },
                { label: "Waktu", value: transactionData.waktu || "-" },
                { label: "Tanggal", value: transactionData.tanggal || "-" },
              ].map((item, index) => (
                <View key={index} className="flex-row justify-between mb-1 items-center">
                  <Text className="text-gray-500 text-xs">{item.label}</Text>
                  {item.label === "Status" ? (
                    <Text
                      className={`text-xs font-bold ${
                        item.value === "Gagal" ? "text-red-500" : item.value === "Berhasil" ? "text-green-500" : "text-gray-500"
                      }`}>
                      {item.value}
                    </Text>
                  ) : (
                    <Text className="text-gray-800 text-xs font-bold">{item.value}</Text>
                  )}
                </View>
              ))}
            </View>

            {/* Detail Pelanggan */}
            <View className="border-b border-dashed border-gray-300 pb-2 mb-2">
              <Text className="text-sm font-semibold mb-1">Detail Pelanggan</Text>
              {customerData ? (
                <>
                  <View className="flex-row justify-between mb-1 items-center">
                    <Text className="text-gray-500 text-xs">Nama</Text>
                    <Text className="text-gray-800 text-xs font-bold">{customerData.name || transactionData.pelanggan.nama || "-"}</Text>
                  </View>
                  <View className="flex-row justify-between mb-1 items-center">
                    <Text className="text-gray-500 text-xs">Alamat</Text>
                    <Text className="text-gray-800 text-xs font-bold">{customerData.address || transactionData.pelanggan.alamat || "-"}</Text>
                  </View>
                  <View className="flex-row justify-between mb-1 items-center">
                    <Text className="text-gray-500 text-xs">Meter Number</Text>
                    <Text className="text-gray-800 text-xs font-bold">
                      {customerData.meter_number || transactionData.pelanggan.meter_number || "-"}
                    </Text>
                  </View>
                  <View className="flex-row justify-between mb-1 items-center">
                    <Text className="text-gray-500 text-xs">Meter Config</Text>
                    <Text className="text-gray-800 text-xs font-bold">
                      {customerData.meter_config || transactionData.pelanggan.meter_config || "-"}
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <View className="flex-row justify-between mb-1 items-center">
                    <Text className="text-gray-500 text-xs">Nama</Text>
                    <Text className="text-gray-800 text-xs font-bold">{transactionData.pelanggan.nama || "-"}</Text>
                  </View>
                  <View className="flex-row justify-between mb-1 items-center">
                    <Text className="text-gray-500 text-xs">Alamat</Text>
                    <Text className="text-gray-800 text-xs font-bold">{transactionData.pelanggan.alamat || "-"}</Text>
                  </View>
                  <View className="flex-row justify-between mb-1 items-center">
                    <Text className="text-gray-500 text-xs">Meter Number</Text>
                    <Text className="text-gray-800 text-xs font-bold">{transactionData.pelanggan.meter_number || "-"}</Text>
                  </View>
                  {transactionData.pelanggan.meter_config && (
                    <View className="flex-row justify-between mb-1 items-center">
                      <Text className="text-gray-500 text-xs">Meter Config</Text>
                      <Text className="text-gray-800 text-xs font-bold">{transactionData.pelanggan.meter_config}</Text>
                    </View>
                  )}
                </>
              )}
            </View>

            {/* Detail Tagihan */}
            {hasTokenNumber && (
              <View className="border-b border-dashed border-gray-300 pb-2 mb-2">
                <Text className="text-sm font-semibold mb-1">Detail Tagihan</Text>
                {[
                  { label: "Tagihan", value: transactionData.rincian.tagihan || "-" },
                  { label: "Biaya Admin", value: transactionData.rincian.biayaAdmin || "-" },
                  { label: "Denda", value: transactionData.rincian.denda || "-" },
                ].map((item, index) => (
                  <View key={index} className="flex-row justify-between mb-1">
                    <Text className="text-gray-500 text-xs">{item.label}</Text>
                    <Text className="text-gray-800 text-xs font-bold">{item.value}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Total */}
            <View className="flex-row justify-between mb-4">
              <Text className="text-xl font-bold">Total</Text>
              <Text className="text-xl font-bold">{transactionData.rincian.total || "-"}</Text>
            </View>

            {/* Buttons */}
            <View className="flex-col space-y-2 mt-0">
              <TouchableOpacity>
                <LinearGradient colors={["#2181FF", "#004EBA"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="rounded-lg py-2">
                  <Text className="text-white text-base font-semibold text-center">Bagi Bukti Pembelian</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity>
                <LinearGradient colors={["#F93B3BFF", "#9F0000FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="rounded-lg py-2">
                  <Text className="text-white text-base font-semibold text-center">Laporkan Masalah</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default DetailTransaksi;
