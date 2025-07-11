// hooks/useAlerts.js
import { useState, useEffect, useRef } from "react";

export default function useAlerts() {
  const [alert, setAlert] = useState({ type: "", message: "", visible: false });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  useEffect(() => {
    if (alert.visible) {
      setTimeout(() => {
        if (mounted.current) {
          setAlert((prev) => ({ ...prev, visible: false }));
        }
      }, 2000);
    }
  }, [alert]);

  const showAlert = (type, message) => {
    setAlert({ type, message, visible: true });
  };

  return { alert, showAlert };
}
