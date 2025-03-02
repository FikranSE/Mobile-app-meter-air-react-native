// components/NetworkDebugger.js
// Add this component to your app temporarily to debug network issues
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";

export const NetworkDebugger = () => {
  const [netInfo, setNetInfo] = useState(null);
  const [apiTest, setApiTest] = useState({ status: "pending", result: null });

  useEffect(() => {
    // Get network info
    NetInfo.fetch().then((state) => {
      setNetInfo(state);
    });

    // Test API connection
    const testApi = async () => {
      try {
        setApiTest({ status: "testing", result: null });

        // Direct fetch test to check if the API is reachable
        const response = await fetch("https://pdampolman.airmurah.id/api/ping", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const text = await response.text();
        setApiTest({
          status: "complete",
          result: {
            status: response.status,
            statusText: response.statusText,
            text: text.substring(0, 100), // Limit text size
          },
        });
      } catch (error) {
        setApiTest({
          status: "error",
          result: error.message,
        });
      }
    };

    testApi();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Network Debugger</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Network Status</Text>
        {netInfo ? (
          <>
            <Text>Type: {netInfo.type}</Text>
            <Text>Connected: {netInfo.isConnected ? "Yes" : "No"}</Text>
            <Text>WiFi: {netInfo.isWifiEnabled ? "Enabled" : "Disabled"}</Text>
            {netInfo.details && (
              <>
                <Text>IP Address: {netInfo.details.ipAddress || "Unknown"}</Text>
                <Text>Signal Strength: {netInfo.details.strength || "Unknown"}</Text>
              </>
            )}
          </>
        ) : (
          <Text>Loading network info...</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Connection Test</Text>
        {apiTest.status === "pending" && <Text>Pending...</Text>}
        {apiTest.status === "testing" && <Text>Testing connection...</Text>}
        {apiTest.status === "complete" && (
          <>
            <Text>Status: {apiTest.result.status}</Text>
            <Text>Status Text: {apiTest.result.statusText || "N/A"}</Text>
            <Text>Response: {apiTest.result.text || "Empty"}</Text>
          </>
        )}
        {apiTest.status === "error" && <Text style={styles.error}>Error: {apiTest.result}</Text>}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  section: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  error: {
    color: "red",
  },
});
