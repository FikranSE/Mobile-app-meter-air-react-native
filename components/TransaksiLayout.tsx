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
  const [nomorPDAM, setNomorPDAM] = useState(""); // State utama untuk nomor PDAM
  const [nominal, setNominal] = useState(""); // State untuk nominal pembelian (validasi)
  const [selectedPelanggan, setSelectedPelanggan] = useState(null);
  const [selectedHarga, setSelectedHarga] = useState("");
  const [warning, setWarning] = useState(""); // State untuk pesan peringatan
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
  
    // Jika text kosong, reset warning
    if (text.trim() === "") {
      setWarning("");
      setSelectedPelanggan(null); // Reset pelanggan juga jika kosong
    } else {
      // Validasi nomor PDAM minimal 11 digit
      if (text.length < 9) {
        setWarning("Nomor meter terdiri dari minimum 9 digit");
      } else {
        setWarning(""); // Reset warning jika valid
      }
  
      // Cek apakah nomor PDAM ditemukan dalam riwayat pelanggan
      const pelanggan = riwayat.find((item) => item.nomor.includes(text));
      setSelectedPelanggan(pelanggan || null);
    }
  };
  

  // Handle nominal input change
  const handleNominalChange = (text: string) => {
    setNominal(text);

    // Validate minimal nominal is Rp 10.000
    const nominalValue = parseInt(text.replace(/\D/g, ""), 10); // Strip non-numeric characters
    if (nominalValue < 10000 && !isNaN(nominalValue)) {
      setWarning("Minimal nominal pembelian adalah Rp 10.000");
    } else {
      setWarning(""); // Reset warning if valid
    }

    // Show price after valid nominal is entered
    if (nominalValue >= 10000) {
      // If nominal is valid, find the customer and show the price
      const pelanggan = riwayat.find((item) => item.nomor === nomorPDAM);
      if (pelanggan) {
        setSelectedHarga(pelanggan.harga.toString()); // Set harga according to customer
      } else {
        setSelectedHarga(""); // Reset harga if no customer is found
      }
    } else {
      setSelectedHarga(""); // Reset harga if nominal is invalid
    }
  };

  // Handle re-buying by selecting a new nomor
  const handleBeliLagi = (nomor: string) => {
    setNomorPDAM(nomor);

    // Find customer by nomor
    const pelanggan = riwayat.find((item) => item.nomor === nomor);
    setSelectedPelanggan(pelanggan);

    // If customer found, set harga to the customer's price
    if (pelanggan) {
      setSelectedHarga(pelanggan.harga); // Set harga
      setNominal(pelanggan.harga.replace(/\D/g, "")); // Set nominal to harga (removing non-numeric)
    } else {
      setSelectedHarga(""); // Reset harga if no customer is found
      setNominal(""); // Reset nominal
    }
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
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
            {warning !== "" && (
              <View className="flex justify-center items-center p-3 rounded-lg bg-red-100 border border-red-300 mb-3">
                {/* Pesan Peringatan */}
                <Text className="text-red-500">{warning}</Text>
              </View>
            )}
  
            {/* Nomor PDAM */}
            <Text className="text-gray-700 text-lg font-semibold">Nomor PDAM</Text>
            <View className="flex flex-row items-center bg-gray-100 p-3 rounded-lg my-2 border border-gray-200">
              <TextInput
                placeholder="Masukkan nomor PDAM"
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
                    setWarning(""); // Reset warning jika input kosong
                  }}
                  className="ml-2"
                >
                  <Text className="text-gray-500 text-xl">×</Text>
                </TouchableOpacity>
              )}
            </View>
  
            {/* Nominal Pembelian */}
            <Text className="text-gray-700 text-lg font-semibold">Masukkan Nominal</Text>
            <View className="flex flex-row items-center bg-gray-100 p-3 rounded-lg mt-2 border border-gray-200">
              <TextInput
                placeholder="Masukkan nominal pembelian"
                className="flex-1 text-gray-500"
                value={nominal}
                onChangeText={handleNominalChange}
                keyboardType="numeric"
              />
              {nominal.trim() !== "" && (
                <TouchableOpacity
                  onPress={() => {
                    setNominal(""); // Reset nominal
                    setSelectedPelanggan(null); // Reset pelanggan
                    setSelectedHarga(""); // Reset harga
                    setWarning(""); // Reset warning jika input kosong
                  }}
                  className="ml-2"
                >
                  <Text className="text-gray-500 text-xl">×</Text>
                </TouchableOpacity>
              )}
            </View>
  
            {/* Tombol Beli */}
            <TouchableOpacity
              onPress={() => {
                // Action when "Beli" is pressed
                // You can add your logic here (e.g., validating inputs, processing payment)
              }}
              className="mt-4 bg-sky-400 p-3 rounded-lg items-center"
            >
              <Text className="text-white text-lg font-semibold">Beli</Text>
            </TouchableOpacity>
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
  
        {/* Riwayat Terakhir - Hanya tampilkan jika tidak ada pelanggan yang dipilih */}
        {!selectedPelanggan && (
          <Text className="text-gray-700 text-lg font-semibold px-5 mt-6">
            Riwayat Transaksi
          </Text>
        )}
  
        {/* Riwayat Transaksi */}
        {!selectedPelanggan && (
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
        )}
      </View>
    </ScrollView>
  </GestureHandlerRootView>
  
  );
};

export default TransaksiLayout;
