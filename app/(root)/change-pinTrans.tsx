import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Animated, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";

const ChangePinTransaction = () => {
  // Input states
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  // UI states
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  // PIN visibility toggles
  const [showOldPin, setShowOldPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  // References for input fields
  const newPinRef = useRef(null);
  const confirmPinRef = useRef(null);

  const router = useRouter();

  // Animation values
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Form validation
  const [errors, setErrors] = useState({
    oldPin: "",
    newPin: "",
    confirmPin: "",
  });

  // Validate PIN to ensure it's exactly 6 digits
  const validatePinFormat = (pin) => {
    return /^\d{6}$/.test(pin);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      oldPin: "",
      newPin: "",
      confirmPin: "",
    };

    // Validate old PIN
    if (!oldPin.trim()) {
      newErrors.oldPin = "PIN lama tidak boleh kosong";
      isValid = false;
    } else if (!validatePinFormat(oldPin)) {
      newErrors.oldPin = "PIN harus terdiri dari 6 digit angka";
      isValid = false;
    }

    // Validate new PIN
    if (!newPin.trim()) {
      newErrors.newPin = "PIN baru tidak boleh kosong";
      isValid = false;
    } else if (!validatePinFormat(newPin)) {
      newErrors.newPin = "PIN harus terdiri dari 6 digit angka";
      isValid = false;
    } else if (newPin === oldPin) {
      newErrors.newPin = "PIN baru tidak boleh sama dengan PIN lama";
      isValid = false;
    }

    // Validate confirm PIN
    if (!confirmPin.trim()) {
      newErrors.confirmPin = "Konfirmasi PIN tidak boleh kosong";
      isValid = false;
    } else if (newPin !== confirmPin) {
      newErrors.confirmPin = "PIN tidak cocok";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Limit input to only numbers and max 6 digits
  const handlePinChange = (text, setter) => {
    const numericText = text.replace(/[^0-9]/g, "");
    if (numericText.length <= 6) {
      setter(numericText);
    }
  };

  const showAnimatedAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
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

  const handleChangePin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const username = await AsyncStorage.getItem("username");
      const password = await AsyncStorage.getItem("password");
      const dataToken = await AsyncStorage.getItem("userToken");
      const consId = process.env.EXPO_PUBLIC_WH8_CONS_ID?.replace(/[",]/g, "") || "admin-wh8";
      const accessToken = await AsyncStorage.getItem("access_token");

      if (!username || !password || !dataToken || !accessToken) {
        showAnimatedAlert("Sesi telah berakhir. Silakan login kembali.", "error");
        setLoading(false);
        return;
      }

      const response = await api.post(
        "/changePinTrans",
        {
          username,
          password,
          cons_id: consId,
          data_token: dataToken,
          access_token: accessToken,
          old_pin_trans: oldPin,
          new_pin_trans: newPin,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.metadata.code === 200) {
        // Store the new PIN in AsyncStorage
        await AsyncStorage.setItem("pinTrans", newPin);

        showAnimatedAlert("PIN transaksi berhasil diubah");

        // Clear form fields
        setOldPin("");
        setNewPin("");
        setConfirmPin("");

        // Navigate back after 2 seconds
        setTimeout(() => {
          router.back();
        }, 2000);
      } else {
        showAnimatedAlert(`Gagal: ${response.data.metadata.message}`, "error");
      }
    } catch (error) {
      console.error("Error changing PIN:", error);
      showAnimatedAlert("Terjadi kesalahan saat mengubah PIN", "error");
    } finally {
      setLoading(false);
    }
  };

  // Move to next input when PIN is complete
  useEffect(() => {
    if (oldPin.length === 6 && newPinRef.current) {
      newPinRef.current.focus();
    }
  }, [oldPin]);

  useEffect(() => {
    if (newPin.length === 6 && confirmPinRef.current) {
      confirmPinRef.current.focus();
    }
  }, [newPin]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <View className="flex-1 bg-white">
        {/* Alert */}
        {showAlert && (
          <Animated.View
            style={{
              position: "absolute",
              top: 50,
              left: 0,
              right: 0,
              zIndex: 999,
              transform: [{ translateY: slideAnim }],
              opacity: opacity,
            }}>
            <View
              style={{
                backgroundColor: alertType === "success" ? "#E1F5FE" : "#FFEBEE",
                padding: 16,
                margin: 16,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3.84,
                elevation: 2,
              }}>
              <View
                className="w-8 h-8 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: alertType === "success" ? "#0288D1" : "#D32F2F" }}>
                <Ionicons name={alertType === "success" ? "checkmark" : "close"} size={16} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: alertType === "success" ? "#0288D1" : "#D32F2F",
                    marginBottom: 1,
                  }}>
                  {alertType === "success" ? "Berhasil" : "Gagal"}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: alertType === "success" ? "#0288D1" : "#D32F2F",
                  }}>
                  {alertMessage}
                </Text>
              </View>
              <TouchableOpacity onPress={hideAnimatedAlert} className="p-2">
                <Ionicons name="close" size={16} color={alertType === "success" ? "#0288D1" : "#D32F2F"} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Form */}
        <ScrollView className="flex-1 p-6">
          <View className="flex-row items-start justify-start my-3">
            <TouchableOpacity onPress={() => router.back()} className="p-2 bg-gray-100 rounded-full mr-3">
              <Ionicons name="arrow-back" size={20} color="#333333" />
            </TouchableOpacity>
            <View className="">
              <Text className="text-gray-800 text-xl font-semibold mb-2">Buat PIN transaksi baru</Text>
              <Text className="text-gray-500 text-sm mb-8">PIN transaksi digunakan untuk verifikasi saat transaksi</Text>
            </View>
          </View>
          {/* Old PIN */}
          <View className="mb-6">
            <Text className="text-gray-700 text-sm font-medium mb-2">PIN Lama</Text>
            <View className="relative">
              <TextInput
                className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-base w-full"
                secureTextEntry={!showOldPin}
                keyboardType="number-pad"
                placeholder="Masukkan PIN lama (6 digit)"
                value={oldPin}
                onChangeText={(text) => handlePinChange(text, setOldPin)}
                maxLength={6}
              />
              <TouchableOpacity onPress={() => setShowOldPin(!showOldPin)} className="absolute right-4 top-0 bottom-0 justify-center">
                <Ionicons name={showOldPin ? "eye-off-outline" : "eye-outline"} size={20} color="#9e9e9e" />
              </TouchableOpacity>
            </View>
            {errors.oldPin ? (
              <View className="flex-row items-center mt-1.5">
                <Ionicons name="alert-circle-outline" size={14} color="#e53935" />
                <Text className="text-red-500 text-xs ml-1">{errors.oldPin}</Text>
              </View>
            ) : null}
          </View>

          {/* New PIN */}
          <View className="mb-6">
            <Text className="text-gray-700 text-sm font-medium mb-2">PIN Baru</Text>
            <View className="relative">
              <TextInput
                ref={newPinRef}
                className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-base w-full"
                secureTextEntry={!showNewPin}
                keyboardType="number-pad"
                placeholder="Masukkan PIN baru (6 digit)"
                value={newPin}
                onChangeText={(text) => handlePinChange(text, setNewPin)}
                maxLength={6}
              />
              <TouchableOpacity onPress={() => setShowNewPin(!showNewPin)} className="absolute right-4 top-0 bottom-0 justify-center">
                <Ionicons name={showNewPin ? "eye-off-outline" : "eye-outline"} size={20} color="#9e9e9e" />
              </TouchableOpacity>
            </View>
            {errors.newPin ? (
              <View className="flex-row items-center mt-1.5">
                <Ionicons name="alert-circle-outline" size={14} color="#e53935" />
                <Text className="text-red-500 text-xs ml-1">{errors.newPin}</Text>
              </View>
            ) : null}

            {/* PIN requirements */}
            {newPin.length > 0 && (
              <View className="mt-3 bg-blue-50 p-3 rounded-lg">
                <View className="flex-row items-center mb-1">
                  <Ionicons
                    name={newPin.length === 6 ? "checkmark-circle" : "ellipse-outline"}
                    size={14}
                    color={newPin.length === 6 ? "#4caf50" : "#9e9e9e"}
                  />
                  <Text className={`text-xs ml-2 ${newPin.length === 6 ? "text-green-600" : "text-gray-500"}`}>Terdiri dari 6 digit angka</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons
                    name={newPin !== oldPin ? "checkmark-circle" : "ellipse-outline"}
                    size={14}
                    color={newPin !== oldPin ? "#4caf50" : "#9e9e9e"}
                  />
                  <Text className={`text-xs ml-2 ${newPin !== oldPin ? "text-green-600" : "text-gray-500"}`}>Berbeda dengan PIN lama</Text>
                </View>
              </View>
            )}
          </View>

          {/* Confirm PIN */}
          <View className="mb-10">
            <Text className="text-gray-700 text-sm font-medium mb-2">Konfirmasi PIN</Text>
            <View className="relative">
              <TextInput
                ref={confirmPinRef}
                className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-base w-full"
                secureTextEntry={!showConfirmPin}
                keyboardType="number-pad"
                placeholder="Konfirmasi PIN baru"
                value={confirmPin}
                onChangeText={(text) => handlePinChange(text, setConfirmPin)}
                maxLength={6}
              />
              <TouchableOpacity onPress={() => setShowConfirmPin(!showConfirmPin)} className="absolute right-4 top-0 bottom-0 justify-center">
                <Ionicons name={showConfirmPin ? "eye-off-outline" : "eye-outline"} size={20} color="#9e9e9e" />
              </TouchableOpacity>
            </View>
            {errors.confirmPin ? (
              <View className="flex-row items-center mt-1.5">
                <Ionicons name="alert-circle-outline" size={14} color="#e53935" />
                <Text className="text-red-500 text-xs ml-1">{errors.confirmPin}</Text>
              </View>
            ) : confirmPin && newPin === confirmPin ? (
              <View className="flex-row items-center mt-1.5">
                <Ionicons name="checkmark-circle" size={14} color="#4caf50" />
                <Text className="text-green-600 text-xs ml-1">PIN cocok</Text>
              </View>
            ) : null}
          </View>

          {/* Submit Button */}
          <TouchableOpacity onPress={handleChangePin} disabled={loading} className={`rounded-xl ${loading ? "opacity-70" : "opacity-100"}`}>
            <LinearGradient colors={["#004EBA", "#2181FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="py-3.5 rounded-xl items-center">
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-white text-base font-medium">Simpan Perubahan</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View className="mt-6 mb-6 flex-row items-center justify-center">
            <Ionicons name="keypad-outline" size={16} color="#9e9e9e" />
            <Text className="text-gray-500 text-xs ml-2 text-center">Jangan bagikan PIN transaksi Anda kepada siapapun</Text>
          </View>

          <View className="bg-yellow-50 p-4 rounded-xl mb-6">
            <View className="flex-row">
              <Ionicons name="information-circle-outline" size={20} color="#FF9800" className="mr-2" />
              <View className="flex-1 ml-2">
                <Text className="text-yellow-800 font-medium text-sm">Informasi Penting</Text>
                <Text className="text-yellow-700 text-xs mt-1">
                  PIN transaksi digunakan untuk verifikasi pembayaran. Pastikan PIN Anda aman dan tidak mudah ditebak.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChangePinTransaction;
