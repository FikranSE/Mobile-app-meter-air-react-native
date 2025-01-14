import { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Keyboard } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const VerificationScreen = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const inputs = useRef([]);

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

  const handleResendCode = () => {
    // Reset timer and resend code logic here
    setTimer(60);
  };

  const handleVerify = () => {
    // Verify code logic here
    router.replace("/(root)/(tabs)/home");
  };

  return (
    <View className="flex-1 bg-white">
      <LinearGradient colors={["#2181FF", "#004EBA"]} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} className="h-[30%] rounded-b-lg">
        <View className="px-4 pt-16 pb-4">
          <Text className="text-white text-3xl font-bold text-center">Verifikasi Kode</Text>
          <Text className="text-white text-base font-light text-center mt-3 px-8 leading-5">
            Masukkan kode verifikasi yang telah{"\n"}dikirim ke email Anda
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
              <TouchableOpacity onPress={handleResendCode}>
                <Text className="text-blue-500 font-semibold">Kirim Ulang Kode</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Verify Button */}
          <TouchableOpacity onPress={handleVerify} className="rounded-xl overflow-hidden">
            <LinearGradient colors={["#2181FF", "#004EBA"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="py-2">
              <Text className="text-white text-lg font-semibold text-center">Verifikasi</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default VerificationScreen;
