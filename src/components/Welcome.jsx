import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { Fab } from "@mui/material";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import LoginIcon from "@mui/icons-material/Login";

export default function Welcome() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="welcome-container">
      <h1>Welcome to the Life Guide App!</h1>
      <div className="container">
        <div className="left">
          <h2>Register</h2>
          <Link component={Link} to="/register" className="custom-link">
            <Fab className="custom-fab">
              <AppRegistrationIcon />
            </Fab>
          </Link>
        </div>
        <div className="right">
          <h2>Sign In</h2>
          <Link
            component={Link}
            to="/login"
            className="custom-link"
            onClick={handleLogin}
          >
            <Fab className="custom-fab">
              <LoginIcon />
            </Fab>
          </Link>
        </div>
      </div>
    </div>
  );
}
