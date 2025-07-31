import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RedirectHandler({ logout, setLogin, setToken, showAlert }) {
  const navigate = useNavigate();

  useEffect(() => {
    logout(navigate); // ⬅️ przekierowanie po wylogowaniu
    setLogin(false);
    setToken(null);
  }, [logout, setLogin, setToken, navigate]);

  return null;
}

export default RedirectHandler;