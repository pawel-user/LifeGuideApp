import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { isTokenExpired } from "../utils/token";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function useAuth() {
  const [token, setTokenState] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (
      typeof storedToken === "string" &&
      typeof storedRefreshToken === "string"
    ) {
      setTokenState(storedToken);
      setIsLoggedIn(true);
    }

    setIsAuthInitialized(true); // ✅ oznacz zakończenie inicjalizacji
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (
      typeof storedToken === "string" &&
      typeof storedRefreshToken === "string"
    ) {
      setTokenState(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (newToken, newRefreshToken) => {
    if (
      typeof newToken === "string" &&
      typeof newRefreshToken === "string" &&
      newToken.trim() !== "" &&
      newRefreshToken.trim() !== ""
    ) {
      localStorage.setItem("token", newToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      setTokenState(newToken);
      setIsLoggedIn(true);
    }
  };

  const logout = (navigateTo = null) => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setTokenState("");
    setIsLoggedIn(false);

    if (typeof navigateTo === "function") {
      navigateTo("/");
    }
  };

  const getValidToken = async () => {
    if (!token || typeof token !== "string" || token.trim() === "") {
      // Nie loguj błędu jeśli token jeszcze się ładuje
      return null;
    }
    
    try {
      // decoded może być użyte do pobierania danych użytkownika z tokena
      // const decoded = jwtDecode(token);
      const isExpired = isTokenExpired(token);

      if (!isExpired) return token;

      const refreshToken = localStorage.getItem("refreshToken");

      if (
        !refreshToken ||
        typeof refreshToken !== "string" ||
        refreshToken.trim() === ""
      ) {
        console.error("Invalid refresh token: not a string");
        logout();
        return null;
      }

      const res = await fetch(`${API_URL}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        logout();
        throw new Error("Session expired. Please log in again.");
      }

      const data = await res.json();
      if (typeof data.token === "string" && data.token.trim() !== "") {
        localStorage.setItem("token", data.token);
        setTokenState(data.token);
        return data.token;
      } else {
        console.error("Invalid response token during refresh");
        logout();
        return null;
      }
    } catch (err) {
      console.error("Failed to refresh token:", err);
      logout();
      return null;
    }
  };

  return {
    token,
    setToken: login,
    login,
    logout,
    isLoggedIn,
    setLogin: setIsLoggedIn,
    getValidToken,
    isAuthInitialized,
  };
}
