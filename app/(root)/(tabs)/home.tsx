import React, { useState, useEffect, useRef } from "react";
import { ScrollView, View, Text, TouchableOpacity, Dimensions, Image, ImageBackground, Animated, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { LineChart } from "react-native-chart-kit";
import { icons, images } from "@/constants";
import * as Clipboard from "expo-clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/lib/api";

// Data for Chart
const chartData = {
  labels: ["1", "2", "3", "4", "5", "6", "7"],
  datasets: [
    {
      data: [50, 100, 80, 40, 90, 70, 110],
      color: (opacity = 1) => `rgba(33, 129, 255, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};

const Home = () => {
  const [customerType, setCustomerType] = useState("prabayar");
  const [customerData, setCustomerData] = useState(null);
  const [totalSpending, setTotalSpending] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;

  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(33, 129, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "0",
      stroke: "#2181FF",
      fill: "#2181FF",
    },
    propsForBackgroundLines: {
      stroke: "#E4E4E4",
      strokeWidth: 1,
      strokeDasharray: [0, 0],
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: "400",
    },
    fillShadowGradient: "rgba(33, 129, 255, 0.2)",
    fillShadowGradientOpacity: 0.3,
  };

  // Fetch customer data untuk menampilkan informasi pelanggan
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        // Ambil kredensial dan token dari AsyncStorage
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

        console.log("Fetching customer data with credentials:", { username, dataToken });

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
        } else {
          console.log("API returned error:", response.data.metadata);
          Alert.alert("Error", "Failed to fetch customer data: " + response.data.metadata.message);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
        Alert.alert("Error", "Failed to fetch customer data. Please try again later.");
      }
    };

    fetchCustomerData();
  }, []);

  // Fetch transaction history untuk menghitung total purchase dari semua tanggal
  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        // Ambil kredensial dari AsyncStorage
        const username = await AsyncStorage.getItem("username");
        const password = await AsyncStorage.getItem("password");
        const dataToken = await AsyncStorage.getItem("userToken");
        const consId = process.env.EXPO_PUBLIC_WH8_CONS_ID?.replace(/[",]/g, "") || "admin-wh8";
        const accessToken = await AsyncStorage.getItem("access_token");

        if (!username || !password || !dataToken || !accessToken) {
          console.log("Missing credentials for transaction history");
          return;
        }

        const requestBody = {
          username,
          password,
          data_token: dataToken,
          cons_id: consId,
          access_token: accessToken,
          meter_number: 47500420436,
          id_constumer: "POLMAN3",
        };

        const response = await api.post("https://pdampolman.airmurah.id/api/histotyTrans", requestBody, {
          headers: { "Content-Type": "application/json" },
        });

        if (response.data.metadata.code === 200) {
          const transactions = response.data.response.data;
          // Kalkulasikan total purchase dari semua transaksi
          const sum = transactions.reduce((acc, curr) => acc + Number(curr.purchase), 0);
          setTotalSpending(sum);
        } else {
          console.log("Error fetching transaction history:", response.data.metadata.message);
        }
      } catch (error) {
        console.error("Error fetching transaction history:", error);
      }
    };

    fetchTransactionHistory();
  }, []);

  const showAnimatedAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    slideAnim.setValue(-100);
    opacity.setValue(0);

    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      hideAnimatedAlert();
    }, 3000);
  };

  const hideAnimatedAlert = () => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: -100, duration: 300, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => {
      setShowAlert(false);
    });
  };

  const notificationCount = 3;

  const handleCopyPDAMID = async () => {
    try {
      if (customerData?.meter_number) {
        await Clipboard.setStringAsync(customerData.meter_number);
        showAnimatedAlert("ID PDAM berhasil disalin");
      } else {
        showAnimatedAlert("ID PDAM tidak tersedia");
      }
    } catch (error) {
      Alert.alert("Error", "Gagal menyalin ID PDAM.");
    }
  };

  const handleNavigation = () => {
    if (customerType === "pascabayar") {
      router.push("/(root)/detail-tagihan");
    } else {
      router.push("/(root)/beli-token");
    }
  };

  // Fungsi untuk format rupiah
  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <ScrollView className="flex-1 bg-white ">
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
              <Text style={{ fontSize: 14, color: "#43A047" }}>{alertMessage}</Text>
            </View>
            <TouchableOpacity onPress={hideAnimatedAlert}>
              <Image source={{ uri: "close_icon_url" }} style={{ width: 14, height: 14, tintColor: "#43A047" }} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Header */}
      <LinearGradient
        colors={["#004EBA", "#2181FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 5, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 10,
        }}
        className="h-[30%] rounded-b-lg shadow-xl">
        <View className="flex-row justify-between items-center mt-8 p-5">
          <View className="flex-row items-center space-x-2">
            <Image source={icons.pin} className="w-3.5 h-4" tintColor="white" />
            <Text className="text-white text-md font-base">{customerData?.village || "Loading..."}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/(root)/notifikasi")}>
            <View className="relative">
              <Image source={icons.envelope} className="w-5 h-5" tintColor="white" />
              {notificationCount > 0 && (
                <View className="absolute -top-1 -right-1 bg-orange-500 rounded-full w-3 h-3 flex items-center justify-center">
                  <Text className="text-white text-xs"></Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
        <Text className="text-white text-xl font-bold text-center">{customerType === "pascabayar" ? "Penggunaan Air" : "Air Tersisa"}</Text>
        <View className="items-center my-5">
          <ImageBackground
            source={images.kadar}
            style={{
              width: 96,
              height: 96,
              borderRadius: 999,
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Text className="text-white text-xl font-bold">23m³</Text>
          </ImageBackground>
        </View>
      </LinearGradient>

      {/* Customer Info Card */}
      <LinearGradient
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 5, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 10,
          marginHorizontal: 20,
          paddingVertical: 15,
          paddingHorizontal: 20,
          borderRadius: 20,
          borderWidth: 2,
          borderColor: "#cce4ff",
        }}
        className="-mt-7"
        colors={["#2181FF", "#004EBA"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View className="flex-row justify-start items-center">
          <Text className="text-white text-lg font-bold">Halo, {customerData?.name || "User"}</Text>
        </View>

        <View className="mt-5">
          <View className="flex-row justify-between">
            <Text className="text-white">ID PDAM</Text>
            <Text className="text-white">{customerType === "pascabayar" ? "Tagihan Bulan Ini" : "Total Pengeluaran"}</Text>
          </View>
          <View className="flex-row justify-between mt-3 items-center">
            <TouchableOpacity className="flex-row items-center" onPress={handleCopyPDAMID} activeOpacity={0.7}>
              <Text className="text-white text-lg font-medium">{customerData?.meter_number || "Tidak tersedia"}</Text>
              <Image source={icons.copy} className="w-4 h-4 ml-2" tintColor="white" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-bold">{formatRupiah(totalSpending)}</Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center mt-5">
          <Text className="text-white opacity-70 font-bold mr-4">• {customerType === "pascabayar" ? "Pascabayar" : "Prabayar"}</Text>
          <TouchableOpacity onPress={handleNavigation} className="rounded-full">
            <LinearGradient
              colors={["#8CC0FFFF", "#0263FFFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 7,
              }}
              className="py-2 px-5 flex-row items-center space-x-2">
              <Image source={icons.pay} className="w-3.5 h-4" tintColor="white" />
              <Text className="text-white font-medium text-sm">{customerType === "pascabayar" ? "Bayar Sekarang" : "Beli Token"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

     

      {/* Riwayat Penggunaan Air */}
      <View className="mb-[250px]">
        <View className="ml-7 mt-7">
          <Text className="text-black text-lg font-bold">Riwayat Penggunaan Air {">"}</Text>
          <Text className="text-black mt-1 mb-4">Jan 2025</Text>
        </View>
        <View>
          <LineChart
            data={chartData}
            width={screenWidth - 30}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            withHorizontalLabels={true}
            withVerticalLabels={true}
            withInnerLines={true}
            withOuterLines={true}
            getDotColor={() => "#2181FF"}
            segments={4}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
