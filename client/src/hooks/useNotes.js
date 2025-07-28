import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export default function useNotes(token, isLoggedIn, getValidToken, logout) {
  const [notes, setNotes] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    setHasFetched(false);
  }, [token, isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn || !token || hasFetched) return;

    const fetchNotes = async () => {
      try {
        const validToken = await getValidToken();
        if (!validToken) return;

        const response = await axios.get(`${API_URL}/user/notes`, {
          headers: {
            Authorization: `Bearer ${validToken}`,
          },
        });

        if (response.status === 200) {
          const transformed = response.data.map((note) => ({
            id: note.id,
            noteTitle: note.notetitle,
            description: note.description,
          }));

          setNotes(transformed);
        } else {
          setNotes([]);
          logout();
        }
      } catch (error) {
        console.error("Error fetching notes:", error.message);
        setNotes([]);
        logout();
      } finally {
        setHasFetched(true);
      }
    };

    fetchNotes();
  }, [isLoggedIn, token, logout]);

  return [notes, setNotes];
}
