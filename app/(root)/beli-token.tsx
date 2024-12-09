import { router } from "expo-router";
import { Text, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import GoogleTextInput from "@/components/WaterBanner";
import TransaksiLayout from "@/components/TransaksiLayout";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";

const BeliToken = () => {
  const {
    userAddress,
    destinationAddress,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();

  return (
    <TransaksiLayout>
      <View className="my-3">
       
      </View>

      <CustomButton
        title="Find Now"
        onPress={() => router.push(`/(root)/confirm-ride`)}
        className="mt-5"
      />
    </TransaksiLayout>
  );
};

export default BeliToken;
