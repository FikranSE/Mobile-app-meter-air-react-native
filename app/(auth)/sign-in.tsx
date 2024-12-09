import { useSignIn } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling for more info on error handling
        console.log(JSON.stringify(signInAttempt, null, 2));
        Alert.alert("Error", "Log in failed. Please try again.");
      }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  }, [isLoaded, form]);

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="flex-1 bg-gray">
    {/* header signup */}
<View className="relative w-full h-[250px] bg-sky-400 rounded-bl-3xl rounded-br-3xl flex items-center justify-center mb-[-40px]">
  {/* Logo Image */}
  <Image source={images.waterDrop} className="mt-5 w-16 h-16 absolute top-5" />

  <View className="mt-10 flex items-center justify-center">
    <Text className="mt-3 text-center text-2xl text-white font-semibold font-JakartaSemiBold">
      Selamat Datang di Mata Air
    </Text>
    <Text className="text-center text-sm text-white">
      Masuk untuk melakukan pembayaran PDAM atau membeli token air
    </Text>
  </View>
</View>

{/* card form signup */}
<View className="p-5 bg-white rounded-xl shadow-lg mt-[-5px] mx-5 z-10 mb-5">
  <Text className="text-xl text-center font-semibold mb-5">Masuk</Text>

  <InputField
    label="Email"
    placeholder="Masukkan email"
    textContentType="emailAddress"
    value={form.email}
    onChangeText={(value) => setForm({ ...form, email: value })}
    labelStyle="text-sm"
  />
  <InputField
    label="Kata Sandi"
    placeholder="Masukkan kata sandi"
    secureTextEntry={true}
    textContentType="password"
    value={form.password}
    onChangeText={(value) => setForm({ ...form, password: value })}
    labelStyle="text-sm"
  />

  <CustomButton
    title="Masuk"
    onPress={onSignInPress}
    className="mt-6"
  />

  <OAuth />

  <Link
    href="/sign-up"
    className="text-lg text-center text-general-200 mt-10"
  >
    Belum punya akun?{" "}
    <Text className="text-sky-400">Daftar Sekarang</Text>
  </Link>
</View>

      </View>
    </ScrollView>
  );
};

export default SignIn;
