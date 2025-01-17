import React, { ReactNode, useState, useRef, useEffect } from "react";
import { icons } from "@/constants";
import { router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Animated, Dimensions } from "react-native";

interface BeliTokenProps {
  children: ReactNode;
}

const BeliToken: React.FC<BeliTokenProps> = ({ children }) => {
  const [nomorPDAM, setNomorPDAM] = useState("");
  const [nominal, setNominal] = useState("");
  const [selectedPelanggan, setSelectedPelanggan] = useState(null);
  const [warning, setWarning] = useState("");
  const [showError, setShowError] = useState(false);

  // Animation values
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const validateForm = () => {
    if (nomorPDAM.length < 9) {
      setWarning("ID PDAM Tidak Ditemukan");
      showErrorMessage();
    } else if (parseInt(nominal.replace(/\D/g, ""), 10) < 10000) {
      setWarning("Minimal nominal pembelian adalah Rp 10.000");
      showErrorMessage();
    } else {
      setWarning("");
      hideErrorMessage();
    }
  };

  const showErrorMessage = () => {
    setShowError(true);
    // Reset animation values
    slideAnim.setValue(-100);
    opacity.setValue(0);

    // Start animations
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto hide after 3 seconds
    setTimeout(() => {
      hideErrorMessage();
    }, 3000);
  };

  const hideErrorMessage = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowError(false);
    });
  };

  const tokenOptions = ["Rp. 10.000,-", "Rp. 25.000,-", "Rp. 50.000,-", "Rp. 75.000,-", "Rp. 100.000,-"];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Animated Error Message */}
        {showError && (
          <Animated.View
            style={{
              position: "absolute",
              top: 30,
              left: 0,
              right: 0,
              zIndex: 999,
              transform: [{ translateY: slideAnim }],
              opacity: opacity,
            }}>
            <View
              style={{
                backgroundColor: "#FFF2F2",
                padding: 16,
                margin: 16,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#E11D48", marginBottom: 2 }}>Error</Text>
                <Text style={{ fontSize: 14, color: "#E11D48" }}>{warning}</Text>
              </View>
              <TouchableOpacity onPress={hideErrorMessage}>
                <Image source={icons.close} style={{ width: 14, height: 14, tintColor: "#E11D48" }} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
          {/* Header with gradient */}
          <LinearGradient
            colors={["#2181FF", "#004EBA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="h-1/3 rounded-b-lg shadow-xl"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
            <View className="flex-row justify-between items-center p-5 mt-10">
              {/* Left Section: Back Button and Title */}
              <View className="flex-row items-center justify-center">
                <TouchableOpacity onPress={() => router.replace("/(tabs)/home")} className="w-10">
                  <Image source={icons.backArrow} className="w-6 h-6" tintColor="#fff" resizeMode="contain" />
                </TouchableOpacity>
                <Text className="text-white text-2xl font-semibold ">Beli Token</Text>
              </View>

              {/* Right Section: Question Icon */}
              <TouchableOpacity className="w-10 h-10 rounded-full flex items-center justify-center" accessibilityLabel="Help">
                <Image source={icons.question} className="w-6 h-6" tintColor="#fff" resizeMode="contain" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Main form card */}
          <View
            style={{
              margin: 20,
              marginTop: -210,
              backgroundColor: "#fff",
              borderRadius: 15,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
            <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 10 }}>ID PDAM</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#e0e0e0",
                borderRadius: 8,
                paddingHorizontal: 15,
                paddingVertical: 12,
                marginBottom: 20,
                backgroundColor: "#F8FAFC",
              }}>
              <TextInput
                placeholder="ID PDAM (contoh: 1234567890)"
                value={nomorPDAM}
                onChangeText={setNomorPDAM}
                style={{ fontSize: 16, color: "#94A3B8" }}
                placeholderTextColor="#94A3B8"
              />
            </View>

            <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 10 }}>Nominal Pembelian</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#e0e0e0",
                borderRadius: 8,
                paddingHorizontal: 15,
                paddingVertical: 12,
                marginBottom: 20,
                backgroundColor: "#F8FAFC",
              }}>
              <TextInput
                placeholder="Rp. 10000,-"
                value={nominal}
                onChangeText={setNominal}
                keyboardType="numeric"
                style={{ fontSize: 16, color: "#94A3B8" }}
                placeholderTextColor="#94A3B8"
              />
            </View>

            <TouchableOpacity onPress={validateForm} className="rounded-lg shadow-sm mb-6 overflow-hidden">
              <LinearGradient
                colors={["#2181FF", "#004EBA"]} // bg-blue-500 to bg-blue-400
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-2">
                <Text className="text-white text-lg font-semibold text-center">Beli Token</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Token selection section */}
          <View style={{ padding: 20, marginBottom: 300 }}>
            <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 8 }}>Pilih Token</Text>
            <Text style={{ fontSize: 16, color: "#666", marginBottom: 20 }}>Beli token langsung ke ID PDAM anda</Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}>
              {tokenOptions.map((token, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    width: index === tokenOptions.length - 1 ? "100%" : "48%",
                  }}>
                  <LinearGradient
                    colors={["#2181FF", "#004EBA"]} // bg-blue-500 to bg-blue-400
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      backgroundColor: "#4287f5",
                      borderRadius: 12,
                      padding: 20,
                      alignItems: "center",
                      marginBottom: 15,
                    }}>
                    <Image source={icons.pay} style={{ width: 24, height: 24, tintColor: "#fff", marginBottom: 8 }} />
                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{token}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

export default BeliToken;
