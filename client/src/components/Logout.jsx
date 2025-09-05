// components/Logout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/loggedUsers.js";
import LogoutIcon from "@mui/icons-material/Logout";
import useAuth from "../hooks/useAuth";

export default function Logout({ setNotes }) {
  const { logout, setLogin } = useAuth();
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

      logout();
      setLogin(false);
      setNotes([]);
      localStorage.removeItem("notes");
      localStorage.removeItem("userData");
      sessionStorage.clear();

      // ✅ Redirect to Welcome with logout success flag
      window.location.href = "/?logoutSuccess=true";
    } catch (error) {
      console.error("Error during logout:", error);
      navigate("/", { state: { logoutSuccess: false } });
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
