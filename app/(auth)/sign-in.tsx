import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";

const SignIn = () => {
  // Data user disimpan langsung di dalam file
  const users = [
    {
      email: "user1@example.com",
      password: "password123",
    },
    {
      email: "user2@example.com",
      password: "mypassword",
    },
  ];

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const onSignInPress = () => {
    // Validasi user
    const user = users.find(
      (u) => u.email === form.email && u.password === form.password
    );

    if (user) {
      // Login berhasil
      setErrorMessage(""); // Reset pesan error
      router.replace("/(root)/(tabs)/home");
    } else {
      // Login gagal
      setErrorMessage("Email atau kata sandi salah. Silakan coba lagi.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="flex-1 bg-gray">
        {/* Header */}
        <View className="relative w-full h-[250px] bg-sky-400 rounded-bl-3xl rounded-br-3xl flex items-center justify-center mb-[-40px]">
          <Image
            source={images.logo}
            className="mt-5 w-16 h-16 absolute top-5 rounded-full"
          />
          <View className="mt-10 flex items-center justify-center">
            <Text className="mt-3 text-center text-2xl text-white font-semibold font-JakartaSemiBold">
              Selamat Datang di Mata Air
            </Text>
            <Text className="text-center text-sm text-white">
              Masuk untuk melakukan pembayaran PDAM atau membeli token air
            </Text>
          </View>
        </View>

        {/* Form Sign In */}
        <View className="p-5 bg-white rounded-xl shadow-lg mt-[-5px] mx-5 z-10 mb-5">
          <Text className="text-xl text-center font-semibold mb-5">Masuk</Text>

          {errorMessage ? (
            <View className="p-3 bg-red-100 rounded-lg mb-5">
              <Text className="text-red-600 text-center">{errorMessage}</Text>
            </View>
          ) : null}

          <InputField
            label="Email"
            placeholder="Masukkan email"
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
            labelStyle="text-sm"
          />
          <InputField
            label="Kata Sandi"
            placeholder="Masukkan kata sandi"
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
            labelStyle="text-sm"
          />

          <CustomButton
            title="Masuk"
            onPress={onSignInPress}
            className="mt-6"
          />

          <Link
            href="/sign-up"
            className="text-lg text-center text-general-200 mt-10"
          >
            Belum punya akun?{" "}
            <Text className="text-sky-400">Daftar Sekarang</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
