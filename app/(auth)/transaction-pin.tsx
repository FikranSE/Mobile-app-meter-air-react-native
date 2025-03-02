import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import InputField from "@/components/InputField";
import { api } from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function CreatePinTrans() {
  const [form, setForm] = useState({
    pinTrans: "",
  });
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        const storedPassword = await AsyncStorage.getItem("password");

        if (storedUsername && storedPassword) {
          setUserData({ username: storedUsername, password: storedPassword });
        } else {
          // If user credentials are not found, redirect to login
          alert("Sesi Anda telah berakhir. Silakan login kembali.");
          router.replace("/");
        }
      } catch (error) {
        console.error("Error fetching user data from AsyncStorage:", error);
        alert("Terjadi kesalahan saat memuat data.");
      }
    };

    // Check if PIN already exists
    const checkPinExists = async () => {
      const pinStatus = await AsyncStorage.getItem("pinTransactionStatus");
      if (pinStatus) {
        // PIN already exists, redirect to home
        router.replace("/home");
      }
    };

    fetchUserData();
    checkPinExists();
  }, []);

  async function onCreatePinPress() {
    try {
      // Validate PIN
      if (!form.pinTrans || form.pinTrans.length !== 6) {
        alert("PIN Transaksi harus terdiri dari 6 digit.");
        return;
      }

      setLoading(true);

      // Get the stored access token or generate a new one if needed
      let accessToken = await AsyncStorage.getItem("access_token");

      if (!accessToken) {
        // If there's no access token, we need to generate a new one
        const { generateToken } = require("@/lib/services/authService");
        accessToken = await generateToken();
        await AsyncStorage.setItem("access_token", accessToken);
      }

      // Get the data token or login again to get it
      let dataToken = await AsyncStorage.getItem("userToken");

      if (!dataToken) {
        // If there's no data token, we need to login again
        const { loginAccount } = require("@/lib/services/authService");
        dataToken = await loginAccount(accessToken, userData.username, userData.password);
        await AsyncStorage.setItem("userToken", dataToken);
      }

      const consId = process.env.EXPO_PUBLIC_WH8_CONS_ID?.replace(/[",]/g, "") || "admin-wh8";

      // Create PIN transaction
      const response = await api.post("/generatePinTrans", {
        username: userData.username,
        password: userData.password,
        cons_id: consId,
        data_token: dataToken,
        access_token: accessToken,
        pin_trans: form.pinTrans,
      });

      // Save the PIN creation status
      await AsyncStorage.setItem("pinTransactionStatus", "PIN transaksi berhasil dibuat!");

      // Show success message
      alert("PIN transaksi berhasil dibuat!");

      // Redirect to home page after successful PIN creation
      router.replace("/home");
    } catch (error) {
      console.error("Error creating PIN:", error);
      alert("Terjadi kesalahan saat membuat PIN transaksi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-white">
      <LinearGradient
        colors={["#2181FF", "#004EBA"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={{ shadowColor: "#000", shadowOffset: { width: 5, height: 5 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 10 }}
        className="h-[40%] rounded-b-lg shadow-xl">
        <View className="px-4 pt-16 pb-4">
          <Text className="text-white text-3xl font-bold text-center">Create PIN Transaksi</Text>
          <Text className="text-white text-base font-light text-center mt-3 px-8 leading-5">Silakan buat PIN transaksi untuk melanjutkan</Text>
        </View>
      </LinearGradient>
      <View
        style={{ shadowColor: "#000", shadowOffset: { width: 5, height: 5 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 10 }}
        className="mx-5 -mt-28 bg-white rounded-xl shadow-2xl px-5 pt-6 pb-8">
        <Text className="text-xl font-bold text-center mb-6">Buat PIN</Text>

        <View className="mb-4">
          <Text className="text-base font-semibold mb-2">PIN Transaksi (6 digit)</Text>
          <InputField
            placeholder="PIN Transaksi"
            value={form.pinTrans}
            onChangeText={(value) => {
              // Ensure only numeric input
              const numericValue = value.replace(/[^0-9]/g, "");
              setForm({ ...form, pinTrans: numericValue });
            }}
            containerStyle="bg-white shadow-sm"
            inputStyle="text-base"
            maxLength={6}
            keyboardType="numeric"
            secureTextEntry
          />
        </View>

        <TouchableOpacity onPress={onCreatePinPress} disabled={loading} className="rounded-lg shadow-sm mb-6 overflow-hidden">
          <LinearGradient colors={["#2181FF", "#004EBA"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="py-2">
            {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-lg font-semibold text-center">Buat PIN</Text>}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
