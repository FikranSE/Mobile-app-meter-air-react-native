// lib/services/authService.js - Complete fix
import { api } from "../api";

export async function generateToken() {
  // Clean the credentials from any unwanted characters
  const consId = process.env.EXPO_PUBLIC_WH8_CONS_ID?.replace(/[",]/g, "") || "admin-wh8";
  const secretId = process.env.EXPO_PUBLIC_WH8_SECRET_ID?.replace(/[",]/g, "") || "J0y8ywndY7";

  try {
    console.log("Attempting to generate token with clean credentials:", {
      consId,
      secretId,
    });

    const response = await api.post(
      "/generateToken", // Removed the leading slash to avoid path issues
      {}, // Empty body
      {
        headers: {
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
        url: error.request._url,
        method: error.request._method,
        headers: error.request._headers,
      });
    }

    // Try a fallback approach with direct axios if the api instance fails
    try {
      console.log("Attempting fallback direct axios request");
      const axios = require("axios");
      const directResponse = await axios.post(
        "https://pdampolman.airmurah.id/api/generateToken",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "wh8-cons-id": consId,
            "wh8-secret-id": secretId,
          },
        }
      );
      console.log("Fallback succeeded");
      return directResponse.data.response.access_token;
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError.message);
      throw fallbackError;
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
          "Content-Type": "application/json",
          "wh8-cons-id": process.env.EXPO_PUBLIC_WH8_CONS_ID?.replace(/[",]/g, ""),
          "wh8-secret-id": process.env.EXPO_PUBLIC_WH8_SECRET_ID?.replace(/[",]/g, ""),
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
    console.error("Error registering account:", error);
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
          "Content-Type": "application/json",
          "wh8-cons-id": process.env.EXPO_PUBLIC_WH8_CONS_ID?.replace(/[",]/g, ""),
          "wh8-access-token": accessToken,
          "wh8-user-name": userName,
          "wh8-user-password": userPassword,
        },
      }
    );
    return response.data.response["data-token"];
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}
 