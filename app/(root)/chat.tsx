import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
// Misalnya Anda punya ikon sendiri:
import { icons } from "@/constants";
import { router } from "expo-router";

const ChatScreen = () => {
  // Contoh data percakapan
  const conversation = [
    {
      id: 1,
      sender: "cs",
      text: "Apakah masih ada yang perlu kami bantu pak?",
      time: "8 Jan 15.45",
    },
    {
      id: 2,
      sender: "user",
      text: "Sudah cukup untuk saat ini. Terima kasih banyak",
      time: "8 Jan 15.50",
    },
    {
      id: 3,
      type: "divider",
      text: "Today 9.00",
    },
    {
      id: 4,
      sender: "user",
      text: "Halo kak selamat pagi. Saya mengalami kendala lagi.",
      time: "9.00",
    },
    {
      id: 5,
      sender: "cs",
      text: "Halo pak selamat pagi. Dengan cs Sumarni, apa ada yang bisa saya bantu?",
      time: "9.01",
    },
    {
      id: 6,
      sender: "user",
      text: "Meteran saya tidak terbaca lagi.",
      time: "9.02",
    },
    {
      id: 7,
      sender: "cs",
      text: "Baik pak. Bisa dibantu dengan ID PDAM bapak dan alamat bapak saat ini?",
      time: "9.03",
    },
    {
      id: 8,
      sender: "user",
      text: "Nama saya Sumarno. Alamat saya saat ini berada di Ampekale.",
      time: "9.04",
    },
  ];

  // Fungsi untuk menampilkan bubble chat
  const ChatBubble = ({ sender, text, time, type, dividerText }) => {
    // Jika ini tipe "divider", tampilkan teks di tengah (misalnya 'Today 9.00')
    if (type === "divider") {
      return (
        <View style={{ alignItems: "center", marginVertical: 8 }}>
          <Text style={{ color: "#6b7280", fontSize: 12 }}>{dividerText}</Text>
        </View>
      );
    }

    const isUser = sender === "user";
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: isUser ? "flex-end" : "flex-start",
          marginVertical: 4,
          paddingHorizontal: 8,
        }}>
        {/* Bubble */}
        <View
          style={{
            maxWidth: "75%",
            backgroundColor: isUser ? "#2181FF" : "#f1f5f9",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 12,
          }}>
          <Text style={{ color: isUser ? "#fff" : "#111827" }}>{text}</Text>
          <Text
            style={{
              color: isUser ? "rgba(255,255,255,0.8)" : "#6b7280",
              fontSize: 10,
              marginTop: 4,
              textAlign: isUser ? "right" : "left",
            }}>
            {time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {/* Header */}
      <LinearGradient
        colors={["#004EBA", "#2181FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: 50,
          height: 120,
          paddingBottom: 30,
          paddingHorizontal: 16,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          justifyContent: "flex-end",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={icons.backArrow} style={{ width: 24, height: 24, tintColor: "#fff" }} />
          </TouchableOpacity>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", marginLeft: 12 }}>Ticket #1435</Text>
        </View>
      </LinearGradient>

      {/* Daftar percakapan */}
      <ScrollView style={{ flex: 1, marginTop: 8 }}>
        {conversation.map((msg) =>
          msg.type === "divider" ? (
            <ChatBubble key={msg.id} type="divider" dividerText={msg.text} />
          ) : (
            <ChatBubble key={msg.id} sender={msg.sender} text={msg.text} time={msg.time} />
          )
        )}
      </ScrollView>

      {/* Input pesan di bagian bawah */}
      <LinearGradient
        colors={["#004EBA", "#2181FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 14,
          paddingHorizontal: 8,
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
        }}>
        <TouchableOpacity
          style={{
            borderRadius: 24,
            padding: 10,
          }}>
          <Image
            source={icons.add}
            style={{
              width: 20,
              height: 20,
              tintColor: "#fff",
            }}
          />
        </TouchableOpacity>
        <TextInput
          placeholder="Tulis pesan..."
          style={{
            flex: 1,
            backgroundColor: "#f3f4f6",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 24,
            marginRight: 8,
            marginLeft: 8,
          }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: "#1C6BD2FF",
            borderRadius: 24,
            padding: 10,
          }}>
          <Image source={icons.send} style={{ width: 20, height: 20, tintColor: "#fff" }} />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default ChatScreen;
