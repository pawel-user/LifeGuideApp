import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Fab } from "@mui/material";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import LoginIcon from "@mui/icons-material/Login";

export default function Welcome({ showAlert }) {
  const location = useLocation();
  const [hasShownAlert, setHasShownAlert] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const logoutSuccess = params.get("logoutSuccess") === "true";

    if (logoutSuccess && !hasShownAlert) {
      showAlert("success", "Logout successful");
      setHasShownAlert(true);

      // 🧹 Remove query param from URL
      window.history.replaceState({}, document.title, "/");
    }
  }, [location.search, showAlert, hasShownAlert]);

  return (
    <div className="welcome-container">
      <h1>Welcome to the Life Guide App!</h1>
      <div className="container">
        <div className="left">
          <h2>Register</h2>
          <Link to="/register" className="custom-link">
            <Fab className="custom-fab">
              <AppRegistrationIcon />
            </Fab>
          </Link>
        </div>
        <div className="right">
          <h2>Sign In</h2>
          <Link to="/login" className="custom-link">
            <Fab className="custom-fab">
              <LoginIcon />
            </Fab>
          </Link>
        </div>
      </div>
    </div>
  );
}
