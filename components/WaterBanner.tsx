import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { icons, images } from "@/constants";
const WaterBanner = () => {
  return (
    <View className="w-full h-[140px] bg-sky-600 rounded-lg">
      <Image
        source={images.banner}
        className="w-full h-full object-cover rounded-lg"
      />
    </View>

  );
};

export default WaterBanner;
