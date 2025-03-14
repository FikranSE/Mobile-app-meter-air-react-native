import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Animated, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  // Password visibility toggles
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Form validation
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    // Validate old password
    if (!oldPassword.trim()) {
      newErrors.oldPassword = "Password lama tidak boleh kosong";
      isValid = false;
    }

    // Validate new password
    if (!newPassword.trim()) {
      newErrors.newPassword = "Password baru tidak boleh kosong";
      isValid = false;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password baru minimal 8 karakter";
      isValid = false;
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Konfirmasi password tidak boleh kosong";
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
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

  const handleChangePassword = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const username = await AsyncStorage.getItem("username");
      const dataToken = await AsyncStorage.getItem("userToken");
      const consId = process.env.EXPO_PUBLIC_WH8_CONS_ID?.replace(/[",]/g, "") || "admin-wh8";
      const accessToken = await AsyncStorage.getItem("access_token");

      if (!username || !dataToken || !accessToken) {
        showAnimatedAlert("Sesi telah berakhir. Silakan login kembali.", "error");
        setLoading(false);
        return;
      }

      const response = await api.post(
        "/changePassword",
        {
          username,
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
          data_token: dataToken,
          cons_id: consId,
          access_token: accessToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.metadata.code === 200) {
        showAnimatedAlert("Password berhasil diubah");

        // Clear form fields
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");

        // Navigate back after 2 seconds
        setTimeout(() => {
          router.back();
        }, 2000);
      } else {
        showAnimatedAlert(`Gagal: ${response.data.metadata.message}`, "error");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      showAnimatedAlert("Terjadi kesalahan saat mengubah password", "error");
    } finally {
      setLoading(false);
    }
  };

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
                style={{ backgroundColor: alertType === "success" ? "#43A047" : "#D32F2F" }}>
                <Ionicons name={alertType === "success" ? "checkmark" : "close"} size={16} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: alertType === "success" ? "#2E7D32" : "#D32F2F",
                    marginBottom: 1,
                  }}>
                  {alertType === "success" ? "Berhasil" : "Gagal"}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: alertType === "success" ? "#2E7D32" : "#D32F2F",
                  }}>
                  {alertMessage}
                </Text>
              </View>
              <TouchableOpacity onPress={hideAnimatedAlert} className="p-2">
                <Ionicons name="close" size={16} color={alertType === "success" ? "#2E7D32" : "#D32F2F"} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Form */}
        <ScrollView className="flex-1 p-6">
          <View className="flex-row items-start justify-start my-4">
            <TouchableOpacity onPress={() => router.back()} className="p-2 bg-gray-100 rounded-full mr-3">
              <Ionicons name="arrow-back" size={20} color="#333333" />
            </TouchableOpacity>
            <View>
              <Text className="text-gray-800 text-xl font-semibold mb-2">Buat password baru</Text>
              <Text className="text-gray-500 text-sm mb-8">Atur password yang kuat untuk meningkatkan keamanan akun Anda</Text>
            </View>
          </View>
          {/* Old Password */}
          <View className="mb-6">
            <Text className="text-gray-700 text-sm font-medium mb-2">Password Lama</Text>
            <View className="relative">
              <TextInput
                className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-base w-full"
                secureTextEntry={!showOldPassword}
                placeholder="Masukkan password lama"
                value={oldPassword}
                onChangeText={setOldPassword}
              />
              <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)} className="absolute right-4 top-0 bottom-0 justify-center">
                <Ionicons name={showOldPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9e9e9e" />
              </TouchableOpacity>
            </View>
            {errors.oldPassword ? (
              <View className="flex-row items-center mt-1.5">
                <Ionicons name="alert-circle-outline" size={14} color="#e53935" />
                <Text className="text-red-500 text-xs ml-1">{errors.oldPassword}</Text>
              </View>
            ) : null}
          </View>

          {/* New Password */}
          <View className="mb-6">
            <Text className="text-gray-700 text-sm font-medium mb-2">Password Baru</Text>
            <View className="relative">
              <TextInput
                className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-base w-full"
                secureTextEntry={!showNewPassword}
                placeholder="Masukkan password baru"
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-0 bottom-0 justify-center">
                <Ionicons name={showNewPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9e9e9e" />
              </TouchableOpacity>
            </View>
            {errors.newPassword ? (
              <View className="flex-row items-center mt-1.5">
                <Ionicons name="alert-circle-outline" size={14} color="#e53935" />
                <Text className="text-red-500 text-xs ml-1">{errors.newPassword}</Text>
              </View>
            ) : null}

            {/* Password requirements */}
            {newPassword.length > 0 && (
              <View className="mt-3 bg-blue-50 p-3 rounded-lg">
                <View className="flex-row items-center mb-1">
                  <Ionicons
                    name={newPassword.length >= 8 ? "checkmark-circle" : "ellipse-outline"}
                    size={14}
                    color={newPassword.length >= 8 ? "#4caf50" : "#9e9e9e"}
                  />
                  <Text className={`text-xs ml-2 ${newPassword.length >= 8 ? "text-green-600" : "text-gray-500"}`}>Minimal 8 karakter</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons
                    name={newPassword !== oldPassword ? "checkmark-circle" : "ellipse-outline"}
                    size={14}
                    color={newPassword !== oldPassword ? "#4caf50" : "#9e9e9e"}
                  />
                  <Text className={`text-xs ml-2 ${newPassword !== oldPassword ? "text-green-600" : "text-gray-500"}`}>
                    Berbeda dengan password lama
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Confirm Password */}
          <View className="mb-10">
            <Text className="text-gray-700 text-sm font-medium mb-2">Konfirmasi Password</Text>
            <View className="relative">
              <TextInput
                className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-base w-full"
                secureTextEntry={!showConfirmPassword}
                placeholder="Konfirmasi password baru"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-0 bottom-0 justify-center">
                <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9e9e9e" />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? (
              <View className="flex-row items-center mt-1.5">
                <Ionicons name="alert-circle-outline" size={14} color="#e53935" />
                <Text className="text-red-500 text-xs ml-1">{errors.confirmPassword}</Text>
              </View>
            ) : confirmPassword && newPassword === confirmPassword ? (
              <View className="flex-row items-center mt-1.5">
                <Ionicons name="checkmark-circle" size={14} color="#4caf50" />
                <Text className="text-green-600 text-xs ml-1">Password cocok</Text>
              </View>
            ) : null}
          </View>

          {/* Submit Button */}
          <TouchableOpacity onPress={handleChangePassword} disabled={loading} className={`rounded-xl ${loading ? "opacity-70" : "opacity-100"}`}>
            <LinearGradient colors={["#004EBA", "#2181FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="py-3.5 rounded-xl items-center">
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-white text-base font-medium">Simpan Perubahan</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View className="mt-6 mb-6 flex-row items-center justify-center">
            <Ionicons name="shield-checkmark-outline" size={16} color="#9e9e9e" />
            <Text className="text-gray-500 text-xs ml-2 text-center">Ubah password secara berkala untuk keamanan akun</Text>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChangePassword;
