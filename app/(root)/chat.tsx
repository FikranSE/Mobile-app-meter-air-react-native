import { useState } from "react";
import {
  Image,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants"; // Path gambar kosong

const initialMessages = [
  {
    id: 1,
    sender: "admin",
    text: "Selamat datang! Ada yang bisa kami bantu?",
    time: "10:00 AM",
  },
  {
    id: 2,
    sender: "customer",
    text: "Halo Admin, saya ingin menanyakan tagihan saya.",
    time: "10:02 AM",
  },
  {
    id: 3,
    sender: "admin",
    text: "Tentu, bisa diinformasikan ID pelanggan Anda?",
    time: "10:05 AM",
  },
  {
    id: 4,
    sender: "customer",
    text: "ID Pelanggan saya 2836432718.",
    time: "10:07 AM",
  },
];

const Chat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const newMsg = {
      id: messages.length + 1,
      sender: "customer",
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMsg]);
    setNewMessage(""); // Kosongkan input setelah mengirim pesan
  };

  const renderMessage = ({ item }) => {
    const isAdmin = item.sender === "admin";
    return (
      <View
        className={`flex flex-row ${isAdmin ? "justify-start" : "justify-end"} mb-4`}
      >
        <View
          className={`max-w-[70%] px-4 py-2 rounded-lg shadow-sm ${
            isAdmin ? "bg-white" : "bg-sky-500"
          }`}
        >
          <Text
            className={`${isAdmin ? "text-gray-700" : "text-white"} font-medium`}
          >
            {item.text}
          </Text>
          <Text
            className={`text-xs mt-1 ${isAdmin ? "text-gray-500" : "text-gray-200"} self-end`}
          >
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-100 p-5">
      <Text className="text-2xl font-JakartaBold mb-4">Chat</Text>

      {/* ScrollView untuk menampilkan pesan yang bisa digulir */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Jika ada pesan */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingBottom: 60 }} // Memberikan ruang untuk input
        />
      </ScrollView>

      {/* Input Pesan tetap tampil di bawah, baik ada pesan atau tidak */}
      <View className="flex-row items-center bg-white p-3 rounded-full shadow-md mt-3">
        <TextInput
          className="flex-1 text-base text-gray-700 px-3"
          placeholder="Ketik pesan..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity
          onPress={sendMessage}
          className="bg-sky-500 px-4 py-2 rounded-full"
        >
          <Text className="text-white font-bold">Kirim</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Chat;
