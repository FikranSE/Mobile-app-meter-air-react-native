import { Link, router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSignInPress = () => {
    router.replace("/(root)/(tabs)/home");
  };

  return (
    <View className="flex-1 bg-white">
      <LinearGradient
        colors={["#2181FF", "#004EBA"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 5, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 10,
        }}
        className="h-[40%] rounded-b-lg shadow-xl">
        <View className="px-4 pt-16 pb-4">
          <Text className="text-white text-3xl font-bold text-center">Selamat Datang di {"\n"}Mata Air</Text>
          <Text className="text-white text-base font-light text-center mt-3 px-8 leading-5">
            Silahkan masuk menggunakan akun anda{"\n"}untuk menggunakan layanan Mata Air
          </Text>
        </View>
      </LinearGradient>

      {/* Login Form Card */}
      <View
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 5, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 10,
        }}
        className="mx-5 -mt-28 bg-white rounded-xl shadow-2xl px-5 pt-6 pb-8">
        {/* Form Title */}
        <Text className="text-xl font-bold text-center mb-6">Masuk</Text>

        {/* Email/ID Input */}
        <View className="mb-4">
          <Text className="text-base font-semibold mb-2">Email/ID PDAM</Text>
          <InputField
            placeholder="E-mail / ID PDAM"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
            containerStyle="bg-white shadow-sm"
            inputStyle="text-base"
          />
        </View>

        {/* Password Input */}
        <View>
          <Text className="text-base font-semibold mb-2">Password</Text>
          <InputField
            placeholder="Password"
            secureTextEntry
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
            containerStyle="bg-white shadow-sm"
            inputStyle="text-base"
            showPasswordToggle
          />
        </View>

        {/* Forgot Password Link */}
        <TouchableOpacity className="mt-1 mb-6">
          <Text className="text-gray-500 text-sm italic">Lupa password?</Text>
        </TouchableOpacity>

        {/* Sign In Button with Gradient */}
        <TouchableOpacity onPress={onSignInPress} className="rounded-lg shadow-sm mb-6 overflow-hidden">
          <LinearGradient
            colors={["#2181FF", "#004EBA"]} // bg-blue-500 to bg-blue-400
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-2">
            <Text className="text-white text-lg font-semibold text-center">Masuk</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Register Link */}
        <View className="flex-row justify-center items-center">
          <Text className="text-gray-600 text-base">Belum punya akun? </Text>
          <Link href="/sign-up">
            <Text className="text-blue-500 text-base">Daftar sekarang!</Text>
          </Link>
        </View>
        {/* Copyright Text */}
        <Text className="text-center text-gray-500 mt-2">© Mata Air 2025</Text>
      </View>
    </View>
  );
};

export default SignIn;
