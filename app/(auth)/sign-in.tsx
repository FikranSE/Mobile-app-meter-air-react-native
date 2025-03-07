import { Link, router } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import InputField from "@/components/InputField";
import { generateToken, loginAccount } from "@/lib/services/authService";
import { saveToken } from "@/store/authStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "@/components/CustomAlert";

export default function SignIn() {
  const [form, setForm] = useState({ emailOrUsername: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    visible: false,
    type: "success",
    message: "",
  });

  const showAlert = (type, message) => {
    setAlert({
      visible: true,
      type,
      message,
    });
  };

  const hideAlert = () => {
    setAlert((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  async function onSignInPress() {
    if (!form.emailOrUsername.trim() || !form.password.trim()) {
      showAlert("error", "Email/Username dan Password tidak boleh kosong");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Generate the access token
      const accessToken = await generateToken();

      // Step 2: Get the data-token from login
      const userToken = await loginAccount(accessToken, form.emailOrUsername, form.password);

      // Step 3: Save the token and user credentials for future use
      await saveToken(userToken);
      await AsyncStorage.setItem("username", form.emailOrUsername);
      await AsyncStorage.setItem("password", form.password);
      await AsyncStorage.setItem("access_token", accessToken);

      // Show success message before navigation
      showAlert("success", "Login berhasil! Mengalihkan...");

      // Delay navigation to allow alert to be seen
      setTimeout(async () => {
        // Step 4: Check if user has PIN or not
        const pinStatus = await AsyncStorage.getItem("pinTransactionStatus");

        if (pinStatus) {
          // If the user has already created the PIN, navigate to home
          router.replace("/home");
        } else {
          // If the user hasn't created PIN, navigate to transaction-pin page
          router.replace("/transaction-pin");
        }
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      showAlert("error", "Login gagal. Email/Username atau Password salah.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-white">
      {/* Custom Alert */}
      <CustomAlert visible={alert.visible} type={alert.type} message={alert.message} onClose={hideAlert} />

      <LinearGradient
        colors={["#2181FF", "#004EBA"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={{ shadowColor: "#000", shadowOffset: { width: 5, height: 5 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 10 }}
        className="h-[40%] rounded-b-lg shadow-xl">
        <View className="px-4 pt-16 pb-4">
          <Text className="text-white text-3xl font-bold text-center">Selamat Datang di {"\n"}Mata Air</Text>
          <Text className="text-white text-base font-light text-center mt-3 px-8 leading-5">
            Silahkan masuk menggunakan akun anda{"\n"}untuk menggunakan layanan Mata Air
          </Text>
        </View>
      </LinearGradient>
      <View
        style={{ shadowColor: "#000", shadowOffset: { width: 5, height: 5 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 10 }}
        className="mx-5 -mt-28 bg-white rounded-xl shadow-2xl px-5 pt-6 pb-8">
        <Text className="text-xl font-bold text-center mb-6">Masuk</Text>
        <View className="mb-4">
          <Text className="text-base font-semibold mb-2">Email/Username</Text>
          <InputField
            placeholder="Email / Username"
            value={form.emailOrUsername}
            onChangeText={(value) => setForm({ ...form, emailOrUsername: value })}
            containerStyle="bg-white shadow-sm"
            inputStyle="text-base"
          />
        </View>
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
        <TouchableOpacity className="mt-1 mb-6">
          <Text className="text-gray-500 text-sm italic">Lupa password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSignInPress} disabled={loading} className="rounded-lg shadow-sm mb-6 overflow-hidden">
          <LinearGradient colors={["#2181FF", "#004EBA"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="py-2">
            <Text className="text-white text-lg font-semibold text-center">{loading ? "Memproses..." : "Masuk"}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <View className="flex-row justify-center items-center">
          <Text className="text-gray-600 text-base">Belum punya akun? </Text>
          <Link href="/sign-up">
            <Text className="text-blue-500 text-base">Daftar sekarang!</Text>
          </Link>
        </View>
        <Text className="text-center text-gray-500 mt-2">© Mata Air 2025</Text>
      </View>
    </View>
  );
}
