import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { icons } from "@/constants";

const NotificationInbox = () => {
  const [activeTab, setActiveTab] = useState("Percakapan");

  const notifications = [
    {
      title: "Pembelian Token Air",
      time: "7 Jan 10.30",
      status: "success",
    },
    {
      title: "Pemeliharaan Sistem Selesai",
      time: "7 Jan 10.00",
    },
    {
      title: "Pembelian Token Air",
      time: "7 Jan 9.30",
      status: "error",
    },
    {
      title: "Pembelian Token Air",
      time: "7 Jan 8.30",
      status: "error",
    },
    {
      title: "Pemeliharaan Sistem",
      time: "7 Jan 8.00",
    },
    {
      title: "Pembelian Token Air",
      time: "6 Jan 10.30",
      status: "success",
    },
    {
      title: "Pembelian Token Air",
      time: "4 Jan 10.30",
      status: "success",
    },
    {
      title: "Pembelian Token Air",
      time: "2 Jan 10.30",
      status: "success",
    },
    {
      title: "Selamat Tahun Baru",
      time: "1 Jan 00.01",
    },
  ];

  const chatMessages = [
    {
      id: "1435",
      time: "7 Jan 9.00",
    },
  ];

  const renderContent = () => {
    if (activeTab === "Percakapan") {
      return (
        <ScrollView className="flex-1">
          {chatMessages.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              onPress={() => router.push("/(root)/chat")}
              className="bg-white flex-row items-center rounded-xl mx-5 mt-3 px-4 py-4 border border-gray-100 shadow-sm">
              <View className="mr-5">
                <Image source={icons.chat} className="w-6 h-6" tintColor="#2181FF" />
              </View>
              <View className="flex-1 flex-row w-full justify-between items-center">
                <Text className="text-lg font-semibold">Ticket #{chat.id}</Text>
                <Text className="text-gray-500">{chat.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      );
    }
    return (
      <ScrollView className="flex-1">
        {notifications.map((notification, index) => (
          <View key={index} className="flex-row items-center rounded-xl mx-5 mt-3 px-4 py-4 border border-gray-100">
            {notification.status && (
              <View className="mr-5">
                {notification.status === "success" ? (
                  <View className="w-6 h-6">
                    <Image source={icons.checkmark} className="w-full h-full" tintColor="#22C55E" />
                  </View>
                ) : (
                  <View className="w-6 h-6">
                    <Image source={icons.error} className="w-full h-full" tintColor="#EF4444" />
                  </View>
                )}
              </View>
            )}
            <View className="flex-1">
              <Text className="text-lg font-semibold">{notification.title}</Text>
              <Text className="text-gray-500">{notification.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <LinearGradient
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 2.84,
          elevation: 5,
        }}
        colors={["#004EBA", "#2181FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 h-[13%] pb-5 px-4 rounded-b-xl justify-end">
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={icons.backArrow} className="w-6 h-6" tintColor="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Kotak Masuk</Text>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View className="flex-row border-b border-gray-200">
        {["Percakapan", "Notifikasi"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`flex-1 py-4 ${activeTab === tab ? "border-b-2 border-blue-500" : ""}`}>
            <Text className={`text-center text-base ${activeTab === tab ? "text-blue-500 font-semibold" : "text-gray-600"}`}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {renderContent()}
    </View>
  );
};

export default NotificationInbox;
