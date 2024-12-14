import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";
import { icons, images } from "@/constants"; // Pastikan path icons benar

const DetailTransaksi = () => {
  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-slate-100">
        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Header */}
          <View className="flex-row justify-between items-center m-5 mt-10">
            <TouchableOpacity onPress={() => router.back()}>
              <View className="bg-white p-2 rounded-lg border border-gray-200">
                <Image
                  source={icons.arrowDown}
                  className="w-6 h-6 origin-top rotate-90"
                  tintColor="#000"
                />
              </View>
            </TouchableOpacity>
            <Text className="font-bold text-lg">Detail Transaksi</Text>
            <View className="w-6" />
          </View>

          {/* Main Content */}
          <View className="px-5">
            {/* Section: Transaksi */}
            <View className="mt-5 bg-white rounded-lg shadow-sm">
              <View className="border-t border-gray-200">
                {[
                  { label: "Pembayaran", value: "Tagihan PDAM" },
                  { label: "ID Transaksi", value: "PY28735273" },
                  { label: "Tanggal", value: "Jumat, 22 Nov 2024" },
                  { label: "Status", value: "Success", isBadge: true },
                  { label: "ID Pelanggan", value: "2836432718" },
                  { label: "Nama Pelanggan", value: "User example" },
                  { label: "Alat Bayar", value: "BCA", isImage: true },
                  { label: "Tagihan", value: "Rp. 234.000" },
                  { label: "Biaya Admin", value: "Rp. 2.500" },
                  { label: "Total", value: "Rp. 236.500", bold: true },
                ].map((item, index) => (
                  <View
                    key={index}
                    className="flex flex-row justify-between items-center px-4 py-2 border-b border-gray-200"
                  >
                    <Text
                      className={`${
                        item.bold
                          ? "font-semibold text-black text-xl"
                          : "text-gray-500"
                      }`}
                    >
                      {item.label}
                    </Text>

                    {/* Kondisi untuk value */}
                    {item.isBadge ? (
                      <View className="bg-teal-500 px-2 py-1 rounded-full">
                        <Text className="text-white font-semibold">
                          Success
                        </Text>
                      </View>
                    ) : item.isImage ? (
                      <View className="flex flex-row items-center space-x-2">
                        <Image
                          source={images.bca} // Ganti dengan path gambar BCA
                          className="w-12 h-8"
                        />
                        <Text className="text-gray-900 font-medium">BCA</Text>
                      </View>
                    ) : (
                      <Text
                        className={`${
                          item.bold
                            ? "font-semibold text-green-700 text-xl"
                            : "font-medium text-gray-900"
                        }`}
                      >
                        {item.value}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Button Pilih Metode Pembayaran */}
            <TouchableOpacity
              onPress={() => {
                alert("Metode Pembayaran Dipilih");
              }}
              className="absolute bottom-[-270] left-5 right-5 bg-sky-500 rounded-full py-2 mt-5 items-center shadow-lg"
            >
              <Text className="text-white text-lg font-semibold">
                Download Bukti Transaksi
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

export default DetailTransaksi;
