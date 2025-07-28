import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RedirectHandler({ logout, setLogin, setToken, showAlert }) {
  const navigate = useNavigate();

  useEffect(() => {
    showAlert("error", "Invalid route — You’ve been logged out");
    setToken(null);
    setLogin(false);
    logout();
    navigate("/", { replace: true });
  }, []);

  return null;
}

export default RedirectHandler;
