import React, { ReactNode, useState } from "react";
import { icons, images } from "@/constants";
import { router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";

interface TransaksiLayoutProps {
  children: ReactNode;
}

const TransaksiLayout: React.FC<TransaksiLayoutProps> = ({ children }) => {
  const [nomorPDAM, setNomorPDAM] = useState("");

  const riwayat = [
    {
      id: "1",
      nama: "Khaidir Ali Rahman",
      tanggal: "Jumat, 22 Nov 2024",
      nomor: "ID 004231123",
      harga: "Rp. 52.500",
    },
    {
      id: "2",
      nama: "Khaidir Ali Rahman",
      tanggal: "Jumat, 22 Okt 2024",
      nomor: "ID 004231123",
      harga: "Rp. 52.500",
    },
    {
      id: "3",
      nama: "Khaidir Ali Rahman",
      tanggal: "Jumat, 22 Sep 2024",
      nomor: "ID 004231123",
      harga: "Rp. 52.500",
    },
  ];

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-sky-100">
        {/* Header */}
        <View className="bg-sky-400 py-28 px-5 relative">
          {/* Wrapper untuk ikon dan teks */}
          <View className="absolute top-16 left-5 flex flex-row items-center">
            <TouchableOpacity onPress={() =>{ router.replace('/(tabs)/home');}}>
              <View className="w-10 h-10 rounded-xl border border-white items-center justify-center">
                <Image
                  source={icons.backArrow} // Pastikan sumber ikon benar
                  resizeMode="contain"
                  className="w-6 h-6"
                  tintColor="white"
                />
              </View>
            </TouchableOpacity>
            <Text className="text-white text-xl font-JakartaSemiBold ml-5">
              Token Air
            </Text>
          </View>
        </View>

        {/* Input Nomor PDAM */}
        <View className="px-5 mt-[-70px]">
          <View className="bg-white p-5 shadow-md rounded-xl">
            <Text className="text-gray-700 text-lg font-semibold">
              Nomor PDAM
            </Text>
            <View className="flex flex-row items-center bg-gray-100 p-3 rounded-lg mt-2 border border-gray-200">
              <TextInput
                placeholder="masukan nomor PDAM"
                className="flex-1 text-gray-500"
                value={nomorPDAM}
                onChangeText={setNomorPDAM}
              />
            </View>
          </View>
        </View>

        {/* Riwayat Terakhir */}
        <View className="px-5 mt-6">
          <Text className="text-gray-700 text-lg font-semibold">
            Riwayat Terakhir
          </Text>
          <FlatList
            data={riwayat}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="flex flex-col items-center bg-white shadow-md p-4 rounded-lg my-2">
                {/*  */}
                <View className="w-full flex flex-row justify-between items-center">
                  <View className="flex flex-row justify-start items-start">
                    <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                      <Image
                        source={images.waterDrop} // Ganti path sesuai lokasi ikon Anda
                        resizeMode="contain"
                        className="w-6 h-6"
                      />
                    </View>
                    <View>
                      <Text className="font-JakartaSemiBold text-sm text-gray-800">
                        Token Air
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        {item.nomor}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-gray-400 text-xs">
                      {item.tanggal}
                    </Text>
                    <Text className="font-JakartaSemiBold text-sm">
                      {item.harga}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity className="flex flex-row justify-between w-full items-center mt-4">
                  {/* Nama Customer */}
                  <Text className="text-gray-500 text-xs ml-2">
                    {item.nama}
                  </Text>
                  {/* Button Beli Lagi */}
                  <View>
                    <Text className="text-sky-500 text-sm">Beli lagi</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default TransaksiLayout;
