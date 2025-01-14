import { TextInput, View, Text, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";

interface InputFieldProps {
  label?: string;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  showPasswordToggle?: boolean;
  [key: string]: any;
}

const InputField = ({
  label,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  showPasswordToggle = false,
  ...props
}: InputFieldProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="w-full">
          {label && <Text className={`text-base text-gray-700 mb-2 ${labelStyle}`}>{label}</Text>}
          <View className={`flex-row items-center border border-gray-300 rounded-xl bg-white ${containerStyle}`}>
            <TextInput
              className={`flex-1 px-4 py-2 text-base ${inputStyle}`}
              secureTextEntry={showPasswordToggle ? !isPasswordVisible : secureTextEntry}
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              {...props}
            />
            {showPasswordToggle && (
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} className="pr-4">
                <Feather name={isPasswordVisible ? "eye" : "eye-off"} size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
