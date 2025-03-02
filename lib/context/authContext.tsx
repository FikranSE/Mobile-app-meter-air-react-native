// lib/context/authContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { generateToken, loginAccount } from "@/lib/services/authService";

interface AuthContextType {
  token: string | null;
  userToken: string | null;
  isLoading: boolean;
  login: (userName: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        setIsLoading(true);
        const newToken = await generateToken();
        console.log("Token generated successfully:", newToken);
        setToken(newToken);
      } catch (error) {
        console.error("Failed to generate token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, []);

  const login = async (userName: string, password: string) => {
    if (!token) {
      throw new Error("No access token available");
    }

    try {
      setIsLoading(true);
      const dataToken = await loginAccount(token, userName, password);
      setUserToken(dataToken);
      console.log("Login successful");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUserToken(null);
  };

  return <AuthContext.Provider value={{ token, userToken, isLoading, login, logout }}>{children}</AuthContext.Provider>;
};
