import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/loggedUsers.js";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Logout(props) {
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
      props.setLogin(false);
      props.setToken("");
      props.setIsEditing(false);
      props.setNoteToEdit(null);
      props.setAlert("success", "Logout successful");
      props.setContent("start");
      props.setNotes([]);
      localStorage.removeItem("notes");
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      sessionStorage.clear();
      navigate("/");      
    } catch (error) {
      console.error("Error during logout:", error);
      props.setAlert("error", "Logout failed. Please try again.");
    }
  };

  return (
    <h2>
      <button
        variant="contained"
        onClick={handleLogout}
        className="logout-button"
      >
        <LogoutIcon />
      </button>
    </h2>
  );
}
