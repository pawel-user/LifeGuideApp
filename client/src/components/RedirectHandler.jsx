import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RedirectHandler({ logout, setLogin, setToken, setContent }) {
  const navigate = useNavigate();

  useEffect(() => {
    logout(navigate);
    setLogin(false);
    setToken(null);
    setContent("start");
  }, [logout, setLogin, setToken, setContent, navigate]);
  
  return null;
}

export default RedirectHandler;