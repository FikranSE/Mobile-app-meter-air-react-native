import React, { useState, useRef, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Keyboard, TouchableWithoutFeedback } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PinTransactionModal = ({ visible, onClose, onSubmit, errorMessage = null }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(errorMessage);
  const [savePinChecked, setSavePinChecked] = useState(true);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setError(errorMessage);
    if (errorMessage) {
      shakeError();
    }
  }, [errorMessage]);

  useEffect(() => {
    // Reset PIN when modal becomes visible
    if (visible) {
      setPin("");
      setError(null);
    }
  }, [visible]);

  const shakeError = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handlePinChange = (text) => {
    // Only allow numeric input and max 6 digits
    const numericText = text.replace(/[^0-9]/g, "");
    if (numericText.length <= 6) {
      setPin(numericText);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (pin.length !== 6) {
      setError("PIN harus 6 digit");
      shakeError();
      return;
    }

    // If save PIN is checked, store it in AsyncStorage
    if (savePinChecked) {
      try {
        await AsyncStorage.setItem("pinTrans", pin);
      } catch (error) {
        console.error("Error saving PIN to AsyncStorage:", error);
      }
    }

    onSubmit(pin);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Masukkan PIN Transaksi</Text>

            <Text style={styles.modalSubtitle}>Masukkan PIN transaksi untuk mengakses data tagihan Anda</Text>

            <Animated.View
              style={{
                transform: [{ translateX: shakeAnimation }],
                width: "100%",
                marginVertical: 20,
              }}>
              <TextInput
                style={[styles.pinInput, error ? styles.inputError : null]}
                value={pin}
                onChangeText={handlePinChange}
                placeholder="Masukkan 6 digit PIN"
                keyboardType="numeric"
                secureTextEntry={true}
                maxLength={6}
                autoFocus={true}
              />

              {error && <Text style={styles.errorText}>{error}</Text>}
            </Animated.View>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity style={styles.checkbox} onPress={() => setSavePinChecked(!savePinChecked)}>
                <View style={[styles.checkboxInner, savePinChecked ? styles.checkboxChecked : null]} />
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Simpan PIN untuk transaksi berikutnya</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSubmit}>
                <LinearGradient colors={["#2181FF", "#004EBA"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>Konfirmasi</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 4,
  },
  pinInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    width: "100%",
    backgroundColor: "#F9F9F9",
    textAlign: "center",
    letterSpacing: 8,
  },
  inputError: {
    borderColor: "#FF5252",
  },
  errorText: {
    color: "#FF5252",
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  checkbox: {
    height: 20,
    width: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#2181FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxInner: {
    height: 12,
    width: 12,
    borderRadius: 2,
  },
  checkboxChecked: {
    backgroundColor: "#2181FF",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default PinTransactionModal;
