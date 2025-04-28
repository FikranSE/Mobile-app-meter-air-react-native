import axios from "axios";

// Perbaikan baseURL - Gunakan URL hardcoded jika env tidak ada
const baseURL = process.env.EXPO_PUBLIC_WH8_API_BASE_URL?.replace(/[",]/g, "") || "https://pdampolman.airmurah.id/api";

export const api = axios.create({
  baseURL: baseURL,
  timeout: 15000, // Memperpanjang timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json text/plain */*",
  },
});

// Perbaikan interceptor request
api.interceptors.request.use(
  (config) => {
    // Perbaikan URL jika diperlukan
    if (config.url && config.url.includes(",")) {
      config.url = config.url.replace(/,/g, "/");
    }

    // Hapus quote dari URL
    if (config.url) {
      config.url = config.url.replace(/['"]/g, "");
    }

    // Pastikan URL dimulai dengan / jika perlu
    if (config.url && !config.url.startsWith("/") && !config.url.startsWith("http")) {
      config.url = `/${config.url}`;
    }

    // Bersihkan headers
    if (config.headers) {
      Object.keys(config.headers).forEach((key) => {
        if (typeof config.headers[key] === "string") {
          config.headers[key] = config.headers[key].replace(/[",]/g, "");
        }
      });
    }

    console.log("Clean Request:", {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      headers: config.headers,
    });

    return config;
  },
  (error) => {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// Perbaikan interceptor response
api.interceptors.response.use(
  (response) => {
    console.log("API Response received:", response.status);
    return response;
  },
  (error) => {
    console.error("API Error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    } else if (error.request) {
      console.error("No response received:", error.request);
      console.error("Request URL:", error.config?.url);
    }
    return Promise.reject(error);
  }
);
