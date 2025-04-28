import axios from "axios"; // Pastikan axios diimpor di sini juga
import { api } from "../api";

export async function generateToken() {
  // Bersihkan credentials
  const consId = process.env.EXPO_PUBLIC_WH8_CONS_ID?.replace(/[",]/g, "") || "admin-wh8";
  const secretId = process.env.EXPO_PUBLIC_WH8_SECRET_ID?.replace(/[",]/g, "") || "J0y8ywndY7";

  try {
    console.log("Attempting to generate token with clean credentials:", {
      consId,
      secretId,
    });

    const response = await api.post(
      "/generateToken",
      {}, // Empty body
      {
        headers: {
          Accept: "application/json text/plain */*",
          "Content-Type": "application/json",
          "wh8-cons-id": consId,
          "wh8-secret-id": secretId,
        },
      }
    );

    console.log("Token response received");
    return response.data.response.access_token;
  } catch (error) {
    console.error("Error generating token:", error.message);

    if (error.request) {
      console.error("Request details:", {
        url: error.config?.url || "Unknown URL",
        method: error.config?.method || "Unknown method",
        headers: error.config?.headers || "Unknown headers",
      });
    }

    // Perbaikan implementasi fallback
    try {
      console.log("Attempting fallback direct axios request");
      const fallbackResponse = await axios({
        method: "post",
        url: "https://pdampolman.airmurah.id/api/generateToken",
        headers: {
          Accept: "application/json text/plain */*",
          "Content-Type": "application/json",
          "wh8-cons-id": consId,
          "wh8-secret-id": secretId,
        },
        timeout: 20000,
      });

      console.log("Fallback succeeded");
      return fallbackResponse.data.response.access_token;
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError.message);
      // Tambahkan detail error untuk debugging
      if (fallbackError.response) {
        console.error("Fallback response error:", fallbackError.response.data);
      } else if (fallbackError.request) {
        console.error("Fallback request error:", fallbackError.request);
      }
      throw new Error(`Failed to generate token: ${fallbackError.message}`);
    }
  }
}

export async function registerAccount(accessToken, userData) {
  try {
    const response = await api.post(
      "/registerAccount",
      {}, // Empty body
      {
        headers: {
          Accept: "application/json text/plain */*",
          "Content-Type": "application/json",
          "wh8-cons-id": process.env.EXPO_PUBLIC_WH8_CONS_ID?.replace(/[",]/g, "") || "admin-wh8",
          "wh8-secret-id": process.env.EXPO_PUBLIC_WH8_SECRET_ID?.replace(/[",]/g, "") || "J0y8ywndY7",
          "wh8-access-token": accessToken,
          "wh8-user-name": userData.username,
          "wh8-user-full-name": userData.name,
          "wh8-user-email": userData.email,
          "wh8-user-contact": userData.contact,
          "wh8-user-password": userData.password,
        },
      }
    );
    return response.data.metadata.message;
  } catch (error) {
    console.error("Error registering account:", error.message);
    if (error.response) {
      console.error("Registration response error:", error.response.data);
    }
    throw error;
  }
}

export async function loginAccount(accessToken, userName, userPassword) {
  try {
    const response = await api.post(
      "/loginAccount",
      {}, // Empty body
      {
        headers: {
          Accept: "application/json text/plain */*",
          "Content-Type": "application/json",
          "wh8-cons-id": process.env.EXPO_PUBLIC_WH8_CONS_ID?.replace(/[",]/g, "") || "admin-wh8",
          "wh8-secret-id": process.env.EXPO_PUBLIC_WH8_SECRET_ID?.replace(/[",]/g, "") || "J0y8ywndY7",
          "wh8-access-token": accessToken,
          "wh8-user-name": userName,
          "wh8-user-password": userPassword,
        },
      }
    );
    return response.data.response["data-token"];
  } catch (error) {
    console.error("Error logging in:", error.message);
    if (error.response) {
      console.error("Login response error:", error.response.data);
    }
    throw error;
  }
}
