import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "react-native";

const AccountSelector = ({ customerType, onTypeChange, icons }) => {
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    if (isOpen) {
      // Close dropdown
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setIsOpen(false));
    } else {
      // Open dropdown
      setIsOpen(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleSelect = (type) => {
    onTypeChange(type);
    toggleDropdown();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDropdown} activeOpacity={0.8}>
        <LinearGradient colors={["#3E93FF", "#0263FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.button}>
          <Text style={styles.buttonText}>{customerType === "pascabayar" ? "Pascabayar" : "Prabayar"}</Text>
          <Image source={icons.arrowDown} style={styles.checkIcon} tintColor="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

      {isOpen && (
        <Animated.View
          style={[
            styles.dropdown,
            {
              opacity: opacityAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
              ],
            },
          ]}>
          <TouchableOpacity style={[styles.option, customerType === "prabayar" && styles.selectedOption]} onPress={() => handleSelect("prabayar")}>
            <LinearGradient
              colors={customerType === "prabayar" ? ["#8CC0FF", "#0263FF"] : ["#054BBC", "#054BBC"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.optionGradient}>
              <Text className="mr-1" style={[styles.optionText, customerType === "prabayar" && styles.selectedText]}>
                Prabayar
              </Text>
              {customerType === "prabayar" && (
                <Image source={icons.check || require("../assets/icons/check.png")} style={styles.checkIcon} tintColor="#FFFFFF" />
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, customerType === "pascabayar" && styles.selectedOption]}
            onPress={() => handleSelect("pascabayar")}>
            <LinearGradient
              colors={customerType === "pascabayar" ? ["#8CC0FF", "#0263FF"] : ["#054BBC", "#054BBC"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.optionGradient}>
              <Text className="mr-1" style={[styles.optionText, customerType === "pascabayar" && styles.selectedText]}>
                Pascabayar
              </Text>
              {customerType === "pascabayar" && (
                <Image source={icons.check || require("../assets/icons/check.png")} style={styles.checkIcon} tintColor="#FFFFFF" />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#8CC0FF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginRight: 8,
  },
  icon: {
    width: 12,
    height: 12,
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 8,
    backgroundColor: "#054BBC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#8CC0FF",
    padding: 4,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  option: {
    borderRadius: 8,
    marginVertical: 2,
    overflow: "hidden",
  },
  selectedOption: {
    backgroundColor: "#2181FF",
  },
  optionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  optionText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  selectedText: {
    fontWeight: "bold",
  },
  checkIcon: {
    width: 14,
    height: 14,
  },
});

export default AccountSelector;
