// hooks/useAuth.js
import { useState, useEffect } from "react";

export default function useAuth() {
  const [token, setTokenState] = useState("");     
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Wczytaj token z localStorage przy uruchomieniu aplikacji
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (typeof storedToken === "string" && storedToken.trim().length > 0) {
      setTokenState(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  // ✅ Funkcja logowania – zapisuje token jako string
  const login = (newToken) => {
    if (typeof newToken === "string") {
      localStorage.setItem("token", newToken);
      setTokenState(newToken);
      setIsLoggedIn(true);
    } else {
      console.error("Invalid token: must be a string");
    }
  };

  // ✅ Funkcja wylogowania – czyści token i status
  const logout = () => {
    localStorage.removeItem("token");
    setTokenState("");
    setIsLoggedIn(false);
  };

  return {
    token,                   
    setToken: login,         
    isLoggedIn,
    setLogin: setIsLoggedIn,
  };
}
