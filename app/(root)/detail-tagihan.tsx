import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import Checkbox from "expo-checkbox";
import { icons } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/lib/api";

const DetailTagihan = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [expandedMethod, setExpandedMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [billData, setBillData] = useState(null);
  const [unpaidBills, setUnpaidBills] = useState([]);
  const [customerData, setCustomerData] = useState(null);
  const [error, setError] = useState(null);
  const [totalUnpaidAmount, setTotalUnpaidAmount] = useState(0);

  // Get the currently active account and its unpaid bills
  useEffect(() => {
    const fetchBillData = async () => {
      try {
        setLoading(true);

        // Step 1: Try to get the stored customer ID directly from latest navigation
        const selectedAccountId = await AsyncStorage.getItem("selectedAccountId");
        console.log("Detail screen: Selected account ID from AsyncStorage:", selectedAccountId);

        if (!selectedAccountId) {
          setError("Tidak ada akun yang dipilih. Silakan pilih akun di halaman utama.");
          setLoading(false);
          return;
        }

        // Get credentials from AsyncStorage
        const username = await AsyncStorage.getItem("username");
        const password = await AsyncStorage.getItem("password");
        const dataToken = await AsyncStorage.getItem("userToken");
        const consId = process.env.EXPO_PUBLIC_WH8_CONS_ID?.replace(/[",]/g, "") || "admin-wh8";
        const accessToken = await AsyncStorage.getItem("access_token");
        const pinTrans = (await AsyncStorage.getItem("pinTrans")) || "1234";

        // Step 2: Try to get the current customer data directly if available
        let currentCustomer = null;
        const storedCustomerData = await AsyncStorage.getItem("currentCustomerData");

        if (storedCustomerData) {
          try {
            const parsedData = JSON.parse(storedCustomerData);
            // Validate the parsed data matches our selected ID
            if (parsedData && parsedData.id_constumer === selectedAccountId) {
              currentCustomer = parsedData;
              console.log("Using stored customer data:", currentCustomer.id_constumer);
            }
          } catch (e) {
            console.error("Error parsing stored customer data:", e);
          }
        }

        // Step 3: If we don't have customer data yet, fetch all customers and find the one we need
        if (!currentCustomer) {
          console.log("No stored customer data found, fetching from API...");

          const customerResponse = await api.post("/getDataConstumer", {
            username,
            password,
            data_token: dataToken,
            cons_id: consId,
            access_token: accessToken,
          });

          if (customerResponse.data.metadata.code !== 200) {
            setError(`Gagal mengambil data pelanggan: ${customerResponse.data.metadata.message}`);
            setLoading(false);
            return;
          }

          const allCustomers = customerResponse.data.response.data || [];
          console.log(
            "All customer IDs from API:",
            allCustomers.map((c) => c.id_constumer)
          );

          // Find our target customer using the exact ID
          currentCustomer = allCustomers.find((customer) => customer.id_constumer === selectedAccountId);

          if (!currentCustomer) {
            setError(`Akun dengan ID ${selectedAccountId} tidak ditemukan.`);
            setLoading(false);
            return;
          }

          // Store this customer data for future use
          await AsyncStorage.setItem("currentCustomerData", JSON.stringify(currentCustomer));
        }

        setCustomerData(currentCustomer);
        console.log("Using customer data:", currentCustomer);

        // Step 4: Fetch pascabill data for this specific customer
        console.log("Fetching bill data for:", currentCustomer.id_constumer, currentCustomer.meter_number);

        const billResponse = await api.post("/pascaBill", {
          username,
          password,
          data_token: dataToken,
          cons_id: consId,
          access_token: accessToken,
          pin_trans: pinTrans,
          meter_number: currentCustomer.meter_number,
          id_constumer: currentCustomer.id_constumer,
        });

        if (billResponse.data.metadata.code !== 200) {
          setError(`Gagal mengambil data tagihan: ${billResponse.data.metadata.message}`);
          setLoading(false);
          return;
        }

        // Get all bills for this customer
        const allBills = billResponse.data.response.data || [];
        console.log("All bills received:", allBills);

        // Filter for unpaid bills only
        const filteredUnpaidBills = allBills.filter((bill) => bill.status === "unpaid");
        console.log("Unpaid bills:", filteredUnpaidBills);
        setUnpaidBills(filteredUnpaidBills);

        if (filteredUnpaidBills.length === 0) {
          // If no unpaid bills but we have bill data, show the latest bill anyway
          if (allBills.length > 0) {
            const sortedBills = [...allBills].sort((a, b) => {
              return new Date(b.tgl_terbit_bill) - new Date(a.tgl_terbit_bill);
            });

            setBillData(sortedBills[0]);
            setTotalUnpaidAmount(0);
            setError("Tidak ada tagihan yang belum dibayar untuk akun ini.");
          } else {
            setError("Tidak ada data tagihan untuk akun ini.");
          }
          setLoading(false);
          return;
        }

        // Sort unpaid bills by date (newest first)
        const sortedUnpaidBills = [...filteredUnpaidBills].sort((a, b) => {
          return new Date(b.tgl_terbit_bill) - new Date(a.tgl_terbit_bill);
        });

        // Calculate total of all unpaid bills
        const totalBillAmount = filteredUnpaidBills.reduce((total, bill) => {
          return total + Number(bill.total_bill);
        }, 0);

        console.log("Total unpaid amount:", totalBillAmount);
        console.log("Latest unpaid bill:", sortedUnpaidBills[0]);

        // Update state with the bill data
        setTotalUnpaidAmount(totalBillAmount);
        setBillData(sortedUnpaidBills[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error in fetchBillData:", error);
        setError(`Terjadi kesalahan: ${error.message || "Unknown error"}`);
        setLoading(false);
      }
    };

    fetchBillData();
  }, []);

  // Format date from YYYY-MM-DD to Month Year
  const formatPeriod = (periodStr) => {
    if (!periodStr) return "-";

    try {
      const [year, month] = periodStr.split("-");
      const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

      return `${monthNames[parseInt(month) - 1]} ${year}`;
    } catch (error) {
      return periodStr;
    }
  };

  // Format currency
  const formatRupiah = (amount) => {
    if (!amount) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate admin fee
  const adminFee = 2500;

  // Calculate total bill
  const calculateTotal = () => {
    if (!totalUnpaidAmount) return 0;
    return totalUnpaidAmount + adminFee;
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2181FF" />
        <Text className="mt-4 text-gray-600">Memuat data tagihan...</Text>
      </View>
    );
  }

  // When there's an error but we have customer data, show a partial view
  if (error && customerData) {
    return (
      <GestureHandlerRootView className="flex-1">
        <View className="flex-1 bg-white mb-44">
          {/* Header */}
          <LinearGradient
            colors={["#004EBA", "#2181FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="h-[30%] rounded-b-lg shadow-xl relative">
            <View className="flex-row justify-start items-center mt-8 p-5">
              <View className="flex-row items-center space-x-2">
                <TouchableOpacity onPress={() => router.back()}>
                  <Image source={icons.backArrow} className="w-5 h-5" tintColor="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-medium">Kembali</Text>
              </View>
            </View>
            <Text className="text-white text-xl font-bold text-center mt-5">Detail Tagihan</Text>
            <Text className="text-white text-sm font-medium text-center mt-1">{customerData?.name || ""}</Text>
          </LinearGradient>

          <View className="flex-1 justify-center items-center p-5">
            <Image source={icons.warning || icons.envelope} className="w-12 h-12 mb-4" tintColor="#FF6B6B" />
            <Text className="text-lg font-bold text-center mb-2">Status Tagihan</Text>
            <Text className="text-center text-gray-600 mb-6">{error}</Text>
            <TouchableOpacity onPress={() => router.back()} className="w-full">
              <LinearGradient colors={["#2181FF", "#004EBA"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="rounded-lg py-3">
                <Text className="text-white text-base font-semibold text-center">Kembali</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </GestureHandlerRootView>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-5">
        <Image source={icons.warning || icons.envelope} className="w-12 h-12 mb-4" tintColor="#FF6B6B" />
        <Text className="text-lg font-bold text-center mb-2">Gagal Memuat Data</Text>
        <Text className="text-center text-gray-600 mb-6">{error}</Text>
        <TouchableOpacity onPress={() => router.back()} className="w-full">
          <LinearGradient colors={["#2181FF", "#004EBA"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="rounded-lg py-3">
            <Text className="text-white text-base font-semibold text-center">Kembali</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-white">
        {/* Header */}
        <LinearGradient
          colors={["#004EBA", "#2181FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          className="h-[30%] rounded-b-lg shadow-xl relative">
          <View className="flex-row justify-start items-center mt-8 p-5">
            <View className="flex-row items-center space-x-2">
              <TouchableOpacity onPress={() => router.back()}>
                <Image source={icons.backArrow} className="w-5 h-5" tintColor="white" />
              </TouchableOpacity>
              <Text className="text-white text-lg font-medium">Kembali</Text>
            </View>
          </View>
          <Text className="text-white text-xl font-bold text-center mt-5">Detail Tagihan</Text>
          <Text className="text-white text-sm font-medium text-center mt-1">{customerData?.name || ""}</Text>
        </LinearGradient>

        {/* Detail Card */}
        <View
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            maxHeight: "100%",
          }}
          className="absolute top-24 left-4 right-4 bg-white rounded-lg p-5 pb-[120]">
          {/* Scrollable Content */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="pb-6">
              {/* Customer Details Section */}
              <View>
                <Text className="text-sm font-bold mb-1">Detail Pelanggan</Text>
                <View className="border-t border-dashed border-gray-300 pt-2">
                  {[
                    { label: "ID Pelanggan", value: customerData?.meter_number || "-" },
                    { label: "ID Akun", value: customerData?.id_constumer || "-" },
                    { label: "Nama Pelanggan", value: customerData?.name || "-" },
                    { label: "Alamat", value: customerData?.address || "-" },
                    { label: "Desa/Kelurahan", value: customerData?.village || "-" },
                    { label: "Golongan", value: customerData?.meter_config || "-" },
                    { label: "Periode", value: formatPeriod(billData?.periode_bill) || "-" },
                  ].map((item, index) => (
                    <View key={index} className="flex-row justify-between py-1">
                      <Text className="text-black text-xs">{item.label}</Text>
                      <Text className="text-black font-medium text-xs">{item.value}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Payment Details Section */}
              <View className="mt-4">
                <Text className="text-sm font-bold mb-1">Detail Pembayaran</Text>
                <View className="border-t border-dashed border-gray-300 pt-2">
                  {[
                    { label: "Stand Meter Lalu", value: `${billData?.kubic_sebelumnya || "0"}m³` },
                    { label: "Stand Meter Kini", value: `${billData?.kubik_setelahnya || "0"}m³` },
                    { label: "Pemakaian", value: `${billData?.delta || "0"}m³` },
                    {
                      label: unpaidBills.length > 1 ? "Total Tagihan" : "Tagihan",
                      value: formatRupiah(totalUnpaidAmount),
                    },
                    { label: "Biaya Admin", value: formatRupiah(adminFee) },
                  ].map((item, index) => (
                    <View key={index} className="flex-row justify-between py-1">
                      <Text className="text-black text-xs">{item.label}</Text>
                      <Text className="text-black font-medium text-xs">{item.value}</Text>
                    </View>
                  ))}
                </View>

                {/* Multiple Bills Section (if applicable) */}
                {unpaidBills.length > 1 && (
                  <View className="mt-4">
                    <Text className="text-sm font-bold mb-1">Rincian Tagihan</Text>
                    <View className="border-t border-dashed border-gray-300 pt-2">
                      {unpaidBills.map((bill, index) => (
                        <View key={index} className="flex-row justify-between py-1">
                          <Text className="text-black text-xs">{formatPeriod(bill.periode_bill)}</Text>
                          <Text className="text-black font-medium text-xs">{formatRupiah(bill.total_bill)}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Payment Method Section */}
                <View className="mt-4 border rounded-lg">
                  <Text className="text-xs p-2 font-semibold">Metode Pembayaran</Text>
                  {[
                    { icon: icons.pay, label: "QRIS", selected: true },
                    { icon: icons.pay, label: "Virtual Account BCA", selected: false },
                    {
                      icon: icons.pay,
                      label: "Tambah Metode Pembayaran",
                      selected: false,
                    },
                  ].map((method, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setExpandedMethod(expandedMethod === index ? null : index)}
                      className="border-t border-gray-300">
                      <View className="flex-row items-center justify-between p-3">
                        <View className="flex-row items-center">
                          <Image source={method.icon} className="w-3 h-3 mr-2" />
                          <Text className="text-xs">{method.label}</Text>
                        </View>
                        <Text className="text-xs">{expandedMethod === index ? "−" : "+"}</Text>
                      </View>
                      {expandedMethod === index && (
                        <View className="p-3 bg-gray-50">
                          <Text className="text-xs">Detail dan instruksi pembayaran akan ditampilkan di sini</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Checkbox Agreement */}
                <View className="flex-row items-center justify-between my-4">
                  <Text className="text-xs flex-1 mr-2">Saya telah membaca dengan seksama</Text>
                  <Checkbox value={isChecked} onValueChange={setIsChecked} color={isChecked ? "#2181FF" : undefined} />
                </View>

                {/* Total */}
                <View className="flex-row justify-between mt-3 py-2 border-t border-b border-dashed border-gray-300">
                  <Text className="text-xl font-bold">Total</Text>
                  <Text className="text-xl font-bold">{formatRupiah(calculateTotal())}</Text>
                </View>

                {/* Buttons */}
                <View className="bg-transparent my-6">
                  <TouchableOpacity
                    onPress={() => {
                      if (unpaidBills.length === 0) {
                        Alert.alert("Info", "Tidak ada tagihan yang belum dibayar.");
                        return;
                      }
                      router.replace("/(root)/detail-transaksi");
                    }}
                    disabled={!isChecked}
                    style={{ opacity: isChecked ? 1 : 0.5 }}>
                    <LinearGradient colors={["#2181FF", "#004EBA"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="rounded-lg py-3">
                      <Text className="text-white text-base font-semibold text-center">Bayar</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default DetailTagihan;
