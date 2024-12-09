import { useUser } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import WaterBanner from "@/components/WaterBanner";
import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { useLocationStore } from "@/store";
import { Ride } from "@/types/type";

const Home = () => {
  const { user } = useUser();
  const { signOut } = useAuth();

  const { setUserLocation, setDestinationLocation } = useLocationStore();

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };

  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const {
    data: recentRides,
    loading,
    error,
  } = useFetch<Ride[]>(`/(api)/ride/${user?.id}`);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });

      setUserLocation({
        latitude: location.coords?.latitude,
        longitude: location.coords?.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      });
    })();
  }, []);

  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);

    router.push("/(root)/find-ride");
  };

  return (
    <SafeAreaView className="bg-general-600">
      <FlatList
        data={recentRides?.slice(0, 5)}
        renderItem={({ item }) => <RideCard ride={item} />}
        keyExtractor={(item, index) => index.toString()}
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
                  alt="No recent data found"
                  resizeMode="contain"
                />
                <Text className="text-sm">No recent data found</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Image
                source={images.waterDrop}
                className="w-10 h-10"
                alt="No recent data found"
                resizeMode="contain"
              />
              <Text className="text-xl font-JakartaExtraBold">
                Hai Khaidir {user?.firstName}
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                className="justify-center items-center w-10 h-10 rounded-lg border border-gray-200 bg-white"
              >
                <Image source={icons.out} className="w-4 h-4" />
              </TouchableOpacity>
            </View>

            <WaterBanner />
            <View className="flex flex-row space-x-2 mt-4">
              {/* Button Pascabayar */}
              <TouchableOpacity
                className="flex flex-row items-start justify-start py-3 px-2 bg-sky-200 rounded-xl flex-1"
                onPress={() => {
                  router.replace("/(root)/beli-token");
                }}
              >
                <Image source={images.waterDrop} className="w-10 h-10 mr-2" />
                <View className="flex flex-col">
                  <Text className="text-sky-500 font-semibold text-base">
                    Tagihan PDAM
                  </Text>
                  <Text className="text-gray-500 font-base text-sm">
                    Pascabayar
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Button Prabayar */}
              <TouchableOpacity
                className="flex flex-row items-start justify-start py-3 px-2 bg-sky-200 rounded-xl flex-1"
                onPress={() => {
                  router.replace("/(root)/beli-token");
                }}
              >
                <Image source={images.waterDrop} className="w-10 h-10 mr-2" />
                <View className="flex flex-col">
                  <Text className="text-sky-500 font-semibold text-base">
                    Token Air
                  </Text>
                  <Text className="text-gray-500 font-base text-sm">
                    Prabayar
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <>
              <Text className="text-lg font-JakartaBold mt-5 mb-3">
                Riwayat Transaksi
              </Text>
              {/* list */}
              <View className="mb-3 flex flex-row justify-between items-center p-3 w-full h-20 bg-white shadow-2xl rounded-2xl">
                {/* Start View */}
                <View className="flex justify-center items-center w-14 h-14 rounded-lg bg-sky-100">
                  <Image source={images.waterDrop} className="w-10 h-10" />
                </View>

                {/* Mid View */}
                <View className="flex flex-1 mx-2 flex-col h-full justify-start items-start">
                  <Text className="font-semibold text-base">Tagihan PDAM</Text>
                  <Text className="text-gray-500 text-md">ID 004231123</Text>
                </View>

                {/* End View */}
                <View className="flex flex-col justify-start items-end h-full mt-3">
                  <Text className="font-semibold text-xs text-gray-400">
                    Jumat, 22 Nov 2024
                  </Text>
                  <Text className="text-black font-medium">Rp.34.500</Text>
                </View>
              </View>
              {/* list */}
              <View className="mb-3 flex flex-row justify-between items-center p-3 w-full h-20 bg-white shadow-2xl rounded-2xl">
                {/* Start View */}
                <View className="flex justify-center items-center w-14 h-14 rounded-lg bg-sky-100">
                  <Image source={images.waterDrop} className="w-10 h-10" />
                </View>

                {/* Mid View */}
                <View className="flex flex-1 mx-2 flex-col h-full justify-start items-start">
                  <Text className="font-semibold text-base">Tagihan PDAM</Text>
                  <Text className="text-gray-500 text-md">ID 004231123</Text>
                </View>

                {/* End View */}
                <View className="flex flex-col justify-start items-end h-full mt-3">
                  <Text className="font-semibold text-xs text-gray-400">
                    Jumat, 22 Nov 2024
                  </Text>
                  <Text className="text-black font-medium">Rp.34.500</Text>
                </View>
              </View>
              {/* list */}
              <View className="mb-3 flex flex-row justify-between items-center p-3 w-full h-20 bg-white shadow-2xl rounded-2xl">
                {/* Start View */}
                <View className="flex justify-center items-center w-14 h-14 rounded-lg bg-sky-100">
                  <Image source={images.waterDrop} className="w-10 h-10" />
                </View>

                {/* Mid View */}
                <View className="flex flex-1 mx-2 flex-col h-full justify-start items-start">
                  <Text className="font-semibold text-base">Tagihan PDAM</Text>
                  <Text className="text-gray-500 text-md">ID 004231123</Text>
                </View>

                {/* End View */}
                <View className="flex flex-col justify-start items-end h-full mt-3">
                  <Text className="font-semibold text-xs text-gray-400">
                    Jumat, 22 Nov 2024
                  </Text>
                  <Text className="text-black font-medium">Rp.34.500</Text>
                </View>
              </View>
            </>

            <Text className="text-lg font-JakartaBold mt-5 mb-3">
              Berita Terbaru
            </Text>
          </>
        }
      />
    </SafeAreaView>
  );
};

export default Home;
