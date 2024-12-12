import { View, Text, Image, ScrollView } from "react-native";
import { icons, images } from "@/constants";

const WaterBanner = () => {
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      {/* First Banner */}
      <View className="w-[300px] h-[140px] bg-sky-400 rounded-lg mr-4">
        <Image
          source={images.banner1}
          className="w-full h-full object-cover rounded-lg"
        />
      </View>

      {/* Second Banner */}
      <View className="w-[300px] h-[140px] bg-sky-400 rounded-lg">
        <Image
          source={images.banner}
          className="w-full h-full object-cover rounded-lg"
        />
      </View>
    </ScrollView>
  );
};

export default WaterBanner;
