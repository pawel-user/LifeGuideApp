// components/Logout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/loggedUsers.js";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Logout({
  setLogin,
  setToken,
  setAlert,
  setContent,
  setNotes
}) {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token, user is already logged out.");
        return;
      }

      await logoutUser(token);

      setLogin(false);
      setToken("");
      setNotes([]);
      setAlert("success", "Logout successful");
      setContent("start");

      // 💾 Wyczyść pamięć
      localStorage.removeItem("notes");
      localStorage.removeItem("token");
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
      <button
        onClick={handleLogout}
        className="logout-button"
      >
        <LogoutIcon />
      </button>
    </h2>
  );
}
