import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { icons } from "@/constants";

// 1. Definisikan style yang sering dipakai
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuButton: {
    padding: 12,
    backgroundColor: "white",
    borderColor: "rgba(107, 114, 128, 0.5)",
    borderWidth: 0.5,
    borderRadius: 12,
    marginVertical: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  arrowIcon: {
    width: 16, // Sesuaikan ukuran sesuai kebutuhan
    height: 16,
    transform: [{ rotate: "90deg" }],
    tintColor: "black", // Opsional: Ubah warna ikon jika diperlukan
  },
});

// 2. Komponen tombol menu generik dengan ikon panah
const MenuButton = ({ label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.menuButton]}>
      <Text className="text-sm text-black">{label}</Text>
      <Image source={icons.arrowUp} style={styles.arrowIcon} />
    </TouchableOpacity>
  );
};

const Pengaturan = () => {
  // 3. Data menu untuk pengaturan akun
  const accountMenus = [
    { label: "Update Akun", onPress: () => router.push("/(root)/change-password") },
    { label: "Change Pin Transaction", onPress: () => router.push("/(root)/change-pinTrans") },
    { label: "Metode Pembayaran", onPress: () => {} },
  ];

  // 4. Data menu untuk bantuan
  const helpMenus = [
    { label: "Transisi Ke Token", onPress: () => {} },
    { label: "FAQ", onPress: () => {} },
    { label: "Hubungi Admin", onPress: () => {} },
    { label: "Support Tickets", onPress: () => {} },
  ];

  // 5. Fungsi handleLogout (placeholder)
  const handleLogout = () => {
     router.push('/(auth)/sign-in'); 
  };

  return (
    <GestureHandlerRootView className="flex-1 bg-white">
      {/* Bungkus konten dalam ScrollView untuk mencegah scroll meluap */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header dengan gradien */}
        <LinearGradient
          style={[styles.shadow]}
          colors={["#004EBA", "#2181FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="h-[35%] rounded-b-xl relative justify-start">
          {/* Bar atas dengan judul dan ikon bantuan di kanan */}
          <View className="flex-row justify-between items-center px-5 mt-10">
            <Text className="text-white text-lg font-bold">Pengaturan</Text>
            <TouchableOpacity
              onPress={() => {
                /* aksi jika tombol tanya ditekan */
              }}>
              <Image source={icons.question} className="w-5 h-5" tintColor="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Card Profil Pengguna (ditampilkan di bawah header) */}
        <View style={[styles.shadow]} className="-mt-48 bg-white mx-5 rounded-lg p-4">
          <View className="flex-row items-center">
            <Image source={icons.account} className="w-5 h-5 mr-2" />
            <Text className="text-black text-base font-semibold">Sumarno</Text>
          </View>
        </View>

        {/* Card Utama Pengaturan */}
        <View style={[styles.shadow]} className="bg-white mx-5 mt-7 rounded-lg p-4">
          {/* Pengaturan Akun */}
          <Text className="text-sm font-bold mb-2">Pengaturan Akun</Text>
          {accountMenus.map((item, index) => (
            <MenuButton key={index} label={item.label} onPress={item.onPress} />
          ))}

          {/* Bantuan */}
          <Text className="text-sm font-bold mt-5 mb-2">Bantuan</Text>
          {helpMenus.map((item, index) => (
            <MenuButton key={index} label={item.label} onPress={item.onPress} />
          ))}

          {/* Tombol Logout */}
          <TouchableOpacity onPress={handleLogout} className="p-3 bg-rose-600 rounded-xl shadow-xl mt-4">
            <Text className="text-sm text-white font-medium text-center">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="mt-28">
          <Text className="text-center text-gray-400">© Mata Air 2025</Text>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default Pengaturan;
