import { useUser, useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {images, icons} from "@/constants";

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };
  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="bg-slate-100"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header Section */}
        <View className="bg-sky-400 rounded-b-[30px] px-5 pt-10 pb-8">
          <View className="absolute top-5 left-5 flex flex-row items-center">

          <TouchableOpacity>
            <View className="h-10 w-10 border-2 border-white rounded-full flex items-center justify-center">
            <Image
              source={icons.arrowDown}
              className="w-6 h-6 origin-top rotate-90"
              tintColor="#ffffff"
              />
            </View>
          </TouchableOpacity>
          <Text className="text-white text-xl font-JakartaSemiBold ml-5">
            Profile
          </Text>
        </View>
          
          <View className="flex items-center mt-12 mb-4">
            <Image
              source={images.profile1}
              style={{ width: 90, height: 90, borderRadius: 45 }}
              className="border-2 border-white shadow-md"
            />
            <Text className="text-white text-lg font-bold mt-1">
              {user?.firstName} {user?.lastName || "User Example at this moment"}
            </Text>
            <Text className="text-white text-sm">{user?.primaryEmailAddress?.emailAddress || "user@example.com"}</Text>
          </View>
          </View>
      <View className="p-1 bg-white rounded-xl h-full shadow-lg mt-[-25px] mx-5 z-10 mb-5">

        {/* Settings Section */}
        <View className="mt-6 px-5">
          <Text className="text-lg font-bold mb-2">Pengaturan lain</Text>
          <TouchableOpacity className="flex flex-row justify-between items-center bg-white border border-gray-200 px-4 py-4 rounded-lg mb-2">
            <Text className="text-base">Ubah Kata Sandi</Text>
            <Image 
            source={icons.arrowUp}
            className="origin-right rotate-90"
            />
          </TouchableOpacity>

          <Text className="text-lg font-bold mt-4 mb-2">Layanan</Text>
          <TouchableOpacity className="flex flex-row justify-between items-center bg-white border border-gray-200 px-4 py-4 rounded-lg mb-3">
            <Text className="text-base">FAQ</Text>
            <Image 
            source={icons.arrowUp}
            className="origin-right rotate-90"
            />
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-row justify-between items-center bg-white border border-gray-200 px-4 py-4 rounded-lg mb-4">
            <Text className="text-base">Customer Service</Text>
            <Image 
            source={icons.arrowUp}
            className="origin-right rotate-90"
            />
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View className="px-5">
          <TouchableOpacity onPress={handleSignOut} className="bg-red-400 py-4 rounded-lg">
            <Text className="text-center text-white font-bold">Keluar</Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
