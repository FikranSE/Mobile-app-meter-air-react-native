// lib/api.js - Completely fixed version
import axios from "axios";

// Fix the baseURL format - this is critical!
const baseURL = process.env.EXPO_PUBLIC_WH8_API_BASE_URL?.replace(/[",]/g, "");

export const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Completely redesigned request interceptor
api.interceptors.request.use(
  (config) => {
    // Fix the URL construction
    if (config.url && config.url.includes(",")) {
      config.url = config.url.replace(",", "/");
    }

    // Fix quote issues in URL
    if (config.url) {
      config.url = config.url.replace(/['"]/g, "");
    }

    // Fix headers
    if (config.headers) {
      // Ensure headers don't have commas or quotes
      Object.keys(config.headers).forEach((key) => {
        if (typeof config.headers[key] === "string") {
          config.headers[key] = config.headers[key].replace(/[",]/g, "");
        }
      });
    }

    console.log("Clean Request:", {
      url: `${config.baseURL}${config.url}`,
      headers: config.headers,
    });

    return config;
  },
  (error) => {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    } else if (error.request) {
      console.error("No response received:", error.request);
      console.error("Request URL:", error.request._url);
    }
    return Promise.reject(error);
  }
);
