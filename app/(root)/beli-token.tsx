import React, { ReactNode, useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Animated, Modal, Alert } from "react-native";
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Pesan Error */}
        {showError && (
          <Animated.View
            style={{
              position: "absolute",
              top: 30,
              left: 0,
              right: 0,
              zIndex: 999,
              transform: [{ translateY: slideAnim }],
              opacity: opacity,
            }}>
            <View
              style={{
                backgroundColor: "#FFF2F2",
                padding: 16,
                margin: 16,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#E11D48", marginBottom: 2 }}>Error</Text>
                <Text style={{ fontSize: 14, color: "#E11D48" }}>{warning}</Text>
              </View>
              <TouchableOpacity onPress={hideErrorMessage}>
                <Image source={icons.close} style={{ width: 14, height: 14, tintColor: "#E11D48" }} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Konten Utama */}
        <ScrollView style={{ flex: 1, backgroundColor: "#f8f9fa" }} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <LinearGradient
            colors={["#2181FF", "#004EBA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              height: 110,
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
            <View style={{ flexDirection: "row", alignItems: "center", padding: 16, marginTop: 40 }}>
              <TouchableOpacity
                onPress={() => router.replace("/(tabs)/home")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}>
                <Image source={icons.backArrow} style={{ width: 20, height: 20, tintColor: "#fff" }} resizeMode="contain" />
              </TouchableOpacity>
              <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700" }}>Beli Token PDAM</Text>
            </View>
          </LinearGradient>

          {/* Form Pembelian */}
          <View
            style={{
              margin: 16,
              marginTop: 20,
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}>
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#333" }}>No. Meter PDAM</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#e0e0e0",
                borderRadius: 12,
                paddingHorizontal: 15,
                paddingVertical: 14,
                backgroundColor: "#F8FAFC",
                marginBottom: 20,
                flexDirection: "row",
                alignItems: "center",
              }}>
              <TextInput
                placeholder="Contoh: 47500420436"
                value={nomorPDAM}
                onChangeText={setNomorPDAM}
                keyboardType="numeric"
                style={{ flex: 1, fontSize: 16, color: "#334155" }}
                placeholderTextColor="#94A3B8"
              />
            </View>

            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#333" }}>Nominal Pembelian</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#e0e0e0",
                borderRadius: 12,
                paddingHorizontal: 15,
                paddingVertical: 14,
                marginBottom: 8,
                backgroundColor: "#F8FAFC",
              }}>
              <TextInput
                placeholder="Rp. 10.000,-"
                value={nominal}
                onChangeText={(text) => setNominal(formatCurrency(text))}
                keyboardType="numeric"
                style={{ fontSize: 16, color: "#334155" }}
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Informasi Cubic Meter */}
            {cubicMeters !== null && (
              <View
                style={{
                  marginBottom: 20,
                  backgroundColor: "#F0F9FF",
                  padding: 12,
                  borderRadius: 8,
                  borderLeftWidth: 4,
                  borderLeftColor: "#2181FF",
                }}>
                <Text style={{ color: "#0369A1", fontSize: 14 }}>Dengan nominal {nominal}, Anda mendapatkan:</Text>
                <Text style={{ color: "#0369A1", fontSize: 16, fontWeight: "700", marginTop: 4 }}>{cubicMeters.toFixed(2)} m³ air</Text>
              </View>
            )}

            {isFetchingCubic && (
              <View style={{ marginBottom: 20, alignItems: "center" }}>
                <Text style={{ color: "#64748B", fontSize: 14 }}>Menghitung volume air...</Text>
              </View>
            )}

            {/* PIN Transaksi hanya muncul jika showPinInput true */}
            {showPinInput && (
              <>
                <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#333" }}>PIN Transaksi</Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#e0e0e0",
                    borderRadius: 12,
                    paddingHorizontal: 15,
                    paddingVertical: 14,
                    marginBottom: 20,
                    backgroundColor: "#F8FAFC",
                  }}>
                  <TextInput
                    placeholder="PIN Transaksi (6 digit)"
                    value={pinTrans}
                    onChangeText={setPinTrans}
                    keyboardType="numeric"
                    secureTextEntry
                    maxLength={6}
                    style={{ fontSize: 16, color: "#334155" }}
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </>
            )}

            <TouchableOpacity
              onPress={showPinInput ? handlePurchaseToken : validateForm}
              disabled={isLoading}
              style={{
                borderRadius: 12,
                overflow: "hidden",
                opacity: isLoading ? 0.7 : 1,
                marginBottom: 8,
              }}>
              <LinearGradient
                colors={["#2181FF", "#004EBA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingVertical: 16,
                }}>
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600", textAlign: "center" }}>
                  {isLoading ? "Memproses..." : showPinInput ? "Konfirmasi Pembelian" : "Lanjutkan"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Pilihan Nominal Token */}
          <View style={{ padding: 16, marginBottom: 100 }}>
            <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 6, color: "#333" }}>Pilih Token</Text>
            <Text style={{ fontSize: 14, color: "#64748B", marginBottom: 16 }}>Beli token langsung ke ID PDAM anda</Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}>
              {tokenOptions.map((token, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleTokenSelection(token)}
                  style={{
                    width: "48%",
                    marginBottom: 16,
                  }}>
                  <LinearGradient
                    colors={["#2181FF", "#004EBA"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      borderRadius: 16,
                      padding: 20,
                      alignItems: "center",
                    }}>
                    <Image source={icons.pay} style={{ width: 24, height: 24, tintColor: "#fff", marginBottom: 8 }} />
                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{token}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Modal Pembelian Berhasil */}
        <Modal animationType="none" transparent={true} visible={showSuccessModal} onRequestClose={closeSuccessModal}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
              padding: 16,
            }}>
            <Animated.View
              style={{
                backgroundColor: "#fff",
                borderRadius: 20,
                width: "90%",
                maxWidth: 340,
                padding: 24,
                opacity: successAnimOpacity,
                transform: [{ scale: successAnimScale }],
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 15,
                elevation: 10,
              }}>
              <View style={{ alignItems: "center", marginBottom: 20 }}>
                <View
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    backgroundColor: "#EBF5FF",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 16,
                  }}>
                  <Image source={images.check2} style={{ width: 40, height: 40, tintColor: "#0369A1" }} />
                </View>
                <Text style={{ fontSize: 20, fontWeight: "700", color: "#0F172A", marginBottom: 8 }}>Pembelian Berhasil!</Text>
                <Text style={{ fontSize: 14, color: "#64748B", textAlign: "center" }}>Token PDAM anda telah berhasil dibeli dan siap digunakan</Text>
              </View>

              <View
                style={{
                  backgroundColor: "#F0F9FF",
                  borderRadius: 12,
                  padding: 20,
                  marginBottom: 12,
                  alignItems: "center",
                }}>
                <Text style={{ fontSize: 14, color: "#0369A1", marginBottom: 8 }}>Token Anda:</Text>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "700",
                    color: "#0369A1",
                    letterSpacing: 2,
                    textAlign: "center",
                    marginBottom: 12,
                  }}>
                  {tokenNumber}
                </Text>
                {/* Tombol salin token */}
                <TouchableOpacity
                  onPress={handleCopyToken}
                  style={{
                    borderWidth: 1,
                    borderColor: "#0369A1",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}>
                  <Text style={{ color: "#0369A1", fontWeight: "600" }}>Salin Token</Text>
                </TouchableOpacity>
              </View>

              {/* Display cubic meters in success modal */}
              {cubicMeters !== null && (
                <View
                  style={{
                    backgroundColor: "#F1F5F9",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 24,
                  }}>
                  <Text style={{ fontSize: 14, color: "#64748B", marginBottom: 4 }}>Volume Air:</Text>
                  <Text style={{ fontSize: 18, fontWeight: "700", color: "#334155" }}>{cubicMeters.toFixed(2)} m³</Text>
                </View>
              )}

              <TouchableOpacity onPress={closeSuccessModal} style={{ borderRadius: 12, overflow: "hidden" }}>
                <LinearGradient
                  colors={["#2181FF", "#004EBA"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingVertical: 16,
                  }}>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600", textAlign: "center" }}>Selesai</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>

        {/* Footer jika pengguna tetap di halaman dan token sudah ada */}
        {tokenNumber && !showSuccessModal && (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "#F0F9FF",
              padding: 20,
              borderTopWidth: 1,
              borderTopColor: "#BAE6FD",
              elevation: 10,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              alignItems: "center",
            }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#0369A1", marginBottom: 4 }}>Token Anda:</Text>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                color: "#0369A1",
                letterSpacing: 1.5,
                marginBottom: 8,
              }}>
              {tokenNumber}
            </Text>
            {cubicMeters !== null && <Text style={{ fontSize: 14, color: "#0369A1", marginBottom: 8 }}>Volume Air: {cubicMeters.toFixed(2)} m³</Text>}
            <TouchableOpacity
              onPress={handleCopyToken}
              style={{ borderWidth: 1, borderColor: "#0369A1", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 }}>
              <Text style={{ color: "#0369A1", fontWeight: "600" }}>Salin Token</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default BeliToken;
