import React, { ReactNode, useState, useRef, useEffect } from "react";
import { icons } from "@/constants";
import { router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  ScrollView,
} from "react-native";

interface TransaksiLayoutProps {
  children: ReactNode;
}

const TransaksiLayout: React.FC<TransaksiLayoutProps> = ({ children }) => {
  const [nomorPDAM, setNomorPDAM] = useState("");
  const [selectedPelanggan, setSelectedPelanggan] = useState(null);
  const [selectedHarga, setSelectedHarga] = useState(""); // State untuk menyimpan harga yang dipilih
  const fadeAnim = useRef(new Animated.Value(0)).current; // Untuk animasi fade

  const riwayat = [
    {
      id: "1",
      nama: "Khaidir Ali Rahman",
      tanggal: "Jumat, 22 Nov 2024",
      nomor: "004231123",
      harga: "Rp. 22.500",
    },
    {
      id: "2",
      nama: "Ujang padang",
      tanggal: "Jumat, 22 Okt 2024",
      nomor: "002998172",
      harga: "Rp. 32.500",
    },
    {
      id: "3",
      nama: "Ujang padang",
      tanggal: "Jumat, 22 Okt 2024",
      nomor: "002998172",
      harga: "Rp. 102.500",
    },
    {
      id: "4",
      nama: "Anto Saputra",
      tanggal: "Jumat, 22 Sep 2024",
      nomor: "004887612",
      harga: "Rp. 52.500",
    },
  ];

  const handleNomorPDAMChange = (text: string) => {
    setNomorPDAM(text);

    if (text.trim() === "") {
      // Jika input kosong, reset pelanggan
      setSelectedPelanggan(null);
    } else {
      // Cari pelanggan berdasarkan nomor PDAM
      const pelanggan = riwayat.find((item) => item.nomor.includes(text));
      setSelectedPelanggan(pelanggan || null);
    }
  };

  const handleBeliLagi = (nomor: string) => {
    setNomorPDAM(nomor); // Masukkan nomor token ke input
    setSelectedPelanggan(riwayat.find((item) => item.nomor === nomor)); // Cari pelanggan berdasarkan nomor token
    setSelectedHarga(""); // Reset harga yang dipilih
  };

  // Fade-in animation saat selectedPelanggan berubah
  useEffect(() => {
    if (selectedPelanggan) {
      Animated.timing(fadeAnim, {
        toValue: 1, // Opasitas penuh
        duration: 300, // Durasi dalam milidetik
        useNativeDriver: true, // Gunakan driver native untuk performa
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0, // Opasitas 0
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedPelanggan]);

  // Filter riwayat berdasarkan nomor PDAM yang diinput
  const filteredRiwayat = riwayat.filter((item) =>
    item.nomor.includes(nomorPDAM)
  );

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-slate-100">
        {/* Header */}
        <View className="bg-sky-400 py-28 px-5 relative">
          <View className="absolute top-16 left-5 flex flex-row items-center">
            <TouchableOpacity
              onPress={() => {
                router.replace("/(tabs)/home");
              }}
            >
              <View className="w-10 h-10 rounded-xl border border-white items-center justify-center">
                <Image
                  source={icons.backArrow}
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
                onChangeText={handleNomorPDAMChange}
              />
              {nomorPDAM.trim() !== "" && (
                <TouchableOpacity
                  onPress={() => {
                    setNomorPDAM(""); // Reset nomorPDAM
                    setSelectedPelanggan(null); // Reset pelanggan
                    setSelectedHarga(""); // Reset harga
                  }}
                  className="ml-2"
                >
                  <Text className="text-gray-500 text-xl">×</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Informasi Pelanggan */}
        {selectedPelanggan && (
          <Animated.View
            style={{
              opacity: fadeAnim, // Gunakan animasi fade
            }}
            className="px-5 mt-4"
          >
            <View className="bg-green-100 border border-green-400 p-4 shadow-md rounded-xl">
              <View className="flex flex-row justify-between items-start">
                <Text className="text-gray-500">Nama Pelanggan</Text>
                <Text className="text-gray-500">Nomor</Text>
              </View>
              <View className="flex flex-row justify-between items-start">
                <Text>{selectedPelanggan.nama}</Text>
                <Text>{selectedPelanggan.nomor}</Text>
              </View>
            </View>

            {/* Pilihan Harga */}
            {selectedPelanggan && (
              <ScrollView style={{ marginTop: 16 }}>
                <Text className="text-gray-700 text-lg font-semibold">
                  Pilih Token
                </Text>
                <View className="flex flex-row flex-wrap justify-between mt-2">
                  {[
                    "Rp. 20.000",
                    "Rp. 50.000",
                    "Rp. 100.000",
                    "Rp. 150.000",
                  ].map((harga, index) => (
                    <TouchableOpacity
                      key={index}
                      className="bg-white shadow-md p-4 rounded-lg w-[48%] items-center mb-2"
                      onPress={() => setSelectedHarga(harga)} // Set harga yang dipilih
                    >
                      <Image
                        source={icons.drops}
                        className="w-6 h-6 mb-2"
                        tintColor="#0ea5e9"
                      />
                      <Text className="text-gray-700 font-semibold">
                        {harga}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}
          </Animated.View>
        )}

        {/* Riwayat Terakhir */}
        <Text className="text-gray-700 text-lg font-semibold px-5 mt-6">
          Riwayat Transaksi
        </Text>
        <ScrollView>
          <View className="px-5">
            <FlatList
              data={filteredRiwayat} // Menggunakan riwayat yang sudah difilter
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="flex flex-col items-center bg-white shadow-md p-4 rounded-lg my-2">
                  <View className="w-full flex flex-row justify-between items-center">
                    <View className="flex flex-row justify-start items-start">
                      <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                        <Image
                          source={icons.drops}
                          resizeMode="contain"
                          className="w-6 h-6"
                          tintColor="#0ea5e9"
                        />
                      </View>
                      <View>
                        <Text className="font-JakartaSemiBold text-sm text-gray-800">
                          Token Air
                        </Text>
                        <Text className="text-gray-500 text-xs">
                          ID {item.nomor}
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
                  <TouchableOpacity
                    className="border-0 border-t pt-2 border-gray-200 flex flex-row justify-between w-full items-center mt-4"
                    onPress={() => handleBeliLagi(item.nomor)} // Handle klik beli lagi
                  >
                    <Text className="text-gray-500 text-xs ml-2">
                      {item.nama}
                    </Text>
                    <View>
                      <Text className="text-sky-500 text-sm">Beli lagi</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

export default TransaksiLayout;
