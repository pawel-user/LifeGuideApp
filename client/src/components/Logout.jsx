// components/Logout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/loggedUsers.js";
import LogoutIcon from "@mui/icons-material/Logout";
import useAuth from "../hooks/useAuth";

export default function Logout({ setAlert, setContent, setNotes }) {
  const navigate = useNavigate();
  const { logout, setLogin } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token, user is already logged out.");
        return;
      }

      await logoutUser(token); 
      
      logout();
      setLogin(false);
      setNotes([]);
      setAlert("success", "Logout successful");
      setContent("start");

      // 💾 Wyczyść lokalne dane
      localStorage.removeItem("notes");
      localStorage.removeItem("userData");
      sessionStorage.clear();

      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      setAlert("error", "Logout failed. Please try again.");
    }
  };

  return (
    <h2>
      <button onClick={handleLogout} className="logout-button">
        <LogoutIcon />
      </button>
    </h2>
  );
}
