// hooks/useNotes.js
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export default function useNotes(token, setToken, setLogin) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!token) return;

      try {
        // 🔒 Dekodowanie i weryfikacja tokena
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp < now) {
          console.warn("Token expired");
          setToken("");
          setLogin(false);
          setNotes([]);
          return;
        }

        const response = await axios.get(`${API_URL}/user/notes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setNotes(response.data || []);
        } else {
          console.warn("Unauthorized access or empty notes");
          setToken("");
          setLogin(false);
          setNotes([]);
        }
      } catch (error) {
        console.error("Error fetching notes:", error.message);
        setToken("");
        setLogin(false);
        setNotes([]);
      }
    };

    fetchNotes();
  }, [token, setToken, setLogin]);

  return [notes, setNotes];
}
