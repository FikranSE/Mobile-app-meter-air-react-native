import React, { useState, useEffect, useRef } from "react";
import { ScrollView, View, Text, TouchableOpacity, Dimensions, Image, ImageBackground, Animated, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { LineChart } from "react-native-chart-kit";
import { icons, images } from "@/constants";
import * as Clipboard from "expo-clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/lib/api";
import axios from "axios";
import AccountSelector from "@/components/AccountSelector"; // Import the customer type selector

const Home = () => {
  const [customerType, setCustomerType] = useState("prabayar");
  const [customerData, setCustomerData] = useState(null);
  const [allCustomerData, setAllCustomerData] = useState([]); // To store all customer accounts
  const [selectedAccountId, setSelectedAccountId] = useState(null); // To track the selected account ID
  const [totalSpending, setTotalSpending] = useState(0);
  const [totalCubic, setTotalCubic] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [chartData, setChartData] = useState({
    labels: ["1", "2", "3", "4", "5", "6", "7"],
    datasets: [
      {
        data: [50, 100, 80, 40, 90, 70, 110],
        color: (opacity = 1) => `rgba(33, 129, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  });

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

  // Handle customer type change
  const handleCustomerTypeChange = async (type) => {
    try {
      setCustomerType(type);
      await AsyncStorage.setItem("preferredCustomerType", type);

      if (allCustomerData && allCustomerData.length > 0) {
        // Find a customer of the selected type
        const matchingCustomers = allCustomerData.filter(
          (customer) =>
            (type === "pascabayar" && customer.id_constumer.includes("PASCA")) || (type === "prabayar" && !customer.id_constumer.includes("PASCA"))
        );

        if (matchingCustomers.length > 0) {
          const accountToUse = matchingCustomers[0];
          setSelectedAccountId(accountToUse.id_constumer);
          setCustomerData(accountToUse);

          // Fetch transaction history for this customer
          const username = await AsyncStorage.getItem("username");
          const password = await AsyncStorage.getItem("password");
          const dataToken = await AsyncStorage.getItem("userToken");
          const consId = process.env.EXPO_PUBLIC_WH8_CONS_ID?.replace(/[",]/g, "") || "admin-wh8";
          const accessToken = await AsyncStorage.getItem("access_token");

          await fetchTransactionHistory(username, password, dataToken, consId, accessToken, accountToUse.meter_number, accountToUse.id_constumer);

          showAnimatedAlert(`Beralih ke akun ${type === "pascabayar" ? "Pascabayar" : "Prabayar"}`);
        } else {
          showAnimatedAlert(`Tidak ada akun ${type === "pascabayar" ? "Pascabayar" : "Prabayar"} yang tersedia`);
        }
      }
    } catch (error) {
      console.error("Error switching customer type:", error);
      showAnimatedAlert("Gagal mengubah tipe customer");
    }
  };

  // Fetch customer data and transaction history combined
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil kredensial dan token dari AsyncStorage
        const username = await AsyncStorage.getItem("username");
        const password = await AsyncStorage.getItem("password");
        const dataToken = await AsyncStorage.getItem("userToken");
        const consId = process.env.EXPO_PUBLIC_WH8_CONS_ID?.replace(/[",]/g, "") || "admin-wh8";
        const accessToken = await AsyncStorage.getItem("access_token");
        const savedAccountId = await AsyncStorage.getItem("selectedAccountId");
        const preferredType = await AsyncStorage.getItem("preferredCustomerType");

        if (preferredType) {
          setCustomerType(preferredType);
        }

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

        console.log("Customer Response:", customerResponse);

        if (customerResponse.data.metadata.code === 200) {
          const customerDataArray = customerResponse.data.response.data;
          setAllCustomerData(customerDataArray || []);

          if (customerDataArray && customerDataArray.length > 0) {
            // Determine which account to use based on preferred type and saved account ID
            let accountToUse = null;

            if (preferredType && savedAccountId) {
              // Try to find the saved account that matches preferred type
              accountToUse = customerDataArray.find(
                (account) =>
                  account.id_constumer === savedAccountId &&
                  ((preferredType === "pascabayar" && account.id_constumer.includes("PASCA")) ||
                    (preferredType === "prabayar" && !account.id_constumer.includes("PASCA")))
              );
            }

            // If no matching account found by ID and type, find by type only
            if (!accountToUse && preferredType) {
              accountToUse = customerDataArray.find(
                (account) =>
                  (preferredType === "pascabayar" && account.id_constumer.includes("PASCA")) ||
                  (preferredType === "prabayar" && !account.id_constumer.includes("PASCA"))
              );
            }

            // If we have a saved account ID but no type preference
            if (!accountToUse && savedAccountId) {
              accountToUse = customerDataArray.find((account) => account.id_constumer === savedAccountId);
            }

            // If still no account, use the first one
            if (!accountToUse) {
              accountToUse = customerDataArray[0];
              // Set customer type based on the account
              const isPostpaid = accountToUse.id_constumer.includes("PASCA");
              setCustomerType(isPostpaid ? "pascabayar" : "prabayar");
            }

            setSelectedAccountId(accountToUse.id_constumer);
            setCustomerData(accountToUse);

            // Check if id_constumer and meter_number exist
            if (accountToUse && accountToUse.id_constumer && accountToUse.meter_number) {
              // Fetch transaction history for the selected account
              await fetchTransactionHistory(username, password, dataToken, consId, accessToken, accountToUse.meter_number, accountToUse.id_constumer);
            } else {
              console.error("Missing customer data:", {
                id_constumer: accountToUse?.id_constumer,
                meter_number: accountToUse?.meter_number,
              });
              setAlertMessage("Data pelanggan tidak lengkap.");
              setShowAlert(true);
            }
          } else {
            console.error("No customer data found.");
            setAlertMessage("Data pelanggan tidak ditemukan.");
            setShowAlert(true);
          }
        } else {
          console.log("Customer data fetch error:", customerResponse.data.metadata.message);
          setAlertMessage("Gagal mengambil data pelanggan.");
          setShowAlert(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setAlertMessage("Terjadi kesalahan saat mengambil data.");
        setShowAlert(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch transaction history for a specific account
  const fetchTransactionHistory = async (username, password, dataToken, consId, accessToken, meterNumber, idConstumer) => {
    try {
      if (!meterNumber || !idConstumer) {
        console.error("Missing customer data for transaction history:", { meterNumber, idConstumer });
        setAlertMessage("Data pelanggan tidak lengkap untuk mengambil riwayat transaksi.");
        setShowAlert(true);
        return;
      }

      const requestBody = {
        username,
        password,
        data_token: dataToken,
        cons_id: consId,
        access_token: accessToken,
        meter_number: meterNumber,
        id_constumer: idConstumer,
      };

      // Fetch transaction history
      const response = await api.post("https://pdampolman.airmurah.id/api/histotyTrans", requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.metadata.code === 200) {
        const transactionData = response.data.response.data || [];
        setTransactions(transactionData);

        // Calculate total spending
        const sum = transactionData.reduce((acc, curr) => acc + Number(curr.purchase || 0), 0);
        setTotalSpending(sum);

        // Calculate total cubic water usage
        const totalCubic = transactionData.reduce((acc, curr) => {
          const cubicValue = Number(curr.cubic || 0);
          return acc + cubicValue;
        }, 0);
        const formattedCubic = String(totalCubic).substring(0, 3);
        setTotalCubic(formattedCubic);

        // Prepare chart data from transactions
        if (transactionData.length > 0) {
          const sortedTransactions = [...transactionData].sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
          });

          const lastTransactions = sortedTransactions.slice(-7);

          const labels = lastTransactions.map((trans, index) => {
            try {
              const date = new Date(trans.date);
              if (!isNaN(date.getTime())) {
                return date.getDate().toString();
              }
              return (index + 1).toString();
            } catch (e) {
              return (index + 1).toString();
            }
          });

          const data = lastTransactions.map((trans) => Number(trans.cubic || 0));

          setChartData({
            labels,
            datasets: [
              {
                data: data.length > 0 ? data : [0],
                color: (opacity = 1) => `rgba(33, 129, 255, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          });
        } else {
          // Set default chart data if no transactions
          setChartData({
            labels: ["1", "2", "3", "4", "5", "6", "7"],
            datasets: [
              {
                data: [0, 0, 0, 0, 0, 0, 0],
                color: (opacity = 1) => `rgba(33, 129, 255, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          });
        }
      } else {
        console.log("API Error:", response.data.metadata.message);
        setAlertMessage(`Gagal mengambil riwayat transaksi: ${response.data.metadata.message}`);
        setShowAlert(true);

        // Set default values on error
        setTransactions([]);
        setTotalSpending(0);
        setTotalCubic("0");
        setChartData({
          labels: ["1", "2", "3", "4", "5", "6", "7"],
          datasets: [
            {
              data: [0, 0, 0, 0, 0, 0, 0],
              color: (opacity = 1) => `rgba(33, 129, 255, ${opacity})`,
              strokeWidth: 2,
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      setAlertMessage("Terjadi kesalahan saat mengambil riwayat transaksi.");
      setShowAlert(true);

      // Set default values on error
      setTransactions([]);
      setTotalSpending(0);
      setTotalCubic("0");
      setChartData({
        labels: ["1", "2", "3", "4", "5", "6", "7"],
        datasets: [
          {
            data: [0, 0, 0, 0, 0, 0, 0],
            color: (opacity = 1) => `rgba(33, 129, 255, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      });
    }
  };

  // Handle account selection change
  const handleSelectAccount = async (account) => {
    try {
      setSelectedAccountId(account.id_constumer);
      setCustomerData(account);

      const isPostpaid = account.id_constumer.includes("PASCA");
      setCustomerType(isPostpaid ? "pascabayar" : "prabayar");

      // Fetch new transaction history for the selected account
      const username = await AsyncStorage.getItem("username");
      const password = await AsyncStorage.getItem("password");
      const dataToken = await AsyncStorage.getItem("userToken");
      const consId = process.env.EXPO_PUBLIC_WH8_CONS_ID?.replace(/[",]/g, "") || "admin-wh8";
      const accessToken = await AsyncStorage.getItem("access_token");

      await fetchTransactionHistory(username, password, dataToken, consId, accessToken, account.meter_number, account.id_constumer);

      showAnimatedAlert(`Beralih ke akun ${isPostpaid ? "Pascabayar" : "Prabayar"}`);
    } catch (error) {
      console.error("Error switching accounts:", error);
      setAlertMessage("Gagal beralih akun.");
      setShowAlert(true);
    }
  };

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

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getCurrentMonth = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const now = new Date();
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  return (
    <ScrollView className="flex-1 bg-white">
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

        <Text className="text-white text-xl font-bold text-center mt-3">{customerType === "pascabayar" ? "Penggunaan Air" : "Air Tersisa"}</Text>
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
            <Text className="text-white text-xl font-bold">{totalCubic}m³</Text>
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
          <AccountSelector customerType={customerType} onTypeChange={handleCustomerTypeChange} icons={icons} />
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
      <View className="mb-[250px] -z-10">
        <View className="ml-7 mt-7">
          <Text className="text-black text-lg font-bold">Riwayat Penggunaan Air {">"}</Text>
          <Text className="text-black mt-1 mb-4">{getCurrentMonth()}</Text>
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
