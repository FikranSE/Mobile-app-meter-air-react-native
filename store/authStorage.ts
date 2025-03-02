import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveToken(token) {
  await AsyncStorage.setItem("userToken", token);
}

export async function getToken() {
  return await AsyncStorage.getItem("userToken");
}
