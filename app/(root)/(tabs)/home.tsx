import React, { useState, useRef } from "react";
import { ScrollView, View, Text, TouchableOpacity, Dimensions, Image, ImageBackground, Alert, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { LineChart } from "react-native-chart-kit";
import { icons, images } from "@/constants";
import * as Clipboard from "expo-clipboard"; 

// Data untuk Chart
const chartData = {
  labels: ["1", "2", "3", "4", "5", "6", "7"],
  datasets: [
    {
      data: [50, 100, 80, 40, 90, 70, 110],
      color: (opacity = 1) => `rgba(33, 129, 255, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};

// Tipe Data untuk State
type CustomerType = "pascabayar" | "prabayar";

const Home = () => {
  const [customerType, setCustomerType] = useState<CustomerType>("pascabayar");
  const screenWidth = Dimensions.get("window").width;
  const [showAlert, setShowAlert] = useState(false);

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(33, 129, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "0",
      stroke: "#2181FF",
      fill: "#2181FF",
    },
    propsForBackgroundLines: {
      stroke: "#E4E4E4",
      strokeWidth: 1,
      strokeDasharray: [0, 0],
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: "400",
    },
    fillShadowGradient: "rgba(33, 129, 255, 0.2)",
    fillShadowGradientOpacity: 0.3,
  };

  // Animation values for alert
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const showAnimatedAlert = () => {
    setShowAlert(true);
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
      hideAnimatedAlert();
    }, 3000);
  };

  const hideAnimatedAlert = () => {
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
      setShowAlert(false);
    });
  };

  const handleCopyPDAMID = async () => {
    try {
      await Clipboard.setStringAsync("12345678901");
      showAnimatedAlert();
    } catch (error) {
      Alert.alert("Error", "Gagal menyalin ID PDAM.");
    }
  };

  const handleNavigation = () => {
    if (customerType === "pascabayar") {
      router.push("/(root)/detail-tagihan");
    } else {
      router.push("/(root)/beli-token");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white ">
      {/* Animated Alert */}
      {showAlert && (
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
              backgroundColor: "#E8F5E9",
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
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#43A047", marginBottom: 2 }}>Berhasil</Text>
              <Text style={{ fontSize: 14, color: "#43A047" }}>ID PDAM telah disalin ke clipboard</Text>
            </View>
            <TouchableOpacity onPress={hideAnimatedAlert}>
              <Image source={icons.close} style={{ width: 14, height: 14, tintColor: "#43A047" }} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
      {/* Header */}
      <LinearGradient
        colors={["#004EBA", "#2181FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 5, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 10,
        }}
        className="h-[30%] rounded-b-lg shadow-xl">
        <View className="flex-row justify-between items-center mt-8 p-5">
          <View className="flex-row items-center space-x-2">
            <Image source={icons.pin} className="w-3.5 h-4" tintColor="white" />
            <Text className="text-white text-md font-base">Ampekale</Text>
          </View>
          <TouchableOpacity>
            <Image source={icons.envelope} className="w-5 h-5" tintColor="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-white text-xl font-bold text-center ">{customerType === "pascabayar" ? "Penggunaan Air" : "Air Tersisa"}</Text>
        <View className="items-center my-5">
          <ImageBackground
            source={images.kadar}
            style={{
              width: 96,
              height: 96,
              borderRadius: 999,
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Text className="text-white text-xl font-bold">23m³</Text>
          </ImageBackground>
        </View>
      </LinearGradient>

      {/* Info Card */}
      <LinearGradient
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 5, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 10,
          marginHorizontal: 20,
          paddingVertical: 15,
          paddingHorizontal: 20,
          borderRadius: 20,
          borderWidth: 2,
          borderColor: "#cce4ff",
        }}
        className="-mt-7"
        colors={["#2181FF", "#004EBA"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View className="flex-row justify-start items-center">
          <Text className="text-white text-lg font-bold">Halo, Sumarno</Text>
        </View>

        <View className="mt-5">
          <View className="flex-row justify-between">
            <Text className="text-white">ID PDAM</Text>
            <Text className="text-white">{customerType === "pascabayar" ? "Tagihan Bulan Ini" : "Pengeluaran Bulan Ini"}</Text>
          </View>
          <View className="flex-row justify-between mt-3 items-center">
            <TouchableOpacity className="flex-row items-center" onPress={handleCopyPDAMID} activeOpacity={0.7}>
              <Text className="text-white text-lg font-medium">{`12345678901`}</Text>
              <Image source={icons.copy} className="w-4 h-4 ml-2" tintColor="white" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-bold">{`Rp. 35.000,-`}</Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center mt-5">
          <Text className="text-white opacity-70 font-bold mr-4">• {customerType === "pascabayar" ? "Pascabayar" : "Prabayar"}</Text>
          <TouchableOpacity
            onPress={handleNavigation} // Updated onPress handler
            className="rounded-full">
            <LinearGradient
              colors={["#8CC0FFFF", "#0263FFFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 7,
              }}
              className="py-2 px-5 flex-row items-center space-x-2">
              <Image source={icons.pay} className="w-3.5 h-4" tintColor="white" />
              <Text className="text-white font-medium text-sm">{customerType === "pascabayar" ? "Bayar Sekarang" : "Beli Token"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Riwayat Penggunaan Air */}
      <View className="mb-[250px]">
        <View className="ml-7 mt-7">
          <Text className="text-black text-lg font-bold">Riwayat Penggunaan Air {">"}</Text>
          <Text className="text-black mt-1 mb-4">Jan 2025</Text>
        </View>
        <View>
          <LineChart
            data={chartData}
            width={screenWidth - 30}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            withHorizontalLabels={true}
            withVerticalLabels={true} // Enable vertical labels
            withInnerLines={true} // Enable inner lines
            withOuterLines={true} // Enable outer lines
            getDotColor={() => "#2181FF"}
            segments={4}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
