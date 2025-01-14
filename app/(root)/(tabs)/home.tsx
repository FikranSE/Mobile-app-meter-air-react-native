import { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Dimensions, Image, ImageBackground } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { LineChart } from "react-native-chart-kit";
import { icons, images } from "@/constants"; 

// Data untuk Chart
const chartData = {
  labels: ["1", "2", "3", "4", "5", "6", "7"],
  datasets: [
    {
      data: [50, 100, 80, 40, 90, 70, 110],
      color: (opacity = 1) => `rgba(33, 129, 255, ${opacity})`, // Matches the blue color from the image
      strokeWidth: 2,
    },
  ],
};

// Tipe Data untuk State
type CustomerType = "pascabayar" | "prabayar";

const Home = () => {
  const [customerType, setCustomerType] = useState<CustomerType>("pascabayar");
  const screenWidth = Dimensions.get("window").width;
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
    r: "3",
    strokeWidth: "2",
    stroke: "#2181FF",
  },
  propsForBackgroundLines: {
    strokeDasharray: "", // Solid lines
    stroke: "#E4E4E4",
    strokeWidth: 1,
  },
  propsForLabels: {
    fontSize: 12,
    fontWeight: "400",
  },
  fillShadowGradient: "rgba(33, 129, 255, 0.2)",
  fillShadowGradientOpacity: 0.3,
};

  return (
    <ScrollView className="flex-1 bg-white ">
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
        className="h-[40%] rounded-b-lg shadow-xl">
        <View className="flex-row justify-between items-center mt-5 p-5">
          <View className="flex-row items-center space-x-2">
            <Image source={icons.pin} className="w-3.5 h-4" tintColor="white" />
            <Text className="text-white text-lg font-base">Ampekale</Text>
          </View>
          <Feather name="mail" size={24} color="white" />
        </View>
        <Text className="text-white text-2xl font-bold text-center ">{customerType === "pascabayar" ? "Penggunaan Air" : "Air Tersisa"}</Text>
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
          <View className="flex-row justify-between mt-3">
            <Text className="text-white font-medium">{`12345678901`}</Text>
            <Text className="text-white font-bold">{`Rp. 35.000,-`}</Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center mt-5">
          <Text className="text-white opacity-70 font-bold mr-4">• {customerType === "pascabayar" ? "Pascabayar" : "Prabayar"}</Text>
          <TouchableOpacity onPress={() => router.push("/(root)/detail-tagihan")} className="rounded-full">
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
      <View className="p-5 mb-[250px]">
        <Text className="text-black text-lg font-bold">Riwayat Penggunaan Air {">"}</Text>
        <Text className="text-black mt-1 mb-4">Jan 2025</Text>

        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          withHorizontalLabels={true}
          withVerticalLabels={true}
          withInnerLines={true}
          withOuterLines={true}
          withVerticalLines={true}
          withHorizontalLines={true}
          getDotColor={() => "#2181FF"}
          segments={4}
        />
      </View>
    </ScrollView>
  );
};

export default Home;
