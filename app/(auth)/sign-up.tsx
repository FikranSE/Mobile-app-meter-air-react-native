import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };
  const onPressVerify = async () => {
    if (!isLoaded) return;
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });
      if (completeSignUp.status === "complete") {
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: completeSignUp.createdUserId,
          }),
        });
        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({
          ...verification,
          state: "success",
        });
      } else {
        setVerification({
          ...verification,
          error: "Verification failed. Please try again.",
          state: "failed",
        });
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setVerification({
        ...verification,
        error: err.errors[0].longMessage,
        state: "failed",
      });
    }
  };
  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="flex-1 bg-gray">
    {/* header signup */}
<View className="relative w-full h-[250px] bg-sky-400 rounded-bl-3xl rounded-br-3xl flex items-center justify-center mb-[-40px]">
  {/* Logo Image */}
  <Image source={images.logo} className="mt-5 w-16 h-16 absolute top-5 rounded-full" />

  <View className="mt-10 flex items-center justify-center">
    <Text className="text-2xl text-white font-semibold font-JakartaSemiBold">
      Selamat Datang di Mata Air
    </Text>
    <Text className="text-center text-sm text-white">
      Daftar untuk membuat akun
    </Text>
  </View>
</View>

{/* card form signup */}
<View className="p-5 bg-white rounded-xl shadow-lg mt-[-5px] mx-5 z-10 mb-5">
  <Text className="text-xl text-center font-semibold mb-5">Daftar</Text>

  <InputField
    label="Nama"
    placeholder="Masukkan nama"
    value={form.name}
    onChangeText={(value) => setForm({ ...form, name: value })}
    labelStyle="text-sm"
  />
  <InputField
    label="Nomor HP"
    placeholder="Masukkan nomor HP"
    keyboardType="phone-pad"
    value={''}
    onChangeText={(value) => setForm({ ...form, phone: value })}
    labelStyle="text-sm"
  />
  <InputField
    label="Nomor PDAM"
    placeholder="Masukkan nomor PDAM"
    keyboardType="numeric"
    value={''}
    onChangeText={(value) => setForm({ ...form, pdamNumber: value })}
    labelStyle="text-sm"
  />
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
    title="Daftar"
    onPress={onSignUpPress}
    className="mt-6"
  />

  <OAuth />

  <Link
    href="/sign-in"
    className="text-lg text-center text-general-200 mt-10"
  >
    Sudah punya akun?{" "}
    <Text className="text-sky-400">Masuk Sekarang</Text>
  </Link>
</View>





        <ReactNativeModal
          isVisible={verification.state === "pending"}
          // onBackdropPress={() =>
          //   setVerification({ ...verification, state: "default" })
          // }
          onModalHide={() => {
            if (verification.state === "success") {
              setShowSuccessModal(true);
            }
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="font-JakartaExtraBold text-2xl mb-2">
              Verification
            </Text>
            <Text className="font-Jakarta mb-5">
              We've sent a verification code to {form.email}.
            </Text>
            <InputField
              label={"Code"}
              icon={icons.lock}
              placeholder={"12345"}
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
            />
            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">
                {verification.error}
              </Text>
            )}
            <CustomButton
              title="Verify Email"
              onPress={onPressVerify}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">
              Verified
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              You have successfully verified your account.
            </Text>
            <CustomButton
              title="Browse Home"
              onPress={() => router.push(`/(root)/(tabs)/home`)}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};
export default SignUp;
