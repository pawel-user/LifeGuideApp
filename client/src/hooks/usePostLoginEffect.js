import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function usePostLoginEffect({ isLoggedIn, token, setEditingStates }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && token) {
      setEditingStates({ type: null, note: null });
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isLoggedIn, token]);
}
