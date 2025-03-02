import { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Keyboard, Alert, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useAuth } from "@/lib/context/authContext";

const VerificationScreen = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);
  const { token } = useAuth();
  const params = useLocalSearchParams();
  const email = params.email || "";

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Move to next input if value entered
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Move to previous input if backspace pressed
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      // You would normally call your resend code API here
      // For now, we'll just reset the timer
      setTimer(60);
      Alert.alert("Kode terkirim", "Kode verifikasi baru telah dikirim ke email Anda.");
    } catch (error) {
      console.error("Error resending code:", error);
      Alert.alert("Gagal", "Gagal mengirim ulang kode verifikasi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

 const handleVerify = async () => {
   try {
     setLoading(true);
     const verificationCode = code.join("");

     if (verificationCode.length !== 6) {
       Alert.alert("Kode tidak lengkap", "Silakan masukkan 6 digit kode verifikasi.");
       setLoading(false);
       return;
     }

     const verificationUrl = `https://pdampolman.airmurah.id/api/verifAccount/${verificationCode}`;
     console.log("Verification URL:", verificationUrl); // Log the URL here

     const response = await axios.get(verificationUrl, {
       headers: {
         "Content-Type": "application/json",
         "wh8-cons-id": process.env.EXPO_PUBLIC_WH8_CONS_ID?.replace(/[",]/g, "") || "admin-wh8",
         "wh8-access-token": token,
       },
     });

     console.log("Verification response:", response.data);

     if (response.data.metadata.code === 200) {
       Alert.alert("Berhasil", "Akun Anda telah diverifikasi.", [{ text: "OK", onPress: () => router.replace("/(root)/(tabs)/home") }]);
     } else {
       Alert.alert("Gagal", response.data.metadata.message || "Kode verifikasi salah. Silakan coba lagi.");
     }
   } catch (error) {
     console.error("Verification error:", error);

     // Handle specific error cases
     if (error.response) {
       const message = error.response.data?.metadata?.message || "Terjadi kesalahan saat verifikasi.";
       Alert.alert("Gagal", message);
     } else {
       Alert.alert("Gagal", "Gagal melakukan verifikasi. Periksa koneksi Anda dan coba lagi.");
     }
   } finally {
     setLoading(false);
   }
 };


  return (
    <View className="flex-1 bg-white">
      <LinearGradient colors={["#2181FF", "#004EBA"]} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} className="h-[30%] rounded-b-lg">
        <View className="px-4 pt-16 pb-4">
          <Text className="text-white text-3xl font-bold text-center">Verifikasi Kode</Text>
          <Text className="text-white text-base font-light text-center mt-3 px-8 leading-5">
            Masukkan kode verifikasi yang telah{"\n"}dikirim ke {email || "email Anda"}
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
          {/* Code Input Section */}
          <View className="flex-row justify-between mb-8 mt-4">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <TextInput
                key={index}
                ref={(input) => (inputs.current[index] = input)}
                className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-xl font-bold"
                maxLength={1}
                keyboardType="number-pad"
                value={code[index]}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
              />
            ))}
          </View>

          {/* Timer and Resend Section */}
          <View className="flex-row justify-center items-center mb-8">
            {timer > 0 ? (
              <Text className="text-gray-500">Kirim ulang kode dalam {timer} detik</Text>
            ) : (
              <TouchableOpacity onPress={handleResendCode} disabled={loading}>
                <Text className="text-blue-500 font-semibold">Kirim Ulang Kode</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Verify Button */}
          <TouchableOpacity onPress={handleVerify} className="rounded-xl overflow-hidden" disabled={loading || code.some((digit) => digit === "")}>
            <LinearGradient
              colors={code.some((digit) => digit === "") ? ["#A0A0A0", "#808080"] : ["#2181FF", "#004EBA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-3">
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white text-lg font-semibold text-center">Verifikasi</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default VerificationScreen;
