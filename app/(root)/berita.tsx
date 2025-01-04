import React from "react";
import { View, Text, Image, TouchableOpacity, FlatList, Linking, Alert } from "react-native";
import { icons, images } from "@/constants";
import { router } from "expo-router";

// Expanded dummy news data
const dummyNewsData = [
  {
    id: "1",
    image: images.berita1,
    title: "Apa Bedanya Air PAM, Air PDAM, dan Air Sumur Bor? Ini Cirinya...",
    author: "Khaidir Ali Rahman",
    time: "1 Hari yang lalu",
    url: "https://www.wh8indonesia.com/meteran-air-prabayar",
  },
  {
    id: "2",
    image: images.berita2,
    title: "Kepanjangan PDAM dan Layanannya.",
    author: "Khaidir Ali Rahman",
    time: "1 Hari yang lalu",
    url: "https://www.wh8indonesia.com/online-store",
  },
  {
    id: "3",
    image: images.berita1,
    title: "Inovasi Teknologi Air Bersih di Indonesia",
    author: "Siti Nurhaliza",
    time: "2 Hari yang lalu",
    url: "https://www.wh8indonesia.com/inovasi-teknologi-air",
  },
  {
    id: "4",
    image: images.berita2,
    title: "Tips Menghemat Air di Rumah Tangga",
    author: "Budi Santoso",
    time: "3 Hari yang lalu",
    url: "https://www.wh8indonesia.com/tips-menghemat-air",
  },
  {
    id: "5",
    image: images.berita1,
    title: "Dampak Kekeringan Terhadap Pasokan Air",
    author: "Ayu Lestari",
    time: "4 Hari yang lalu",
    url: "https://www.wh8indonesia.com/dampak-kekeringan",
  },
  {
    id: "6",
    image: images.berita2,
    title: "PDAM dan Upayanya Menjamin Kualitas Air",
    author: "Rizky Maulana",
    time: "5 Hari yang lalu",
    url: "https://www.wh8indonesia.com/pdam-kualitas-air",
  },
  {
    id: "7",
    image: images.berita1,
    title: "Mengapa Air Sumur Bor Masih Banyak Digunakan?",
    author: "Lina Marlina",
    time: "6 Hari yang lalu",
    url: "https://www.wh8indonesia.com/air-sumur-bor",
  },
  {
    id: "8",
    image: images.berita2,
    title: "Perbandingan Biaya Air PAM dan PDAM",
    author: "Doni Saputra",
    time: "7 Hari yang lalu",
    url: "https://www.wh8indonesia.com/perbandingan-biaya-air",
  },
  // Tambahkan lebih banyak data berita jika diperlukan
];

// NewsCard Component
const NewsCard = ({ image, title, author, time, url }) => {
  const handlePress = () => {
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open URL:", err);
      Alert.alert("Error", "Tidak dapat membuka link.");
    });
  };

  return (
    <TouchableOpacity className="bg-white rounded-lg shadow mb-4 w-full" onPress={handlePress} activeOpacity={0.8}>
      <Image source={image} className="w-full h-32 rounded-t-lg" resizeMode="cover" />
      <View className="p-4">
        <Text className="text-gray-500 text-sm mb-1">{time}</Text>
        <Text className="text-base font-semibold text-gray-900" numberOfLines={2}>
          {title}
        </Text>
        <View className="flex-row items-center mt-2">
          <Image source={images.profile1} className="w-6 h-6 rounded-full mr-2" resizeMode="cover" />
          <Text className="text-gray-700 text-sm">{author}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Berita Component
const Berita = () => {
  const renderItem = ({ item }) => (
    <NewsCard key={item.id} image={item.image} title={item.title} author={item.author} time={item.time} url={item.url} />
  );

  return (
    <View className="flex-1 bg-slate-100 px-4 pt-6 mt-5">
      {/* Header with Back Button */}
      <View className="flex-row items-center mb-4">
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => {
            router.replace("/(tabs)/home");
          }}
          className="mr-4"
          accessible={true}
          accessibilityLabel="Kembali">
          <View className="w-10 h-10 rounded-xl border border-gray-300 items-center justify-center">
            <Image source={icons.arrowDown} className="w-6 h-6 rotate-90" resizeMode="contain" tintColor="#000000" />
          </View>
        </TouchableOpacity>

        {/* Header Title */}
        <Text className="text-xl font-JakartaBold text-gray-900">Berita Terbaru</Text>
      </View>

      {/* News List */}
      {dummyNewsData.length > 0 ? (
        <FlatList
          data={dummyNewsData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      ) : (
        <View className="flex-1 items-center justify-center p-4">
          <Image source={images.noresult} className="w-40 h-40" resizeMode="contain" />
          <Text className="text-gray-500 mt-4 text-center">Tidak ada berita tersedia saat ini</Text>
        </View>
      )}
    </View>
  );
};

export default Berita;
