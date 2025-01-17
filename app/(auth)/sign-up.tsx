import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, Link } from "expo-router";
import InputField from "@/components/InputField";

const SignUp = () => {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    idPdam: "",
    password: "",
    confirmPassword: "",
    telepon: "",
  });

  const validateForm = () => {
    // Check for empty fields
    for (const [key, value] of Object.entries(form)) {
      if (!value.trim()) {
        Alert.alert("Error", `${key.charAt(0).toUpperCase() + key.slice(1)} tidak boleh kosong`);
        return false;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert("Error", "Format email tidak valid");
      return false;
    }

    // Validate ID PDAM length
    if (form.idPdam.length !== 11) {
      Alert.alert("Error", "ID PDAM harus 11 digit");
      return false;
    }

    // Validate password match
    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Password tidak sama");
      return false;
    }

    // Validate phone number
    if (form.telepon.length < 10 || form.telepon.length > 13) {
      Alert.alert("Error", "Nomor telepon tidak valid");
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      // Here you would typically make an API call to register the user
      // For now, we'll just simulate it and move to verification

      // Navigate to verification screen with email (for displaying in verification screen)
      router.push({
        pathname: "/verification",
        params: { email: form.email },
      });
    } catch (error) {
      Alert.alert("Error", "Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white " showsVerticalScrollIndicator={false}>
      <View>
        <LinearGradient colors={["#2181FF", "#004EBA"]} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} className="h-[30%] rounded-b-lg">
          <View className="px-4 pt-16 pb-4">
            <Text className="text-white text-3xl font-bold text-center">Selamat Datang di{"\n"}Mata Air</Text>
            <Text className="text-white text-base font-light text-center mt-3 px-8 leading-5">
              Silahkan masuk menggunakan akun anda{"\n"}untuk menggunakan layanan Mata Air
            </Text>
          </View>
        </LinearGradient>
        <View className="flex-1 px-5 -mt-[105px] mb-[100px]">
          <View
            className="bg-white rounded-xl px-5 pt-6 pb-8 mb-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 5, height: 5 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
              elevation: 10,
            }}>
            <Text className="text-xl font-bold text-center mb-2">Daftar</Text>

            {/* Nama Input */}
            <View className="mb-2">
              <Text className="text-base font-semibold mb-2">Nama</Text>
              <InputField
                placeholder="Nama"
                value={form.nama}
                onChangeText={(value) => setForm({ ...form, nama: value })}
                containerStyle="bg-white shadow-sm"
                inputStyle="text-base"
              />
            </View>

            {/* Email Input */}
            <View className="mb-2">
              <Text className="text-base font-semibold mb-2">Email</Text>
              <InputField
                placeholder="Email@gmail.com"
                value={form.email}
                onChangeText={(value) => setForm({ ...form, email: value })}
                containerStyle="bg-white shadow-sm"
                inputStyle="text-base"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* ID PDAM Input */}
            <View className="mb-2">
              <Text className="text-base font-semibold mb-2">ID PDAM</Text>
              <InputField
                placeholder="11 Digit (contoh: 12345678901)"
                value={form.idPdam}
                onChangeText={(value) => setForm({ ...form, idPdam: value })}
                containerStyle="bg-white shadow-sm"
                inputStyle="text-base"
                keyboardType="numeric"
                maxLength={11}
              />
            </View>

            {/* Password Input */}
            <View className="mb-2">
              <Text className="text-base font-semibold mb-2">Password</Text>
              <InputField
                placeholder="Password"
                value={form.password}
                onChangeText={(value) => setForm({ ...form, password: value })}
                containerStyle="bg-white shadow-sm"
                inputStyle="text-base"
                secureTextEntry
                showPasswordToggle
              />
            </View>

            {/* Confirm Password Input */}
            <View className="mb-2">
              <Text className="text-base font-semibold mb-2">Masukkan Ulang Password</Text>
              <InputField
                placeholder="Password"
                value={form.confirmPassword}
                onChangeText={(value) => setForm({ ...form, confirmPassword: value })}
                containerStyle="bg-white shadow-sm"
                inputStyle="text-base"
                secureTextEntry
                showPasswordToggle
              />
            </View>

            {/* Phone Input */}
            <View className="mb-6">
              <Text className="text-base font-semibold mb-2">No. Telepon</Text>
              <InputField
                placeholder="Nomor Telepon"
                value={form.telepon}
                onChangeText={(value) => setForm({ ...form, telepon: value })}
                containerStyle="bg-white shadow-sm"
                inputStyle="text-base"
                keyboardType="phone-pad"
              />
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity onPress={handleSignUp} className="rounded-xl overflow-hidden">
              <LinearGradient colors={["#2181FF", "#004EBA"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="py-2">
                <Text className="text-white text-lg font-semibold text-center">Daftar</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View className="flex-row justify-center items-center mt-4 mb-2">
              <Text className="text-gray-600 text-base">Sudah punya akun? </Text>
              <Link href="/sign-in">
                <Text className="text-blue-500 text-base">Masuk sekarang!</Text>
              </Link>
            </View>

            {/* Copyright Text */}
            <Text className="text-center text-gray-500 mt-2">© Mata Air 2025</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;
