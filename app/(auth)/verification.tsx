import { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/lib/context/authContext";

const VerificationScreen = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const params = useLocalSearchParams();
  const email = params.email || "";

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      // You would normally call your resend verification API here
      Alert.alert("Email terkirim", "Link verifikasi baru telah dikirim ke email Anda.");
    } catch (error) {
      console.error("Error resending verification:", error);
      Alert.alert("Gagal", "Gagal mengirim ulang link verifikasi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.replace("/(auth)/sign-in");
  };

  return (
    <View className="flex-1 bg-white">
      <LinearGradient colors={["#2181FF", "#004EBA"]} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} className="h-[30%] rounded-b-lg">
        <View className="px-4 pt-16 pb-4">
          <Text className="text-white text-3xl font-bold text-center">Verifikasi Email</Text>
          <Text className="text-white text-base font-light text-center mt-3 px-8 leading-5">
            Silahkan cek email yang Anda daftarkan{"\n"}untuk melakukan verifikasi
          </Text>
        </View>
      </LinearGradient>

      <View className="flex-1 px-5 -mt-[60px]">
        <View
          className="bg-white rounded-xl px-5 pt-6 pb-8"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 5, height: 5 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 10,
          }}>
          {/* Verification Message */}
          <View className="items-center py-8">
            <Text className="text-center text-gray-700 text-lg mb-3">Silahkan tunggu beberapa saat Link verifikasi akan dikirim ke:</Text>
            <Text className="text-center text-blue-600 font-bold text-lg mb-8">{email || "email Anda"}</Text>
            <Text className="text-center text-gray-600 mb-10 px-4">
              Silahkan cek email Anda dan klik link verifikasi untuk mengaktifkan akun Anda.
            </Text>
          </View>

          {/* Resend Button */}
          <TouchableOpacity onPress={handleResendVerification} className="rounded-xl overflow-hidden mb-4" disabled={loading}>
            <LinearGradient colors={["#2181FF", "#004EBA"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="py-3">
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white text-lg font-semibold text-center">Kirim Ulang Link Verifikasi</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Back to Login Button */}
          <TouchableOpacity onPress={handleBackToLogin} className="mt-3">
            <Text className="text-blue-500 font-semibold text-center">Kembali ke Halaman Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default VerificationScreen;
