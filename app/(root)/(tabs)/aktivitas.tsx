import React from "react"; 
import {useRouter} from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images, icons } from "@/constants";

const dataRiwayat = [
  { id: "001", date: "Jumat, 22 Nov 2024", amount: "Rp.34.500" },
  { id: "002", date: "Sabtu, 23 Nov 2024", amount: "Rp.45.000" },
  { id: "003", date: "Minggu, 24 Nov 2024", amount: "Rp.50.000" },
  { id: "004", date: "Senin, 25 Nov 2024", amount: "Rp.60.000" },
];

const Aktivitas = () => {
  const loading = false;
  const error = false;
  const data = dataRiwayat;

  // State untuk search query
  const [searchQuery, setSearchQuery] = React.useState("");

  // Fungsi untuk menangani filter
  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // Filter data berdasarkan query pencarian
  const filteredData = data.filter(
    (item) => item.id.includes(searchQuery) || item.amount.includes(searchQuery)
  );

  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      {/* Header Pencarian dan Filter */}

      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              router.push("/(root)/detail-transaksi");
            }}
            className="mb-3 flex flex-row justify-between items-center p-4 py-3 bg-white shadow-lg rounded-xl"
          >
            <View className="flex justify-center items-center w-14 h-14 rounded-lg bg-slate-100">
              <Image
                source={icons.teardrop}
                className="w-10 h-10"
                tintColor="#0ea5e9"
              />
            </View>

            <View className="flex-1 mx-2 flex-col justify-start">
              <Text className="font-semibold text-base text-gray-800">
                Tagihan PDAM
              </Text>
              <Text className="text-sm text-gray-500">ID {item.id}</Text>
            </View>

            <View className="flex flex-col justify-start items-end">
              <Text className="text-xs text-gray-400">{item.date}</Text>
              <Text className="text-base font-semibold text-black">
                {item.amount}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt="Tidak ada riwayat transaksi"
                  resizeMode="contain"
                />
                <Text className="text-sm">Tidak ada riwayat transaksi</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={
          <View>
            <Text className="text-2xl font-JakartaBold my-5">Aktifitas</Text>
            <View className="flex-row items-center justify-between py-4">
              {/* TextInput Pencarian */}
              <TextInput
                value={searchQuery}
                onChangeText={handleSearch}
                placeholder="Cari ID atau Jumlah"
                className="flex-1 border border-gray-300 rounded-lg p-3 bg-white"
              />

              {/* Tombol Filter */}
              <TouchableOpacity className="ml-3 p-3 bg-white rounded-lg border border-gray-300">
                <Image
                  source={icons.filter}
                  className="w-6 h-6"
                  resizeMode="contain"
                  tintColor="#a1a1aa"
                />
              </TouchableOpacity>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Aktivitas;
