import { Redirect } from "expo-router";
import { useAuth } from "@/lib/context/authContext";
import { ActivityIndicator, View } from "react-native";

const Page = () => {
  const { userToken, isLoading } = useAuth();

  // Show a loading indicator while authentication state is being determined
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Check if user is signed in based on userToken from auth context
  if (userToken) {
    return <Redirect href="/(root)/(tabs)/home" />;
  }

  // If not signed in, redirect to welcome screen
  return <Redirect href="/(auth)/welcome" />;
};

export default Page;
