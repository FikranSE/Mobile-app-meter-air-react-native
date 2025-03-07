import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const CustomAlert = ({
  visible,
  type = "success", // 'success' or 'error'
  message,
  onClose,
  duration = 3000, // Auto close duration in ms
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Show alert with animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Set timeout to hide alert
      const timer = setTimeout(() => {
        hideAlert();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideAlert = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onClose) onClose();
    });
  };

  // Configure colors based on type
  const colors =
    type === "success"
      ? {
          bg: "#E8F5E9",
          title: "#43A047",
          text: "#2E7D32",
          gradient: ["#43A047", "#2E7D32"],
        }
      : {
          bg: "#FFEBEE",
          title: "#E53935",
          text: "#C62828",
          gradient: ["#E53935", "#C62828"],
        };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}>
      <View style={[styles.alertContent, { backgroundColor: colors.bg }]}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.title }]}>{type === "success" ? "Berhasil" : "Gagal"}</Text>
          <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
        </View>
        <TouchableOpacity onPress={hideAlert} style={styles.closeButton}>
          <Text style={[styles.closeButtonText, { color: colors.title }]}>✕</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    left: 16,
    right: 16,
    zIndex: 999,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 12,
    overflow: "hidden",
  },
  iconContainer: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  alertContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 13,
    fontWeight: "bold",
  },
});

export default CustomAlert;
