import React, { ReactNode, useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Animated, Modal, Alert, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Clipboard from "expo-clipboard";
import { icons, images } from "@/constants";
import { router } from "expo-router";

interface BeliTokenProps {
  children: ReactNode;
}

interface CubicResponse {
  metadata: {
    code: number;
    message: string;
  };
  response: {
    "data-cubic": number;
  };
}

const BeliToken: React.FC<BeliTokenProps> = ({ children }) => {
  const [nomorPDAM, setNomorPDAM] = useState("");
  const [nominal, setNominal] = useState("");
  const [pinTrans, setPinTrans] = useState("");
  const [showPinInput, setShowPinInput] = useState(false);
  const [warning, setWarning] = useState("");
  const [showError, setShowError] = useState(false);
  const [tokenNumber, setTokenNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  // State for cubic meters calculation
  const [cubicMeters, setCubicMeters] = useState<number | null>(null);
  const [isFetchingCubic, setIsFetchingCubic] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Transaction details to pass to DetailTransaksi
  const [transactionDetails, setTransactionDetails] = useState(null);

  // Animasi untuk pesan error
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Animasi untuk modal sukses
  const successAnimScale = useRef(new Animated.Value(0.8)).current;
  const successAnimOpacity = useRef(new Animated.Value(0)).current;

  // Animasi untuk modal PIN
  const pinModalSlideAnim = useRef(new Animated.Value(Dimensions.get("window").height)).current;
  const pinModalOpacity = useRef(new Animated.Value(0)).current;

  const BASE_URL = "https://pdampolman.airmurah.id/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil kredensial dan token dari AsyncStorage
        const username = await AsyncStorage.getItem("username");
        const password = await AsyncStorage.getItem("password");
        const dataToken = await AsyncStorage.getItem("userToken");
        const consId = process.env.EXPO_PUBLIC_WH8_CONS_ID?.replace(/[",]/g, "") || "admin-wh8";
        const accessToken = await AsyncStorage.getItem("access_token");

        if (!username || !password || !dataToken || !accessToken) {
          console.log("Missing credentials:", { username, password, dataToken, accessToken });
          // Jika kredensial belum lengkap, simpan username dan password secara sementara
          await AsyncStorage.setItem("username", username || "");
          await AsyncStorage.setItem("password", password || "");
          return;
        }

        // Fetch customer data
        const customerResponse = await axios.post(
          `${BASE_URL}/getDataConstumer`,
          {
            username,
            password,
            data_token: dataToken,
            cons_id: consId,
            access_token: accessToken,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (customerResponse.data.metadata.code === 200) {
          setCustomerData(customerResponse.data.response.data);
          // Set meter number directly in the input field
          if (customerResponse.data.response.data.meter_number) {
            setNomorPDAM(customerResponse.data.response.data.meter_number.toString());
          }
        } else {
          console.log("Customer data fetch error:", customerResponse.data.metadata.message);
        }
      } catch (error) {
        console.error("Error fetching meter number:", error);
      }
    };

    fetchData();
  }, []);

  // Add effect to calculate cubic meters when nominal changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (nominal) {
        const numericValue = nominal.replace(/\D/g, "");
        if (numericValue && parseInt(numericValue) >= 10000) {
          fetchCubicData(parseInt(numericValue));
        } else {
          setCubicMeters(null);
        }
      } else {
        setCubicMeters(null);
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(debounceTimer);
  }, [nominal]);

  const fetchCubicData = async (purchaseAmount: number) => {
    if (isFetchingCubic) return;

    try {
      setIsFetchingCubic(true);
      const { username, password, dataToken, consId, accessToken } = await getCredentials();

      const response = await axios.post<CubicResponse>(
        `${BASE_URL}/getCubicData`,
        {
          username,
          password,
          data_token: dataToken,
          cons_id: consId,
          access_token: accessToken,
          purchase: purchaseAmount,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.metadata.code === 200) {
        setCubicMeters(response.data.response["data-cubic"]);
      } else {
        console.log("Cubic data fetch error:", response.data.metadata.message);
        setCubicMeters(null);
      }
    } catch (error) {
      console.error("Error fetching cubic data:", error);
      setCubicMeters(null);
    } finally {
      setIsFetchingCubic(false);
    }
  };

  const formatCurrency = (value: string) => {
    // Fix: Allow empty string to clear the input
    if (!value) return "";

    const numericValue = value.replace(/\D/g, "");
    return numericValue === "" ? "" : `Rp. ${parseInt(numericValue).toLocaleString("id-ID")},-`;
  };

  const getCredentials = async () => {
    try {
      const username = (await AsyncStorage.getItem("username")) || "revi123";
      const password = (await AsyncStorage.getItem("password")) || "revi12345";
      const dataToken = (await AsyncStorage.getItem("userToken")) || "GQVaTdfvfzwzwrgmXTiJohFbjvBxyuPOCfUHpyolZzOpUgLdMZ";
      const consId = (await AsyncStorage.getItem("cons_id")) || "admin-wh8";
      const accessToken = (await AsyncStorage.getItem("access_token")) || "RXQDtALNLbFsMTlgkTWcOKxtYGSFtDUiPkUCxczRJQinCNIqlr";
      return { username, password, dataToken, consId, accessToken };
    } catch (error) {
      console.error("Error retrieving credentials:", error);
    }
  };

  const validateForm = () => {
    const numericValue = nominal.replace(/\D/g, "");
    if (numericValue === "" || parseInt(numericValue, 10) < 10000) {
      setWarning("Minimal nominal pembelian adalah Rp 10.000");
      showErrorMessage();
      return;
    }

    setWarning("");
    hideErrorMessage();
    setShowPinInput(true);

    // Show PIN modal with animation
    pinModalSlideAnim.setValue(Dimensions.get("window").height);
    pinModalOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(pinModalSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(pinModalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closePinModal = () => {
    Animated.parallel([
      Animated.timing(pinModalSlideAnim, {
        toValue: Dimensions.get("window").height,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(pinModalOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowPinInput(false);
      setPinTrans("");
    });
  };

  const showErrorMessage = () => {
    setShowError(true);
    slideAnim.setValue(-100);
    opacity.setValue(0);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      hideErrorMessage();
    }, 3000);
  };

  const hideErrorMessage = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowError(false);
    });
  };

  const handlePurchaseToken = async () => {
    if (!showPinInput) {
      validateForm();
      return;
    }

    if (pinTrans.length < 6) {
      setWarning("PIN Transaksi harus 6 digit");
      showErrorMessage();
      return;
    }

    try {
      setIsLoading(true);
      const { username, password, dataToken, consId, accessToken } = await getCredentials();

      const purchaseAmount = nominal.replace(/\D/g, "");

      const requestBody = {
        username,
        password,
        data_token: dataToken,
        cons_id: consId,
        access_token: accessToken,
        purchase: parseInt(purchaseAmount, 10),
        meter_number: parseInt(nomorPDAM, 10),
        id_constumer: customerData?.id_constumer || "POLMAN3",
        pin_trans: parseInt(pinTrans, 10),
      };

      const response = await axios.post(`${BASE_URL}/generateTokenTrans`, requestBody, {
        headers: {
          Accept: "application/json text/plain */*",
          "Content-Type": "application/json",
        },
      });

      if (response.data.metadata.code === 200) {
        // Close PIN modal first
        closePinModal();

        const tokenNumberFromResponse = response.data.response.data["token-number"];
        const currentDate = new Date();

        // Format the cubic data properly
        const formattedCubicData = cubicMeters ? cubicMeters.toFixed(2) : "0.00";

        // Store the transaction details
        const transDetails = {
          metodePembayaran: "PDAM Direct", // Assuming this is the method, modify as needed
          status: "Berhasil",
          waktu: currentDate.toLocaleTimeString(),
          tanggal: currentDate.toLocaleDateString(),
          idTransaksi: response.data.response.data["transaction-id"] || response.data.metadata.requestId || "unknown",
          tokenNumber: tokenNumberFromResponse,
          dataCubic: formattedCubicData, // Add cubic meter data to transaction details
          pelanggan: {
            id: nomorPDAM,
            nama: response.data.response.data["customer-name"] || customerData?.name || "Pelanggan PDAM",
            alamat: response.data.response.data["address"] || customerData?.address || "Alamat tidak tersedia",
            golongan: response.data.response.data["customer-type"] || "Reguler",
            meter_number: nomorPDAM,
            meter_config: customerData?.meter_config || "-",
          },
          rincian: {
            pemakaian: response.data.response.data["usage"] || "N/A",
            tagihan: formatCurrency(purchaseAmount),
            cubic: formattedCubicData, // Also store the cubic data in the rincian object
            biayaAdmin: response.data.response.data["admin-fee"] || "Rp. 2.500,-",
            total: formatCurrency(purchaseAmount),
          },
        };

        // Save transaction details to AsyncStorage for retrieving in DetailTransaksi
        await AsyncStorage.setItem("lastTokenTransaction", JSON.stringify(transDetails));

        setTokenNumber(tokenNumberFromResponse);
        setTransactionDetails(transDetails);
        setShowSuccessModal(true);

        // Animasi modal sukses
        Animated.parallel([
          Animated.timing(successAnimScale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(successAnimOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        setWarning(response.data.metadata.message || "Pembelian token gagal. Coba lagi.");
        showErrorMessage();
      }
    } catch (error) {
      console.error("Error during token purchase:", error);
      setWarning("Terjadi kesalahan saat melakukan pembelian.");
      showErrorMessage();
    } finally {
      setIsLoading(false);
    }
  };

  const closeSuccessModal = () => {
    Animated.parallel([
      Animated.timing(successAnimScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(successAnimOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSuccessModal(false);

      // Navigate to DetailTransaksi with tokenNumber and transaction details
      if (transactionDetails) {
        router.push({
          pathname: "/(root)/detail-transaksi",
          params: { tokenNumber: tokenNumber },
        });
      }

      // Reset nilai animasi modal
      successAnimScale.setValue(0.8);
      successAnimOpacity.setValue(0);
    });
  };

  const handleTokenSelection = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, "");
    setNominal(formatCurrency(numericValue));
  };

  // Tambahkan fungsi untuk salin token
  const handleCopyToken = async () => {
    if (!tokenNumber) return;
    try {
      await Clipboard.setStringAsync(tokenNumber);
      Alert.alert("Berhasil", "Token berhasil disalin ke clipboard!");
    } catch (error) {
      Alert.alert("Gagal", "Tidak dapat menyalin token.");
    }
  };

  const tokenOptions = ["Rp. 10.000,-", "Rp. 25.000,-", "Rp. 50.000,-", "Rp. 75.000,-", "Rp. 100.000,-"];

  const handlePinInput = (value: string) => {
    // Memastikan hanya menerima angka dan membatasi panjang input menjadi 6 digit
    const cleanedValue = value.replace(/\D/g, "").slice(0, 6);
    setPinTrans(cleanedValue);
  };
  // Render a single PIN digit box
  const renderPinDigit = (digit: number, index: number) => {
    const isFilled = index < pinTrans.length;
    return (
      <View
        key={index}
        style={{
          width: 50,
          height: 60,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: isFilled ? "#2181FF" : "#E2E8F0",
          backgroundColor: isFilled ? "#EBF5FF" : "#F8FAFC",
          justifyContent: "center",
          alignItems: "center",
          margin: 6,
        }}>
        {isFilled && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#2181FF" }} />}
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Full page Modal for PIN Input */}
        {showPinInput && (
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "#fff",
              opacity: pinModalOpacity,
              transform: [{ translateY: pinModalSlideAnim }],
              zIndex: 999,
            }}>
            <View
              style={{
                flex: 1,
                padding: 20,
                paddingTop: 60,
                backgroundColor: "#fff",
              }}>
              {/* Header with close button */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 30,
                }}>
                <TouchableOpacity onPress={closePinModal}>
                  <Image source={icons.backArrow} style={{ width: 24, height: 24, tintColor: "#334155" }} resizeMode="contain" />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: "700", color: "#1E293B" }}>Masukkan PIN</Text>
                <View style={{ width: 24 }} />
              </View>

              {/* Transaction info card */}
              <View
                style={{
                  backgroundColor: "#F8FAFC",
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 30,
                }}>
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#64748B", marginBottom: 8 }}>Detail Transaksi</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}>
                  <Text style={{ fontSize: 14, color: "#64748B" }}>No. Meter PDAM</Text>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#334155" }}>{nomorPDAM}</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}>
                  <Text style={{ fontSize: 14, color: "#64748B" }}>Nominal</Text>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#334155" }}>{nominal}</Text>
                </View>
                {cubicMeters !== null && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}>
                    <Text style={{ fontSize: 14, color: "#64748B" }}>Volume Air</Text>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: "#334155" }}>{cubicMeters.toFixed(2)} m³</Text>
                  </View>
                )}
              </View>

              {/* PIN Instruction */}
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#1E293B",
                  textAlign: "center",
                  marginBottom: 8,
                }}>
                Masukkan PIN Transaksi
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#64748B",
                  textAlign: "center",
                  marginBottom: 30,
                }}>
                Masukkan 6 digit PIN untuk mengonfirmasi transaksi Anda
              </Text>

              {/* PIN Input Boxes */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginBottom: 30,
                }}>
                {[0, 1, 2, 3, 4, 5].map((_, index) => renderPinDigit(index < pinTrans.length ? 1 : 0, index))}
              </View>

              {/* PIN Input Field */}
              <TextInput
                value={pinTrans}
                onChangeText={handlePinInput}
                keyboardType="numeric"
                maxLength={6}
                secureTextEntry
                autoFocus
                style={{
                  position: "absolute",
                  opacity: 0,
                  height: 0,
                }}
              />

              {/* Confirmation Button */}
              <TouchableOpacity
                onPress={handlePurchaseToken}
                disabled={isLoading || pinTrans.length < 6}
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  opacity: isLoading || pinTrans.length < 6 ? 0.7 : 1,
                  marginTop: 20,
                }}>
                <LinearGradient
                  colors={["#2181FF", "#004EBA"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingVertical: 16,
                  }}>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600", textAlign: "center" }}>
                    {isLoading ? "Memproses..." : "Konfirmasi Pembelian"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default BeliToken;