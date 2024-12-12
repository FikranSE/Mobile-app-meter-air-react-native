import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Linking } from "react-native";
import { icons, images } from "@/constants";
import { router } from "expo-router";
// Dummy news data
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
];

const NewsCard = ({ image, title, author, time, url }) => {
  const handlePress = () => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-lg shadow-sm mr-4 w-64"
      onPress={handlePress}
    >
      <Image
        source={image}
        className="w-full h-32 rounded-t-lg"
        resizeMode="cover"
      />
      <View className="p-4">
        <Text className="text-gray-500 text-sm mb-1">{time}</Text>
        <Text
          className="text-base font-semibold text-gray-900"
          numberOfLines={2}
        >
          {title}
        </Text>
        <View className="flex-row items-center mt-2">
          <Image
            source={images.profile1}
            className="w-6 h-6 rounded-full mr-2"
          />
          <Text className="text-gray-700 text-sm">{author}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const NewsSection = () => {
  return (
    <View>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold">Berita Terbaru</Text>
        <TouchableOpacity>
          <Text className="text-gray-500">Lihat semua</Text>
        </TouchableOpacity>
      </View>

      {dummyNewsData.length > 0 ? (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View className="flex-row">
            {dummyNewsData.map((news) => (
              <NewsCard
                key={news.id}
                image={news.image}
                title={news.title}
                author={news.author}
                time={news.time}
                url={news.url}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <View className="flex items-center justify-center p-4">
          <Image
            source={images.noresult}
            className="w-40 h-40"
            resizeMode="contain"
          />
          <Text className="text-gray-500 mt-4 text-center">
            Tidak ada berita tersedia saat ini
          </Text>
        </View>
      )}
    </View>
  );
};

export default NewsSection;
