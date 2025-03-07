import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, Link } from "expo-router";
import InputField from "@/components/InputField";
import CustomAlert from "@/components/CustomAlert";
import { generateToken, registerAccount } from "@/lib/services/authService";

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });
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

  function validateForm() {
    for (const [fieldName, fieldValue] of Object.entries(form)) {
      if (!fieldValue.trim()) {
        const fieldLabels = {
          name: "Nama",
          username: "Username",
          email: "Email",
          contact: "No. Telepon",
          password: "Password",
          confirmPassword: "Konfirmasi Password",
        };

        showAlert("error", `${fieldLabels[fieldName]} tidak boleh kosong`);
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showAlert("error", "Format email tidak valid");
      return false;
    }

    if (form.password !== form.confirmPassword) {
      showAlert("error", "Password tidak sama");
      return false;
    }

    if (form.contact.length < 10 || form.contact.length > 13) {
      showAlert("error", "Nomor telepon tidak valid (10-13 digit)");
      return false;
    }

    return true;
  }

  async function handleSignUp() {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const accessToken = await generateToken();
      await registerAccount(accessToken, {
        username: form.username,
        name: form.name,
        email: form.email,
        contact: form.contact,
        password: form.password,
      });

      showAlert("success", "Pendaftaran berhasil! Silahkan verifikasi email Anda");

      // Delay navigation to allow alert to be seen
      setTimeout(() => {
        router.push({
          pathname: "/verification",
          params: { email: form.email },
        });
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);
      showAlert("error", "Pendaftaran gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      {/* Custom Alert */}
      <CustomAlert visible={alert.visible} type={alert.type} message={alert.message} onClose={hideAlert} />

      <View>
        <LinearGradient colors={["#2181FF", "#004EBA"]} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} className="h-[30%] rounded-b-lg">
          <View className="px-4 pt-16 pb-4">
            <Text className="text-white text-3xl font-bold text-center">Selamat Datang di{"\n"}Mata Air</Text>
            <Text className="text-white text-base font-light text-center mt-3 px-8 leading-5">
              Silahkan masuk menggunakan akun anda{"\n"}untuk menggunakan layanan Mata Air
            </Text>
          </View>
        </LinearGradient>
        <View className="flex-1 px-5 -mt-[70px] mb-[100px]">
          <View
            className="bg-white rounded-xl px-5 pt-6 pb-8 mb-4"
            style={{ shadowColor: "#000", shadowOffset: { width: 5, height: 5 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 10 }}>
            <Text className="text-xl font-bold text-center mb-2">Daftar</Text>
            <View className="mb-2">
              <Text className="text-base font-semibold mb-2">Nama</Text>
              <InputField
                placeholder="Nama"
                value={form.name}
                onChangeText={(value) => setForm({ ...form, name: value })}
                containerStyle="bg-white shadow-sm"
                inputStyle="text-base"
              />
            </View>
            <View className="mb-2">
              <Text className="text-base font-semibold mb-2">Username</Text>
              <InputField
                placeholder="Username"
                value={form.username}
                onChangeText={(value) => setForm({ ...form, username: value })}
                containerStyle="bg-white shadow-sm"
                inputStyle="text-base"
              />
            </View>
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
            <View className="mb-2">
              <Text className="text-base font-semibold mb-2">No. Telepon</Text>
              <InputField
                placeholder="Nomor Telepon"
                value={form.contact}
                onChangeText={(value) => setForm({ ...form, contact: value })}
                containerStyle="bg-white shadow-sm"
                inputStyle="text-base"
                keyboardType="phone-pad"
              />
            </View>
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
            <View className="mb-6">
              <Text className="text-base font-semibold mb-2">Konfirmasi Password</Text>
              <InputField
                placeholder="Konfirmasi Password"
                value={form.confirmPassword}
                onChangeText={(value) => setForm({ ...form, confirmPassword: value })}
                containerStyle="bg-white shadow-sm"
                inputStyle="text-base"
                secureTextEntry
                showPasswordToggle
              />
            </View>
            <TouchableOpacity onPress={handleSignUp} disabled={loading} className="rounded-xl overflow-hidden">
              <LinearGradient colors={["#2181FF", "#004EBA"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="py-2">
                <Text className="text-white text-lg font-semibold text-center">{loading ? "Memproses..." : "Daftar"}</Text>
              </LinearGradient>
            </TouchableOpacity>
            <View className="flex-row justify-center items-center mt-4 mb-2">
              <Text className="text-gray-600 text-base">Sudah punya akun? </Text>
              <Link href="/sign-in">
                <Text className="text-blue-500 text-base">Masuk sekarang!</Text>
              </Link>
            </View>
            <Text className="text-center text-gray-500 mt-2">© Mata Air 2025</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
